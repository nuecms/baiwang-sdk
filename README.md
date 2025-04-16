# 百望云SDK

> **注意：** 某些功能尚未完全测试，请在生产环境使用前充分测试。

基于SDK-Builder实现的百望云发票SDK，提供类型安全的API和强大的扩展能力。

## 安装

```bash
# npm
npm install @nuecms/baiwang-sdk

# yarn
yarn add @nuecms/baiwang-sdk

# pnpm
pnpm add @nuecms/baiwang-sdk
```

## 特性

- **类型安全**: 完整的TypeScript类型定义
- **配置灵活**: 支持多种环境配置与自定义选项
- **缓存支持**: 内置令牌缓存，支持自定义缓存提供者
- **自动刷新**: 支持令牌自动刷新
- **简洁API**: 一致的API设计，支持函数式配置

## 使用示例

### ESM

```js
import { createInvoice } from '@nuecms/baiwang-sdk';

const baiwang = createInvoice({
  username: 'xxx',
  password: 'xxx',
  appKey: 'xxx',
  appSecret: 'xxx',
  secret: 'xxx',
  salesAccount: 'xxx',
  salesPassword: 'xxx',
  outputTaxNumber: 'xxx',
  invoicingPoint: 'xxx',
  env: 'test', // 'test' 或 'prod'
  autoSign: false, // 是否自动刷新token
});

// 获取token
baiwang.getToken().then(token => console.log(token));
```

### CommonJS

```js
const { createInvoice } = require('@nuecms/baiwang-sdk');

// ...后续使用与ESM相同
```

## 配置与API调用

SDK支持函数式配置访问，方便在API调用时复用初始化配置：

```js
const bw = createInvoice({
  // ...配置
  outputTaxNumber: 'outputTaxNumber',
  // ...其他配置
});

// 使用配置参数调用API
bw.queryLayout(config => ({
  taxNo: config.outputTaxNumber, // 这里会是 'outputTaxNumber'
  data: {
    by1: 'PDF',
    invoiceNo: '00397804',
    invoiceCode: '011000100011',
    returnType: '1',
  },
}));
```

## API参考

### 认证相关

#### getToken (获取令牌)

```js
// 完整参数
bw.getToken({
  username: 'xxx',
  client_secret: 'xxx',
  password: 'xxx',
});

// 使用初始配置
bw.getToken();

// 函数式配置
bw.getToken(config => ({
  username: config.username,
  client_secret: config.appSecret,
  password: config.password,
}));
```

#### refreshToken (刷新令牌)

```js
// 使用缓存的refresh_token自动刷新
bw.refreshToken();

// 显式指定参数
bw.refreshToken({
  client_secret: 'xxx',
  refresh_token: 'xxx',
});
```

### 发票操作

#### invoicing (开票/红冲)

发票开具是百望云SDK的核心功能，支持各类发票的开具和红冲操作。

**功能说明：**
- 支持增值税专用发票、普通发票、电子发票等多种发票类型
- 支持红字发票开具（冲红）和蓝字发票开具
- 支持商品明细的动态添加与配置
- 支持发票拆分、合并、预览等高级功能
- 自动计算税额与金额合计（可选）
- 支持多种开票终端

**参数说明：**

| 参数名 | 类型 | 必填 | 说明 |
|-------|------|-----|------|
| taxNo | string | 是 | 销方税号，必须与系统登记的税号一致 |
| invoiceTerminalCode | string | 是 | 开票终端编码，不同终端具有不同权限 |
| isSplit | boolean | 否 | 是否拆分，为true时系统会自动拆分超限发票 |
| formatPushType | boolean | 否 | 版式推送类型，控制发票版式的推送方式 |
| taxDiskNo | string | 否 | 税盘号，部分业务场景需要指定税盘 |
| formatGenerate | boolean | 否 | 是否生成版式文件，控制是否同步生成PDF等版式 |
| taxUserName | string | 否 | 税务用户名，用于特定开票权限场景 |
| completionCustom | string | 否 | 自定义完成回调地址 |
| orgCode | string | 否 | 组织机构代码 |
| data | object | 是 | 发票数据对象，包含详细的发票信息 |

