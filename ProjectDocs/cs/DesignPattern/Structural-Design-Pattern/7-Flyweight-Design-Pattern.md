## 介绍
- 运用共享技术有效的支持大量细粒度的对象
- 对共享元素的有效利用，避免去创建大量重复的对象
    - 避免不了大量对象，但是可以避免大量的重复对象
- 面对场景：
    - 当系统中大量使用某些相同或者相似的对象，这些对象会消耗大量的资源
    - 并且这些对象剔除外部状态后可以通过同一个对象来替代
    - 这时，我们可以使用享元设计模式来解决，

>[!note|label:与单例模式区别]
> 1. 享元模式有多个对象，单例模式只能有一个对象
> 2. 享元模式更关注「剔除外部状态」
>       - 内部状态：对象内部不受环境改变的部分作为内部状态，
>       - 外部状态：随着环境的变化而变化的部分
> 3. 享元模式比起单例模式提供了「池化」这一概念
>       - 池技术：字符串拘留池、数据库连接池、线程池等

## 例子
```cs
void Invoke_Flyweight()
{
    Factory_FlyWeight factory = new Factory_FlyWeight();
    Bike_Abstract_FlyWeight bike1 = factory.GetBike();
    Bike_Abstract_FlyWeight bike2 = factory.GetBike();
    Bike_Abstract_FlyWeight bike3 = factory.GetBike();


    bike1.Ride("User1");
    bike2.Ride("User2");

    bike1.Back("User1");
    bike1.Ride("User3");

}


public abstract class Bike_Abstract_FlyWeight
{
    //内部状态:BikeID State->bool
    //外部状态:用户
    //骑行 锁定
    public string BikeID { get; set; }

    public bool State_IsUsing { get; set; }

    public abstract void Ride(string userName);

    public abstract void Back(string userName);
}


public class ConcreteBike_FlyWeight : Bike_Abstract_FlyWeight
{
    public ConcreteBike_FlyWeight(string bikeID)
    {
        this.BikeID = bikeID;
    }
    public override void Ride(string userName)
    {
        if (State_IsUsing)
            Console.WriteLine("Bike is using");
        else
        {
            State_IsUsing = true;
            Console.WriteLine("Bike is using by {0}, ID is {1}." + userName, this.BikeID);
        }
    }
    public override void Back(string userName)
    {
        if (State_IsUsing)
        {
            State_IsUsing = false;
            Console.WriteLine("Bike is BACK by {0}, ID is {1}." + userName, this.BikeID);
        }
        else
            Console.WriteLine("Bike is not using");
    }
}




public class Factory_FlyWeight
{
    // 此处使用字典存储对象，实际应用中可以使用数据库或者其他方式存储
    // 也可以使用线程安全的集合，如ConcurrentDictionary
    // 也可以 List<Bike_Abstract_FlyWeight> bikePool = new List<Bike_Abstract_FlyWeight>();
    private Dictionary<string, Bike_Abstract_FlyWeight> bikePool = new Dictionary<string, Bike_Abstract_FlyWeight>();

    //初始化对象池
    public Factory_FlyWeight()
    {
        bikePool.Add("001", new ConcreteBike_FlyWeight("001"));
        bikePool.Add("002", new ConcreteBike_FlyWeight("002"));
        bikePool.Add("003", new ConcreteBike_FlyWeight("003"));
    }

    public Bike_Abstract_FlyWeight GetBike()
    {
        foreach (var item in bikePool)
        {
            if (!item.Value.State_IsUsing)
                return item.Value;
        }
        return null;
    }
}
```

## 总结
<div align=center> <img src="/ProjectDocs/cs/DesignPattern/image/FlyWeight.png"> </div>

1. Flyweight
    - 超类/接口/抽象类
    - 通过对接口实现，可以接受并作用于外部状态
2. ConcreteFlyweight
    - 共用享元类
3. UnsharedConcreteFlyweight
    - 不共享的类
4. FlyweightFactory
    - 享元工厂，用于创建并管理享元对象
    - 主要用来确保合理的共享享元
    - 当用户请求一个享元对象时，提供一个已创建实例/创建一个新实例（没有空闲实例时）

- 优点：通过对象的复用，减少了对象的数量，节省内存。
- 缺点：需要分类对象内部和外部的状态，提高了系统的复杂度
