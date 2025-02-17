## 文档注释

## 1. XML 文档注释

###  1.0 参考文档
- Microsoft Documentation
    - [XML 文档注释](https://learn.microsoft.com/zh-cn/dotnet/csharp/language-reference/xmldoc/#xml-comment-formats)
    - [为文档生成插入 XML 注释](https://learn.microsoft.com/zh-cn/visualstudio/ide/reference/generate-xml-documentation-comments?view=vs-2022)

### 1.1 概述
- C# 源文件可以具有结构化注释，这些注释生成这些文件中定义的类型的 API 文档。
- C# 编译器会生成一个 XML 文件，其中包含表示注释和 API 签名的结构化数据。
    - 例如，其他工具可以处理该 XML 输出，以网页或 PDF 文件的形式创建人类可读的文档。
- 此过程为你在代码中添加 API 文档提供了许多好处：
    - C# 编译器将 C# 代码的结构与注释文本结合到单个 XML 文档中。
    - C# 编译器会验证注释是否与相关标记的 API 签名相匹配。
    - 处理 XML 文档文件的工具可定义特定于这些工具的 XML 元素和属性。
- Visual Studio 等工具为文档注释中使用的很多常用 XML 元素提供 IntelliSense（智能推断）

### 1.2 创建 XML 文档输出
- 通过编写由三斜杠指示的特殊注释字段，可以为代码创建文档。
    - 注释字段包含用于描述注释后面的代码块的 XML 元素。 
- 例如：
    ```cs
    /// <summary>
    ///  This class performs an important function.
    /// </summary>
    public class MyClass {}
    ```
> [!tip]
> - 设置 [GenerateDocumentationFile](https://learn.microsoft.com/zh-cn/dotnet/core/project-sdk/msbuild-props#generatedocumentationfile) 或 [DocumentationFile](https://learn.microsoft.com/zh-cn/dotnet/csharp/language-reference/compiler-options/output#documentationfile) 选项后，编译器将在源代码中找到包含 XML 标记的所有注释字段，并根据这些注释创建 XML 文档文件。
> - 启用此选项后，编译器将为项目中声明的所有公开可见成员生成 [CS1591](https://learn.microsoft.com/zh-cn/dotnet/csharp/language-reference/compiler-messages/cs1591) 警告，且没有 XML 文档注释。
>     - 也就是启用后必须对所有公开可见成员做 XML 注释

### 1.3 XML 注释格式
- XML 文档注释需要使用分隔符，这些分隔符指示文档注释开始和结束的位置。
- 可以将以下分隔符用于 XML 文档标记：
    - `///` 单行分隔符
    - `/** */` 多行分隔符

#### 1.3.1 单行分隔符
- `///` 单行分隔符：
    - 文档示例和 C# 项目模板使用此形式。
    - 如果分隔符后面有空格，则它不会包含在 XML 输出中。

> [!tip]
> - Visual Studio 会自动插入 `<summary>` 和 `</summary>` 标记，你在代码编辑器中键入 `///` 分隔符后，光标将置于这些标记中。
> - 可以在“选项”对话框中打开/关闭此功能。

#### 1.3.2 多行分隔符
- 在包含 `/**` 分隔符的行上，如果行的其余部分为空格，则不将此行作为注释处理。
    - 如果 `/**` 分隔符后面的第一个字符为空格，则忽略此空格字符，并处理行的其余部分。
    - 否则，将 `/**` 分隔符后面的行的所有文本作为注释的一部分进行处理。

- 在包含 `*/` 分隔符的行中，如果 `*/` 分隔符前面只有空格，此行将被忽略。
    - 否则，将 `*/` 分隔符之前的行的文本作为注释的一部分进行处理。

- 对于以 `/**` 分隔符开头的行后面的行，编译器在各行的开头寻找共同模式。
    - 此模式可以包含空格和星号 (`*`)，后面跟更多空格。
    - 如果编译器在不以 `/**` 分隔符开头或不以 `*/` 分隔符结尾的各行开头找到共同模式，则忽略此每个行的模式。

- 若要引用 XML 元素
    - 例如，你的函数将处理你要在 XML 文档注释中描述的特定 XML 元素
    - 你可使用标准引用机制（`<` 和 `>`）。
        - 若要引用代码引用 (`cref`) 元素中的通用标识符，可使用转义字符（例如，`cref="List<T>"`）或大括号 (`cref="List{T}"`)。
        - 作为特例，编译器会将大括号解析为尖括号以在引用通用标识符时使作者能够更轻松地进行文档注释。

> [!attention|label:备注]
> - XML 文档注释不是元数据
> - 它们不包括在编译的程序集中，因此无法通过反射对其进行访问。

### 1.4 接受 XML 文档输入的工具
- DocFX：
    - DocFX 是适用于 .NET 的 API 文档生成器，当前支持 C#、Visual Basic 和 F#。
    - 它还支持自定义生成的引用文档。
    - DocFX 通过源代码和 Markdown 文件生成静态 HTML 网站。
    - 此外，借助 DocFX 还可以灵活地通过模板自定义网站布局和样式。
        - 也可以创建自定义模板。

- Sandcastle：
    - Sandcastle 工具为包含概念性和 API 参考页面的托管类库创建帮助文件。
    - Sandcastle 工具是基于命令行的工具，它没有 GUI 前端、项目管理功能或自动构建过程。
    - Sandcastle 帮助文件生成器提供独立的 GUI 和基于命令行的工具，以自动方式生成帮助文件。
    - 它还可以使用 Visual Studio 集成包，以完全从 Visual Studio 内创建和管理帮助项目。

- Doxygen：
    - Doxygen 通过一系列已记录的源文件生成在线文档浏览器（使用 HTML）或离线参考手册（使用 LaTeX）。
    - 此外，还支持生成 RTF (MS Word)、PostScript、hyperlinked PDF、compressed HTML、DocBook 和 Unix 手册页形式的输出。
    - 可以将 Doxygen 配置为从未记录的源文件中提取代码结构。

## 2. C# 文档注释
### 2.1 参考文档
- Microsoft Documentation
    - [C# 文档注释](https://learn.microsoft.com/zh-cn/dotnet/csharp/language-reference/language-specification/documentation-comments#d3-recommended-tags)

### 2.2 常用标记
| 标记 | 用途 |
|----|------|
| `<c>` | 在类似代码的字体中设置文本 |
| `<code>` | 设置一行或多行源代码或程序输出 |
| `<example>` | 指示示例 |
| `<exception>` | 标识方法可以引发的异常 |
| `<include>` | 包括外部文件中的 XML |
|` <list>` | 创建列表或表 |
| `<para>` | 允许将结构添加到文本 |
| `<param>` | 描述方法或构造函数的参数 |
| `<paramref>` | 确定单词是参数名称 |
| `<permission>` | 记录成员的安全辅助功能 |
| `<remarks>` | 描述有关类型的其他信息 |
| `<returns>` | 描述方法的返回值 |
| `<see>` | 指定链接 |
| `<seealso>` | 生成“另请参阅”条目 |
| `<summary>` | 描述类型或类型的成员 |
| `<typeparam>` | 描述泛型类型或方法的类型参数 |
| `<typeparamref>` | 确定单词是类型参数名称 |
| `<value>` | 描述属性 |
