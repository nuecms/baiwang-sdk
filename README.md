# 百望云sdk

## example

- cjs

```js
const { createInvoice } = require('@nuecms/baiwang-sdk');

const invoice = createInvoice({
  username: 'xxx',
  password: 'xxx',
  appKey: 'xxx',
  appSecret: 'xxx',
  secret: 'xxx',
  salesAccount: 'xxx',
  salesPassword: 'xxx',
  outputTaxNumber: 'xxx',
  invoicingPoint: 'xxx',
  // 默认测试环境
  env: 'test',
  //  默认不自动刷新token
  autoSign: false,
});

invoice.getToken().then()

// const { getToken, ... } = invoice
// getToken().then
// 也可以

// invoice.r...
```

- esm

```js
import { createInvoice } from 'banu-invoice-sdk';

const invoice = createInvoice({
  username: 'xxx',
  password: 'xxx',
  appKey: 'xxx',
  appSecret: 'xxx',
  secret: 'xxx',
  salesAccount: 'xxx',
  salesPassword: 'xxx',
  outputTaxNumber: 'xxx',
  invoicingPoint: 'xxx',
  // 默认测试环境
  env: 'test',
});

invoice.getToken().then()

// const { getToken, ... } = invoice
// getToken().then
// 也可以

// invoice.r...
```

## 文档注释

![image-20230703105743484](README.assets/image-20230703105743484.png)

## 初始化配置获取

```js
const bw = createInvoice({
  username: 'xxx',
  password: 'xxx',
  appKey: 'xxx',
  appSecret: 'xxx',
  secret: 'xxx',
  salesAccount: 'xxx',
  salesPassword: 'xxx',
  outputTaxNumber: 'outputTaxNumber',
  invoicingPoint: 'xxx',
  env: 'test',
});


  bw.queryLayout(config => ({
    taxNo: config.outputTaxNumber /* === 'outputTaxNumber' */,
    data: {
      by1: 'PDF',
      invoiceNo: '00397804',
      invoiceCode: '011000100011',
      returnType: '1',
    },
  })).then
```

![image-20230703110154586](./README.assets/image-20230703110154586.png)

## api

- getToken (sign)

  > 参数非必填，不填写，参数默认为初始化配置值

  ```js
  getToken({
      username: 'xxx',
      client_secret: 'xxx',
      password: 'xxx',
    }).then...
  // 不填跟如下的一样
  getToken(config => ({
      username: config.username,
      client_secret: config.client_secret,
      password: config.password,
    }));
  getToken()
  ```

- refreshToken (刷新token)

  > 非必填参数，默认为上一次getToken的返回的refresh_token值，

  ```js
    refreshToken({
      client_secret: 'xxx',
      refresh_token: 'xxx',
    })
  	// 以下两种方式效果一样
  	refreshToken();
    refreshToken(config => ({
      client_secret: config.appKey,
      refresh_token: config._refreshTokenCache,
    }));
  ```

