# Java编程基础

参考视频课程[【零基础 快速学Java】韩顺平 零基础30天学会Java](https://www.bilibili.com/video/BV1fh411y7R8)
1. **第一阶段** `(P001 - P373)`
    1. 内容介绍`(P001 - P006)`
    2. Java概述`(P007 - P034)`
    3. 变量`(P035 - P062)`
    4. 运算符`(P063 - P103)`
    5. 程序控制结构`(P104 - P155)`
    6. 数组、排序和查找`(P156 - P191)`
    7. 面向对象编程（基础部分）`(P192 - P263)`
    8. 面向对象编程（中级部分）`(P264 - P361)`
    9. 房屋出租系统`(P362 - P373)`
2. **第二阶段** `(P374 - P661)`
    10. 面向对象编程（高级部分）`(P374 - P424)`
    11. 枚举和注解`(P425 - P443)`
    12. 异常`(P444 - P459)`
    13. 常用类`(P460 - P498)`
    14. 集合`(P499 - P553)`
    15. 泛型`(P554 - P568)`
    16. 坦克大战1`(P569 - P579)`
    17. 多线程编程`(P580 - P599)`
    18. 坦克大战2`(P600 - P610)`
    19. IO流`(P611 - P644)`
    20. 坦克大战3`(P645 - P661)`
3. **第三阶段** `(P662 - P910)`
    21. 网络编程`(P662 - P684)`
    22. 多用户即时通信系统`(P685 - P710)`
    23. 反射`(P711 - P730)`
    24. 零基础学MySQL`(P731 - P820)`
    25. JDBC和数据库连接池`(P821 - P857)`
    26. 满汉楼`(P858 - P877)`
    27. 正则表达式`(P878 - P904)`
    28. 算法优化体验课 - 骑士周游问题`(P905 - P910)`

## Java 介绍
### Java 特点
1. Java语言是面向对象的(oop)
2. Java语言是健壮的。Java的强类型机制、异常处理、垃圾的自动收集等是Java程序健壮性的重要保证
3. Java语言是跨平台性的。[示意图]
4. Java语言是解释型的
    - 解释性语言:javascript,PHP java 编译性语言:c/c++
    - 区别是:
        - 解释性语言，编译后的代码，不能直接被机器执行,需要解释器来执行；
        - 编译性语言编译后的代码，可以直接被机器执行,c/c++

### Java 的开发工具
- editplus 、 notepad++
- Sublime Text
- IDEA
- eclipse

### Java 运行机制
- Test.java 源文件
- 编译 javac
- Test.class 字节码文件
- 运行 java
- JVM （跨平台性的支撑）
    - Win.JVM
    - Linux.JVM
    - Mac.JVM

### Java运行机制及运行过程
- Java核心机制-Java虛拟机 [JVM fava virtual machine]
- 基本介绍
    1) JVM是一个虚拟的计算机，具有指令集并使用不同的存储区域。
        负责执行指令管理数据、内存、寄存器，包含在JDK中.
    2) 对于不同的平台，有不同的虚拟机。
    3) Java虚拟机机制屏蔽了底层运行平台的差别，实现了“一次编译，到处运行

### 什么是 JDK , JRE
- JDK 基本介绍
    - JDK 的全称(Java Development Kit Java开发工具包)  
        JDK=JRE +java的开发工具[java,javac,javadoc,javap等]
    - JDK是提供给Java开发人员使用的，其中包含了java的开发工具，也包括了JRE，所以安装了JDK，就不用在单独安装JRE了。

- JRE 基本介绍
    - JRE(Java Runtime EnvironmentJava运行环境)  
        JRE = JVM + Java的核心类库[类]
    - 包括Java虛拟机(JVM Java Virtual Machine)和Java程序所需的核心类库等
    - 如果想要运行一个开发好的Java程序，计算机中只需要安装JRE即可。

- JDK、JRE和JVM的包含关系
    - JRE =JVM + Java SE标准类库
        - 如果只想运行开发好的 .class文件 只需要JRE
    - JDK = ( JVM + Java SE标准类库 ) + 开发工具集 
        - JDK = JRE + 开发工具集

## 开发工具的下载与配置

### 下载：
进入Oracle官网

### 配置环境变量 path 

1. 我的电脑--属性--高级系统设置--环境变量
2. 增加 `JAVA_HOME` 系统环境变量, 指向 jdk 的安装目录
3. 编辑 path 系统环境变量，增加` %JAVA HOME%\bin` 
    > 注意顶层优先
4. 打开DOS命令行，任意目录下敲入`javac`/`java`。如果出现`javac`的参数信息，配置成功。









