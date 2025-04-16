/**
 * SDK Configuration Constants
 */
export const Config = {
  /**
   * Default API endpoint URLs
   */
  ENDPOINTS: {
    prod: 'https://openapi.baiwang.com/router/rest',
    sandbox: 'https://sandbox-openapi.baiwang.com/router/rest'
  },
  
  /**
   * Default request timeout (ms)
   */
  DEFAULT_TIMEOUT: 10000,
  
  /**
   * Default token expiry time (seconds)
   */
  TOKEN_EXPIRY: 7200
} as const;
