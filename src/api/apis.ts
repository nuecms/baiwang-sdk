import type { BaiwangSDK, BaiwangConfig } from '../index';
import { Method } from '../enums/method';

// 导入各种API类型
import type { 
  GetTokenRequest, GetTokenResponse,
  RefreshTokenRequest, RefreshTokenResponse
} from '../types/token';
import type { InvoicingRequest, InvoicingResponse } from '../types/invoicing';
import type { InvoiceQueryRequest, InvoiceQueryResponse } from '../types/invoice_query';
import type { LayoutQueryRequest, LayoutQueryResponse } from '../types/layout_query';
import type { CloudHeadUpRequest, CloudHeadUpResponse } from '../types/cloud_head_up';
import type { PreInvoiceRequest, PreInvoiceResponse } from '../types/pre_invoicing';
import type { VoidInvoicedRequest, VoidInvoicedResponse } from '../types/void_invoiced';
import type { RedLetterRequest, RedLetterResponse } from '../types/allElectric/issuance_of_red_letter';

/**
 * 百望云SDK所有API接口注册
 * 将所有API集中在一个文件中方便管理
 */
export default function registerAllApis(sdk: BaiwangSDK): void {
  // 通用参数处理函数
  const handleParams = <T>(params: any): T => {
    // 如果是函数，先执行获取参数
    if (typeof params === 'function') {
      return params(sdk.config as BaiwangConfig);
    }
    return params || {} as T;
  };

  // 定义API注册函数
  const registerApi = <TReq, TRes>(name: string, method: string) => {
    sdk.rx<TReq, TRes>(name, (_config, params) => 
      sdk.exec<TRes>(method, handleParams<TReq>(params))
    );
  };

  // =========== 认证相关 ===========
  
  /**
   * 获取token
   * @param params 可选参数，不填默认使用配置值
   */
  sdk.rx<GetTokenRequest, GetTokenResponse>('getToken', (_config, params) => {
    let requestParams: GetTokenRequest;
    
    if (typeof params === 'function') {
      requestParams = params(sdk.config as BaiwangConfig);
    } else if (!params) {
      requestParams = {
        username: sdk.config.username,
        client_secret: sdk.config.appSecret,
        password: sdk.config.password,
      };
    } else {
      requestParams = params;
    }
    
    return sdk.exec<GetTokenResponse>(Method.AUTH, requestParams);
  });
  
  /**
   * 刷新token
   * @param params 可选参数，不填默认使用上次token的refresh_token
   */
  sdk.rx<RefreshTokenRequest, RefreshTokenResponse>('refreshToken', (_config, params) => {
    let requestParams: RefreshTokenRequest;
    
    if (typeof params === 'function') {
      requestParams = params(sdk.config as BaiwangConfig);
    } else if (!params) {
      requestParams = {
        client_secret: sdk.config.appSecret,
        refresh_token: sdk.config._refreshTokenCache,
      };
    } else {
      requestParams = params;
    }
    
    return sdk.exec<RefreshTokenResponse>(Method.AUTH, requestParams);
  });

  // =========== 发票相关 ===========
  
  // 发票开具/红冲
  registerApi<InvoicingRequest, InvoicingResponse>('invoicing', Method.INVOICING);
  
  // 已开发票查询
  registerApi<InvoiceQueryRequest, InvoiceQueryResponse>('queryInvoice', Method.INVOICE_QUERY);
  
  // 查询发票版式
  registerApi<LayoutQueryRequest, LayoutQueryResponse>('queryLayout', Method.LAYOUT_QUERY);
  
  // 云抬头查询
  registerApi<CloudHeadUpRequest, CloudHeadUpResponse>('queryCloudHeadUp', Method.CLOUD_HEAD_UP);
  
  // 预制发票开具
  registerApi<PreInvoiceRequest, PreInvoiceResponse>('preInvoice', Method.PRE_INVOICE);
  
  // 已开发票作废
  registerApi<VoidInvoicedRequest, VoidInvoicedResponse>('voidInvoiced', Method.VOID_INVOICED);
  
  // 全电红字确认单开具
  registerApi<RedLetterRequest, RedLetterResponse>('issueRedLetter', Method.RED_LETTER_ISSUANCE);
}
