import { ApiRequest, ApiResponse } from './api';

/**
 * 已开发票查询请求
 */
export interface InvoiceQueryRequest extends ApiRequest {
  /** 税号 */
  taxNo: string;
  
  /** 查询参数 */
  data: {
    /** 发票代码 */
    invoiceCode?: string;
    
    /** 发票号码 */
    invoiceNo?: string;
    
    /** 开票日期开始 */
    invoiceDateStart?: string;
    
    /** 开票日期结束 */
    invoiceDateEnd?: string;
    
    /** 购方名称 */
    buyerName?: string;
    
    /** 购方税号 */
    buyerTaxNo?: string;
    
    /** 分页页码 */
    pageNum?: number;
    
    /** 分页大小 */
    pageSize?: number;
    
    [key: string]: any;
  };
}

/**
 * 已开发票查询响应数据
 */
export type InvoiceQueryResponseData = {
  /** 总记录数 */
  total: number;
  
  /** 发票列表 */
  list: Array<{
    /** 发票代码 */
    invoiceCode: string;
    
    /** 发票号码 */
    invoiceNo: string;
    
    /** 开票日期 */
    invoiceDate: string;
    
    /** 发票类型 */
    invoiceType: string;
    
    /** Pdf路径 */
    pdfUrl?: string;
    
    /** 购方名称 */
    buyerName: string;
    
    /** 购方税号 */
    buyerTaxNo: string;
    
    /** 金额 */
    amount: number;
    
    /** 税额 */
    tax: number;
    
    /** 价税合计 */
    totalAmount: number;
    
    [key: string]: any;
  }>;
};

/**
 * 已开发票查询响应
 */
export type InvoiceQueryResponse = ApiResponse<InvoiceQueryResponseData>;
