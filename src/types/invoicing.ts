import { ApiRequest, ApiResponse } from './api';

/**
 * 发票开具请求
 */
export interface InvoicingRequest extends ApiRequest {
  /**
   * 销方机构税号
   */
  taxNo: string;

  /**
   * 登录名，用于一税号多账户区分用，该登录名为税局页面登录名
   */
  taxUserName?: string;

  /**
   * 服务器/税务ukey 用户专普票必填，电子票非必填；税务ukey终端使用机器编号；盘用户，盘号终端选填，如果只有一个终端可不填，全电票种选填
   */
  invoiceTerminalCode?: string;

  /**
   * 是否需要拆分开具，默认不拆分（拆分只支持发票类型代码为 专票 004 普票 007 电子票 026的发票）
   */
  isSplit?: boolean;

  /**
   * 组织机构编码，如果为空则上传至税号对应的机构下，如果维护了机构则按照机构归属待开信息，根据判断自行信息管理选择是否设置开票相关信息；根据组织机构编码获取销方信息
   */
  orgCode?: string;

  /**
   * 盘号终端选填，如果只有一个终端可不填
   */
  taxDiskNo?: string;

  /**
   * 是否需要生成版式返回版式链接(true / false);此参数仅对税控类开具的电子发票生效
   */
  formatGenerate?: boolean;

  /**
   * 版式生成是否推送(true / false)
   */
  formatPushType?: boolean;

  /**
   * 值为（1/0 1 需要补全 0不需要补全，默认为0）是否根据客户编码，购方税号，购方名称查询客户信息补全未填写的购方信息（购方税号，购方名称，购方地址电话，购方银行账号，邮箱，手机）
   */
  completionCustom?: string;

