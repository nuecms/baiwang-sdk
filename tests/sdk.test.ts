import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createInvoice, RedisCacheProvider } from '../src';
import { Method } from '../src/enums/method';
import Redis from 'ioredis';

describe('Baiwang SDK Tests', () => {
  const mockConfig = {
    username: 'mockUsername',
    password: 'mockPassword',
    appKey: 'mockAppKey',
    appSecret: 'mockAppSecret',
    secret: 'mockSecret',
    salesAccount: 'mockSalesAccount',
    salesPassword: 'mockSalesPassword',
    outputTaxNumber: 'mockTaxNumber',
    invoicingPoint: 'mockInvoicePoint',
    env: 'test',
    autoSign: false,
    cacheProvider: new RedisCacheProvider(new Redis()),
  };

  let sdk: ReturnType<typeof createInvoice>;

  beforeEach(() => {
    sdk = createInvoice(mockConfig);

    // Mock API Response for getToken
    const mockTokenResponse = {
      access_token: 'mockAccessToken123',
      refresh_token: 'mockRefreshToken123',
      token_type: 'bearer',
      expires_in: 7200,
    };

    // Mock HTTP request
    vi.spyOn(sdk, 'exec').mockImplementation((method, params) => {
      if (method === Method.AUTH) {
        return Promise.resolve(mockTokenResponse);
      }
      return Promise.resolve({});
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should initialize SDK correctly', () => {
    expect(sdk).toBeDefined();
    expect(typeof sdk.exec).toBe('function');
  });

  it('should get a token', async () => {
    const response = await sdk.getToken({
      username: mockConfig.username,
      client_secret: mockConfig.appSecret,
      password: mockConfig.password,
    });

    expect(response.access_token).toBe('mockAccessToken123');
    expect(response.refresh_token).toBe('mockRefreshToken123');
    expect(response.expires_in).toBe(7200);
  });

  it('should use cached token if available', async () => {
    const mockCachedToken = {
      access_token: 'cachedToken456',
      refresh_token: 'cachedRefresh456',
    };

    vi.spyOn(mockConfig.cacheProvider, 'get').mockResolvedValue({
      value: mockCachedToken
    });

    await sdk.authenticate();

    // Verify the token was cached with the right key
    expect(mockConfig.cacheProvider.get).toHaveBeenCalledWith(`baiwang_access_token_${mockConfig.appKey}`);

    // Verify the SDK config was updated with the cached token
    expect(sdk.config.access_token).toBe('cachedToken456');
  });

  it('should refresh token when needed', async () => {
    const mockRefreshResponse = {
      access_token: 'newToken789',
      refresh_token: 'newRefresh789',
      token_type: 'bearer',
      expires_in: 7200,
    };

    vi.spyOn(sdk, 'exec').mockImplementation((method, params) => {
      if (method === Method.AUTH && params.refresh_token) {
        return Promise.resolve(mockRefreshResponse);
      }
      return Promise.resolve({});
    });

    const response = await sdk.refreshToken({
      client_secret: mockConfig.appSecret,
      refresh_token: 'oldRefreshToken',
    });

    expect(response.access_token).toBe('newToken789');
    expect(response.refresh_token).toBe('newRefresh789');
  });

  it('should create an invoice', async () => {
    const mockInvoiceResponse = {
      invoiceCode: 'INV123456',
      invoiceNo: '12345678',
      invoiceDate: '20230101120000',
      totalAmount: 100.00,
      totalTax: 13.00,
    };

    vi.spyOn(sdk, 'exec').mockImplementation((method, params) => {
      if (method === Method.INVOICING) {
        return Promise.resolve(mockInvoiceResponse);
      }
      return Promise.resolve({});
    });

    const response = await sdk.invoicing({
      taxNo: mockConfig.outputTaxNumber,
      data: {
        invoiceType: '0',
        invoiceTypeCode: '026',
        buyerName: 'Test Company',
        buyerTaxNo: '91500000747150890S',
        invoiceTotalPrice: 100.00,
        invoiceTotalTax: 13.00,
        invoiceTotalPriceTax: 113.00,
        discountRate: 0,
        discountAmount: 0,
        invoiceDetailsList: [
          {
            goodsName: 'Test Product',
            goodsPrice: 100.00,
            goodsQuantity: 1,
            goodsTaxRate: 0.13,
            goodsTotalPrice: 100.00,
            goodsTotalTax: 13.00,
          }
        ]
      }
    });

    expect(response.invoiceCode).toBe('INV123456');
    expect(response.invoiceNo).toBe('12345678');
    expect(response.totalAmount).toBe(100.00);
    expect(response.totalTax).toBe(13.00);
  });

  it('should handle API errors gracefully', async () => {
    const errorResponse = {
      code: '1001',
      msg: 'Invalid request parameters',
      success: false
    };

    vi.spyOn(sdk, 'exec').mockRejectedValue(errorResponse);

    try {
      await sdk.invoicing({
        taxNo: 'invalidTaxNo',
        data: { /* invalid data */ }
      });
      // Should not reach here
      expect(true).toBe(false);
    } catch (error: any) {
      expect(error.code).toBe('1001');
      expect(error.msg).toBe('Invalid request parameters');
      expect(error.success).toBe(false);
    }
  });

  it('should query invoice details', async () => {
    const mockQueryResponse = {
      total: 1,
      list: [
        {
          invoiceCode: 'INV123456',
          invoiceNo: '12345678',
          invoiceDate: '2023-01-01',
          invoiceType: '0',
          buyerName: 'Test Company',
          buyerTaxNo: '91500000747150890S',
          amount: 100.00,
          tax: 13.00,
          totalAmount: 113.00
        }
      ]
    };

    vi.spyOn(sdk, 'exec').mockImplementation((method, params) => {
      if (method === Method.INVOICE_QUERY) {
        return Promise.resolve(mockQueryResponse);
      }
      return Promise.resolve({});
    });

    const response = await sdk.queryInvoice({
      taxNo: mockConfig.outputTaxNumber,
      data: {
        invoiceCode: 'INV123456',
        invoiceNo: '12345678'
      }
    });

    expect(response.total).toBe(1);
    expect(response.list[0].invoiceCode).toBe('INV123456');
    expect(response.list[0].invoiceNo).toBe('12345678');
  });
});
