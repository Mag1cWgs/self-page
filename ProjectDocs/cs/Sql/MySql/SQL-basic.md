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

## 1. DDL 数据定义语言

### 1.1 数据库操作(查询、创建、删除、使用)

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

### 1.2 表操作（增删改查）

1. 创建表

```sql
CREATE TABLE 表名(
	字段1 字段1类型 [COMMENT 字段1注释],
	字段2 字段2类型 [COMMENT 字段2注释],
	字段3 字段3类型 [COMMENT 字段3注释],
	...
	字段n 字段n类型 [COMMENT 字段n注释]
)[ COMMENT 表注释 ];  -- 最后一个字段后面没有逗号
```

2. 删除、重置表：

```sql
DROP TABLE [IF EXISTS] 表名;
-- 删除表，并重新创建该表：
TRUNCATE TABLE 表名;

```

3. 修改表名：

```sql
ALTER TABLE 表名 RENAME TO 新表名
```

4. 查询表

```sql
-- 查询当前数据库所有表：
SHOW TABLES;
-- 查询表结构：
DESC 表名;
-- 查询指定表的建表语句：
SHOW CREATE TABLE 表名;
```

### 1.3 字段操作（增删改）

1. 添加字段

```SQL
ALTER TABLE 表名 ADD 字段名 类型(长度) [COMMENT 注释] [约束];
    -- 例：ALTER TABLE emp ADD nickname varchar(20) COMMENT '昵称';
```

2. 删除字段

```sql
ALTER TABLE 表名 DROP 字段名;
```

3. 修改字段（数据类型、字段名、字段类型）

```sql
-- 修改数据类型：
ALTER TABLE 表名 MODIFY 字段名 新数据类型(长度);
-- 修改字段名和字段类型：
ALTER TABLE 表名 CHANGE 旧字段名 新字段名 类型(长度) [COMMENT 注释] [约束];
    --例：将emp表的nickname字段修改为username，类型为varchar(30)
    -- ALTER TABLE emp CHANGE nickname username varchar(30) COMMENT '昵称';
```




## 2. DML 数据操作语言

### 2.1 添加数据
> - 字符串和日期类型数据应该包含在引号中
> - 插入的数据大小应该在字段的规定范围内

1. 单条数据添加

```sql
-- 指定部分字段：
INSERT INTO 表名 (字段名1, 字段名2, ...) VALUES (值1, 值2, ...);
-- 全部字段：
INSERT INTO 表名 VALUES (值1, 值2, ...);
```

2. 批量添加多条数据

```sql
INSERT INTO 表名 (字段名1, 字段名2, ...) VALUES (值1, 值2, ...), (值1, 值2, ...), (值1, 值2, ...);
INSERT INTO 表名 VALUES (值1, 值2, ...), (值1, 值2, ...), (值1, 值2, ...);
```

### 2.2 更新和删除数据

1. 修改数据

```sql
UPDATE 表名 SET 字段名1 = 值1, 字段名2 = 值2, ... [ WHERE 条件 ];
    -- 例：修改 emp 表中 name 字段为 'Jack' ，修改条件是 id=1
    -- UPDATE emp SET name = 'Jack' WHERE id = 1;
```

2. 删除数据

```sql
DELETE FROM 表名 [ WHERE 条件 ];
```


## 3. DQL 数据查询语言

> [!note]
> 基础语法
> ```SQL
>     SELECT    字段列表
>     FROM    表名字段
>     WHERE    条件列表
>     GROUP BY    分组字段列表
>     HAVING    分组后的条件列表
>     ORDER BY    排序字段列表
>     LIMIT    分页参数
>     ```

> [!note|label:DQL执行顺序]
> ```sql
> FROM -> WHERE -> GROUP BY -> SELECT -> ORDER BY -> LIMIT
> ```

### 3.1 基础查询

1. 查询多个字段：

```sql
-- 部分指定字段查询
SELECT 字段1, 字段2, 字段3, ... FROM 表名;
-- 全部字段查询
SELECT * FROM 表名;
```

