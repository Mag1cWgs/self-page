# 5.12 委托
> 委托是事件的抽象
> 通过委托实现实践

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
#### 
从某个方法创建一个委托实例时，该委托实例将封装此方法，此时，它的调用列表只包含一个“入口点”。  
委托可以使用 **+=** 运算符和二元运算符 **+** 进行组合。  
当组合两个非空委托实例时，它们的调用列表将连接在一起（按照左操作数在前、右操作数在后的顺序）以组成一个新的调用列表，其中包含两个或更多个“入口点”。  
委托实例所封装的方法集合称为调用列表。  
同一个方法可以在调用列表中多次出现。这种情况下，它每出现一次，就会被调用一次。  
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

namespace c_sharp_learning
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
            mathOpt1(1, 2); // 触发委托mathOpt1，依次执行

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
