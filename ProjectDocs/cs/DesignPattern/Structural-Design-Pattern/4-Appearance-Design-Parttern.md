## 介绍
- 是最简单的设计模式
- 隐藏了系统的复杂性，并向客户端提供了一个可以访问系统的统一接口
    - 这个统一接口组合了子系统的多个接口
    - 使得子系统更容易被访问和使用

## 例子
```cs
void Invoke_Appearance()
{ 
    ShiZhengDaTing szdt = new ShiZhengDaTing();
    szdt.KaiZhengMing();
}

public class ShiZhengDaTing
{
    private Police police = new Police();
    private Street street = new Street();
    private Hospital hospital = new Hospital();

    public void KaiZhengMing()
    {
        this.police.GetHuJi();
        this.street.GetHuKou();
        this.hospital.GetBorn();
    }
}

public class Police
{
    public void GetHuJi()
    {
        Console.WriteLine("开具户籍证明");
    }
}

public class Street
{
    public void GetHuKou()
    {
        Console.WriteLine("开具户口证明");
    }
}

public class Hospital
{
    public void GetBorn()
    {
        Console.WriteLine("开具出生证明");
    }
}
```

## 总结
- 外观模式优点:
    1. 隐藏了系统的复杂性，让客户端使用系统功能时变得简单
    2. 实现客户端和子系统间的解耦
- 外观模式缺点:
    1. 不符合开闭原则，如果客户端需要使用更多功能，不仅仅需要修改子系统，也必须修改外观层
