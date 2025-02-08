## 记在前面
- 使用《深入浅出WPF》（刘铁猛老师）自学
- 参考视频[刘铁猛-深入浅出WPF-剪辑版-全5课-分19集](https://www.bilibili.com/video/BV1ye4y1w7ak/?share_source=copy_web&vd_source=9ba1a80902ec14f4f1601626d29e43c7)

## 1. Xaml 概览
- 单纯的声明性语言：
    - 仅用于声明元素，不含程序逻辑
    - 剥离 UI 和后端逻辑，方便将表示层和业务逻辑层分离
- 基于 XML 
    - 语法简单
    - 可以直接从 Microsoft Expression Blend 中导入

## 2. 认识最简单的 XAML 代码

### 2.1 认识 WPF 项目架构
```
解决方案
 * - MyWPFApplication
   | 
   * - 依赖项
   | |
   | * - 分析器（代码分析器）
   | * - 框架（基础类库）
   | * - 程序集（外部导入）
   |
   * AssemblyInfo.cs（程序集信息，自动生成/手动修改）
   |
   * - App.xaml（主程序）
   | |
   | * - App.xaml.cs（对应后台代码）
   |
   * - MainWindow.xaml（主窗体）
     |
     * - MainWindow.xaml.cs（主窗体对应逻辑）
```

### 2.2 剖析简单 XAML 代码

#### 2.2.1 生成一个 WPF 窗口
- 点击「解决方案」——「添加」——「WPF窗口」，会自动生成一个新的窗体 `Window1.xaml` 和一个自动生成的 `Window1.xaml.cs`
- 打开生成的 `Window1.xaml`，内容大致如下：
    ```cs
    <Window x:Class="WpfAppStudy.Window1"
            xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
            xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
            xmlns:d="http://schemas.microsoft.com/expression/blend/2008"
            xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006"
            xmlns:local="clr-namespace:WpfAppStudy"
            mc:Ignorable="d"
            Title="Window1" Height="450" Width="800">
        <Grid>
            
        </Grid>
    </Window>
    ```

#### 2.2.2 分析代码结构
- XAML 是由 XML 派生而来的语言
    - 在 XML 中，使用 **标签 tag** 来声明一个元素时，需要标记起始标签，而两个标签中间的部分称为标签的**内容**。
    - 为了区分同类的许多个标签，会在标签内对它的 **特征 Attribute** 赋值，语法如下
        - 非空标签：`<Tag Attribute1 = Value1>元素内容</Tag>`
        - 空标签：`<Tag Attribute2 = Value2/>`
    > [!tip]
    > - 此处的 Attribute 是指的特性，类似 C# 中的特性 Attribute
    > - 需与属性 Property 区分，其同样类似 C# 中的属性 Property

- 因而我们可以简单的将前面的代码抽象为以下结构
    ```cs
    <Window AttributOfWindow = Values>
        <Grid>

        </Grid>
    </Window>
    ```

- XAML 是一种声明式语言
    - 声明一个 tag 本质就是声明一个对象
    - 对象之间的层级关系只会是并列或者包含，具体体现在 tag 之间是平行的还是嵌套关系
    - 显然：标签 `<Grid/>` 被包含在 `<Window>` 内部

- 再认识标签中的特性
    ```cs
        <Window x:Class="WpfAppStudy.Window1"
                xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
                xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
                xmlns:d="http://schemas.microsoft.com/expression/blend/2008"
                xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006"
                xmlns:local="clr-namespace:WpfAppStudy"
                mc:Ignorable="d"
                Title="Window1" Height="450" Width="800">
        <!-- 其他内容 -->
    ```
    - 其中 `Title`、`Height`、`Width` 对应 C# 中对象的属性(Property)
    - 其中 `x:Class="WpfAppStudy.Windows1"` 是 XAMl 解析器将它包含的标签解析成 C# 对象时的类名
        - 对于上述代码：实际上就是生成一个名为 `Window1` 的类，而 `Grid` 是它的一个私有字段
        - 通过 IL 查看编译后的文件实际类似如下：
            ```cs
            using System.Windows;
            using System,Windows,Controls;

            class Window1 : Window
            {
                private Grid grid;

                public Window1()
                {
                    grid = new Grid();
                    this.Content = grid
                }
            }
            ```
    - 而其中 `xmlns:C="Link"` 是声明名称空间:
        - 继承自 XML 的一个功能
        - 在 XML 文档标签上写上 `xmlns` 特性(XML-NameSpace)来定义命名空间(Namespace)
        - 方便来源不同的类重名时的区分
        - 特性语法如下：
            ```xml
            xmlns[:可选的映射前缀]= "命名空间"
            ```
            - 在 `xmlns` 后面可以加一个可选的映射前缀，之间用冒号分割
            - 如果没有写可选映射前缀，则说明所有来自这个命名空间的所有标签都不用加前缀，这个命名空间称为 **默认命名空间**，在当前 XAML 文档内唯一
        - 对于上面的代码，
            ```xml
            xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
            xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
            xmlns:d="http://schemas.microsoft.com/expression/blend/2008"
            xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006"
            xmlns:local="clr-namespace:WpfAppStudy"
            ```
            - 默认命名空间位于第一行
            - 有另外的四个命名空间为 `x`、`d`、`mc`、`local`
                - 其中 `local` 标记的是本地命名空间
        - 如果修改第一行为 `xmlns:Change="···"`，则整个文档会变为
            ```cs
            <Change:Window x:Class="WpfAppStudy.Window1"
                    xmlns:Change="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
                    xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
                    xmlns:d="http://schemas.microsoft.com/expression/blend/2008"
                    xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006"
                    xmlns:local="clr-namespace:WpfAppStudy"
                    mc:Ignorable="d"
                    Title="Window1" Height="450" Width="800">
                <Change:Grid>
                    
                <Change:/Grid>
            </Change:Window>
            ```
            - 其中的 `<Window>` 和 `<Grid>` 都有了 `Change` 的前缀
        - 在 XAML 中引用外来程序集和.NET命名空间的语法与 C# 不同
            - 在 C# 中，需要现将程序集添加引用到项目中，然后再使用 `using` 语句
            - 在 XAML 中，同样需要添加引用，然后在根元素的起始标签（比如上面的`<Window>`）写上 `xmlns:MappingPrefix="MappingPrefixSLink"`，这样就可以使用名为 `MappingPrefix` 的命名空间中的元素，比如 `<MappingPrefix:Element/>`
        - 命名空间对应的链接 `MappingPrefixSLink` 通常可以使用自动提示，其虽然看上去是一个链接，但是实际上是 XAML 解析器的一个硬性编码，看到设定好的字符就会把一系列相关程序集（Assembly）和其中包括的 .NET 命名空间给引用进来
            - 对于上面 `Window1`，对应的几个命名空间：
                ```xml
                <!-- 默认命名空间，导入 System.Windows 相关的基础.NET类库 -->
                xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
                <!-- 导入一些用于XAML语法和编译的CLR命名空间 -->
                xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
                <!-- 用于 Microsoft Expression Blend 导入相关 -->
                xmlns:d="http://schemas.microsoft.com/expression/blend/2008"
                <!-- 标记兼容性文档 -->
                xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006"
                ```
