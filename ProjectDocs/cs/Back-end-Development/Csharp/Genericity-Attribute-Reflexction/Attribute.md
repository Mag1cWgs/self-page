## 特性Attribute
- 本文来自[博客园: 掌握C#：深入理解特性（Attributes）与反射（Reflection）的妙用](https://www.cnblogs.com/hxjcore/p/17891244.html)
    - 摘录时进行整理重排和注解

- 特性Attribute
- 预定义特性
    - AttributeUsage
    - Conditional
    - Obsolete
- 常用Attribute
- 自定义特性
    - 声明自定义特性
    - 构建自定义特性
    - 应用自定义特性
- 反射Reflection
    - 反射优缺点
    - 反射（Reflection）的用途
    - 查看元数据
    - 实例

### 0.1 特性Attribute
- C# 中的特性（Attributes）是一种用于在声明中添加元数据的机制。
- 它们允许程序员向类型、成员（如类、方法、属性等）添加信息，程序可以在运行时通过反射获取到这些信息。
- 特性以 `[ ]` 括起来，放置在相应的声明之前。
- .Net 框架提供了两种类型的特性：
    - 预定义特性
    - 自定义特性。

### 0.2 预定义特性
- 预定义特性分为三种：
    - AttributeUsage (可用性定义)
    - Conditional (条件编译调用)
    - Obsolete (过时方法)

#### 1. AttributeUsage
- 预定义特性 `AttributeUsage` 描述了如何使用一个自定义特性类。
    - 它规定了特性可应用到的项目的类型。
    - 描述了一个定制特性如何被使用

- 规定该特性的语法如下：
    ```cs
    [AttributeUsage(
    validon,
    AllowMultiple=allowmultiple,
    Inherited=inherited
    )]
    ```
- 参数列表：
    - 参数 `validon` ：
        - 规定特性可被放置的语言元素。
        - 它是枚举器 `AttributeTargets` 的值的组合。
        - 默认值是 `AttributeTargets.All`。
        - 通过这个属性，我们能够定义定制特性应该在何种程序实体前放置。
        - 一个属性可以被放置的所有程序实体在[AttributeTargets enumerator](https://learn.microsoft.com/zh-cn/dotnet/api/system.attributetargets?view=net-6.0)中列出。
        - 通过 OR 操作（或操作）我们可以把若干个 `AttributeTargets` 值组合起来。
        > [!note|label:具体表格如下]
        | `AttributeTargets` 值  | 对应十进制值 / 二进制值| 描述                    |
        |----------------|----------------------|------------------------------|
        | Assembly       | 1 / 0000 0001         | 属性可应用于程序集。          |
        | Module         | 2 / 0000 0010         | 属性可应用于模块。<br>模块指的是可移植的可执行文件（dll或.exe），而非Visual Basic标准模块。 |
        | Class          | 4 / 0000 0100         | 属性可应用于类。                     |
        | Struct         | 8 / 0000 1000         | 属性可应用于结构；即值类型。           |
        | Enum           | 16 / 0001 0000        | 属性可应用于枚举。                    |
        | Constructor    | 32 / 0010 0000        | 属性可应用于构造函数。                |
        | Method         | 64 / 0100 0000        | 属性可应用于方法。                    |
        | Property       | 128 / 1000 0000       | 属性可应用于属性。                    |
        | Field          | 256 / 0001 0000 0000      | 属性可应用于字段。                |
        | Event          | 512 / 0010 0000 0000     | 属性可应用于事件。                 |
        | Interface      | 1024 / 0100 0000 0000   | 属性可应用于接口。                  |
        | Parameter      | 2048 / 1000 0000 0000  | 属性可应用于参数。                   |
        | Delegate       | 4096 / 0001 0000 0000 0000 | 属性可应用于委托。<br>目前(.NET 9)，此属性仅可在C#、Microsoft中间语言（MSIL）和发出的代码中应用。 |
        | ReturnValue    | 8192 / 0010 0000 0000 0000| 属性可应用于返回值。                 |
        | GenericParameter| 16384 / 0100 0000 0000 0000| 属性可应用于泛型参数。         |
        | All           | 32767 / 0111 1111 1111 1111| 属性可应用于任何应用程序元素。  |
    
    - 参数 `allowmultiple`（可选的）：
        - 为该特性的 `AllowMultiple` 属性（property）提供一个布尔值。
        - 如果为 `true`，则该特性是多用的；默认值是 `false`（单用的）。
        - 这个属性标记了我们的定制特性能否被重复放置在同一个程序实体前多次。
    - 参数 `inherited`（可选的）：
        - 为该特性的 Inherited 属性（property）提供一个布尔值。
        - 如果为 true，则该特性可被派生类继承；默认值是 false（不被继承）。
        - 我们可以使用这个属性来控制定制特性的继承规则。
        - 它标记了我们的特性能否被继承。

    ```cs
    using System;   
    [AttributeUsage(AttributeTargets.Class 
                | AttributeTargets.Constructor 
                | AttributeTargets.Field 
                | AttributeTargets.Method 
                | AttributeTargets.Property, 
            AllowMultiple = true,
            Inherited = false)]
    public class HelpAttribute : Attribute
    {   // 为了符合“公共语言规范（CLS）”的要求，
        // 所有的自定义的Attribute都必须继承System.Attribute。
        public HelpAttribute(String Description_in)
        {   
            this.description = Description_in;   
        }   
        protected String description;   
        public String Description {   
            get {   
                return this.description;   
            }   
        } 
    }
    ```
#### 2. Conditional（常用）
- 这个预定义特性标记了一个条件方法，其执行依赖于指定的预处理标识符。
    - 它会引起方法调用的条件编译，取决于指定的值，
        - 比如 `Debug` 或 `Trace`。
    - 例如，当调试代码时显示变量的值。通常这个特性要结合预处理指令使用。
- 规定该特性的语法如下：
    ```cs
    #define DEBUG
    using System;
    using System.Diagnostics;
    public class Myclass
    {
        [Conditional("DEBUG")]
        public static void Message(string msg)
        {
            Console.WriteLine(msg);
        }
    }
    class Test
    {
        static void function1()
        {
            Myclass.Message("In Function 1.");
            function2();
        }
        static void function2()
        {
            Myclass.Message("In Function 2.");
        }
        public static void Main()
        {
            Myclass.Message("In Main function.");
            function1();
            Console.ReadKey();
        }
    }
    ```
    - 执行结果：
    ```
        In Main function
        In Function 1
        In Function 2
    ```

#### 3. Obsolete
- 这个预定义特性标记了不应被使用的程序实体。
- 它可以让您通知编译器丢弃某个特定的目标元素。
    - 例如，当一个新方法被用在一个类中，但是您仍然想要保持类中的旧方法，
    - 可以通过显示一个应该使用新方法，而不是旧方法的消息，来把它标记为 `obsolete`（过时的）。
- 语法如下
    ```cs
    [Obsolete(
        message
    )]
    [Obsolete(
        message,
        iserror
    )]
    ```
- 参数如下:
    - 参数 `message`：是一个字符串，描述项目为什么过时以及该替代使用什么。
    - 参数 `iserror`：是一个布尔值。
        - 如果该值为 true，编译器应把该项目的使用当作一个错误。
        - 默认值是 false（编译器生成一个警告）。
    - 例:
        ```cs
        using System;
        public class MyClass
        {
            [Obsolete("Don't use OldMethod, use NewMethod instead", true)]
            static void OldMethod()
            {
                Console.WriteLine("It is the old method");
            }
            static void NewMethod()
            {
                Console.WriteLine("It is the new method");
            }
            public static void Main()
            {
                OldMethod();
            }
        }
        ```
        - 当您尝试编译该程序时，编译器会给出一个错误消息说明：
        ```
        Don't use OldMethod, use NewMethod instead
        ```
### 0.3 常用Attribute
- 在 C# 中有许多常用的 Attribute，每个都有不同的目的和用途。
- 以下是一些常见的 C# Attribute：
    - `[AttributeUsage]`: 
        - 用于指定自定义特性的使用方式，如允许的目标类型和是否允许多次应用等。
    - `[Conditional]`: 
        - 与预处理指令 `#if` 和 `#endif` 结合使用，根据定义的条件编译代码。
    - `[Obsolete]`: 
        - 标记已过时的代码，使得在使用过时成员时发出警告或错误信息。
    - `[Conditional]`: 
        - 根据条件编译代码，类似于预处理指令，但是使用 Attribute。
    - `[Description]`: 
        - 为属性或者事件提供一个描述，通常在设计时使用。
    - `[DefaultValue]`: 
        - 为属性或字段设置默认值。
    - `[DllImport]`: 
        - 用于指示要在程序中调用非托管代码（通常是 DLL）的方法。
    - `[DataContract]` 和 `[DataMember]`: 
        - 用于在 WCF（Windows Communication Foundation）中指定数据传输协定的序列化和反序列化。
    - `[Serializable]`和`[Deserializable]`: 
        - 用于标记类，表示该类可以序列化，即可以在网络上传输或者在文件中存储。
    - `[ThreadStatic]`: 
        - 将静态字段标记为线程特定的。
        - 每个线程都有自己的字段副本，而不是共享同一个字段。
- 这些 Attribute 提供了一种在编写代码时添加元数据和行为的方式，允许开发人员使用更多的元信息和标记来增强代码的可读性和可维护性，以及改变程序的行为方式。

### 0.4 自定义特性
- .Net 框架允许创建自定义特性，用于存储声明性的信息，且可在运行时被检索。
- 该信息根据设计标准和应用程序需要，可与任何目标元素相关。
- 自定义特性一般与反射同时使用
    - 例如：我想把几个数据模型与数据库做匹配，
    - 那么我就可以写一个数据模型特性，再写一个数据处理类，
    - 在模型的属性上标注特性（列名、列类型、是否主键、是否可为空等）
    - 然后在数据处理类中对数据进行反射，根据数据特性来对数据进行验证或持久化等操作。

- 创建并使用自定义特性包含四个步骤：
    1. 声明自定义特性
    2. 构建自定义特性
    3. 在目标程序元素上应用自定义特性
    4. 通过反射访问特性
    > [!tip]
    - 最后一个步骤包含编写一个简单的程序来读取元数据以便查找各种符号。
    - 元数据是用于描述其他数据的数据和信息。
    - 该程序应使用反射来在运行时访问特性。

#### 1 声明自定义特性
- 一个新的自定义特性应派生自 `System.Attribute` 类。例如：
    ```cs
    // 一个自定义特性 BugFix 被赋给类及其成员
    [AttributeUsage(AttributeTargets.Class |
                AttributeTargets.Constructor |
                AttributeTargets.Field |
                AttributeTargets.Method |
                AttributeTargets.Property,
            AllowMultiple = true)]
    public class DeBugInfo : System.Attribute
    ```
- 在上面的代码中，我们已经声明了一个名为 `DeBugInfo` 的自定义特性。

#### 2 构建自定义特性
- 让我们构建一个名为 `DeBugInfo` 的自定义特性，该特性将存储调试程序获得的信息。
    - 它存储下面的信息：
        - bug 的代码编号
        - 辨认该 bug 的开发人员名字
        - 最后一次审查该代码的日期
        - 一个存储了开发人员标记的字符串消息
    - 实际对应了
        - 带有三个用于存储前三个信息的私有属性（property）
            - 所以 bug 编号、开发人员名字和审查日期将是 DeBugInfo 类的必需的定位（ positional）参数
        - 一个用于存储消息的公有属性（property）。
            - 消息将是一个可选的命名（named）参数。

- 每个特性必须至少有一个构造函数。
    - 必需的定位（ positional）参数应通过构造函数传递。
- 下面的代码演示了 DeBugInfo 类：
    ```cs
    // 一个自定义特性 BugFix 被赋给类及其成员
    // 允许对类、构造函数、字段、方法、属性使用
    // 允许多用
    [AttributeUsage(AttributeTargets.Class |
                AttributeTargets.Constructor |
                AttributeTargets.Field |
                AttributeTargets.Method |
                AttributeTargets.Property,
            AllowMultiple = true)]

    public class DeBugInfo : System.Attribute
    {
        private int bugNo;
        private string developer;
        private string lastReview;
        public string message;

        public DeBugInfo(int bg, string dev, string d)
        {
            this.bugNo = bg;
            this.developer = dev;
            this.lastReview = d;
        }

        public int BugNo
        {
            get { return bugNo; }
        }
        public string Developer
        {
            get { return developer; }
        }
        public string LastReview
        {
            get { return lastReview; }
        }
        public string Message
        {
            get { return message; }
            set { message = value; }
        }
    }
    ```

#### 3 应用自定义特性
- 通过把特性放置在紧接着它的目标之前，来应用该特性：
    ```cs
    [DeBugInfo(45, "Zara Ali", "12/8/2012", Message = "Return type mismatch")]
    [DeBugInfo(49, "Nuha Ali", "10/10/2012", Message = "Unused variable")]
    class Rectangle
    {
        // 成员变量
        protected double length;
        protected double width;
        // 构造函数
        public Rectangle(double l, double w)
        {
            length = l;
            width = w;
        }
        // 方法
        [DeBugInfo(55, "Zara Ali", "19/10/2012",
        Message = "Return type mismatch")]
        public double GetArea()
        {
            return length * width;
        }
        [DeBugInfo(56, "Zara Ali", "19/10/2012")]
        public void Display()
        {
            Console.WriteLine("Length: {0}", length);
            Console.WriteLine("Width: {0}", width);
            Console.WriteLine("Area: {0}", GetArea());
        }
    }
    ```

- 特性为代码添加元数据信息
    - 允许开发者在代码中添加注释和指导
    - 从而提高代码的灵活性、可读性和可维护性。

### 0.5 特性的要点总结：
- 用途和目的: 
    - 特性提供了一种在代码中添加元数据的方式
    - 用于描述类型、成员或者程序集的行为、特征或者提供额外的信息。
    - 它们有助于提高代码的可读性、可维护性以及提供编译时和运行时的指导。
- 语法: 
    - 特性被应用于声明之前
    - 使用方括号 `[]` 它们可以接受参数以提供更多的信息。
- 自定义特性: 
    - 可以创建自定义特性，通过继承 System.Attribute 类来定义新的特性。
    - 这样可以根据需求自定义特性的行为和属性。
- 内置特性:
    - C# 提供了许多内置的特性，如 [Obsolete]、[Serializable]、[DllImport] 等
    - 它们有不同的作用，例如标记过时的代码、指示类可以被序列化、调用非托管代码等。
- 目标和用法: 
    - 特性可以应用于类、方法、属性等不同的程序元素，并且可以限制它们的使用范围和次数
    - 这可以通过 [AttributeUsage] 特性进行控制。
- 运行时访问: 
    - 可以使用反射来在运行时检索特性信息
    - 这使得程序能够根据特性的存在与否、参数值来改变行为或执行特定的逻辑。
- 元数据和扩展性:
    - 特性允许开发者在代码中添加元数据信息
    - 这种元数据可以被工具、框架或者其他代码用来做出决策或执行特定操作。
- 编译时检查: 
    - 特性可以在编译时提供警告或错误，帮助开发者识别潜在的问题或者提供额外的信息。

## 使用反射 Reflection 查看特性
反射指程序可以访问、检测和修改它本身状态或行为的一种能力。

程序集包含模块，而模块包含类型，类型又包含成员。反射则提供了封装程序集、模块和类型的对象。

您可以使用反射动态地创建类型的实例，将类型绑定到现有对象，或从现有对象中获取类型。然后，可以调用类型的方法或访问其字段和属性。

- 反射优缺点
    - 优点：
        - 反射提高了程序的灵活性和扩展性。
        - 降低耦合性，提高自适应能力。
        - 它允许程序创建和控制任何类的对象，无需提前硬编码目标类。
    - 缺点：
        - 性能问题：使用反射基本上是一种解释操作，用于字段和方法接入时要远慢于直接代码。因此反射机制主要应用在对灵活性和拓展性要求很高的系统框架上，普通程序不建议使用。
        - 使用反射会模糊程序内部逻辑；程序员希望在源代码中看到程序的逻辑，反射却绕过了源代码的技术，因而会带来维护的问题，反射代码比相应的直接代码更复杂。

### 反射（Reflection）的用途
- 它允许在运行时查看特性（attribute）信息。
- 它允许审查集合中的各种类型，以及实例化这些类型。
- 它允许延迟绑定的方法和属性（property）。
- 它允许在运行时创建新类型，然后使用这些类型执行一些任务。

### 查看元数据
- 使用反射（Reflection）可以查看特性（attribute）信息。
- System.Reflection 类的 MemberInfo 对象需要被初始化
    - 用于发现与类相关的特性（attribute）。

- 为了做到这点，您可以定义目标类的一个对象，如下：
    `System.Reflection.MemberInfo info = typeof(MyClass);`
- 下面的程序演示了这点：
    ```cs
    using System;

    [AttributeUsage(AttributeTargets.All)]
    public class HelpAttribute : System.Attribute
    {
        public readonly string Url;

        public string Topic  // Topic 是一个命名（named）参数
        {
            get { return topic; }
            set { topic = value; }
        }

        public HelpAttribute(string url)  // url 是一个定位（positional）参数
        {
            this.Url = url;
        }

        private string topic;
    }

    [HelpAttribute("Information on the class MyClass")]
    class MyClass
    {
    }

    namespace AttributeAppl
    {
        class Program
        {
            static void Main(string[] args)
            {
                System.Reflection.MemberInfo info = typeof(MyClass);
                object[] attributes = info.GetCustomAttributes(true);
                for (int i = 0; i < attributes.Length; i++)
                {
                    System.Console.WriteLine(attributes[i]);
                }
                Console.ReadKey();

            }
        }
    }
    ```
- 当上面的代码被编译和执行时，它会显示附加到类 `MyClass` 上的自定义特性 `HelpAttribute`

### 实例
- 在本实例中，我们将使用在上一章中创建的 DeBugInfo 特性，
- 并使用反射（Reflection）来读取 Rectangle 类中的元数据。
    ```cs
    using System;
    using System.Reflection;
    //System.Reflection 类的 MemberInfo用于发现与类相关的特性（attribute）。

    namespace BugFixApplication
    {
        // 一个自定义特性 BugFix 被赋给类及其成员
        [AttributeUsage
            #region 定义了特性能被放在那些前面        
                (AttributeTargets.Class |//规定了特性能被放在class的前面
                AttributeTargets.Constructor |//规定了特性能被放在构造函数的前面
                AttributeTargets.Field |//规定了特性能被放在域的前面
                AttributeTargets.Method |//规定了特性能被放在方法的前面
                AttributeTargets.Property,//规定了特性能被放在属性的前面
            #endregion
            AllowMultiple = true)]//这个属性标记了我们的定制特性能否被重复放置在同一个程序实体前多次。

        public class DeBugInfo : System.Attribute//继承了预定义特性后的自定义特性
        {
            private int bugNo;
            private string developer;
            private string lastReview;
            public string message;

            public DeBugInfo(int bg,string dev,string d)//构造函数，接收三个参数并赋给对应实例
            {
                this.bugNo = bg;
                this.developer = dev;
                this.lastReview = d;
            }
            #region 定义对应的调用，返回对应值value
            public int BugNo
            {
                get { return bugNo; }
            }
            public string Developer
            {
                get { return developer; }
            }
            public string LastReview
            {
                get { return lastReview; }
            }
            //前面有public string message;
            public string Message//定义了可以通过Message = "",来对message进行赋值。
                                //因为不在构造函数中，所以是可选的
            {
                get { return message; }
                set { message = value; }
            }
            /*
            * 这部分可以简写如下
            * public string Message{get;set;}
            */
            #endregion
        }


        [DeBugInfo(45, "Zara Ali", "12/8/2012",
            Message = "Return type mismatch")]
        [DeBugInfo(49, "Nuha Ali", "10/10/2012",
            Message = "Unused variable")]//前面定义时的AllowMultiple=ture允许了多次使用在同一地方
        class Rectangle
        {
            protected double length;
            protected double width;//定义两个受保护的（封装）的成员变量
            public Rectangle(double l,double w)//构造函数，对两个成员变量进行初始化，公开的
            {
                length = l;
                width = w;
            }

            [DeBugInfo(55, "Zara Ali", "19/10/2012",
                Message = "Return type mismatch")]
            public double GetArea()
            {
                return length * width;
            }

            [DeBugInfo(56, "Zara Ali", "19/10/2012")]//因为message是可选项，所以可以不给出
                                                    //不给出即为null，为空白
            public void Display()
            {
                Console.WriteLine("Length: {0}", length);
                Console.WriteLine("Width:{0}", width);
                Console.WriteLine("Area:{0}", GetArea());//常规打印
            }
        }
        class ExecuteRectangle
        {
            static void Main(string[] args)//程序入口
            {
                Rectangle r = new Rectangle(4.5, 7.5);//实例化
                r.Display();//执行打印长、宽、面积

                Type type = typeof(Rectangle);//让type对应这个Rectangle类
                // 遍历 Rectangle 类的特性
                foreach (Object attributes in type.GetCustomAttributes(false))//遍历Rectangle的所有特性
                {
                    DeBugInfo dbi = (DeBugInfo)attributes;//强制转换
                    if(null != dbi)//dbi非空
                    {
                        Console.WriteLine("Bug on: {0}", dbi.BugNo);
                        Console.WriteLine("Developer: {0}", dbi.Developer);
                        Console.WriteLine("Last REviewed: {0}", dbi.LastReview);
                        Console.WriteLine("Remarks: {0}", dbi.Message);
                    }
                }
                // 遍历方法特性
                foreach (MethodInfo m in type.GetMethods())//遍历Rectangle类下的所有方法
                {
                    foreach (Attribute a in m.GetCustomAttributes(true))//遍历每个方法的特性
                    {
                        DeBugInfo dbi = a as DeBugInfo;//通过 object 声明对象，是用了装箱和取消装箱的概念.
                                                    //也就是说 object 可以看成是所有类型的父类。
                                                    //因此 object 声明的对象可以转换成任意类型的值。
                                                    //通过拆装箱代替强制转换
                        if (null != dbi)//同理打印
                        {
                            Console.WriteLine("BugFixApplication no: {0},for Method: {1}", dbi.BugNo, m.Name);
                            Console.WriteLine("Developer:{0}", dbi.Developer);
                            Console.WriteLine("Last Reviewed: {0}", dbi.LastReview);
                            Console.WriteLine("Remarks: {0}", dbi.Message);
                        }
                    }
                }
                Console.ReadKey();
            }
        }
    }
    ```
- 当上面的代码被编译和执行时，它会产生下列结果：
    ```bash
    Length: 4.5
    Width: 7.5
    Area: 33.75
    Bug No: 49
    Developer: Nuha Ali
    Last Reviewed: 10/10/2012
    Remarks: Unused variable
    Bug No: 45
    Developer: Zara Ali
    Last Reviewed: 12/8/2012
    Remarks: Return type mismatch
    Bug No: 55, for Method: GetArea
    Developer: Zara Ali
    Last Reviewed: 19/10/2012
    Remarks: Return type mismatch
    Bug No: 56, for Method: Display
    Developer: Zara Ali
    Last Reviewed: 19/10/2012
    Remarks: 
    ```

### 关于反射的要点总结
- 反射是一种强大的编程技术，允许在运行时检查和操作程序集、类型、成员等元数据信息的能力。
- 在 C# 中，反射机制提供了一组类和方法来动态加载程序集、创建类型的实例、调用方法、访问和修改字段/属性等。

- 动态加载和使用类型: 
    - 反射允许在运行时加载和使用程序集中未知的类型。
    - ‘Assembly ’类用于加载程序集，‘Type ’类则用于获取类型的信息。
- 访问类型信息: 
    - 可以通过反射获取类型的属性、字段、方法和事件等信息。
    - GetProperty(), GetField(), GetMethod() 等方法可以用来访问这些成员信息。
- 创建实例: 
    - 可以使用反射动态创建类的实例。
    - Activator.CreateInstance() 方法允许在不知道类型的情况下创建实例。
- 调用方法和访问成员: 
    - 通过反射，可以调用类的方法、设置和获取字段值、访问属性，并触发事件。
- 自定义特性和元数据的检索: 
    - 可以使用反射来获取和检查自定义特性（Attributes）以及其他元数据信息，
    - 以便在运行时根据这些信息改变程序行为。
- 动态装箱和拆箱: 
    - 反射使得可以在运行时执行装箱和拆箱操作，将值类型转换为引用类型。
- 高级应用:
    - 反射支持实现插件式架构、序列化和反序列化对象、ORM（对象关系映射）框架的实现等。
- 性能考虑: 
    - 反射操作相对于直接编码的方式通常更为耗费性能，因为它需要在运行时进行类型检查和解析。
    - 因此，在性能敏感的代码部分应尽量避免过度使用反射。

- 总的来说，反射为动态、灵活的编程提供了一种强大的机制，使得程序能够在运行时探索、操作和修改自身的结构和行为。


## 参考链接
- [csdn: C#高级语法 Attribute特性详解和类型，方法，变量附加特性讲解](https://blog.csdn.net/qq_44695769/article/details/135384682)
- [Microsoft: 定义和读取自定义特性](https://learn.microsoft.com/zh-cn/dotnet/csharp/advanced-topics/reflection-and-attributes/attribute-tutorial)
- [博客园: C#属性(Attribute)用法实例解析](https://www.cnblogs.com/ldyblogs/p/attribute.html)