2. 设置别名：

```sql
-- 部分指定字段设置别名
SELECT 字段1 [ AS 别名1 ], 字段2 [ AS 别名2 ], 字段3 [ AS 别名3 ], ... FROM 表名;
-- 全部字段设置别名
SELECT 字段1 [ 别名1 ], 字段2 [ 别名2 ], 字段3 [ 别名3 ], ... FROM 表名;
```

3. 去除重复记录：

```sql
SELECT DISTINCT 字段列表 FROM 表名;
```

4. 转义：

```sql
SELECT * FROM 表名 WHERE name LIKE '/_张三' ESCAPE '/' 
    -- / 之后的_不作为通配符
```
### 3.2 条件查询

1. 语法

```sql
SELECT 字段列表 FROM 表名 WHERE 条件列表;
```

2. 条件列表

> [!note|label:条件列表]
> 
> 运算符 | 功能
> ----------|-----
> **比较运算符**         |     /
> `>、>=、<、<=、<>(!=)` | 数值不等号
> `BETWEEN···AND···`    | 在某范围内（包括两端值）
> `IN(···)`             | 在`in`后面的列表中的之内多选一
> LIKE 占位符            | 模糊匹配（_匹配单个字符，%匹配任意个字符）
> IS NULL               | 是NULL
> **逻辑运算符**         |    /
> `AND` 或 `&&`         | 并且（多个条件同时成立）
> `OR` 或 `||`          | 或者（多个条件任意一个成立）
> `NOT` 或 `!`          | 非，不是


3. 例子

```sql
-- 不等号
    -- 年龄等于30
    select * from employee where age = 30;
    -- 年龄小于30
    select * from employee where age < 30;
    -- 小于等于
    select * from employee where age <= 30;
    -- 不等于
    select * from employee where age != 30;

-- BETWEEN···AND···
    -- 年龄在20到30之间
    select * from employee where age between 20 and 30;
    select * from employee where age >= 20 and age <= 30;
    -- 下面语句不报错，但查不到任何信息 => between···and···不会因为上下限颠倒报错
    select * from employee where age between 30 and 20;
-- IN(···)
    -- 年龄等于25或30或35
    select * from employee where age in (25, 30, 35);

-- Like占位符
    -- 姓名为两个字
    select * from employee where name like '__';
    -- 身份证最后为X
    select * from employee where idcard like '%X';


-- 逻辑运算符
    -- 性别为女且年龄小于30
    select * from employee where age < 30 and gender = '女';
    -- 年龄等于25或30或35
    select * from employee where age = 25 or age = 30 or age = 35;

-- 结合使用
    -- 没有身份证
    select * from employee where idcard is null or idcard = '';
    -- 有身份证
    select * from employee where idcard;
    select * from employee where idcard is not null;
```

### 3.3 聚合查询（聚合函数）

1. 常见聚合函数
    函数  |  功能
    ------|------
    `count`  |  统计数量
    `max`	 |  最大值
    `min`	 |  最小值
    `avg`	 |  平均值
    `sum`	 |  求和

2. 语法
    - `SELECT 聚合函数(字段列表) FROM 表名;`

3. 例子
    - `SELECT count(id) from employee where workaddress = "广东省";`

### 3.4 分组查询

1. 基础语法
    - `SELECT 字段列表 FROM 表名 [ WHERE 条件 ] GROUP BY 分组字段名 [ HAVING 分组后的过滤条件 ];`

> [!note|label:where和having的区别]
> - 执行时机不同：where是分组之前进行过滤，不满足where条件不参与分组；having是分组后对结果进行过滤。
> - 判断条件不同：where不能对聚合函数进行判断，而having可以。

2. 例子
    ```sql
    -- 根据性别分组，统计男性和女性数量（只显示分组数量，不显示哪个是男哪个是女）
    select count(*) from employee group by gender;
    -- 根据性别分组，统计男性和女性数量
    select gender, count(*) from employee group by gender;
    -- 根据性别分组，统计男性和女性的平均年龄
    select gender, avg(age) from employee group by gender;
    -- 年龄小于45，并根据工作地址分组
    select workaddress, count(*) from employee where age < 45 group by workaddress;
    -- 年龄小于45，并根据工作地址分组，获取员工数量大于等于3的工作地址
    select workaddress, count(*) address_count from employee where age < 45 group by workaddress having address_count >= 3;
    ```