  /**
   * 发票数据
   */
  data: {
    /**
     * 发票种类编码, 004：增值税专用发票；007：增值税普通发票；026：增值税电子发票；025：增值税卷式发票；028:增值税电子专用发票 01:全电发票(增值税专用发票) 02:全电发票(普通发票)
     */
    invoiceTypeCode: string;

    /**
     * 全电纸质发票标志（Y是N否），当invoiceTypeCode=01/02时，默认N； 税控类发票开具不校验此字段；
     */
    paperInvoiceFlag?: string;

    /**
     * 开票类型 0:正数发票（蓝票） 1：负数发票（红票）默认0
     */
    invoiceType: string;

    /**
     * 特殊票种标志， 00：普通发票；01：农产品销售；02：农产品收购；08：成品油 12 机动车（默认是00普通发票）; 全电类发票特殊票种标志：03：建筑服务发票；04：货物运输服务发票；05：不动产销售服务发票；06：不动产租赁服务发票；09：旅客运输发票
     */
    invoiceSpecialMark?: string;

    /**
     * 征税方式， 0：普通征税；2：差额征税（默认是0普通征税）
     */
    taxationMethod?: string;

    /**
     * 差额征税标签：01 全额开票、 02 差额开票 ；发票类型代码为01，02时且征税方式为2必填
     */
    taxationLabel?: string;

    /**
     * 0：无清单；1：带清单（专普票发票明细大于等于8行必须带清单）：大于8行必须为清单票(电子票只能为非请单票)（默认是0无清单），发票类型代码为01，02时该字段无
     */
    invoiceListMark?: string;

    /**
     * 含税标志， 0：不含税；1：含税（默认不含税）
     */
    priceTaxMark?: string;

    /**
     * 开票流水号， 唯一标志开票请求。支持数字字母下划线组合。
     */
    serialNo?: string;

    /**
     * 整单折扣类型 1 :按折扣金额价内折扣,2:按折扣金额价外折扣,3:按折扣率价内折扣,4:按折扣率价外折扣
     */
    discountType?: string;

    /**
     * 整单折扣金额,大于0小于发票总金额，如果是含税发票，大于0小于含税总金额
     */
    discountAmount: number;

    /**
     * 整单折扣率,取值[1-100]正整数
     */
    discountRate: number;

    /**
     * 购方单位税号， invoiceTypeCode=004、028、01（增值税专用发票、增值税电子专用发票、全电发票（增值税专用发票））开具时必传
     */
    buyerTaxNo: string;

    /**
     * 购方单位名称
     */
    buyerName: string;

    /**
     * 购方地址及电话， 增值税专用发票开具时必填，发票类型代码为01、02时该字段拆分为地址电话两个字段
     */
    buyerAddressPhone?: string;

    /**
     * 购方开户行及账号， 增值税专用发票开具时必填，发票类型代码为01、02时该字段拆分为银行名称、账号两个字段
     */
    buyerBankAccount?: string;

    /**
     * 购买方地址，发票类型代码为01、02时该字段可用
     */
    buyerAddress?: string;

    /**
     * 购买方电话，发票类型代码为01、02时该字段可用
     */
    buyerPhone?: string;

    /**
     * 购买方银行名称，发票类型代码为01、02时该字段可用
     */
    buyerBankName?: string;

    /**
     * 购买方银行账号，发票类型代码为01、02时该字段可用
     */
    buyerBankNumber?: string;

    /**
     * 客户邮箱
     */
    buyerEmail?: string;

    /**
     * 开票人，20字符，如果终端有值取终端，如果没有去机构获取，如果都没有会自动获取机构下随机用户名称;全电类开具时，根据终端及默认开票员进行匹配，如传入的开票人在终端授权下按传入值开具，如未查询到传入值对应的开票员则通过默认开票员进行开具
     */
    drawer?: string;

    /**
     * 复核人， 16个字符； 为空时，如果终端有值取终端，如果没有去机构获取，若都没有则为空！全电类开具时：此字段无需传值，即发票类型代码为01，02时该字段无需传值；
     */
    checker?: string;

    /**
     * 收款人， 16个字符；税控类开具时：若为空，如果终端有值取终端，如果没有去机构获取，若都没有则为空；全电类开具时：此字段无需传值，即发票类型代码为01，02时该字段无需传值
     */
    payee?: string;

    /**
     * 合计金额， 保留两位小数；支持价税分离
     */
    invoiceTotalPrice: number;

    /**
     * 合计税额， 保留两位小数；支持价税分离
     */
    invoiceTotalTax: number;

    /**
     * 价税合计， 保留两位小数；支持价税分离
     */
    invoiceTotalPriceTax: number;

    /**
     * 备注
     */
    remarks?: string;

    /**
     * 红字信息表/确认单编号，仅invoiceType=1时需要传入数据 税控类红票开具时，invoiceTypeCode=004、028时必须传值，传入红字信息表编号； 全电类红票开具时，invoiceTypeCode=01、02时必须传值，传入红字确认单编号；
     */
    redInfoNo?: string;

    /**
     * 原发票代码， invoiceType=1，负数票开具时必传
     */
    originalInvoiceCode?: string;

    /**
     * 原发票号码， invoiceType=1，负数票开具时必传;原全电发票号码
     */
    originalInvoiceNo?: string;

    /**
     * 红冲原因（1 销货退回 2 开票有误 3 服务终止 4 销售折让）税控红冲原因：建议按实际开票情况传入红冲原因，若不传系统会自动根据情况判断并赋值；全电红冲原因：必填
     */
    redIssueReason?: string;

    /**
     * 红字信息表UUID，开具全电负数发票必传
     */
    redConfirmUuid?: string;

    /**
     * 卷式发票票样 01 02 03 04 05 06 07
     */
    mainGoodsName?: string;

    /**
     * 扣除额， taxationMode=2，差额征税时必传。数值必须小于价税合计。
     */
    deductibleAmount?: number;

    /**
     * 销方地址及电话，发票类型代码为01、02时该字段拆分为地址、电话两个字段
     */
    sellerAddressPhone?: string;

    /**
     * 销方开户行及账号，发票类型代码为01、02时不用此字段
     */
    sellerBankAccount?: string;

    /**
     * 销方地址，发票类型代码为01、02时该字段可用
     */
    sellerAddress?: string;

    /**
     * 销方电话，发票类型代码为01、02时该字段可用
     */
    sellerTelphone?: string;

    /**
     * 销方银行名称，发票类型代码为01、02时该字段可用
     */
    sellerBankName?: string;

    /**
     * 销方银行账号，发票类型代码为01、02时该字段可用
     */
    sellerBankNumber?: string;

    /**
     * 合同号
     */
    contractNumber?: string;

    /**
     * 凭证号
     */
    voucherNo?: string;

    /**
     * 第三方系统名称
     */
    systemName?: string;

    /**
     * 第三方系统id
     */
    systemId?: string;

    /**
     * 抄送人邮箱,多个用英文逗号隔开,最多5个抄送人信息
     */
    emailCarbonCopy?: string;

    /**
     * 用户账号，用于个人维度数据标记
     */
    userAccount?: string;

    /**
     * Map<String, Object>, 扩展字段
     */
    ext?: object;

    /**
     * 明细列表
     * 发票上的商品或服务明细项
     */
    invoiceDetailsList: Array<{
      /**
       * 明细行号
       */
      goodsLineNo?: number;

      /**
       * 对应蓝票明细行号 税控类红字发票开具时无需传值； 全电类红字发票开具时必须传值；
       */
      originalInvoiceDetailNo?: string;

      /**
       * 发票行性质， 0：正常行；1：折扣行；2：被折扣行，默认为0
       */
      invoiceLineNature?: string;

      /**
       * 税收分类编码（末级节点）
       */
      goodsCode?: string;

      /**
       * 商品编码， 可以支持根据商品名称或商品编码进行获取【增加商品编码字段】：平台必须维护商品信息
       */
      goodsPersonalCode?: string;

      /**
       * 商品名称， 支持根据商品或商品编码获取商品信息：平台必须维护商品信息   ～～二选一必填
       */
      goodsName: string;

      /**
       * 规格型号
       */
      goodsSpecification?: string;

      /**
       * 计量单位 特殊票种为12时必填,只能为辆
       */
      goodsUnit?: string;

      /**
       * 商品数量，最多允许17位（含小数点和负号），小数点后最多允许13位，特殊票种为12时必填
       */
      goodsQuantity: number;

      /**
       * 商品单价，最多允许17位（含小数点），小数点后最多允许13位，特殊票种为12时必填
       */
      goodsPrice: number;

      /**
       * 金额，小数点后2位,超长自动保留两位小数
       */
      goodsTotalPrice: number;

      /**
       * 税额，小数点后2位,超长自动保留两位小数， 如果为空，根据金额、税率计算得出
       */
      goodsTotalTax: number;

      /**
       * 税率,超长自动保留三位小数
       */
      goodsTaxRate: number;

      /**
       * 优惠政策类型，preferentialMarkFlag=1，使用优惠政策时必传，，如"免税"、"50%先征后退"、"即征即退50%"等
       */
      vatSpecialManagement?: string;

      /**
       * 零税率标识：空 代表不使用零税率； 1：出口免税和其他免税优惠政策； 2：不征增值税；3：普通零税率
       */
      freeTaxMark?: string;

      /**
       * 是否使用优惠政策， 0：未使用；1：使用 根据商品信息获取
       */
      preferentialMarkFlag?: string;

      /**
       * 明细行折扣金额,全电不支持该字段
       */
      goodsDiscountAmount?: number;

      // 其他可能的字段
      [key: string]: any;
    }>;

    /**
     * List<OutputInvoiceIssueInvoiceSpecialInfo>, 特定业务信息节点，当特殊票种标志为03、04、05、06时必填
     */
    invoiceSpecialinfoList?: Array<{
      /**
       * 建筑服务特定要素-建筑服务发生地，按照省、市、区/县三级传值，以&符间隔，举例"北京市&东城区、河北省&石家庄市&正定县"(建筑服务发生地和详细地址之和为120)
       */
      buildingLocalAddress?: string;

      /**
       * 建筑服务特定要素-建筑服务详细地址，举例"北京市海淀区清华东路17号"(建筑服务发生地和详细地址之和为120)
       */
      buildingDetailAddress?: string;

      /**
       * 建筑服务特定要素-建筑项目名称
       */
      buildingName?: string;

      /**
           * 建筑服务特定要素-土地增值税项目编号
           */
      buildingLandTaxNo?: string;
      /**
       * 建筑服务特定要素-跨地（市）标志；标志：Y：是；N：否
       */
      buildingCrossSign: string;
      /**
       * 货物运输特定要素-启运地
       */
      transport_departure: string;
      /**
       * 货物运输特定要素-到达地
       */
      transport_arrive: string;
      /**
       * 货物运输特定要素-运输工具种类，铁路运输、公路运输、水路运输、航空运输、管道运输 货物运输特定业务
       */
      transport_tool_type: string;
      /**
       * 货物运输特定要素-货物运输特定业务：运输工具牌号
       */
      transport_tool_num: string;
      /**
       * 货物运输特定要素-货物运输特定业务：运输货物名称
       */
      transport_goods_name: string;
      /**
       * 不动产销售服务-房屋产权证书/不动产权证号码
       */
      propertyPropertyNo?: string;
      /**
       * 不动产销售服务-不动产地址，按照省、市、区/县三级传值，以&符间隔，举例“北京市&东城区、河北省&石家庄市&正定县”(不动产地址和详细地址之和为120)
       */
      propertyAddress: string;
      /**
       * 不动产销售服务-详细地址，举例“北京市海淀区清华东路17号”(不动产地址和详细地址之和为120)
       */
      propertyDetailAddress: string;
      /**
       * 不动产销售服务-不动产单元代码/网签合同备案编码
       */
      propertyContractNo?: string;
      /**
       * 不动产销售服务-土地增值税项目编号
       */
      propertyLandTaxNo?: string;
      /**
       * 不动产销售服务-跨地（市）标志
       */
      propertyCrossSign: string;
      /**
       * 不动产销售服务-面积单位
       */
      propertyAreaUnit: string;
      /**
       * 不动产销售服务-核定计税价格
       */
      propertyApprovedPrice?: number;
      /**
       * 不动产销售服务-实际成交含税金额
       */
      propertyDealPrice?: number;
      /**
       * 不动产租赁-房屋产权证书/不动产权证号码
       */
      leasePropertyNo: string;
      /**
       * 不动产租赁-不动产地址，按照省、市、区/县三级传值，以&符间隔，举例“北京市&东城区、河北省&石家庄市&正定县”（不动产地址和详细地址之和为120）
       */
      leaseAddress: string;
      /**
       * 不动产租赁-详细地址，举例“北京市海淀区清华东路17号”（不动产地址和详细地址之和为120）
       */
      leaseDetailAddress: string;
      /**
       * 不动产租赁-跨地（市）标志
       */
      leaseCrossSign: string;
      /**
       * 不动产租赁-面积单位
       */
      leaseAreaUnit: string;
      /**
       * 不动产租赁-租赁期起；yyyy-MM-dd
       */
      leaseHoldDateStart: string;
      /**
       * 不动产租赁-租赁期止；yyyy-MM-dd
       */
      leaseHoldDateEnd: string;
      /**
       * 出行人
       */
      carriageName: string;
      /**
       * 出行人证件类型， 101:组织机构代码证；102:营业执照；103:税务登记证；199:其它单位证件；201:居民身份证；202:军官证；203:武警警官证；204:士兵证；205:军队离退休干部证；206:残疾人证；207:残疾军人证（1-8级）；208:外国护照；210:港澳居民来往内地通行证；212:中华人民共和国往来港澳通行证；213:台湾居民来往大陆通行证；214:大陆居民往来台湾通行证；215:外国人居留证；216:外交官证；217:使（领事）馆证；219:香港永久性居民身份证；218:海员证；220:台湾身份证；221:澳门特别行政区永久性居民身份证；222:外国人身份证件；224:就业失业登记证；225:退休证；226:离休证；227:中国护照；228:城镇退役士兵自谋职业证；229:随军家属身份证明；230:中国人民解放军军官专业证书；231:中国人民解放军义务兵退出现役证；232:中国人民解放军士官退出现役证；233:外国人永久居留身份证（外国人永久居留证）；234:就业创业证；235:香港特别行政区护照；236:澳门特别行政区护照；237:中华人民共和国港澳居民身份证；238:中华人民共和国台湾居民身份证；239:《中华人民共和国外国人工作许可证》（A类）；240:《中华人民共和国外国人工作许可证》（B类）；241:《中华人民共和国外国人工作许可证》（C类）；291:医学出生证明；299:其他个人证件；
       */
      carriageId: string;
      /**
       * 出行人证件号码
       */
      carriageIdNo: string;
      /**
       * 出行日期； yyyy-MM-dd
       */
      carriageDateYmd: string;
      /**
       * 出发地 省市区
       */
      carriageLeave: string;
      /**
       * 出发地 详细地址
       */
      carriageLeaveAddress: string;
      /**
       * 到达地 省市区
       */
      carriageArrive: string;
      /**
       * 到达地 详细地址
       */
      carriageArriveAddress: string;
      /**
       * 交通工具类型，1：飞机；2：火车；3：长途汽车；4：公共交通；5：出租车；6：汽车；7：船舶；9：其他
       */
      carriageVehicleType: string;
      /**
       * 等级，仅当交通工具种类为“飞机、火车、船舶”时，必填；飞机：公务舱、头等舱、经济舱 火车：一等座、二等座、软席（软座、软卧）、硬席（硬座、硬卧）船舶：一等舱、二等舱、三等舱
       */
      carriageVehicleGrade?: string;
    }>;

    /**
     * List<OutputInvoiceIssueInvoiceBalanceinfo>, 全电发票差额扣除额凭证明细，当征税方式为：差额征税-差额开票时必填
     */
    invoiceBalanceinfoList?: Array<{
      /**
                   * 序号
                   */
      balanceNo: string;
      /**
       * 凭证类型：01 全电发票、02 增值税专用发票、03 增值税普通发票、04 营业税发票、05 财政票据、06 法院裁决书、07 契税完税凭证、08 其他发票类、09 其他扣除凭证
       */
      balanceType: string;
      /**
       * 全电发票号码：凭证类型为01时必填
       */
      balanceElectricNo?: string;
      /**
       * 发票代码：凭证类型为02、03、04时必填
       */
      balanceInvoiceCode?: string;
      /**
       * 发票号码：凭证类型为02、03、04时必填
       */
      balanceInvoiceNo?: string;
      /**
       * 凭证号码
       */
      balanceVoucherNo?: string;
      /**
       * 开具日期：凭证类型为01、02、03、04时必填
       */
      balanceIssueDate?: string;
      /**
       * 凭证合计金额
       */
      balanceTotalAmount: string;
      /**
       * 本次扣除金额
       */
      balanceDeductAmount: string;
      /**
       * 备注：当凭证类型为08 其他发票类、09 其他扣除凭证时，备注必填。
       */
      balanceRemarks?: string;
      /**
       * 凭证来源：默认传0 ；0手工录入、1勾选导入、2模版导入
       */
      balanceSource: string;
    }>;

    // 其他可能的字段
    [key: string]: any;
  };
}

