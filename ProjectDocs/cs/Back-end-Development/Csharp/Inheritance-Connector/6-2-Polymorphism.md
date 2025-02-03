## 6.2 多态性
> [!note]
> 多态性指发出同样的消息（比如方法调用）被不同类型对象接收时可能导致不同行为。  
> 运算符重载和方法都属于多态性的表现形式。
> 在这里主要采用**虚方法**实现多态性，即子类继承父类后重写父类方法，从而实现不同操作。



---



### 6.2.1 隐藏基类方法
- 在 C# 中需要为每一个类的每一个方法设定特定代码，并且需要让程序可以正确调用。
    - 当派生类从基类继承时，会继承成基类的所有非私有方法、属性、字段和事件。
    - 若要更改基类的数据和行为有两种选择：
        - 使用新的派生成员替代基成员；`本节内容`
        - 重写虚拟的基成员。`下节内容`
- 使用新的派生成员替换基方法时需要使用 `new` 关键字。
    - 例如有：
    ```cs
    class BaseClass
    {
        public void FunDefault()
        {
            Console.WriteLine("这个方法来自于 {0} 类！", this.GetType());
        }
    }
    class ChildClass_1 : BaseClass
    {
        new public void FunDefault()    // 使用 new 隐藏了基类的同名方法。
        {
            Console.WriteLine("这个方法来自于 {0} 类！", this.GetType());
        }
    }
    ```
    - 在主程序中执行以下语句：
    ```cs
    ChildClass_1 TestObj = new ChildClass_1();
    TestObj.FunDefault();
    ```
    - 则有如下结果
    ```shell
    这个方法来自于 ChildClass_1 类！
    ```
- 不使用 `new` 关键字时编译器会给出警告信息。
    - 例如对上例，补充类：
        ```cs
        class ChildClass_2 : BaseClass
        {
            public void FunDefault()
            {
                Console.WriteLine("这个方法来自于 {0} 类！", this.GetType());
            }
        }
        ```
    - 在主程序中执行以下语句：
        ```cs
        ChildClass_2 TestObj_2 = new ChildClass_2();
        TestObj_2.FunDefault();
        ```
        则在执行编译过程中会弹出警告信息
        `「ChildClass_2.FunDefault()隐藏了继承的成员BaseClass.FunDefault()，如果是有意隐藏，请使用关键字new」`
- 如果在派生类中使用基类隐藏的成员，可以使用 `base.成员名` 来实现对基类成员的访问。



---



### 6.2.2 重写基类方法
- 重写指在子类中编写有相同名称和参数的方法，或者说，重写是在子类中对父类方法进行修改或重新编写。
- 重写与重载不同：
    - 重载是指在同一个类中对相同名称方法通过不同参数执行不同方法；`具有不同签名`
        > 签名：在 **5.8.6 节** 中提到**成员签名**的概念： `方法名(传入参数)`
    - 重写是在派生类中对继承的基类方法的重新声明。`具有相同签名`
- 重写父类方法过程如下
    - 在基类中使用 `virtual` 关键字把某个方法定义为虚方法。
    - 在子类中使用 `override` 关键字重写父类的虚方法。

#### 1. 在基类中使用 virtual 关键字把某个方法定义为虚方法
- `virtual` 关键字用于修饰基类的方法、属性、索引器或事件声明，并且允许在派生类中重写这些对象。
    - 用 `virtual` 关键字修饰的方法称为虚方法。
    - 一般格式如下：
        ```cs
        [其他修饰符] virtual 返回类型 方法名(传入参数)
        {
            // 虚方法的代码
        }
        ```
    - 再调用虚方法时，首先调用所在派生类中的该重写成员，如果没有派生类重写该成员，则它可能是原始成员。
    > [!attention|label:注意]
    > 在默认情况下，方法是非虚拟的，不能重写非虚方法。  
    > `virtual` 修饰符不能与 `static` 、 `abstract` 和 `override` 修饰符一起使用；  
    > 在静态属性上使用 `virtual` 修饰符是错误的。

