# C# 常见命名规则
> [!note|label:参考链接]
> [1][Microsoft 微软 .NET 框架设计准则](https://learn.microsoft.com/zh-cn/dotnet/standard/design-guidelines/)  
> [2][Google Style Guide 中的 C#](https://google.github.io/styleguide/csharp-style.html)


## 1. 常见错误
1. 组合词视为整体 `Keyboard` `Stopwatch`
2. 使用 `-` 连接的词应拆开 `TwoWay`
3. 编程内常用非规范英文应拆开 `ReadOnly`
4. 作为关键字时保留规范 `Readonly`
5. 尽量全称 `Message`
6. 尽量避免全大写 `Id`
7. 常见全大写缩写
    - 三字母以下全大写 `IO`
    - 三字母随意 `IOHelper`
    - 三字母以上首字母大写 `HttpClient`

## 2. 变量命名规范
### 2.1 三种常见变量命名规范
- `camelCase / 驼峰式命名法` 私有字段，局部变量，入参
    - 每一个单词通过大写分割；
    - 首字母小写
        - `_camelCase` 用于私有字段
            - 依赖注入时推荐（方百年省略`this.私有字段`）
            ```cs
            /* 依赖注入的例子 */
            class example
            {
                //int args;
                int _args;

                public example(int args)
                {
                    // int this.args = args;
                    int _args = args;
                }
            }
            ```
            - 一般不使用 `Hungarian` 规则，仅在老类库中使用
                - `s_camelCase` static 静态
                - `m_camelCase` member 成员
                - `g_camelCase` global 全局
                - `t_camelCase` temporary 临时
        - `@bool / @object` 使用关键词作为变量名

- `PascalCase / 帕斯卡命名法` 命名空间，类名，方法名
    - 全部首字母大写
        - `IPascalCase` interface 接口名
        - `TPascalCase` 泛型类型名
        - `PascalCaseAttribute` 特性
            - 借助 C# 语法糖后，对实际类/方法添加特性时省略`Attribute`
        - `PascalCaseProperty` 依赖属性

- `Hungarian / 匈牙利命名法` 适用早期 C 中数据类型统一使用`int`型做转换，现在大多弃用
    - 标识符的名字以一个或者多个小写字母开头作为前缀；
    - 前缀之后的是首字母大写的一个单词或多个单词组合，该单词要指明变量的用途。

### 2.2 特殊情形下命名规范

- **XAML**中的 `x:Key` 名及 `x:Name` 名
    - `camelCase` 或 `PascalCase` 均可
    - `<Button Name="btn" />`
    - `<Style Key="Button.Common.Light">`
        - 编辑 WPF 中原生控件时可能遇到
        - `Button.Common.Light`实际是完整名称而并非 `命名空间.类名.字段`
- XAML中的 `xmlns:命名空间名`：全小写 lowercase ，尽量简单
    - `b:Interaction`
    - `cv:BoolConverter`
- 预编译器指令 `#define:UPPER CASE`
    - `DEBUG`
    - `NET 472`
控件的事件注册:允许下划线
Button Click

## 3. 方法命名
### 3.1 一般方法
- 名称遵守 PascalCase 命名规范
    - 无论是否为公共方法，只要是类成员均首字母大写
        - 与 java / unity 命名习惯不同
    - 选择合适的**动词(+名词)**
        - `Run` / `Start`
        - `SendData` / `GetValue`
    - 使用非公共方法来减少代码逻辑复杂度时可以添加字眼
        - `Internal` 作为开头
        - `lmpl` implementation 作为结尾
- 例外情况:
    - 局部方法考虑小写开头
    - 用于注册事件的方法(Window_Loaded)
### 3.2 异步方法
- 异步方法以 `Async` 结尾
    - 和同名的同步方法进行区分
        - `Wait` 和 `WaitAsync`
    - 便于快速判断调用的方法是否需要等待
- 例外情况:
    - 人尽皆知的方法(`Task.Delay`、`Task.WhenAll`)
        - 均返回 `Task` ，但不用再加`Async`，同时避免冗杂
    - 控制器 (Controller) 中的方法
        - ASP 到 .NET 开发中使用框架机制调用
        - 不会被开发者直接调用、无需避免歧义

## 4. 语法细节
### 4.1 合理选择单词
- 选择最合适且被广泛接受的单词描述某个意思
    - `Order` 应该用于排序(`orderby`)，而不是用于命令
    - `Apply` 用于表达“应用”，而不是“申请”
    - `Command` 常用于名词、而非动词
- 避免使用过于宽泛或与标准库重名的词汇
    - `Core`、`Main`、`Action`、`Math`
- 布尔类型的成员一般以 `Is`、`Has`、`Can` 开头
    - 典型：`IsValid`、`lsActive`、`HasErrors`、`CanExecute`
    - 误例：`lfSuccess`、`ChecklfEmpty`，实际可以作为方法考虑（但大多还是属性）
- 使用偏正式的单词，而不是口语化的单词
    - `Visibility` 替代 `Seen`
    - `Selection`
    - `Option / Chosen` 替代`choose`
### 4.2 语法与时态
- 一般使用第三人称单数(可以考虑使用复数形式)
    - `Equals`、`lsEqual`、`AreEqual`、`DependsOn`
- 尽量不要使用单复数不符合常见形式的(可适当违背词汇或语法)
    - `Persons / PersonList` 而非 `Person -> People`
    - `Infos` 实际 `Info` 不可数
    - `Datas` 实际 `datum -> data` 已经是负数
- 考虑时态习惯
    - `OnPropertyChanged`
    - `Closing` & `Closed`
### 4.3 其他
- 名称写清晰且完整(例外情形需遵守普遍习惯)
    - `CancellationTokenSource`、`OperationCanceledException` 中 `l` 的双写
    - `IsCompletedSuccessfully`
    - `SendAllCachedUserData` 优于 `SendCaches`
- 扩展方法尽量简洁且清晰
    - `this byte[]: ToInt32` 优于 `BytesTolnt`
- 符合经典命名习惯
    - `TryGetValue`、`TryParse`、 `ThrowIfNull`
    - 英式英语/美式英语
        - `Color` vs.`Colour` 
        - `Behavior` vs. `Behaviour`
- 杜绝 C/C++、MATLAB、JAVA 等命名习惯
    - C/C++ `itoa`
    - MATLAB `num2str`
    - Python `get_value`


## 参考规范2 —— C# at Google Style Guide 

### 格式要求 Formatting guidelines

#### 命名规范
1. 规则
    - 类、方法、枚举、公共字段、公共属性、 命名空间：`PascalCase` .
    - 局部变量、参数名称：`camelCase` .
    - `private`、`protected`、`internal` 和 `protected internal` 字段的名称，以及 属性：`_camelCase` 。
    - 命名约定不适用于保留字段 `const`、`static` 、 `readonly` 等。
    - 对于大小写，“单词”是没有内部空格的任何内容，包括缩写。例如`MyRpc`，而不是 `MyRPC`.
    - 接口名称以 `I` 开头，例如 `IInterface`
2. 目录
    - 文件名和目录名称为 `PascalCase` ，例如 `MyFile.cs` .
    - 在可能的情况下，文件名应与 `main` 所在类的名称相同，例如 `MyClass.cs` .
    - 通常，每个文件首选一个核心类。
3. 组织
- 修饰符按以下顺序出现：
    - `public protected internal private `
    - `new`
    - `abstract virtual override sealed`
    - `static readonly extern unsafe volatile async`
- 命名空间声明位于顶部，位于任何命名空间之前。 `using import order` 导入表是按字母顺序排列的，除了 `imports` 总是 `using System` 第一。
- 类成员规范：
    - 按以下顺序对类成员进行分组：
        - 嵌套类、枚举、委托和事件。
        - static、const 和 readonly 字段。
        - 字段和属性。
        - 构造函数和终结器。
        - 方法。
    - 在每个组中，元素应按以下顺序排列：
        - 公共。
        - 内部。
        - 内部受保护。
        - 保护。
        - 私人。
    - 在可能的情况下，将接口实现组合在一起。

#### 空格规则
从 Google Java 风格开发。

- 每行最多 1 条语句。
- 每个语句最多一个赋值。
- 缩进 2 个空格，无制表符。
- 列限制：100。
- 在左大括号之前没有换行。
- 右大括号和 `else` 之间没有换行符。
- 即使是可选的，也使用大括号。
- `if`/`for`/`while` 等后有空格，逗号后有空格。
- 左括号后或右括号前没有空格。
- 一元运算符与其操作数之间没有空格。在 运算符和所有其他运算符的每个操作数。
- 换行根据 Google C++ 样式指南开发，具有次要 为 与 Microsoft 的 C# 格式化工具兼容而进行的修改：
    - 通常，行继续符缩进 4 个空格。
    - 带大括号的换行符（例如，列表初始值设定项、lambda、object 初始值设定项等）不算作延续。
    - 对于函数定义和调用，如果参数不全部适合 一行它们应该被分成多行，每行 与第一个参数对齐的后续行。如果没有足够的 空间，参数可以放在后面的行上，并且 四个空格缩进。下面的代码示例说明了这一点。
```cs
using System;                                       // `using` goes at the top, outside the
                                                    // namespace.

namespace MyNamespace {                             // Namespaces are PascalCase.
                                                    // Indent after namespace.
  public interface IMyInterface {                   // Interfaces start with 'I'
    public int Calculate(float value, float exp);   // Methods are PascalCase
                                                    // ...and space after comma.
  }

  public enum MyEnum {                              // Enumerations are PascalCase.
    Yes,                                            // Enumerators are PascalCase.
    No,
  }

  public class MyClass {                            // Classes are PascalCase.
    public int Foo = 0;                             // Public member variables are
                                                    // PascalCase.
    public bool NoCounting = false;                 // Field initializers are encouraged.
    private class Results {
      public int NumNegativeResults = 0;
      public int NumPositiveResults = 0;
    }
    private Results _results;                       // Private member variables are
                                                    // _camelCase.
    public static int NumTimesCalled = 0;
    private const int _bar = 100;                   // const does not affect naming
                                                    // convention.
    private int[] _someTable = {                    // Container initializers use a 2
      2, 3, 4,                                      // space indent.
    }

    public MyClass() {
      _results = new Results {
        NumNegativeResults = 1,                     // Object initializers use a 2 space
        NumPositiveResults = 1,                     // indent.
      };
    }

    public int CalculateValue(int mulNumber) {      // No line break before opening brace.
      var resultValue = Foo * mulNumber;            // Local variables are camelCase.
      NumTimesCalled++;
      Foo += _bar;

      if (!NoCounting) {                            // No space after unary operator and
                                                    // space after 'if'.
        if (resultValue < 0) {                      // Braces used even when optional and
                                                    // spaces around comparison operator.
          _results.NumNegativeResults++;
        } else if (resultValue > 0) {               // No newline between brace and else.
          _results.NumPositiveResults++;
        }
      }

      return resultValue;
    }

    public void ExpressionBodies() {
      // For simple lambdas, fit on one line if possible, no brackets or braces required.
      Func<int, int> increment = x => x + 1;

      // Closing brace aligns with first character on line that includes the opening brace.
      Func<int, int, long> difference1 = (x, y) => {
        long diff = (long)x - y;
        return diff >= 0 ? diff : -diff;
      };

      // If defining after a continuation line break, indent the whole body.
      Func<int, int, long> difference2 =
          (x, y) => {
            long diff = (long)x - y;
            return diff >= 0 ? diff : -diff;
          };

      // Inline lambda arguments also follow these rules. Prefer a leading newline before
      // groups of arguments if they include lambdas.
      CallWithDelegate(
          (x, y) => {
            long diff = (long)x - y;
            return diff >= 0 ? diff : -diff;
          });
    }

    void DoNothing() {}                             // Empty blocks may be concise.

    // If possible, wrap arguments by aligning newlines with the first argument.
    void AVeryLongFunctionNameThatCausesLineWrappingProblems(int longArgumentName,
                                                             int p1, int p2) {}

    // If aligning argument lines with the first argument doesn't fit, or is difficult to
    // read, wrap all arguments on new lines with a 4 space indent.
    void AnotherLongFunctionNameThatCausesLineWrappingProblems(
        int longArgumentName, int longArgumentName2, int longArgumentName3) {}

    void CallingLongFunctionName() {
      int veryLongArgumentName = 1234;
      int shortArg = 1;
      // If possible, wrap arguments by aligning newlines with the first argument.
      AnotherLongFunctionNameThatCausesLineWrappingProblems(shortArg, shortArg,
                                                            veryLongArgumentName);
      // If aligning argument lines with the first argument doesn't fit, or is difficult to
      // read, wrap all arguments on new lines with a 4 space indent.
      AnotherLongFunctionNameThatCausesLineWrappingProblems(
          veryLongArgumentName, veryLongArgumentName, veryLongArgumentName);
    }
  }
}

```
### C# 编码准则
#### 常数
- 可以创建 `const` 的变量和字段应始终 `const` .
- 如果不可能 `const` ， `readonly` 可以是一个合适的选择。
- 首选命名常量而不是幻数。
### IEnumerable 与 IList 与 IReadOnlyList
- 对于输入，请使用限制性最强的集合类型，例如 `IReadOnlyCollection` / `IReadOnlyList` / `IEnumerable` 作为方法的输入 当 `inputs` 应该是不可变的。
- 对于输出，如果将返回的容器的所有权传递给所有者， 更喜欢 `IList` 而不是 `IEnumerable` 。如果不转让所有权，请首选 最严格的选项。
### 生成器与容器
- 请做出最佳判断，并牢记：
    - 生成器代码通常不如填充容器可读。
    - 如果结果要 延迟处理，例如，当不需要所有结果时。
    - 直接转换为容器的生成器代码的性能不如直接`ToList()`填充容器。
    - 多次调用的生成器代码将明显变慢 而不是多次迭代容器。
### 属性样式
- 对于单行只读属性，尽可能首选表达式 （`=>`）主体属性 。
- 对于其他所有内容，请使用较旧的语法`{ get; set; }`。
### 表达式正文语法
例如：
```cs 
int SomeProperty => _someProperty
```
- 在 lambda 表达式和属性中谨慎使用表达式主体语法。
- 不要对方法定义使用这将在 C# 7 上线时进行审查。 它大量使用这种语法。
- 与方法和其他有作用域的代码块一样，将结束行与包含开始大括号的行的第一个字符对齐。有关示例，请参阅示例代码。
### 结构和类：
- 结构体与类非常不同：

    - 结构体总是按值传递和返回。
    - 将值赋给返回结构体的成员不会修改原始结构
        - 例如，不会设置转换的位置，`transform.position.x = 10`
        - 这里是一个返回`position`值的属性，所以这只是设置了`Vector3`副本的x参数
- 几乎总是使用类。
- 当类型可以像其他值类型一样对待时，请考虑struct
    - 例如，如果类型的实例很小且通常寿命很短
    - 或者通常嵌入到其他对象中。
        - 好的例子包括`Vector3`， `Quaternion`和`Bounds`。
- 请注意，该指导方针可能因团队而异，例如，性能问题可能迫使使用结构体。






