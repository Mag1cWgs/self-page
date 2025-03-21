## 介绍
- 简单工厂设计模式，又叫**静态工厂方法**(Static Factory Method)，它不属于23种设计模式之一。
- 简单工厂设计模式，是由工厂决定创建出哪一种产品类的实例，是工厂模式家族中最简单的模式。

## 实例
- 写一个简单项目，实现计算器中加减乘除功能
- 至少四个对象：加、减、乘、除
- 需要父类：抽象类 / 接口

### 默认实现
- 问题：
    - 创建对象过程和客户端强耦合
    - 主函数：初始化操作数操作符，创建响应对象
    - 无法复用

```cs
// Main.cs
// 初始化操作数操作符
Console.WriteLine("请输入操作符1：");
double d1 = Convert.ToDouble(Console.ReadLine());
Console.WriteLine("请输入操作符2：");
double d2 = Convert.ToDouble(Console.ReadLine());
Console.WriteLine("请输入操作符：");
string oper = Console.ReadLine();
// 创建响应对象
ICalculator calculator = null;
switch (oper)
{
	case "+":
		calculator = new Add();
		break;
	case "-":
		calculator = new Sub();
		break;
	case "*":
		calculator = new Mul();
		break;
	case "/":
		calculator = new Div();
		break;
	default :
		Console.WriteLine("请输入合法运算符");
		break;
}
double res = calculator.GetResult(d1, d2);
Console.WriteLine(res);

// 运算抽象接口
public interface ICalculator
{
	double GetResult(double d1, double d2);
}

// 接口的实现类
public class Add: ICalculator
{
	public double GetResult(double d1, double d2)
	{
		return d1+d2;
	}
}
public class Sub : ICalculator
{
	public double GetResult(double d1, double d2)
	{
		return d1 - d2;
	}
}
public class Mul : ICalculator
{
	public double GetResult(double d1, double d2)
	{
		return d1 * d2;
	}
}
public class Div : ICalculator
{
	public double GetResult(double d1, double d2)
	{
		return d1 / d2;
	}
}
```

### 使用简单工厂方法（静态工厂方法）
- 把创建对象的过程，封装到静态方法中，在客户端直接调用
- 实现了客户端和创建对象的解耦，明确了职责

```cs
// main.cs
// 初始化操作数操作符
Console.WriteLine("请输入操作符1：");
double d1 = Convert.ToDouble(Console.ReadLine());
Console.WriteLine("请输入操作符2：");
double d2 = Convert.ToDouble(Console.ReadLine());
Console.WriteLine("请输入操作符：");
string oper = Console.ReadLine();
// 使用静态工厂方法来创建对象
ICalculator cal = CalFactory.GetCalculator(oper);
double res = cal.GetResult(d1, d2);
Console.WriteLine(res);

// 工厂类
public class CalFactory
{
    // 静态工厂方法
	public static ICalculator GetCalculator(string oper)
	{
		ICalculator calculator = null;
		switch (oper)
		{
			case "+":
				calculator = new Add();
				break;
			case "-":
				calculator = new Sub();
				break;
			case "*":
				calculator = new Mul();
				break;
			case "/":
				calculator = new Div();
				break;
			default:
				Console.WriteLine("请输入合法运算符");
				break;
		}
		return calculator;
	}
}

// 运算抽象接口
public interface ICalculator
{
	double GetResult(double d1, double d2);
}

// 接口的实现类
public class Add: ICalculator
{
	public double GetResult(double d1, double d2)
	{
		return d1+d2;
	}
}
public class Sub : ICalculator
{
	public double GetResult(double d1, double d2)
	{
		return d1 - d2;
	}
}
public class Mul : ICalculator
{
	public double GetResult(double d1, double d2)
	{
		return d1 * d2;
	}
}
public class Div : ICalculator
{
	public double GetResult(double d1, double d2)
	{
		return d1 / d2;
	}
}
```

## 总结

<div align = center> <img src="/ProjectDocs/cs/DesignPattern/image/Simple-Factory-Instance.png" width=80%> </div>

- 优点:
    1. 简单工厂设计模式解决了客户端直接依赖于具体对象的问题。
        - 客户端消除了创建对象的责任，仅仅承担使用的责任。
        - 简单工厂模式实现了对责任的分割。
            - 创建对象
            - 调用对象
    2. 简单工厂也起到了代码复用的作用。

- 缺点:
    1. 系统扩展困难，一旦加入新功能，就必须要修改工厂逻辑。
    2. 简单工厂集合了所有创建对象的逻辑，一旦不能正常工作，会导致整个系统出现问题。
