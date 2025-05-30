## 介绍
- 策略模式：
    - 针对一组算法，将每个算法封装到具有公共接口的独立的类中，从而使它们可以相互替换。
    - 策略模式使得算法可以在不影响到客户端的情况下发生变化。

- 面对问题：
    - 在现实生活中，策略模式的例子也非常常见，例如，中国的所得税:
        - 企业所得税
        - 外商投资企业或外商企业所得税
        - 个人所得税
    - 针对于这3种所得税，针对每种，所计算的方式不同，个人所得税有个人所得税的计算方式，而企业所得税有其对应计算方式。
    - 如果不采用策略模式来实现这样一个需求的话:
        - 可能我们会定义一个所得税类
            - 该类有一个属性来标识所得税的类型
            - 有一个计算税收的 `CalculateTax()` 方法，在该方法体内需要对税收类型进行判断，通过 `if-else` 语句来针对不同的税收类型来计算其所得税。
        - 这样的实现确实可以解决这个场景，但是这样的设计不利于扩展
            - 如果系统后期需要增加一种所得税时，此时不得不回去修改 `CalculateTax` 方法来多添加一个判断语句，这样明白违背了“开放——封闭”原则。
    - 此时，我们可以考虑使用策略模式来解决这个问题，既然税收方法是这个场景中的变化部分，此时自然可以想到对税收方法进行抽象。

- 使用场景
    - 一个系统需要动态地在几种算法中选择一种的情况下。那么这些算法可以包装到一个个具体的算法类里面，并为这些具体的算法类提供一个统一的接口。
    - 如果一个对象有很多的行为，如果不使用合适的模式，这些行为就只好使用多重的if-else语句来实现，此时，可以使用策略模式，把这些行为转移到相应的具体策略类里面，就可以避免使用难以维护的多重条件选择语句，并体现面向对象涉及的概念。


## 例子
```cs
void Invoke_Strategy(string[] args)
{
    // 个人所得税方式
    InterestOperation operation = new InterestOperation(new PersonalTaxStrategy());
    Console.WriteLine("个人支付的税为：{0}", operation.GetTax(5000.00));

    // 企业所得税
    operation = new InterestOperation(new EnterpriseTaxStrategy());
    Console.WriteLine("企业支付的税为：{0}", operation.GetTax(50000.00));

    Console.Read();
}


// Strategy 抽象策略类：所得税计算策略
public interface ITaxStragety
{
    double CalculateTax(double income);
}

// 操作类/环境角色/Context
public class InterestOperation
{
    // 持有策略类引用
    private ITaxStragety m_strategy;

    // 在构造时注入具体的策略
    public InterestOperation(ITaxStragety strategy)
    {
        this.m_strategy = strategy;
    }

    // 调用策略中的方法
    public double GetTax(double income)
    {
        return m_strategy.CalculateTax(income);
    }
}

#region ConcreteStrategy 具体策略类
// 个人所得税
public class PersonalTaxStrategy : ITaxStragety
{
    public double CalculateTax(double income)
    {
        return income * 0.12;
    }
}

// 企业所得税
public class EnterpriseTaxStrategy : ITaxStragety
{
    public double CalculateTax(double income)
    {
        return (income - 3500) > 0 ? (income - 3500) * 0.045 : 0.0;
    }
}
#endregion
```


## 总结
- 是对算法的包装，是把使用算法的责任和算法本身分割开，委派给不同的对象负责。
- 通常把一系列的算法包装到一系列的策略类里面。

![](../image/Strategy.png)

1. 环境角色（`Context`）：
    - 持有一个 `Strategy` 类的引用
2. 抽象策略角色（`Strategy`）：
    - 这是一个抽象角色，通常由一个接口或抽象类来实现。
    - 此角色给出所有具体策略类所需实现的接口。
3. 具体策略角色（`ConcreteStrategy`）：
    - 包装了相关算法或行为。

- 优点：
    1. 策略类之间可以自由切换。由于策略类都实现同一个接口，所以使它们之间可以自由切换。
    2. 易于扩展。增加一个新的策略只需要添加一个具体的策略类即可，基本不需要改变原有的代码。
    3. 避免使用多重条件选择语句，充分体现面向对象设计思想。
- 缺点：
    - 客户端必须知道所有的策略类，并自行决定使用哪一个策略类。
        - 这点可以考虑使用IOC容器和依赖注入的方式来解决
        - 关于IOC容器和依赖注入（Dependency Inject）的文章可以参考：[IoC 容器和Dependency Injection 模式](http://www.cnblogs.com/lusd/articles/3175062.html)。
    - 策略模式会造成很多的策略类。
