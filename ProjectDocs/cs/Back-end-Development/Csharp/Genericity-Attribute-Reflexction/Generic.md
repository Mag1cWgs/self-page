## 0 泛型 Generic

### 0.1 认识泛型
- 指通过参数化类型在同一份代码上操作多份数据类型
- 泛型不是类型，是类型的模板
    - 泛型与普通类型区别：泛型类型与一组类型参数/类型变量相关联
    - 由 CLR 在运行时支持
        - 可以在 CLR 支持的各个语言间切换操作
- C# 提供了五种泛型
    - 泛型类、泛型结构、泛型接口、泛型委托
    - 泛型方法成员

### 0.2 泛型的声明和使用
1. 声明泛型
    ```cs
    [访问修饰符] [返回类型] 泛型名称<类型参数列表>
    ```
    - 其中泛型名称要符合标识符定义
    - 尖括号表示类型参数列表
        - 可包含一个到多个类型参数，比如 `<T, U, ···>`
2. C# 中，常用泛型有**泛型类**和**泛型方法**
    - 比如有 `Stack<T>` 和 `swap<T>(a,b)`
        ```cs
        class Stack<T>
        {
            T data[MaxSize];
            int top;
        }
        void swap<T>(ref T a, ref T b)
        {
            T temp = a;
            a = b;
            b = temp;
        }
        ```
    - 使用时会将未指定的类型参数变成系统能识别的类型（C#内置或者类类型）

3. 一般的，创建泛型类的过程是从一个现有的具体类开始
    - 逐一的将各个类型更改为类型参数
    - 直到通用化和可用性平衡
4. 泛型的最常见用图就是创建集合类
    - 实际上，.Net FrameWork 类库在 `System.Collections.Generic` 命名空间包含了许多泛型集合类
    - 优先使用 .Net 框架提供的现有泛型类

### 0.3 泛型的 MSIL 代码结构
1. 编译方式：
    - 首轮编译时：编辑器为泛型类产生以 T 为占位符的IL代码与元数据
        - 此时并不实例化，T 仅作为占位符 `<! T>`
    - JIT 编译时，遇到泛型类时，使用实际输入的类型替换泛型版的IL代码和元数据的 T
        - 即进行泛型类型的实例化
2. 引用类型和值类型作为参数的不同
    - CLR 对所有类型参数为引用类型的泛型类产生同一份代码
    - 对每一个不同的值类型会产生独立的代码
    - 因为实例化一个引用类型的泛型，在内存中分配内存大小一致
    - 实例化值类型的泛型时在内存中分配大小不同

### 0.4 类型参数的约束
- 类型参数可以通过约束来限制实例化时进行替代的类型
    - 使用上下文关键字 `where`
    - `where` 子句格式：`where 类型参数: 约束1,约束2,···`
    - 比如
        ```cs
        class Foo<T1,T2,T3> where T1: int,double T2: MyClassExample
        {   // T1 只能是 int 或者 double 类
            // T2 只能是 MyClassExample 类或者它的派生
            // T3 无约束
        }
        ```
- 五种约束
    - `struct` 类型约束: `where T: struct`
        - `T` 必须是值类型
        - `T` 可以指定除 `Nullable`(`Type?`) 之外的任何值类型
    - `class` 类型约束: `where T: class`
        - `T` 必须是引用类型，包括 类、接口、委托、数组等
    - `new()` 类型约束: `where T: new()`
        - `T` 必须具有无参数的公共构造函数
    - `BaseClassName` 类型约束: `where T: BaseClassName`
        - `T` 必须是指定的基类 `BaseClassName` 或者它的派生类
    - `IInterfaceName` 类型约束: `where T: IInterfaceName`
        - `T` 必须是指定的接口或者实现指定的接口

### 0.5 泛型的继承
- 除了直接声明泛型，也可以在基类中包含泛型类的声明
- 如果基类是泛型类，子类声明是基类的类型只能全部实例化或者是子类的类型名
    ```cs
    class Foo<U,V>{}

    class Foo1  : Foo<int,int>{}
    // 不能: 
    //      class WrongFoo: Foo<U,V> 
    // 因为 WrongFoo 不是泛型类，可以如下
    class Foo2<P,Q>: Foo<P,Q>{} // 子类 Foo2 为基类 Foo 提供类型参数 P,Q

    class Foo3<X,Y>: Foo<int,int>{} // Foo3 继承于非泛型类 Foo<int,int>
    ```