#### 2. 在子类中使用 override 关键字重写父类的虚方法
- `override` 方法提供从基类集成的成员的新实现。
    - 通过 `override` 重写的方法称为重写基方法，必须与 `override` 方法具有相应的签名。
        - 不能重写非虚方法、静态方法：在基类对应的基方法必须是 `virtual` 、 `abstract` 或 `override` 的。
        - `override` 声明不能更改 `virtual` 方法的可访问性。
        - 不能使用以下修饰符 `new` 、 `static` 、 `virtual` 或 `abstract` 来修改 `override` 方法。
        - 重写属性声明必须指定与继承属性完全相同的访问修饰符、类型和名称，
            并且被重写的属性在基类必须是 `virtual` 、 `abstract` 或 `override` 的。
- 设计虚方法的目的就是告诉编译器：在派生类里可以对此方法提供不同实现。



---



### 6.2.3 dynamic 类型
> [!attention|label:]
> dynamic类型是**危险**的。
> 实际上,dynamic类型是在 .NETFramework 4.0才引入的一个新概念，
> 目的是增强与python等动态语言的互操作性，
> 一般仅在处理非 .NET Framework 对象时使用。

- C# 的多态性就像 C++ 的动态联编一样：
    - 不是在程序编译时进行静态连接，
    - 而是在程序运行时进行动态连接。
- C# 基于动态性引人了 `dynamic` 类型：
    - dynamic类型的变量只有在运行时才能被确定具体类型，
    - 而编译器也会绕过对这种类型的语法检查。
        - 即编译器内不会识别和判断确定其对应类型。
    - 若对其进行了错误的使用时会抛出异常。
        - 使用未定义成员时抛出 `RuntimeBinderException` 异常。
- 在大多数情况下， `dynamic` 类型和 `object` 类型的行为是一样的：
    - 只是编译器不会对包含 `dynamic` 类型表达式的操作进行解析或类型检查。
- 编译器将有关该操作的信息打包在一起。并且该信息用于以后运行时的计算操作。
    - 即 `dynamic` 类型仅在编译期间存在，
    - 在运行期间它会被 `object` 类型替代。



---



### 6.2.4 对象的判别和类对象引用的转换

#### 1. 类对象引用的转换
- 对于具有继承关系的类，可以将派生类对象引用转换为基类对象引用。
- 类对象的引用转换遵循**向上兼容性** `父类在上，子类在下` 
    - 一个『「基类的对象」的引用变量』可以指向「其子类的对象」。
    - 一个『「基类的对象」引用变量』不可以访问『「其子类的对象」中「新增加的成员」』。
    - 一个『「子类的对象」引用变量』无法指向「其基类的对象」。

> [!note|lebel:个人理解]
> 引用类型数据存储在堆（heap）中，引用变量存储在栈（stack）中。  
> `在 C# 中，堆称为托管堆，由CLR（公共语言运行库(Common Language Runtime)）管理。`  
> `当堆中满了之后，会自动清理堆中的垃圾。所以，做为.net开发，我们不需要关心内存释放的问题。`  
> 类型实例化的时候，会在堆中开辟一部分空间存储类的实例；而类对象的引用还是存储在栈中。  
> 对基类进行派生的时候实际开辟了包含基类所继承成员的一块更大的内存空间，
> 用于存储其基类继承成员和派生过程中新声明的成员。  
> 其实际造成了指向基类的引用变量实际也可以指向其派生类的对象，
> 而指向派生类的引用变量无法指到其内部基类对应的内存空间。`不能构成完整基类内存空间`  
> **例如**：  
> 有基类对象 `base` 对应内存空间 `[int value | String Str]` ，  
> 有派生类对象 `derived` 对应空间 `[int value | String Str | bool Truth]` ，  
> 则可以有引用变量从指向 `base` 转换到指向 `dervide` ，  
> 而不能从指向 `dervide` 转换到指向 `base` ，  
> 因为 `dervide` 对应空间内不能直接拆出 `base` 的内存空间。

