## 介绍
- 原型模式(Prototype Pattern)是用于创建重复的对象，同时又能保证性能。

<div align=center><img src="/ProjectDocs/cs/DesignPattern/image/Prototype.png"></div>

- 利用例子：
    - 有一个多字段简历，需要复制三份

### Beginner 实现
- 冗余度高
- 如果实现大量重复，`new` 方式过于麻烦
- 每次调用 `new` 时都需要使用构造函数，潜在性能消耗

```cs
public class Resume
{
    public string Name { get; set; }

    public int Age { get; set; }

    public char Gender { get; set; }

    public string TimeArea { get; set; }

    public string Company { get; set; }

    public void SetInfo(string name, int age, char gender)
    {
        this.Name = name;
        this.Age = age;
        this.Gender = gender;
    }

    public void SetWorkExperience(string timeArea, string company)
    {
        this.TimeArea = timeArea;
        this.Company = company;
    }

    public void ShowResume()
    {
        Console.WriteLine("{0}，{1}，{2}", this.Name, this.Age, this.Gender);
        Console.WriteLine("{0}，{1}", this.TimeArea, this.Company);
    }
}

/// <summary>
/// 浅复制，错误的复制方式
/// </summary>
public void Invoke_Beginner()
{
    Resume example1 = new Resume();
    example1.SetInfo("张三", 35, '男');
    example1.SetWorkExperience("1998-2000", "XX公司");
    example1.ShowResume();

    Resume example2 = example1;
    example2.ShowResume();
    Resume example3 = example1;
    example3.ShowResume();
}
```

### Competent 实现（建立包含Clone()的ResumePrototype）
```cs
public class Competent
{
    public void Invoke_Competent()
    {
        Resume resume1 = new Resume("张三");
        // 尝试浅克隆，需要强制转换
        Resume resume2 = (Resume)resume1.Clone();
        // 通过 Clone() 方法克隆得来的对象，与 Beginner.cs 中的例子不同
        //  - 使用 Clone(): 两个对象的引用不同，但是值相同
        //  - 使用 Beginner.cs: 两个对象的引用相同，值共用
    }
}

/// <summary>
/// 抽象原型类
/// </summary>
public abstract class ResumePrototype
{
    public string Name { get; set; }

    public ResumePrototype(string name)
    {
        Name = name;
    }

    public abstract ResumePrototype Clone();
}

/// <summary>
/// 具体原型类
/// </summary>
public class Resume : ResumePrototype
{
    /// <summary>
    /// 构造函数，继承自父类
    /// </summary>
    /// <param name="name"></param>
    public Resume(string name) : base(name)
    { }

    /// <summary>
    /// 克隆方法
    /// </summary>
    /// <returns></returns>
    public override ResumePrototype Clone()
    {
        ///<remarks>
        ///  <c>MemberwiseClone()</c> 方法是 浅复制/浅克隆
        ///     是 <c>Object</c> 类的一个 <c>protected</c> 方法，只有在派生类中才能调用
        /// - 值类型的字段会被复制
        ///  - 引用类型的字段只复制引用，不复制引用的对象
        ///  也可以用 <c>this.MemberwiseClone() as ResumePrototype</c>
        /// </remarks>
        return (ResumePrototype)MemberwiseClone();
    }
}
```

### Expert 实现（继承ICloneable）
1. 实现接口 `ICloneable`
    - 实现 `Clone()` 方法
2. 调用 `Clone()` 方法

