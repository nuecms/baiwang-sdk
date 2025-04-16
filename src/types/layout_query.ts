import { ApiRequest, ApiResponse } from './api';

/**
 * 版式查询请求
 */
export interface LayoutQueryRequest extends ApiRequest {
  /** 税号 */
  taxNo: string;
  
  /** 查询参数 */
  data: {
    /** 发票代码 */
    invoiceCode: string;
    
    /** 发票号码 */
    invoiceNo: string;
    
    /** 返回类型，1-PDF，2-OFD，3-图片 */
    returnType: string;
    
    /** 附加参数 */
    by1?: string;
    
    [key: string]: any;
  };
}

/**
 * 版式查询响应数据
 */
export type LayoutQueryResponseData = {
  /** 文件内容（Base64编码） */
  content: string;
  
  /** 文件名 */
  fileName?: string;
  
  /** 文件类型 */
  fileType?: string;
};

/**
 * 版式查询响应
 */
export type LayoutQueryResponse = ApiResponse<LayoutQueryResponseData>;
