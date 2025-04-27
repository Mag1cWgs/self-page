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
> | `\|` | 分割括号/大括号内的语法项目，只能选择其一 |
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



---




## DML 操作语言

### 插入
```sql
-- 对指定表插入数据
INSERT
INTO <表名> [<属性列>[...n]]
VALUES [(常量)[,...n]]

-- 将子查询结果插入指定表
INSERT [<属性列>[..n]]
INTO <表名>
子查询语句
-- 类似下列语句
-- 插入子查询
SELECT [<属性列>[,...n]]
INTO <表名>
子查询语句

-- 比如
INSERT
INTO Student
SELECT '202210250101', '示例', 1
UNION SELECT '202210250102','0',2
-- 再或者
SELECT
    '实例名' AS Sname,
    'IS' AS Sdept
INTO TempStudent
UNION SELECT '实例名2', 'IS'
```


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

#### 修改数据
- 语法格式
    ```sql
    -- 修改指定表中满足 WHERE 条件的属性列数值
    UPDATE <表名>
    SET <待更新的列名>=<更新值的表达式>[,...n]
    [FROM <参考表名>]
    [WHERE 条件]
    ```

- 几种情形
    - 修改某一个元组的值
    - 修改多个元组的值
    - 带子查询的修改语句
    - 带 `FROM` 子句的修改语句

- 例子
    ```sql
    -- 查询目标值
    SELECT *
    FROM Student
    WHERE Sno = '202210250101'

    -- 需要根据主键查询并修改目标值
    UPDATE Student
    SET Sname = '示例名'
    WHERE Sno = '202210250101'

    -- 改变同一条数据（元组）中多个值
    UPDATE Student
    SET Sname = '示例名2', Ssex = '男', Sdept = 'Ma'
    WHERE Sno = '202210250201'

    -- 不使用 WHERE 语句
    UPDATE Studnet
    SET Sage = Sage + 1

    -- 使用 WHERE 语句
    UPDATE SC
    SET Grade = Grade * Grade / 100
    WHERE Cno = '2'

    -- 对查询子句改写

    -- 原有查询子句
    SELECT
        '实例名' AS Sname,
        'IS' AS Sdept
    INTO TempStudent
    UNION SELECT '实例名2', 'IS'

    -- 改写为更新语句
    UPDATE Student
    SET Sdept = TempStudent.Sdept
    FROM TempStudent
    WHERE Student.Sname = TempStudent.Sname

    -- 可以通过如下方法避免建立 TempStudent 表

    -- 原有查询表
    SELECT * 
    FROM Student,
        (SELECT
            '实例名' AS Sname,
            'IS' AS Sdept
        INTO TempStudent
        UNION SELECT '实例名2', 'IS') AS T
    WHERE Student.Sname = T.Sname

    -- 改写后的语句
    UPDATE Student
    SET Sdept = T.Sdept
    FROM Student,
        (SELECT
            '实例名' AS Sname,
            'IS' AS Sdept
        INTO TempStudent
        UNION SELECT '实例名2', 'IS') AS T
    WHERE Student.Sname = T.Name
    ```

### 删除
#### 删除数据库
```sql
DROP
TABLE <表名>
```

#### 删除表
- 只是删除符合条件的数据
- 语法格式如下
    - 实际只需要改写 `SELECT` 语句，从 `<表名>` 保留
    ```sql
    DELETE [FROM] <表名>
    [FROM] <参照表名>
    [WHERE <条件>]
    ```
- 例子
    ```sql
    -- 查询无选课学生的课程
    SELECT *
    FROM Course
    WHERE 
        NOT EXISTS(SELECT *
                FROM SC
                WHERE Course.Cno = SC.Cno)
    -- 删除对应课程
    -- 只需要改成 DELETE
    DELETE Course
    WHERE 
        NOT EXISTS(SELECT *
                FROM SC
                WHERE Course.Cno = SC.Cno) 

    -- 查询未选课的学生
    SELECT *
    FROM Student
    WHERE 
        NOT EXISTS(SELECT *
                FROM SC
                WHERE Course.Cno = SC.Cno)
    -- 同样删除
    DELETE FROM Student
    WHERE 
        NOT EXISTS(SELECT *
                FROM SC
                WHERE Course.Cno = SC.Cno)
    ```


---



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

#### 系统函数/聚合函数
- `COUNT(字段)`：查询该字段共有多少条值记录


#### 常用聚合函数
- 计数
    - 语法：`COUNT([DISTINCT|ALL] 限定列)`，其中 DISTINCT 指定去除重复行
    - `COUNT(*)` 行数
    - `COUNT(列名)` 限定列名内值存在（非 `NULL`）的行数


