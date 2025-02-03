# 5.12 委托
> 委托是事件的抽象  
> 通过委托实现事件

> [!note|label:理解]
> 建立委托本质是建立新的委托类
> 委托类的实例实际上提供了一组待输入参数的方法集合构成的调用列表。
> 每次调用委托变量输入参数时，即按照委托变量输入的参数依次执行调用列表中的方法。



---



## 5.12.1 什么是委托

### 1. 定义
**委托（delegate）**是一个定义方法**签名**的类型，用于定义方法的返回值类型和参数列表类型。

> [!note]
> 方法签名： 方法名、参数列表类型，返回值类型。
> 前两者决定返回值类型的唯一确定，所以返回值类型可以不计入委托定义。

定义委托类型后，再声明该委托类型的一个变量，就可以利用该变量引用与委托签名相同的所有方法。
也就是说，可以通过该引用变量调用与委托签名相同的所有方法。

### 2. 委托的实质：将方法作为变量或参数。
一个委托类型的变量，可以引用任何一个满足其要求的方法。
从这点意义上看，委托类似于C语言中的“函数指针”。但是与函数指针不同，委托是面向对象的，并且是类型安全的。
委托可以看成是一个方法的“容器”，将某一具体的方法“装入”后，就可以把它当成方法一样调用。

### 3. 委托的重要性：
委托是 .NET Framework 对 C# 和 VB\.NET 等面向对象编程语言特性的一个重要扩充；
是.NET中的一些重要技术，比如事件、异步调用和多线程开发的技术基础。


## 5.12.2 如何建立

### 1. 声明委托类型

基本语法
``` csharp
delegate-modifiers_opt   delegate   return-type   identifier (formal-parameter-list_opt ) ;
// 级别标识 delagate 返回类型 标识名 {参数列表}
```

其中delegate-modifier修饰符可以是new, public, protected, internal, private等关键字。同一修饰符在一个委托声明中多次出现属于编译时错误。

委托声明定义一个从 System.Delegate 类派生的类。

比如：
```csharp
// 定义一个称为D1委托的委托类
delegate int D1(int i, double d);
```
实例化方法为：
```csharp
class A
{
    delegate int D2(int c, double d);
    // 建立委托类型为D2的方法M1、M2
    public static int M1(int f, double g) {...}
    public static void M2(int k, double l) {...}
}
```

### 2. 委托变量的创建与实例化

#### 2.1 委托变量的声明：

```csharp
delegate-type delegate-variant; //例如 D1 d;
```

委托创建表达式：

```csharp
new delegate-type (expression); 
//用于创建 delegate-type 的新实例。 
//expression是一个方法名
```
例如	
```csharp
D1 d = new D1(A.M1); 	//引用A的静态方法
A a = new A();
d = new D1(a.M3);	 	//引用A的实例方法
```

#### 2.2 实例化

委托的实例是由委托创建表达式创建的或者是到委托类型的转换。
新创建的委托实例可以引用静态方法，也可以引用实例方法，或者是另一个委托。
例如，上例中new D1(A.M1)和new D1(a.M3)分别创建了两个委托实例。
其中new D1(A.M1)引用的是静态方法， new D1(a.M3)引用的是实例方法。

### 3. 调用委托的方法

如果去掉委托类型的声明中的delegate关键字，可以发现其余下部分与方法的签名很类似。
将委托变量名视为方法名，然后给将合适的参数赋予委托变量作为方法的参数，可以执行委托。
如果一个委托变量接受了多个委托，这些委托的方法都将一一被执行。

### 4. 示例

定义一个类Arithmetic ，用四个方法（Add, Subtract , Multiply, Divide），
实现计算两个整数的四则运算，并在控制台打印算术表达式和结果。
然后定义一个委托，根据后输入的整数和方法的名称，计算结果。