```cs
public class Expert
{
    public void Invoke_Expert()
    {
        Resume_Expert a = new Resume_Expert();
        a.SetInfo("小李", 25, '男');
        a.SetWorkExperience("2010-2014", "XX公司");

        // 对返回的 Object 进行强制类型转换到 Resume_Expert 类型
        Resume_Expert b = (Resume_Expert)a.Clone();
    }

}

/// <summary>
/// 只需要继承 ICloneable 接口，实现 Clone() 方法即可
/// </summary>
public class Resume_Expert : ICloneable
{
    /// <summary>
    /// 值类型
    /// </summary>
    public string Name { get; set; }
    public int Age { get; set; }
    public char Gender { get; set; }

    /// <summary>
    /// 引用类型
    /// </summary>
    public WorkExperience workExperience;

    /// <summary>
    /// 构造函数，初始化引用类型
    /// </summary>
    public Resume_Expert()
    {
        workExperience = new WorkExperience();
    }

    /// <summary>
    /// 构造函数，深拷贝
    /// </summary>
    /// <param name="workExperienceImport">用于深拷贝</param>
    private Resume_Expert(WorkExperience workExperienceImport)
    {
        workExperience = (WorkExperience)workExperienceImport.Clone();
    }

    /// <summary>
    /// 浅拷贝
    /// </summary>
    /// <returns></returns>
    public object Clone()
    {
        //// 浅拷贝: 引用类型只会拷贝引用，不会拷贝引用的对象
        //return this.MemberwiseClone();

        // 深拷贝: 引用类型对应对象也会被调用 Clone 进行深拷贝
        // 当前使用写在构造函数中的方法，可以不使用构造函数，直接在下面深拷贝
        return new Resume_Expert(workExperience)
        {
            // 值类型直接赋值
            Name = Name
            ,
            Age = Age
            ,
            Gender = Gender
            // 深拷贝的核心 : 引用类型使用 Clone() 方法进行拷贝
            //, workExperience = (WorkExperience)this.workExperience.Clone()
        };
    }

    /// <summary>
    /// 设置信息，值类型
    /// </summary>
    /// <param name="name"></param>
    /// <param name="age"></param>
    /// <param name="gender"></param>
    public void SetInfo(string name, int age, char gender)
    {
        Name = name;
        Age = age;
        Gender = gender;
    }

    /// <summary>
    /// 设置工作经历，引用类型
    /// </summary>
    /// <param name="timeArea"></param>
    /// <param name="company"></param>
    public void SetWorkExperience(string timeArea, string company)
    {
        workExperience.TimeArea = timeArea;
        workExperience.TimeArea = company;
    }

    /// <summary>
    /// 显示信息
    /// </summary>
    public void ShowResume()
    {
        Console.WriteLine("{0}，{1}，{2}", Name, Age, Gender);
        Console.WriteLine("{0}，{1}", workExperience.TimeArea, workExperience.TimeArea);
    }

}

/// <summary>
/// 引用类型的变量，如果也实现了 ICloneable 接口，那么就可以实现深拷贝
/// </summary>
public class WorkExperience : ICloneable
{
    public object Clone()
    {
        return MemberwiseClone();
    }

    public string TimeArea { get; set; }
    public string Company { get; set; }
}
```

### 使用 反射 / 序列化 实现

#### 反射+序列化
- 在 .Net 5.0 中，`BinaryFormatter` 已经被弃用

```cs
class Extra
{
    static void Invoke_Extra()
    {
        Person original = new Person
        {
            Name = "John",
            Age = 30,
            Address = new Address
            {
                Street = "123 Main St",
                City = "Anytown"
            }
        };

        Person copy = DeepCopy(original);

        // 修改原始对象以验证深拷贝是否成功
        original.Name = "Jane";
        original.Address.City = "Othertown";

        Console.WriteLine("Original: " + original.Name + ", " + original.Address.City);
        Console.WriteLine("Copy: " + copy.Name + ", " + copy.Address.City);
    }
}

public static T DeepCopy<T>(T obj)
{   // 检查对象是否为空
   if (obj == null)
   {
       throw new ArgumentNullException("obj");
   }
   // 使用反射检查对象是否可序列化，如果不可序列化则抛出异常
   Type type = obj.GetType();
   if (!typeof(ISerializable).IsAssignableFrom(type))
   {
       throw new ArgumentException("The object must be serializable");
   }
  // 使用二进制序列化和反序列化复制对象
   IFormatter formatter = new BinaryFormatter();
   using (Stream stream = new MemoryStream())
   {
       formatter.Serialize(stream, obj);
       stream.Seek(0, SeekOrigin.Begin);
       return (T)formatter.Deserialize(stream);
   }
}

public class Person
{
    public string Name { get; set; }
    public int Age { get; set; }
    public Address Address { get; set; }
}

public class Address
{
    public string Street { get; set; }
    public string City { get; set; }
}
```

#### Json序列化
```cs

class Extra
{
    static void Invoke_Extra()
    {
        Person original = new Person
        {
            Name = "John",
            Age = 30,
            Address = new Address
            {
                Street = "123 Main St",
                City = "Anytown"
            }
        };

        Person copy = DeepCopy(original);

        // 修改原始对象以验证深拷贝是否成功
        original.Name = "Jane";
        original.Address.City = "Othertown";

        Console.WriteLine("Original: " + original.Name + ", " + original.Address.City);
        Console.WriteLine("Copy: " + copy.Name + ", " + copy.Address.City);
    }
}

public static T DeepCopy<T>(T obj)
{
    if (obj == null)
    {
        throw new ArgumentNullException(nameof(obj));
    }

    // 将对象序列化为JSON字符串
    string jsonString = JsonSerializer.Serialize(obj);

    // 从JSON字符串反序列化为新的对象实例
    return JsonSerializer.Deserialize<T>(jsonString);
}

[Serializable]
public class Person
{
    public string Name { get; set; }
    public int Age { get; set; }
    public Address Address { get; set; }
}

[Serializable]
public class Address
{
    public string Street { get; set; }
    public string City { get; set; }
}
```

