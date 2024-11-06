# 5.13 事件
> event关键字与事件
> 事件的创建和使用 

## 5.13.1 event关键字与事件
** 事件 (event) **是一种使类或对象能够提供通知的成员。  
事件的声明与字段类似，不同的是事件的声明包含 event 关键字，并且类型必须是委托类型。  
在声明事件成员的类中，事件的行为就像委托类型的字段（前提是该事件不是抽象的并且未声明访问器）。  
该字段存储对一个委托的引用，该委托表示已添加到该事件的事件处理程序。  
如果尚未添加事件处理程序，则该字段为 null。


### 1. 事件的特点
- 发行者（包含事件定义的类）确定何时引发事件，订户（将自己的事件处理方法和事件相关联的类）确定执行何种操作来响应该事件。  
- 一个事件可以有多个订户。 
    一个订户可处理来自多个发行者的多个事件。  
- 没有订户的事件永远也不会引发。  
- 事件通常用于通知用户操作。
    例如，图形用户界面中的按钮单击或菜单选择操作。  
- 如果一个事件有多个订户，当引发该事件时，会同步调用多个事件处理程序。  

### 2. 事件的本质
- 从字面上看：
    “事件”是一个名词，表示“发生了某件事”；
- 在计算机里：
    事件是可以被控件识别的操作，如按下确定按钮，选择某个单选按钮等。
    用户执行了某个操作，也就“引发一个事件”。
- “事件”发生后，必须有相应的处理程序。
    “引发一个事件”与“调用一个委托”的概念完全等效，因此没有、也不需要专门用于引发事件的特殊语言构造。
    和委托代理一样，客户端通过事件处理程序来响应事件，事件处理程序使用 **+=** 运算符添加，使用 **-=** 运算符移除。

### 3. 对事件所属委托类型的要求

- 通知的核心组成部分
    - 发布者
    - 内容

- 事件的作用是发布通知，其类型是委托类型。
    因此，事件所属的委托类型一般都应有两个输入参数：
    - 发布者和内容（二者一般被命名为`object sender`和`object  args`），
    - 没有返回值（`void`）。  

    这也要求委托方法的签名必须与上述签名兼容。


## 5.13.2 事件的创建和使用 

### 1. 事件的现实模型——交通控制

在交通路口，普遍采用交通信号灯来进行车辆分流。  
为简化模型，做如下规定：
- 交通灯（TrafficLight）仅有绿灯（Green）和红灯（Red）两种颜色。
- 车辆（Vehicle）仅有行驶（Running）和停止（Stop）两种状态。
- 所有车辆按交通信号灯的颜色决定其行驶状态，红灯停，绿灯行。
采用事件，可以实现该模型所要求的控制交通。

### 课上练习——课堂教学的建模
- 以课堂讲课为例，某教室里有若干学生，当上课教师宣布“开始上课”时，本教室里的学生听到后做各种上课准备，有的认真听课，有的认真看书，有的做笔记，而不在本教室的学生则不会。
- 从程序的角度看，当教师宣布“开始上课”时就是发生了一个事件，是该教师通知该事件发生，所以该教师是事件源，本教室的学生（称为订阅者）接到通知后开始做上课准备（事件的订阅者对事件的处理）。

参考代码如下：
```cs
using System;

namespace program
{
    // 建立委托类ClazzHandler 传入参数(Teacher_11_05 teacher, string content) 无返回值
    delegate void ClazzHandler(Teacher teacher, string content);

    // 建立类Teacher_11_05
    class Teacher
    {   
        // 设置可读可写属性 Name,Department
        public string Name { get; set; }
        public string Department { get; set; }

        // 设置 事件startClass，关联 委托类ClazzHandler
        public event ClazzHandler startClass;

        // 定义方法OnClazzing 传入参数(string content)
        public void OnClazzing(string content)
        {
            // 侦测 委托非空时 发布名为 startClass 的事件
            if (startClass != null)
            {
                startClass(this, content);
            }
        }
    }

    class Student
    {
        // 设置可读可写属性 Name, Code
        public string Name { get; set; }
        public string Code { get; set; }

        // 定义 方法ClazzBegin 传入(Teacher teacher, string content) 无返回值
        public void ClazzBegin(Teacher teacher, string content)
        {
            Console.WriteLine("{0}同学你好，{1}的{2}老师正在上课，课程为《{3}》;", Name, teacher.Department, teacher.Name, content);
            Console.WriteLine("另外别忘记签到，你的学号是{0}。", Code);
        }
    }

    class ProgramMain
    {
        static void Main()
        {   // 主程序入口
            Teacher teacherTest = new Teacher_11_05()
            {
                Name = "张三",
                Department = "数理学院"
            };
            Student studentTest = new Student_11_05()
            {
                Name = "李四",
                Code = "202210250101"
            };

            // 将 实例teacherTest的事件startClass 与 实例studentTest的方法ClazzBegin 关联
            teacherTest.startClass += studentTest.ClazzBegin;
            // 触发 实例teacherTest的OnClazzing方法，使之发布事件startClass
            // 事件startClass 触发后 ClazzBegin方法 触发
            teacherTest.OnClazzing("数据库");
        }

    }

}

```





