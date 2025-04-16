import { Env } from '../enums/env';

/**
 * SDK Configuration
 */
export interface SDKConfig {
  /** Application key */
  appKey: string;
  
  /** Application secret */
  appSecret: string;
  
  /** Organization ID */
  orgId: string;
  
  /** Environment (production, sandbox) */
  env?: Env;
  
  /** Custom API endpoint (overrides env) */
  endpoint?: string;
  
  /** Request timeout in milliseconds */
  timeout?: number;
}

/**
 * Internal configuration with defaults applied
 */
export interface InternalConfig extends SDKConfig {
  /** Environment (production, sandbox) */
  env: Env;
  
  /** Request timeout in milliseconds */
  timeout: number;
  
  /** API endpoint URL */
  endpoint: string;
}

/**
 * 配置项
 */
export interface Config {
  /**
   * 应用Key
   */
  appKey: string;
  
  /**
   * 应用Secret
   */
  appSecret: string;
  
  /**
   * 用户名
   */
  username: string;
  
  /**
   * 密码
   */
  password: string;
  
  /**
   * 密钥
   */
  secret: string;
  
  /**
   * 组织ID
   */
  orgId?: string;
  
  /**
   * 输出税号
   */
  outputTaxNumber: string;
  
  /**
   * 环境
   */
  env?: string;
  
  /**
   * 是否自动签名
   */
  autoSign?: boolean;
}
