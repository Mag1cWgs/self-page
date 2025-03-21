## 使用编程思想的目标
- 能够使我们的代码，去**承载**项目中**很复杂的业务逻辑**并且使我的代码看起来非常的简洁易懂，并且**易于扩展**。
- 业务逻辑：
    - 三要素：**流程环节**、**人机交互**、**数据交互**。
    - 完成一个功能的最小闭环。
    - 代码承载复杂业务逻辑。
- 易于扩展：
    - 应对需求改变：
        - 添加功能
        - 修改原有业务逻辑
    - 意味着代码需要变化，进行扩展



---



## 设计思想核心
- 什么是模块：
    - 接口：模块的输入和输出
    - 功能：模块实现什么功能
    - 逻辑：模块内部如何实现功能，过程中需要哪些数据
    - 状态：模块调用 / 被调用关系

### 高内聚
- 内聚：模块内部元素之间具有相同特点的相似程度

- 低内聚会带来的问题：
    - 难以修改，如果修改可能会导致大量引用同步更改

- 高内聚的优点：
    - 提供了更高的可靠性和可读性

### 低耦合
- 耦合：模块之间的依赖程度

- 低耦合的优点：
    - 提供了更好的可拓展性和可复用性



---



## 设计原则
- 分类：
    - 设计接口（往下更严格）：
        - 里氏替换原则：子类可以替换父类
        - 依赖倒置原则：依赖抽象
        - 开放封闭原则：对程序的扩展开放，对程序的修改封闭
        - 单一职责原则：一个类只做一件事
    - 设计类：
        - 接口隔离原则：接口依赖最小化
        - 迪米特原则：对其他对象最少了解，尽量低耦合，保证只和直接朋友通信
    - 合成复用原则

### 1 单一职责原则 / SRP / Single Responsibility Principle

#### 说明：
- 应该有且只有一个引起类变更的原因
    - 一个类只做一件事

- 优点：
    - 提高代码的可读性，提高系统的可维护性。
    - 降低类的复杂性，一个模块只失责一个职责，提高系统的可扩展性和可维护性。
    - 降低变更引起的风险。变更是认然的，如果单一职责做得好，当修改一个功能的时候可以显著的降低对另一个功能的影响。

#### 例：
- 原始型:
    ```cs
    class FooClassOrigin
    {
        void FunctionPrint() => Console.WriteLine("Function1 执行");
        bool FunctionAssert() => true;
    }
    ```
- 改进后:
    ```cs
    // 这里是 C# 8.0 开始支持的接口携带默认实现，方便依赖倒置原则
    interface IPrint
    {
        void Print() => Console.WriteLine("执行 IPrint.Print() 方法");
    }
    class PrintClass: IPrint
    {
        bool Print() => Console.WriteLine("执行 PrintClass.Print() 方法");
    }

    // 这里是 C#8.0 以前的实现方法
    interface IAssert
    {
        bool Assert();
    }
    class AssertClass: IAssert
    {
        bool Assert() => true;
    }

    // 使用接口注入
    // 如果是修改：只需要修改接口中的方法 / 自行重写
    // 如果是新增：只需要直接新增新接口并调用
    class FooClassSRP
    {
        // 调用实现接口的具体类
        IPrint _iPrint = new PrintClass();
        IAssert _iAssert = new AssertClass();
        
        // 调用 IPrint 接口中的 Print() 方法
        // 实际调用 PrintClass 中 Print() 方法
        void FunctionPrint() => _iPrint.Print();

        // 调用 IAssert 接口中的 Assert() 方法
        // 实际调用 AssertClass 中 Assert() 方法
        bool FunctionAssert() => _iAssert.Assert();
    }
    ```

### 2 开放封闭原则 / OCP / Open Closed Principle

#### 说明：
- 是所有面向对象设计原则的核心
- 对功能扩展开放，对修改代码封闭
- 需求改变时，在不改动源码的前提下，通过扩展功能来满足新需求

- 面向接口编程 / 面向抽象编程
    - 使用抽象，封装容易变化的地方

- 不满足单一职责原则**必然不满足**开放封闭原则
- 在类中，将每一个方法都进行接口抽象，也比较极端。
    - 所以，还是根据实际的业务情况，减少接口的封装
    - 根据业务，进行高度抽象封装接口

