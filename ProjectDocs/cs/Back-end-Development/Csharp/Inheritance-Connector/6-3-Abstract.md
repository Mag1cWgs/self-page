## 6.3 抽象类
> [!note|label:理解]
> 里氏替换原则 (继承后的重写)：  
> 父类出现地方可以被子类替换掉，要保护替换前的原有的工作，
> 在替换后依然保持不变子类在重写父类方法时，尽量选择扩展重写。  
> 
> 抽象方法和虚方法区别：  
> 从定义来说：  
>   抽象方法：只有声明【定义】，没有实现的方法 就是抽象方法；  
>   虚方法：用vritual关键修饰的已经实现的方法。  
> 语法说：  
>   抽象方法：实现类必须实现【重写】；  
>   虚方法：可以重写也可以不重写



---



### 6.3.1 抽象类的特性
- `C#` 中的抽象类同样是一种类，可以包含多个成员，但是具有以下特性：
    - 不能实例化，即不能通过 `new` 方法创建实例；
    - 可以包含抽象方法、抽象访问器；
    - 可以有非抽象方法；
    - 不能用 `sealed` 修饰，也即不能密封；
    - 被抽象类继承为派生抽象类；
    - 所派生的非抽象类必须实现基类抽象方法、抽象访问器的具体化。
- 重点内容：
    - 正确定义构造函数；
    - 保证抽象类功能的正确性和拓展性。
- 具体实现原则：
    - 不在抽象类内部定义公共的构造函数 / 受保护的内部构造函数：
        - 具有 `public` 和 `protected internal` 可见性的构造函数用于能实例化的类型；
        - 任何情况下抽象类均不应该实例化。
    - 在内部定义一个受保护构造函数 / 内部构造函数：
        - 便于创建派生类实例时执行基类的初始化；
        - 内部构造函数可以防止抽象类被用作其他程序集中类型的基类。



---



### 6.3.2 抽象方法
- 在方法中使用 `abstract` 修饰符以指示不包含实现，这样的方法称为**抽象方法**：
    - 使用 `abstract` 关键字声明；
    - 是隐式的虚方法；
    - 只允许抽象类中使用抽象方法声明；
        - 非抽象类中不能使用 `abstract` 修饰方法。
    - 一个类中可以包括一个或多个抽象方法；
    - 抽象方法声明不提供具体实现，则没有方法体；
        - 以分号结尾，签名后没有花括号；
        - 结构 `[其他标识符] abstract 返回类型 函数名(传入);  `
    - 利用非抽象类重写方法成员实现；
        - 实现抽象类用 `:` ；
        - 实现抽象方法用 `override` 关键字。
    - 抽象方法不能用 `static` 和 `virual` 修饰符；
    - 抽象方法被实现后不能更改修饰符。



---



### 6.3.3 抽象属性
- 除了在声明和调用语法上不同以外,抽象属性的行为与抽象方法类似。
- 另外,抽象属性具有以下特性:
    - 在静态属性上使用 `abstract` 修饰符是**错误**的。
    - 在派生类中,通过使用 `override` 修饰符的属性声明可以重写抽象的继承属性；
    - 抽象属性声明不提供属性访问器的实现；
        - 只声明该类支持的属性；
        - 将访问器的实现留给其派生类。
        - 即 `[修饰符] abstract 返回类型 属性名 { [get;] [set;] }`



---



### 课上例子

- 构建基类：
    - 封闭的基本平面图形 `ClosedGraph`
        - 属性成员：
            - 名称 `Name`
            - 面积 `Area`
            - 周长 `Perimeter`
                - 部分简单图形的 `Area` 和 `Perimeter` 可以根据参数求得
        - 方法成员
            - 有 无参数、无返回值 的实例方法 `ShowDescripetion()`
                - 用于显示格式化后属性名称和值
- 构建派生类：
    - 圆形 `Circle`
        - 添加属性：半径 `Radius`
    - 正方形 `Square`
        - 添加属性：边长 `EdgeLength `  
    - 直角三角形 `RightTriangle`
        - 有三条边，构造时输入两边
            - `A = B` 时构造等腰直角三角形

