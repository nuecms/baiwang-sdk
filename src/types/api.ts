/**
 * API响应基础接口
 */
export interface ApiResponse<T = any> {
  /** 业务是否成功 */
  success: boolean;
  
  /** 错误信息 */
  errorResponse?: {
    /** 错误代码 */
    code: number;
    /** 错误消息 */
    msg: string;
  };
  
  /** 响应数据 */
  response?: T;
  
  /** 返回码 */
  code?: string;
  
  /** 返回消息 */
  msg?: string;
  
  /** 返回数据 */
  data?: T;
}

/**
 * API请求基础接口
 */
export interface ApiRequest {
  /** 税号 */
  taxNo?: string;
  
  /** 税务ID */
  taxId?: string;
  
  /** 业务数据 */
  data?: Record<string, any>;
  
  [key: string]: any;
}