#### 例：
- 原始型:
    ```cs
    // Main() 函数
    {
        BankClient client = new BankClient();
        client.BankType = "存钱";

        BankStaff staff = new BankStaff();
        staff.HandleProgress(client);
    }

    // BankClient.cs
    public class BankClient
    {
        public string BankType { get; set; }
    }

    // BankStaff.cs
    public class BankStaff
    {
        private BankProcess bankProcess = new BankProcess();
        
        /// <summary>
        /// 不符合单一职责原则
        /// </summary>
        public void HandleProgress(BankClient bankClient)
        {
            switch (bankClient.BankType)
            {
                case "存钱":
                    bankProcess.Deposite();
                    break;
                case "取钱":
                    bankProcess.DrawMoney();
                    break;
                case "转账":
                    bankProcess.Transfer();
                    break;
                default:
                    Console.WriteLine("无法处理用户的请求！");
                    break;
            }
        }
    }

    // BankProcess.cs
    /// <summary>
    /// 不符合单一职责原则，必然也不符合开放封闭原则：
    /// 	添加新功能时需要另外修改 BankStaff.HandlePregress()
    /// </summary>
    public class BankProcess
    {
        public void Deposite() => Console.WriteLine("用户存钱");
        
        public void DrawMoney() => Console.WriteLine("用户取钱");
        
        public void Transfer() => Console.WriteLine("用户转账");
        
    }
    ```
- 面向接口编程改动: 对 `BankProcess` 内部的方法进行抽象
    ```cs
    // Main() 函数
    {
        BankClient client = new BankClient();
        client.BankType = "存钱";

        BankStaff staff = new BankStaff();
        staff.HandleProgress(client);
    }

    // BankClient.cs
    public class BankClient
    {
        public string BankType { get; set; }
    }

    // BankStaff.cs
    public class BankStaff
    {
        private BankProcess bankProcess = new BankProcess();
        
        /// <summary>
        /// 不符合单一职责原则
        /// </summary>
        public void HandleProgress(BankClient bankClient)
        {
            switch (bankClient.BankType)
            {
                case "存钱":
                    bankProcess.iDeposite = new DepositeClass();
                    bankProcess.Deposite();
                    break;
                case "取钱":
                    bankProcess.iDrawMoney = new DrawMoneyClass();
                    bankProcess.DrawMoney();
                    break;
                case "转账":
                    bankProcess.iTransfer = new TransferClass();
                    bankProcess.Transfer();
                    break;
                default:
                    Console.WriteLine("无法处理用户的请求！");
                    break;
            }
        }
    }

    // BanlProcess.cs
    public class BankProcess
    {
        public IDeposite iDeposite { get; set; }
        public IDrawMoney iDrawMoney { get; set; }
        public ITransfer iTransfer { get; set; }
        
        public void Deposite() => iDeposite.DepositeInterface();
        public void DrawMoney() => iDrawMoney.DrawMoneyInterface();
        public void Transfer() => iTransfer.TransferInterface();
        
    }

    // 接口.cs 和 实现类.cs 共六个
    public interface IDeposite
    {
        public void DepositeInterface();
    }

    public interface IDrawMoney
    {
        public void DrawMoneyInterface();
    }

    public interface ITransfer
    {
        public void TransferInterface();
    }

    public class DepositeClass: IDeposite
    {
        public void DepositeInterface()=> Console.WriteLine("用户存钱");
    }

    public class DrawMoneyClass: IDrawMoney
    {
        public void DrawMoneyInterface() => Console.WriteLine("用户取钱");
    }

    public class TransferClass: ITransfer
    {
        public void TransferInterface() => Console.WriteLine("用户转账");
    }
    ```