```csharp
namespace pro
{
    public class Arithmetic {
        public static void Add(int a, int b) {
            Console.WriteLine("{0} + {1} = {2}", a, b, a + b);
        }
        // Subtract, Multiply, Divide 等其它方法
    }

    //声明一个委托类型MathOpt，该类型与Add, Subtract, Multiply, Divide等方法兼容
    delegate void MathOpt(int a, int b);   

    // 编写测试代码
    // Program.cs
    class Program{
        static void Main(string[] args)    {
            MathOpt mathOpt = new MathOpt(Arithmetic.Add);
            mathOpt(6, 3);

            mathOpt = new MathOpt(Arithmetic.Subtract);
            mathOpt(6, 3);
        }
    }
}
```
实际环境中：
```cs
using System;
namespace proj5_12
{
    delegate double mydelegate(double x, double y);		//声明委托类型
    class MyDeClass								//声明含有方法的类
    {
        public double add(double x, double y){ return x + y; }
        public double sub(double x, double y){ return x - y; }
        public double mul(double x, double y){ return x * y; }
        public double div(double x, double y){ return x / y; }
    }

    class Program
    {
        static void Main(string[] args)
        {
            MyDeClass obj = new MyDeClass();		//创建MyDeClass类实例

            mydelegate p = new mydelegate(obj.add);//委托对象与obj.add()相关联
            Console.WriteLine("5+8={0}", p(5, 8));	//调用委托对象p

            p = new mydelegate(obj.sub);		//委托对象与obj.sub()相关联
            Console.WriteLine("5-8={0}", p(5, 8));	//调用委托对象p

            p = new mydelegate(obj.mul);		//委托对象与obj.mul()相关联
            Console.WriteLine("5*8={0}", p(5, 8));	//调用委托对象p

            p = new mydelegate(obj.div);		//委托对象与obj.div()相关联
            Console.WriteLine("5/8={0}", p(5, 8));	//调用委托对象p
        }
    }
}


```
## 5.12.3 委托对象封装多个方法
### 1.组合委托
- 从某个方法创建一个委托实例时，该委托实例将封装此方法，此时，它的调用列表只包含一个“入口点”。  
- 委托可以使用 **+=** 运算符和二元运算符 **+** 进行组合。  
- 当组合两个非空委托实例时，它们的**调用列表将连接**在一起（按照左操作数在前、右操作数在后的顺序）以组成一个新的调用列表，- 其中包含两个或更多个“入口点”。  
- 委托实例所封装的方法集合称为**调用列表**。  
- 同一个方法可以在调用列表中多次出现。这种情况下，它每出现一次，就会被调用一次。  
#### 例
将 Subtract，Divide，Multiply 三个方法组合为一个委托。
```cs
//定义委托变量，并用Subtract方法初始化委托。
MathOpt mathOpt = new MathOpt(Arithmetic.Subtract);
///将Divide和Multiply方法与mathOpt 组合为一个委托。
mathOpt += new MathOpt(Arithmetic.Divide)
        + new MathOpt(Arithmetic.Multiply) ;
//注意，组合后的委托列表内有三个方法，分别为Subtract，Divide，Multiply；
//调用mathOpt委托时，将依次顺序执行上述方法。
```

课上练习：

```cs
using System;

namespace csharpLearning
{
    // 建立类OnClassTest1105
    public class OnClassTest1105
    {
        public static void Add(int a, int b)
        {
            Console.WriteLine("{0}+{1}={2}", a, b, a + b);
        }
        public static void Divid(int a,int b)
        {
            Console.WriteLine("{0}/{1}={2}", a, b, a / b);
        }

        public void Subtract(int a,int b)
        {
            Console.WriteLine("{0}-{1}={2}", a, b, a - b);
        }
    }

    /// <summary>
    ///  建立 委托类MathOpt 传入参数表为(int x, int y)，无返回参数
    /// </summary>
    /// <param name="x"></param>
    /// <param name="y"></param>
    delegate void MathOpt(int x, int y);

    class OnClassProgram
    {
        // 建立事件关键字以避免使用委托时无意间重定义
        static event MathOpt mathOpt;

        static void Main(string[] args)
        {
            // 建立 MathOpt委托类 的 委托实例mathOpt1
            MathOpt mathOpt1;
            // 关联 (委托mathOpt1) 与 ( 满足 MthOpt委托类 的 ( 类OnClassTest110 的 类方法OnClassTest1105.Add ) )
            mathOpt1 = new MathOpt(OnClassTest1105.Add);

            // 重关联 (委托mathOpt1) 与 ( 满足 MthOpt委托类 的 ( 类OnClassTest110 的 类方法OnClassTest1105.Divid ) )
            mathOpt1 = new MathOpt(OnClassTest1105.Divid); //与mathOpt1之前的所有的委托关联取消 重新关联
            // 组合关联 (委托mathOpt1) 与 ( 满足 MthOpt委托类 的 ( 类OnClassTest110 的 类方法OnClassTest1105.Add ) )
            mathOpt1 += new MathOpt(OnClassTest1105.Add);
            mathOpt1(1, 2); // 触发委托mathOpt1，依次执行Divid和Add

            // 建立 MathOpt委托类 的 委托实例mathOpt2
            MathOpt mathOpt2;
            // 建立 类OnClassTest1105 的 实例testExample
            OnClassTest1105 testExample = new OnClassTest1105();
            // 关联 (委托mathOpt1) 与 ( 满足 MthOpt委托类 的 ( 实例方法testExample.Subtract ) )
            mathOpt2 = new MathOpt(testExample.Subtract);
            mathOpt2(4, 5);// 触发委托mathOpt2
        }
    }
}
```
### 2.移除委托
- 可以使用 `-=` 运算符和二元运算符 `-` 移出委托。
- 由于委托可以多次出现在一个调用列表中，因此移除委托时，实际上移除的是调用列表中**最后出现**的那个委托实例。
- 试图从空的列表中移除委托（或者从非空列表中移除表中没有的委托）不算是错误。
例如， mathOpt 原来的委托列表包含`Divid，Add`两个方法；如果执行如下语句，委托列表将只包含`Add`一个方法；如果多次执行如下语句，也**不会报告错误**。
```csharp
    mathOpt -= new MathOpt(OnClassTest1105.Divid);
```


