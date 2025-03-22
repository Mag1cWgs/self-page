## 介绍
- 抽象工厂:
    - 为了缩减创建子类工厂的数量
    - 不必给每一个产品分配一个工厂类,可以将产品进行分组
    - 每组中的不同产品由同一个工厂类的不同方法来创建。

## 例子
- 分别使用简单工厂设计模式/工厂方法设计模式实现：创建不同品牌的键盘

### 简单工厂设计模式下实现
<div align = center> <img src="/ProjectDocs/cs/DesignPattern/image/Abs-Example-Simple.png" width=80%> </div>

```cs
// 问题：
// 1. 所有创建对象并封装均集成在 KeyboardFactory
// 2. 抽象依赖于细节，高耦合不方便拓展
public class KeyboardFactory
{
	public static IKeyboard GetKeyboard(string brand)
	{
		IKeyboard keyboard = null;
		switch (brand)
		{
			case "DELL":
				keyboard = new DellKeyboard();
				break;
			case "LENOVO":
				keyboard = new LenovoKeyboard();
				break;
			case "HP":
				keyboard = new HPKeyboard();
				break;
		}
		return keyboard;
	}
}


public interface IKeyboard
{
	void ShowBrand();
}

public class DellKeyboard : IKeyboard
{
	public void ShowBrand()
	{
		Console.WriteLine("DELL");
	}
}
public class LenovoKeyboard : IKeyboard
{
	public void ShowBrand()
	{
		Console.WriteLine("Lenovo");
	}
}
public class HPKeyboard : IKeyboard
{
	public void ShowBrand()
	{
		Console.WriteLine("HP");
	}
}
```

### 工厂方法设计模式下实现
<div align = center> <img src="/ProjectDocs/cs/DesignPattern/image/Abs-Example-FacMethod.png" width=80%> </div>

```cs
// 添加新的需求对象时，会出现类爆炸

// 工厂的抽象
public interface IKeyboardFactory
{
	IKeyboard GetKeyboard();
}
// 工厂的具体
public class DellFactory : IKeyboardFactory
{
	public IKeyboard GetKeyboard()
	{
		return new DellKeyboard();
	}
}
public class LenovoFactory : IKeyboardFactory
{
	public IKeyboard GetKeyboard()
	{
		return new LenovoKeyboard();
	}
}
public class HPFactory : IKeyboardFactory
{
	public IKeyboard GetKeyboard()
	{
		return new HPKeyboard();
	}
}

// 对象的抽象
public interface IKeyboard
{
	void ShowBrand();
}
// 对象的具体
public class DellKeyboard : IKeyboard
{
	public void ShowBrand()
	{
		Console.WriteLine("DELL");
	}
}
public class LenovoKeyboard : IKeyboard
{
	public void ShowBrand()
	{
		Console.WriteLine("Lenovo");
	}
}
public class HPKeyboard : IKeyboard
{
	public void ShowBrand()
	{
		Console.WriteLine("HP");
	}
}
```

### 抽象工厂设计模式指导
- 如果业务扩展，避免类爆炸
    - 分组合并，工厂抽象化

<div align = center> <img src="/ProjectDocs/cs/DesignPattern/image/Abs-Factory.png" width=80%> </div>

```cs
// 假设已经确定选择 Dell 品牌的产品
// 实际参考工厂方法设计模式中的反射实现
AbstractFactory abstractFactory = new DellFactory();
// 使用抽象工厂的实例来直接生产产品
//把 品牌 的选择取决于抽象工厂的实例
IKeyboard keyboard = abstractFactory.GetKeyboard();
IMouse mouse = abstractFactory.GetMouse();


// 抽象工厂、抽象产品
public interface AbstractFactory
{ 
	IKeyboard GetKeyboard();
	IMouse GetMouse();
}
public interface IKeyboard
{
	void ShowKeyboardBrand();
}
public interface IMouse
{
	void ShowMouseBrand();
}


// Dell 工厂 与 产品
public class DellFactory : AbstractFactory
{
	IKeyboard AbstractFactory.GetKeyboard()
	{
		return new DellKeyboard();
	}
	IMouse AbstractFactory.GetMouse()
	{
		return new DellMouse();
	}
}
public class DellKeyboard : IKeyboard
{
	public void ShowKeyboardBrand()
	{
		Console.WriteLine("DELL");
	}
}
public class DellMouse : IMouse
{
	public void ShowMouseBrand()
	{
		Console.WriteLine("DELL");
	}
}


// Lenovo 工厂 与 产品
public class LenovoKeyboard : IKeyboard
{
	public void ShowKeyboardBrand()
	{
		Console.WriteLine("Lenovo");
	}
}
public class LenovoMouse : IMouse
{
	public void ShowMouseBrand()
	{
		Console.WriteLine("Lenovo");
	}
}
public class LenovoFactory : AbstractFactory
{
	IKeyboard AbstractFactory.GetKeyboard()
	{
		return new LenovoKeyboard();
	}
	IMouse AbstractFactory.GetMouse()
	{
		return new LenovoMouse();
	}
}


// HP 工厂 与 产品
public class HPFactory : AbstractFactory
{
	IKeyboard AbstractFactory.GetKeyboard()
	{
		return new HPKeyboard();
	}
	IMouse AbstractFactory.GetMouse()
	{
		return new HPMouse();
	}
}
public class HPKeyboard : IKeyboard
{
	public void ShowKeyboardBrand()
	{
		Console.WriteLine("HP");
	}
}
public class HPMouse : IMouse
{
	public void ShowMouseBrand()
	{
		Console.WriteLine("HP");
	}
}
```

## 总结
- 抽象工厂角色:这是抽象工厂模式的核心，是具体的工厂角色必须实现的接口或者必须继承的抽象类。
    - 分组
- 具体工厂角色，它包含和具体业务逻辑有关的代码。由应用程序调用以创建对应的具体产品对象。
- 抽象产品角色:它是具体产品继承的父类或者接口，
- 具体产品角色类:具体工厂角色创建的对象，就是该类的实例。


## 各种工厂设计模式区分
- 简单工厂:
    - 一个工厂类（不能实现依赖倒置）
    - 一个产品抽象类
    - 工厂类创建方法依据传入参数并判断，选择创建具体产品对象。
- 工厂方法:
    - 多个工厂类（为了依赖倒置）
    - 一个产品抽象类
    - 利用多态（反射）创建不同的产品对象，避免了大量的 switch-case 判断。
- 抽象工厂:
    - 多个工厂类
    - 多个产品抽象类（避免类爆炸）
    - 产品子类分组，同一个工厂实现类创建同组中的不同产品，减少了工厂子类的数量。
