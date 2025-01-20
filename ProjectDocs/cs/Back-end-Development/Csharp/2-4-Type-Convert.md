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
- 也即**强制转换**，需要明确指定转换类型
    - 一般在不存在该类型的隐式转换时才使用
- 语法通常如下: 
    ```cs
    (类型标识符)表达式;
    ```
    - 作用是将 `表达式` 值的类型转换为 `类型标识符` 的数据类型
    
    > [!attention|label:需注意以下几点]
    > 1. 显式转换可能报错，在进行转换时编译器会将对转换执行溢出检测
    >     - 如果溢出则说明转换失败，表明源类型不是合法目标类型，无法转换
    >         - 抛出异常为: `OverflowException`
    > 2. 对于 `float`/`double`/`decimal` 类型转换到整型数据时会舍入到最接近的整型值
    >     - 如果超出目标类型范围时同样也会有转换异常
    >         - 抛出异常为: `OverflowException`

    > [!note|label:可能会抛出的异常]
    > 均基于 `System.Exception`
    > - `InvalidCastException`：当试图将一个对象转换为不兼容的类型时，会抛出此异常
    >   - 例如，尝试将一个字符串转换为整数，但字符串的内容不是有效的整数格式时，就会引发该异常。
    >   - 装箱和拆箱也会出现。
    > - `FormatException`：在对字符串进行格式化或类型转换时，如果格式字符串不正确或与数据类型不匹配，可能会引发此异常。
    >   - 例如，使用错误的日期时间格式字符串来解析日期时间字符串时，就会抛出 `FormatException`。
    > - `OverflowException`：当数值类型的值超出了目标类型的表示范围时，会抛出此异常。
    >   - 例如，将一个大的整数值赋给一个较小的整数类型时，就可能引发 `OverflowException`。

## 3. 装箱、拆箱
- 装箱和拆箱是C#**类型系统**中的重要概念
- C# 是通过装箱和拆箱来实现值类型和引用类型数据的相应转换

> [!note|label:Csharp中常见的值类型与引用类型转换]
> 在C#中，实现值类型和引用类型数据的相应转换通常有以下几种方法：
> 1. **使用装箱和拆箱**(当前章节)
>    - 性能开销较大
> 2. **使用转换操作符**
>    - 对于一些特定的值类型和引用类型之间的转换，可以使用显式的转换操作符来进行转换。
>    - 例如，从`int`类型转换为`long`类型，或者从`double`类型转换为`int`类型等。这种转换需要在编译时进行类型检查，以确保转换是安全的。
>    - 如果转换不安全，编译器会报错。
> 3. **使用`Convert`类**
>    - `Convert`类提供了多种静态方法，用于在不同类型之间进行转换。
>    - 例如，`Convert.ToInt32`方法可以将一个字符串、布尔值或其他数值类型转换为`int`类型；`Convert.ToString`方法可以将各种类型的值转换为字符串等。
>    - `Convert`类的转换方法在内部进行了错误处理和类型检查，使用起来相对安全和方便。
> 4. **使用`Parse`方法**
>    - 对于字符串到值类型的转换，可以使用相应的`Parse`方法。
>    - 例如，`int.Parse`方法可以将一个表示整数的字符串转换为`int`类型；`double.Parse`方法可以将一个表示双精度浮点数的字符串转换为`double`类型等。
>    - 需要注意的是，`Parse`方法在解析失败时会抛出`FormatException`异常，因此在使用时需要进行异常处理。
> 5. **自定义转换方法**
>    - 如果上述方法无法满足需求，还可以自定义转换方法来实现特定的值类型和引用类型之间的转换。
>    - 这通常需要在类中定义隐式或显式的类型转换运算符，或者编写专门的转换函数来进行转换。


### 3.1 装箱转换
- 从值类型到引用类型的转换称为装箱。
    - 当一个值类型变量被赋值给一个`object`类型的变量时，就会发生装箱操作。
    - 例如，将一个`int`类型的变量赋值给一个`object`类型的变量。
- 实际上是创建了一个 `object` 类型实例，然后把值类型的值复制给刚创建的 `object` 实例
    - 先在堆空间中分配相应的空间
    - 然后把栈空间中待转换值复制到堆中分配的空间
    - 栈空间的装箱实例包含了堆空间中新`object`实例的地址
- 两种写法
    - 隐式转换
        ```cs
        int i = 10;
        object obj = i;
        ```
    - 显式转换
        ```cs
        int i = 10;
        object obj = (object)i;
        ```

### 3.2 拆箱转换
- 从引用类型到值类型的转换称为拆箱
    - **必须是显式转换**
    - 与装箱相反，当一个`object`类型的变量被赋值回原来的值类型变量时，就会发生拆箱操作。
    - 不过需要注意的是，拆箱操作需要确保`object`类型的变量确实包含一个可以转换回原始值类型的值
        - 否则会引发`InvalidCastException`异常。 
- 实际上步骤如下:
    - 检查待转换对象实例，确保它是给定目标值类型的一个装箱值
    - 复制实例中值到栈空间中分配好的值类型数据中
- 示例如下：
    ```cs
    object obj = 10;
    int i = (int)obj;
    ```



## 参考文档
- 微软官方文档
    1. [C#规范 用户定义的显式和隐式转换运算符](https://learn.microsoft.com/zh-cn/dotnet/csharp/language-reference/operators/user-defined-conversion-operators)
    2. [C# 类型系统](https://learn.microsoft.com/zh-cn/dotnet/csharp/fundamentals/types/)
    3. [C#规范 10 转换](https://learn.microsoft.com/zh-cn/dotnet/csharp/language-reference/language-specification/conversions#102-implicit-conversions)
    4. [C#规范 15.10.4 转换运算符](https://learn.microsoft.com/zh-cn/dotnet/csharp/language-reference/language-specification/classes#15104-conversion-operators)
 