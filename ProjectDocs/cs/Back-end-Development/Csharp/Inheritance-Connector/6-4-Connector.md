## 6.4 接口
- 接口只包含方法、委托或事件的**签名**，方法的实现是在**实现接口的类**中完成的。
- 在 C# 中不允许多继承(一个类有多个基类)，但通过接口可以实现 C++ 中多继承的功能。


---



### 6.4.1 接口的特性
- 接口是类之间交互内容的一个抽象:
    - 把类之间需要交互的内容抽象出来定义成接口，
    - 可以更好地控制类之间的逻辑交互。
- 接口具有下列特性:
    - 接口类似于抽象基类：
        - 继承接口的任何非抽象类型必须实现接口的所有成员；
        - 不能直接实例化接口。
    - 接口可以包含事件、索引器、方法和属性。
        - 接口不包含方法的实现。
        - 接口不能定义字段、构造函数、常量和委托。
    - 多继承性：
        - 类和结构可从多个接口继承。
        - 接口自身可从多个接口继承。
- 接口和抽象类在定义和功能上有很多相似的地方,但两者也存在着差异。
    - 接口最适合为不相关的类提供通用功能，通常在设计小而简练的功能块时使用接口。
- 接口与抽象类异同：
    - 相同：
        - 不能实例化
        - 包含未实现方法
        - 子类必须都实现所有未实现方法
    - 不同：
        - 接口：
            - 关键字 `interface`
            - 子类可以实现多个接口
            - 接口中直接给出方法头
            - 直接实现方法
        - 抽象类
            - 关键字 `abstract`
            - 子类只能单继承
            - 使用 `abstract` 声明方法头
            - 使用 `override` 实现方法



---



### 6.4.2 接口的定义

#### 1. 声明接口
- 接口的声明属于一个类型说明，其一般语法格式如下:
    ```cs
    [接口修饰符] interface 接口名 [:父接口列表]
    //接口成员定义体
    ```
- 其中,接口修饰符可以是 `new` 、`public` 、`protected` 、`internal` 和 `private` 。
    - new修饰符是在嵌套接口中唯一被允许存在的修饰符，表示用相同的名称隐藏一个继承的成员。

#### 2. 继承接口
- 接口可以从零个或多个接口中继承。
    - 当一个接口从多个接口中继承时，使用“:”后跟被继承的接口名称的形式；
    - 多个接口之间用“,”号分隔。
- 被继承的接口应该是可以被访问的，即不能从 `internal` 或 `protected` 类型的接口继承。
- 对一个接口继承也就继承了接口的所有成员。
    - 例如，以下先声明了接口 `Ia`和 `Ib` ，另一个接口 `Ic` 是从它们派生的:
    ```cs
    public interface Ia
    {
        //接口a的声明
        void mymethod1();
    }
    public interface Ib
    {
        //接口Ib的声明
        int mymethod2(int x):
    }
    public interface Ic :Ia,Ib
    {
        //接口Ic从a和b中继承
    }
    ```
    这样，接口 `Ic` 中包含了从 `Ia` 和 `Ib` 中继承而来的 `mymethodl` 和 `mymethod2` 方法。



---



### 6.4.3 接口的成员
- 接口可以声明零个或多个成员。
- 一个接口的成员不止包括自身声明的成员，还包括从父接口继承的成员。
- 所有接口成员默认是公有的，在接口成员声明中包含任何修饰符都是错误的。

#### 1. 接口方法成员
- 声明接口的方法成员的语法格式如下:
    ```cs
    返回类型 方法名([参数表]);
    ```

#### 2. 接口属性成员
- 声明接口的属性成员的语法格式如下:
    ```cs
    返回类型 属性名{ [get;] [set;] };
    ```
- 例如
    - 声明一个接口 `Ia` 
        - 接口属性 `x` 为只读的
        -  `y` 为可读可写的
        -  `z` 为只写的：
    - 代码如下：
    ```cs
    public interface Ia
    {
        int x{ get; }
        int y{ get; set; }
        int z{ set; }
    }
    ```

