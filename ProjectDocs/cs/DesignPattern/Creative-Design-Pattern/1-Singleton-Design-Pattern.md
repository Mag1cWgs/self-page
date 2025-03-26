## 应用场景
- 某些应用程序应该只有一个实例
- 节省资源、提高效率

> C# 的枚举无法像 Java 一样实现线程安全、反射安全的单例设计模式

## 饿汉式
- 优点
    - 书写简单
    - 避免线程同步问题
- 缺点
    - 没有实现「懒加载」，造成内存浪费
        - 使用静态内部类来实现懒加载

```cs
//new的三部曲
//1、在内存中开辟空间
//2、执行对象的构造函数，创建对象
//3、把我的内存空间，指向我创建的对象
// 可以通过打印 object.GetHashCode() 来判断是否指向同一对象

SingleHungry singleHungry = SingleHungry.GetSingleHungry();

/// <summary>
/// 称之为饿汉式，不推荐使用，会造成资源浪费
/// 会在调用之前就已经提前创建对象
/// </summary>
public class SingleHungry
{
	// 1. 构造函数私有化
	private SingleHungry() {}
	
	// 2. 创建一个唯一的对象
	//     private: 迪米特原则，没有必要暴露给外部的成员都写为private
	//     static: 静态成员，保证在内存的唯一性，会在类加载时直接创建
	//     readonly: 不允许修改
    // 使用内部静态类优化，此处无需定义:
	// private static readonly SingleHungry _singleHungry = new SingleHungry();


	// 3. 创建一个方法，实现对外提供获取类唯一对象的能力
	public static SingleHungry GetSingleHungry()
	{
        // 原方案: 返回 2. 中创建的唯一对象
		// return _singleHungry;
        // 现方案: 返回内部类
        return InnerClass.hungryClass;
	}

    ///<summary>
    // 内部类的优点: 不会跟着外部类一起加载到内存中，只有在外部调用 GetSingleHungry() 时才会加载，但是仍然是多线程不安全/反射危险的
    // </summary>
    private static class InnerClass
    {
        public static readonly SingleHungry hungryClass = new SingleHungry();
    }
}
```

## 懒汉式
- 优点
    - 实现「懒加载」，不会造成内存浪费
- 缺点
    - 多线程会出现线程安全问题 / 反射破坏问题
    - 只适合单线程
        - 使用「双重锁定」+「`vaolatile`」

- 多线程情况下需要加锁
    - 这里已经使用 `objectLock` 对 `GetLazySingle()` 内部操作时加锁了
    - 单线程时不会出现这个问题。
- 对于反射仍然脆弱
    1. 对于 `GetLazySingle()` 可以直接通过调用构造函数来跳过单例性判断
    2. 如果构造函数中使用标记位来记录是否单例，也可以通过修改标记位再调用来破坏单例性

- 对于 `valatile` 关键字，参考文章：
    - [MSDN 2012.12: 理论与实践中的 C# 内存模型](https://learn.microsoft.com/zh-cn/archive/msdn-magazine/2012/december/csharp-the-csharp-memory-model-in-theory-and-practice)
    - [博客园: 【C# 线程】 volatile 关键字和Volatile类、Thread.VolatileRead|Thread.VolatileWrite 详细 完整](https://www.cnblogs.com/cdaniu/p/15734140.html)

```cs
// 正常调用
LazySingle lazySingle = LazySingle.GetLazySingle();

//TestMultThread();
//UseReflectionToBreakSingletons();


/// <summary>
/// 测试函数，配合 GetLazySingle() 中的 
/// 	<c>Console.WriteLine("创建一个新实例");</c>
/// 使用
/// </summary>
[Conditional("DEBUG")]
static void TestMultThread()
{
	for (int i = 0; i < 10; i++)
		new Thread(() => LazySingle.GetLazySingle()).Start();
}


/// <summary>
/// 使用反射去破坏单例性的一种方法，
/// 	解决方法：在私有构造函数中抛出异常
/// </summary>
void UseReflectionToBreakSingletons()
{
	Type t = Type.GetType("LazySingle");
	ConstructorInfo[] cons = t.GetConstructors(BindingFlags.NonPublic | BindingFlags.Instance);
	// 直接调用私有的构造函数，避免调用 GetLazySingle()
	LazySingle lz = (LazySingle)cons[0].Invoke(null);
	//Console.WriteLine(single.GetHashCode() == lz.GetHashCode());

	// 使用标记位来记录是否单例化过，防止直接调用构造函数时抛出错误
	// 解决方法：找到标记位，在创建第二个单例对象之前修改值
	FieldInfo fieldInfo = t.GetField("isOK",BindingFlags.NonPublic | BindingFlags.Static);
	fieldInfo.SetValue("isOK", false);
	
	// 通过反射创建两个不同对象
	// 破坏的原因：new没有执行，直接跨过new，直接调用构造函数
	LazySingle lzAno = (LazySingle)cons[0].Invoke(null);
	Console.WriteLine(lz.GetHashCode() == lzAno.GetHashCode());
}


/// <summary>
/// 懒汉式单例
/// 当需要创建对象时才会创建对象，不会造成内存浪费
/// </summary>
public class LazySingle
{
		// 1. 私有化构造函数
	private LazySingle() 
	{
		lock(lockObj)
			if(isOK == false)
				isOK = true;
			else
				throw new Exception("已经存在一个单例。");
		// 原方案:
		// 如果 if 被执行，说明使用反射直接调用了私有函数
		// if(lazy != null)
		// throw new Exception("已经存在一个单例。");
		// 使用标记位来保证使用反射来创建多个单例时抛出异常
	}
	// 标记位
	private static bool isOK = false;

	// 2. 声明静态字段，存储我们唯一的对象实例
	// 不使用 readonly
	// 不直接 new
	// 不使用静态类的原因：
	//     - Form类不能静态
	//     - 静态类要求所有字段都有值(会出现饿汉式同款问题)
    // 使用 volatile 做易失性标记
	private volatile static LazySingle lazy;

	// 创建静态私有的 object 字段，用于加互斥锁
	private static readonly object lockObj = new object();	

	// 3. 通过方法创建对象并返回
	public static LazySingle GetLazySingle()
	{   
        // 如果 lazy 未绑定实例，当前线程进入并加锁
        // 双重锁定检查（节约资源）:
        //   在首个单例创建完成后，其他线程访问下面锁定块时就无需访问锁
		if (lazy == null)
		{	
            // lock : c#提供的一个语法糖，提供互斥锁来解决多线程的安全问题
            // 实际调用方法: Monitor.Enter() 、 Monitor.Exit() 
			lock(lockObj)
			{   // 对互斥锁的等待线程中所有线程，同样需要判断一次是否为空
                if(lazy == null)
                {   
                    // new : 开辟空间 -> 构造实例 -> 绑定非null实例
                    // 可能会出现指令重排: 开辟空间 -> 绑定未知地址实例 -> 构造实例
                    // 对 lazy 加上 volatile 关键字标识避免指令重排优化
                    lazy = new LazySingle();
                    // Console.WriteLine("创建一个新实例");
                }
			}
		}
		return lazy;
		// 也可以使用null合并运算符写成:
		//return lazy ?? new LazeSingle();
	}
}
```

## 补充与追加：
- 参考：
	- [ZShijun/单例模式](/ProjectDocs/cs/DesignPattern/ZShijun-DoNetDP/4.%20单例模式.md)
	- [C#关于单例模式的一切：概念 声明 懒加载 线程安全 现代用法 经典误区](https://www.bilibili.com/video/BV1wT421r7Ds/?)
