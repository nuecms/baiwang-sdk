import { sdkBuilder, type SdkBuilderConfig, type FetchContext, RedisCacheProvider, type CacheProvider } from '@nuecms/sdk-builder';
import { debuglog } from 'util';
import { signTopRequest } from './utils/sign';
import { sha1, md5 } from './utils/hash';

const debug = debuglog('baiwang-sdk');

import { Env } from './enums/env';
import { Config } from './enums/config';
import { Method } from './enums/method';
import registerAllApis from './api/index';

// Export types and utilities
export {
  RedisCacheProvider,
  type CacheProvider,
  Env,
  Method
};

/**
 * 百望云SDK配置参数
 */
export interface BaiwangSDKConfig {
  /** 用户名 */
  username: string;
  
  /** 密码 */
  password: string;
  
  /** 应用Key */
  appKey: string;
  
  /** 应用Secret */
  appSecret: string;
  
  /** 签名密钥 */
  secret: string;
  
  /** 销售账号 */
  salesAccount: string;
  
  /** 销售密码 */
  salesPassword: string;
  
  /** 输出税号 */
  outputTaxNumber: string;
  
  /** 开票点 */
  invoicingPoint: string;
  
  /** 环境（默认test） */
  env?: 'test' | 'prod';
  
  /** 是否自动刷新token */
  autoSign?: boolean;
  
  /** 自定义缓存提供器 */
  cacheProvider?: CacheProvider;
  
  /** 请求超时时间 */
  timeout?: number;
  
  /** 最大重试次数 */
  maxRetries?: number;
}

// Internal config with defaults
export type BaiwangConfig = BaiwangSDKConfig & {
  _refreshTokenCache?: string;
  endpoint: string;
  timeout: number;
  autoSign: boolean;
};

// Define SDK return type
export type BaiwangSDK = ReturnType<typeof sdkBuilder>;

// Custom response transformer for Baiwang API
const customResponseTransformer = (responseData: any, context: FetchContext, response: Response) => {
  debug('Response transformer:', responseData);
  
  // Handle specific Baiwang response format
  if (responseData && typeof responseData === 'object') {
    if (responseData.code !== undefined && responseData.code !== '0000') {
      const error = new Error(responseData.msg || 'Baiwang API error');
      (error as any).response = responseData;
      throw error;
    }
    return responseData.data || responseData;
  }
  
  return responseData;
};

// Request transformer to add method to request body
const requestTransformer = (options: any, requestInfo: any) => {
  if (requestInfo.method) {
    if (!options.body) {
      options.body = {};
    }
    
    if (typeof options.body === 'object') {
      options.body.method = requestInfo.method;
    }
  }
  
  return options;
};

/**
 * Create a new Baiwang SDK instance
 */
