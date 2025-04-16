import { ApiRequest, ApiResponse } from '../api';

/**
 * 全电红字确认单开具请求
 */
export interface RedLetterRequest extends ApiRequest {
  /** 税号 */
  taxNo: string;
  
  /** 开票终端编码 */
  invoiceTerminalCode?: string;
  
  /** 数据 */
  data: {
    /** 原发票代码 */
    originalInvoiceCode: string;
    
    /** 原发票号码 */
    originalInvoiceNo: string;
    
    /** 销方税号 */
    sellerTaxNo: string;
    
    /** 购方税号 */
    buyerTaxNo: string;
    
    /** 红字信息表明细 */
    redDetailList: Array<{
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
    
    /** 红字原因 */
    redReason?: string;
    
    [key: string]: any;
  };
}

/**
 * 全电红字确认单响应数据
 */
export type RedLetterResponseData = {
  /** 红字信息表编号 */
  redLetterNo: string;
  
  /** 创建时间 */
  createTime: string;
  
  /** 状态 */
  status: string;
};

/**
 * 全电红字确认单响应
 */
export type RedLetterResponse = ApiResponse<RedLetterResponseData>;