- 优化后: 再对 `BankProcess` 抽象
    ```cs
    // Main() 函数
    {
    BankClient client = new BankClient();
    client.BankType = "存钱";

    BankStaff staff = new BankStaff();
    staff.HandleProgress(client);
    }

    // BankClient.cs
    public class BankClient
    {
        public string BankType { get; set; }
    }

    // BankStaff.cs
    public class BankStaff
    {
        private IBankProcess _bankProcess;
        public void HandleProgress(BankClient bankClient)
        {
            switch (bankClient.BankType)
            {
                case "存钱":
                    _bankProcess = new DepositeClass();
                    _bankProcess.BankProgress();
                    break;
                case "取钱":
                    _bankProcess = new DrawMoneyClass();
                    _bankProcess.BankProgress();
                    break;
                case "转账":
                    _bankProcess = new TransferClass();
                    _bankProcess.BankProgress();
                    break;
                default:
                    Console.WriteLine("无法处理用户的请求！");
                    break;
            }
        }
    }


    // IBankProcess.cs
    public interface IBankProcess
    {
        void BankProgress();
    }

    //  实现类.cs 共三个
    public class DepositeClass: IBankProcess
    {
        public void BankProgress() => Console.WriteLine("用户存钱");
    }

    public class DrawMoneyClass: IBankProcess
    {
        public void BankProgress() => Console.WriteLine("用户取钱");
    }

    public class TransferClass: IBankProcess
    {
        public void BankProgress() => Console.WriteLine("用户转账");
    }
    ```
- 再优化: 对 `BankClient` 抽象
    ```cs
    // Main() 函数
    {
        IBankClient depositeClient = new DepositeClient();

        BankStaff staff = new BankStaff();
        staff.HandleProgress(depositeClient);
    }


    // IBankClient.cs
    public interface IBankClient
    {
        IBankProcess GetBankProcess();
    }
    // 相应的实现类
    public class DepositeClient: IBankClient
    {
        public IBankProcess GetBankProcess()
        {
            return new DepositeClass();
        }
    }
    public class DrawMoneyClient: IBankClient
    {
        public IBankProcess GetBankProcess()
        {
            return new DrawMoneyClass();
        }
    }
    public class TransferClient : IBankClient
    {
        public IBankProcess GetBankProcess()
        {
            return new TransferClass();
        }
    }


    // BankStaff.cs
    public class BankStaff
    {
        private IBankProcess _bankProcess;
        public void HandleProgress(IBankClient bankClient)
        {
            // 返回业务处理对象
            _bankProcess = bankClient.GetBankProcess();
            // 调用业务处理对象的业务操作方法
            _bankProcess.BankProgress();
        }
    }


    // IBankProcess.cs
    public interface IBankProcess
    {
        void BankProgress();
    }
    //  实现类.cs 共三个
    public class DepositeClass: IBankProcess
    {
        public void BankProgress() => Console.WriteLine("用户存钱");
    }
    public class DrawMoneyClass: IBankProcess
    {
        public void BankProgress() => Console.WriteLine("用户取钱");
    }
    public class TransferClass: IBankProcess
    {
        public void BankProgress() => Console.WriteLine("用户转账");
    }
    ```

### 3 依赖倒置原则 / DIP / Dependence Inversion Principle

#### 说明：
- 「开放封闭原则」是面向对象设计的终极目标，而「依赖倒置原则」是实现「开放封闭原则」的基础。
    - 如果「开放封闭原则」是设计大楼的蓝图，那么「依赖倒置原则」就是大楼的钢铁架构。

- 要实现开放封闭原则，必须先满足依赖倒置原则。

- 高层模块不应该依赖低层模块，两者均需依赖于抽象。
    - 高层模块：调用者
    - 低层模块：被调用者
- 抽象不应该依赖于细节，细节应该依赖于抽象。
- 「依赖倒置原则」的本质就是通过抽象(接口或抽象类)使个各类或模块的实现披此独立，至不影响，实现模块间的松耦合。

#### 例：
- 原型：
    ```cs
    Singer singer = new Singer();
    // 原需求
    singer.SingASong(new ChineseSong());
    // 新增需求
    singer.SingASongByEnglish(new EnglishSong());

    /// <summary>
    /// 显然不符合依赖倒置原则：
    ///     <c>Singer</c> 作为高层模块，反而依赖于底层模块 <c>***Song</c>。
    /// 由于依赖倒置原则是开闭原则的核心，显然不满足开闭原则，更不满足单一职责原则。
    /// </summary>
    public class Singer
    {
        public void SingASong(ChineseSong chineseSong)
        {
            Console.WriteLine("歌手正在唱："+chineseSong.GetSongWords());
        }
        
        // 新增需求
        public void SingASongByEnglish(EnglishSong englishSong)
        {
            Console.WriteLine("歌手正在唱："+englishSong.GetSongWords());
        }
    }

    public class ChineseSong
    {
        public string GetSongWords()
        {
            return "中国歌曲";
        }
    }

    // 新增需求
    public class EnglishSong
    {
        public string GetSongWords()
        {
            return "外国歌曲";
        }
    }
    ```