```cs
using System;

namespace c_sharp_learning
{    
    internal class OnClass_11_19
    {
        static void Main(String[] args)
        {
            Circle exampleCir = new Circle();
            exampleCir.ShowDescription();

            Square exampleSqu = new Square();
            exampleSqu.ShowDescription();

            RightTriangle exampleRightTriangle = new RightTriangle();
            exampleRightTriangle.ShowDescription();

        }

    }

    /// <summary>
    /// 封闭的基本平面图形 ClosedGraph
    ///     名称 Name
    ///     面积 Area
    ///     周长 Perimeter
    ///         部分简单图形的 Area和 Perimeter可以根据参数求得
    ///     有 无参数、无返回值 的实例方法 ShowDescripetion()
    ///         用于显示格式化后属性名称和值
    /// </summary>
    abstract class ClosedGraph : Object
    {
        public abstract string Name { get; }

        public abstract double Perimeter { get; }
        public abstract double Area { get; }

        protected ClosedGraph()
        {
            //Console.WriteLine("这是 CloseGraph 类构造方法！");
        }

        public abstract double GetPerimeter();
        public abstract double GetArea();

        public virtual void ShowDescription()
        {
            string result = string.Format("类型：{0}\t面积：{1}\t周长：{2}\t", Name, Area, Perimeter);
            Console.WriteLine(result);
        }
    }

    /// <summary>
    /// 基于抽象类 ClosedGraph
    /// 有新属性 Radius
    /// </summary>
    class Circle : ClosedGraph
    {
        private double _Radius;
        public double Radius
        {
            set
            {
                if (value < 0) throw new ArgumentException(" Radius Must > 0 !");
                _Radius = value;
            }
            get { return _Radius; }
        }


        public override string Name { get { return "Circle"; } }
        public override double Perimeter { get { return GetPerimeter(); } }
        public override double Area { get { return GetArea(); } }

        public override double GetArea()
        {
            return Math.PI * Radius * Radius;
        }
        public override double GetPerimeter()
        {
            return 2* Math.PI * Radius;
        }

        public Circle(double radius){ Radius = radius; }
        public Circle(): this(1.0) { }

        public override void ShowDescription()
        {
            string result = string.Format("类型：{0}\t半径：{1}\t面积：{2}\t周长：{3}\t", Name, Radius, Area, Perimeter);
            Console.WriteLine(result);
        }
    }

    /// <summary>
    /// 基于抽象类 ClosedGraph
    /// 有新属性边长 EdgeLength
    /// </summary>
    class Square : ClosedGraph
    {
        private double _EdgeLength;
        public double EdgeLength
        {
            get { return _EdgeLength; }
            set
            {
                if (value < 0) throw new ArgumentException(" Edge Length Must > 0 !");
                _EdgeLength = value;
            }
        }

        public override string Name { get { return "Square"; } }
        public override double Perimeter { get  { return GetPerimeter(); }  }
        public override double Area { get { return GetArea(); } }

        public override double GetArea()
        {
            return EdgeLength * EdgeLength;
        }

        public override double GetPerimeter()
        {
            return 4 * EdgeLength;
        }

        public Square(double edgeLength) { EdgeLength = edgeLength; }
        public Square() : this(1.0) { }


        public override void ShowDescription()
        {
            string result = string.Format("类型：{0}\t边长：{1}\t面积：{2}\t周长：{3}\t", Name, EdgeLength, Area, Perimeter);
            Console.WriteLine(result);
        }
    }

    /// <summary>
    ///  直角三角形 RightTriangle
    ///     有三条边，构造时输入两边即可完成
    ///     A = B时构造等腰直角三角形
    /// </summary>
    class RightTriangle : ClosedGraph
    {
        private double _SideA;
        public double SideA
        {
            get { return _SideA; }
            set
            {
                if (value < 0) throw new ArgumentException();
                _SideA = value;
            }
        }


        private double _SideB;
        public double SideB
        {
            get { return _SideB; }
            set
            {
                if (value < 0) throw new ArgumentException();
                _SideB = value;
            }
        }
        public double SideC { get { return Math.Sqrt(SideA * SideA + SideB * SideB); } }

        public bool Isosceles { get { return IsIsosceles(); } }

        public override string Name
        { 
            get 
            { 
                if (Isosceles)
                    return "Isosceles Right Triangle";
                else 
                    return "Right Triangle";
            } 
        }

        public override double Area { get { return GetArea(); } }
        public override double Perimeter { get { return GetPerimeter(); } }

        public RightTriangle(double a, double b)
        {
            SideA = a; SideB = b;
        }
        public RightTriangle(double a) : this(a, a){ }
        public RightTriangle() : this(1.0) { }

        public override double GetArea()
        {
            return SideA * SideB / 2;
        }
        public override double GetPerimeter()
        {
            return SideA + SideB + SideC ;
        }
        public override void ShowDescription()
        {
            string result = "";
            if (Isosceles)
                result = string.Format("类型：{0}\t等腰边长：{1}\t面积：{2}\t周长：{3}\t", Name, SideA, Area, Perimeter);
            else
                result = string.Format("类型：{0}\t边长：({1},{2})\t面积：{3}\t周长：{4}\t",Name, SideA, SideB, Area, Perimeter);
            Console.WriteLine(result);
        }

        public bool IsIsosceles()
        {
            return SideA == SideB;
        }
    }

}
```