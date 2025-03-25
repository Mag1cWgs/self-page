## 介绍
- 是合成复用原则的具体落地
    - 将已有的对象纳入到新对象中，作为新对象的对象成员来实现的
    - 新对象可以调用已有对象的功能，从而达到复用。
- 将抽象部分与它的实现部分分离，使他们都可以独立的变化。
    - 抽象：目标对象（车）
    - 实现：各种属性维度（颜色、动力方式）

<div><img src="/ProjectDocs/cs/DesignPattern/image/Bridge.png"></div>

## 例子
```cs
void Invoke_Bridge()
{
    Car bmw = new BMW();
    bmw.Move(new Red());

    Car benz = new Benz();
    benz.Move(new White());
}

// “实现”
public interface IColor
{
    string GetColor();
}

public class Red : IColor
{
    public string GetColor()
    {
        return "Red";
    }
}
public class White : IColor
{
    public string GetColor()
    {
        return "White";
    }
}
public class Black : IColor
{
    public string GetColor()
    {
        return "Black";
    }
}


// “抽象”
// 通常会有需要子类继承的成员，需要使用抽象类
// 对 Color 的引用方法
//     1. 添加 _color 字段，在构造函数初始化
//     2. 在调用函数中添加 IColor 参数
public abstract class Car
{
    public abstract void Move(IColor color);
}

public class BMW : Car
{
    public override void Move(IColor color)
    {
        Console.WriteLine(color.GetColor()+ "色的 BMW 在行驶");
    }
}

public class Benz : Car
{
    public override void Move(IColor color)
    {
        Console.WriteLine(color.GetColor() + "色的 Benz 在行驶");
    }
}
```

## 总结
- 桥接设计模式优点:
    1. 桥接模式，相对于静态的继承而言，极大的减少了子类的个数，从而降低管理和维护成本。
    2. 桥接模式提高了系统的可扩展性，在两个变化唯独中任意扩展一个维度，都不需要修改原有系统，符合开闭原则。就像一座桥，把两个变化的维度连接了起来。
- 桥接设计模式缺点:
    1. 桥接模式的引入会增加系统的理解与设计难度，由于组合/聚合关系建立在抽象层，要求开发者针对抽象进行设计与编程。
    2. 桥接模式要求正确的识别出系统中两个独立变化的维度，引起对开发者的编程思想有较高的要求。

