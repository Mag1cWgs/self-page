## 数组与集合系统
>[!tip]
> 参考文档:  
> - [17 Arrays (英文)](https://learn.microsoft.com/en-us/dotnet/csharp/language-reference/language-specification/arrays#17-arrays)
>   - [17 数组 (官方机翻)](https://learn.microsoft.com/zh-cn/dotnet/csharp/language-reference/language-specification/arrays#17-arrays)
> - [泛型和数组](https://learn.microsoft.com/zh-cn/dotnet/csharp/programming-guide/generics/generics-and-arrays)
> - .Net 9 版本下的API
>   - [Array 类 (位于 System 命名空间)](https://learn.microsoft.com/zh-cn/dotnet/api/system.array?view=net-9.0)
>   - [System.Collections 命名空间](https://learn.microsoft.com/zh-cn/dotnet/api/system.collections?view=net-9.0)
>       - 包含定义各种对象集合（如列表、队列、位数组、哈希表和字典）的接口和类。
>   - [System.Collections.Concurrent 命名空间](https://learn.microsoft.com/zh-cn/dotnet/api/system.collections.concurrent?view=net-9.0)
>       - 提供多个线程安全的集合类，这些类应在多个线程同时访问集合时代替 `System.Collections` 和 `System.Collections.Generic` 命名空间中的相应类型。
>       - 但是，不保证通过扩展方法或通过显式接口实现访问集合对象的元素是线程安全的，并且可能需要由调用方同步。
>   - [System.Collections.Frozen 命名空间](https://learn.microsoft.com/zh-cn/dotnet/api/system.collections.frozen?view=net-9.0)
>       - 自 .Net 8 开始引入的 `FrozenCollection` ，用于在只读情形下提升性能。
>   - [System.Collections.Generic 命名空间](https://learn.microsoft.com/zh-cn/dotnet/api/system.collections.generic?view=net-9.0)
>       - 包含定义泛型集合的接口和类，这些类允许用户创建强类型集合，这些集合提供比非泛型强类型集合更好的类型安全性和性能。
>       - 包括 `Dictionary` `HashSet` `LinkedList` `List` `Queue` `Stack` 等常用数据结构
>   - [System.Collections.Immutable 命名空间](https://learn.microsoft.com/zh-cn/dotnet/api/system.collections.immutable?view=net-9.0)
>       - 包含定义不可变集合的接口和类。
>   - [System.Collections.ObjectModel 命名空间](https://learn.microsoft.com/zh-cn/dotnet/api/system.collections.objectmodel?view=net-9.0)
>       - 包含可在可重用库的对象模型中用作集合的类。 当属性或方法返回集合时使用这些类。
>   - [System.Collections.Specialized 命名空间](https://learn.microsoft.com/zh-cn/dotnet/api/system.collections.specialized?view=net-9.0)
>       - 包含专用的强类型集合；例如，链接列表词典、位向量以及只包含字符串的集合。