#### 3. 接口索引器成员
- 声明接口的索引器成员的语法格式如下:
    ```cs
    数据类型 this[索引参数表] { [get;] [set;] };
    ```

- 例如
    - 声明一个接口 `Ia`
        - 其包含一个接口索引器成员
    - 代码如下：
    ```cs
    public interface Ia
    {
        string this[int index]
        { get;set;}
    }
    ```

#### 4. 接口事件成员
- 声明接口的事件成员的语法格式如下:
    ```cs
    event 代表名 事件名;
    ```
- 例如
    - 声明一个接口Ia
        - 其包含一个接口事件成员:
    - 代码如下：
    ```cs
    // 先声明委托类型
    public delegate void mydelegate();
    public interface Ia
    {
            event mydelegate myevent;
    }
    ```



---



### 6.4.4 接口的实现
- 接口的实现分为隐式实现和显式实现两种。
    - 如果类或者结构要实现的是单个接口，可以使用隐式实现；
    - 如果类或者结构继承了多个接口，那么接口中相同名称的成员就要显式实现。
        - 显式实现是通过使用接口的完全限定名来实现接口成员的。
- 语法格式如下：
    ```cs
    class 类名: 接口名列表
    {
        //类实体
    }
    ```
- 注意：
    - 当一个类实现一个接口时，这个类必须实现整个接口，而不能选择实现接口的某一部分:
    - 一个接口可以由多个类实现，而在一个类中也可以实现一个或多个接口。
    - 一个类可以继承一个基类，并同时实现一个或多个接口。

#### 1. 隐式实现
- 如果类实现了某个接口，它必然隐式地继承了该接口成员，只不过增加了该接口成员的具体实现。
- 若要隐式实现接口成员，类中的对应成员必须是公共的、非静态的，并且与接口成员具有相同的名称和签名。
    - 例如：
        ```cs
        interface Ia { float fun();}
        public class ExampleClassA : Ia
        {
            public float fun()
            {   // fun() 方法继承自接口 Ia 
                // 隐式实现时需要用 public ，不能有 static
                // 而且名称与签名均一致
                Console.WriteLine("ClassA Connector Ia fun()");
            }
        }
        ```
- 一个接口可以被多个类继承，在这些类中实现该接口的成员，这样接口就起到提供统一界面的作用。
    - 在上例中加入以下代码
        ```cs
        public class ExampleClassB : Ia
        {
            public float fun()
            {   
                Console.WriteLine("ClassB Connector Ia fun()");
            }
        }
        ```
    - 在 `Main` 代码块中加入以下代码并运行
        ```cs
        ExampleClassA a = new ExampleClassA();
        a.fun();

        ExampleClassB b = new ExampleClassB();
        b.fun();
        ```
        则会有结果输出如下：
        ```shell
        ClassA Connector Ia fun()
        ClassB Connector Ia fun()
        ```

#### 2. 显式实现
- 当类实现接口时，如果给出了接口成员的完整名称（即带有接口名前缀），则称这样实现的成员为**显式接口成员**，其实现被称为**显式接口实现**。
- 显式接口成员的实现**不能**使用**任何**修饰符。
    - 例：改写上例如下
    ```cs
    interface Ia { float fun();}
    public class ExampleClassA : Ia
    {
        float Ia.fun()
        {   // 显式接口成员的实现,带有接口名前缀，不能使用public
            Console.WriteLine("Ia.fun() in ClassA");
        }
    }
    ```
    - 在 `Main` 代码块中加入以下代码并运行：
    ```cs
    // 建立类ExampleClassA的实例a
    ExampleClassA a = new ExampleClassA();
    // 基于类ExampleClassA的实例a
    // 建立对 接口Ia 在ExampleClassA中实现 的 实例c
    Ia c = (Ia)a;
    // 调用接口方法成员 fun()
    c.fun();
    ```
    - 如果改为通过 `a.fun()` 调用接口成员,则产生“ExampleClassA并不包含fun的定义”的编译错误：
        - 这是因为显式实现时导致隐藏接口成员。
        - 所以如果没有充分理由，应避免显式实现接口成员。
        - 如果成员只通过接口调用，则考虑显式实现接口成员。