- 修正后：
    ```cs
    Singer singer = new Singer();
    /// <summary>
    /// 此时客户类对服务类 <c>***Song</c> 实例化，注入到客户类 <c>Singer</c>
    /// </summary>
    singer.SingASong(new ChineseSong());
    singer.SingASong(new EnglishSong());

    /// <summary>
    /// 高层模块现在依赖的就是抽象 <c>ISongWords</c>
    /// </summary>
    public class Singer
    {
        /// <summary>
        /// 此时客户类 <c>Singer</c> 依赖的注入点接口，需要输入一个实现接口的服务类
        /// </summary>
        public void SingASong(ISongWords songWords)
        {
            Console.WriteLine("歌手正在唱："+songWords.GetSongWords());
        }

    }

    /// <summary>
    /// 设计一个接口，通过对该接口的不同实现来隐藏注入的对象
    /// </summary>
    public interface ISongWords
    {
        string GetSongWords();
    }

    /// <summary>
    /// 低层模块此时依赖于抽象 <c>ISongWords</c>
    /// </summary>
    public class ChineseSong: ISongWords
    {
        public string GetSongWords()
        {
            return "中国歌曲";
        }
    }
    public class EnglishSong: ISongWords
    {
        public string GetSongWords()
        {
            return "外国歌曲";
        }
    }
    ```

#### 依赖：
1. 一个优秀的面向对象程序设计，核心的原则之一：
    - 将变化「隔离」/「封装」使得变化部分发生变化时，其他部分，不受影响。
2. 为了实现这个目的，需要使用面向接口编程：
    - 使用后，客户类 (调用者) 不再直接依赖服务类 (被调用者) 而是依赖一个抽象的接口
    - 这样，客户类就不能在内部直接实例化服务类。
3. 但是客户类在运行的过程中，又需要具体的服务类来提供服务：
    - 因为接口是不能实例化的就产生了矛盾
        - 客户类不允许实例化服务类，但是客户类又需要服务类的服务。
4. 为了解决这个矛盾，我们设计了一种解决方案，既:
    - 客户类定义一个注入点，用于服务类的注入
    - 而客户类的客户类 (需要调用调用者的更上层模块) 负责根据情况，实例化服务类，注入到客户类中，从而解决了这个矛盾。

#### 依赖注入的三种方式与举例：
- 通过接口传递(接口注入)
- 通过构造才法体递
- 通过属性的Set方法传递

- 接口注入例：
    ```cs
    Student student = new Student();
    // 在调用方法时注入， Student 类本身不存储接口的实现对象
    student.Drive(new CarA());

    // Icar.cs
    public interface ICar
    {
        void Run();
    }
    // Student.cs
    public class Student: IDriver
    {
        public void Drive(ICar car)
        {
            car.Run();
        }
    }

    // IDriver.cs
    public interface IDriver
    {
        // 在接口/类中，将要注入的服务对象，以参数形式注入
        // 称为接口注入，不关心具体注入的 ICar 的实现类
        void Drive(ICar car);
    }
    // CarA.cs
    public class CarA:ICar
    {
        public void Run()
        {
            Console.WriteLine("车辆A行进中");
        }
    }
    ```
- 构造函数注入例：
    ```cs
    // 在创建对象时注入，Student 类内部存储被注入的接口的实现对象
    Student student = new Student(new CarA());
    student.Drive();

    public interface ICar
    {
        void Run();
    }

    public interface IDriver
    {
        void Drive();
    }

    public class CarA:ICar
    {
        public void Run()
        {
            Console.WriteLine("车辆A行进中");
        }
    }

    public class Student: IDriver
    {
        /// <summary>
        /// 辅助字段，存储注入对象
        /// </summary>
        private ICar _car;
        
        /// <summary>
        /// 在构造时注入
        /// </summary>
        public Student(ICar car)
        {
            this._car = car;
        }
        
        /// <summary>
        /// 调用被注入后的辅助字段
        /// </summary>
        public void Drive()
        {
            this._car.Run();
        }
    }
    ```

