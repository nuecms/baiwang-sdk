import { createHash } from 'crypto';

/**
 * 计算MD5哈希
 * @param data 要计算哈希的数据
 * @returns MD5哈希字符串
 */
export function md5(data: string): string {
  return createHash('md5').update(data).digest('hex');
}

/**
 * 计算SHA1哈希
 * @param data 要计算哈希的数据
 * @returns SHA1哈希字符串
 */
export function sha1(data: string): string {
  return createHash('sha1').update(data).digest('hex');
}