### 0.6 泛型接口和委托
1. 泛型接口：
    - 和泛型继承类似，泛型接口的类型参数要么完全实例化，要么来自实现类声明的类型参数
    ```cs
    interface IFoo<T>
    {
        int Add(T num);
    }
    class MyClass
    {
        public int num;
        public MyClass()
        {
            this.num = 0; 
        }
    }

    class Foo1: IFoo<int>
    {   // 指定类型时接口名后也要记得加上类型限定
        int IFoo<int>.Add(int num)
        {
            return num+1; 
        }
    }

    // class AnoMyClass: IFoo<T> // 必须指定 T 的类型
    class Foo2<U> where U: MyClass,new() : IFoo<U>
    {   // 使用 new() 保证 MyClass 中无参数公共构造函数
        // 此时 U 只能是 MyClass 或其派生类
        // U 必须实现 IFoo<U>
        int IFoo<U>.Add(U myClassExample)
        {
            return ++myClassExample.num;
        }
    }
    ```
    > [!note|label:泛型类继承相关]
    > ```
    >        [接口 IFoo] ->  [类 Foo]
    >         ↓ (泛型化)
    > [泛型接口 IFoo<T>] ->  [泛型类 Foo<T>]
    >         ↓             不能是一般类，需要指定 T 的类型（下面这种）
    >  [接口 IFoo<int>]  ->  [类 Foo<int> 或者 Foo ]

2. 泛型委托:
    - 泛型委托支持在委托返回值和参数中应用参数类型
    - 这些参数类型同样可以附带合法约束

> [!tip|label:回顾]
> - 泛型通常与集合以及作用于集合的方法一起使用。
>   - `System.Collections.Generic` 命名空间包含几个基于泛型的集合类。
>   - 不建议使用非泛型集合（如 `ArrayList`），并且仅出于兼容性目的而维护非泛型集合。
> - 有关详细信息，请参阅 [.NET 中的泛型](https://learn.microsoft.com/zh-cn/dotnet/standard/generics/#defining-and-using-generics)



---



## 1 .NET 中的泛型
- 参考链接:[MSDN](https://learn.microsoft.com/zh-cn/dotnet/standard/generics/)

### 1.1 泛型的利与弊
- 使用泛型集合和委托有很多好处：
    - 类型安全
        - 泛型将类型安全的负担从你那里转移到编译器。
        - 没有必要编写代码来测试正确的数据类型，因为它会在编译时强制执行。
        - 降低了强制类型转换的必要性和运行时错误的可能性。
    - 代码更少且可以更轻松地重用代码。
        - 无需从基类型继承，无需重写成员。
        - 例如，可立即使用 [LinkedList<T>](https://learn.microsoft.com/zh-cn/dotnet/api/system.collections.generic.linkedlist-1) 。
        - 例如，你可以使用下列变量声明来创建字符串的链接列表：
            ```cs
            LinkedList<string> llist = new LinkedList<string>();
            ```
    - 性能更好。
        - 泛型集合类型通常能更好地存储和操作值类型，因为无需对值类型进行装箱。
    - 泛型委托可以在无需创建多个委托类的情况下进行类型安全的回调。
        - 例如，[Predicate<T>](https://learn.microsoft.com/zh-cn/dotnet/api/system.predicate-1) 泛型委托允许你创建一种为特定类型实现你自己的搜索标准的方法并将你的方法与 [Array](https://learn.microsoft.com/zh-cn/dotnet/api/system.array) 类型比如 Find、 FindLast和 FindAll方法一起使用。
    - 泛型简化动态生成的代码。
        - 使用具有动态生成的代码的泛型时，无需生成类型。
        - 这会增加方案数量，在这些方案中你可以使用轻量动态方法而非生成整个程序集。
        - 有关详细信息，请参阅如何：[定义和执行动态方法](https://learn.microsoft.com/zh-cn/dotnet/fundamentals/reflection/how-to-define-and-execute-dynamic-methods)和 [DynamicMethod类](https://learn.microsoft.com/zh-cn/dotnet/api/system.reflection.emit.dynamicmethod?view=net-9.0)。
- 以下是泛型的一些局限：
    - 泛型类型可从多数基类中派生，但是.NET 不支持上下文绑定的泛型类型
        - 如 [MarshalByRefObject](https://learn.microsoft.com/zh-cn/dotnet/api/system.marshalbyrefobject) （约束可用于要求泛型类型形参派生自诸如 `MarshalByRefObject`）
        - 泛型类型可派生自 [ContextBoundObject](https://learn.microsoft.com/zh-cn/dotnet/api/system.contextboundobject)，但尝试创建该类型实例会导致 [TypeLoadException 异常](https://learn.microsoft.com/zh-cn/dotnet/api/system.typeloadexception)。
    - 枚举不能具有泛型类型形参。
        - 枚举偶尔可为泛型（例如，因为它嵌套在被定义使用 Visual Basic、C# 或 C++ 的泛型类型中）。
        - 有关详细信息，请参阅 “[常规类型系统](https://learn.microsoft.com/zh-cn/dotnet/standard/base-types/common-type-system)”中的“枚举”。
    - 轻量动态方法不能是泛型。
    - 在 Visual Basic、C# 和 C++ 中，包含在泛型类型中的嵌套类型不能被实例化，除非已将类型分配给所有封闭类型的类型形参。
        - 另一种说法是：在反射中，定义使用这些语言的嵌套类型包括其所有封闭类型的类型形参。
        - 这使封闭类型的类型形参可在嵌套类型的成员定义中使用。
        - 有关详细信息，请参阅 [MakeGenericType](https://learn.microsoft.com/zh-cn/dotnet/api/system.type.makegenerictype) 中的“嵌套类型”。
    > [!tip]
    > 通过在动态程序集中触发代码或通过使用 [Ilasm.exe (IL 汇编程序)](https://learn.microsoft.com/zh-cn/dotnet/framework/tools/ilasm-exe-il-assembler) 定义的嵌套类型不需要包括其封闭类型的类型参数；然而，如果不包括，类型参数就不会在嵌套类的范围内。

### 1.2 类库和语言支持
1. .NET 在以下命名空间中提供大量泛型集合类
    - [System.Collections.Generic](https://learn.microsoft.com/zh-cn/dotnet/api/system.collections.generic) 中包含 .NET 提供的大部分泛型集合
        - 比如 [List<T>](https://learn.microsoft.com/zh-cn/dotnet/api/system.collections.generic.list-1) 和 [Dictionary<TKey,TValue>](https://learn.microsoft.com/zh-cn/dotnet/api/system.collections.generic.dictionary-2)
    - [System.Collections.ObjectModel](https://learn.microsoft.com/zh-cn/dotnet/api/system.collections.objectmodel) 中包含对类用户公开对象模型的其他泛型集合类
        - 比如 [ReadOnlyCollection<T>](https://learn.microsoft.com/zh-cn/dotnet/api/system.collections.objectmodel.readonlycollection-1)
2. [System](https://learn.microsoft.com/zh-cn/dotnet/api/system) 命名空间
    - 提供了排序和等同性比较的泛型结构 (`Array`、`IComparable`、`IComparable<T>` 和 `Comparison<T>`)
    - 提供了事件处理程序、转换和搜索谓词的泛型委托类型
        - 比如 `EventArgs`、`EventHandler`
        - 比如 `Converter<TInput,TOutput>`
3. 其他命名空间对泛型的支持
    - [System.Reflection](https://learn.microsoft.com/zh-cn/dotnet/api/system.reflection) 用于检查泛型类型和泛型方法
    - [System.Reflection.Emit](https://learn.microsoft.com/zh-cn/dotnet/api/system.reflection.emit) 用于发出包含泛型类型和方法的动态程序集
    - [System.CodeDom](https://learn.microsoft.com/zh-cn/dotnet/api/system.codedom) 用于生成包括泛型的源图
4. CLR 公共语言运行时提供了操作码和前缀来支持 MSIL 中的泛型类型
    - 包括 `Stelem`、`Ldelem`、`Unbox_Any`、`Constrained` 和 `Readonly`
5. 其他语言支持：
    - Visual C++、C#、Visual Basic 都对定义和使用泛型提供完全支持



---



## 2 泛型集合
- 参考链接
    - [.NET 中的泛型集合](https://learn.microsoft.com/zh-cn/dotnet/standard/generics/collections)
    - [常用集合类型](https://learn.microsoft.com/zh-cn/dotnet/standard/collections/commonly-used-collection-types)

### 2.1 System.Collections.Generic
- 许多泛型集合类型均为非泛型类型的直接模拟。
- [Dictionary<TKey,TValue>](https://learn.microsoft.com/zh-cn/dotnet/api/system.collections.generic.dictionary-2) 是 [Hashtable](https://learn.microsoft.com/zh-cn/dotnet/api/system.collections.hashtable) 的泛型版本；
    - 它使用枚举的泛型结构 [KeyValuePair<TKey,TValue>](https://learn.microsoft.com/zh-cn/dotnet/api/system.collections.generic.keyvaluepair-2) 而不是 [DictionaryEntry](https://learn.microsoft.com/zh-cn/dotnet/api/system.collections.dictionaryentry?view=net-9.0)。
- [List\<T>](https://learn.microsoft.com/zh-cn/dotnet/api/system.collections.generic.list-1) 是 [ArrayList](https://learn.microsoft.com/zh-cn/dotnet/api/system.collections.arraylist) 的泛型版本。
    - 存在响应非泛型版本的泛型 [Queue\<T>](https://learn.microsoft.com/zh-cn/dotnet/api/system.collections.generic.queue-1) 和 [Stack\<T>](https://learn.microsoft.com/zh-cn/dotnet/api/system.collections.generic.stack-1) 类。
- 存在 [SortedList<TKey,TValue>](https://learn.microsoft.com/zh-cn/dotnet/api/system.collections.generic.sortedlist-2) 的泛型和非泛型版本。
    - 这两个版本均为字典和列表的混合。
- [SortedDictionary<TKey,TValue>](https://learn.microsoft.com/zh-cn/dotnet/api/system.collections.generic.sorteddictionary-2) 泛型类是一个纯字典
    - 没有任何非泛型对应项。
- [LinkedList\<T>](https://learn.microsoft.com/zh-cn/dotnet/api/system.collections.generic.linkedlist-1) 泛型类是真正的链接列表
    - 没有任何非泛型对应项。

### 2.2 System.Collections.ObjectModel
- [Collection\<T>](https://learn.microsoft.com/zh-cn/dotnet/api/system.collections.objectmodel.collection-1) 泛型类提供用于派生自己的泛型集合类型的基类。
- [ReadOnlyCollection\<T>](https://learn.microsoft.com/zh-cn/dotnet/api/system.collections.objectmodel.readonlycollection-1) 类提供了任何从实现 [IList\<T>](https://learn.microsoft.com/zh-cn/dotnet/api/system.collections.generic.ilist-1) 泛型接口的类型生成只读集合的简便方法。
- [KeyedCollection<TKey,TItem>](https://learn.microsoft.com/zh-cn/dotnet/api/system.collections.objectmodel.keyedcollection-2) 泛型类提供了存储包含其自己的键的对象的方法。

### 2.3 其他泛型结构
- [Nullable\<T>](https://learn.microsoft.com/zh-cn/dotnet/api/system.nullable-1) 泛型结构
    - 允许使用值类型
    - 可以分配 `null`
    - 泛型类型参数可为任意值类型
    - 参考 [C#中可为 null 的值类型](https://learn.microsoft.com/zh-cn/dotnet/csharp/language-reference/builtin-types/nullable-value-types) / [VB中可为 null 的值类型](https://learn.microsoft.com/zh-cn/dotnet/visual-basic/programming-guide/language-features/data-types/nullable-value-types)
- [ArraySegment<T>](https://learn.microsoft.com/zh-cn/dotnet/api/system.arraysegment-1) 泛型结构
    - 提供了分隔任何类型的从零开始的一维数组内的一系列元素的方法。
    - 泛型类型参数是数组中元素的类型。
- 如果采用 .NET 的事件处理模式
    - 泛型委托 [EventHandler<TEventArgs>](https://learn.microsoft.com/zh-cn/dotnet/api/system.eventhandler-1) 不需要声明委托类型
    - 比如：有 `EventArgs` 的派生类 `MyEventArgs` 来存储事件的数据，应用如下语句来声明事件
        ```cs
        public event EventHandler<MyEventArgs> MyEvent;
        ```



---



## 3 泛型委托（操作数组/列表）
- 参考链接
    - [MSDN](https://learn.microsoft.com/zh-cn/dotnet/standard/generics/delegates-for-manipulating-arrays-and-lists)

### 3.1 用于操作数组和列表的泛型委托

- [Action<T>](https://learn.microsoft.com/zh-cn/dotnet/api/system.action-1) 泛型委托表示对指定类型的元素执行某些操作的方法。
    - 只需先创建一种对元素执行所需操作的方法
    - 而后创建 `Action<T>` 委托的实例来表示该方法
    - 最后将该数组和委托传递给 [Array.ForEach](https://learn.microsoft.com/zh-cn/dotnet/api/system.array.foreach) 静态泛型方法。
    - 数组的每个元素都可以调用该方法。

- [List<T>](https://learn.microsoft.com/zh-cn/dotnet/api/system.collections.generic.list-1) 泛型类还提供了 [ForEach](https://learn.microsoft.com/zh-cn/dotnet/api/system.collections.generic.list-1.foreach) 方法，该方法使用 [Action<T>](https://learn.microsoft.com/zh-cn/dotnet/api/system.action-1) 委托。
    - 此方法不属泛型方法。

> [!tip|label:备注]
> - 这使泛型类型和方法变得有趣。
> - [Array.ForEach](https://learn.microsoft.com/zh-cn/dotnet/api/system.array.foreach) 方法必须是静态（在 Visual Basic 中为 `Shared`）和泛型的，因为 [Array](https://learn.microsoft.com/zh-cn/dotnet/api/system.array) 不是泛型类型；
> - 你可以对 Array.ForEach 指定一种类型以继续运行的唯一原因是该方法有自己的类型参数列表。
> - 与之相反，非泛型 List<T>.ForEach 方法属于泛型类 List<T>，因此它仅使用其类的类型参数。
> - 该类为强类型，因此此方法可以作为实例方法。

- [Predicate<T>](https://learn.microsoft.com/zh-cn/dotnet/api/system.predicate-1) 泛型委托表示的是用于确定特定元素是否满足你定义的标准的方法。
    - 可以将其用于 `Array` 的以下静态泛型方法来搜索一个或一组元素：
        - `Exists`、`Find`、`FindAll`、`FindIndex`、`FindLast`、`FindLastIndex` 和`TrueForAll`。
- `Predicate<T>` 也适用于 `List<T>` 泛型类相应的非泛型实例方法。

- [Comparison<T>](https://learn.microsoft.com/zh-cn/dotnet/api/system.comparison-1) 泛型委托让你能为不具有本机排序顺序的数组或列表元素提供顺序排序或重写本机排序顺序。
    - 创建执行比较的方法，创建一个 `Comparison<T>` 委托的实例，以表示你的方法
    - 然后将该数组和委托传递给 `Array.Sort<T>(T[], Comparison<T>)` 静态泛型方法。
    - `List<T>` 泛型类提供相应的实例方法重载：`List<T>.Sort(Comparison<T>)`。

- [Converter<TInput,TOutput>](https://learn.microsoft.com/zh-cn/dotnet/api/system.converter-2) 泛型委托让你能定义两个类型之间的转换
    - 将一个类型的数组转换到另一个类型的数组，或者将一个类型的列表转换到另一个类型的列表。
    - 创建将现有列表元素转换为新类型的方法: 
        - 创建一个委托实例来表示该方法，并使用 `Array.ConvertAll` 泛型静态方法
            - 从原始数组生成新类型数组；
        - 或使用 `List<T>.ConvertAll<TOutput>(Converter<T,TOutput>)` 泛型实例方法 
            - 从原始列表生成新类型列表。

### 3.2 链接委托
- 使用这些委托的许多方法返回数组或列表，然后传递到另一种方法。
- 例如，如果你想要选择某些数组元素，将这些元素转换为新类型，并将其保存在新的数组中，则可以将 `FindAll` 泛型方法返回的数组传递到 `ConvertAll` 泛型方法。 
- 如果新的元素类型缺少自然排序顺序，你可以将 `ConvertAll` 泛型方法返回的数组传递到 `Sort<T>(T[], Comparison<T>)` 泛型方法。



---



## 4 泛型数学(.NET 7)
- 参考链接
    - [MSDN](https://learn.microsoft.com/zh-cn/dotnet/standard/generics/math)

- .NET 7 为基类库引入了新的数学相关泛型接口。
- 提供这些接口意味着可以将泛型类型或方法的类型参数约束为“类似于数字”。 
- 此外，C# 11 及更高版本允许定义 `static virtual` 接口成员。
- 由于必须将运算符声明为 `static`，因此这一新的 C# 功能可用于在新接口中为类似于数字的类型声明运算符。

- 库作者将从泛型数学接口中受益最多，因为他们可以通过删除“冗余”重载来简化其代码库。
- 其他开发人员将间接受益，因为他们使用的 API 可能会开始支持更多类型。



---



## 5 泛型接口
- 参考链接
    - [MSDN](https://learn.microsoft.com/zh-cn/dotnet/standard/generics/interfaces)

- 泛型接口提供与非泛型接口对应的类型安全接口
    - 用于实现排序比较、相等比较以及泛型集合类型所共享的功能。
- .NET 7 为类似数字的类型引入了泛型接口
    - 例如 `System.Numerics.INumber<TSelf>`。
    - 通过这些接口可定义提供数学功能的泛型方法，其中泛型类型参数被约束为实现泛型数字接口的类型。
    > [!tip|label:备注]
    > 多个泛型接口的类型参数标记为协变或逆变，这为分配和使用实现这些接口的类型提供了更好的灵活性。 有关详细信息，请参阅[协变和逆变](https://learn.microsoft.com/zh-cn/dotnet/standard/generics/covariance-and-contravariance)。

### 5.1 相等比较和排序比较
#### System 命名空间中
- [System.IComparable<T>](https://learn.microsoft.com/zh-cn/dotnet/api/system.icomparable-1) 和 [System.IEquatable<T>](https://learn.microsoft.com/zh-cn/dotnet/api/system.iequatable-1) 泛型接口与它们对应的非泛型接口一样
    - 各自定义了用于排序比较和相等比较的方法。
    - 类型通过实现这些接口来提供执行这些比较的能力。

#### System.Collections.Generic 命名空间
- [IComparer<T>](https://learn.microsoft.com/zh-cn/dotnet/api/system.collections.generic.icomparer-1) 和 [IEqualityComparer<T>](https://learn.microsoft.com/zh-cn/dotnet/api/system.collections.generic.iequalitycomparer-1) 泛型接口
    - 为没有实现 [System.IComparable<T>](https://learn.microsoft.com/zh-cn/dotnet/api/system.icomparable-1) 或 [System.IEquatable<T>](https://learn.microsoft.com/zh-cn/dotnet/api/system.iequatable-1) 接口的类型提供了一种定义排序比较和相等比较的方式。
    - 对于实现了这些接口的类型，它们还提供了一种方式来重新定义它们的关系。

- 这些接口由许多泛型集合类的方法和构造函数使用。
    - 可以将泛型 `IComparer<T>` 对象传递至 [SortedDictionary<TKey,TValue>](https://learn.microsoft.com/zh-cn/dotnet/api/system.collections.generic.sorteddictionary-2) 类的构造函数，以便为没有实现泛型 `System.IComparable<T>` 的类型指定排列顺序。
    - 存在 [Array.Sort](https://learn.microsoft.com/zh-cn/dotnet/api/system.array.sort) 泛型静态方法与通过泛型 `IComparer<T>` 实现对数组和列表进行排序的 [List<T>.Sort](https://learn.microsoft.com/zh-cn/dotnet/api/system.collections.generic.list-1.sort) 实例方法的重载。

- [Comparer<T>](https://learn.microsoft.com/zh-cn/dotnet/api/system.collections.generic.comparer-1) 和 [EqualityComparer<T>](https://learn.microsoft.com/zh-cn/dotnet/api/system.collections.generic.equalitycomparer-1) 泛型类
    - 为 `IComparer<T>` 和 `IEqualityComparer<T>` 泛型接口的实现提供基类
    - 还通过其各自的 [Comparer<T>.Default](https://learn.microsoft.com/zh-cn/dotnet/api/system.collections.generic.comparer-1.default) 和 [EqualityComparer<T>.Default](https://learn.microsoft.com/zh-cn/dotnet/api/system.collections.generic.equalitycomparer-1.default) 属性提供默认排序比较和相等性比较。

### 5.2 集合功能
- [ICollection<T>](https://learn.microsoft.com/zh-cn/dotnet/api/system.collections.generic.icollection-1) 泛型接口是泛型集合类型的基本接口。
    - 它提供添加、删除、复制和枚举元素的基本功能。
    - `ICollection<T>` 继承自泛型 [IEnumerable<T>](https://learn.microsoft.com/zh-cn/dotnet/api/system.collections.generic.ienumerable-1) 和非泛型 [IEnumerable](https://learn.microsoft.com/zh-cn/dotnet/api/system.collections.ienumerable)。

- [IList<T>](https://learn.microsoft.com/zh-cn/dotnet/api/system.collections.generic.ilist-1) 泛型接口使用索引检索的方法扩展 [ICollection<T>](https://learn.microsoft.com/zh-cn/dotnet/api/system.collections.generic.icollection-1) 泛型接口。

- [IDictionary<TKey,TValue>](https://learn.microsoft.com/zh-cn/dotnet/api/system.collections.generic.idictionary-2) 泛型接口使用键控检索的方法扩展 `ICollection<T>` 泛型接口。
    - .NET 基类库中的泛型字典类型还实现非泛型 [IDictionary](https://learn.microsoft.com/zh-cn/dotnet/api/system.collections.idictionary) 接口。

- [IEnumerable<T>](https://learn.microsoft.com/zh-cn/dotnet/api/system.collections.generic.ienumerable-1) 泛型接口提供泛型枚举器结构。
    - 泛型枚举器实现的 `IEnumerator<T>` 泛型接口继承自非泛型 [IEnumerator](https://learn.microsoft.com/zh-cn/dotnet/api/system.collections.ienumerator) 接口；
    - [MoveNext](https://learn.microsoft.com/zh-cn/dotnet/api/system.collections.ienumerator.movenext) 和 [Reset](https://learn.microsoft.com/zh-cn/dotnet/api/system.collections.ienumerator.reset) 成员（不依赖于类型参数 `T`）仅出现在非泛型接口中。
        - 这意味着非泛型接口的任何使用者还可以使用泛型接口。

### 5.3 数学功能
- .NET 7 在 [System.Numerics](https://learn.microsoft.com/zh-cn/dotnet/api/system.numerics) 命名空间中引入了泛型接口，用于描述类似数字的类型及其可用的功能。
- .NET 基类库提供的 20 种数字类型（例如 `Int32` 和 `Double`）已更新以实现这些接口。
- 这些接口中最突出的是 [INumber<TSelf>](https://learn.microsoft.com/zh-cn/dotnet/api/system.numerics.inumber-1)，它大致对应于一个“真实”数字。



---



## 6 协变和逆变
- 参考链接
    - [MSDN](https://learn.microsoft.com/zh-cn/dotnet/standard/generics/covariance-and-contravariance)
    - [MSDN: C# 编程指南: 逆变和协变](https://learn.microsoft.com/zh-cn/dotnet/csharp/programming-guide/concepts/covariance-contravariance/)
    - [CSDN: 协变 (Covariant)、逆变 (Contravariant) 与不变 (Invariant)](https://blog.csdn.net/B1151937289/article/details/119523464)
    - [ZhiHu: 推荐学习：C# 逆变的具体应用场景](https://zhuanlan.zhihu.com/p/463536930)

- 协变和逆变都是术语
    - **协变(Covariance)**指能够使用比原始指定的派生类型的派生程度更大（更具体的）的类型
        - 保留分配兼容性
        - 数组的协变使派生程度更大的类型的数组能够隐式转换为派生程度更小的类型的数组，但是此操作**不是类型安全的操作**
    - **逆变(Contravariance)**指能够使用比原始指定的派生类型的派生程度更小（不太具体的）的类型
        - 不保留兼容性
    - 相应的还有一个**不变(Invariance)**
- 泛型类型参数支持协变和逆变，可在分配和使用泛型类型方面提供更大的灵活性。
- 对方法组的协变和逆变支持允许将方法签名与委托类型相匹配。
    - 这样，不仅可以将具有匹配签名的方法分配给委托
    - 还可以分配与委托类型指定的派生类型相比
        - 返回派生程度更大的类型的方法（协变）
        - 或接受具有派生程度更小的类型的参数的方法（逆变）。

> 以下内容待填充
- 具有协变类型参数的泛型接口
-  具有逆变类型参数的泛型接口
-  具有 Variant 类型参数的泛型委托
-  定义变体泛型接口和委托
-  类型列表
