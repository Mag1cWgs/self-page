## Math 类
- 位于 `System` 命名空间中
- 包含 C# 常用的算术运算功能
- 均为静态方法
    - 使用 `Math.FunctionName(args)` 使用
- 常用方法
    - `Abs` 返回绝对值
    - `Exp` 返回 $e$ 的指定次幂
    - `Max`/`Min` 返回两个指定数字中较大/较小的一个
    - `Sqrt` 返回指定数字的平方根
- 其他常见方法参考
    - [System.Math (返回 double)](https://learn.microsoft.com/zh-cn/dotnet/api/system.math?view=net-9.0#---)
    - [System.MathF (返回 Single/float)](https://learn.microsoft.com/zh-cn/dotnet/api/system.mathf?view=net-9.0)

## Convert 类
- 位于 `System` 命名空间中
- 用于值类型间的转换
- 同样均为静态方法
    - 使用 `Convert.Function(args)` 使用
- 参考文档:[System.Convert](https://learn.microsoft.com/zh-cn/dotnet/api/system.convert?view=net-9.0)
    - 另外还有一个 [IConvertible 接口](https://learn.microsoft.com/zh-cn/dotnet/api/system.iconvertible?view=net-9.0)
        - 该接口用于将值类型转换为有等效值的 CLR 类型 

## DateTime 结构
- 位于 `System` 命名空间中
- 用于表示值范围在 公元0001年1月1日00:00:00 到 公元9999年12月31日23:59:59 之间的日期和时间
    - 使用 `DateTime varName = new DateTime(Year, Month, Day, Hour, Minute, Second)` 来定义日期时间变量
- 常用属性与常用方法参考:
    - [DateTime 结构](https://learn.microsoft.com/zh-cn/dotnet/api/system.datetime?view=net-9.0)
    - [DateTimeKind 枚举](https://learn.microsoft.com/zh-cn/dotnet/api/system.datetimekind?view=net-9.0)
        - 用于本地时间和协调世界时 （UTC） 之间的转换作
    - [DateTimeOffset 结构](https://learn.microsoft.com/zh-cn/dotnet/api/system.datetimeoffset?view=net-9.0)
    - [DayofWeek 枚举](https://learn.microsoft.com/zh-cn/dotnet/api/system.dayofweek?view=net-9.0)