- 使用 Set 方法注入例：
    ```cs
    Student student = new Student();
    // 使用Set方法注入
    student.SetCar(new CarA());
    student.Drive();

    public interface ICar
    {
        void Run();
    }
    public class CarA:ICar
    {
        public void Run()
        {
            Console.WriteLine("车辆A行进中");
        }
    }

    public interface IDriver
    {
        void SetCar(ICar car);
        void Drive();
    }
    public class Student: IDriver
    {
        private ICar _car;
        public void Drive()
        {
            this._car.Run();
        }
        
        /// <summary>
        /// 本质与构造注入一致
        /// </summary>
        public void SetCar(ICar car)
        {
            this._car = car;
        }
    }
    ```

### 4 里氏替换原则 / LSP / Liskov Substitution Principle
1. 如果 `S` 是 `T` 的子类型，则 `T` 类型的对象可以被替换为 `S` 类型的对象。
2. 所有引用父类对象的地方，都可以使用其子类型代替。
3. 子类可以替换父类。

 
### 5 接口隔离原则 / ISP / Interface Segragation Principle

#### 说明：
1. 客户端不应该依赖它不需要的接口。
2. 一个类对另一个类的依赖应该建立在最小接口上。
3. 接口尽量细分，不要在一个接口中放很多方法。

- 按照接口隔离原则拆分接口时，首先必须满足单一职责原则

> [!note|label:接口隔离原则和单一职责原则的关系]
> - **单一职责原则**：
>   - 一个类只做一件事，影响类变化的原因只有一个
>   - 目标是**高内聚**
>       - 模块内部元素应尽量高度相似
> - 接口隔离原则
>   - 目标是**低耦合**
>       - 模块之间依赖程度应足够低

### 6 迪米特原则 / Demeter Priciple / The Least Knowledge Principle

#### 说明：
> 指导设计类的原则，与前面五个原则关联较少。

1. 要求一个对象应该对其他对象有最少了解，
2. 降低类间耦合；
3. 迪米特法则实际上就是一个类在创建方法和属性时要遵守的法则。

- 只和直接朋友通信
    1. 成员对象
        - 局部变量类不是直接朋友！
    2. 方法参数
    3. 方法返回值
    ```cs
    class Foo
    {	
        // 类的成员对象是直接朋友：包括字段、属性、方法、事件
        
        // 字段是直接朋友
        string fooFieldMember;
        // 属性是直接朋友
        string fooPropertyMember { get; set; }
        // 方法 和 方法引入的参数 是直接朋友
        string fooFunctionMember(Externally_Imported_Class varImportedMember)
        { 
            // 但作为局部变量的类不是直接朋友！
            Created_In_Function_Class notMember;
            
            // 方法的返回值也是直接朋友
            string ReturnValueMember = "方法返回值也是直接朋友";
            return ReturnValueMember;
        }
        
    }
    class Externally_Imported_Class{}
    class Created_In_Function_Class{}
    ```

#### 关机功能的模型例：
- 原型:
    ```cs
    // Computer.cs
    public class Computer
    {
        public void SaveCurrentTask()
        {
            Console.WriteLine("保存当前程序");
        }
        
        public void CloseScreen()
        {
            Console.WriteLine("关闭屏幕");
        }
        
        public void ShutDown()
        {
            Console.WriteLine("关闭电源");
        }
    }

    // Person.cs
    public class Person
    {
        /// <summary>
        /// 不满足迪米特原则:
        /// 	对 <c>Computer</c> 了解过多。
        /// 如果关机需要三十步:
        /// 	需要调用三十个方法，且有绝对顺序。
        /// </summary>
        public void CloseComputer(Computer computer)
        {
            computer.SaveCurrentTask();
            computer.CloseScreen();
            computer.ShutDown();
        }
    }
    ```
- 优化：
    - 目标：调用一个函数即可
    ```cs
    // Computer.cs
    public class Computer
    {
        // 均修改为 private
        private void SaveCurrentTask()
        {
            Console.WriteLine("保存当前程序");
        }
        private void CloseScreen()
        {
            Console.WriteLine("关闭屏幕");
        }
        private void ShutDown()
        {
            Console.WriteLine("关闭电源");
        }
        
        /// <summary>
        /// 直接在被调用方中添加如下方法，
        /// 如果调用顺序改变也不影响 <c>Person</c> 调用。
        /// </summary>
        public void CloseComputer()
        {
            this.SaveCurrentTask();
            this.CloseScreen();
            this.ShutDown();
        }
    }

    // Person.cs
    public class Person
    {
        /// <summary>
        /// 满足迪米特原则:
        /// 	只了解存在 <c>Computer.CloseComputer()</c> 方法
        /// </summary>
        public void CloseComputer(Computer computer)
        {
            computer.CloseComputer();
        }
    }
    ```

