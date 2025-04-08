## 目录
- SQL 通用语法
- SQL 分类
- DDL: 数据定义语言，用来定义数据库对象（数据库、表、字段）
- DML: 数据操作语言，用来对数据库表中的数据进行增删改
- DQL: 数据查询语言，用来查询数据库中表的记录
- DCL: 数据控制语言，用来创建数据库用户、控制数据库的控制权限

>[!note]
> 遵从 Transact-SQL 语法规则
> | 规范 | 用于 |
> | ---- | ---- |
> | 大写 | TSQL 关键字 |
> | *斜体* | 输入参数 |
> | `|` | 分割括号/大括号内的语法项目，只能选择其一 |
> | `[]` | 可选项，不必使用括号 |
> | `{}` | 必选语法 |
> | `[,...n]` | 使用 `,` 分割，可重复 n 次 |
> | `[...n]` | 使用 ` ` 分割，可重复 n 次 |
> | **加粗** | 必须原样键入的限定名 |
> | <标签>::= | 语法块名称，用于在过长时候占位，在后续位置说明具体内容 |


## DDL 定义语言
### 定义数据库
```sql
CREATE DATABASE 数据库名
GO -- 执行上一条操作

USE 数据库名
GO
```

#### 定义表
```sql
CREATE TABLE 表名
(
    列名 数据类型[(数据类型的指定长度)],
    列名 数据类型
)
```

## DML 操作语言

### 删除
#### 删除数据库
#### 删除表


### 修改
#### 修改数据库

#### 修改表
>[!note]
> 总体语法：
> ```sql
> ALTER TABLE table 
> { 
>     [
>         ALTER COLUMN 列名
>         { 
>             新的数据的类型 [ ( precision [ , scale ] ) ] [ COLLATE < 排序名 > ] [ NULL | NOT NULL ]
>             | { ADD | DROP } ROWGUIDCOL 
>         }
>     ]  | ADD
>         {
>             [ < 列定义 > ] | 列名 AS 列名计算表达式
>         } [ ,...n ]
>     | [ WITH CHECK | WITH NOCHECK ] ADD
>         { 
>             < 表约束 > 
>         } [ ,...n ] 
>     | DROP
>         { 
>             [ CONSTRAINT ] 约束名 
>             | COLUMN 列名 
>         } [ ,...n ] 
>     | { CHECK | NOCHECK } CONSTRAINT
>         { 
>             ALL | 约束名 [ ,...n ] 
>         }
>     | { ENABLE | DISABLE } TRIGGER
>         { 
>             ALL | 触发器名称 [ ,...n ] 
>         } 
> }
> ```
> 其中
> ```sql
> <列定义> ::= 
> { 列名 数据类型 }
>     [ 
>         [ DEFAULT 约束表达式 ]
>         [ WITH VALUES ] | [ IDENTITY [ ( seed , increment ) [ NOT FOR REPLICATION ] ] ]
>     ] 
>     [ ROWGUIDCOL ]
>     [ COLLATE < 约束名 > ]
>     [ < 列约束 > ] [ ...n ]
> 
> -- 主键 唯一键 外键 逻辑检查
> <列约束>::=
> [ CONSTRAINT 约束名 ]
> { 
>     [ 
>         NULL | NOT NULL
>     ] | [
>             { PRIMARY KEY | UNIQUE }
>             [ CLUSTERED | NONCLUSTERED ]
>             [ WITH FILLFACTOR = 填充因子 ]
>             [ ON { filegroup | DEFAULT } ]
>     ] | [ 
>             [ FOREIGN KEY ]
>             REFERENCES 引用表 [ ( 引用列 ) ]
>             [ ON DELETE { CASCADE | NO ACTION } ]
>             [ ON UPDATE { CASCADE | NO ACTION } ]
>             [ NOT FOR REPLICATION ]
>     ] | CHECK [ NOT FOR REPLICATION ] ( 逻辑表达式 ) 
> }
> 
> -- 
> <表约束>::=
> [ CONSTRAINT 约束名 ]
> {
>     [ { PRIMARY KEY | UNIQUE }
>         [ CLUSTERED | NONCLUSTERED ]
>         { ( 列名 [ ,...n ] ) } 
>         [ WITH FILLFACTOR = fillfactor ]
>         [ ON { 目录组 | DEFAULT } ]
>     ]|    FOREIGN KEY
>             [ ( 列名 [ ,...n ] ) ]
>             REFERENCES 引用表 [ ( 引用列 [ ,...n ] ) ]
>             [ ON DELETE { CASCADE | NO ACTION } ]
>             [ ON UPDATE { CASCADE | NO ACTION } ]
>             [ NOT FOR REPLICATION ]
>     | DEFAULT 约束表达式
>             [ FOR 列名 ] [ WITH VALUES ]
>     |    CHECK [ NOT FOR REPLICATION ]
>             ( 搜索条件 ) 
> }
> ```



```sql
ALTER TABLE 表名
ALTER COLUMN 列名 数据类型 [约束，比如 NOT NULL]
-- ALTER COLUMN Sno varchar(12) NOT NULL



ALTER TABLE 表名
ADD 添加的列名 AS {表达式}



ALTER TABLE 表名
ADD CONSTRAINT 约束(目标列)
-- ADD CONSTRAINT PK_Student PRIMARY KEY (Sno) 
-- ADD CONSTRAINT PK_CS PRIMARY KEY (Sno, Cno)
-- ADD CONSTRAINT FK_SC_Sno FOREIGN KEY (Sno) -- 设置 SC.Sno 关联外键 FK_SC_Sno
--                          REFERENCES Student (Sno) -- 具体关联数据 Student.Sno

```


