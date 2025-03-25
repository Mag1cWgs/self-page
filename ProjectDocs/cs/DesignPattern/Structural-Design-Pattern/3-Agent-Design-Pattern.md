## 介绍
- 为其他对象提供一种代理，以控制对该对象的访问
<div align=center> <img src="/ProjectDocs/cs/DesignPattern/image/Agent.png"> </div>


## 代理的分类
1. 远程代理:
    - 为一个对象在不同的地址空间，提供局部代表，这样可以隐藏一个对象存在于不同地址空间的事实
    - 客户端调用Web服务，会生成WebReference文件和文件夹，WebReference就是代理，使得客户端可以实现远程访问等功能
2. 虚拟代理:
    - 如果要创建开销很大的对象，可以通过代理来存放实例化需要很长时间的真实对象。
    - 打开一个很大的网页，除了文字先出现外，图片和视频等都是慢慢出现的。
    - 查询某个部门下所有的员工的信息，姓名、性别、年龄、毕业院校、部门、照片、slogen...
3. 安全代理:
    - 用来控制真实对象的访问权限。
    - 订单系统，要求是:
        - 一旦订单被创建，只有订单的创建人才可以修改订单中的数据，其他人则不能修改
        - 也就是有一个订单对象，要控制外部对这个订单对象的访问权限，满足条件的可以访问，不满足的不可以访问。

## 例子1
- 替别人传递物品
1. 真实对象：
    - 物品传递的目标
2. 代理对象：
    - 发起代理的对象
    - 包含所有对 真实对象 的具体方法
3. 代理类：
    - 持有 真实对象
    - 可以通过封装，隐藏内部真实对象的方法

```cs
void Invoke_Agent()
{
    // 目标 真实对象TargetPerson
    TargetPerson target = new TargetPerson() { Name = "Tom" };

    // 代理人Proxy，传入代理对象
    // 代理对象RealSubject_WantToSent 中持有 真实对象真实对象TargetPerson 的引用
    ISubject proxy = new Proxy(new RealSubject_WantToSent(target));

    // 代理人 调用 代理对象 的方法
    proxy.GiveFlowers();
    proxy.GiveDrinks();
    proxy.GiveChocolate();

}

/// <summary>
/// 共用接口
/// </summary>
public interface ISubject
{
    void GiveFlowers();
    void GiveDrinks();
    void GiveChocolate();
}

/// <summary>
/// 真实对象
/// </summary>
public class TargetPerson
{
    public string Name { get; set; }
}

/// <summary>
/// 代理对象
/// </summary>
public class RealSubject_WantToSent : ISubject
{
    private TargetPerson target;

    public RealSubject_WantToSent(TargetPerson person)
    {
        this.target = person;
    }

    public void GiveFlowers()
    {
        Console.WriteLine("Give Flowers To :{0}", this.target.Name);
    }
    public void GiveDrinks()
    {
        Console.WriteLine("Give Drinks To :{0}", this.target.Name);
    }
    public void GiveChocolate()
    {
        Console.WriteLine("Give Chocolate To :{0}", this.target.Name);
    }

}


/// <summary>
/// 代理类
/// </summary>
public class Proxy : ISubject
{
    // 代理类中持有一个真实对象的引用
    private RealSubject_WantToSent _realSubject;

    public Proxy(RealSubject_WantToSent realSubject)
    {
        this._realSubject = realSubject;
    }

    public void GiveFlowers()
    {
        this._realSubject.GiveFlowers();
    }

    public void GiveDrinks()
    {
        this._realSubject.GiveDrinks();
    }

    public void GiveChocolate()
    {
        this._realSubject.GiveChocolate();
    }
}
```