#### 打印总公司和分公司员工id例：
- 原型：
    1. 类：总公司员工类
    2. 类：总公司员工管理类
        1. 获取总公司所有员工
        2. 打印总公司所有员工id
        3. 打印分公司所有员工id
    3. 类：分公司员工类
    4. 类：分公司员工管理类
        1. 获取分公司所有员工id
    
    ```cs
    // Main() 调用
    HeadOfficeManager headManager = new HeadOfficeManager();
    headManager.Print();

    // 员工类
    class HeadOfficeEmployee
    {
        public string ID { get; set; }
    }
    class BranchOfficeEmployee
    {
        public string ID {get; set;}
    }

    // 总公司管理类
    class HeadOfficeManager
    {
        /// <summary> 获取总公司所有员工 </summary>
        public List<HeadOfficeEmployee> GetHeadOfficeEmployee()
        {
            List<HeadOfficeEmployee> list = new List<HeadOfficeEmployee>();
            for (int i = 0; i < 10; i++)
            {
                HeadOfficeEmployee headOfficer = new HeadOfficeEmployee();
                headOfficer.ID = i.ToString();
                list.Add(headOfficer);
            }
            return list;
        }

        /// <summary>
        /// 打印总公司和分公司员工的ID，
        /// 	但是不符合迪米特原则！
        /// </summary>
        public void Print(BranchOfficeManager brachOfficeManager)
        {
            List<HeadOfficeEmployee> listHead =
                    GetHeadOfficeEmployee();
            Console.WriteLine("总公司所有员工ID:");
            foreach (var item in listHead)
            {
                Console.WriteLine("\t" + item.ID);
            }

            // listBranch 是通过局部变量 brachOfficeManager 创建而来的
            // 不是直接朋友，但是进行了操作，不符合迪米特原则！
            List<BranchOfficeEmployee> listBranch =
                    brachOfficeManager.GetBranchOfficeEmployee();
            Console.WriteLine("分公司所有员工ID:");
            foreach (var item in listBranch)
            {
                Console.WriteLine("\t" + item.ID);
            }
        }
    }
    
    // 分公司管理类
    class BranchOfficeManager
    {
        public List<BranchOfficeEmployee> GetBranchOfficeEmployee()
        {
            List<BranchOfficeEmployee> list = new List<BranchOfficeEmployee>();
            for (int i = 101; i < 106; i++)
            {
                BranchOfficeEmployee branchOfficer = new BranchOfficeEmployee();
                branchOfficer.ID = i.ToString();
                list.Add(branchOfficer);
            }
            return list;
        }
    }
    ```
- 修正后：
    1. 类：总公司员工类
    2. 类：总公司员工管理类
        1. 获取总公司所有员工
        2. 打印总公司所有员工id
    3. 类：分公司员工类
    4. 类：分公司员工管理类
        1. 获取分公司所有员工id
        2. 打印分公司所有员工id
    
    ```cs
    // Main() 调用
        HeadOfficeManager headManager = new HeadOfficeManager();
        headManager.Print();
        BranchOfficeManager branchManager = new BranchOfficeManager();
        branchManager.Print();
    // 员工类
        class HeadOfficeEmployee
        {
            public string ID { get; set; }
        }
        class BranchOfficeEmployee
        {
            public string ID { get; set; }
        }
    // 总公司管理类
        class HeadOfficeManager
        {
            /// <summary> 获取总公司所有员工 </summary>
            public List<HeadOfficeEmployee> GetHeadOfficeEmployee()
            {
                List<HeadOfficeEmployee> list = new List<HeadOfficeEmployee>();
                for (int i = 0; i < 10; i++)
                {
                    HeadOfficeEmployee headOfficer = new HeadOfficeEmployee();
                    headOfficer.ID = i.ToString();
                    list.Add(headOfficer);
                }
                return list;
            }
            /// <summary>
            /// 打印总公司和分公司员工的ID
            /// </summary>
            public void Print()
            {
                List<HeadOfficeEmployee> listHead =
                        GetHeadOfficeEmployee();
                Console.WriteLine("总公司所有员工ID:");
                foreach (var item in listHead)
                {
                    Console.WriteLine("\t" + item.ID);
                }
            }
        }
    // 分公司管理类
        class BranchOfficeManager
        {
            public List<BranchOfficeEmployee> GetBranchOfficeEmployee()
            {
                List<BranchOfficeEmployee> list = new List<BranchOfficeEmployee>();
                for (int i = 101; i < 106; i++)
                {
                    BranchOfficeEmployee branchOfficer = new BranchOfficeEmployee();
                    branchOfficer.ID = i.ToString();
                    list.Add(branchOfficer);
                }
                return list;
            }
            public void Print()
            {
                List<BranchOfficeEmployee> listBranch =this.GetBranchOfficeEmployee();
                Console.WriteLine("分公司所有员工ID:");
                foreach (var item in listBranch)
                {
                    Console.WriteLine("\t" + item.ID);
                }
            }
        }
    ```