---



### 6.4.5 接口映射
- 类的成员 A 与其映射的接口成员 B 必须满足以下条件：
    - 如果 A 和 B 都是成员方法
        - 那么 A 和 B 的名称、返回类型、形参格式和形参类型必须一致
    - 如果 A 和 B 都是成员属性
        - 那么 A 和 B 的名称和类型必须一致
    - 如果 A 和 B 都是事件
        - 那么 A 和 B 的名称和类型必须一致
    - 如果 A 和 B 都是索引器
        - 那么 A 和 B 的名称、形参个数和形参类型必须一致
- 接口成员与类成员映射关系如下：
    1. 如果类 `Foo` 中存在显式接口成员 `IFoo.Mem`，则由 `Foo.Mem` 作为 `IFoo.Mem` 的实现
    2. 如果找不到匹配显示接口成员，则寻找 `Foo` 中是否存在一个与 `IFoo.Mem` 匹配的非静态公有成员
        - 如果有则作为接口 `IFoo.Mem` 的实现
    3. 如果都不满足，则在 `Foo` 的基类中寻找 `IFoo.Mem` 的实现
    4. 直到查找到 `Object` 但仍未找到，会报告[编译器错误 CS0535](https://learn.microsoft.com/zh-cn/dotnet/csharp/misc/cs0535)



---



### 6.4.6 接口实现的继承
- 类可以从基类中继承所有的接口实现
    - 除非在派生是重新实现接口，否则无法改变基类继承下来的接口映射
- 接口方法被映射为类中虚方法时，派生类可以通过覆盖虚方法来改变接口的实现
    - 此时对子类 `B` 调用 `IFoo.fun`，会访问到 `B.fun` 而非 `A.fun`
    ```cs
    interface IFoo
    {
        int fun();
    }
    
    class A: IFoo
    {
        virtual int fun(){return 1;}
    }

    class B: A
    {
        override int fun(){return 2;}
    }
    ```



---



### 6.4.7 重新实现接口
- 类可以实现基类所实现的接口
    - 只需要在派生子类时加上需要重新实现的接口
    ```cs
    interface IFoo{ void fun(); }
    class A: IFoo { void IFoo.fun(); }
    class B: A, IFoo { void fun(); }
    ```
- 重新实现接口时，无论派生类建立接口映射如何，从基类集成的接口映射不会被影响
    - 对于上例：对 `A` 中 `IFoo.fun() => A.IFoo.fun()`，但是对 `B` 有 `IFoo.fun() => B.fun()`
- 继承而来的公有成员定义和继承而来的显式接口成员的定义都参与接口映射过程
    - 类在实现一个接口的同时也隐式的实现了该接口的所有父接口
    - 重新实现也同样会隐式的同样实现所有父接口
    - 对于下例
        - A: 均用显式实现 `A.IFoo.fun1`、`A.IFoo.fun2`、`A.IFoo.fun3`
        - B: 隐式实现 `B.fun1`，显式实现 `B.IFoo.fun2`，继承了 `B.IFoo.fun3`
    ```cs
    IFoo iB = new B();
    iB.fun1();  //4 隐式实现 B.fun1
    iB.fun2();  //5 显示实现 IFoo.B.fun2
    iB.fun3();  //3 继承隐式实现 IFoo.A.fun3

    interface IFoo
    {
        int fun1();
        int fun2();
        int fun3();
    }
    
    class A: IFoo
    {
        int IFoo.fun1(){ return 1; }
        int IFoo.fun2(){ return 2; }
        int IFoo.fun3(){ return 3; }
    }

    class B: A, IFoo
    {
        int fun1(){ return 4; }
        int IFoo.fun2(){ return 5; }
    }
    ```

## 拓展导读: 高版本 C# 中接口的变化
- 参考视频
    - [一期视频看透C#接口的全部特性及用法](https://www.bilibili.com/video/BV11w411j78c/?share_source=copy_web&vd_source=9ba1a80902ec14f4f1601626d29e43c7)
