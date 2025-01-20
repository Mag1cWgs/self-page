## 1 结构类型（struct）
自定义一种值类型，其对应变量值保存在栈内存区域。

### 1.1 声明
- 使用关键字 `struct` 作为标识
- 一般格式如下：
    ```cs
        struct 结构类型名称
        {
            [该字段访问修饰符] 数据类型 字段名1;
            [该字段访问修饰符] 数据类型 字段名2;
            [该字段访问修饰符] 数据类型 字段名3;
        }
    ```


### 1.2 变量定义
- 与一般变量定义一致
- 一般格式如下：
    ```cs
        结构类型 结构变量名;
    ```
- 也可以使用引用类型变量定义
    ```cs
        结构类型 结构变量名 = new 结构类型名()
    ```
    - 使用 `new` 运算符是为了创建变量时调用其对应构造函数，以动态分配存储空间
    - 不使用 `new` 时不调用构造函数
    - 如果不设计对应结构类型的构造函数，则两种变量定义方法效果一致


### 1.3 使用与访问
- 字段访问 `结构变量名.字段名`
- 变量赋值 `结构变量名.字段名 = 同类型值`



## 2 枚举类型（enum）

- 枚举类型表示一组**同一类型**的**常量**，其用途是为一组在逻辑上有关联的值一次性提供便于记忆的符号，
    从而使代码的含义更清晰，也易于记忆。
    - 比如，一周中的7天，可以分别用0~6的数值代表。但是，考虑到每一天都有一个习惯的固定单词：Sunday、Monday、Tuesday……，采用上述单词编程，将使代码的含义更清晰，也易于记忆；
    - 同理，性别只有两个固定值，男、女，也可以用枚举来实现。
- enum关键字用于声明枚举。
- 在C#的类型体系中，枚举类型属于**值类型**。

### 2.1 声明枚举类型
- 语法
    ```cs
        [枚举修饰符] enum 枚举名 [:基础类型] {枚举类型声明体}
    ```
- 说明：
    - “枚举修饰符”可以是`new`、`public`、`protected`、`internal`、`private`等关键字。
    - 每个枚举类型都有一个相应的整型类型，称为该枚举类型的“基础类型”，该基础类型必须是八种整型（`byte`、`sbyte`、`short`、`ushort`、`int`、`uint`、`long` 或 `ulong`）之一。没有显式声明基础类型的枚举类型所对应的基础类型是 `int`。

- “枚举类型声明体”用于定义零个或多个枚举成员，这些成员是该枚举类型的命名常量。
    任意两个枚举成员不能具有相同的名称，多个枚举成员声明之间用 `,`（逗号）分隔。
- 枚举成员声明的格式为：`命名常量 [=常量表达式]`。
    如果枚举成员声明**未显式**指定一个值（常量表达式），
    该成员将被赋予值0（如果它是该枚举类型中的第一个值）**或**前一个枚举成员（按照文本顺序）的值加 1。
    但每个枚举成员的常数值必须在该枚举的基础类型的范围之内。

### 2.2 命名方法
- 建议枚举名采取`Pascal`命名规则书写的枚举描述。
- 建议命名常量采取`Pascal`命名规则书写的枚举成员名称，不要使用中文字符。


### 2.3 使用枚举类型
- 如果在某个类中需要使用一个`Alignment`类型的实例字段`alignment`，可编写如下声明代码：
    ```cs
        protected Alignment alignment;
        alignment = Alignment.Center;
    ```
- 以上代码声明了一个`Alignment`类型的变量`alignment`，并完成了对`alignment`的赋值。
    其中，在为枚举类型变量赋值时，用到了成员访问符“.”。这也是对枚举变量进行赋值的最一般的方式：
    ```cs
        枚举变量名 = 枚举类型名.命名常量;
    ```
### 2.4 为什么需要枚举
- 现阶段的计算机不仅只用于数值计算，还需要处理非数值的数据。例如：性别、月份、颜色、单位名、学历、职业等，都不是数值数据。 
- 在程序设计时，如果用一个数值来代表某一状态，这种处理方法不直观，易读性差。

> [!tips]
> 如果能在程序中用自然语言中有相应含义的单词来代表某一状态，则程序就很容易阅读和理解。  
> 也就是说，事先考虑到某一变量可能取的值，尽量用自然语言中含义清楚的单词来表示它的每一个值。  
> 枚举类型就是为了实现这一应用而发明的。

### 2.5 Enum的部分静态方法

- GetName——在指定枚举中检索具有指定值的常数的名称。 
- GetNames——检索指定枚举中常数名称的数组。
- GetValues——检索指定枚举中常数值的数组。

#### 1. Enum.GetNames静态方法   
- 参数
    - enumType
    - 类型： System.Type 
    - 枚举类型。
- 返回值
    - 类型： System.String []
- 作用
    - 取得enumType 的常数名称的字符串数组。
