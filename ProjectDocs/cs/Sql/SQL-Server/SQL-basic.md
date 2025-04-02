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

