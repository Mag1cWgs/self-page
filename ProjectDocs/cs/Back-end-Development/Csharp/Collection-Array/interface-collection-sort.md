## ArrayList 类的排序方法
- `ArrayList` 类对象不仅可以存放数值和字符串，还可以存放其他类对象和结构变量
- 提供了排序方法如下
    - `ArrayList.Sort()`：借助存储元素对 `IComparable` 接口实现排序
    - `ArrayList.Sort(IComparable)`：使用指定的比较器进行排序
    - `ArrayList.Sort(Int32, Int32, IComparer)`：使用指定比较器对指定范围内元素排序
- 均涉及到了接口 `IComparable` 和 `IComparer`

## IComparable 接口
- 位于 `System` 命名空间中
    - [System.IComparable 接口](https://learn.microsoft.com/zh-cn/dotnet/api/system.icomparable?view=net-9.0)
    - [System.IComparable<T> 接口](https://learn.microsoft.com/zh-cn/dotnet/api/system.icomparable-1?view=net-9.0)
- 定义通用的比较方法
    - 由值类型/类实现，以创建类型特定的比较方法
- 公共成员 `CompareTo` 用于比较当前实例与同一类型的另一个对象
    - 语法: `int CompareTo(Object obj)`
        - `obj`: 与当前实例比较的对象
        - `return`: 一个32位有符号整数(`int`)
            - 小于零表示小于 `obj`
            - 相应的有等于和大于
    - 提供默认排列次序，若需改变只需要在类中实现 `CompareTo` 方法

## IComparer 接口
- 位于 `System.Collection` 命名空间中
    - [IComparer 接口](https://learn.microsoft.com/zh-cn/dotnet/api/system.collections.icomparer?view=net-9.0)
- 定义比较两个对象的方法
- 公共成员 `Compare` 用于比较两个对象并返回一值
    - 语法: `int Compare(Object x, Object y)`
        - `return`: 小于零则 `x` 小于 `y`，其他同理
- 通常声明一个从 `IComparer` 派生的类
    - 其中实现 `Compare` 方法
    - 然后调用排序方法以该类的对象作为参数
        - 会自动调用类中新实现的 `Compare` 方法
