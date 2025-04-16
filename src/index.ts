import { sdkBuilder, SdkBuilderConfig, FetchContext } from '../sdk-builder';
import { ConfigParams } from './types/config';
import { EnvOPT } from './types/env';
import { Env } from './enums/env';
import { Config } from './enums/config';
import { Method } from './enums/method';

export * from './api/allElectric/issuance_of_red_letter';
export * from './api/cloud_head_up';
export * from './api/invoice_query';
export * from './api/invoicing';
export * from './api/layout_query';
export * from './api/pre_invoicing';
export * from './api/token';
export * from './api/void_invoiced';

export * from './types/config';
export * from './types/env';
export * from './types/request';
export * from './enums/env';
export * from './enums/method';
export * from './enums/config';

export { RedisCacheProvider } from '../sdk-builder/cache/redisProvider';
export { BrowserCacheProvider } from '../sdk-builder/cache/browserProvider';
export { type CacheProvider } from '../sdk-builder/cache/cacheProvider';
export { jsonTransformer } from '../sdk-builder/transformers/jsonTransformer';

export type CreateInvoiceOPT = ConfigParams & {
  /**
   * @default 'test'
   */
  readonly env?: EnvOPT;
  /**
   * @default 'https://sandbox-openapi.baiwang.com/router/rest'
   */
  readonly testUrl?: string;
  /**
   * @default 'https://openapi.baiwang.com/router/rest'
   */
  readonly prodUrl?: string;
};

/**
 * 开票sdk
 */
export function createInvoice(options: CreateInvoiceOPT) {
  const { 
    env = Env.TEST,
    testUrl = Config.TEST_URL,
    prodUrl = Config.PROD_URL,
    username,
    password,
    appKey,
    appSecret,
    secret,
    salesAccount,
    salesPassword,
  } = options;

  const baseUrl = env === Env.PROD ? prodUrl : testUrl;

  const sdkConfig: SdkBuilderConfig = {
    baseUrl,
    placeholders: {},
    timeout: 10000,
    config: {
      username,
      password,
      appKey,
      appSecret,
      secret,
      salesAccount,
      salesPassword,
      _tokenCache: '',
    },
  };

  const sdk = sdkBuilder(sdkConfig);

  // Register API endpoints
  sdk.r('fetchIssuanceOfRedLetter', '?version=6.0&method=' + Method.RED_LETTER_ISSUANCE);
  sdk.r('fetchCloudHeadUp', '?version=3.0&method=' + Method.LAYOUT_QUERY);
  sdk.r('fetchInvoiceQuery', '?method=' + Method.INVOICE_QUERY);
  sdk.r('fetchInvoicing', '?method=' + Method.INVOICING);
  sdk.r('fetchLayoutQuery', '?method=' + Method.LAYOUT_QUERY);
  sdk.r('fetchPreInvoicing', '?method=' + Method.PRE_INVOICE);
  sdk.r('fetchVoidInvoiced', '?method=' + Method.VOID_INVOICED);

  // Authentication
  sdk.rx('authenticate', async (config) => {
    // Auth implementation
    // This is a placeholder - implement actual authentication logic
    return {
      access_token: 'token123'
    };
  });

  // Request interceptor
  sdk.rx('reqInterceptor', async (config, options = {}) => {
    // Sign request and add params
    // This is a placeholder - implement actual request signing
    return options;
  });

  return sdk;
}

export default createInvoice;