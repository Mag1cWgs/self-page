## 介绍
- 在我们软件开发中，有时会面临着“一个复杂对象”的创建工作，通常由各个部分的子对象用一定的算法构成
    - 子部件较多，没有恰当赋值之前，对象不能当做一个完整的对象或者产品使用
        - 邮件:发件人、收件人、抄送人、主题、内容等
    - 子部件需要按照一定顺序赋值才有意义
        - 在某个子部件没有赋值之前，另一个子部件就无法赋值
        - 改水电 -> 瓷砖 -> 家电/电视墙
- 由于需求的变化，这个复杂对象的各个部分也经常面临着剧烈的变化，但是将他们组合到一起却相对的稳定。

## 实例：组装电脑

### 不使用设计模式
- 流程
    1. 学习基础电脑知识
    2. 了解各个组件价格配置性价比
    3. 如何组装他们
    4. 如何安装操作系统
- 问题:
    - 浪费时间和精力(所有内容全部由客户自己搞定)
    - 创建对象和客户端强耦合
        - 需要解耦「创建对象」/「客户端」

```cs
public void Invoke_Beginner()
{
    Computer computer = new Computer();
    computer.AddPart("CPU");
    computer.AddPart("主板");
    computer.AddPart("16g 内存");
    computer.AddPart("SSD");
    computer.AddPart("显卡");
    computer.AddPart("电源");
    computer.AddPart("机箱");
    computer.ShowPart();
}

public class Computer
{
    private List<string> parts = new List<string>();

    public void AddPart(string part)
    {
        parts.Add(part);
    }

    public void ShowPart()
    {
        Console.WriteLine("Computer parts:");
        foreach (var item in parts)
        {
            Console.WriteLine(item);
        }
    }
}
```

### 建造者设计模式
```cs
void Invoke_Builder()
{
    // 要求 director 按照一定的顺序/过程创建产品
    Director director = new Director();
    // 创建两个不同的产品的建造者
    IBuilderComputer goodComputerBuilder = new GoodComputerBuilder();
    IBuilderComputer badComputerBuilder = new BadComputerBuilder();

    // 调用 Director.Construct() 方法创建商品
    director.Construct(goodComputerBuilder);
    // 通过 IBuilderComputer.GetComputer() 方法获取产品
    Computer computer1 = goodComputerBuilder.GetComputer();
    computer1.ShowPart();

    director.Construct(badComputerBuilder);
    Computer computer2 = badComputerBuilder.GetComputer();
    computer2.ShowPart();
}


/// <summary>
/// 抽象建造者
/// 1. 封装创建各个部件的过程
/// 2. 将创建好的复杂对象返回
/// </summary>
public interface IBuilderComputer
{
    void BuildPartCPU();
    void BuildPartMainBoard();
    void BuildPartMemory();
    void BuildPartOS();
    Computer GetComputer();
}


/// <summary>
/// 具体建造者
/// </summary>
public class GoodComputerBuilder : IBuilderComputer
{
    Computer computer = new Computer();
    public void BuildPartCPU()
    {
        computer.AddPart("CPU: I9-14900K");
    }
    public void BuildPartMainBoard()
    {
        computer.AddPart("MainBoard: Z790");
    }
    public void BuildPartMemory()
    {
        computer.AddPart("Memory: 128G-DDR5");
    }
    public void BuildPartOS()
    {
        computer.AddPart("OS: Windows-11");
    }
    public Computer GetComputer()
    {
        return this.computer;
    }
}

/// <summary>
/// 具体建造者
/// </summary>
public class BadComputerBuilder : IBuilderComputer
{
    Computer computer = new Computer();
    public void BuildPartCPU()
    {
        computer.AddPart("CPU: I3-8100");
    }
    public void BuildPartMainBoard()
    {
        computer.AddPart("MainBoard: H210");
    }
    public void BuildPartMemory()
    {
        computer.AddPart("Memory: 8G-DDR4");
    }
    public void BuildPartOS()
    {
        computer.AddPart("OS: Windows-10");
    }
    public Computer GetComputer()
    {
        return this.computer;
    }
}



/// <summary>
/// 具体产品
/// </summary>
public class Computer
{
    private List<string> parts = new List<string>();

    public void AddPart(string part)
    {
        parts.Add(part);
    }

    public void ShowPart()
    {
        Console.WriteLine("Computer parts:");
        foreach (var item in parts)
        {
            Console.WriteLine(item);
        }
    }
}


/// <summary>
/// 指挥者：
///     决定稳定创建各个 部件/产品 的 顺序/过程，
///     不由 IBuilderComputer 实现类来决定
/// </summary>
public class Director
{
    public void Construct(IBuilderComputer builder)
    {
        builder.BuildPartCPU();
        builder.BuildPartMainBoard();
        builder.BuildPartMemory();
        builder.BuildPartOS();
    }
}
```

## 总结
- 是将一个复杂对象的构建和它的表示分离的设计模式
- 使得同样的构建过程，可以创建不同的表示

1. AbstractBuilder / 抽象建造者
    - 为创建一个产品对象的各个部件指定抽象接口，
    - 在该接口或者抽象类中，一般提供两种方法，
        1. 各个组件的创建方法，
        2. 对象返回方法
    - 用于将构建完成的对象返回
2. ConcreteBuilder / 具体建造者
    - 具体建造者实现或者继承抽象建造者
    - 实现各个组件的创建方法和对象方法的方法。
3. Product / 具体产品
    - 被构建的复杂对象
    - 包含多个组件。
4. Director / 指挥者
    - 指挥者负责安排复杂对象的建造顺序

<div align = center> <img src="/ProjectDocs/cs/DesignPattern/image/Builder.png"> </div>