- 非派生关系的引用只能用显式转换
    - 例如：  
        ```
        基类 Base
            | —— 子类 Child_1
            · —— 子类 Child_2
        ```
        对上述对象结构，以下语句会报错：
        ```cs
        // 内存空间中建立 Child_1 类实例
        //      使用 Child_1 类引用变量 TestObj_1 进行引用
        Child_1 TestObj_1 = new Child_1();
        // 尝试将引用变量 TestObj_1 转换为 Child_2 型
        //      并赋值给 Child_2 类的引用变量 TestObj_2 
        Child_2 TestObj_2 = (Child_2) TestObj_1;
        ```
    - 转换失败时会抛出 `System.InvalidCastException` 异常，
        提示 `无法将类型 Child_1 的对象强制转换为类型 Child_2`，
        表示不能让 `TestObj_2` 指向 `Child_1` 的实例。


#### 2. is 运算符
- `is` 运算符用于检查对象是否为某种类型或可以转换为给定类型。
    - 返回 Boolean 型变量
    - 不能重载
- 语法如下：  
    ```cs
    [operand] is [type]
    ```
    运算结果定义如下：
    - `type` 是类类型，则以下情况返回 `true` ：
        - `operand` 是同一类类型对象
        - `operand` 是 `type` 的派生类的对象
        - `operand` 可以装箱到 `type` 类型
    - `type` 是接口类型，则以下情况返回 `true` ：
        - `operand` 是同一接口类型
        - `operand` 是实现该 `type` 类接口的的类型
    - `type` 是值类型，则以下情况返回 `true` ：
        - `operand` 是同一值类型
        - `operand` 可以拆箱到 `type` 类型

    > [!note|label:理解]
    >  `operand` 对象是否可以有 `type` 特征。  
    > 目标 `type` 为类类型时， `operand` 只能是其自身类或者派生类，或者可以装箱到目标类型。  
    > 目标为接口类型时，只能是自身类或者实现类。  
    > 目标为值类型时，只能是自身类，或者可以拆箱得到目标类型。


#### 3. as 运算符
- 提供了 `as` 运算符，用于在兼容的引用类型之间执行转换。
    - 类似强制转换，但是失败时不会抛出异常，而会产生空值 `null` 。
    - 语法格式：
        ```cs
        // 语法格式
        operand as type
        // 等价于三元语句：
        operand is type ? (type)operand : (type)null
        // 如果可以转换为 (type)operand 则转换；失败就返回空值 null
        ```
        - 例：对前例有
            ```cs
                // ChildClass 派生自 BaseClass
                ChildClass chileExample = new ChildClass();
                // 原例
                BaseClass baseExample = childExample;
                // 改为
                BaseClass baseExample = chileExample as BaseClass；
            ```
-  `as` 运算符的适用情况
    - 返回 `true` ：
        - `operand` 是 `type` 类型
        - `operand` 可以隐式转换为 `type` 类型
        - `operand` 可以装箱到 `type` 类型
    - 返回 `false` ：
        - 不能从 `operand` 转换到 `type`
            - 例如以下实例显然会返回 `null` ：
                ```cs
                    ExampleClass obj = new ExampleClass();
                    string s = obj as obj;
                ```
    - 所有的对象都可以转换为 `object` 类的对象
        - 所有类都从 `object` 类派生而来
        - 例：使用 `as` 进行装箱转换
            ```cs
                int i = 1;
                object obj = i as object;
            ```
- 与类对象引用转换（向上兼容性转换）的区别：
    - 差异很小
    - 例：对可能抛出异常的类对象引用转换改为用 as 处理：
        ```cs
        /* 原有代码 */
            ClassA exampleClassA = new BClassA();
            ClassB exampleClassB = (ClassB) exampleClassA;
        /* 改写 */
            ClassA exampleClassA = new ClassA();
            ClassB exampleClassB = exampleClassA as ClassA;
            if (exampleClassB != null)
            { /* 可以转换时的代码 */ }
            else
            { /* 转换失败时的代码 */ }
        ```
        这样就可以避免异常处理
- 与 `is` 运算符关系：
    - 相同：都在运行时进行类型转换
    - 不同：
        - `is` 可以用于引用类型和值类型
        - `as` 只能用于引用类型
    - 通常用 `is` 判断类型，而后使用 `as` 或者其他强类型转换运算符。