```cs
// 【例】输出ThreePrimaryColor中每个枚举常数。
public enum ThreePrimaryColor { Red, Green, Blue };

static void Main(string[] args)
{
    int  i = 1;
    foreach (string s in Enum.GetNames(typeof(ThreePrimaryColor)))
    {
        Console.WriteLine( "第{0}个常数名称为：{1}." , i, s);
        i ++;
    }
    Console.ReadKey();
}
```
#### 2. Enum.GetValues静态方法
- 作用
    检索指定枚举中常数值的数组。 
- 参数
    - enumType
    - 类型： System.Type 
    - 枚举类型。
- 返回值
    - 类型： System.Array 
    - 一个数组，其中包含 enumType 中实例的值。 
        数组的元素按枚举常数的二进制值排序。
```cs

// 【例】 输出Season中的每个枚举值、命名常量以及其对应的汉字。
Season season;
foreach (int i in Enum.GetValues(typeof(Season))) {
    season = (Season)i;
    Console.WriteLine(i + "\t" + season + "\t" 
        + EnumToChn.GetSeason(season));
}
/*  分析：
首先利用Enum类的GetValues方法，取得了指定枚举Season中常数值的数组，
由于在定义Season时没有显式地为其指定基础类型，因此Season的基础类型为int，
所以通过GetValues方法得到的数组的类型也为int。
然后定义了一个int类型的变量i，并采用foreach语句来遍历数组。
在遍历数组的过程中，先将枚举的常数值转换为枚举类型，再输出每个枚举值、命名常量以及其对应的汉字。
*/
```

> [!attention]
> 1. 一般情况下，只能将该枚举类型中的命名常量或文本直接赋予枚举变量，否则编译时就会提示错误。
> 2. 一个枚举的基础类型的任何一个值都可以被强制转换为该枚举类型，成为该枚举类型的一个独特的有效值。
> 3. 应尽可能采用枚举类型来管理整数常量。这样，一方面可以提高代码的可读性；另一方面，如果以后整数常量发生了变化，只需要在枚举类型声明中，修改该命名常量的值，即可完成的相应修改，而不是在所有关联的代码中，首先查找出包含该字面值的地方，然后决定是否要修改。
> 4. 虽然一个枚举类型内的命名常量不能相同，但不同命名常量可以取同一个值。因此，如果存在诸如“由值到枚举类型的强制转换”或“依据命名常量获得对应的汉字”这样的需求，应保持枚举成员中命名常量和枚举值之间的一一对应关系。


### 例1：实现性别的枚举
```cs
using System;
namespace c_sharp_learning
{
    public class OnClassProgram_11_08
    {
        static void Main()
        {
            Gender01 gender01 = Gender01.Male;
            gender01 = Gender01.Female;
            Console.WriteLine(gender01);
            // 使用强制转换使gender01赋值Gender01.Male
            gender01 = (Gender01)1;
            Console.WriteLine(gender01);
            // 若不在枚举范围内则输出其索引
            Gender01 gender011 = (Gender01)4;
            Console.WriteLine(gender011);

            Gender02 gender02 ;
            gender02 = Gender02.Male;
            //使用强制转换使gender02赋值Gender02.Female
            gender02 = (Gender02)1;
            Console.WriteLine(gender02);
        }
    }
    
    /// <summary>
    /// // 默认int型指定，使用标识符internal表示程序集内部使用
    /// </summary>
    internal enum Gender01 :int
    {   /// <summary>
        /// 男性（1）
        /// </summary>
        // 若无指定Male=1，则默认从0开始
        Male = 1, 
        Female = 2  
            //若无显式指定Female=2，则默认由Male+1
    }

    /// <summary>
    /// 常用protected做修饰
    /// </summary>
    enum Gender02 :sbyte
    {   /// <summary>
        /// 男性（0）
        /// </summary>
        Male,
        Female
    }
}
```


## 参考链接
- 微软官方文档
    - [C# 类型系统](https://learn.microsoft.com/zh-cn/dotnet/csharp/fundamentals/types/)
    - [值类型（C# 参考）](https://learn.microsoft.com/zh-cn/dotnet/csharp/language-reference/builtin-types/value-types)
        - [枚举类型（C# 参考）](https://learn.microsoft.com/zh-cn/dotnet/csharp/language-reference/builtin-types/enum)
        - [结构类型（C# 参考）](https://learn.microsoft.com/zh-cn/dotnet/csharp/language-reference/builtin-types/struct)
            - [ref 结构类型（C# 参考）](https://learn.microsoft.com/zh-cn/dotnet/csharp/language-reference/builtin-types/ref-struct)
    - [引用类型（C# 参考）](https://learn.microsoft.com/zh-cn/dotnet/csharp/language-reference/keywords/reference-types)
    - [9 变量](https://learn.microsoft.com/zh-cn/dotnet/csharp/language-reference/language-specification/variables)
