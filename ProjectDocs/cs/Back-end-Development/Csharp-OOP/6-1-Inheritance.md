## 继承和接口设计
> 与 C++ 不同， C# 不支持类的多继承（从多个类派生为一个类）
> 但是支持从多个接口继承为同一个接口

> [!note]
> OOP 的核心思想  
> 封装（Encapsulation）  
> 继承（Inheritance）  
> 多态（Polymorphism）  



---



## 6.1 继承
- 继承允许创建分等级层次的类，运用继承可以构造通用类，定义一系列相关项目中的一般特性。
- 类间并非孤立存在，通常具有相关性



---



### 6.1.1 什么是继承

1. 介绍
    - 继承是 OOP 技术中的概念
        - 如果类 `B` 是由类 `A` 继承而来，则 `B` 拥有 `A` 的所有成员。
        - 称 `B` 为 `A` 的**派生类 / 子类**
        - 称 `A` 为 `B` 的**父类**
    - 父类是子类的一般化，子类是父类的特化
2. 重要性
    - 简化描述、方便体现层次关系
    - 简化复用性
    - 提供增量开发功能
    - 增强了一致性，减少模块间接口和页面，增加易维护性
3. 特点
    - 同宗：所有类派生自 object 类，不说明基类的隐式直接派生自 object 类， objcet 是唯一的非派生类
    - 单亲：单继承性，一个派生类只有一个基类
    - 传承：继承可以传递，如果类 `C` 派生自 `B` ，而 `B` 又派生于 `A` ，则其继承了 `B` 和 `A` 的一切成员。
    - 扩充：每个派生类都可以增加新成员，但不能删除基类成员
    - 可以改写（隐藏）成员，使之只能用 `base.基类方法名` 访问



---



### 6.1.2 派生类的声明
1. **格式**：  
    - 在声明基类后，其派生类的声明格式如下：  
    ```cs
    [类修饰符] class 派生类名: 基类名
    {
        // 派生类的代码
    }
    ```
    - C# 中的派生类可以从他的基类中继承字段、属性、方法、事件、索引器等
        - 实际除了基类的构造函数和析构函数之外的所有成员都被隐式继承

2. **示例**：  
    - 首先声明基类 `BaseExample` ：  
    ```cs
    class BaseExample
    // 等同于 class BaseExample : Object
    {
        protected int m;    // 保护字段 m 无法在外部访问
        private int n;      // 私有字段 n 不会被继承
        public int k;       // 公开字段 k
        public void FunDefault()   // 公开方法 FunDefault()
        {
            Console.WriteLine("这个方法来自于 {0} 类！", this.GetType());
        }
    }
    ```

    - 再声明一个子类 `ChildExampled_1` ：  
    ```cs
    class ChildExample_1 : BaseExample
    {
        private int p;  // 私有字段
        public void FunInheritance()    // 公开方法 FunInheritance()
        {
            Console.WriteLine("这个方法来自于 {0} 类！", this.GetType());
        }
    }
    ```

    - 此时有子类 `ChildExampled_1` 继承了基类 `BaseExample` ，可以在主程序中调用：
    ```cs
    static void Main(String[] args)
    {
        Console.WriteLine("基类 BaseExample：");
        BaseExample exBase = new BaseExample();
        // Console.WriteLine(exBase.m); // 保护字段无法外部访问
        // Console.WriteLine(exBase.n); // 私有字段无法外部访问
        Console.WriteLine(exBase.k);    // 公开字段
        exBase.FunDefault();            // 公开方法

        Console.WriteLine("子类 ChildExample_1：");
        ChildExample_1 exChild1 = new ChildExample_1();
        Console.WriteLine(exChild1.k);      // 公开字段，继承自父类 BaseExample
        // Console.WriteLine(exChild1.m);   // 继承自父类，保护属性无法外部访问
        // Console.WriteLine(exChild1.p);   // 私有属性无法外部访问
        exChild1.FunDefault();              // 公开方法，继承自父类
        exChild1.FunInheritance();          // 公开方法
    }    
    ```
    则会输出
    ```shell
        基类 BaseExample：
        0
        这个方法来自于 c_sharp_learning.BaseExample 类！
        子类 ChildExample：
        0
        这个方法来自于 c_sharp_learning.ChildExample_1 类！
        这个方法来自于 c_sharp_learning.ChildExample_1 类！
    ```



---



### 6.1.3 基类成员的可访问性
> [!note|label:回顾]
> - public 对所有类可见
> - protected 仅对派生类可见
> - private 仅在类内可见

- 派生类将获取基类的所有非私有数据和行为。
    - 在上例中基类  `BaseExample` 声明了以下成员：
        - 保护字段 `protected int m;` 
        - 私有字段 `private int n; ` 
        - 公共字段 `public int k;       // 公开字段 k`
        - 公开方法 `public void FunDefault`
    - 子类 `ChildExampled_1` 实际由以下成员构成：
        - 公开字段 `public int k;`
            - 从基类中继承
        - 保护字段 `protected int m;`
            - 从基类中继承
        - 私有字段 `private int k;`
        - 公开方法 `public void FunDefault`
            - 从基类中继承
        - 公开方法 `public void FunInheritance` 
- 如果希望在派生类中屏蔽（或隐藏）某些基类的成员：
    - 可以在基类中将这些成员设置为 `private` 访问成员；
    - 也可以用于基类成员名称相同的成员实现屏蔽基类成员。



---



### 6.1.4 按次序调用构造函数和析构函数