### 7 合成复用原则 / Composite Reuse Principle

#### 说明：
- 尽量使用对象组合实现复用，而非继承方式。
    - 继承会带来额外性能开销，也会带来冗余代码。
- 继承会带来的问题：
    1. 破坏系统的封装性，对父类改变，子类的实现也会改变；
    2. 子类如果不需要基类的某些方法，系统耦合度会变高；
    3. 继承是静态的，不能再程序运行时发生改变。

- 什么时候使用继承？什么时候使用组合？
    - `has A` 组合（作为一部分进入）
    - `is A` 继承（更具体的扩充）

- 合成复用原则是将已有的对象纳入到新对象中，作为新对象的对象成员来实现的，新对象可以调用己有对象的功能，从而达到复用。

#### 例：
```cs
// Main()
Car car1 = new QYCar();
car1.Run(new Green());

Car car2 = new DCar();
car2.Run(new Red());

// 颜色接口
public interface IColor
{ 
	string ShowColor();
}
// 继承接口的实体类
public class Green : IColor
{
	public string ShowColor()
	{
		return "绿色";
	}
}
public class Red : IColor
{
	public string ShowColor()
	{
		return "红色";
	}
}

// 车抽象类
public abstract class Car
{
	// 接口依赖
	public abstract void Run(IColor color);
}
// 车实体类
public class QYCar : Car
{
	public override void Run(IColor color)
	{
		Console.WriteLine("汽油车，颜色为:\t"+color.ShowColor());
	}
}
// 车实体类
public class DCar : Car
{
	public override void Run(IColor color)
	{
		Console.WriteLine("电车，颜色为:\t" + color.ShowColor());
	}
}
```

#### 类与类间关系
1. **泛化**
    - 实际就是继承；
    - 比如 `Animal` 特化出 `Tiger` （`Tiger` 泛化成 `Animal`）；
    - 在 UML 中使用 *实线空心箭头* 由 *子类* 指向 *父类*。

2. **实现**
    - **类**和**接口**之间的关系；
    - 表示类实现了接口；
    - 在 UML 中使用 *虚线空心箭头* 由 *实现类* 指向 *接口*。

3. **组合**
    - 是整体和部分的关系，
        - 部分没有独立的生命周期，
            - 个体/部分的生命周期与整体的生命周期一致。
        - 组合是把部分作为整体类的一个对象来看待。
    - 组合关系是强拥有关系。
        - 一定拥有。

4. **聚合**
    - 同样是整体和部分的关系
        - 部分有独立的生命周期，
        - 把个体对象的引用（指针）作为整体类的属性。
    - 是弱拥有关系。
        - 不必须拥有 / 允许 `null`

5. **关联**
    - 是一种拥有关系，
    - 是一个类知道另一个类的属性和方法。

6. **依赖**
    - 是一种使用关系，
    - 和上面的诸多原则中的「依赖」意义一致。

#### 类间关系的 UML 图 / 代码
<div align="center">
    <img src='/ProjectDocs/cs/DesignPattern/image/UML-Example-Of-CompositeReusePrinciple.png' width=60%>
</div>