###  SELECT 查询语句

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

4. 消除取值重复的行
    - 通过在 `SELECT` 关键字后，使用 `DISTINCT` 关键字来消除重复元祖
        ```sql
        SELECT DISTINCT Sno
        FROM Student
        ```
    - 不使用时默认是 `ALL`
        ```sql
        SELECT ALL Sno
        FROM Student
        ```

5. 查询满足条件的元组
    - 九个比较运算符和 `NOT`
    - 确定范围：`{NOT} BETWEEN ... AND ...`
    - 确定集合：`{NOT} IN`
    - 字符匹配：`{NOT} LIKE`
    - 空值：`IS {NOT} NULL`
        - `IS` 不能被 `=` 替代，因为 `NULL` 的运算比较通常返回 `NULL`
        - 可以有 `字段 IS NOT NULL` 和 `NOT 字段 IS NULL` 两种写法
    - 多重条件：`AND`、`OR`
        - `AND` 的优先级高于 `OR`

6. 通配符
    - `%`：代替任何字符
        - `WHERE Sname LIKE '刘%'`：在 `SName` 字段中匹配所有以'刘'开头的值
    - `_`：替代任何的单个字符
        - `WHERE Sname LIKE '_kar'`：在 `SName` 字段中匹配所有的尾部为 `kar` 四个字符值
    - `[]`：对内部指定范围/集合的值进行匹配
        - `WHERE Sname LIKE 'de[acf]'`：匹配 `Sname` 值为 `dea`/`dec`/`def`
        - `WHERE Sname LIKE 'KR[a-f]'`：匹配 `KRa`/`KRb`/.../`KRe`/`KRf`
    - `[^]`：内部指定不匹配的值
        - 类似 `[]` 的用法


### GROUP BY 聚集函数
- 业务逻辑
    1. 先按关键词分为若干子关系
    2. 然后子关系内部分别统计
    3. 最后汇总所有子关系结果

- 注意
    - 不分组时，`ORDER BY` 将对所有字段生效
    - 分组后，只对各自分组内部生效

```sql
-- SELECT 的字段必须包括后面分组所用字段
SELECT 字段名或聚合函数 FROM 表名
GROUP BY {分组字段名 [HAVING 条件]},..n
ORDER BY 排序依照字段名 --这里字段必须包含于



-- 返回两列数据，分别是 Sdept 和 无名称(数值)
-- 分别对应 Sdept 的种类名，和相应的记录条数
SELECT Sdept, COUNT(*)
FROM Student
GROUP BY Sdept

-- 返回两列：Sage 和 C
-- 分别对应 Sage 的种类名 和 相应的记录条数
-- 且结果按照记录条数升序排列
SELECT Sage, COUNT(*) AS C
FROM Student
GROUP BY Sage
ORDER BY C

-- 选取 Student 表中
SELECT Sage, COUNT(*) AS COUNT
FROM Student
GROUP BY Cno HAVING COUNT(*)>=2
ORDER BY COUNT

SELECT Cno, AVG(Grade) AS AVG_Grade
FROM SC
GROUP BY Cno HAVING AVG(Grade)>90
ORDER BY AVG_Grade


-- 从 SC 表中
-- 通过满足 记录数超过3条 的 Sno 分组
-- 依照 平均成绩 排序
-- 显示 学号，平均成绩，最高分，最低分
SELECT Sno
        ,AVG(Grade) AS AVG_Grade
        ,COUNT(*) AS COUNT_Grade
        ,MAX(Grade) AS MAX_Grade
        ,MIN(Grade) AS MIN_Grade
FROM SC
GROUP BY Sno HAVING COUNT(*) >= 3
ORDER BY AVG(Grade)
```


### ORDER BY 子句
- 对结果排序输出
    - ASC 升序从小到大（默认）
    - DESC 降序从大到小

```sql
SELECT 字段名 FROM 表名
ORDER BY {排序选择字段 [排序类型]},..n

SELECT * FROM Student
ORDER BY Sno ASC, Sage DESC
```


### 多表查询
- 同时涉及多张表的查询

- 主要用于主键表和外键表连接查询
    - 通常是主键表主码和外键表的外键进行等值链接查询

- 构成
    - `FROM`：给出连接的表的名称，可以使用 `AS` 作为别名
    - `WHERE`：给出连接条件
- 连接条件
    - 通常是比较运算符或者是 `BETWEEN ... AND ...`
