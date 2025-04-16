import { ApiResponse } from './api';

/**
 * 获取token请求参数
 */
export interface GetTokenRequest {
  /** 用户名 */
  username: string;
  
  /** 密码 */
  password: string;
  
  /** 客户端密钥 */
  client_secret: string;
  
  [key: string]: any;
}

/**
 * 获取token响应数据
 */
export type GetTokenResponseData = {
  /** 访问令牌 */
  access_token: string;
  
  /** 刷新令牌 */
  refresh_token: string;
  
  /** 令牌类型 */
  token_type: string;
  
  /** 过期时间(秒) */
  expires_in: number;
};

/**
 * 获取token响应
 */
export type GetTokenResponse = ApiResponse<GetTokenResponseData>;

/**
 * 刷新token请求参数
 */
export interface RefreshTokenRequest {
  /** 客户端密钥 */
  client_secret: string;
  
  /** 刷新令牌 */
  refresh_token: string;
  
  [key: string]: any;
}

/**
 * 刷新token响应数据
 */
export type RefreshTokenResponseData = {
  /** 访问令牌 */
  access_token: string;
  
  /** 刷新令牌 */
  refresh_token: string;
  
  /** 令牌类型 */
  token_type: string;
  
  /** 过期时间(秒) */
  expires_in: number;
};

/**
 * 刷新token响应
 */
export type RefreshTokenResponse = ApiResponse<RefreshTokenResponseData>;