export function createInvoice(config: BaiwangSDKConfig): BaiwangSDK {
  const env = config.env === 'prod' ? 'prod' : 'sandbox';
  const endpoint = Config.ENDPOINTS[env];
  const timeout = config.timeout || 10000;
  
  const sdkConfig: SdkBuilderConfig = {
    baseUrl: endpoint,
    cacheProvider: config.cacheProvider,
    placeholders: {
      access_token: '{access_token}',
    },
    maxRetries: config.maxRetries ?? 0,
    timeout: timeout,
    config: {
      ...config,
      endpoint,
      timeout,
      autoSign: config.autoSign ?? false,
      env,
    } as BaiwangConfig,
    customResponseTransformer: customResponseTransformer,
    customRequestTransformer: requestTransformer,
    authCheckStatus: (status, response) => {
      return status === 401 || (response && response.code === '1006');
    },
    validateStatus: (status: number) => {
      return status >= 200 && status < 500;
    }
  };
  
  const sdk: BaiwangSDK = sdkBuilder(sdkConfig);

  // 通用请求执行方法
  sdk.rx('exec', async (config, method: string, params: Record<string, any> = {}, options: Record<string, any> = {}) => {
    // 提取业务内容（如果有）
    const bizContent = params.data;
    
    // 创建请求基础参数
    const baseParams = {
      method, // 百望API接口方法
      token: config.access_token || '',
      format: 'json',
      type: 'sync',
      timestamp: Date.now() + '',
      appKey: config.appKey,
      version: '6.0',
    };
    
    // 移除特殊参数，准备签名
    const { data, taxNo, taxId, ...otherParams } = params;
    
    // 合并参数
    const requestParams = {
      ...baseParams,
      ...otherParams,
      orgId: config.orgId || taxNo || taxId,
    };
    
    // 生成签名
    const sign = signTopRequest(requestParams, config.appSecret, bizContent);
    requestParams.sign = sign;
    
    // 如果有业务内容，添加到请求中
    if (bizContent) {
      requestParams.data = bizContent;
    }
    
    // 构建请求选项
    const requestOptions = {
      body: requestParams,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {})
      },
      ...options
    };
    
    try {
      debug('Sending request to Baiwang API:', method, requestParams);
      let response = await sdk.post('', requestOptions);
      debug('Received response from Baiwang API:', response);
      
      // 判断是否需要自动刷新token并重试
      if (config.autoSign && 
          response.success === false && 
          (response.errorResponse?.code === 100001 || response.errorResponse?.code === 100002)) {
        
        debug('Token expired, auto refreshing...');
        
        // 获取新token
        const tokenResponse = await sdk.post('', {
          body: {
            method: Method.AUTH,
            username: config.username,
            password: sha1(md5(config.password + config.secret)),
            client_secret: config.appSecret,
            ...otherParams
          }
        });
        
        if (tokenResponse.success) {
          // 更新token
          sdk.enhanceConfig({ 
            access_token: tokenResponse.response.access_token,
            _refreshTokenCache: tokenResponse.response.refresh_token 
          });
          
          // 使用新token重试请求
          requestParams.token = tokenResponse.response.access_token;
          requestParams.sign = signTopRequest(requestParams, config.appSecret, bizContent);
          
          if (bizContent) {
            requestParams.data = bizContent;
          }
          
          // 重新发送请求
          debug('Retrying request with new token');
          response = await sdk.post('', {
            body: requestParams,
            headers: requestOptions.headers,
            ...options
          });
          debug('Received response after token refresh:', response);
        }
      }
      
      return response;
    } catch (error) {
      debug('Error in Baiwang API request:', error);
      throw error;
    }
  });

  // Authentication request
  sdk.rx('authenticate', async (config) => {
    const cacheKey = `baiwang_access_token_${config.appKey}`;
    
    // 尝试从缓存获取token
    const cached = await sdk.cacheProvider?.get(cacheKey);
    if (cached?.value) {
      sdk.enhanceConfig({ 
        access_token: cached.value.access_token,
        _refreshTokenCache: cached.value.refresh_token 
      });
      return cached.value;
    }
    
    // 请求新token
    const response: any = await sdk.exec(Method.AUTH, {
      username: config.username,
      password: config.password,
      client_secret: config.appSecret,
    });
    
    // 缓存token
    const expiresIn = response.expires_in || 7200;
    await sdk.cacheProvider?.set(cacheKey, response, 'json', expiresIn);
    
    // 更新配置
    sdk.enhanceConfig({ 
      access_token: response.access_token,
      _refreshTokenCache: response.refresh_token 
    });
    
    return {
      access_token: response.access_token,
      refresh_token: response.refresh_token
    };
  });

  // Request interceptor
  sdk.rx('reqInterceptor', async (config: Record<string, any>, options: any = {}) => {
    options.headers = {
      ...options.headers,
      'Content-Type': 'application/json',
      'Authorization': config.access_token ? `Bearer ${config.access_token}` : undefined,
    };
    
    return options;
  });

  // Register all API endpoints
  registerAllApis(sdk);
  
  return sdk;
}

// Default export
export default createInvoice;