## 5.12.4 匿名委托
1. **匿名方法**：  
    匿名方法就是**没有方法名称**的方法。`直接在建立委托对象时初始化进委托列表`
    当将委托与匿名方法关联时，直接给出方法的函数体，其一般语法格式如下：
    ```csharp
        delegate 返回类型 委托类型名(参数列表);
        委托类型名 委托对象名= delegate (参数列表) { /*匿名方法代码*/ };
        委托对象名(实参列表)
    ```
    > [!note|label:说明]
    > 第1个语句声明委托类型；  
    > 第2个语句定义匿名方法并将其与委托对象关联；  
    > 第3个语句调用委托。

2. **匿名委托**：
    - 委托实例的一个特点：
        - 它不知道也不关心它所封装的方法所属的类；
        - 它所关心的仅限于这些方法必须与委托的类型兼容。
        这使委托非常适合于“匿名”调用。`不关心来源`
    在.NET 2.0时代，匿名方法主要是作为简化代码的手段而引入到C# 2.0语法特性中的。  
    然而这一原先仅出现在特定编程语言中的特性，却成为了.NET 3.5中的重要技术——LINQ的基础之一。
    > 有关匿名委托的详细知识，请有兴趣的同学自学。


## 5.12.5 Lambda表达式
- 从C#3.0开始引入了 lambda 表达式， lambda 表达式为**匿名方法**提供了一个新的语法。
- 表达式使用 lambda 运算符“=>”的表达式。运算符“=>”的左边是输入参数（可选），右边包含表达式和语句块。

例如：
```csharp
    //分析lambda表达式
    (x) => x*x;
    //该lambda表达式等价于以下代码：
    T delegate(x){return x*x; }
    //其中，T的类型由编译器推出。
    //因为只有一个输入参数时，可以省略小括号。于是，上述lambda表达式等价于
        x => x*x;		
    //该lambda表达式读作x goes to x*x

    //分析lambda表达式
    Students.First(x => x.StudentCode == code);
    /* 
        等价于代码
            T delegate(x){x.StudentCode}
        使用 Students 类的静态方法 First ，
        实现从中找出第一个满足条件的学生对象，
        寻找条件是学生的 StudentCode 等于某个给定的 code。
        结果是返回找到的第一个符合条件的学生对象。
    */


    //示例2：
    (x,y )=> x+y;
    // 在有多个输入参数时，必须将它们包含在一个括号中，并用逗号分隔。
    // 该表达式等价于以下代码：
    T delegate(T x,T y){return x+y; }


    //示例3：
    (int x,int y)=>x+y;
    // 如果编译器无法推出类型，可以显式指定类型。


    //示例4：
    ()=> Console.WriteLine("Hello");
    //使用空括号指定0个输入参数。
    
    
    //示例5：
    (int x,int y) => { return(x+y);}
    //当右边有return语句时，需要使用大括号将这些语句括起来。
    
    
    //示例6：
    (int x,int y) => { int z=x+y; return z;}
    //当右边有多个语句时，需要使用大括号将这些语句括起来。
    
    
```

## 小节

### 委托的性质
- 委托是一种数据结构，它引用静态方法或引用类实例及该类的实例方法。
- 委托实例一旦被实例化，它将始终引用同一目标对象和方法。
- 当组合两个委托或者从一个委托移除另一个时，将产生一个新的委托，该委托具有它自己的调用列表；
    被组合或移除的委托的调用列表将保持不变。

### 原理
- 委托声明定义一个从 System.Delegate 类派生的类。
- 委托实例封装了一个调用列表，该列表列出了一个或多个方法，每个方法称为一个可调用实体。
    可调用实体可以是实例方法，也可以是静态方法。
    - 对于实例方法，可调用实体由该方法和一个相关联的实例组成；
    - 对于静态方法，可调用实体仅由一个方法组成。
- 用一个适当的参数集来调用一个委托实例，就是用此给定的参数集来调用该委托实例的每个可调用实体。

### 作用
- 孤立的对象是无趣的。
    委托提供了一种对存在关联的对象之间进行建模的新方式，
    这种方式将一个个独立的对象联系串联在一起，
    这些对象通过相互协作来更好地履行各自的职责。
- 委托构成了Windows基于事件编程模式中的重要一环。

### Delegate和MulticastDelegate类
- Delegate类是与委托相关的抽象基类。
- MulticastDelegate类派生自Delegate类，表示多路广播委托，即其调用列表中可以拥有多个元素的委托。
- 用户定义的所有委托类型派生自MulticastDelegate类。该类有如下重要的成员：
    - GetInvocationList——方法：按照调用顺序返回此多路广播委托的调用列表。
    - Method——属性：获取委托所表示的方法。 
    - GetMethodInfo——扩展方法：获取指示指定委托表示的方法的对象。 

### 
- 给委托变量赋值时：
    - 如果采用“=”运算符，则无论该委托变量的委托列表中是否已经包含其他委托，
        赋值后，其委托列表中将仅包含右边表达式中的全部委托；
        `重新关联`
    - 如果采用“+=”运算符（组合运算），该变量的委托列表中将不仅包含原有委托列表中的内容，
        还将包含右边表达式中的全部委托。
        `延长关联`
- 利用委托的这一特点，可以实现消息传递。

