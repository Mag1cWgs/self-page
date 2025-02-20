## 1. 文档概述

简要介绍文档的目的、范围和主要内容。

---

## 2. 项目背景

描述项目的背景、目标和主要功能。

- 使用 C# 开发的 WinForm 版本的建议进销存管理系统。
- 使用 Microsoft SQL Server 2019 数据库。
- 使用 Krypton 窗体控件。
- 使用 NPOI 类库实现报表导出。
- 使用自定义布局控件实现窗体布局优化。

---

## 3. 系统架构

### 3.1 系统架构

#### 3.1.1 财务管理

- 进货统计
- 出货统计
- 利润统计
  - 整体利润
  - 客户户别利润

#### 3.1.2 基础信息

- 仓库统计
- 往来商品单价
- 往来单位信息
  - 采购供应商
  - 销售客户
- 商品信息管理

#### 3.1.3 采购订单

- 采购订单登记
- 采购订单确认
  - 未确认
  - 已确认
  - 采购中
  - 已入库
- 采购入库
- 采购退货

#### 3.1.4 销售订单

- 销售订单登记
- 销售订单确认
  - 未确认
  - 已确认
  - 出库中
  - 已出库
- 销售出库

#### 3.1.5 库存管理

- 现有库存统计
- 出库数量统计

### 3.2 主要组件

---

## 4. 功能模块

详细描述各个功能模块的设计和实现。

### 4.1 数据表的设计

#### 1. 主代码表（Main Code Table）
| 字段名          | 数据类型         | 约束          | 备注         |
| ------------ | ------------ | ----------- | ---------- |
| MainCode     | VARCHAR(50)  | PRIMARY KEY | 主代码，作为主键   |
| MainCodeName | VARCHAR(255) | NOT NULL    | 主代码名称，不可为空 |
| Notes        | TEXT         |             | 备注信息，可为空   |

#### 2. 子代码表（Subcode Table）
| 字段名         | 数据类型         | 约束                       | 备注          |
| ----------- | ------------ | ------------------------ | ----------- |
| MainCode    | VARCHAR(50)  | PRIMARY KEY, FOREIGN KEY | 主代码，作为主键和外键 |
| Subcode     | VARCHAR(50)  | PRIMARY KEY              | 子代码，作为主键    |
| SubcodeName | VARCHAR(255) | NOT NULL                 | 子代码名称，不可为空  |
| Notes       | TEXT         |                          | 备注信息，可为空    |

#### 3. 往来单位信息表（Unit Information Table）
| 字段名                 | 数据类型         | 约束          | 备注            |
| ------------------- | ------------ | ----------- | ------------- |
| UnitNumber          | VARCHAR(50)  | PRIMARY KEY | 单位编号，作为主键     |
| FullName            | VARCHAR(255) | NOT NULL    | 单位全称，不可为空     |
| Abbreviation        | VARCHAR(100) |             | 单位简称，可为空      |
| Address             | TEXT         |             | 单位地址，可为空      |
| ContactPerson       | VARCHAR(100) |             | 单位联系人，可为空     |
| ContactPhone        | VARCHAR(50)  |             | 联系电话，可为空      |
| TaxNumber           | VARCHAR(50)  |             | 税号，可为空        |
| UnitClassificationS | VARCHAR(100) |             | 单位分类（销售方），可为空 |
| UnitClassificationB | VARCHAR(100) |             | 单位分类（采购方），可为空 |
| Notes               | TEXT         |             | 备注信息，可为空      |

#### 4. 商品信息表
| 字段名             | 数据类型        | 约束          | 备注                   |
| ---------------- | ------------- | ----------- | -------------------- |
| ProductCode      | VARCHAR(50)    | PRIMARY KEY | 商品编码，作为主键       |
| ProductName      | VARCHAR(255)   | NOT NULL    | 商品名称，不可为空       |
| ProductSpecs     | VARCHAR(255)   |             | 商品规格，可为空         |
| ProductPrice     | DECIMAL(10, 2) | NOT NULL    | 商品单价，不可为空       |
| ProductUnit      | VARCHAR(100)   | FOREIGN KEY | 商品单位代码，外键关联   |
| ProductCategory  | VARCHAR(100)   | FOREIGN KEY | 商品分类代码，外键关联   |
| DefaultWarehouse | VARCHAR(100)   | FOREIGN KEY | 默认仓库代码，外键关联   |
| Notes            | TEXT           |             | 备注信息，可为空         |

- 商品单位代码
    | 字段名     | 数据类型        | 约束          | 备注                |
    | -------- | ------------- | ----------- | ------------------ |
    | UnitID   | VARCHAR(50)    | PRIMARY KEY | 单位编号，作为主键     |
    | UnitName | VARCHAR(255)   | NOT NULL    | 单位名称，不可为空     |

