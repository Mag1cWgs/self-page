## 1. C#类型系统概述
参考文档：[Microsoft C# 类型系统](https://learn.microsoft.com/zh-cn/dotnet/csharp/fundamentals/types/)

### 1.1 概述
- C# 是一种强类型语言。
- 每个变量和常量都有一个类型，每个求值的表达式也是如此。
- 每个方法声明都为每个输入参数和返回值指定名称、类型和种类（值、引用或输出）。
- .NET 类库定义了内置数值类型和表示各种构造的复杂类型。
    - 其中包括文件系统、网络连接、对象的集合和数组以及日期。
    - 典型的 C# 程序使用类库中的类型，以及对程序问题域的专属概念进行建模的用户定义类型。

- 类型中可存储的信息包括以下项：
    - 类型变量所需的存储空间。
    - 可以表示的最大值和最小值。
    - 包含的成员（方法、字段、事件等）。
    - 继承自的基类型。
    - 它实现的接口。
    - 允许执行的运算种类。

- 编译器使用类型信息来确保在代码中执行的所有操作都是类型安全的。
    - 如果声明 int 类型的变量，那么编译器允许在加法和减法运算中使用此变量
    - 如果尝试对 bool 类型的变量执行这些相同操作，则编译器将生成错误
    - 编译器将类型信息作为元数据嵌入可执行文件中。
    - 公共语言运行时 (CLR) 在运行时使用元数据，以在分配和回收内存时进一步保证类型安全性。

    >[!note|label:CLR的组成]
    > CLR主要由CLS和CTS两部分组成
    > - CLS(公共语言规范)
    >     - 一个最低标准集合，所有面向.NET Framework的编译器都必须支持
    > - CTS(通用类型系统)
    >     - 一套预定义数据类型，所有面向.NET Framework的语言都可以基于此编译
    >     - 比如C#中的`int`和VB中的`integer`在编译后都经CTS转换为`System.Int32`

### 1.2 变量声明中的类型指定
- 当在程序中声明变量或常量时指定其类型
- 使用 var 关键字让编译器推断类型
    - C# 3.0 引入的**类型推断**
- 方法声明指定方法参数的类型和返回值。
- 声明变量后，不能使用新类型重新声明该变量，并且不能分配与其声明的类型不兼容的值。
    - 例如，不能声明 `int` 后再向它分配 `true` 的布尔值。
    - 不过，可以将值转换成其他类型。
        - 例如，在将值分配给新变量或作为方法自变量传递时，编译器会自动执行不会导致数据丢失的类型转换。
        - 如果类型转换可能会导致数据丢失，必须在源代码中进行显式转换。
    > [!note|label:参考笔记]
    > * [变量与常量](/ProjectDocs/cs/Back-end-Development/Csharp/2-3-Variable-Constant.md)
    > * [类型的转换](/ProjectDocs/cs/Back-end-Development/Csharp/2-4-Type-Convert.md)

### 1.3 内置类型
- C# 提供了一组标准的内置类型。
    - 这些类型表示整数、浮点值、布尔表达式、文本字符、十进制值和其他数据类型。
    - 还有内置的 string 和 object 类型。
- 这些类型可供在任何 C# 程序中使用。
    - 有关内置类型的完整列表，查看官方文档[内置类型](https://learn.microsoft.com/zh-cn/dotnet/csharp/language-reference/builtin-types/built-in-types)

### 1.4 自定义类型
- 可以使用 `struct`、`class`、`interface`、`enum` 和 `record` 构造来创建自己的自定义类型。
- .NET 类库本身是一组自定义类型，以供你在自己的应用程序中使用。
    - 查看官方文档[.NET 类库概述](https://learn.microsoft.com/zh-cn/dotnet/standard/class-library-overview)
- 默认情况下，类库中最常用的类型在任何 C# 程序中均可用。
- 其他类型只有在显式添加对定义这些类型的程序集的项目引用时才可用。
- 编译器引用程序集之后，你可以声明在源代码的此程序集中声明的类型的变量（和常量）。 

### 1.5 通用类型系统 CTS

#### 1. CTS的两个原则
1. 支持继承原则
    - 类型可以派生自其他类型（称为**基类型**）。
        - 派生类型继承（有一些限制）基类型的方法、属性和其他成员。
        - 基类型可以继而从某种其他类型派生，在这种情况下，派生类型继承其继承层次结构中的两种基类型的成员。
            - 即: **基类的基类 -> 基类 -> 基类的子类**
    - 所有类型（包括 `System.Int32` (C# keyword: `int`) 等内置数值类型）最终都派生自单个基类型，即 `System.Object` (C# keyword: `object`)。
    - 这样的统一类型层次结构称为**通用类型系统 (CTS)**。
    - 官方文档:[继承 - 派生用于创建更具体的行为的类型](https://learn.microsoft.com/zh-cn/dotnet/csharp/fundamentals/object-oriented/inheritance)
2. CTS 中的每种类型被定义为**值类型**或**引用类型**
    - 这些类型包括 .NET 类库中的所有自定义类型以及你自己的用户定义类型。
    - 使用 `struct` 关键字定义的类型是值类型
        - **所有内置数值类型**都是 `structs`。
    - 使用 `class` 或 `record` 关键字定义的类型是引用类型。
    - 引用类型和值类型遵循不同的编译时规则和运行时行为。

#### 2. CTS中值类型和引用类型的关系
- 如果用树形图描述继承将如下:
    - 使用 `[]` 标记引用类型
    - 使用 `【】` 标记值类型
```
System 命名空间
 |
 · —— * [System.Object 类]
      |
      · —— · [所有的基类(Base Class)/库类(Library Class)/接口(interface)]
      |    |
      |    * —— [System.String 类]
      |    * —— [System.Array 类]
      |    * —— [用户自定义的类和接口]
      |    |
      |    · —— [其他继承类/接口]
      | 
      · —— * [System.ValueType 类]
           |
           · —— * [System.Enum 类]
           |    |
           |    · —— 【所有的枚举类】
           · —— · 【所有的结构体，包括内置数值类型(即基元类型)】
                |
                * —— 【System.Int32】
                * —— 【System.Boolean】
                * —— 【用户自定义的结构体】
                |
                · —— 【其他结构体】

```
#### 3. 类、结构、记录之间的区别
- 类和结构是 .NET 通用类型系统的两种**基本构造**。
    - C# 9 添加记录(`record`)，**记录是一种类**。
    - 每种本质上都是一种数据结构，其中封装了同属一个逻辑单元的一组数据和行为。
    - 数据和行为是类、结构或记录的成员。
    - 这些行为包括方法、属性和事件等。
- 类、结构或记录声明类似于一张蓝图，用于在运行时创建实例或对象。
    - 如果定义名为 Person 的类、结构或记录，则 Person 是类型的名称。
    - 如果声明和初始化 Person 类型的变量 p，那么 p 就是所谓的 Person 对象或实例。
    - 可以创建同一 Person 类型的多个实例，每个实例都可以有不同的属性和字段值。
- **类是引用类型**。
    - 创建类型的对象后，向其分配对象的变量仅保留对相应内存的引用。
    - 将对象引用分配给新变量后，新变量会引用原始对象。
    - 通过一个变量所做的更改将反映在另一个变量中，因为它们引用相同的数据。
- **结构是值类型**。
    - 创建结构时，向其分配结构的变量保留结构的实际数据。
    - 将结构分配给新变量时，会复制结构。
    - 因此，新变量和原始变量包含相同数据的副本（共两个）。
    - 对一个副本所做的更改不会影响另一个副本。
- **记录类型**可以是引用类型 (`record class`) 或值类型 (`record struct`)。
- 用法和选择
    - 类用于对**更复杂的行为**建模。
        - 建立后可更改
            - 类通常存储计划在创建类对象后进行修改的数据。
    - 结构最适用于**小型数据结构**。
        - 建立后不可更改
            - 结构通常存储不打算在创建结构后修改的数据。
    - 记录类型是**具有附加编译器合成成员**的数据结构。
        - 建立后不可更改
            - 记录通常存储不打算在创建对象后修改的数据。
        - 可以基于`class`和`struct`建立

### 1.6 值类型
- 值类型派生自`System.ValueType`（派生自 `System.Object`）。
    - 派生自 `System.ValueType` 的类型在 CLR 中具有特殊行为。
    - 结构的内存在声明变量的任何上下文中进行内联分配。
    - 对于值类型变量，没有单独的堆分配或垃圾回收开销。
- 值类型变量直接包含其值。
- 可以声明属于值类型的 record struct 类型，并包括记录的合成成员。

- 值类型分为两类：`struct`和`enum`。
    - 内置的数值类型是结构，它们具有可访问的字段和方法
    - 但可将这些基元类型类型视为简单的非聚合类型，为其声明并赋值

- 值类型已密封。
    - 不能从任何值类型（例如 `System.Int32`）派生类型。
    - 不能将结构定义为从任何用户定义的类或结构继承，因为结构只能从 `System.ValueType` 继承。
    - 但是，一个结构可以实现一个或多个接口。
        - 可将结构类型强制转换为其实现的任何接口类型。
        - 这将导致“装箱”操作，以将结构包装在托管堆上的引用类型对象内。
        - 当你将值类型传递给使用 System.Object 或任何接口类型作为输入参数的方法时，就会发生装箱操作。
        > [!note|label:参考笔记]
        > * [类型的转换](/ProjectDocs/cs/Back-end-Development/Csharp/2-4-Type-Convert.md)

### 1.7 引用类型
- 使用`class`、`record`、`delegate`、数组或`interface`定义的类型称为**引用类型**
- 在声明引用类型变量时，它将包含默认值 `null`，直到你将其分配给该类型的实例，或者使用 `new` 运算符创建一个。 
- 无法使用 `new` 运算符直接实例化接口
    - 必须创建一个继承并实现接口的类，然后用该类的实例以使用接口
- 创建对象时，会在托管堆上分配内存。
    - 变量只保留对对象位置的引用。
    - 对于托管堆上的类型，在分配内存和回收内存时都会产生开销。
        - “垃圾回收”是 CLR 的自动内存管理功能，用于执行回收。
        - 但是，垃圾回收已是高度优化，并且在大多数情况下，不会产生性能问题。
        - 参考官方文档[CLR的自动内存管理](https://learn.microsoft.com/zh-cn/dotnet/standard/automatic-memory-management)

- 所有数组都是引用类型，即使元素是值类型，也不例外
    - 数组隐式派生自 `System.Array` 类
    - 可以使用 C# 提供的简化语法声明和使用数组
- 引用类型完全支持继承。
    - 创建类时，可以从其他任何**未定义为密封的**接口或类继承
    - 其他类可以从你的类继承并替代虚拟(`virtual`)方法。

### 1.8 文本值类型
在 C# 中，文本值从编译器接收类型。
- 可以通过在数字末尾追加一个字母来指定数字文本应采用的类型。
    - 例如，若要指定应按 float 来处理值 4.56，则在该数字后追加一个“f”或“F”，即 4.56f。
    - 参考笔记[变量与常量](/ProjectDocs/cs/Back-end-Development/Csharp/2-3-Variable-Constant.md)中`3.1 直接常量`部分。
- 如果没有追加字母，那么编译器就会推断文本值的类型。 

- 由于文本已类型化，且所有类型最终都是从 `System.Object` 派生，因此可以编写和编译如下所示的代码：
    ```cs
    string s = "The answer is " + 5.ToString(); //使用Int.ToString()方法，重写自Object类
    Console.WriteLine(s);// Outputs: "The answer is 5"

    Type type = 12345.GetType(); //实际进行装箱，然后使用Object.GetType()方法
    Console.WriteLine(type);// Outputs: "System.Int32"
    ```

### 1.9 泛型类型
- 可使用一个或多个类型参数声明的类型，用作实际类型（具体类型）的占位符.
- 客户端代码在创建类型实例时提供具体类型。
- 这种类型称为泛型类型。
- 例如，.NET 类型 `System.Collections.Generic.List<T>` 具有一个类型参数`T`
    - 当创建类型的实例时，指定列表将包含的对象的类型，例如 `string`：
    ```cs
    List<string> stringList = new List<string>();
    stringList.Add("String example");

    ```
- 通过使用类型参数，可以用同一个类中的泛型参数以保存任意类型的元素，且无需将每个元素转换为对象
- 泛型集合类称为强类型集合
    - 因为编译器知道集合元素的具体类型，并能在编译时引发错误
    - 例如当尝试向上面示例中的 `stringList` 对象
    添加整数时。 
    ```cs
    List<string> stringList = new List<string>();
    stringList.Add(4);  //
    ```

### 1.10 隐式类型、匿名类型和可以为 null 的值类型

#### 1. 隐式类型（var/类型推断）
- 自 C# 3.0 引入
- 使用 `var` 关键字隐式键入一个局部变量（但不是类成员）。
    - 可声明局部变量而无需提供显式类型。
- 变量仍可在编译时获取类型，但类型是由编译器提供。
    - `var` 关键字指示编译器通过初始化语句右侧的表达式推断变量的类型。
    - 推断类型可以是 *内置类型* 、 *匿名类型* 、 *用户定义类型* 或 * .NET 类库中定义的类型*
    - `var` 关键字并不意味着“变体”，并且并不指示变量是松散类型或是后期绑定。
        - 它只表示由编译器确定并分配最适合的类型。
- 常见用法
    - 局部变量
        ```cs
        var i = 5;  //编译为int
        var s = "Hello";  //编译为string
        var a = new[] { 0, 1, 2 };  //编译为int[]

        var expr =
            from c in customers
            where c.City == "London"
            select c;  //编译为IEnumerable<Customer>或IQueryable<Customer>

        var anon = new { Name = "Terry", Age = 34 };  //编译为匿名类

        var list = new List<int>();  //编译为List<int>
        ```
    - 用于遍历
        - `for` 初始化语句
            ```cs
            for (var x = 1; x < 10; x++)
            ```
        - `foreach` 初始化语句
            ```cs
            foreach (var item in list) {...}
            ```
        - `using` 域
            ```cs
            using (var file = new StreamReader("C:\\myfile.txt")) {...}
            ```
        - 用于 LinQ 中查询表达
            - 在使用匿名类型初始化变量时，如果需要在以后访问对象的属性，则必须将变量声明为 `var`
            - 从源代码角度来看，匿名类型没有类名
                - 因此，如果使用 `var` 初始化了查询变量，则访问返回对象序列中的属性的唯一方法是在 `foreach` 语句中将 `var` 用作迭代变量的类型。
            - 参考下文匿名类型中示例类 `Product` 中查询出来的匿名类对象 `productQuery` 只能用 `var` 进行遍历访问
            - 参考[如何在查询表达式中使用隐式类型的局部变量和数组（C# 编程指南）](https://learn.microsoft.com/zh-cn/dotnet/csharp/programming-guide/classes-and-structs/how-to-use-implicitly-typed-local-variables-and-arrays-in-a-query-expression)

> [!note|label:常见适用var类型]
> - 局部变量在声明时直接初始化
>     - 不能初始化为 `null` / 方法组 / 匿名函数
> - 不能用于类字段，会出现悖论
>     - 编译器编译时需要知道类字段的类型，需要分析赋值表达式
>     - 赋值表达式需要知道目标类型
> - 不能在初始化表达式中使用，单用初始化语句时必须确定类型
>     - 不能同一语句初始化多个隐式类型化变量
> - 作为范围变量的类型时，会自动解析为查询范围所对应类型
>     - 不视作隐式类型化局部变量
> - 用于查询表达
>     - 不便确定查询结果中字段对应类型时，自动推断
> - 当 变量的特定类型在键盘上键入时很繁琐/是显而易见/是不会提高代码的可读性 时

- 参考官方文档
    - [常见 C# 代码约定 —— 隐式类型本地变量](https://learn.microsoft.com/zh-cn/dotnet/csharp/fundamentals/coding-style/coding-conventions#implicitly-typed-local-variables)
    - [隐式类型局部变量](https://learn.microsoft.com/zh-cn/dotnet/csharp/programming-guide/classes-and-structs/implicitly-typed-local-variables)。
    - [隐式类型的数组](https://learn.microsoft.com/zh-cn/dotnet/csharp/language-reference/builtin-types/arrays#implicitly-typed-arrays)


#### 2. 匿名类型
- 不方便为不打算存储或传递外部方法边界的简单相关值集合创建命名类型。
    - 匿名类型提供了一种方便的方法，可用来将一组只读属性封装到单个对象中，而无需首先显式定义一个类型。
    - 类型名由编译器生成，并且不能在源代码级使用。
    - 每个属性的类型由编译器推断。

- 可结合使用 `new` 运算符和对象初始值设定项创建匿名类型。
    - 有关对象初始值设定项的详细信息，请参阅[对象和集合初始值设定项](https://learn.microsoft.com/zh-cn/dotnet/csharp/programming-guide/classes-and-structs/object-and-collection-initializers)。

- 匿名类型通常用在查询表达式的 select 子句中，以便返回源序列中每个对象的属性子集。
    - 有关查询的详细信息，请参阅C# 中的 LINQ。

- 匿名类型包含一个或多个公共只读属性。
    - 包含其他种类的类成员（如方法或事件）均无效
    - 用来初始化属性的表达式**不能**为 `null`、匿名函数或指针类型。

- 最常见的方案是用其他类型的属性初始化匿名类型。 
    - 例：有示例类 `Product` 
        ```cs
        class Product
        {
            public string? Color {get;set;}     // 所需
            public  decimal Price {get;set;}    //所需
            public string? Name {get;set;}      
            public string? Category {get;set;}
            public string? Size {get;set;}
        }
        ```
    - 取出其中所需部分创建匿名类
        ```cs
        // 在products使用范围变量prod遍历，取出所有的Color和Price属性
        // 组成新的一组匿名类型的对象，实际上是 IEnumerable<编译器生成的匿名类型>
        // 最后将这个对象记为 productQuery
        var productQuery =
            from prod in products
            select new { prod.Color, prod.Price }; //匿名类型声明以 new 关键字开始

        foreach (var v in productQuery)
        {
            Console.WriteLine("Color={0}, Price={1}", v.Color, v.Price);
        }
        ```
    - 如果你没有在匿名类型中指定成员名称，编译器会为匿名类型成员指定与用于初始化这些成员的属性相同的名称。
        - 需要为使用表达式初始化的属性提供名称，如下面的示例所示。
        - 在上面示例中，匿名类型的属性名称都为 `Price` 和 `Color` 。
        > [!tip]
        > 可以使用 .NET 样式规则 [IDE0037](https://learn.microsoft.com/zh-cn/dotnet/fundamentals/code-analysis/style-rules/ide0037) 强制执行是首选推断成员名称还是显式成员名称。
    
    - 也可以按照另一类型对象来定义字段
        - 通过使用保存当前对象的变量来完成
            ```cs
            // 实例化Product类对象为product
            var product = new Product();
            // 创建一个有note字段的匿名类对象bonus
            var bonus = new { note = "You won!" };
            // 创建一个包含product实例和address字段的匿名类对象shipment
            var shipment = new { address = "Nowhere St.", product };
            // 创建一个包含product实例、bonus实例和addresss字段的匿名类对象shipmentWithBonus
            var shipmentWithBonus = new { address = "Somewhere St.", product, bonus };
            ```
    - 匿名类型支持采用 with 表达式形式的非破坏性修改。
        - 这使你能够创建匿名类型的新实例，其中一个或多个属性具有新值：
            ```cs
            var apple = new { Item = "apples", Price = 1.35 };
            Console.WriteLine(apple);
            var onSale = apple with { Price = 0.79 };   // 使用with修改Price属性值
            Console.WriteLine(onSale);
            ```

- 匿名类型是 `class` 类型，它们直接派生自 `object`，并且无法强制转换为除 `object` 外的任何类型。
    - 类型名称无法在变量声明中给出，因为只有编译器能访问匿名类型的基础名称。
    - 虽然你的应用程序不能访问它，编译器还是提供了每一个匿名类型的名称。
    - 从公共语言运行(CLR)时的角度来看，匿名类型与任何其他引用类型没有什么不同。
- 如果程序集中的两个或多个匿名对象初始值指定了属性序列，这些属性采用相同顺序且具有相同的名称和类型，则编译器将对象视为相同类型的实例。
    - 它们共享同一编译器生成的类型信息，视为同一匿名类
- 无法将 字段/属性/时间/方法 的返回类型声明为具有匿名类型
    - 同样不能将 方法/属性/构造函数/索引器 的形参声明为具有匿名类型
    - 要将匿名类型或包含匿名类型的集合作为参数传递给某一方法
        - 可将参数作为类型 `object` 进行声明。
        - 但是，对匿名类型使用 `object` 违背了强类型的目的。
    - 如果必须存储查询结果或者必须将查询结果传递到方法边界**外部**
        - 请考虑使用普通的命名结构或类而不是匿名类型。
        - 匿名类型对于即刻使用的情形起到简化作用，但对于需外部调用情形下建议使用更可读明确的结构
- 匿名类上的 `Equals()` 和 `GetHashCode()` 方法是基于各自方法属性上同名函数定义
    - 只有同一程序集中同一匿名类型的两个实例的所有属性均相等时实例才相等
    - 同一程序集要求是因为匿名类型的辅助功能级别(访问修饰符)是 `internal`
        - 不同程序集的两个匿名类实例不会相等
- 匿名类会重写 `ToString()` 方法
    - 即用大括号包括所有属性名和其对应各自的 `ToString()` 输出
    - 例如:
        ```cs
        var v = new { Title = "Hello", Age = 24 };
        // "{ Title = Hello, Age = 24 }"
        Console.WriteLine(v.ToString());
        ```

- 有关详细信息，请参阅[匿名类型](https://learn.microsoft.com/zh-cn/dotnet/csharp/fundamentals/types/anonymous-types)。

#### 3. 可为 null 的值类型
- 继承关系为 `Object` -> `ValueType` -> `Nullable<T>`
    - 任何可为空的值类型都是泛型 `System.Nullable<T>` 结构的实例

1. **介绍**
    - 普通值类型不能具有 `null` 值。
        - 不加 `?` 不可赋值为 `null`
    - 可以在类型后面追加 `?`，创建可为空的值类型。
        - 例如，`int?` 是还可以包含值 `null` 的 `int` 类型。
        - 可以为 `null` 的值类型是泛型结构类型 `System.Nullable<T>` 的实例，引用时可用以下两种形式: 
            - `Nullable<T>`
            - `T?`

            > [!tip]
            > 以下均用**T?**来替代**可为空的**，用**T**来替代**不可为null的**。

    - 在将数据传入和传出数据库（数值可能为 `null`）时，可为空的值类型特别有用。
        - 需要表示基础值类型的未定义值时，通常使用可为空的值类型。
        - 例如，布尔值或 `bool` 变量只能为 `true` 或 `false`。
            - 但是，在某些应用程序中，变量值可能未定义或缺失。
            - 例如，某个数据库字段可能包含 `true` 或 `false`，或者它可能不包含任何值，即 `NULL`。
            - 在这种情况下，可以使用 `bool?` 类型。

2. **声明和赋值**
    - T值类型可隐式转换为相应的T?值类型
        - 可以像向其基础值类型赋值一样，向可为空值类型的变量赋值
        - 还可分配 `null` 值。 
    - 可为空值类型的默认值表示 `null`
        - 它是 `Nullable<T>` 的 `.HasValue` 属性返回 `false` 的实例。

3. **检查值**
    - 可以将 `is` 运算符与类型模式结合使用，既检查 `null` 的可为空值类型的实例，又检索基础类型的值
        - 例如用 `if` 做条件判断
            ```cs
            if (variable is TypeName tempVariable)
            {  /* 如果变量variable是TypeName类(非null) 则赋值给tempVariable */  }
            else  {  /* variable 值为 null 时 */  }
            ```
    - 可以使用以下只读属性 `Nullable<T>.HasValue` 来检查和获取T?类型变量的值：
        - 如果 `HasValue` 为 `true`，则 `Nullable<T>.Value` 获取基础类型的值。
        - 如果 `HasValue` 为 `false`，则 `Value` 属性将引发 `InvalidOperationException`
        - 例如:
            ```cs
            if (variable.HasValue)
            { /* 使用 variable.Value 来访问值 */ }
            else { /* 如果访问 variable.Value 会抛出异常 */ }
            ```
    - 可将可为空的值类型的变量与 `null` 进行比较
        - 即直接使用 `!=` 运算符判断

4. **从 T? 类型转换为基础类型**
    - 如果要将T?值类型的值分配给T值类型变量，则可能需要指定要分配的替代 `null` 的值
        - 可以使用操作符 `??` 
            ```cs
            T variableResult = variable ?? value;
            // 等价于以下语句
            if (variable = null ) variableResult = value;
            else variableResult = variable;
            ```
            - 参考[?? 和 ??= 运算符 - Null 合并操作符](https://learn.microsoft.com/zh-cn/dotnet/csharp/language-reference/operators/null-coalescing-operator)
        - 或者使用 `Nullable<T>.GetValueOrDefault(T)`
            - 如果要使用基础值类型的默认值代替 `null` 则应选用该方法
    - 可以将可为空的值类型**显式**强制转换为不可为 `null` 的类型
        - 不指定对 `null` 值的处理
        - 对 `null` 强制转换同样会抛出异常 `InvalidOperationException`
    - T值类型 `T` 可以直接**隐式**转换为相应的T?值类型 `T?`

5. **提升的运算符**
    - 预定义的一元运算符/二元运算符、T值类型支持的任何 *重载运算符* 也受相应的T?值类型支持
        - 如果一个或全部两个操作数为 `null` ，则这些运算符（也称为**提升的运算符**）将生成 `null`
        - 否则，运算符使用其操作数所包含的值来计算结果。 
        - `bool?` 类型除外: 即使其中一个操作数为 `null`，运算符计算结果也可以不为NULL
            - 参考[可以为 null 的布尔逻辑运算符](https://learn.microsoft.com/zh-cn/dotnet/csharp/language-reference/operators/boolean-logical-operators#nullable-boolean-logical-operators)
    - 对于比较运算符 `<`/`>`/`<=`/`>=`
        - 两侧只要有一个 `null` 就返回 `false`
    - 相等运算符 `==`
        - 两侧同为 `null` 则返回 `true`
        - 单侧为 `null` 则返回 `false`
    - 不等运算符 `!=`
        - 两侧同为 `null` 则返回 `false`
        - 单侧为 `null` 则返回 `true`
    - 如果有自定义转换，可以在T?中使用相应转换
        - 参考 [用户定义的显式和隐式转换运算符](https://learn.microsoft.com/zh-cn/dotnet/csharp/language-reference/operators/user-defined-conversion-operators)


6. **装箱和取消装箱**
    - 值 `T?` 装箱时依照以下规则
        - `HasValue` 返回 `false` 时，生成空引用 `null`;
            - 回顾：此时如果使用 `Value` 属性访问则会抛出 `InvalidOperationException`
        - `HasValue` 返回 `true` 时，对应基础值 `T` 会装箱
            - 不对 `Nullable<T>` 实例装箱，仅对基础值类型成员装箱
    - 对已装箱的 `T` 取消装箱可以得到其相应的值类型 `T?`
        - `T?value is T Tvalue`
            - 比如 `aNullableBoxed is int valueOfA`

7. **如何确定可为空的值类型**
    > [!attention]
    > 只适用于**可为空的值类型**，不适用于**可为空的引用类型**

    - 通过构造 `System.Type` 实例来确定
        - 比如构造一个判断函数 `bool IsNullable(Type type) => Nullable.GetUnderlyingType(type) != null;`
            - 返回调用函数所返回的对象是否为 `null` 的布尔值
        - 其通过 `Nullable` 类的方法 `Nullable.GetUnderlyingType(Type)`
        - 方法签名如下 `public static Type? GetUnderlyingType (Type nullableType);`
        - 该方法会返回输入的 `nullableType` 所对应的**基础类型**
            - 如果传入 `Nullable<int>` 会返回 `int` 对应的 `Type` 对象
        - 如果传入的不是可空类型的话就返回 `null`
        - 如果传入 `null` 会抛出异常 `ArgumentNullException`
    - 不应使用 `Object.GetType` 获取 `Type` 实例
        - 对 `T?` 的实例调用 `Object.GetType` 时会将实例装箱到 `Object`
        - 对 `T?` 的非 `null` 实例装箱等同于对 `T` 值装箱
            - 参考第六点：会先调用 `HasValue` 而后判断装箱类型
        - 因而无论原实例是何种类型，都会返回其基础类型 `T` 的 `Type` 实例
    - 请勿使用 `is` 运算符以确定实例是否为可为空的值类型

- 参考官方文档
    - [可以为 null 的值类型](https://learn.microsoft.com/zh-cn/dotnet/api/system.nullable-1?view=net-9.0)。
    - [可为 null 的引用类型（C# 引用）](https://learn.microsoft.com/zh-cn/dotnet/csharp/language-reference/builtin-types/nullable-reference-types)
    - [Nullable 类](https://learn.microsoft.com/zh-cn/dotnet/api/system.nullable?view=net-9.0)
    - [Nullable<T> 结构](https://learn.microsoft.com/zh-cn/dotnet/api/system.nullable-1?view=net-9.0)
    - 有模式匹配的类型测试 —— [类型测试运算符和强制转换表达式 - is、as、typeof 和强制转换](https://learn.microsoft.com/zh-cn/dotnet/csharp/language-reference/operators/type-testing-and-cast#type-testing-with-pattern-matching)
    - [InvalidOperationException](https://learn.microsoft.com/zh-cn/dotnet/api/system.invalidoperationexception?view=net-9.0)

### 1.11 编译时类型和运行时类型
- 变量可以具有不同的编译时和运行时类型。
    - 编译时类型是源代码中变量的声明或推断类型。
    - 运行时类型是该变量所引用的实例的类型。

- 这两种类型通常是相同的，如以下示例中所示：
    ```cs
    string message = "This is a string of characters";
    ```
- 在其他情况下，编译时类型是不同的，如以下两个示例所示：
    ```cs
    object anotherMessage = "This is another string of characters";
    IEnumerable<char> someCharacters = "abcdefghijklmnopqrstuvwxyz";
    ```

    - 运行时类型为 `string`。
    - 编译时类型
        - 在第一行中为 `object`，
        - 在第二行中为 `IEnumerable<char>`。
- 如果变量的这两种类型不同，请务必了解编译时类型和运行时类型的应用情况。
    - 编译时类型确定编译器执行的所有操作。
        - 这些编译器操作包括方法调用解析、重载决策以及可用的隐式和显式强制转换。
    - 运行时类型确定在运行时解析的所有操作。
        - 这些运行时操作包括调度虚拟方法调用、计算 is 和 switch 表达式以及其他类型的测试 API。
    - 为了更好地了解代码如何与类型进行交互，请识别哪个操作应用于哪种类型。


## 2. 声明命名空间来整理类型
- .NET 使用命名空间来组织它的许多类
- 在调用成员时一般会有以下语句
    - `命名空间.类名.成员`
    - 如果预先使用 `using` 关键字声明引用命名空间时，可以直接使用 `类名.成员`
    - 在 .NET 6 开始可以使用顶级语句相关内容，参考[C# 控制台应用模板可生成顶级语句](https://learn.microsoft.com/zh-cn/dotnet/core/tutorials/top-level-templates)和[隐式 using 指令](https://learn.microsoft.com/zh-cn/dotnet/core/project-sdk/overview#implicit-using-directives)
- 使用合适的命名空间可以控制类和方法名称的范围
    - 有效避免重名
    - 使用 `namespace` 以声明命名空间
    - 命名空间的名称必须是有效的 C# 标识符名称。


## 3. 类简介
### 3.1 引用类型
- 定义为 class 的类型是引用类型。
- 在运行时，如果声明引用类型的变量，此变量就会一直包含值 `null`
    - 直到使用 `new` 运算符显式创建类实例
    - 或直到为此变量分配已在其他位置创建的兼容类型
- 创建对象时，在该托管堆上为该特定对象分足够的内存，并且该变量仅保存对所述对象位置的引用。
- 对象使用的内存由 CLR 的自动内存管理功能（称为垃圾回收）回收。

### 3.2 声明类
- 通常格式如下
    ```cs
    //[access modifier] - [class] - [identifier]
    public class Customer
    {
    // Fields, properties, methods and events go here...
    }
    ```
- 可选访问修饰符位于 `class` 关键字前面。
- `class` 类型的默认访问权限为 `internal`。
    - 此例中使用的是 `public`，因此任何人都可创建此类的实例。
- 类的名称遵循 class 关键字。
    - 类名称必须是有效的 C# 标识符名称。
- 定义的其余部分是类的主体，其中定义了行为和数据。
    - 类上的字段、属性、方法和事件统称为**类成员**。

### 3.3 创建对象
- 类和对象是不同的概念。
    - 类定义对象类型，但不是对象本身。
    - 对象是基于类的具体实体，有时称为类的实例。
- 基于类的对象是通过引用来实现其引用的，因此类被称为**引用类型**。

### 3.4 构造函数和初始化
- 创建类型的实例时，需要确保其字段和属性已初始化为有用的值。
- 可通过多种方式初始化值：
    - 接受默认值
        - 每个 .NET 类型都有一个默认值。
        - 通常，对于数字类型，该值为 0，对于所有引用类型，该值为 null。
        - 如果默认值在应用中是合理的，则可以依赖于该默认值。
    - 字段初始化表达式
        - 当 .NET 默认值不是正确的值时，可以使用字段初始化表达式设置初始值
        - 即在构造函数里初始化字段的值
        > [!note]
        > 联想到 `Static`、`Const`、`readonly`间的区别  
    - 构造函数参数
        - 设置含参数的构造函数，将参数传入作为初始化值
        - 从 C# 12 开始，可以将**主构造函数**定义为类声明的一部分
            - C# 12 之前，通常是分开的
                ```cs
                public class ExampleClass
                {
                    private int _val;
                    public ExampleClass(int val) => _val = val
                }
                ```
            - C# 12 开始可以简化为
                ```cs
                public ExampleClass(int val)
                // 直接向类名添加参数
                {   //主构造函数的参数在类正文可用
                    private int _val = val;
                }
                ```
    - 对象初始值设定项
        - 对某个属性使用 `required` 修饰符
            - 要求允许调用方使用对象初始值设定项来设置该属性的初始值
        - 添加 `required` 关键字要求调用方必须将这些属性设置为 `new` 表达式的一部分
            - 使用 `new` 时必须传入所有标记 `required` 的属性的初始值

### 3.5 类继承
- 类完全支持继承，这是面向对象的编程的基本特点
    - 创建类时，可以从其他任何未定义为 `sealed` 的类（密封类）继承。
    - 其他类可以从你的类继承并替代类虚拟方法。
    - 此外，你可以实现一个或多个接口。
- 继承是通过使用派生来完成的
    - 意味着类是通过使用其数据和行为所派生自的基类来声明的
    - 基类通过在派生的类名称后面追加冒号和基类名称来指定
        ```cs
        public class ChildClass : BaseClass
        {
            // BaseClass 的 fields, properties, methods and event 已经继承
            // ChildClass 的 fields, properties, methods and events 只需继续添加
        }
        ```
        - 类声明包括基类时，它会继承基类除构造函数外的所有成员。
        - 有关详细信息，请参阅[继承 - 派生用于创建更具体的行为的类型](https://learn.microsoft.com/zh-cn/dotnet/csharp/fundamentals/object-oriented/inheritance)。
- C# 中的类只能直接从基类继承。
    - 但是，因为基类本身可能继承自其他类，因此类可能间接继承多个基类。
    - 此外，类可以支持实现一个或多个接口。
        - 有关详细信息，请参阅接口。
- 类可以声明为 `abstract`
    - 抽象类包含抽象方法，抽象方法包含签名定义但不包含实现
    - 抽象类不能实例化
        - 只能通过可实现抽象方法的派生类来使用该类
    - 与此相反，密封类不允许其他类继承
    - 有关详细信息，请参阅抽象类、密封类和类成员[抽象类、密封类及类成员](https://learn.microsoft.com/zh-cn/dotnet/csharp/programming-guide/classes-and-structs/abstract-and-sealed-classes-and-class-members)
- 类定义可以在不同的源文件之间分割。
    - 有关详细信息，请参阅[分部类和方法](https://learn.microsoft.com/zh-cn/dotnet/csharp/programming-guide/classes-and-structs/partial-classes-and-methods)


## 4. 记录
- 从 C#9.0 开始引入语法糖**记录(record)**，记录是一个类或结构，它为使用数据模型提供特定的语法和行为。
    - C#9.0 仅引入了 `record` 关键字作为一个引用类型记录
    - C#10.0 引入了值类型记录（结构体记录），新增了 `record class` 和 `record struct`
- `record` 修饰符指示编译器合成对主要角色存储数据的类型有用的成员。
    - 这些成员包括支持值相等的 `ToString()` 和成员的重载。
    - 具体参考[博客园: C#中的记录(record)](https://www.cnblogs.com/shanfeng1000/p/14973804.html)
    - 编译器会在有参数构造函数基础上生成一个类

### 4.1 使用记录的场景
- 需要定义**依赖值相等性**的数据类型
- 需要定义**不可变对象**类型

#### 1. 值相等性
- 对**记录**来说，值相等性是指:
    - 如果记录类型的两个变量类型相匹配，且所有属性和字段值都相同，那么记录类型的两个变量是相等的。
- 对于**其他引用类型**（例如类）
    - 相等性默认指的是引用相等，
    - 也可以设置为值相等性
- 也就是说
    - 确定两个记录 `record` 实例的相等性的方法(比如`.Equal()`)和运算符(比如`==`)使用值相等性。
    - 如果类 `class` 的两个变量引用同一个对象，则这两个变量是相等的。

    > [!note]
    > - [C# 中 == 和 .Equals() 之间的区别](https://www.cnblogs.com/jmllc/p/16185765.html)
    > - [相等性比较（C# 编程指南）](https://learn.microsoft.com/zh-cn/dotnet/csharp/programming-guide/statements-expressions-operators/equality-comparisons#value-equality)

    > [!note]
    > 并非所有数据模型都适合使用值相等性。
    > 例如，Entity Framework Core 依赖引用相等性，来确保它对概念上是一个实体的实体类型只使用一个实例。
    > 因此，记录类型不适合用作 Entity Framework Core 中的实体类型。  
    > [Entity Framework Core文档](https://learn.microsoft.com/zh-cn/ef/core/)

#### 2. 不可变型
- 不可变类型会阻止你在对象实例化后更改该对象的任何属性或字段值。
- 如果你需要一个类型是线程安全的，或者需要哈希代码在哈希表中能保持不变，那么不可变性很有用。
- 记录为创建和使用不可变类型提供了简洁的语法。

> [!note]
> 不可变性并不适用于所有数据方案。
> 例如，Entity Framework Core 不支持通过不可变实体类型进行更新。

### 4.2 记录与类和结构的区别
- 声明和实例化类或结构时使用的语法与操作记录时的相同。
    - 只是将关键字 `class` => `record`，或者 `struct` => `record struct`

- 记录类支持相同的表示继承关系的语法。
    - 记录与类的区别如下所示：
        - 可在主构造函数中使用位置参数来创建和实例化具有不可变属性的类型。
            - 参考[实例构造函数——主构造函数(C#12开始)](https://learn.microsoft.com/zh-cn/dotnet/csharp/programming-guide/classes-and-structs/instance-constructors#primary-constructors)
        - 在类中指示是否**引用**相等/不相等的方法和运算符（例如 `Object.Equals(Object)` 和 `==`），在记录中指示**值**相等性或不相等。
            - 参考[记录——值相等性](https://learn.microsoft.com/zh-cn/dotnet/csharp/language-reference/builtin-types/record#value-equality)
        - 可使用 `with` 表达式对不可变对象创建在所选属性中具有新值的副本。
            - 参考[记录——非破坏性变化](https://learn.microsoft.com/zh-cn/dotnet/csharp/language-reference/builtin-types/record#nondestructive-mutation)
        - 记录的 `ToString` 方法会创建一个格式字符串，它显示对象的类型名称及其所有公共属性的名称和值。
            - 参考[记录——用于显示的内置格式设置](https://learn.microsoft.com/zh-cn/dotnet/csharp/language-reference/builtin-types/record#built-in-formatting-for-display)
        - 记录可从另一个记录继承。
            - 但记录不可从类继承，类也不可从记录继承。
- 记录结构与结构的不同之处是: 
    - 编译器合成了方法来确定相等性和 `ToString`。
    - 编译器为位置记录结构合成 `Deconstruct` 方法。

- 编译器为 `record class` 中的每个主构造函数参数合成一个公共仅初始化属性。
- 在 `record struct` 中，编译器合成公共读写属性。
- 编译器不会在不包含 `record` 修饰符的 `class` 和 `struct` 类型中创建主构造函数参数的属性。

## 5. 接口 - 定义多种类型的行为
- 接口包含非抽象 `class` 或 `struct` **必须实现**的一组相关功能的定义。
- 接口可以定义 `static` 方法，此类方法**必须**具有实现。
- 接口可为成员定义默认实现。
- 接口**不能声明实例数据**，如字段、自动实现的属性或类似属性的事件。

#### 使用场景: 
- 使用接口可以在类中包括来自多个源的行为。
    - 该功能在 C# 中十分重要，因为该语言不支持类的多重继承。
    - 如果要模拟结构 `struct` 的继承，也必须使用接口，因为它们无法实际从另一个结构或类继承。

#### 接口的定义
- 使用 `interface` 关键字定义接口
- 接口名称必须是有效的 C# 标识符名称
- 按照约定，接口名称以大写字母 I 开头。
- 例如
    ```cs
    interface IEquatable<T>
    {
        bool Equals(T obj);
    }
    ```
    - 实现 `IEquatable<T>` 接口的任何类或结构都必须包含 `Equals(T obj)` 方法的定义。
        - 可以依靠实现 `IEquatable<T>` 的类型 `T` 的类来包含 `Equals` 方法
        - 类的实例可以通过该方法确定它是否等于相同类的另一个实例。
    - `IEquatable<T> `的定义不为 `Equals` 提供实现。.
        - 类或结构可以实现多个接口，但是类只能从单个类继承。

#### 接口成员
- 接口可以包含实例方法、属性、事件、索引器或这四种成员类型的任意组合。
- 接口可以包含静态构造函数、字段、常量或运算符。
- 从 C# 11 开始，**非字段**接口成员可以是 `static abstract`。
- 接口不能包含实例字段、实例构造函数或终结器。

#### 访问级别
- 接口成员默认是公共的，可以显式指定可访问性修饰符
    - 如 `public`、`protected`、`internal`、`private`、`protected internal` 或 `private protected`
- `private` 成员必须有默认实现。

#### 接口的实现
- 若要实现接口成员，实现类的对应成员必须是公共、非静态，并且具有与接口成员相同的名称和签名。
    > [!tip]
    > - 当接口声明静态成员时，实现该接口的类型也可能声明具有相同签名的静态成员。
    >   - 也就是存在类中原有静态成员名与该类对接口的静态实现同名
    > - 它们是不同的，并且由声明成员的类型唯一标识。
    >   - 如果多个接口之间重名的话声明时需要以 `接口名.实现名` 声明
    > - 在类型中声明的静态成员不会覆盖接口中声明的静态成员。
    >   - 可以通过强制转换到接口形式进行访问

- 实现接口的类或结构必须为所有已声明的成员提供实现，而非接口提供的默认实现。
    - 但是，如果基类实现接口，则从基类派生的任何类都会继承该实现
        - 也就是可以不做新的实现
    - 例: 
        ```cs
        public class Car : IEquatable<Car>
        {
            public string? Make { get; set; }
            public string? Model { get; set; }
            public string? Year { get; set; }

            /// <summary>
            /// IEquatable<T> 的实现
            /// </summary>
            /// <param name="car">输入的 Car? 型参数</param>
            /// <returns>返回是否相等的bool值</returns>
            public bool Equals(Car? car)
            {
                return (this.Make, this.Model, this.Year) ==
                    (car?.Make, car?.Model, car?.Year);
            }
        }

        interface IEquatable<T>
        {
            bool Equals(T obj);
        }
        ```

#### 显示接口实现与接口属性
- 类的属性和索引器可以为接口中定义的属性或索引器定义额外的访问器。
    - 例如，接口可能会声明包含 `get` 取值函数的属性。
    - 实现此接口的类可以声明包含 `get` 和 `get` 取值函数的同一属性。
- 如果属性或索引器使用显式实现，则访问器必须匹配。
    - 参考[显式接口实现](https://learn.microsoft.com/zh-cn/dotnet/csharp/programming-guide/interfaces/explicit-interface-implementation)和[接口属性](https://learn.microsoft.com/zh-cn/dotnet/csharp/programming-guide/classes-and-structs/interface-properties)

#### 接口多继承与多态
- 接口可从一个或多个接口继承(`interface IChild: IParent1 , IParent2`)
    - 派生接口从其基接口继承成员(`IParent1.Member`=>`IChild.Menber`)
    - 实现派生接口的类必须实现派生接口中的所有成员，包括派生接口的基接口的所有成员(`class ExampleClass: IChild`必须实现`IChild,IParent1,IParent2`中的所有成员，参考上面接口实现中对重名方法处理)
        - 该类(`ExampleClass`)可能会隐式转换为派生接口(`IChild exmInterface1 = (IChild)ExampleClass;`)或任何其基接口(`IParent1 exmInterface2 = (IParent1)ExampleClass;`)
- 类可能通过它继承的基类或通过其他接口继承的接口来多次包含某个接口
    - 类只能提供接口的实现一次，并且仅当类将接口作为类定义的一部分 (`class ClassName : ExampleClass, IParent3`) 进行声明时才能提供(`IParent3.Member`)
    - 如果由于继承实现接口的基类(`ExampleClass`)而继承了接口(`IParent1,IParent2,IChild`)，则基类会提供接口的成员的实现(`ExampleClass.InterfaceMemberOfParent`=>`ClassName.InterfaceMemberOfParent`)

- 基类还可以使用虚拟成员实现接口成员。
    - 在这种情况下，派生类可以通过重写虚拟成员来更改接口行为。
    - 派生类可以重新实现任何虚拟接口成员(`interface IFoo{virtual foo()}`可以在派生类可以重写)，而不是使用继承的实现
    - 有关虚拟成员的详细信息，请参阅[多态性](https://learn.microsoft.com/zh-cn/dotnet/csharp/fundamentals/object-oriented/polymorphism)
- 当接口声明方法的默认实现时，实现该接口的任何类都会继承该实现（你需要将类实例强制转换为接口类型，才能访问接口成员上的默认实现）。


#### 接口的特点
- 在 8.0 以前的 C# 版本中，接口类似于只有抽象成员的抽象基类。
    - 实现接口的类或结构必须实现其所有成员。
    - 有关抽象类的详细信息，请参阅[抽象类、密封类及类成员](https://learn.microsoft.com/zh-cn/dotnet/csharp/programming-guide/classes-and-structs/abstract-and-sealed-classes-and-class-members)
- 从 C# 8.0 开始，接口可以定义其部分或全部成员的默认实现。
    - 实现接口的类或结构不一定要实现具有默认实现的成员。
    - 有关详细信息，请参阅默认接口方法。
- 接口无法直接进行实例化。
    - 其成员由实现接口的任何类或结构来实现。
- 一个类或结构可以实现多个接口。
    - 一个类可以继承一个基类，还可实现一个或多个接口。

## 6. 泛型

## 7. 匿名类型