**发票数据对象 (data) 主要字段：**

| 字段名 | 类型 | 必填 | 说明 |
|-------|------|-----|------|
| invoiceType | string | 是 | 发票类型，"0"-普通发票，"1"-专用发票，"2"-电子发票 |
| invoiceTypeCode | string | 是 | 发票类型代码，如"026"、"028"等 |
| buyerName | string | 是 | 购方名称，发票抬头 |
| buyerTaxNo | string | 是 | 购方税号，填写正确的统一社会信用代码 |
| buyerAddress | string | 否 | 购方地址 |
| buyerPhone | string | 否 | 购方电话 |
| buyerBankAccount | string | 否 | 购方银行账号，格式为"开户行名称 账号" |
| buyerEmail | string | 否 | 购方邮箱，用于接收电子发票 |
| invoiceTotalPrice | number | 是 | 合计金额，不含税金额总计 |
| invoiceTotalTax | number | 是 | 合计税额，所有商品的税额总计 |
| invoiceTotalPriceTax | number | 是 | 价税合计，等于合计金额+合计税额 |
| serialNo | string | 否 | 业务流水号，用于标识开票来源 |
| invoiceDetailsList | array | 是 | 发票明细列表，每个商品的详细信息 |
| drawer | string | 是 | 开票人姓名 |
| payee | string | 是 | 收款人姓名 |
| checker | string | 是 | 复核人姓名 |
| remarks | string | 否 | 备注，将显示在发票上的附加信息 |
| redInfoNo | string | 条件 | 红字信息表编号，开具红字发票时必填 |
| redIssueReason | string | 条件 | 开具红字发票的原因，如"退货" |
| originalInvoiceCode | string | 条件 | 原发票代码，红字发票时需填写 |
| originalInvoiceNo | string | 条件 | 原发票号码，红字发票时需填写 |
| taxationMethod | string | 否 | 计税方式，"0"-普通计税，"2"-差额计税 |
| paperInvoiceFlag | string | 否 | 纸票标志，"Y"-纸质，"N"-电子 |

**发票明细项 (invoiceDetailsList) 字段说明：**

| 字段名 | 类型 | 必填 | 说明 |
|-------|------|-----|------|
| goodsName | string | 是 | 商品名称，按税务要求填写规范名称 |
| goodsCode | string | 条件 | 商品编码，部分地区必填，建议使用税务认可编码 |
| goodsPrice | number | 是 | 单价，不含税单价 |
| goodsQuantity | number | 是 | 数量，可精确到小数点后8位 |
| goodsUnit | string | 否 | 单位，如"个"、"台"、"件"等 |
| goodsTaxRate | number | 是 | 税率，如0.13表示13%增值税 |
| goodsTotalPrice | number | 是 | 金额，等于单价×数量 |
| goodsTotalTax | number | 是 | 税额，等于金额×税率 |
| goodsSpecification | string | 否 | 规格型号 |
| goodsDiscountAmount | number | 否 | 折扣金额 |
| invoiceLineNature | string | 否 | 行性质，"0"-正常行，"1"-折扣行，"2"-被折扣行 |
| freeTaxMark | string | 否 | 免税标志 |
| preferentialMarkFlag | string | 否 | 优惠政策标识 |
| vatSpecialManagement | string | 否 | 增值税特殊管理 |

**完整使用示例：**