## 例子2
```cs
// 订单系统，要求:
// 一旦订单被创建，只有订单的创建人才可以修改订单中的数据，其他人则不能修改
void Invoke_Agent()
{
    IOrder order = new ProxyOrder(new RealOrder("Apple", 10, "Tom"));
    // 成功操作
    order.SetOrderProductCount(20, "Tom");
    // 权限不足
    order.SetOrderProductCount(30, "Jerry");
}


// 钉单
// 订单产品名称、订单产品数量、订单创建用户
/// <summary>
/// 封装了实体对象和代理对象的共用接口
/// </summary>
public interface IOrder
{
    // 获取订单中产品名称
    public string GetProductName();

    /// <summary>
    /// 设置订单中产品名称
    /// </summary>
    /// <param name="productNameame">订单中的产品名</param>
    /// <param name="user">操作人</param>
    void SetProductName(string productNameame, string user);

    // 获取订单中产品数量
    int GetOrderProductCount();

    /// <summary>
    /// 设置订单中产品数量
    /// </summary>
    /// <param name="orderNumber">产品数量</param>
    /// <param name="user">操作人</param>
    void SetOrderProductCount(int orderNumber, string user);

    // 获取订单创建用户
    string GetOrderUser();

    /// <summary>
    /// 设置订单创建用户
    /// </summary>
    /// <param name="orderUser">创建订单的用户名</param>
    /// <param name="user">操作人</param>
    void SetOrderUser(string orderUser, string user);
}


/// <summary>
/// 真正的订单对象
/// </summary>
public class RealOrder : IOrder
{
    // 具体订单的属性
    public string ProductName { get; set; }
    public int ProductCount { get; set; }
    public string OrderUser { get; set; }

    // 构造函数
    public RealOrder(string productName, int productCount, string prderUser)
    {
        this.ProductName = productName;
        this.ProductCount = productCount;
        this.OrderUser = prderUser;
    }


    // 实现接口
    // 访问过程中，没有对操作人进行限定
    public string GetProductName()
    {
        return this.ProductName;
    }

    public int GetOrderProductCount()
    {
        return this.ProductCount;
    }
    public string GetOrderUser()
    {
        return this.OrderUser;
    }

    // 赋值过程中，没有对操作人进行限定
    public void SetProductName(string productNameame, string user)
    {
        this.ProductName = productNameame;
    }
    public void SetOrderProductCount(int orderNumber, string user)
    {
        this.ProductCount = orderNumber;
    }
    public void SetOrderUser(string orderUser, string user)
    {
        this.OrderUser = orderUser;

    }
}


/// <summary>
/// 代理器
/// </summary>
public class ProxyOrder : IOrder
{
    // 封装对实体对象引用
    private RealOrder _realOrder;
    public ProxyOrder(RealOrder realOrder)
    {
        this._realOrder = realOrder;
    }


    public int GetOrderProductCount()
    {
        return _realOrder.ProductCount;
    }

    public string GetOrderUser()
    {
        return _realOrder.OrderUser;
    }

    public string GetProductName()
    {
        return _realOrder.ProductName;
    }


    public void SetOrderProductCount(int orderNumber, string user)
    {
        // 判断是否是订单创建人
        // 订单创建人对应的是 传入的真实订单对象中的订单创建人属性OrderUser
        if (user != null && user.Equals(this._realOrder.OrderUser))
            this._realOrder.SetOrderProductCount(orderNumber, user);
        else
            Console.WriteLine("权限不足！无法设置！");
    }

    public void SetOrderUser(string orderUser, string user)
    {
        if (user != null && user.Equals(this._realOrder.OrderUser))
            this._realOrder.SetOrderUser(orderUser, user);
        else
            Console.WriteLine("权限不足！无法设置！");
    }

    public void SetProductName(string productNameame, string user)
    {
        if (user != null && user.Equals(this._realOrder.OrderUser))
            this._realOrder.SetProductName(productNameame, user);
        else
            Console.WriteLine("权限不足！无法设置！");
    }
}
```

## 总结
1. Subject 类：定义公用接口
2. RealSubject 类：代表真正实体对象
    - 获取代理的对象
3. Proxy 类：代理类
    - 保存对目标实体的引用，方便调用实体对象的成员方法
