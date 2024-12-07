## 目录
- SQL 通用语法
- SQL 分类
- DDL: 数据定义语言，用来定义数据库对象（数据库、表、字段）
- DML: 数据操作语言，用来对数据库表中的数据进行增删改
- DQL: 数据查询语言，用来查询数据库中表的记录
- DCL: 数据控制语言，用来创建数据库用户、控制数据库的控制权限

## SQL通用语法
1. SQL 语句可以单行或多行书写，以分号结尾。
2. SQL 语句可以使用空格/缩进来增强语句的可读性。
3. MySQL 数据库的 SQL 语句不区分大小写，关键字建议使用大写，
4. 注释:
    - 单行注释: `--注释内容` 或 `#注释内容` (MySQL特有)
    - 多行注释: `/*注释内容 */`

## SQL 分类
分类 | 全称 | 说明
----|------|-----
DDL | Data Definition Language | 数据定义语言，用来定义数据库对象（数据库、表、字段）
DML | Data Manipulation Language | 数据操作语言，用来对数据库表中的数据进行增删改
DQL | Data Query Language | 数据查询语言，用来查询数据库中表的记录
DCL | Data Control Language | 数据控制语言，用来创建数据库用户、控制数据库的控制权限

## DDL 数据定义语言

### 数据库操作

```sql
-- 查询所有数据库：
SHOW DATABASES ;
    -- 注意分号前有空格
--查询当前数据库：
SELECT DATABASE();
-- 创建数据库：
CREATE DATABASE [ IF NOT EXISTS ] 数据库名 [DEFAULT CHARSET 字符集] [COLLATE 排序规则];
    -- 此处分号前无空格
    -- 重名时报错，可以用 [ IF NOT EXISTS ]
    -- 设置默认字符集时用 [DEFAULT CHARSET 字符集]
        -- 一般用 utf8mb4 字符集，避免三字符出错
-- 删除数据库：
DROP DATABASE [ IF EXISTS ] 数据库名;
-- 使用数据库：
USE 数据库名;
```

### 表操作

```sql
-- 查询当前数据库所有表：
SHOW TABLES;
-- 查询表结构：
DESC 表名;
-- 查询指定表的建表语句：
SHOW CREATE TABLE 表名;


-- 创建表：
CREATE TABLE 表名(
	字段1 字段1类型 [COMMENT 字段1注释],
	字段2 字段2类型 [COMMENT 字段2注释],
	字段3 字段3类型 [COMMENT 字段3注释],
	...
	字段n 字段n类型 [COMMENT 字段n注释]
)[ COMMENT 表注释 ];
    -- 最后一个字段后面 没有 逗号


-- 添加字段：
ALTER TABLE 表名 ADD 字段名 类型(长度) [COMMENT 注释] [约束];
    -- 例：ALTER TABLE emp ADD nickname varchar(20) COMMENT '昵称';


-- 修改数据类型：
ALTER TABLE 表名 MODIFY 字段名 新数据类型(长度);
-- 修改字段名和字段类型：
ALTER TABLE 表名 CHANGE 旧字段名 新字段名 类型(长度) [COMMENT 注释] [约束];
    --例：将emp表的nickname字段修改为username，类型为varchar(30)
    -- ALTER TABLE emp CHANGE nickname username varchar(30) COMMENT '昵称';


-- 删除字段：
ALTER TABLE 表名 DROP 字段名;


-- 修改表名：
ALTER TABLE 表名 RENAME TO 新表名


-- 删除表：
DROP TABLE [IF EXISTS] 表名;
-- 删除表，并重新创建该表：
TRUNCATE TABLE 表名;

```






## DML 数据操作语言

### 添加数据
> - 字符串和日期类型数据应该包含在引号中
> - 插入的数据大小应该在字段的规定范围内
```sql
-- 指定字段：
INSERT INTO 表名 (字段名1, 字段名2, ...) VALUES (值1, 值2, ...);
-- 全部字段：
INSERT INTO 表名 VALUES (值1, 值2, ...);

-- 批量添加数据：
INSERT INTO 表名 (字段名1, 字段名2, ...) VALUES (值1, 值2, ...), (值1, 值2, ...), (值1, 值2, ...);
INSERT INTO 表名 VALUES (值1, 值2, ...), (值1, 值2, ...), (值1, 值2, ...);
```

### 修改数据
```sql
-- 修改数据：
UPDATE 表名 SET 字段名1 = 值1, 字段名2 = 值2, ... [ WHERE 条件 ];
    -- 例：
    -- UPDATE emp SET name = 'Jack' WHERE id = 1;

-- 删除数据：
DELETE FROM 表名 [ WHERE 条件 ];
```



