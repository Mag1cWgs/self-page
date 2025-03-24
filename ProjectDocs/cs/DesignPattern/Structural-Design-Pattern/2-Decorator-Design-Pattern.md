## 介绍
- 动态的给一个对象添加一些额外的职责
- 就增加功能来说，装饰模式比生成子类更为灵活

## 例子
- 有原生场景
<div align=center> <img src="/ProjectDocs/cs/DesignPattern/image/Decorator_ex1.png"> </div>

- 需求：添加新的配料
    1. 如果对所有配料+饮品都建立继承类
        1. 类爆炸
        2. 增减配料都需要更改代码，不符合开闭原则
        3. 不能添加同一份配料
    <div align=center> <img src="/ProjectDocs/cs/DesignPattern/image/Decorator_ex2.png"> </div>

    2. 回顾复合复用原则
        - 父类添加引用和使用 Set 方法
        - 子类调用 Cost 方法时需要调用父类，返回 `this.cost + base.cost`
        - 但是添加新的配料子类时，需要修改父类和所有子类
        - 而且如果父类发生错误，子类可能都会出错
        - 因为耦合性太高了
            1. 添加新配料，要改父类
            2. 加入咖啡，咖啡不应该添加配料
            3. 父类中某一配料计算发生错误，会影响所有子类
    <div align=center> <img src="/ProjectDocs/cs/DesignPattern/image/Decorator_ex3.png"> </div>

- 使用装饰器实现
    - **抽象父类** `AbstractDrink`
        1. **具体组件** `MilkTea`
            - 方法 `Cost()`
        2. **具体组件** `FruitTea`
            - 方法 `Cost()`
        3. **具体组件** `SodaTea`
            - 方法 `Cost()`
        4. **装饰器父类** `Decorater`
            - 方法 `Cost()`
            - 方法 `SetComponent(AbstractDrink)` 提供装饰链
            1. **具体装饰器** `Puting`
                - 方法 `Cost()`
            2. **具体装饰器** `XianCao`
                - 方法 `Cost()`
            3. **具体装饰器** `Zhenzhu`
                - 方法 `Cost()`

```cs
void Invoke_Decorater()
{
    // 需求：一份奶茶加两份布丁和一份珍珠

    // 准备原料/组件
    MilkTea milkTea = new MilkTea();
    Puding puding1 = new Puding();
    Puding puding2 = new Puding();
    ZhenZhu zhenZhu = new ZhenZhu();

    // 给 milkTea 添加一份布丁
    puding1.SetComponent(milkTea);
    // 给 milkTea 添加第二份一份布丁
    puding2.SetComponent(puding1);
    // 给 milkTea 添加一份珍珠
    zhenZhu.SetComponent(puding2);

    // 计算价格
    Console.WriteLine("总价格为{0}", zhenZhu.Cost());
}



/// <summary>
/// 抽象组件，所有类的父类
/// </summary>
public abstract class AbstractDrink
{
    public abstract double Cost();  
}



/// <summary>
/// 具体组件
/// </summary>
public class MilkTea : AbstractDrink
{
    public double price = 10;

    public override double Cost()
    {
        Console.WriteLine("奶茶 {0} 元一杯",this.price);
        return this.price;
    }
}

public class FruitTea : AbstractDrink
{
    public double price = 20;

    public override double Cost()
    {
        Console.WriteLine("水果茶 {0} 元一杯", this.price);
        return this.price;
    }
}

public class SodaTea : AbstractDrink
{
    public double price = 30;

    public override double Cost()
    {
        Console.WriteLine("苏打茶 {0} 元一杯", this.price);
        return this.price;
    }
}



/// <summary>
/// 装饰器父类
/// </summary>
public abstract class Decorater : AbstractDrink
{
    // 添加父类的引用
    private AbstractDrink drink;

    // 通过SetComponent方法设置父类的引用赋值
    public void SetComponent(AbstractDrink abstractDrink)
    {
        this.drink = abstractDrink;
    }

    // 重写父类的方法
    public override double Cost()
    {
        if (drink != null)
        {
            return drink.Cost();
        }
        return 0;
    }
}



/// <summary>
/// 具体装饰器
/// </summary>
public class Puding : Decorater
{
    private static double PudingPrice = 5;

    public override double Cost()
    {
        Console.WriteLine("布丁 {0} 元一份", PudingPrice);
        // 先调用父类的方法，再调用自己的方法
        // 递归调用，直到没有父类为止。
        // 计算层层叠加后的 Price
        return base.Cost() + PudingPrice;
    }
}

public class XianCao : Decorater
{
    private static double XianCaoPrice = 6;

    public override double Cost()
    {
        Console.WriteLine("布丁 {0} 元一份", XianCaoPrice);
        return base.Cost() + XianCaoPrice;
    }
}

public class ZhenZhu : Decorater
{
    private static double ZhenZhuPrice = 7;

    public override double Cost()
    {
        Console.WriteLine("布丁 {0} 元一份", ZhenZhuPrice);
        return base.Cost() + ZhenZhuPrice;
    }
}
```

## 总结
<div align=center> <img src="/ProjectDocs/cs/DesignPattern/image/Decorator.png"> </div>

1. Component / 抽象组件（顶级父类）
2. ConcreteComponent / 具体组件（各种实现类，需要添加额外附加的类）
3. Decorator / 装饰器（附加类的父类，同样继承顶级父类）
4. ConcreteDecorater / 具体装饰器（各种实现类，包含各种额外附加功能）

- 有效的把类的核心职责和装饰功能分来解耦了
