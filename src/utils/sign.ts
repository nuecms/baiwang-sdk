import CryptoJS from 'crypto-js';
import { md5 } from './hash';

/**
 * Generate signature for request
 * 
 * @param params Request parameters
 * @param appSecret Application secret
 * @returns Signature
 */
export function sign(params: Record<string, any>, appSecret: string): string {
  // Sort parameters alphabetically
  const sortedKeys = Object.keys(params).sort();
  
  // Create string to sign
  let stringToSign = '';
  for (const key of sortedKeys) {
    if (params[key] !== undefined && params[key] !== null) {
      stringToSign += `${key}=${params[key]}&`;
    }
  }
  
  // Add app secret
  stringToSign += `key=${appSecret}`;
  
  // Generate MD5 hash and convert to uppercase
  return CryptoJS.MD5(stringToSign).toString().toUpperCase();
}

/**
 * 检查值是否为空
 */
export const isNull = (value: any): boolean => {
  return value == null || (typeof value === 'string' && value.trim() === '');
};

/**
 * 生成百望云API请求签名
 * @param params 请求参数
 * @param appSecret 应用密钥
 * @param bizContent 业务内容
 * @returns 签名字符串
 */
export const signTopRequest = (params: Record<string, any>, appSecret: string, bizContent?: any): string => {
  const sortedKeys = Object.keys(params).sort();
  
  let stringToSign = appSecret;
  
  // 按照字母顺序拼接所有参数
  for (let i = 0; i < sortedKeys.length; i++) {
    const key = sortedKeys[i];
    const value = params[key];
    
    // 跳过空值
    if (isNull(key) || isNull(value)) {
      continue;
    }
    
    stringToSign += key + value;
  }
  
  // 添加业务内容
  if (bizContent) {
    stringToSign += JSON.stringify(bizContent);
  }
  
  // 最后再加上应用密钥
  stringToSign += appSecret;
  
  // 生成MD5并转为大写
  return md5(stringToSign).toUpperCase();
};