- 商品分类代码
    | 字段名     | 数据类型        | 约束          | 备注                |
    | -------- | ------------- | ----------- | ------------------ |
    | CategoryID | VARCHAR(50)    | PRIMARY KEY | 分类编号，作为主键     |
    | CategoryName | VARCHAR(255) | NOT NULL    | 分类名称，不可为空     |

- 默认仓库代码
    | 字段名       | 数据类型        | 约束          | 备注                  |
    | ----------- | ------------- | ----------- | -------------------- |
    | WarehouseID | VARCHAR(100)   | PRIMARY KEY | 仓库编号，作为主键       |
    | WarehouseName | VARCHAR(255) | NOT NULL    | 仓库名称，不可为空       |

#### 5. 商品往来单价信息表
| 字段名        | 数据类型        | 约束          | 备注                 |
| ------------ | ------------- | ----------- | ---------------------- |
| UnitID       | VARCHAR(50)    | PRIMARY KEY | 单位编号，作为主键      |
| ProductCode | VARCHAR(50)    | PRIMARY KEY | 商品编号，作为主键       |
| Price       | DECIMAL(10, 2) |             | 商品单价，可为空         |
| Notes       | TEXT           |             | 备注信息，可为空         |

#### 6. 税率表
> 用于[采购信息综合表](#9-采购信息综合表)

| 字段名         | 数据类型     | 说明                |
|--------------|------------|-----------------------|
| TaxRateID    | VARCHAR(50) | 税率编号，主键        |
| TaxName      | VARCHAR(100) | 税率名称            |
| TaxRate      | DECIMAL(5,2) | 税率比例            |

#### 7. 人员信息表
> 用于[采购信息综合表](#9-采购信息综合表)

| 字段名         | 数据类型     | 说明                |
|--------------|------------|----------------------|
| BuyerID      | INT        | 采购者编号，主键       |
| BuyerName    | VARCHAR(100) | 采购姓名             |
| ContactNumber | VARCHAR(20) | 联系电话             |

#### 8. 库存表
> 表设计相较实际系统更加简易

| 字段名         | 数据类型     | 说明                   |
|--------------|------------|--------------------------|
| RecordID     | INT        | 入库编号，主键，自增       |
| OrderID      | VARCHAR(50) | 采购/销售订单编号         |
| ProductID    | VARCHAR(50) | 商品编号                 |
| Quantity     | INT        | 商品数量                  |
| Date         | DATE       | 入库/出库日期             |
| WarehouseID  | VARCHAR(50) | 入库/出库仓库编号         |


#### 9. 采购信息综合表
| 字段名             | 数据类型     | 说明                 |
|------------------|------------|-------------------------|
| PurchaseOrderID  | VARCHAR(50) | 采购订单编号，可自动生成  |
| SupplierID       | VARCHAR(50) | 供应商编号              |
| OrderDate        | DATE       | 下单日期                 |
| BuyerID          | INT        | 采购者信息，外键关联      |
| OrderTypeID      | VARCHAR(50) | 订单类型，外键关联       |
| DeliveryDeadline | DATE       | 预计最迟送货日期         |
| PaymentMethodID  | VARCHAR(50) | 付款方式，外键关联       |
| TaxRateID        | VARCHAR(50) | 税率，外键关联          |
| TaxAmount        | DECIMAL(10,2) | 税额                 |
| PreTaxAmount     | DECIMAL(10,2) | 订单税前金额        |
| TotalAmount      | DECIMAL(10,2) | 订单含税金额        |
| Notes            | TEXT       | 备注信息           |

- 付款方式表
    | 字段名            | 数据类型     | 说明            |
    |-----------------|------------|-------------------|
    | PaymentMethodID | VARCHAR(50) | 付款方式编号，主键 |
    | MethodName      | VARCHAR(100) | 付款方式名称     |

- 订单类型表（国内/国外）
    | 字段名            | 数据类型     | 说明          |
    |-----------------|------------|-----------------|
    | OrderTypeID      | VARCHAR(50) | 类型编号，主键  |
    | TypeName        | VARCHAR(100) | 类型名称       |

#### 10. 采购信息明细表.
| 字段名    | 数据类型     | 约束信息            | 说明         |
|------------------|------------|-----------------|---------------------------------|
| PurchaseOrderID  | VARCHAR(50) | PRIMARY KEY       | 采购订单编号，可自动生成，主键    |
| ProductID        | VARCHAR(50) | PRIMARY KEY, FOREIGN KEY  | 商品编号，主键 |
| Quantity         | INT        | NOT NULL    | 采购数量   |
| UnitPrice        | DECIMAL(10,2) | CHECK (UnitPrice > 0) | 采购单价（参考往来信息表，可修改）    |
| TaxRateID        | VARCHAR(50) | FOREIGN KEY                      | 税率 （独立表，外键关联税率表）  |
| TaxAmount        | DECIMAL(10,2) | AS (Quantity * UnitPrice * TaxRate) | 根据采购数量、单价和税率计算的税额   |
| PreTaxAmount  | DECIMAL(10,2) | AS (Quantity * UnitPrice)  | 未税金额，等于采购数量乘以单价    |
| TotalAmount  | DECIMAL(10,2) | AS (PreTaxAmount + TaxAmount) | 含税金额，等于未税金额加上税额   |
| WarehouseID      | INT        | FOREIGN KEY   | 入库仓库，外键关联仓库表    |
| Notes            | TEXT       |    | 备注信息    |

- 入库仓库表
    | 字段名       | 数据类型    | 约束信息        | 说明             |
    |--------------|------------|----------------|-----------------|
    | WarehouseID   | INT        | PRIMARY KEY   | 仓库编号，主键   |
    | WarehouseName | VARCHAR(100) | NOT NULL    | 仓库名称         |

#### 11. 销售信息综合表
| 字段名                   | 数据类型     | 约束            | 备注                                                 |
|------------------------|------------|---------------|----------------------------------------------------|
| SaleOrderID             | VARCHAR(50) | PRIMARY KEY   | 销售订单编号，可自动生成，主键                             |
| CustomerID              | VARCHAR(50) | FOREIGN KEY   | 订货商编号，外键关联客户信息表                             |
| OrderDate               | DATE       | NOT NULL      | 下单日期                                               |
| SalespersonID           | INT        | FOREIGN KEY   | 销售者信息，外键关联销售者信息表                           |
| OrderTypeID             | VARCHAR(50) | FOREIGN KEY   | 订单类型，外键关联订单类型信息表                           |
| DeliveryDeadline        | DATE       | NOT NULL      | 预计最迟出货日期                                       |
| DeliveryMethodID        | VARCHAR(50) | FOREIGN KEY   | 配送方式，外键关联配送方式信息表                           |
| CourierCompanyID        | VARCHAR(50) | FOREIGN KEY   | 物流快递公司编号，外键关联物流信息表                       |
| PaymentMethodID         | VARCHAR(50) | FOREIGN KEY   | 收款方式，外键关联收款方式信息表                           |
| TaxRateID               | VARCHAR(50) | FOREIGN KEY   | 税率，外键关联税率信息表                                 |
| TaxAmount               | DECIMAL(10,2) | AS (SaleAmount * TaxRate) | 根据销售金额和税率计算的税额                         |
| PreTaxAmount            | DECIMAL(10,2) | AS (SaleAmount - TaxAmount) | 未含税金额，等于销售金额减去税额                       |
| TotalAmount             | DECIMAL(10,2) | AS (PreTaxAmount + TaxAmount) | 含税金额，等于未税金额加上税额                       |
| Notes                   | TEXT       |              | 备注信息                                               |

- 配送方式表
        | 字段名               | 数据类型     | 约束          | 备注                   |
        |--------------------|------------|-------------|--------------------------|
        | DeliveryMethodID    | VARCHAR(50) | PRIMARY KEY | 配送方式编号，作为主键   |
        | DeliveryMethodName  | VARCHAR(100)| NOT NULL    | 配送方式名称，不可为空   |

- 物流/快递公司编号表
    | 字段名                | 数据类型     | 约束          | 备注          |
    |---------------------|------------|-------------|------------------------------|
    | CourierCompanyID     | VARCHAR(50) | PRIMARY KEY | 物流公司编号，作为主键       |
    | CourierCompanyName   | VARCHAR(100)| NOT NULL    | 物流公司名称，不可为空      |

- 收款方式表
    | 字段名               | 数据类型     | 约束          | 备注                  |
    |--------------------|------------|-------------|---------------------------|
    | PaymentMethodID     | VARCHAR(50) | PRIMARY KEY | 收款方式编号，作为主键     |
    | PaymentMethodName   | VARCHAR(100)| NOT NULL    | 收款方式名称，不可为空     |

- 订单类型信息表（国内/国外）
    | 字段名            | 数据类型     | 说明          |
    |-----------------|------------|-----------------|
    | OrderTypeID      | VARCHAR(50) | 类型编号，主键  |
    | TypeName        | VARCHAR(100) | 类型名称       |

#### 12. 销售信息明细表
- 销售信息明细表
    - 销售订单编号（主键）
    - 商品编号（主键）
    - 数量
    - 单价
    - 税率（独立表）
    - 税额
    - 未税金额
    - 含税金额
    - 出库仓库（独立表）
    - 备注信息

- 出库仓库表
    | 字段名       | 数据类型    | 约束信息        | 说明             |
    |--------------|------------|----------------|-----------------|
    | WarehouseID   | INT        | PRIMARY KEY   | 仓库编号，主键   |
    | WarehouseName | VARCHAR(100) | NOT NULL    | 仓库名称         |

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
