import { ApiRequest, ApiResponse } from './api';

/**
 * 云抬头查询请求
 */
export interface CloudHeadUpRequest extends ApiRequest {
  /** 税号 */
  taxId: string;
  
  /** 企业名称 */
  companyName: string;
  
  /** 是否精确查询 */
  accuracy?: boolean;
  
  /** 排序 */
  sort?: {
    /** 使用频率排序 1-升序，-1-降序 */
    frequency?: number;
  };
}

/**
 * 云抬头查询响应数据
 */
export type CloudHeadUpResponseData = {
  /** 企业信息列表 */
  list: Array<{
    /** 企业名称 */
    name: string;
    
    /** 税号 */
    taxNo: string;
    
    /** 地址 */
    address?: string;
    
    /** 电话 */
    phone?: string;
    
    /** 开户行 */
    bankName?: string;
    
    /** 账号 */
    bankAccount?: string;
  }>;
};

/**
 * 云抬头查询响应
 */
export type CloudHeadUpResponse = ApiResponse<CloudHeadUpResponseData>;
