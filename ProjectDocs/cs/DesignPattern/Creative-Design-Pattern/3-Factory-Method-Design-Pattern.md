## 介绍
- 解决了简单工厂设计模式中的缺点：
    1. 系统扩展困难，一旦加入新功能，就必须要修改工厂逻辑。
    2. 简单工厂集合了所有创建对象的逻辑，一旦不能正常工作,会导致整个系统出现问题。

- 工厂方法模式：
    - 定义一个用于创建对象的接口，让子类决定实例化哪一个类。
    - 工厂方法使一个类的实例化，延迟到子类。

## 实例

### 简单工厂方法下的代码
1. 创建对象的所有逻辑集合在一个方法中，风险较高
2. 现在是抽象依赖于细节，需要让细节依赖于抽象

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


### 工厂方法修正后的代码
1. 抽象工厂角色：
    - 是工厂方法模式的核心。
    - 是具体的工厂角色必须实现的接口或者必须继承的抽象类。
2. 具体工厂角色：
    - 包含和具体业务逻辑有关的代码。
    - 由应用程序调用以创建对应的具体产品对象。
3. 抽象产品角色：
    - 是具体产品继承的父类或者接口。
4. 具体产品角色类：
    - 具体工厂角色创建的对象，就是该类的实例。

```cs
// main.cs
// 初始化操作数操作符
Console.WriteLine("请输入操作符1：");
double d1 = Convert.ToDouble(Console.ReadLine());
Console.WriteLine("请输入操作符2：");
double d2 = Convert.ToDouble(Console.ReadLine());
Console.WriteLine("请输入操作符：");
string oper = Console.ReadLine();

// 根据传入参数
// 创建一个 可以创建对象 的 创建工厂对象
ICalFactory calFactory = null;
switch (oper)
{
	case "+":
		calFactory = new AddFactory();
		break;
	case "-":
		calFactory = new SubFactory();
		break;
	default:
		Console.WriteLine("请输入合法运算符");
		break;
}
// 然后调用 创建工厂对象 产生 对象，再调用对象的函数
ICalculator calculator = calFactory.GetCalculator();
Console.WriteLine(calculator.GetResult(d1,d2));


// 把创建对象封装成抽象
public interface ICalFactory
{
	ICalculator GetCalculator();
}
// 创建对象接口的实现类
public class AddFactory : ICalFactory
{
	public ICalculator GetCalculator()
	{
		return new Add();
	}
}
public class SubFactory : ICalFactory
{
	public ICalculator GetCalculator()
	{
		return new Sub();
	}
}


// 运算抽象接口
public interface ICalculator
{
	double GetResult(double d1, double d2);
}

// 运算抽象接口的实现类
public class Add : ICalculator
{
	public double GetResult(double d1, double d2)
	{
		return d1 + d2;
	}
}
public class Sub : ICalculator
{
	public double GetResult(double d1, double d2)
	{
		return d1 - d2;
	}
}
```

### 使用反射技术建立反射工厂以优化流程
```cs
// main.cs
// 0 初始化操作数操作符
Console.WriteLine("请输入操作符1：");
double d1 = Convert.ToDouble(Console.ReadLine());
Console.WriteLine("请输入操作符2：");
double d2 = Convert.ToDouble(Console.ReadLine());
Console.WriteLine("请输入操作符：");
string oper = Console.ReadLine();
// 1 建立一个反射工厂，利用 Attribute 标记与反射
//     建立一个 反射工厂ReflectionFactory
ReflectionFactory reflectionFactory = new ReflectionFactory();
// 2 利用反射工厂的 GetFactory 方法，依照反射工厂内部的键值表
//     产生 对象产生工厂ICalFactory
ICalFactory calFactory = reflectionFactory.GetFactory(oper);
// 3 利用对象工厂的 GetCalculator 方法，
//     获取 具体对象ICalculator
ICalculator calculator = calFactory.GetCalculator();
// 4 调用具体对象进行业务处理
//     返回具体值并打印
Console.WriteLine(calculator.GetResult(d1,d2));


// 1.1 自定义 Attribute
public class OperToFactory : Attribute
{
	public string OperStr { get; }// 不写 setter 因为值在引用特性时写好，无需赋值
	// 构造函数，在函数声明前加上 [OperToFactory(string s)] 以标记
	public OperToFactory(string s)
	{
		this.OperStr = s;
	}
}
// 1.2 建立反射工厂
// 作用: 程序运行时，拿到描述关系，返回响应对象
public class ReflectionFactory
{
	// 1.2.1 存储 运算符-响应对象 的键值表
	Dictionary<string,ICalFactory> dic = new Dictionary<string,ICalFactory>();
	// 1.2.2 构造函数，在构造时建立键值表
	public ReflectionFactory()
	{	// 1. 拿到当前正在运行的程序集
		Assembly assembly = Assembly.GetExecutingAssembly();
		// 2. 建立所需的 string - ICalFactory
		foreach (var item in assembly.GetTypes())
		{   // 使用 Type.IsAssignableFrom() 来判断是否继承于 ICalFactory
			// 需要额外去除 ICalFactory 这个接口本身，使用 Assembly.IsInterface 判断
			// 只会有继承了 ICalFactory 的类进入此代码块
			if (typeof(ICalFactory).IsAssignableFrom(item)
				&& !item.IsInterface)
			{	// 实例化 Attribute 类
				OperToFactory otf = item.GetCustomAttribute<OperToFactory>();
				// 如果 otf 的 OperStr 属性非空（对应方法已经做过 Attribute 标记）
				// 建立 otf.OperStr - item 键值对
				if (otf.OperStr != null)
				{
					dic[otf.OperStr] = Activator.CreateInstance(item)as ICalFactory;
				}
			}
		}
	}
	
	// 2.1 反射工厂的对象返回函数
	// 基于 1.2.2 当前类构造时维护了在 1.2.1 中产生的键值表，
	// 返回一个 对象产生工厂ICalFactory
	public ICalFactory GetFactory(string s)
	{
		if(dic.ContainsKey(s))
		{
			return dic[s];
		}
		return null;
	}
}


// 3.1 把创建对象封装成抽象
public interface ICalFactory
{
	ICalculator GetCalculator();
}
// 3.2 创建对象接口的实现类
[OperToFactory("+")]
public class AddFactory : ICalFactory
{
	public ICalculator GetCalculator()
	{
		return new Add();
	}
}
[OperToFactory("-")]
public class SubFactory : ICalFactory
{
	public ICalculator GetCalculator()
	{
		return new Sub();
	}
}


// 4.1 运算抽象接口
public interface ICalculator
{
	double GetResult(double d1, double d2);
}

// 4.2 运算抽象接口的实现类
public class Add : ICalculator
{
	public double GetResult(double d1, double d2)
	{
		return d1 + d2;
	}
}
public class Sub : ICalculator
{
	public double GetResult(double d1, double d2)
	{
		return d1 - d2;
	}
}
```

## 总结
<div align = center> <img src="/ProjectDocs/cs/DesignPattern/image/Factory-Method-Instance.png" width=80%> </div>



