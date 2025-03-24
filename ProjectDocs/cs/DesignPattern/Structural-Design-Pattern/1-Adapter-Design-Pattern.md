## 介绍

### 面对场景
- 在软件系统中，我们经常会需要将一些现成的对象放到新的环境中进行使用。
- 但是新的环境要求的接口，是这些现存对象所不能满足的。
- 如何能利用现有的对象，又能满足新的引用环境所需要的接口？

### 效用 / 结构
- 适配器模式：将一个类的接口，转换成客户希望的另外一个接口。
- 适配器模式使得原本由于接口不兼容而不能一起工作的那些类可以一起工作。

<div align = center><img src="/ProjectDocs/cs/DesignPattern/image/Adapter.png"></div>

1. Adaptee : 初始角色
    - 实现了我们想要的功能
    - 但是接口不匹配
2. Target : 目标角色
    - 定义了用户希望的的接口
3. Adapter : 适配器角色
    - 实现了目标接口
    - 实现的方法是内部包含了一个Adaptee对象
        - 通过调用Adaptee对象原有的方法实现功能。

## 例子
- `Android` 充电 → `IPhone` 充电

<div align = center><img src="/ProjectDocs/cs/DesignPattern/image/Adapter_Example.png"></div>

```cs
// 客户端调用
void Invoke_Adapter()
{
    IPhoneCharge iPhoneCharge = new PhoneChargeAdapter();
    iPhoneCharge.ChargePhone();
}

/// <summary>
/// Adaptee 原生对象
/// </summary>
public class AndroidChargeAdaptee
{
    public void AndroidCharge()
    {
        Console.WriteLine("Android 手机充电");
    }
}

/// <summary>
/// Target 目标接口
/// </summary>
public interface IPhoneCharge
{
    void ChargePhone();
}

/// <summary>
/// Adapter 适配器 / 转接口
/// </summary>
public class PhoneChargeAdapter : IPhoneCharge
{
    // 适配器中持有原生对象，在 Adapter 中封装了原生对象
    private AndroidChargeAdaptee androidChargeAdaptee = new AndroidChargeAdaptee();

    // 适配器中实现目标接口，调用原生对象的方法
    public void ChargePhone()
    {
        androidChargeAdaptee.AndroidCharge();
    }
}
```

## 总结
1. 适配器优点:
    - 更好的复用性。
    - 如果功能已经存在，只是接口不兼容，通过适配器模式就可以让这些功能得到更好的复用。
2. 适配器缺点:
    - 由于 Adapter 的存在，会提升系统的复杂度
>[!tip]
> 系统复杂度提升是整个结构型设计模式的缺点。（不独有）
