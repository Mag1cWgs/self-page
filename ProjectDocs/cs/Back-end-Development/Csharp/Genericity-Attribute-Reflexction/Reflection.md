## 0 反射 Reflection
- 反射是 .NET 中的重要机制，可以在运行时获得 .NET 每一个类型（类、结构、委托、接口。枚举等）的成员
    - 方法、属性、事件、构造函数等
    - 还可以获得每个成员的名称、限定符、参数

### 0.1 概述
- 反射是一种机制
    - 可以通过这种机制来获取未知类型的信息
        - 比如对于一个未知类型的对象（网络捕捉、泛型定义或者其他）
        - 可以使用反射来访问它的成员，尽管在编译时候不知道它的类型
- 反射提供了对封装程序集、模块和类型的对象（`Type`类对象）
    - 可以通过反射动态的创建类型的实例
    - 将类型绑定到现有对象、或者从现有对象获取类型
    - 并调用其方法或访问字段和属性
        - 如果代码中使用属性，可以利用反射来对其访问

> [!note|label:总结]
> 反射在以下情况下有用
> - 需要访问程序元数据的属性
> - 检查和实例化程序集中的类型
> - 在运行时构建新类型
> - 执行后期绑定，访问在运行时创建的类型和方法


### 0.2 反射中常用的类

#### 1. Type 类
- 反射的命名空间是 `System.Reflection`
    - `Type` 是 `System.Reflection` 功能的根
    - 也是访问元数据的主要方式
- `Type` 类表示类型声明
    - 包括：类类型、接口类型、数组类型、值类型、枚举类型、类型参数、泛型类型定义、开放/封闭构造的泛型类型
    - 使用 `Type` 类的成员来获取关于类型声明的信息
        - 构造函数、方法、字段、属性、类的事件
        - 在其中部署该类的模块和程序集

- 有常用属性

- 有常用方法

- 对于程序中用到的每一个类型，CLR 都会创建一个包含这个类型信息的 Type 类对象
    - 程序中用到的每一个类型都会关联到独立的 Type 类对象
    - 不管创建的类型有多少个实例，只有一个 Type 对象会关联到所有同类型实例
- 许多类提供了 `GetType()`、`GetTypes()` 方法
    - 它们分别返回一个指定类型的 `Type` 对象和一个 `Type` 对象数组
    - 可以通过调用这些方法来获取对某类型关联的 Type 对象的引用

- `Type` 是一个抽象类，不能用 `new` 关键字来创建 Type 对象
- 获取 `Type` 类对象实例通常有三种方法
    1. 使用 `System.Object.GetType()` 
        ```cs
        Person pe = new Person();
        Type t = pe.GetType();
        // 此时有 t 为 Person 类的 Type 对象
        ```
    2. 使用 `System.Type.GetType(string typeName)` 静态方法
        - 传入参数 `typeName`: 类型的完全限定名
        ```cs
        Type t = Type.GetType("MyNamespace.Person");
        // 此时 t 为 MyNamespace 命名空间中 Person 类的 Type 对象
        ```
    3. 使用 `typeof` 运算符
        ```cs
        Type t = typeof(Person);
        ```
    > [!note]
    > - 第一种方法需要先建立实例
    > - 第三种方法需要类型的编译时信息
    > - 而第二种方法不需要知道类型的编译时信息，所以作为首选方法

#### 2. System.Reflection 命名空间
- System.Reflection 反射命名空间包含提供加载类型、方法和字段的有组织的视图的类和接口
    - 具有动态创建和调用类型的功能
- 其中主要的类及其功能如下：
    - `Assembly` 类
    - `AssemblyName`
    - `ConstructiorInfo`
    - `EventInfo`
    - `FieldInfo`
    - `MethodInfo`
    - `ParameterInfo`
    - `PropertyInfo`
    - `MemberInfo`
    - `Module`
    - `DefaultMemberAttribute`
- 其中 `Assenbly` 类的主要成员如下：
    - 常用属性

    - 常用方法


### 0.3 应用实例

#### 1. 通过反射查看类型的成员信息
- 过程如下
    1. 获取指定类型的 Type 对象或者 Type 对象数组
    2. 通过 Type 类的许多方法发现与该类型的成员有关的信息
- 例：使用反射输出 `System.Object` 类的方法、字段和构造函数信息
    ```cs
    using System;
    using System.Refelction;
    namespace ExampleOfRefelction
    {
        class Program
        {
            static void Main(string[] args)
            {
                string classname = "System.Object";
                Type t = Type.GetType(classname);
                MethodInfo[] m = t.GetMethods();
                FieldInfo[] f = t.GetFields();
                ConstructorInfo[] c = t.GetConstructors();

                Console.WriteLine($"{classname} 类:");
                Console.WriteLine($"\t{t.FullName} 类的方法个数:{m.Length}");
                foreach (var item in m)
                {
                    Console.WriteLine($"\t\t{item.Name}");
                }
                Console.WriteLine($"\t{t.FullName} 类的字段个数:{f.Length}");
                foreach (var item in f)
                {
                    Console.WriteLine($"\t\t{item.Name}");
                }
                Console.WriteLine($"\t{t.FullName} 类的构造器个数:{c.Length}");
                foreach (var item in c)
                {
                    Console.WriteLine($"\t\t{item.Name}");
                }
            }
        }
    }
    ```

#### 2. 通过反射调用未知类的某方法
- 过程如下
    - 假设有未知类 `c` 属于某 DLL 文件 `xyz.dll`
    - 采用 `Assenbly.LoadForm("xyz.dll")` 加载该程序集
    - 调用 `assembly.GetType()` 方法得到一个 Type 对象数组 `t`
    - 通过 `Type.GetContructor()` 方法得到某个对象的构造函数
    - 通过 `ContructorInfo.Invoke()` 方法调用构造函数创建未知类的对象 `s`
    - 通过 `s` 来调用方法
    > [!note|label:使用Invoke方法]
    > 可以跨线程调用，避免抛出错误，常用与 WinForm 中跨线程调用方法，防止跨线程操作导致的错误。