#### 1. 调用默认构造函数的次序
- 默认构造函数：无参量的构造函数。
    - 使用 `base` 关键字和 `this` 关键字区分调用基类还是派生类的实例构造函数
    - 不显式指明时默认调用基类的构造函数

    > [!attention|label:注意]
    > 如果基类没有定义任何的构造函数，则会自动添加默认构造函数。  
    > 但是如果基类已经定义了有参的构造函数，则编译器不添加默认构造函数。  
    > 如果派生类调用基类默认构造函数时会报错。
    > **原则：显式声明默认构造函数！**

- 如果类是从一个基类派生而来，那么调用这个派生类的默认构造函数之前会先调用基类的默认构造函数。
    - 调用从最远的基类开始
    - 保证在调用派生类前的构造函数之前将派生类所需要继承的资源都准备好
        - 执行派生类构造函数的时候基类的所有字段均初始化完成
- 例如：构造三个类：
```cs
class BaseClass
{
    public BaseClass(){Console.WriteLine("调用基类 BaseClass 的构造函数。");}
    ~BaseClass(){Console.WriteLine("调用基类 BaseClass 的析构函数。");}
}
class FirstLevelDerivedClass
{
    public FirstLevelDerivedClass(){Console.WriteLine("调用一级派生类 FirstLevelDerivedClass 的构造函数。");}
    ~FirstLevelDerivedClass(){Console.WriteLine("调用一级派生类 FirstLevelDerivedClass 的析构函数。");}
}
class SecondaryDerivedClass
{
    public SecondaryDerivedClass(){Console.WriteLine("调用二级派生类 SecondaryDerivedClass 的构造函数。");}
    ~SecondaryDerivedClass(){Console.WriteLine("调用二级派生类 SecondaryDerivedClass 的析构函数。");}
}
```
此时有 `SecondaryDerivedClass` 派生自 `FirstLevelDerivedClass` ，
    而 `FirstLevelDerivedClass` 派生自 `BaseClass`。
在主程序中执行以下语句：
```cs
    SecondaryDerivedClass TestObj = new SecondaryDerivedClass();
```
则有执行结果：
```shell
调用基类 BaseClass 的构造函数。
调用一级派生类 FirstLevelDerivedClass 的构造函数。
调用二级派生类 SecondaryDerivedClass 的构造函数。
```

#### 2. 调用默认析构函数的次序
- 当销毁对象时，会按照相反顺序来调用析构函数
    - 首先调用派生类的析构函数，再调用最近基类的析构函数，最后逐步调用到最远的析构函数
- 同样对上例子 `已经包含了析构函数` 
    - 在主程序中执行以下语句：
    ```cs
        SecondaryDerivedClass TestObj = new SecondaryDerivedClass();
    ```
    则有执行结果：
    ```shell
    调用基类 BaseClass 的析构函数。
    调用一级派生类 FirstLevelDerivedClass 的析构函数。
    调用二级派生类 SecondaryDerivedClass 的析构函数。
    ```
    - 在创建了类 `SecondaryDerivedClass` 的实例对象 `TestObj` 后，当它结束生命周期、将要销毁时：
        - 先调用基类 `BaseClass` 的析构函数；
        - 再调用一级派生类 `FirstLevelDerivedClass` 的析构函数；
        - 最后调用二级派生类 `SecondaryDerivedClass` 的析构函数。
- 依照这种顺序， C# 能够保证任何被派生类使用的基类资源只有在派生类的销毁之后才会被释放。

#### 3. 调用基类的带参数构造函数
- 调用基类的带参数构造函数需要用到 `base` 关键字。
    - 其提供了一种简便方法，可以再子类中使用 `base` 关键字访问基类成员。
    - 调用基类的带参数构造函数的方法如下：  
        ```cs
        public 派生类名(派生类参数列表) : base(基类参数列表)
        {
            // 派生类中带参数构造函数的代码
        }
        ```
- 例：
    - 建立两个类并构成派生关系：
        ```cs
        class Person
        {
            public string Name { get; set; }
            public int Age { get; set; }

            public Person(String name, int age)
            {   
                Console.WriteLine("调用基类 Person 的构造函数。");
                Name = name;
                Age = age;
            }
            ~Person(){Console.WriteLine("调用基类 Person 的析构函数。");}
        }

        class Teacher : Person
        {
            public string Department { get; set; }

            public Teacher(String name, int age ,string department) 
                : base(name,age)
            {
                Console.WriteLine("调用子类 Teacher 的构造函数。");
                Department = department;
            }
            ~Teacher(){Console.WriteLine("调用子类 Teacher 的析构函数。");}
            }
        ```
    - 在主程序中执行以下语句：
        ```cs
        Teacher TestObj = new Teacher("NoName",20);
        ```
        则得到如下结果：
        ```shell
        调用基类 Person 的构造函数。
        调用子类 Teacher 的构造函数。
        调用子类 Teacher 的析构函数。
        调用基类 Person 的析构函数。
        ```
    - 说明调用过程中会将基类参数列表传入基类，经过构造链从最远基类开始执行构造；
        - 相应的有析构从派生到最近基类，再到最远基类。



---



### 6.1.5 用 sealed 实现禁止继承
- 在 C# 中提供了关键字 `sealed` 来禁止继承。
- 如果要禁止继承某个类，只需要在声明类之前加上 `sealed` 关键字就可以，这样的类称为**密封类**。
    - 声明形式：
        ```cs
        [其他参数] sealed class 类名
        {
            // 密封类的代码
        }
        ```
    - 实际最常见的密封类是 `String`
