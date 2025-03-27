## 参考链接
- [C# 中 using 关键字的使用技巧](https://www.bilibili.com/video/BV1NR4y1y7NH/)

## Using NameSpace / 命名空间中的 Using
- 需要先引入命名空间才能使用相应的类
- 可以借助 IntelliSense 智能补全

## Using Static (C# 6.0)
- 于 C# 6.0 引入
- 语法:
    - `using static TargetNameSpace.TargetClass;`
    - 举例
        - 比如
            ```cs
            // Main函数内
            Math.Cos(1);
            Math.Round(5);
            // ... 需要频繁使用Math类
            ```
        - 可以用
        ```cs
        using static System.Math;

        Cos(1);
        Round(5);
        // ...
        ```
- 实际运用不多，因为是把类中所有的静态方法暴露出来
    - 如果重名会很麻烦

## Global Using / Implicit Using (C# 10.0)
- 与 C# 10.0 引入

### global using 全局引用
- 使用方法
    1. 在项目中添加一个类 `GlobalUsing.cs`
    2. 在这个类文件内容如下：
        ```cs
        global using System;
        global using System.Collections.Generic;
        global using System.Linq;
        ```
    3. 此时同项目的其他文件就无需再声明 `System` 等三个库

### implicit using 隐式引用
- 使用方法
    1. 查看项目的 `.csproj` 文件
    2. 其中有这么一条配置
        ```xml
        <ImplicitUsings>disable</ImplicitUsings>
        ```
    3. 改动到 `enable`
    4. 去掉其他文件中的 `using 常用命名空间;` 语句
    5. 重新编译发现仍然可以正常生成

- 原理
    - 可以在项目的「./obj/编译方式(Debug)/版本/refint」中找到一个名为「项目名.GlobalUsings.g.cs」的文件
    - 其中有七个自动生成的常用命名空间
        ```cs
        // <自动生成>
        global using global::System;
        global using global::System.Collections.Generic;
        global using global::System.IO;         // 实际生产环境中在使用时引入
        global using global::System.Ling;
        global using global::System.Net.Http;   // 实际生产环境中在使用时引入
        global using global::System.Threading;
        global using global::System.Threading.Tasks;
        ```

- 自己创建隐式引用
    1. 查看项目的 `.csproj` 文件
    2. 添加如下内容于 `<Project>` 标签内部
        ```xml
        <ItemGroup>
            <Using Include="目标命名空间"/>
        </ItemGroup>
        ```
    3. 保存并编译
    4. 会发现 `项目名.GlobalUsings.g.cs` 文件中多出了对刚才引入的 `目标命名空间` 的全局引用

### 两种引入的选用规则
- 根据「SOLID」中的「S 单一职责原则」
    - 不使用隐式引用
    - 使用全局引用
- [参考链接](https://markgossa.com/2022/04/net-6-implicit-using-vs-global-using.html)



## Using Alias
- 引入时可以起别名
    ```cs
    using Sys = System;
    using M = System.Math;
    ```
- 通常应用在 WPF 项目中使用 WinForm 类库
    - 避免同名类带来的冗长命名
    ```cs
    // 在 WPF 项目的 .xaml.cs中
    using System.Windows.Controls; // 默认 WPF 类库

    using System.Windows.Forms; // 手动引入 Forms 类库
    // 但是与 Controls 中有许多重名类，比如 Button 对应
    //  System.Windows.Controls.Button() / System.Windows.Forms.Button()
    // 可能会需要写一长串来注明所用类所在命名空间
    // 比如
    private void Window_Loaded(object sender, RoutedEventArgs e)
    {   
        // WPF 不提供 FolderBrowserDialog, 使用 Winform 的库
        var dialog = new System.Windows.Forms.FolderBrowserDialog();

        // 如果引用时使用
        // using Frm = System.Windows.Forms;
        // 此处就可以修改成
        var dialog = new Frm.FolderBrowserDialog();

        // 甚至可以使用
        // using FrmFB = System.Windows.Forms.FolderBrowserDialog;
        // 然后直接
        var dialog = new FrmFB();
    }
    ```
- 上面提到的 `global using` 也可以静态化和起别名的
    - `global using static 引入类;`
    - `global using 缩写 = 引入类;`

- 在 C# 12.0 中，类型也可以使用别名
    ```cs
    using point = (int x, int y);
    ```


## Using 关键字使用可释放资源 (IDisposable)
- 例：
    - C# 8.0 以前
        ```cs
        using System.Text;

        using(var stream =new FileStream("", FileMode.Open))
        using(var reader =new StreamReader(stream, Encoding.UTF8))
        {
            reader.ReadToEnd();
        }
        ```
    - C# 8.0 以后
        - 可以去除 `using` 所带来的括号和缩进
        ```cs
        using System.Text;

        using var stream =new FileStream("", FileMode.Open);
        using var reader =new StreamReader(stream, Encoding.UTF8);
        
        reader.ReadToEnd();
        ```
        - 如果一次性读取，不考虑一行行或者什么
        ```cs
        using System.Text;
        File.ReadAllText("",Encoding.UTF8)
        ```

- Using 关键字到底对应了什么
    - C# 8.0 以前：
        - 如下代码
            ```cs
            using(var stream=new MemoryStream()){ }
            ```
        - 会在IL中变成如下形式
            ```cs
            Memory stream=new MemoryStream();
            try
            {
            }
            finally
            {
                if (reader != null)
                {
                    ((IDisposale).reader).Disposable();
                }
            }
            ```
    - C# 8.0 开始：
        - CS
            ```cs
            using var stream =new MemoryStream();
            using var reader =new StreamReader(stream);
            reader.ReadToEnd();
            ```
        - IL
            ```cs
            // 对应第一行
            MemoryStream stream = new MemoryStream ();
            // 对应第二行，包含整个 try-catch
            // using var reader =new StreamReader(stream);
            try
            {
                    // 对应第三行，包含整个 try-catch
                    // reader.ReadToEnd();
                    StreamReader reader = new StreamReader (stream);
                    try
                    {
                        reader.ReadToEnd ();
                    }
                    finally
                    {
                        if (reader != null)
                        {
                            ((IDisposable)reader).Dispose ();
                        }
                    }
            }
            finally
            {
                    if (stream != null)
                    {
                        ((IDisposable)stream).Dispose ();
                    }
            }
            ```

- 不是所有实现 `IDisposable` 接口的类都需要使用 `using`
    - 比如有特例
        ```cs
        using var client = new HttpClient();
        await client.GetStreamAsync("");
        ```
    - 实际在 `HttpClient` 类的微软文档，推荐重复使用这个 `client`，但是彻底单例化也会出现问题
    - 但是如果是数据库接口什么的推荐使用 `using`，保证及时释放