```cs
// 1.泛化 从 Tiger 泛化出的 Animal
public class Animal
{
	private char _gender;
	public void Eat()
	{
		Console.WriteLine("吃饭");
	}
	
	public void Sleep()
	{
		Console.WriteLine("睡觉");
	}
}

// 2.实现 待实现的接口
public interface IClimb
{
	public void Climb();
}

// 3.组合 作为一部分被组合进入 Tiger
public class Leg
{
	private int _count;
}

// 4.聚合 Tiger 作为潜在部分被聚合进 TigerGroup
public class TigerGroup
{
	public Tiger[] tigers;
}

// 5.关联
public class Food
{
	public string FoodName;
	public string FoodColor;
}

// 6.依赖
// 大多数情况会写接口，使用构造注入/接口注入/Set注入
public class Water
{
	private float _weight;
}

// 1.泛化/特化 从 Animal 特化出 Tiger
// 2.实现 实现接口IClimb
// 4.聚合 类本身不体现聚合
public class Tiger: Animal, IClimb
{
	// 自有字段
	private string _name;
	
	// 2.实现 对接口方法 IClimb.Climb 实现
	public void Climb()
	{
		Console.WriteLine("攀爬");
	}
	
	// 3.组合
		// Leg 作为部分，应与整体生命周期一致
		private Leg _leg;
		// 在构造函数中注入
		public Tiger(Leg leg)
		{
			this._leg = leg;
		}
		// 某些情况下也可以这样写
		public Tiger()
		{
			this._leg = new Leg();
		}
	
	// 5.关联 关联 Food 类
		private Food food;
		
	// 6.依赖 传入所依赖的 Water 类实例
		public void Drink(Water water)
		{
			Console.WriteLine("喝水");
		}
}
```



---



## 设计模式导入

### 设计原则总结
1. 设计原则是「高内聚、低耦合」的具体落地。
2. 单一职责原则要求在软件系统开发、设计中，一个类只负责一个功能领域的相关职责。
3. 开放封闭原则要求一个软件应该对扩展开放，对修改封闭，即在不修改源代码的情况下，完成系统功能的扩展。
4. 里式替换原则决定了子类可以赋值给父类，
5. 依赖倒置原则要求抽象不应该依赖于细节，细节应该依赖于抽象。要面向接口编程，不要面向实现编程。
6. 迪米特原则要求一个对象尽可能少的与其他对象发生相互作用。
7. 接口隔离原则要求客户端不应该依赖那些他不需要的接口，即将一些大的接口细化成一些小的接口供客户端使用。
8. 合成复用原则要求我们尽量使用对象的组合，而非继承来达到复用的目标。

### 设计模式说明
1. 在某些场景下，针对某些问题的某些通用的解决方案
2. 设计模式是一套被反复使用的、多数人知晓的、经过分类编目的代码设计经验的总结
3. 让代码更容易被人理解 / 保证代码可靠性 / 保证代码稳定性 / 保证代码易于扩展

### 分类
1. 创建型设计模式：作用于对象的创建，分离对象的创建和使用。
2. 结构型设计模式：将 类/对象 按照某种布局组成更大的结构。
3. 行为型设计模式：作用于 类/对象 之间互相协作，以完成单个对象无法单独完成的任务，以及怎样分配职责。


|          | 创建型 |   结构型          |  行为型               |
|----------|--------|-------------------|-----------------------|
对象创建    | 单例 </br> 简单工厂方法 </br> 工厂方法 </br> 抽象工厂 </br> 原型 </br> 建造者 |    |   |
接口适配    |       | 适配器 </br> 桥接 </br> 外观 |                    |
对象去耦    |       |                    | 中介者 </br> 观察者      |
抽象集合    |       | 组合                | 迭代器              |
行为扩展    |       | 装饰                | 访问者 </br> 责任链      |
算法封装    |       |                    | 模板 </br> 策略 </br> 命令   |
性能与对象访问|      | 享元 </br> 代理         |                    |
对象状态    |       |                    | 备忘录 </br> 状态 </br>      |
其他        |       |                    | 解释器                       |




---



## 类图 / UML图
- 每一个类图都有三部分组成
    - 类名
    - 属性
    - 方法，方法名前使用符号来标注修饰符
        - `+` 对应 `public`
        - `-` 对应 `private`
        - `#` 对应 `protected`
- 类图 + 类间关系的组合称为 **UML设计图**

- 参考链接:
    - [九种常见UML图（分类+图解）](https://www.cnblogs.com/hzxll/p/16190230.html)
    - [UML 入门指南 | 面向对象设计 | 类图 | 时序图 |（万字多图，非常干燥）](https://zhuanlan.zhihu.com/p/344400915)
