## 链表


## List<T> 类
> [!note]
> - [ List<T> 类](https://learn.microsoft.com/zh-cn/dotnet/api/system.collections.generic.list-1?view=net-9.0)
> - [了解如何在 C# 中使用 List<T> 管理数据集合](https://learn.microsoft.com/zh-cn/dotnet/csharp/tour-of-csharp/tutorials/arrays-and-collections)

- 命名空间: System.Collections.Generic
- 程序集: System.Collections.dll
- Source: List.cs
- 签名
    ```cs
    public class List<T> :  System.Collections.Generic.ICollection<T>, 
                            System.Collections.Generic.IEnumerable<T>,
                            System.Collections.Generic.IList<T>,
                            System.Collections.Generic.IReadOnlyCollection<T>,
                            System.Collections.Generic.IReadOnlyList<T>,
                            System.Collections.IList
    ```

### 定义 List<T> 型的对象
定义 List<T> 类的对象的语法格式如下：
```cs
List<T> arrayName = new List<T>();
List<string> stringArray = new List<string>();
```

### List<T> 类的常用对象

#### 常用属性
- `Capacity`：设置其不改变大小时能保存的元素总数
- `Count`：获取 List 内实际能包含的元素数
- `Item`：获取或者设置指定索引处的元素

#### 常用方法
- 增加/复制
    - `Add`：将对象添加到 List 的末尾
    - `AddRange`： 将指定的 Collection 对象添加到 List 的末尾
    - `CopyTo`：将 List 或其一部分复制到新的一个数组中
- 删除
    - `Clear`：从 List 中移除所有元素
    - `Remove`：从 List 中移除特定对象的第一个匹配项
    - `RemoveAll`：移除与与指定谓词所定义条件相匹配的所有元素
    - `RemoveAt`：移除指定索引处元素
    - `RemoveRange`：移除一定范围元素
- 修改
    - `ForEach`：对 List 的每一个项都执行指定操作
    - `Insert`：将元素插入到 List 的指定索引处
    - `InsertRange`：将 Collection 中某个元素插入到 List 的指定索引处
    - `Reverse`：对 List 或其一部分元素顺序反转
    - `Sort`：对 List 或它的一部分中的元素进行排序
- 查找
    - `BinarySearch`：使用二分检索算法在已排序的 List 或它的一部分中查找特定元素
    - `Contains`： 确定某元素是否在 List 中
    - `Exists`：确定 List 是否包含与指定谓词所定义条件相匹配的元素
    - `Find`：搜索指定谓词所定义条件相匹配的元素，返回第一个匹配元素
    - `FindAll`：检索与指定谓词所定义条件相匹配的所有元素
    - `FindIndex`：搜索与指定谓词所定义条件相匹配的元素，返回 List 或其中一部分的第一个匹配项的从零开始的索引
    - `FindLast`：搜索指定谓词所定义条件相匹配的元素，并返回整个 List 中最后一个匹配的元素
    - `FindLastIndex`：搜索与指定谓词所定义条件相匹配的元素，返回 List 或其中一部分的最后一个匹配项的从零开始的索引
    - `IndexOf`：返回 List 或它的一部分中的某个值的第一个匹配项的从零开始的索引
    - `LastIndexOf`：返回 List 或它的一部分的某个值的最后一个匹配项的从零开始的索引