```js
bw.invoicing(config => ({
  taxNo: config.outputTaxNumber,
  invoiceTerminalCode: 'dzpzd008',
  formatGenerate: true,
  isSplit: false,
  data: {
    // 购方信息（发票抬头）
    buyerName: '百望测试公司',                // 购方名称
    buyerTaxNo: '91500000747150890S',      // 购方税号
    buyerAddress: '北京市海淀区',
    buyerPhone: '010-83332891',
    buyerBankAccount: '中国工商银行海淀分行 62266693991223881',
    buyerEmail: 'test@example.com',        // 用于接收电子发票

    // 发票基本信息
    invoiceType: '0',                      // 发票类型：0-普票
    invoiceTypeCode: '026',                // 发票类型代码
    invoiceTotalPrice: 100.00,             // 合计金额
    invoiceTotalTax: 13.00,                // 合计税额
    invoiceTotalPriceTax: 113.00,          // 价税合计
    paperInvoiceFlag: 'N',                 // 'N'-电子票，'Y'-纸质票
    serialNo: 'BW202401010001',            // 业务流水号
    priceTaxMark: '0',                     // 价税合计模式
    taxationMethod: '0',                   // 计税方式

    // 发票明细项（可包含多个商品）
    invoiceDetailsList: [
      {
        goodsName: '办公用品',                // 商品名称
        goodsCode: '1010101070000000000',   // 商品编码
        goodsPrice: 50.00,                  // 单价
        goodsQuantity: 2,                   // 数量
        goodsUnit: '套',                    // 单位
        goodsTaxRate: 0.13,                 // 税率 (13%)
        goodsTotalPrice: 100.00,            // 金额 (50 × 2)
        goodsTotalTax: 13.00,               // 税额 (100 × 0.13)
        goodsSpecification: 'A4-01',        // 规格型号
        invoiceLineNature: '0',             // 行性质：0-正常行
        preferentialMarkFlag: '0',          // 优惠政策标识
      }
    ],

    // 其他必要信息
    drawer: '张经理',                        // 开票人
    payee: '李出纳',                         // 收款人
    checker: '王主管',                       // 复核人
    remarks: '办公用品采购',                   // 备注信息
  }
})).then(result => {
  console.log('发票开具成功');
  console.log('发票代码:', result.invoiceCode);
  console.log('发票号码:', result.invoiceNo);
  console.log('开票日期:', result.invoiceDate);

  // 如果开启了版式生成，可能会返回PDF地址
  if (result.pdfUrl) {
    console.log('PDF下载地址:', result.pdfUrl);
  }
}).catch(error => {
  console.error('发票开具失败:', error.message);
  console.error('错误代码:', error.code);
});
```

**红字发票（冲红）完整示例：**

```js
bw.invoicing(config => ({
  taxNo: config.outputTaxNumber,
  invoiceTerminalCode: 'dzpzd008',
  data: {
    // 红冲相关信息
    originalInvoiceCode: '011000100011',      // 原发票代码 (必填)
    originalInvoiceNo: '00397804',            // 原发票号码 (必填)
    redInfoNo: 'HD202401010001',              // 红字信息表编号 (必填)
    redIssueReason: '商品退货',                // 红字原因 (建议填写)

    // 购方信息 (必须与原发票一致)
    buyerName: '百望测试公司',
    buyerTaxNo: '91500000747150890S',
    buyerAddress: '北京市海淀区',
    buyerPhone: '010-83332891',

    // 发票基本信息
    invoiceType: '1',                         // 红字发票类型
    invoiceTypeCode: '026',                   // 发票类型代码
    invoiceTotalPrice: -100.00,               // 负数金额
    invoiceTotalTax: -13.00,                  // 负数税额
    invoiceTotalPriceTax: -113.00,            // 负数价税合计

    // 发票明细项 (负数金额)
    invoiceDetailsList: [
      {
        goodsName: '办公用品',                  // 与原发票一致
        goodsCode: '1010101070000000000',     // 与原发票一致
        goodsPrice: 50.00,                    // 单价保持正数
        goodsQuantity: -2,                    // 数量为负数
        goodsUnit: '套',
        goodsTaxRate: 0.13,                   // 税率与原发票一致
        goodsTotalPrice: -100.00,             // 负数金额
        goodsTotalTax: -13.00,                // 负数税额
        goodsSpecification: 'A4-01',
      }
    ],

    // 其他必要信息
    drawer: '张经理',
    payee: '李出纳',
    checker: '王主管',
    remarks: '退货红字发票',
  }
}));
```

**返回数据详细说明：**

