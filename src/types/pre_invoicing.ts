import { ApiRequest, ApiResponse } from './api';

/**
 * 预制发票开具请求
 */
export interface PreInvoiceRequest extends ApiRequest {
  /** 税号 */
  taxNo: string;
  
  /** 开票终端编码 */
  invoiceTerminalCode?: string;
  
  /** 数据 */
  data: {
    /** 发票类型 */
    invoiceTypeCode: string;
    
    /** 发票明细列表 */
    invoiceDetailsList: Array<{
      /** 商品名称 */
      goodsName: string;
      
      /** 规格型号 */
      goodsSpecification?: string;
      
      /** 单位 */
      goodsUnit?: string;
      
      /** 数量 */
      goodsQuantity: number;
      
      /** 单价 */
      goodsPrice: number;
      
      /** 金额 */
      goodsTotalPrice: number;
      
      /** 税率 */
      goodsTaxRate: number;
      
      /** 税额 */
      goodsTotalTax: number;
      
      [key: string]: any;
    }>;
    
    [key: string]: any;
  };
}

/**
 * 预制发票开具响应数据
 */
export type PreInvoiceResponseData = {
  /** 预制发票ID */
  preInvoiceId: string;
  
  /** 发票代码 */
  invoiceCode?: string;
  
  /** 发票号码 */
  invoiceNo?: string;
  
  /** 创建时间 */
  createTime: string;
  
  /** 状态 */
  status: string;
};

/**
 * 预制发票开具响应
 */
export type PreInvoiceResponse = ApiResponse<PreInvoiceResponseData>;
