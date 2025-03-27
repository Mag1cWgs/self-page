## 转载声明
- 原视频：[C#中问号（?）运算符的历代新增用法](https://www.bilibili.com/video/BV15X4y187br)
- 原笔记：[C#中问号（?）运算符的历代新增用法](https://www.cnblogs.com/xavierxiu/p/17995341)

## C# 1.0 三目运算符
```cs
string res = x >5 ? "goood" : "no"
// 等同于
string res = null;
if(x>5)
    res = "goood";
else
    res = "no";
```

## C# 2.0 可为空的值类型(Nullable Value Types)
```cs
int? x = null;
```
- 上述代码本质上是 `Nullable<int> x = null`
- `int? y = default` 即该 `int?` 类型的默认值不再是 `int` 类型的默认值0，而是 `null`
- `int?` 还是值类型，不是引用类型

## C# 6.0 Null Propagator(空引用传递)
- 短路机制
1. 对于属性的访问，遇到第一个 `null` 就直接返回 `null`:
    ```cs
    string childName = p?.Child?.Name;
    ```

2. 对于方法的调用，遇到第一个null就停止:
    ```cs
    p?.Child?.SayHello();
    ```

3. ?[]:
    ```cs
    var firstLetter = p?.Name?[0]; //实际上firstLetter就是一个char?
    PropertyChanged?.Invoke(); //在调用事件的时候，可以不用关注事件是否是null
    ```
## C# 8.0 Null-Coalescing ?? (空合并)
```cs
message = message ?? GetMessage(); //如果??左边为null则返回右边的值
```
可以升级简化为：`message ??= GetMessage();`

## C# 8.0 Nullable Reference Type 可为空的引用类型
```cs
string? //C#中string是引用类型
```

## C# 8.0 Null-Forgiving Operator(空包容)
```cs
var box = this.FindName("box") as TextBox;
box!.Text = "Hello";
```