- invoicing (开票 红冲)

  > 必填，参数较多，根据业务需要来填写，鼠标具备文档注释 (鼠标浮动查看)

  ![image-20230703143520605](./README.assets/image-20230703143520605.png)

  ```js
  invoicing(config => ({
      taxNo: config.outputTaxNumber,
      isSplit: false,
      orgCode: '',
      invoiceTerminalCode: 'dzpzd008',
      formatPushType: false,
      taxDiskNo: '',
      formatGenerate: false,
      taxUserName: 'cccccccb',
      completionCustom: '',
      data: {
        discountRate: 0,
        redConfirmUuid: '',
        buyerBankAccount: '中国工商银行海淀分行 62266693991223881',
        buyerEmail: '',
        invoiceTotalTax: 1.3,
        discountAmount: 0,
        sellerAddress: '',
        checker: '李佳佳',
        taxationMethod: '0',
        redInfoNo: '',
        payee: '任盈盈',
        buyerAddress: '',
        taxationLabel: '01',
        systemName: '',
        invoiceType: '0',
        redIssueReason: '',
        emailCarbonCopy: '',
        ext: {},
        buyerTaxNo: '91500000747150890S',
        contractNumber: '',
        originalInvoiceNo: '',
        invoiceListMark: '0',
        serialNo: 'T150000431379',
        voucherNo: '',
        buyerPhone: '',
        invoiceTotalPrice: 10,
        userAccount: '',
        invoiceDetailsList: [
          {
            goodsTaxRate: 0.13,
            invoiceLineNature: '0',
            goodsTotalPrice: 10,
            preferentialMarkFlag: '0',
            goodsPersonalCode: '',
            originalInvoiceDetailNo: '',
            goodsSpecification: '',
            goodsPrice: 1,
            freeTaxMark: '',
            goodsDiscountAmount: 0,
            goodsQuantity: 10,
            goodsUnit: '',
            goodsTotalTax: 1.3,
            goodsCode: '1010101070000000000',
            goodsName: '燕麦',
            goodsLineNo: 1,
            vatSpecialManagement: '',
          },
        ],
        sellerBankName: '',
        originalInvoiceCode: '',
        sellerTelphone: '',
        priceTaxMark: '0',
        buyerTelphone: '',
        paperInvoiceFlag: 'N',
        invoiceBalanceinfoList: [
          {
            balanceVoucherNo: '',
            balanceType: '01',
            balanceDeductAmount: 10,
            balanceNo: '1',
            balanceIssueDate: '2023-01-22',
            balanceInvoiceNo: '',
            balanceTotalAmount: 20.0,
            balanceSource: '0',
            balanceElectricNo: '',
            balanceInvoiceCode: '',
            balanceRemarks: '备注',
          },
        ],
        mainGoodsName: '',
        sellerAddressPhone: '',
        buyerBankName: '',
        discountType: '',
        buyerAddressPhone: '北京市海淀区 010-83332891',
        systemId: '',
        deductibleAmount: 0,
        drawer: '张一诺',
        invoiceSpecialMark: '00',
        buyerName: '百望测试40',
        invoiceTotalPriceTax: 11.3,
        sellerBankNumber: '',
        buyerBankNumber: '',
        sellerBankAccount: '',
        invoiceTypeCode: '026',
        remarks: '',
        invoiceSpecialinfoList: [
          {
            leaseHoldDateEnd: '',
            propertyContractNo: '',
            buildingLocalAddress: '',
            carriageLeave: '',
            carriageVehicleType: '',
            propertyApprovedPrice: 0,
            carriageArrive: '',
            buildingCrossSign: '',
            buildingDetailAddress: '',
            carriageLeaveAddress: '',
            propertyLandTaxNo: '',
            transport_arrive: '',
            propertyDealPrice: 0,
            carriageDateYmd: '',
            propertyCrossSign: '',
            carriageId: '',
            leaseAddress: '',
            carriageVehicleGrade: '',
            propertyAddress: '',
            carriageIdNo: '',
            leaseAreaUnit: '',
            leaseCrossSign: '',
            carriageName: '',
            transport_departure: '',
            buildingLandTaxNo: '',
            propertyDetailAddress: '',
            transport_goods_name: '',
            propertyPropertyNo: '',
            leasePropertyNo: '',
            buildingName: '',
            leaseDetailAddress: '',
            transport_tool_type: '',
            transport_tool_num: '',
            propertyAreaUnit: '',
            carriageArriveAddress: '',
            leaseHoldDateStart: '',
          },
        ],
      },
    }))
  ```

- queryInvoice (已开发票查询)

  ```js
  queryInvoice(config => ({
      taxNo: config.outputTaxNumber,
      data: {
        // 查询条件
      },
    }))
  ```

- voidInvoiced (已开作废)

  ```js
  voidInvoiced(config => ({
      taxNo: config.outputTaxNumber,
      invoiceTerminalCode: '开票点编码',
      data: {
        invoiceInvalidOperator: '作废人',
        invoiceNo: '发票号码',
        invoiceCode: '发票代码',
      },
    }))
  ```

- queryCloudHeadUp (云抬头)

  ```js
    queryCloudHeadUp(config => ({
      taxId: config.outputTaxNumber,
      companyName: '百望股份有限公司',
      accuracy: true,
      sort: { frequency: 1 },
    }))
  ```

- queryLayout (版式查询)

  ```js
    queryLayout(config => ({
      taxNo: config.outputTaxNumber,
      data: {
        by1: 'PDF',
        invoiceNo: '00397804',
        invoiceCode: '011000100011',
        returnType: '1',
      },
    }));
  ```

## 返回类型推断成功/失败

- 失败

  ![image-20230703150106496](./README.assets/image-20230703150106496.png)

- 成功

  ![image-20230703150136466](./README.assets/image-20230703150136466.png)