# 数据库编程

## T-SQL 语法

---

### 运算符

#### 算术运算符

#### 赋值运算符

#### 比较运算符

#### 按位运算符

#### 逻辑运算符

---

### 控制流

#### 块控制
- `BEGIN...END`
- `BREAK`
- `GOTO`
- `RETURN`

#### 顺序

#### 选择

#### 循环

---

### 其他关键字

#### 定义(DECLARE)
- 局部变量以 `@` 开头
- 游标变量

#### 指派值


---

### 函数

#### 数学函数

#### 字符串函数

#### 自定义函数

##### 标量值函数
```sql
-- 构造标量值函数
-- 通过给定 学号 '···'
-- 查询 dbo.SC 表中的数据
-- 选取指定学号中的：
--  超过60分的科目的学分的加和
CREATE FUNCTION dbo.Get_Sum_Credit(@Sno char(9))
RETURNS
	smallint
AS
BEGIN
	RETURN(SELECT SUM(C.Ccredit)
	FROM dbo.SC AS S
		INNER JOIN dbo.Course AS C ON S.Cno = C.Cno
	WHERE S.Sno = @Sno AND S.Grade >=60);
END
```

##### 表值函数
