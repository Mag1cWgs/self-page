## 介绍
- 某个请求需要多个对象进行处理，从而避免请求的发送者和接收之间的耦合关系。
- 将这些对象连成一条链子，并沿着这条链子传递该请求，直到有对象处理它为止。

- 在以下场景中可以考虑使用责任链模式：
    - 一个系统的审批需要多个对象才能完成处理的情况下，例如请假系统等。
    - 代码中存在多个 if-else 语句的情况下，此时可以考虑使用责任链模式来对代码进行重构。


## 例子
- 公司规定:
    - 采购架构总价在1万之内，经理级别的人批准即可
    - 总价大于1万小于2万5的则还需要副总进行批准
    - 总价大于2万5小于10万的需要还需要总经理批准
    - 而大于总价大于10万的则需要组织一个会议进行讨论

```cs
void Invoke_Chain_Of_Responsibility()
{
    PurchaseRequest requestTelphone = new PurchaseRequest(4000.0, "Telphone");
    PurchaseRequest requestSoftware = new PurchaseRequest(10000.0, "Visual Studio");
    PurchaseRequest requestComputers = new PurchaseRequest(40000.0, "Computers");

    Approver manager = new Manager("LearningHard");
    Approver Vp = new VicePresident("Tony");
    Approver Pre = new President("BossTom");

    // 设置责任链
    manager.NextApprover = Vp;
    Vp.NextApprover = Pre;

    // 处理请求
    manager.ProcessRequest(requestTelphone);
    manager.ProcessRequest(requestSoftware);
    manager.ProcessRequest(requestComputers);
    Console.ReadLine();
}



// 采购请求
public class PurchaseRequest
{
    // 金额
    public double Amount { get; set; }
    // 产品名字
    public string ProductName { get; set; }
    public PurchaseRequest(double amount, string productName)
    {
        Amount = amount;
        ProductName = productName;
    }
}



// 审批人,Handler
public abstract class Approver
{
    public Approver NextApprover { get; set; }
    public string Name { get; set; }
    public Approver(string name)
    {
        this.Name = name;
    }
    public abstract void ProcessRequest(PurchaseRequest request);
}


#region 具体 Handler
// ConcreteHandler
public class Manager : Approver
{
    public Manager(string name)
        : base(name)    { }

    public override void ProcessRequest(PurchaseRequest request)
    {
        if (request.Amount < 10000.0)
        {
            Console.WriteLine("{0} - {1} 批准了购买 {2} 的请求", this, Name, request.ProductName);
        }
        else if (NextApprover != null)
        {
            NextApprover.ProcessRequest(request);
        }
    }
}


// ConcreteHandler,副总
public class VicePresident : Approver
{
    public VicePresident(string name)
        : base(name) { }

    public override void ProcessRequest(PurchaseRequest request)
    {
        if (request.Amount < 25000.0)
        {
            Console.WriteLine("{0} - {1}批准了购买 {2} 的请求", this, Name, request.ProductName);
        }
        else if (NextApprover != null)
        {
            NextApprover.ProcessRequest(request);
        }
    }
}

// ConcreteHandler，总经理
public class President : Approver
{
    public President(string name)
        : base(name) { }


    public override void ProcessRequest(PurchaseRequest request)
    {
        if (request.Amount < 100000.0)
        {
            Console.WriteLine("{0} - {1} 批准了购买 {2} 的请求", this, Name, request.ProductName);
        }
        else
        {
            Console.WriteLine("Request需要组织一个会议讨论");
        }
    }
}
#endregion
```


## 总结
![](../image/ChainOfResponsibility.png)

1. 抽象处理者角色（Handler）：
    - 定义出一个处理请求的接口。
    - 这个接口通常由接口或抽象类来实现。
2. 具体处理者角色（ConcreteHandler）：
    - 具体处理者接受到请求后，可以选择将该请求处理掉，或者将请求传给下一个处理者。
    - 每个具体处理者需要保存下一个处理者的引用，以便把请求传递下去。

- 优点：
    1. 降低了请求的发送者和接收者之间的耦合。
    2. 把多个条件判定分散到各个处理类中，使得代码更加清晰，责任更加明确
- 缺点:
    1. 在找到正确的处理对象之前，所有的条件判定都要执行一遍，当责任链过长时，可能会引起性能的问题，在进行代码调试时不太方便；可能会造成循环调用。
    2. 不能保证请求一定被接收。既然一个请求没有明确的接收者，那么就不能保证它一定会被处理 —该请求可能一直到链的末端都得不到处理。一个请求也可能因该链没有被正确配置而得不到处理。
