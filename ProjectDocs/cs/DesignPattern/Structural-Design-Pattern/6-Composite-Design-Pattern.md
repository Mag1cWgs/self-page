## 介绍
- 用于将对象组织成树形结构，以表示 部分-整体 的层次结构。
    - 你可以使用它将对象组合成树状结构，并且能像使用独立对象一样使用他们。
- 同时可以结合其它设计模式，使组合模式变得更加灵活和高效。
- 但是主要目的是实现树状结构

## 例子
- 需求：
    - 某公司开发一个 部门-人员 管理系统
    - 要求可以对部门和员工进行灵活的增加和删除
    - 可以展示部门和部门内部的员工,

```cs
void Invoke_Composite()
{

    DepartComposite root = new DepartComposite("总公司");

    DepartComposite dp1 = new DepartComposite("部门1");
    DepartComposite dp2 = new DepartComposite("部门2");


    root.Add(new Employee("总经理"));
    root.Add(new Employee("总经理秘书"));
    root.Add(dp1);
    root.Add(dp2);

    dp1.Add(new Employee("部门1经理"));
    dp1.Add(new Employee("部门1秘书"));

    dp2.Add(new Employee("部门2经理"));
    dp2.Add(new Employee("部门2秘书"));

    root.Display(1);
}



/// <summary>
/// 定义子类中共有的操作
/// </summary>
public abstract class Component
{
    public string Name { get; set; }
    public Component(string name)
    {
        this.Name = name;
    }
    public abstract void Add(Component c);

    public abstract void Remove(Component c);

    public abstract void Display(int depth);
}

/// <summary>
/// 部门类树枝
/// </summary>
public class DepartComposite : Component
{
    public DepartComposite(string name) : base(name) { }

    //存储部门或者员工
    private List<Component> listComponent = new List<Component>();

    public override void Add(Component component)
    {
        listComponent.Add(component);
    }

    public override void Remove(Component component)
    {
        listComponent.Remove(component);
    }

    public override void Display(int depth)
    {
        int numberOfNewUnderline = 2;
        Console.WriteLine(new string('_', depth) + this.Name);
        foreach (var item in listComponent)
        {
            //用到了递归的思想
            item.Display(depth+numberOfNewUnderline);
        }
    }
}


/// <summary>
///Employee是我们的Leaf节点，也就是树叶,树叶是无法继续添加子集的,
/// </summary>
public class Employee : Component
{
    public Employee(string name) : base(name)
    { }
    public override void Add(Component component)
    {
        throw new NotImplementedException();
    }
    public override void Remove(Component component)
    {
        throw new NotImplementedException();
    }
    public override void Display(int depth)
    {
        Console.WriteLine(new string('_', depth) + this.Name);
    }
}
```

## 总结
<div align=center> <img src="/ProjectDocs/cs/DesignPattern/image/Composite.png"> </div>

1. Component
    - 组合模式的根节点，可以是接口、抽象类、普通类
        - 抽象类比较常用
    - 该类定义了子类中所有共性的内容
    - 还定义了用于访问和管理子类的方法。
2. Leaf
    - 组合中的叶子节点，也就是最末端的节点
    - 该节点下，不会再有子节点
3. Composite
    - 非叶子节点，它的作用是存储子部件
    - 在 Composite 中实现了对子部件的相关操作。

- 程序需求如果有 部分-整体 的结构
    - 并且希望可以忽略单个对象和组合对象的不同
    - 统一的使用组合结构中的所有的对象。
- .Net在控件或者界面操作、界面展示等操作，都是使用的组合设计模式。
    - 比如说在winform程序开发中，`System.Windows.Forms.Control` 类(`Add`、`Remove`)就应用了组合模式。
