## 数组
- 数组是用于存储固定数量的相同类型元素的数据结构。
- 其作为一种数据结构，其中包含零个或多个变量，这些变量可通过计算索引进行访问。
- 数组中包含的变量（也称为数组的元素）都是相同的类型，此类型称为数组的元素类型。
- 在C#中，数组可以是单维的、多维的或交错的。

> [!tip]
> - 数组 `Array` 与元组 `Tuple` 不同！
>   - `Tuple` 作为值类型的一种，是内置的(结构体)简单类型。
> - 关于 `Tuple` 参见[8.3.11 Tuple types](https://learn.microsoft.com/en-us/dotnet/csharp/language-reference/language-specification/types#8311-tuple-types)
> - 数组类型是从抽象基类 `Array` 派生所得
>    - 所有数组都会实现 `IList` 和 `IEnumerable`。
>    - 可以使用 `foreach` 语句循环访问数组。
>    - 单维数组还实现了 `IList<T>` 和 `IEnumerable<T>`
> - 参考文档:[C#: 数组](https://learn.microsoft.com/zh-cn/dotnet/csharp/language-reference/builtin-types/arrays)

## 1. 数组类
- 通过数组，可以将同一类型的多个变量存储在一个数组数据结构中。
- 声明数组时指定数组的元素类型
    - 如果希望数组存储任意类型的元素，可将其类型指定为 `object`。
    - 在 C# 的统一类型系统中，所有类型（预定义类型、用户定义类型、引用类型和值类型）都是直接或间接从 `Object` 继承的。
- 数组是**引用类型**，因此数组可以是**可为 null 的引用类型**
    - 元素类型可能是引用类型，因此可以声明数组来保存可为 null 的引用类型。
- 可以创建隐式类型化数组，通过静态初始化以实现类型推断
    ```cs
    var arrayName = new []{element, ... , element}'
    ```
    > [!note]
    > 创建包含数组的匿名类型时，对整体使用了 `var` 时，内部的隐式类型化就无需再使用 `var`
    > 比如:
    > ```cs
    > var example = new []
    > {
    >     new {
    >     number = new {'1','2'} //这里的 var 省略
    >     } 
    > };


### 1.1 一维数组与二维数组

#### 一维数组的定义与初始化
- 一维数组的定义语法格式如下：
    ```cs
    // 数组类型[] 数组名;
    type[] arrayName;
    // 在存储可为null的引用类型时有下列三种情况
    type?[] arrayName1;  // 数组存储的元素类型是可为null的，数组不可为null
    type[]? arrayName2;  // 数组存储的元素不可为null，而数组可为null
    type?[]? arrayNeme3; // 数组和其中元素都可为null
    ```

- 动态初始化
    - 动态初始化需要借助 `new` 运算符为数组元素分配内存空间，并且为数组元素赋初值
        ```cs
        // 动态初始化格式
        type[] arrayName = new type[sizeN]{element1, element2, ... , elementN};
        ```
    - 数组中未赋初值的元素会被设置为该类型的默认值。
        - 会直接在栈中声明一个引用变量 `arrayName`，指向堆中分配的 sizeN 个连续的 `type` 对应大小的空间
        ```cs
        // 即 type[] arrayName = new type[sizeN];
        int[] numbers = new int[10]; // 所有的元素值均为 0
        string[] messages = new string[10]; // 所有的元素值均为 null，但字符串数组非null
        ```
    > [!tip]
    > - 将数组初始化为非 null 值的最佳方法是使用 [C#12(.NET8): 集合表达式](https://learn.microsoft.com/zh-cn/dotnet/csharp/language-reference/operators/collection-expressions)
    > - 创建数组时，可以将数组的元素初始化为已知值。
    >     - 从 C# 12 开始，可以使用集合表达式初始化所有集合类型。
    > - 未初始化的元素设置为默认值。
    >     - 默认值为 0 位模式(`null`/`0`/`\0`/`(enumType)0`)
    >         - 参考 [C# 类型的默认值（C# 参考）](https://learn.microsoft.com/zh-cn/dotnet/csharp/language-reference/builtin-types/default-values)
    >     - 所有引用类型（包括不可为 `null` 的类型）都具有值 `null`。
    >     - 所有值类型都有 0 位模式。
    >     - 这意味着对于 `Nullable<T>` 而言，其 `HasValue` 属性为 `false` 且 `Value` 属性未定义。
    >         - 此时调用 `Value` 属性引发异常。
    - 如果给定初始值，则 `sizeN` 与后面括号内所赋值的元素数量应一致
        - 也可以直接不写 `[sizeN]`
- 静态初始化
    - 必须与数组定义结合在一起
    - 无需说明元素个数，会自动推断并分配大小
    ```cs
    type[] arrayName = {element1, element2, ... , elementN}
    ```
#### 一维数组的访问与越界
- 访问
    - 需要指定数组名 `arrayName` 和访问位置（下标/索引）
    - 访问位置是从 `0` 到 `sizeN - 1`
    - 比如使用 `for`
        ```cs
        int[5] arrayInt= {0,1,2,3,4};
        for(int i = 0; i<5 ; i++)
        {
            Console.Write(arrayInt[i]+' '); // 输出'0 1 2 3 4 '
        }
        ```
    - 使用 `foreach`
        ```cs
        // foreach(类型 迭代变量 in 数组或集合)，可以借助 var 作为类型推断
        foreach(typeOfVariate variateOfIteration in arrayOrCollectionName)
            语句;
        foreach(var variateOfInteration in arrayOrCollectionName)
            语句;
        ```
- 越界
    - 访问数组时超过合法下标
        - 比如 `arrayName[-1]` 或者 `arrayName[sizeN]`
    - 会抛出错误 `System.IndexOutOfRangeException:索引超出数组界限`

#### 二维数组与高维数组
- 定义：
    ```cs
    type[,] arrayName2D;  // 二维数组
    type[,,] arrayName3D; // 三维数组
    // 可以类似推广到更多维
    ```
- 动态初始化
    ```cs
    type[,] arrayName = new type[sizeM,sizeN]{
        {element(0,0), element(0,1), ... element(0,N-1)},
         ... ,
        {element(m-1,0), ... , element(m-1,n-1)}
    }   // element(x,y) 是对应矩阵中下标为 (x,y) 处的 type 类型的值
    ```
    - 不给定初值时:
        ```cs
        type[,] arrayName = new type[sizeM,sizeN];
        ```
    - 给定初值时
        ```cs
        type[,] arrayName = new type[,]{{},{},...,{}};  // 可以不写大小
        type[,] arrayName = new type[sizeM,sizeN]{{},{},...,{}};
        ```
- 静态初始化
    - 参考一维数组，必须直接赋完所有值
- 访问
    - 可以通过嵌套 `for` 语句来访问所有值
    - 使用 `foreach` 可以避免嵌套

### 1.2 交错数组
- 与多维数组不同，交错数组实际是数组的数组
    - 将数组类型放入一个新的数组中
    - 其中每一个子数组的大小都可以不同
- 定义与初始化
    - 定义: **只能指定顶层数组的大小！**
        ```cs
        type[][] arrayName = new type[size][];
        // 实际类似于 (type[])[size]
        ```
    - 初始化：**必须初始化才能使用！**
        ```cs
        array[0] = new type[sizeOfFirstArray]{...};
        ... ,
        array[size-1] = new type[sizeOfLastArray]{...};
        ```
    > [!note]
    > - 实际上在栈中分配了一个名为 `arrayName` 的引用变量
    > - 其指向堆中一个长度为 `size` 的引用变量数组
    >   - 其中每一个元素均是一个引用变量
    >   - 均指向堆中其他的在初始化语句中分配的子数组
    - 有一些简写法
        ```cs
        array[0] = new type[]{...}; // 省略子数组长度

        type[][] arrayName = type[][]{new typeOfFirstArray[]{...},
                                    ... , 
                                    new tyofOfLastArray[]{...}}; // 直接合并与同一语句
        ```


## 2. Array 类
> [!note]
> [参考文档: Array类](https://learn.microsoft.com/zh-cn/dotnet/api/system.array?view=net-9.0)
> - 命名空间: `System`
> - 程序集: `System.Runtime.dll`
> - Source: `Array.cs`

- 作为抽象类不能实例化
- 但是作为抽象基类，可以调用其中的静态方法来进行处理。

### 常用成员：
- 属性
    - `Length`：获取数组中元素的数量（32位整数）。
        - `LongLength`：获取64位整数
    - `Rank`：获取数组的维度数。
- 静态方法
    - `Clear(int index, int length)`：将数组中指定范围内的元素设置为默认值。
    - `IndexOf(object value)`：搜索指定对象并返回其在数组中的索引。
    - `Find()`：查找与指定谓词定义条件所匹配的元素，返回首个索引
    - `Sort()`：对数组元素进行排序。
    - `Reverse()`：反转数组元素的顺序。
    - `Copy(Array sourceArray, Array destinationArray, int length)`：从一个数组复制到另一个数组(回访生强制转换和装箱)
    - `Clone()`：创建数组的浅表副本。
- 动态方法
    - `GetLength(int dimension)`：获取数组在指定维度上的长度.
        - `GetLongLength`
    - `GetValue(int index)`：获取指定索引位置的元素。
    - `SetValue(object value, int index)`：设置指定索引位置的元素。


## 3. ArrayList（数组列表）
> [!note]
> [参考文档: ArrayList 类](https://learn.microsoft.com/zh-cn/dotnet/api/system.collections.arraylist?view=net-9.0)
> 命名空间: `System.Collections`
> 程序集: `System.Runtime.dll`
> Source: `ArrayList.cs`

- `ArrayList` 是用于存储动态数组的类
- 与数组不同，`ArrayList` 可以动态调整大小，并且可以存储不同类型的对象。
- 可以使用整数索引访问
- 可以接受 `null` 为有效值，也可以重复
- 不支持多维数组作为其中元素

> [!attention]
> - 不建议使用 `ArrayList` 类进行新开发。 建议改用泛型 `List<T>` 类。
>   - 类 `ArrayList` 旨在保存对象的异类集合。 但是，它并不总是提供最佳性能。 相反，我们建议执行以下操作：
>       - 对于对象的异类集合，请使用 C# 中的 `List<Object>` 或 Visual Basic 的 `ListOf(Object)` 类型
>       - 对于对象的同质集合，请使用 `List<T>` 类。 
>   - 有关这些类的相对性能的讨论，[List<T>](https://learn.microsoft.com/zh-cn/dotnet/api/system.collections.generic.list-1?view=net-9.0)请参阅参考主题中的性能[注意事项](https://learn.microsoft.com/zh-cn/dotnet/api/system.collections.generic.list-1?view=net-9.0#performance-considerations)
>   - 有关使用[泛型集合类型而不是非泛型集合](https://github.com/dotnet/platform-compat/blob/master/docs/DE0006.md)类型的常规信息，请参阅不应在 GitHub 上使用非泛型集合。
> - 对于 **.NET Framework**: `ArrayList` 数据量很大时，可以通过修改运行环境中 `<gcAllowVeryLargeObjects>` 属性为 `enable`，其将64位系统上最大容量增加到二十一左右。

### 常用成员：
- 属性
    - `Capacity`： 设置可包含元素个数
    - `Count`：获取已有元素的数量
    - `Item`：获取/设置指定索引处元素
- 方法（均是非静态的）
    - `Add(object value)`：向ArrayList的末尾添加一个元素。
    - `Remove(object value)`：从ArrayList中移除指定的元素。
    - `RemoveAt(int index)`：移除指定索引位置的元素。
    - `Insert(int index, object value)`：在指定索引位置插入一个元素。
    - `Contains(object value)`：判断ArrayList是否包含指定的元素。
    - `IndexOf(object value)`：返回指定对象在ArrayList中的索引。
    - `Sort()`：对ArrayList中的元素进行排序。
    - `Clear()`：移除ArrayList中的所有元素。
    - `Clone()`：创建ArrayList的浅表副本。

### 创建和操作ArrayList示例：
```cs
using System;
using System.Collections;

ArrayList list = new ArrayList(); // 创建一个ArrayList实例
list.Add(10); // 添加一个整数
list.Add("Hello"); // 添加一个字符串
list.Add(3.14); // 添加一个浮点数

if (list.Contains("Hello"))
{
    Console.WriteLine("ArrayList contains 'Hello'");
}

list.Sort(); // 对ArrayList进行排序（注意：ArrayList中的元素类型不同，可能会导致排序异常）
list.RemoveAt(0); // 移除索引为0的元素
```

## 比较Array和ArrayList
- 大小：
    - 数组大小固定，一旦创建就不能改变大小
    -  `ArrayList` 的大小是动态的，可以根据需要增加或减少。
        - 设置 `ArrayList.Capacity` 属性执行重分配内存、复制元素
- 访问性：
    - `Array` 可以设置起始下标，可以是多维的
    - `ArrayList` 起始下标固定为 0，始终是一维的
- 类型：
    - 数组只能存储一种类型的元素
    - `ArrayList` 可以存储不同类型的元素（取值时需要拆箱）
- 性能：
    - 由于 `ArrayList` 的动态特性，相对于数组，它在插入和删除元素时可能性能稍差
    - 同时，由于 `ArrayList` 存储的是 `Object` 类型，因此在访问元素时需要进行类型转换，这也会带来额外的开销。
- 线程安全：
    - `ArrayList` 不是线程安全的，如果需要线程安全的集合，应该使用 `System.Collections.ArrayList.Synchronized` 方法返回一个线程安全的包装器，或者直接使用 `System.Collections.Concurrent` 命名空间下的集合类。
- 泛型：
    - 随着 C# 2.0 的引入，`List<T>`（泛型列表）成为了一个更好的替代 `ArrayList` 的选择，因为它在编译时进行类型检查，避免了类型转换的开销，并且提供了更丰富的功能和更好的性能。
    - 如果需要对数组或 `ArrayList` 进行更多的操作，建议结合具体业务场景和性能需求来选择合适的数据结构。对于新的C#代码，推荐使用泛型集合类如 `List<T>` 来替代非泛型的 `ArrayList`。