成功开具发票后，根据配置和API不同，可能返回以下信息：

| 字段名 | 类型 | 说明 |
|-------|------|-----|
| invoiceCode | string | 发票代码，税务局分配的唯一代码 |
| invoiceNo | string | 发票号码，票面显示的号码 |
| invoiceDate | string | 开票日期，格式通常为YYYY-MM-DD |
| totalAmount | number | 发票金额，不含税总金额 |
| totalTax | number | 发票税额，总税额 |
| checkCode | string | 校验码，用于发票查验 |
| pdfUrl | string | PDF文件下载地址 (如启用版式生成) |
| qrCode | string | 二维码内容 (部分API返回) |
| invoiceStatus | string | 发票状态 |

**注意事项：**

1. 发票开具前建议进行参数验证，确保金额、税额等数据的正确性
2. 红字发票开具前必须先获取红字信息表编号
3. 不同地区的税务系统可能有特殊要求，请参考当地税务规定
4. 某些特殊商品可能有税收分类编码要求
5. 高频开票建议启用自动缓存功能
6. 发票数据应妥善保存，建议在业务系统中实现完整的发票管理功能

#### queryInvoice (发票查询)

```js
bw.queryInvoice(config => ({
  taxNo: config.outputTaxNumber,
  data: {
    // 查询参数
    invoiceCode: '011000100011',
    invoiceNo: '00397804',
    // ...其他查询条件
  },
}));
```

#### voidInvoiced (发票作废)

```js
bw.voidInvoiced(config => ({
  taxNo: config.outputTaxNumber,
  invoiceTerminalCode: '开票点编码',
  data: {
    invoiceInvalidOperator: '作废人',
    invoiceNo: '发票号码',
    invoiceCode: '发票代码',
  },
}));
```

#### queryCloudHeadUp (云抬头查询)

```js
bw.queryCloudHeadUp(config => ({
  taxId: config.outputTaxNumber,
  companyName: '百望股份有限公司',
  accuracy: true,
  sort: { frequency: 1 },
}));
```

#### queryLayout (发票版式查询)

```js
bw.queryLayout(config => ({
  taxNo: config.outputTaxNumber,
  data: {
    by1: 'PDF',
    invoiceNo: '00397804',
    invoiceCode: '011000100011',
    returnType: '1', // 1-PDF, 2-OFD, 3-图片
  },
}));
```

#### preInvoice (预制发票)

```js
bw.preInvoice(config => ({
  taxNo: config.outputTaxNumber,
  invoiceTerminalCode: '开票点编码',
  data: {
    // 预制发票数据
    invoiceTypeCode: '026',
    invoiceDetailsList: [
      // 发票明细项
    ]
  }
}));
```

#### issueRedLetter (红字信息表开具)

```js
bw.issueRedLetter(config => ({
  taxNo: config.outputTaxNumber,
  data: {
    originalInvoiceCode: '发票代码',
    originalInvoiceNo: '发票号码',
    sellerTaxNo: '销方税号',
    buyerTaxNo: '购方税号',
    // 其他数据
  }
}));
```

## 高级功能

### 自定义缓存

使用Redis作为缓存提供者:

```js
import { createInvoice, RedisCacheProvider } from '@nuecms/baiwang-sdk';
import Redis from 'ioredis';

const redis = new Redis();
const cache = new RedisCacheProvider(redis);

const bw = createInvoice({
  // ...配置
  cacheProvider: cache,
});
```

### 类型安全

SDK提供完整的TypeScript类型定义，包括请求参数和响应数据：

```ts
// 请求类型
interface InvoicingRequest {
  taxNo: string;
  data: {
    // ...类型定义
  }
}

// 响应类型
type InvoicingResponse = ApiResponse<{
  invoiceCode: string;
  invoiceNo: string;
  // ...其他响应字段
}>;
```

## 开发

```bash
# 安装依赖
pnpm install

# 开发构建 (监视模式)
pnpm dev

# 生产构建
pnpm build

# 运行测试
pnpm test
```

## 许可证

MIT
