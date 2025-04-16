import { ApiRequest, ApiResponse } from './api';

/**
 * 已开发票作废请求
 */
export interface VoidInvoicedRequest extends ApiRequest {
  /**
   * 销方机构税号
   */
  taxNo: string;
  
  /**
   * 开票点编码，只有一个终端可不填，多个终端随机获取，可能获取到非作废发票得终端
   */
  invoiceTerminalCode: string;
  
  data: {
    /**
     * 发票代码
     */
    invoiceCode: string;
    
    /**
     * 发票号码
     */
    invoiceNo: string;
    
    /**
     * 作废人
     */
    invoiceInvalidOperator: string;
  };
}

/**
 * 已开发票作废响应数据
 */
export type VoidInvoicedResponseData = Pick<VoidInvoicedRequest['data'], 'invoiceCode' | 'invoiceNo'> & {
  /**
   * 作废日期
   * yyyyMMddhhmmss
   */
  invalidDate: string;
};

/**
 * 已开发票作废响应
 */
export type VoidInvoicedResponse = ApiResponse<VoidInvoicedResponseData>;