## DQL 查询语言
- 从数据库中检索行，并允许从一个表/多个表中选择一个/多个行或列
- 主要子句如下
    ```sql
    SELECT select_list
    [ INTO 结果输出表名 ] 
    FROM 来源表 
    [ WHERE 搜索条件 ] 
    [ GROUP BY 分组表达式 ] 
    [ HAVING 搜索条件 ] 
    [ ORDER BY 排序表达式 [ ASC | DESC ] ] 
    ```


### 运算符
T-SQL 支持如下运算符
- 数字运算符：`+`/`-`/`*`/`/`/`%`
- 赋值运算符：`=`
- 按位运算符：`&`/`^`/`|`
- 比较运算符：`=`/`<>`/`>`/`<`/`>=`/`<=`/`!=`/`!>`/`!<`
- 逻辑运算符
    - ALL 如果一系列的比较都为 TRUE，那么就为 TRUE。 
    - AND 如果两个布尔表达式都为 TRUE，那么就为 TRUE。 
    - ANY 如果一系列的比较中任何一个为 TRUE，那么就为 TRUE。 
    - BETWEEN 如果操作数在某个范围之内，那么就为 TRUE。 
    - EXISTS 如果子查询包含一些行，那么就为 TRUE。 
    - IN 如果操作数等于表达式列表中的一个，那么就为 TRUE。 
    - LIKE 如果操作数与一种模式相匹配，那么就为 TRUE。 
    - NOT 对任何其它布尔运算符的值取反。 
    - OR 如果两个布尔表达式中的一个为 TRUE，那么就为 TRUE。 
    - SOME 如果在一系列比较中，有些为 TRUE，那么就为 TRUE。

- 字符串串联


### 函数

#### 分类
- 配置函数：返回配置信息
- 游标函数：返回游标信息
- 日期时间函数：返回字符串/数字/日期/时间值
- 数学函数：返回数字值
- 元数据函数：返回有关 数据库/数据库对象 的信息
- 安全函数：返回有关 用户 和 角色 的信息
- 字符串函数： 对字符串 `char`/`varchar` 操作，返回字符串/数字值
- 系统函数：返回 SQLserver 的值、对象、设置的信息
- 文本图像函数：返回 图像/文本 输入/操作 值 的信息

#### 日期时间函数
1. `GETDATE()`：获取当前时间

2. `DATEADD`：对指定事件的指定部分添加指定长度
    - 语法
        ```sql
        DATEADD (datepart , number, date)
        ```
    - `datepart`：修改哪一部分
    - `number`：添加数值
    - `date`：要修正的时间值

3. 其他函数（详见Transact-SQL参考）

#### 数学函数
- 算数函数返回与输入值相同数据类型的值。
    - 例如 ABS、CEILING、DEGREES、FLOOR、POWER、RADIANS 和 SIGN
- 三角函数和其它函数将输入值投影到 float 并返回 float 值。
    - 包括 EXP、LOG、LOG10、SQUARE 和 SQRT

- 除了 RAND 外，所有数学函数都是确定性函数。
    - 每次用一组特定输入值调用它们时，所返回的结果相同。
- 仅当指定种子参数时，RAND 才具有确定性。


#### 字符串函数
- 除 CHARINDEX 和 PATINDEX 外的所有其它内置字符串函数都具有确定性。
    - 每次用一组给定的输入值调用它们时，都返回相同的值。
1. `SUBSTRING`
    - 语法:
        ```sql
        SUBSTRING ( expression , start , length ) 
        ```
    - `expression`：字符串/二进制字符串/text/image/列/包含列表达式
        - 不应使用包含聚合函数的表达式
    - `start`：整数，指定子串开始位置（从1开始索引）
    - `length`：整数，指定子串长度
        - 对 `text` 数据上指定字节数时，可能会对 DBCS 文字（日文汉字）产生非法字符
        - 与 `READTEXT` 函数处理 DBCS 文字的行为一致。
        - 建议对 DBCS 字符使用 `ntext` 而非 `text`
2. `LEFT`：返回从左侧开始读取所得的子串
    - 语法
        ```sql
        LEFT ( character_expression , integer_expression ) 
        ```
    - `character_expression`：字符串/二进制数据表达式，要求是可以隐式转换为 `varchar` 的数据类型
        - 否则请使用 `CAST` 函数显式转换
    - `integer_expression`：正整数
        - 如果 `integer_expre·ssion` 为负，则返回空字符串。
3. `RIGHT`：相应的从右侧读取子串

4. 其他函数（详见Transact-SQL参考）


### 查询语句

1. 枚举选取
    ```sql
    SELECT Sno, Sname
    FROM Student
    ```
2. 通配符
    ```sql
    SELECT *
    FROM Student
    ```

3. 字符串函数
    ```sql
    -- 除了原有查询结果，会另外多出一列，列名为 Enter_Year
    -- 值类似于 `2000年入校（`Sno`为`2000`时）`
    SELECT *, LEFT(Sno, 4)+'年入校' AS Enter_Year
    FROM Student

    -- 使用 CONVERT(目标类型, 待转换值) 函数产生一个 int 型数据
    -- 减去查询时选取的 Sage 列数据，最后声明为 BoY 列
    -- 比如对一个 Sno='202210000001' Sage = 20 的数据行
    -- 会有 BoY = 2022 - 20 = 2002 的数值结果
    SELECT *, CONVERT(int, LEFT(Sno, 4)) - Sage AS BoY
    FROM Student
    ```


