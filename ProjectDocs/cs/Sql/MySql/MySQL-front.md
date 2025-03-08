## MySql 学习顺序
* MySQL概述
* SQL
* 函数
* 约束
* 多表查询
* 事物



---



## MySql 概述
> [!note|label:参考链接]
> 1. [黑马程序员 MySQL数据库](https://www.bilibili.com/video/BV1Kr4y1i7ru?)
> 1. [MySQL学习笔记（黑马）](https://jimhackking.github.io/%E8%BF%90%E7%BB%B4/MySQL%E5%AD%A6%E4%B9%A0%E7%AC%94%E8%AE%B0/#%E5%AE%89%E8%A3%85)
> 2. [教你彻底卸载MySQL 并重装（保姆级教程 ）](https://blog.csdn.net/weixin_56952690/article/details/129678685)

### 数据库相关概念

1. 概念介绍：

名称 | 全称 | 简称
-----|-----|----
数据库 | 存储数据的仓库，数据是有组织的进行存储 | DataBase(DB)
数据库管理系统 | 操纵和管理数据库的大型软件 | DataBase ManagementSystem(DBMS)
SQL | 操作关系型数据库的编程语言，定义了一套操作关系型数据库统一**标准** | Structured Query Language (SQL)

2. 主流的关系型数据库管理系统
> 无论使用哪一种关系型数据库，都需要使用 `SQL` 语言进行操作。
- Oracle
- MySQL
- Microsoft SQL Server
- PostgreSQL

### MySql 数据库

- 版本
    - 社区版
    - 商业版

- 下载安装
    - 进入[官网](https://www.mysql.com/cn/downloads/)
    - 下拉找到[MySQL Community (GPL) Downloads](https://dev.mysql.com/downloads/)并进入
    - 选择[MySQL Installer for Windows](https://dev.mysql.com/downloads/installer/)
    - 下载并安装
        - 选择安装目录
            > 以下均用 `%MySqlFILE%` 代替软件安装位置
            > 用 `MySqlDATABASE` 代替数据库位置
        - 配置用户名单
        - 配置网络服务
            > 以下均以 `mysql84` 代替网络服务名
            > 默认用 `3306` 作为访问端口
            > 默认开启开机自启动
- 启动 / 关闭 MySql 服务
    - 启动 `net start mysql84`
        - 默认开机自启
    - 关闭 `net stop mysql84`
- 客户端连接
    - MySql 提供的客户端命令行工具
    - 系统自带的命令行工具执行指令
        ```shell
        mysql [-h 127.0.0.1][-P 3306] -u root -p
        ```
        > 若想在任意位置执行该指令，则需要配置 `PATH` 环境变量
        > 在 `PATH` 环境变量中加入安装位置 `%MySqlFILE%`

 
- 关系型数据库(RDBMS)
    - 概念:建立在关系模型基础上，由多张相互连接的二维表组成的数据库
    - 特点:
        1. 使用表存储数据，格式统一，便于维护
        2. 使用SQL语言操作，标准统一，使用方便
    - 架构：
        - DBMS
            - 数据库 A
                - 表 A_1
                - 表 A_2
            - 数据库 B
                - 表 B
            - 数据库C
                - 表 C