- 连接分类：
    - 等值链接：连接运算符为 `=` 时
    - 自然连接：连接时去除重复数据
    - 自身连接：一个表与自己链接，称为自身连接
        - 由于一个表用两次，所以需要至少有一个别名
        - 由于所有列均重复，则选取时需要加别名标记
    - 内连接：
        - 两个关系通过 `JOIN ... ON ...` 语法建立连接
        - 语法：    
            ```sql
            表一 [INNER] JOIN 表二 ON 连接条件
            ```
        - 比如：
            ```sql
            SELECT *
            FROM Course AS C
                INNER JOIN Course AS CC -- INNER 可省略
                ON C.Cpno = CC.Cno
            ```
    - 相应的回顾外连接：
        - 需要指定是全外连接 / 左外连接 / 右外连接
            ```sql
            表一 {FULL/LEFT/RIGHT} JOIN 表二 ON 连接条件
            ```
        - 保留匹配项之外，不匹配项仍保留，不匹配元素用 NULL 代替
            ```sql
            SELECT *
            FROM Course AS C
                FULL JOIN Course AS CC -- 全外连接
                ON C.Cpno = CC.Cno
            -- 左外连接例子
            -- 查询各学生所选课程数量
            SELECT Student.Sno, -- 选取聚合条件对应值
                    COUNT(*)
                    COUNT(Cno)  -- 选取非 NULL 的课程号
            FROM Student
                LEFT JOIN SC    -- 使用左外连接保留不匹配元素
                ON Student.Sno = SC.Sno
            GROUP BY Student.Sno    -- 聚合条件是 学号
            ```


```sql
-- 例子
-- 默认笛卡尔积->拼接成新的元组
-- 如果 SC 有13条数据，Course 有14条数据，则最终有13*14条数据
-- 指定连接条件为 Cno 相同的部分
-- 指定具体字段
SELECT *
FROM SC, Course
WHERE SC.Cno = Course.Cno
    AND Sno = '202210250101'

-- 选取选了课程号为 114T0020 的选课人数，按照性别分别统计
SELECT Ssex, AVG(Grade), COUNT(*)
FROM SC, Student
WHERE SC.Sno = Student.Sno
    AND Cno = '114T0020'
GROUP BY Ssex

-- 关于最终数据值
-- 对下例
SELECT COUNT(*) FROM Student --69
SELECT COUNT(*) FROM Course -- 14
SELECT COUNT(*) FROM SC --764

SELECT COUNT(*)
FROM SC, Student
WHERE SC.Sno = Student.Sno
-- 52716 = 764*69

SELECT COUNT(*)
FROM SC, Course
WHERE SC.Cno = Course.Cno
-- 10696 = 764*14

-- 等值连接例：
SELECT Student.*, SC.*
FROM Student,SC
WHERE Student.Sno = SC.Sno

-- 自然连接例：
-- 第一种：重复列只取一边
-- 第二种：使用运算符筛选去重
SELECT Student.Sno,
    Sname, Ssex,Sage,Sdept,Cno,Grade

```

### 嵌套查询
- 查询块
    - 一个 `SELECT ... FROM ... WHERE ...` 语句称为一个查询块
- 嵌套查询
    - 讲一个查询块嵌套在另一个查询块内的查询

- 特点
    - 体现 SQL 语言的结构化特点
    - 部分嵌套查询可以用等价的连接查询来实现
    - 子查询中不能使用 `ORDER BY` 语句

- 例子
    ```sql
    -- 取得有18岁学生的系
    SELECT Sdept
    FROM Student
    WHERE Sage = 18

    -- 查询有18岁学生的系的所有学生信息
    -- 不相关子查询：子查询不依赖于父查询
    SELECT *
    FROM Student
    WHERE 
        Sdept IN (SELECT Sdept
                FROM Student
                WHERE Sage = 18)
    
    -- 相关子查询：子查询依赖于父查询而存在
    -- 查询同时选了一号课程和二号课程的学生
    -- 不能使用 WHERE Cno = '1' AND Cno = '2'
    -- 使用 EXISTS(集合) 返回判断  是否为空集的布尔值
    SELECT *
    FROM SC AS ScOut
    WHERE
        Cno = '1'
        AND
        EXISTS(SELECT * FROM SC
                WHERE ScOut.Sno = SC.Sno AND Cno='2')
    
    -- 也可以查询选了一号课程但没有选二号课程的学生
    SELECT *
    FROM SC AS ScOut
    WHERE
        Cno = '1'
        AND
        NOT EXISTS(SELECT * FROM SC
                WHERE ScOut.Sno = SC.Sno AND Cno='2')
    ```

### 集合查询

## 

