/**
 * Baiwang API Method Constants
 */
export const Method = {
  /**
   * 获取token
   */
  AUTH: "baiwang.oauth.token",
  
  /**
   * 发票 红冲
   */
  INVOICING: "baiwang.output.invoice.issue",
  
  /**
   * 已开发票查询
   */
  INVOICE_QUERY: "baiwang.output.invoice.query",
  
  /**
   * 版式查询
   */
  LAYOUT_QUERY: "baiwang.output.format.query",
  
  /**
   * 云抬头
   */
  CLOUD_HEAD_UP: "baiwang.bizinfo.companySearch",
  
  /**
   * 预制发票开具
   */
  PRE_INVOICE: "baiwang.output.preinvoice.issue",
  
  /**
   * 已开发票作废
   */
  VOID_INVOICED: "baiwang.output.invoice.cancel",
  
  /**
   * 全电红字确认单开具
   */
  RED_LETTER_ISSUANCE: "baiwang.output.redinvoice.issued"
} as const;