> [!note|label:注意事项]
> - 执行顺序：where > 聚合函数 > having
> - 分组之后，查询的字段一般为聚合函数和分组字段，查询其他字段无任何意义

### 3.5 排序查询
1. 语法
    `SELECT 字段列表 FROM 表名 ORDER BY 字段1 排序方式1, 字段2 排序方式2;`

2. 排序方式：

    - `ASC`: 升序（默认）
    - `DESC`: 降序

3. 例子
    ```sql
    -- 根据年龄升序排序
    SELECT * FROM employee ORDER BY age ASC;
    SELECT * FROM employee ORDER BY age;
    -- 两字段排序，根据年龄升序排序，入职时间降序排序
    SELECT * FROM employee ORDER BY age ASC, entrydate DESC;
    ```
> [!note|label:注意事项]
> 如果是多字段排序，当第一个字段值相同时，才会根据第二个字段进行排序

### 3.6 分页查询
1. 语法：
    `SELECT 字段列表 FROM 表名 LIMIT 起始索引, 查询记录数;`

2. 例子
        ```sql
    -- 查询第一页数据，展示10条
    SELECT * FROM employee LIMIT 0, 10;
    -- 查询第二页
    SELECT * FROM employee LIMIT 10, 10;
    ```

> [!note|label:注意事项]
> - 起始索引从0开始，起始索引 = （查询页码 - 1） * 每页显示记录数
> - 分页查询是数据库的方言，不同数据库有不同实现:
>     - MySQL是LIMIT
> - 如果查询的是第一页数据，起始索引可以省略，直接简写 LIMIT 10


## 4. DCL 数据控制语言

### 4.1 管理用户
1. 查询用户：
    ```sql
    USE mysql;
    SELECT * FROM user;
    ```

2. 创建用户:
    ```sql
    CREATE USER '用户名'@'主机名' IDENTIFIED BY '密码';
    ```

3. 修改用户密码：
    ```sql
    ALTER USER '用户名'@'主机名' IDENTIFIED WITH mysql_native_password BY '新密码';
    ```

4. 删除用户：
    ```sql
    DROP USER '用户名'@'主机名';
    ```

5. 例子：
    ```sql
    -- 创建用户test，只能在当前主机localhost访问
    create user 'test'@'localhost' identified by '123456';
    -- 创建用户test，能在任意主机访问
    create user 'test'@'%' identified by '123456';
    create user 'test' identified by '123456';
    -- 修改密码
    alter user 'test'@'localhost' identified with mysql_native_password by '1234';
    -- 删除用户
    drop user 'test'@'localhost';
    ```

> [!note|label:注意事项]
> 主机名可以使用 % 通配

### 4.2 权限控制常用权限：
1. 常用权限
    权限  |  说明
    ------|-----
    `ALL, ALL PRIVILEGES`	 |  所有权限
    `SELECT`  |  查询数据
    `INSERT`  |  插入数据
    `UPDATE`  |  修改数据
    `DELETE`  |  删除数据
    `ALTER`  |  修改表
    `DROP`  |  删除数据库/表/视图
    `CREATE`  |  创建数据库/表

    - 更多权限请看权限一览表

2. 查询权限：
    ```sql
    SHOW GRANTS FOR '用户名'@'主机名';
    ```

3. 授予权限：
    ```sql
    GRANT 权限列表 ON 数据库名.表名 TO '用户名'@'主机名';
    ```

4. 撤销权限：
    ```sql
    REVOKE 权限列表 ON 数据库名.表名 FROM '用户名'@'主机名';
    ```

> [!note|label:注意事项]
> - 多个权限用逗号分隔
> - 授权时，数据库名和表名可以用 * 进行通配，代表所有
