## 1. 隐式转换
- 系统默认的不需要加以声明就可以进行的转换
    - 隐式转换过程中编译器不需要进行详细检查就可以安全转换
- 支持的类型如下
    - `sbyte` =>
        - `short`、`int`、`long`
        - `float`、`double`、`decimal`
    - `byte` =>
        - `short`、`ushort`、`int`、`uint`、`long`、`ulong`
        - `float`、`double`、`decimal`
    - `short` =>
        - `int`、`long`
        - `float`、`double`、`decimal`
    - `ushort` =>
        - `int`、`uint`、`long`、`ulong`
        - `float`、`double`、`decimal`
    - `int` =>
        - `long`
        - `float`、`double`、`decimal`
    - `uint` =>
        - `long`、`ulong`
        - `float`、`double`、`decimal`
    - `long` =>
        - `float`、`double`、`decimal`
    - `ulong` =>
        - `float`、`double`、`decimal`
    - `char` =>
        - `ushort`、`int`、`uint`、`long`、`ulong`
        - `float`、`double`、`decimal`
    - `float` => `double`


## 2. 显式转换

## 3. 装箱、拆箱


## 参考文档
- 微软官方文档
    1. [C#规范 用户定义的显式和隐式转换运算符](https://learn.microsoft.com/zh-cn/dotnet/csharp/language-reference/operators/user-defined-conversion-operators)
    2. [C#规范 10 转换](https://learn.microsoft.com/zh-cn/dotnet/csharp/language-reference/language-specification/conversions#102-implicit-conversions)
    3. [C#规范 15.10.4 转换运算符](https://learn.microsoft.com/zh-cn/dotnet/csharp/language-reference/language-specification/classes#15104-conversion-operators)
