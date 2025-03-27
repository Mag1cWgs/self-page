## 常用的集合类型
- 参考链接 [MSDN](https://learn.microsoft.com/zh-cn/dotnet/standard/collections/commonly-used-collection-types)
- [语雀: C#集合相关](https://www.yuque.com/ysgstudyhard/da6e0c/gfrqwm)

| 集合类 | 描述 |
|--|--|
| `Dictionary<TKey, TValue>` | 表示基于键进行组织的键/值对的集合。 |
| `List<T>` | 表示可按索引访问的对象的列表。提供用于对列表进行搜索、排序和修改的方法。 |
| `Queue<T>` | 表示对象的先进先出(FIFO)集合。 |
| `SortedList<TKey, TValue>` | 表示基于相关的 `IComparer<T>` 实现按键进行排序的键/值对的集合。 |
| `Stack<T>` | 表示对象的后进先出(LIFO)集合。 |
| `HashSet<T>` | 哈希集中的元素类型。 |
| `Hashtable` | 表示根据键的哈希代码进行组织的键/值对的集合。 |


## C# Dictionary 和 List 的区别

### Dictionary 字典集合：
命名空间：`System.Collections.Generic`

> `Dictionary` 是一个键值对的集合，它允许你通过键(Key)快速访问对应的值(Value)。
> 这种数据结构内部通常是通过哈希表实现的，因此在通过键访问值时非常高效。

1. **数据结构**：键值对的集合。每个元素包含一个键（Key）和一个值（Value）。
2. **唯一性**：键必须是唯一的，而值不需要唯一。
3. **类型灵活性**：键和值可以是任何类型，如字符串、整数、自定义类型等。
4. **性能特点**：通过键读取值的时间复杂度接近 $O(1)$。
5. **排序**：键值对之间的顺序可以不定义，即字典不保证元素的顺序。

### List 集合：
命名空间：`System.Collections.Generic`

1. **数据结构**：有序集合，允许按照索引快速访问元素。内部通常通过数组实现，因此在随机访问元素时非常高效。
2. **访问方式**：通过索引（从0开始的整数）访问元素。如果需要频繁地按索引访问元素，List是一个很好的选择。
3. **操作效率**：在 `List` 的末尾插入或删除元素是非常快的操作，但在中间或开头插入或删除元素可能会比较慢，因为可能需要移动大量元素来保持顺序。


## C# Hashtable 和 Dictionary 的区别
在C#中， `Hashtable` 和 `Dictionary` 都是用于存储键值对的集合，但它们之间存在一些关键的区别:
1. **性能和线程安全性**:
    - `Hashtable` 是同步的，这意味着它是线程安全的，可以在多线程环境中使用，但这也意味着它的性能可能不如 `Dictionary`
    - `Dictionary` 不是同步的，因此它在多线程环境中使用时需要额外的同步措施
2. **类型安全性**:
    - `Dictionary` 是泛型的，这意味着你可以指定键和值的类型，从而提供更好的类型检查和代码清晰度,
    - `Hashtable` 不是泛型的，它使用 `object` 类型来存储键和值，这可能会导致类型转换的开销和潜在的错误.
3. **键的类型**:
    - `Dictionary` 允许使用任何类型的键，只要该类型实现了 `IEquatable<TKey>` 接口和 `GetHashCode` 方法。
    - `Hashtable` 的键必须是引用类型或实现了 `IHashCodeProvider` 和 `IComparer` 接口的值类型。


## List<T>、Dictionary<TKey, TValue>、Hashset<T>在查找元素时的性能差异。
- `List<T>`: 需要遍历整个列表，时间复杂度为 $O(n)$。
- `Dictionary<TKey,TValue>`: 基于哈希表实现，查找时间复杂度接近 $O(1)$。
- `HashSet<T>`: 同样基于哈希表实现，查找时间复杂度接近 $O(1)$。


## 讨论不同集合类型在内存使用上的差异
- `List<T>`: 基于动态数组实现，内存使用较为紧凑，但可能存在未使用的容量。
- `Dictionary<TKey,TValue>`: 基于哈希表实现，内存使用可能较高，因为需要存储键、值和哈希表结构。
- `HashSet<T>`: 基于哈希表实现，内存使用可能较高，因为需要存储元素和哈希表结构。


## 描述LINQ在集合操作中的应用，例如 where、select、orderBy 等。
- `Where`: 过滤集合中的元素，返回满足条件的元素集合。
- `Select`: 对集合中的每个元素进行转换，生成新的集合。
- `OrderBy`: 对集合中的元素进行排序，可以指定排序方向(升序或降序)
- `GroupBy`: 对集合中的元素进行分组，通常基于某个性或条件。
- `Join`: 基于某个键将两个集合中的元素进行合并。
- `Aggregate`: 对集合中的元素进行累加或聚合操作。
