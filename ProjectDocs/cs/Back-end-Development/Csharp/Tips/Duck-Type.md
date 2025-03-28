## 转载声明
- 转载自「十月的寒流」老师的博客文章
    - [原文链接](https://blog.coldwind.top/posts/csharp-duck-types/)
- 有一定程度修改

## 鸭子类型是什么
- 如果一个对象具有某个方法或属性，那么它就可以被当作拥有这个方法或属性的类型来使用
    - 而不需要严格地遵循一些规定与要求。

- 在 C# 中，通常我们会认为，如果想要使用一些语法，需要实现一些接口。比如你很可能会觉得：
    1. 如果想要使用 `foreach` 语句，需要实现 `IEnumerable` 接
    2. 如果想要使用 `await` 语句，需要与 `Task` 类或一些底层接口扯上关系
    3. 如果想要使用 `using` 语句释放资源，需要实现 `IDisposable` 接口

## C# 中的鸭子类型

### foreach 语句
C# 标准库为我们提供了大量的集合类型，比如 `List`、`Stack`、`Queue`、`ObservableCollection` 等等。这些集合类型都实现了 `IEnumerable` 接口，所以我们可以使用 `foreach` 语法来遍历它们。

但实际上，`foreach` 语法并不要求类必须实现 `IEnumerable` 接口。只要类中有一个名为 `GetEnumerator` 的方法，返回一个 `IEnumerator` 类型的对象，就可以使用 `foreach` 语法。比如下面这个例子：

```cs
var c = new MyEnumerableClass();
foreach (var item in c)
{
    Console.WriteLine(item);
}

class MyEnumerableClass
{
    private int[] items = new[] { 1, 2, 3 };

    public IEnumerator GetEnumerator()
    {
        return items.GetEnumerator();
    }
}

```

事实上，这个 `GetEnumerator` 方法其实都不需要直接出自这个类型，甚至可以是一个扩展方法。所以，我们可以对一些我们无法修改的类添加扩展方法，从而使它们变得可以被 `foreach` 语法遍历。比如 C# 8.0 引入了 `Range` 与 `Index` 两个类型，表示数组的范围与索引。

我们可以为 `Range` 类型添加一个扩展方法，使得它们可以被 `foreach` 语法遍历：
```cs
// 单独使用 Range 类
var range = 1..5;
Console.WriteLine(range.GetType().Name); // Range

// 拓展方法
static class MyExtensions
{
    public static IEnumerator<int> GetEnumerator(this Range range)
    {
        for (int i = range.Start.Value; i <= range.End.Value; i++)
            yield return i;
    }
}

foreach (var i in 1..3) // 1..3 是一个 Range 类型
{
    Console.WriteLine(i);
}

// 输出：
// 1
// 2
// 3
```

### await 语句
类似地，`await` 语法也不要求类必须继承 `Task` 类或实现一些底层接口。只要类中有一个名为 `GetAwaiter` 的方法，返回一个 `IAwaiter` 类型的对象，就可以使用 `await` 语法。并且与上面 `foreach` 的例子相同，我们也可以把 `GetAwaiter` 方法定义为一个扩展方法，从而“扩展”一些我们无法修改的类。
```cs
static class Extensions
{
    public static TaskAwaiter GetAwaiter(this TimeSpan ts) => Task.Delay(ts).GetAwaiter();
    public static TaskAwaiter GetAwaiter(this double sec) => Task.Delay(TimeSpan.FromSeconds(sec)).GetAwaiter();
}
```

>[!warning|label:不建议使用]
> 不过实际开发中，轻易还是不要使用这样的技巧，因为这会严重污染常用的类型，可以说是有百害而无一利。

### using 语句
如果你认为 using 语句只能用于实现了 `IDisposable` 接口的类，那你终于基本上对了一次😂。的确，对于一个 `class` 类型的对象，如果它没有实现 `IDisposable` 接口，那么即便它拥有 `public void Dispose()` 方法，它仍然是无法使用 `using` 语句的（编译器会提示，这个对象必须可以隐式转换为 `IDisposable` 对象）。

但是！

C# 中还有一个不太常用的 `ref struct` 类型。这种类型的对象在离开作用域时会自动被销毁，所以它们不需要实现 `IDisposable` 接口。即便如此，我们可以为这种类型的对象添加一个 `Dispose` 方法，这样我们就可以使用 `using` 语句来释放资源了。

```cs
ref struct MyDisposableStructType
{
    public void Dispose()
    {
        Console.WriteLine("MyDisposableStructType Disposed.");
    }
}

using var s = new MyDisposableStructType();
```

这样的话，我们就可以对一个没有实现 `IDisposable` 接口的对象使用 `using` 语句了。

### 集合初始化器
C# 中的很多集合类型都支持集合初始化器语法 `{ }` 来初始化集合对象。比如 `List` 类型可以这样初始化：

```cs
var list = new List<int> { 1, 2, 3 };
```

实际上，只要类实现了 `IEnumerable` 接口，并且包含一个名为 `Add` 的方法，那么这个类就可以使用集合初始化器语法。比如下面这个例子：

```cs
// 自定义类
class PlanetCollection<T> : IEnumerable
{
    public T[] Planets { get; init; }

    private int _index = 0;

    public PlanetCollection(int count)
    {
        Planets = new T[count];
    }

    public void Add(T item)
    {
        if (_index >= Planets.Length)
            throw new IndexOutOfRangeException();
        Planets[_index++] = item;
    }

    public IEnumerator GetEnumerator() => Planets.GetEnumerator();
}

// 初始化
var collection = new PlanetCollection<string>(8)
{
    "mercury", "venus", "earth", "mars", "jupiter", "saturn", "uranus", "neptune"
};

// 会被编译为：
PlanetCollection<string> source = new PlanetCollection<string>(8);
source.Add("mercury");
source.Add("venus");
source.Add("earth");
source.Add("mars");
source.Add("jupiter");
source.Add("saturn");
source.Add("uranus");
source.Add("neptune");

```

### 元祖拆分
C# 在引入了元组后，也引入了元组拆分语法。比如我们可以这样写：

```cs
var (a, b) = (1, 2);
(int c, int d) = (3, 4);

// 很多原生的类型也支持元组拆分
var pair = new KeyValuePair<string, int>("key", 42);
var (key, value) = pair;

var dt = DateTime.Now;
var (year, month, day) = dt;
```

此外，如果我们声明一个 `record` 类型，那么底层也会为我们提供元组拆分的功能。

实际上，元组拆分的语法是通过 `Deconstruct` 方法实现的。只要类中有一个名为 `Deconstruct` 的方法，并且用 `out` 的方式进行传参，那么这个类就可以使用元组拆分语法。

```cs
class Point2d
{
    public int X { get; set; }
    public int Y { get; set; }
    public void Deconstruct(out int x, out int y)
    {
        x = X;
        y = Y;
    }
}

var point = new Point2d { X = 1, Y = 2 };
var (x, y) = point;
```

### LINQ 中的 SelectMany() 方法
最后再说一个比较冷门且不常用的，就是 LINQ 中的 `SelectMany` 方法，以及多层 `from` 语句。

```cs
// 现在有一个数组的数组
// 我们可以使用 SelectMany 方法来展开
var people = GetPeople();
// 使用查询表达式
var pets = (from person in people
            from pet in person.Pets
            select pet).ToList();
// 或者链式表达式
var pets = people.SelectMany(p => p.Pets).ToList();

List<Person> GetPeople()
{
    return new List<Person>()
    {
        new Person(), new Person(), new Person(), new Person()
    }
}

class Person
{
    public string Name { get; set; }
    public List<Pet> Pets { get; set; }
}

class Pet
{
    public string Name { get; set; }
}
```

实际上，只要我们为类提供正确的 `SelectMany` 方法，那么我们就可以使用多层 `from` 语句来展开这个结构。比如我们可以为上面集合初始化器中的 `PlanetCollection` 类型提供一个 `SelectMany` 方法，从而展开这个结构：

```cs
static class Extensions
{
    public static IEnumerable<TResult> SelectMany<TSource, TCollection, TResult>(
        this PlanetCollection<TSource> source,
        Func<TSource, IEnumerable<TCollection>> collectionSelector,
        Func<TSource, TCollection, TResult> resultSelector
    )
    {
        foreach (var item in source.Planets)
        {
            foreach (var subItem in collectionSelector(item))
            {
                yield return resultSelector(item, subItem);
            }
        }
    }
}

var query = 
    from planet in collection 
    from letter in planet 
    select letter;

Console.WriteLine(new string(query.ToArray()).ToUpper());
```

## 总结