/**
 * 发票开具响应数据
 */
export type InvoicingResponseData = {
  /**
   * 发票代码
   * 税务机关统一分配的发票代码
   */
  invoiceCode: string;

  /**
   * 发票号码
   * 发票唯一编号
   */
  invoiceNo: string;

  /**
   * 开票日期
   * 格式通常为yyyyMMddHHmmss
   */
  invoiceDate: string;

  /**
   * 发票总价
   * 不含税合计金额
   */
  totalAmount: number;

  /**
   * 发票总税额
   * 税额合计
   */
  totalTax: number;

  /**
   * 校验码
   * 用于发票查验的校验码，发票类型为01/02时不返回此参数
   */
  invoiceCheckCode?: string;

  /**
   * 二维码
   * 用于扫码查看发票
   */
  invoiceQrCode?: string;

  /**
   * 税控码
   * 税控码，发票类型为01/02时不返回此参数
   */
  taxControlCode?: string;

  /**
   * 发票类型代码
   */
  invoiceTypeCode?: string;

  /**
   * 流水号
   * 开票请求的唯一标识
   */
  serialNo?: string;

  /**
   * 电子发票地址
   * 电子发票下载链接
   */
  eInvoiceUrl?: string;

  /**
   * 发票明细集合
   */
  invoiceDetailsList?: Array<{
    /**
     * 明细行号
     */
    goodsLineNo: number;

    /**
     * 商品名称
     */
    goodsName: string;

    /**
     * 商品编码
     */
    goodsCode: string;

    /**
     * 商品单价
     */
    goodsPrice: number;

    /**
     * 单位
     */
    goodsUnit: string;

    /**
     * 商品数量
     */
    goodsQuantity: number;

    /**
     * 商品金额
     */
    goodsTotalPrice: number;

    /**
     * 税率
     */
    goodsTaxRate: number;

    /**
     * 商品税额
     */
    goodsTotalTax: number;

    /**
     * 含税标志
     * 0：不含税 1：含税
     */
    priceTaxMark: '0' | '1';
  }>;

  /**
     * 价税合计
     */
  invoiceTotalPriceTax?: number;
};

/**
 * 发票开具响应
 */
export type InvoicingResponse = ApiResponse<InvoicingResponseData>;
