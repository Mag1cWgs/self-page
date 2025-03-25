## 1. 文档概述

简要介绍文档的目的、范围和主要内容。

---

## 2. 项目背景

描述项目的背景、目标和主要功能。

>[!note]
> 代码仓库地址:
> - [Gitee](https://gitee.com/mag1cwgs/simple-erp-system-winform-net-f4.8)
> - [GitHub](https://github.com/Mag1cWgs/Simple-ERP-System-Winform-NetF4.8)

- 使用 C# 开发的 WinForm 版本的建议进销存管理系统。
- 使用 Microsoft SQL Server 2019 数据库。
- 使用 Krypton 窗体控件。
- 使用 NPOI 类库实现报表导出。
- 使用自定义布局控件实现窗体布局优化。


### 2.1 面对业务

#### 2.1.1 财务管理
- 进货统计
- 出货统计
- 利润统计
  - 整体利润
  - 客户户别利润

#### 2.1.2 基础信息
- 仓库统计
- 往来商品单价
- 往来单位信息
  - 采购供应商
  - 销售客户
- 商品信息管理

#### 2.1.3 采购订单
- 采购订单登记
- 采购订单确认
  - 未确认
  - 已确认
  - 采购中
  - 已入库
- 采购入库
- 采购退货

#### 2.1.4 销售订单
- 销售订单登记
- 销售订单确认
  - 未确认
  - 已确认
  - 出库中
  - 已出库
- 销售出库

#### 2.1.5 库存管理
- 现有库存统计
- 出库数量统计


---

## 3. 系统架构

### 3.1 系统架构分层
- 表示层(UI):       表示信息，处理用户的请求，与用户进行交互
- 逻辑层(BLL):      实际的业务活动
- 数据层(DAL):      与数据库进行通信
- 实体对象(Model):  实体对象

>[!note]
> 实际上如下
> ```
> 表示层
> |   ↓
> |  逻辑层     (被上层调用)
> |  |  ↓
> |  |  数据层  (被上层调用)
> ↓  ↓  ↓
> 实体对象   (被三层共同调用)
> ```

### 3.2 主要组件

---

## 4. 功能模块

详细描述各个功能模块的设计和实现。


### 4.1 基础信息表的设计

#### 1. 主代码表（b_major）

| 列名       | 数据类型       | 约束         | 备注             |
| --------- | -------------- | ----------- | --------------- |
| major_cd  | nvarchar(6)    | PRIMARY KEY | 主代码，作为主键  |
| major_nm  | nvarchar(50)   | NOT NULL    | 主代码名         |
| remark    | nvarchar(100)  | -           | 备注             |
| ins_user  | nvarchar(6)    | NOT NULL    | 创建者用户ID     |
| ins_date  | datetime       | NOT NULL    | 创建日期         |
| up_user   | nvarchar(6)    | NOT NULL    | 更新者用户ID     |
| up_date   | datetime       | NOT NULL    | 更新日期         |

#### 2. 子代码表（b_minor）

| 列名        | 数据类型          | 约束             | 备注                   |
|------------|------------------|------------------|------------------------|
| major_cd   | nvarchar(6)      | PRIMARY KEY, FOREIGN KEY | 主代码，作为主键和外键 |
| minor_cd   | nvarchar(6)      | PRIMARY KEY              | 子代码，作为联合主键   |
| minor_nm   | nvarchar(50)     | NOT NULL                 | 子代码名             |
| remark     | nvarchar(100)    | -                        | 备注                 |
| ins_user   | nvarchar(6)      | NOT NULL                 | 创建者用户ID         |
| ins_date   | datetime         | NOT NULL                 | 创建日期             |
| up_user    | nvarchar(6)      | NOT NULL                 | 更新者用户ID         |
| up_date    | datetime         | NOT NULL                 | 更新日期             |


#### 3. 往来单位信息表（b_partner）

| 列名         | 数据类型         | 约束          | 备注                 |
|--------------|-----------------|--------------|----------------------|
| bp_cd        | nvarchar(10)    | PRIMARY KEY  | 业务伙伴代码，作为主键 |
| bp_full_nm   | nvarchar(100)   | NOT NULL     | 业务伙伴全名          |
| bp_nm        | nvarchar(20)    | NOT NULL     | 业务伙伴简称          |
| bp_addr      | nvarchar(200)   | NOT NULL     | 业务伙伴地址          |
| bp_repre     | nvarchar(20)    | NOT NULL     | 业务伙伴代表          |
| bp_tel       | nvarchar(20)    | -            | 业务伙伴电话          |
| bp_email     | nvarchar(30)    | -            | 业务伙伴邮箱          |
| bp_tax       | nvarchar(30)    | NOT NULL     | 业务伙伴税号          |
| so_flag      | nvarchar(2)     | NOT NULL     | 销售单位标志          |
| po_flag      | nvarchar(2)     | NOT NULL     | 采购单位标志          |
| bank_cd      | nvarchar(10)    | FOREIGN KEY  | 银行代码              |
| bank_acct_no | nvarchar(30)    | NOT NULL     | 银行账号              |
| pay_type     | nvarchar(4)     | NOT NULL     | 支付类型              |
| remark       | nvarchar(200)   | -            | 备注                  |
| ins_user     | nvarchar(6)     | NOT NULL     | 创建者用户ID          |
| ins_date     | datetime        | NOT NULL     | 创建日期              |
| up_user      | nvarchar(6)     | NOT NULL     | 更新者用户ID          |
| up_date      | datetime        | NOT NULL     | 更新日期              |


#### 4. 税率表（b_tax）

| 列名         | 数据类型         | 约束          | 备注                 |
|--------------|-----------------|--------------|----------------------|
| tax_cd       | nvarchar(10)    | PRIMARY KEY  | 税码，作为主键         |
| tax_nm       | nvarchar(30)    | NOT NULL     | 税种名称              |
| tax_rate     | numeric(18,4)   | NOT NULL     | 税率，保留四位小数     |
| remark       | nvarchar(200)   | -            | 备注                 |
| ins_user     | nvarchar(6)     | NOT NULL     | 创建者用户ID          |
| ins_date     | datetime        | NOT NULL     | 创建日期              |
| up_user      | nvarchar(6)     | NOT NULL     | 更新者用户ID          |
| up_date      | datetime        | NOT NULL     | 更新日期              |


#### 5. 人员信息表（b_user）

| 列名     | 数据类型       | 约束           | 备注                |
|----------|-------------  |---------------|---------------------|
| user_cd  | nvarchar(6)   | PRIMARY KEY   | 用户代码，作为主键     |
| user_nm  | nvarchar(20)  | NOT NULL      | 用户姓名              |
| tel_no   | nvarchar(20)  | NOT NULL      | 电话号码              |
| dept_nm  | nvarchar(30)  | NOT NULL      | 部门名称              |
| remark   | nvarchar(200) | -             | 备注                  |
| ins_user | nvarchar(6)   | NOT NULL      | 创建者用户ID          |
| ins_date | datetime      | NOT NULL      | 创建日期              |
| up_user  | nvarchar(6)   | NOT NULL      | 更新者用户ID          |
| up_date  | datetime      | NOT NULL      | 更新日期              |

#### 6. 系统用户表（sys_user）

| 列名             | 数据类型      | 约束         | 备注                    |
|------------------|---------------|--------------|-----------------------|
| user_id          | nvarchar(6)   | PRIMARY KEY  | 用户ID，作为主键       |
| user_pwd         | nvarchar(100) | NOT NULL     | 用户密码              |
| last_enter_date  | datetime      | NOT NULL     | 最后登录日期           |
| user_cd          | nvarchar(6)   | NOT NULL     | 用户代码，可外联验证    |
| remark           | nvarchar(200) | -            | 备注信息               |
| ins_user         | nvarchar(6)   | NOT NULL     | 创建者用户ID           |
| ins_date         | datetime      | NOT NULL     | 创建日期               |
| up_user          | nvarchar(6)   | NOT NULL     | 更新者用户ID           |
| up_date          | datetime      | NOT NULL     | 更新日期               |



### 4.2 商品管理表的设计

#### 1. 商品信息表（b_item）

| 列名          | 数据类型      | 约束           | 备注                       |
|--------------|---------------|---------------|----------------------------|
| item_cd      | nvarchar(10)  | PRIMARY KEY   | 商品编码，作为主键           |
| item_nm      | nvarchar(50)  | NOT NULL      | 商品名称                    |
| item_spec    | nvarchar(100) | NOT NULL      | 商品规格                    |
| item_price   | numeric(18,4) | NOT NULL      | 商品价格                    |
| item_unit    | nvarchar(4)   | NOT NULL      | 商品单位，可外键关联         |
| item_group   | nvarchar(4)   | NOT NULL      | 存储仓库分组，可外键关联     |
| sl_cd        | nvarchar(4)   | NOT NULL      | 默认仓库代码，可外键关联     |
| remark       | nvarchar(200) | -             | 备注                       |
| ins_user     | nvarchar(6)   | NOT NULL      | 创建者用户ID                |
| ins_date     | datetime      | NOT NULL      | 创建日期                    |
| up_user      | nvarchar(6)   | NOT NULL      | 更新者用户ID                |
| up_date      | datetime      | NOT NULL      | 更新日期                    |


- 商品单位代码（item_unit）
  | 字段名     | 数据类型         | 约束          | 备注        |
  | ------- | ------------ | ----------- | --------- |
  | unit_id | VARCHAR(50)  | PRIMARY KEY | 单位编号，作为主键 |
  | unit_nm | VARCHAR(255) | NOT NULL    | 单位名称，不可为空 |

- 商品分类代码（item_group）
  | 字段名      | 数据类型         | 约束          | 备注        |
  | -------- | ------------ | ----------- | --------- |
  | group_id | VARCHAR(50)  | PRIMARY KEY | 分类编号，作为主键 |
  | group_nm | VARCHAR(255) | NOT NULL    | 分类名称，不可为空 |

- 默认仓库代码（item_sl_cd）
  | 字段名      | 数据类型         | 约束          | 备注        |
  | -------- | ------------ | ----------- | --------- |
  | sl_cd_id | VARCHAR(100) | PRIMARY KEY | 仓库编号，作为主键 |
  | sl_cd_nm | VARCHAR(255) | NOT NULL    | 仓库名称，不可为空 |

#### 2. 商品往来单价信息表（b_item_price）

| 列名      | 数据类型        | 约束           | 备注                |
|----------|---------------  |---------------|---------------------|
| bp_cd    | nvarchar(10)    | PRIMARY KEY   | 业务伙伴代码，作为主键 |
| item_cd  | nvarchar(10)    | PRIMARY KEY   | 商品编号，作为主键     |
| item_price | numeric(18,4) | NOT NULL      | 商品单价              |
| remark   | nvarchar(200)   | -             | 备注                 |
| ins_user | nvarchar(6)     | NOT NULL      | 创建者用户ID          |
| ins_date | datetime        | NOT NULL      | 创建日期              |
| up_user  | nvarchar(6)     | NOT NULL      | 更新者用户ID          |
| up_date  | datetime        | NOT NULL      | 更新日期              |


### 4.3 库存表

> 表设计相较实际系统更加简易

| 字段名         | 数据类型        | 说明         |
| ----------- | ----------- | ---------- |
| RecordID    | INT         | 入库编号，主键，自增 |
| OrderID     | VARCHAR(50) | 采购/销售订单编号  |
| ProductID   | VARCHAR(50) | 商品编号       |
| Quantity    | INT         | 商品数量       |
| Date        | DATE        | 入库/出库日期    |
| WarehouseID | VARCHAR(50) | 入库/出库仓库编号  |



### 4.4 采购信息表

#### 1. 采购信息综合表

| 字段名             | 数据类型          | 说明           |
| --------------- | ------------- | ------------ |
| po_no           | VARCHAR(50)   | 采购订单编号，可自动生成 |
| bp_cd           | VARCHAR(50)   | 供应商编号        |
| po_date         | DATE          | 下单日期         |
| user_cd         | INT           | 采购者信息，外键关联   |
| po_type         | VARCHAR(50)   | 订单类型，外键关联    |
| last_date       | DATE          | 预计最迟送货日期     |
| PaymentMethodID | VARCHAR(50)   | 付款方式，外键关联    |
| TaxRateID       | VARCHAR(50)   | 税率，外键关联      |
| TaxAmount       | DECIMAL(10,2) | 税额           |
| PreTaxAmount    | DECIMAL(10,2) | 订单税前金额       |
| TotalAmount     | DECIMAL(10,2) | 订单含税金额       |
| Notes           | TEXT          | 备注信息         |

- 采购者信息表
  | 字段名           | 数据类型         | 说明       |
  | ------------- | ------------ | -------- |
  | BuyerID       | INT          | 采购者编号，主键 |
  | BuyerName     | VARCHAR(100) | 采购姓名     |
  | ContactNumber | VARCHAR(20)  | 联系电话     |

- 付款方式表
  | 字段名             | 数据类型         | 说明        |
  | --------------- | ------------ | --------- |
  | PaymentMethodID | VARCHAR(50)  | 付款方式编号，主键 |
  | MethodName      | VARCHAR(100) | 付款方式名称    |

- 订单类型表（国内/国外）
  | 字段名         | 数据类型         | 说明      |
  | ----------- | ------------ | ------- |
  | OrderTypeID | VARCHAR(50)  | 类型编号，主键 |
  | TypeName    | VARCHAR(100) | 类型名称    |

#### 2. 采购信息明细表

| 字段名             | 数据类型          | 约束信息                                | 说明                |
| --------------- | ------------- | ----------------------------------- | ----------------- |
| PurchaseOrderID | VARCHAR(50)   | PRIMARY KEY                         | 采购订单编号，可自动生成，主键   |
| ProductID       | VARCHAR(50)   | PRIMARY KEY, FOREIGN KEY            | 商品编号，主键           |
| Quantity        | INT           | NOT NULL                            | 采购数量              |
| UnitPrice       | DECIMAL(10,2) | CHECK (UnitPrice > 0)               | 采购单价（参考往来信息表，可修改） |
| TaxRateID       | VARCHAR(50)   | FOREIGN KEY                         | 税率 （独立表，外键关联税率表）  |
| TaxAmount       | DECIMAL(10,2) | AS (Quantity * UnitPrice * TaxRate) | 根据采购数量、单价和税率计算的税额 |
| PreTaxAmount    | DECIMAL(10,2) | AS (Quantity * UnitPrice)           | 未税金额，等于采购数量乘以单价   |
| TotalAmount     | DECIMAL(10,2) | AS (PreTaxAmount + TaxAmount)       | 含税金额，等于未税金额加上税额   |
| WarehouseID     | INT           | FOREIGN KEY                         | 入库仓库，外键关联仓库表      |
| Notes           | TEXT          |                                     | 备注信息              |

- 入库仓库表
  | 字段名           | 数据类型         | 约束信息        | 说明      |
  | ------------- | ------------ | ----------- | ------- |
  | WarehouseID   | INT          | PRIMARY KEY | 仓库编号，主键 |
  | WarehouseName | VARCHAR(100) | NOT NULL    | 仓库名称    |



### 4.5 销售信息表

#### 1. 销售信息综合表

| 字段名          | 数据类型          | 约束                            | 备注                 |
| ------------ | ------------- | ----------------------------- | ------------------ |
| so_no        | VARCHAR(50)   | PRIMARY KEY                   | 销售订单编号，可自动生成，主键    |
| bp_cd        | VARCHAR(50)   | FOREIGN KEY                   | 订货商编号，外键关联客户信息表    |
| bp_date      | DATE          | NOT NULL                      | 下单日期               |
| user_cd      | INT           | FOREIGN KEY                   | 销售者信息，外键关联销售者信息表   |
| so_type      | VARCHAR(50)   | FOREIGN KEY                   | 订单类型，外键关联订单类型信息表   |
| last_data    | DATE          | NOT NULL                      | 预计最迟出货日期           |
| exp_type     | VARCHAR(50)   | FOREIGN KEY                   | 配送方式，外键关联配送方式信息表   |
| exp_cd       | VARCHAR(50)   | FOREIGN KEY                   | 物流快递公司编号，外键关联物流信息表 |
| receipt_type | VARCHAR(50)   | FOREIGN KEY                   | 收款方式，外键关联收款方式信息表   |
| tax_cd       | VARCHAR(50)   | FOREIGN KEY                   | 税率，外键关联税率信息表       |
| tax_amt      | DECIMAL(10,2) | AS (SaleAmount * TaxRate)     | 根据销售金额和税率计算的税额     |
| pre_tax_amt  | DECIMAL(10,2) | AS (SaleAmount - TaxAmount)   | 未含税金额，等于销售金额减去税额   |
| inc_tax_amt  | DECIMAL(10,2) | AS (PreTaxAmount + TaxAmount) | 含税金额，等于未税金额加上税额    |
| confirm_type | BIT           | NOT NULL                      | 确认与否               |
| so_state     | VARCHAR(50)   | FOREIGN KEY                   | 订单状态，外键关联          |
| remark       | TEXT          |                               | 备注信息               |

- 配送方式表（exp_type）
  | 字段名               | 数据类型     | 约束          | 备注                   |
  |--------------------|------------|-------------|--------------------------|
  | exp_type_id   | VARCHAR(50) | PRIMARY KEY | 配送方式编号，作为主键   |
  | exp_type_nm  | VARCHAR(100)| NOT NULL    | 配送方式名称，不可为空   |

- 物流/快递公司编号表（exp_cd）
  | 字段名        | 数据类型         | 约束          | 备注          |
  | ---------- | ------------ | ----------- | ----------- |
  | exp_com_cd | VARCHAR(50)  | PRIMARY KEY | 物流公司编号，作为主键 |
  | exp_com_nm | VARCHAR(100) | NOT NULL    | 物流公司名称，不可为空 |

- 收款方式表（receipt_type）
  | 字段名        | 数据类型         | 约束          | 备注          |
  | ---------- | ------------ | ----------- | ----------- |
  | receipt_id | VARCHAR(50)  | PRIMARY KEY | 收款方式编号，作为主键 |
  | receipt_nm | VARCHAR(100) | NOT NULL    | 收款方式名称，不可为空 |

- 订单类型信息表（国内/国外）（so_type）
  | 字段名        | 数据类型         | 说明      |
  | ---------- | ------------ | ------- |
  | so_type_id | VARCHAR(50)  | 类型编号，主键 |
  | so_type_nm | VARCHAR(100) | 类型名称    |

#### 2. 销售信息明细表

| 字段名              | 数据类型          | 约束                                  | 备注                 |
| ---------------- | ------------- | ----------------------------------- | ------------------ |
| so_no            | VARCHAR(50)   | PRIMARY KEY                         | 销售订单编号，作为主键        |
| item_cd          | VARCHAR(50)   | PRIMARY KEY, FOREIGN KEY            | 商品编号，与商品信息表关联，作为主键 |
| item_qty         | INT           | NOT NULL                            | 数量，不可为空            |
| item_price       | DECIMAL(10,2) | NOT NULL                            | 单价，不可为空            |
| item_tax_rate    | VARCHAR(50)   | FOREIGN KEY                         | 税率，外键关联税率信息表       |
| item_tax_amp     | DECIMAL(10,2) | AS (Quantity * UnitPrice * TaxRate) | 根据数量、单价和税率计算的税额    |
| item_pre_tax_amp | DECIMAL(10,2) | AS (Quantity * UnitPrice)           | 未税金额，等于数量乘以单价      |
| item_inc_tax_amp | DECIMAL(10,2) | AS (PreTaxAmount + TaxAmount)       | 含税金额，等于未税金额加上税额    |
| sl_cd            | VARCHAR(50)   | FOREIGN KEY                         | 出库仓库，外键关联仓库表       |
| remark           | TEXT          |                                     | 备注信息               |

- 出库仓库表
  | 字段名           | 数据类型         | 约束信息        | 说明      |
  | ------------- | ------------ | ----------- | ------- |
  | WarehouseID   | INT          | PRIMARY KEY | 仓库编号，主键 |
  | WarehouseName | VARCHAR(100) | NOT NULL    | 仓库名称    |

### 4.6 系统消息代码
- 操作成功
  | 消息代码  | 具体信息                         |
  |----------|---------------------------------|
  | 0000     | 操作成功！                       |
  | 0001     | 保存成功，请确认！已自动查询保存后数据！|

- 数据库操作异常
  | 消息代码  | 具体信息                       |
  |----------|-------------------------------|
  | 1001     | 已经存在相同的主代码，无法添加！ |
  | 1002     | 查找失败！未找到所要操作数据，请确认查找条件是否正确。|
  | 1003     | 插入失败！                      |
  | 1004     | 删除失败！未找到待删除数据！     |
  | 1005     | 更新失败！未找到待更新数据！     |
  | 1006     | 删除失败！子代码表中有当前主代码关联数据，请清除子代码表中与之关联所有数据后再执行删除！|
  | 1007     | 输入的数据类型不正确！例如：在要求数字类型的位置输入了文本。|
  | 1008     | 删除失败！要删除的商品信息有关联的采购订单，请先清除相关的采购订单再操作！|
  | 1009     | 删除失败！要删除的商品信息有关联的销售订单，请先清除相关的采购订单再操作！|
  | 1010     | 删除失败！要删除的商品信息有关联的商品单价信息，请先清除相关的商品单价信息再操作！|

- 窗体内异常提示
  | 消息代码  | 具体信息                        |
  |----------|--------------------------------|
  | 2000     | 未填写必填信息！请检查并填写完整！ |
  | **主代码表**  | `b_major`                 |
  | 2001     | 主代码编号不能为空！             |
  | 2002     | 主代码名称不能为空！             |
  | **子代码表**  | `b_minor`                 |
  | 2003     | 子代码编号不能为空！             |
  | 2004     | 子代码名称不能为空！             |
  | **往来单位表** | `b_partner`               |
  | 2005     | 上游销售方和下游采购方至少选择一种！|
  | **税率表**    | `b_tax`                    |
  | 2006     | 税率编号不能为空！               |
  | 2007     | 税率名称不能为空！               |
  | 2008     | 税率比例不能为空！               |
  | **人员信息表** | `b_user`                 |
	| 2009     | 人员编号不能为空！               |
	| 2010     | 人员名称不能为空！               |
	| 2011     | 联系电话不能为空！               |
	| 2012     | 所属部门不能为空！               |
  | **商品信息表** | `b_item`                  |
	| 2013     | 商品编号不能为空！               |
	| 2014     | 商品名称不能为空！               |
	| 2015     | 商品单价不能为空！               |
	| 2016     | 商品单位不能为空！               |
  | 2017     | 商品分类不能为空！               |
  | **商品单价表** | `b_item_price`            |
  | 2018     | 商品单价所属往来单位编号不能为空！ |
  | **通用提示** |                                |
  | 2101     | 当前有尚未保存数据！继续当前操作请按「Yes」，否则请按「No」。注意：继续操作可能丢失未保存数据！|
  | 2101     | 您确定要删除所选择的数据吗？确认操作请按「Yes」，否则请按「No」。 |


- 全局异常
  | 消息代码  | 具体信息                       |
  |----------|-------------------------------|
  | 9999     | 未知错误！                     | 


---

## 5. 数据模型

说明系统涉及的主要数据结构和关系。

---

## 6. 接口文档

描述系统对外提供的API接口。

---

## 7. 部署指南

提供系统部署和配置的详细步骤。

---

## 8. 常见问题

列出可能遇到的问题及解决方案。
