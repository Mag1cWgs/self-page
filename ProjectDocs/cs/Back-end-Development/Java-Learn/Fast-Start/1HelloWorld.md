# 1 开发快速入门 —— Hello

## 1.1 基本过程分析
### 1. 什么是编译
```
javac Hello.java
```
1. 有了java源文件，通过编译器将其编译成JVM可以识别的字节码文件
2. 在该源文件目录下，通过javac编译工具对Hello.java文件进行编译。
3. 如果程序没有错误，没有任何提示，但在当前目录下会出现一个Hello.class文件
    该文件称为字节码文件，也是可以执行的java的程序。

### 2. 什么是运行
1. 有了可执行的java程序(Hello.class字节码文件)；
2. 通过运行工具java.exe对字节码文件进行执行。

### 3. java程序开发注意事项
对修改后的Hello.java源文件需要重新编译，生成新的class文件后，再进行执行,才能生效。

## 1.2 操作

### 建立 .java 文件
1. 建立项目根目录 `%project_file% ` 以下以 `F:\CJava_File\Java-Learn` 代替
2.  使用合适开发工具打开项目目录，建立文件 `Hello.java` ，内容如下：
    ```java
    // 作为 java 快速入门，演示其开发步骤
    public class Hello {
        /* 建立 public标识 的 Hello类 */
        public static void main(String[] args) {
            /* public标识 的 static静态方法 main
            无返回值void 传入参数为可变String[]
            作为程序的入口 */
            // 使用 System类out对象的println方法，传入参数为("Hello World")
            System.out.println("Hello World");
        }
    }
    ```
### 编译为 .class 文件
- 使用合适编译器可以直接方便的生成
- 使用 cmd
    1. 按下 `Win + R` ，输入 `CMD`，使用 `Shift + Ctrl + Enter` 使用**管理员模式**打开。
    2. 进入相应目录：
        ```shell
            # 指令为
            cd %project_file% 
            # 例如 %project_file% 为 "F:\Java_File\Java-Learn"
            cd F:\CJava_File\Java-Learn
        ```
        此时会有左侧切换为 `%project_file%> `，对示例为`F:\CJava_File\Java-Learn> `
    3. 进行编译：输入以下指令
        ```shell
            javac Hello.java
        ```
        检查项目目录 `%project_file%` （`F:\CJava_File\Java-Learn`）会出现一个名为 `Hello.class` 的文件。
        > [!Attention]
        > 如果执行 `javac Hello.java` ，则可能是因为文件保存的编码与 CMD 使用编码冲突。
        > 右键CMD头顶边框，选择「属性」——「当前代码页」，检查当前代码页的编码格式，
        > 其与 `Hello.java` 保存的文件编码格式是否一致，若不一致则应更改保存时的编码格式。
    4. 检查：输入以下指令
        ```shell
            java Hello
        ```
        应输出 `Hello World`。

## 1.3 开发注意事项

### 规则
1. Java源文件以 `.java` 为扩展名。源文件的基本组成部分是**类(class)**，如本类中的Hello类。
2. Java应用程序的执行入口是`main()`方法。它有**固定**的书写格式:
```java
    public static void main(String[] args) {...}
```
3. Java语言**严格**区分大小写。  
4. Java方法由一条条语句构成，每个语句以 `;` 结束。
5. 大括号都是成对出现的，缺一不可。`习惯，先写 {}再写代码`
6. 一个源文件中最多只能有一个public类。其它类的个数不限。
    > 编译后每一个类都对应一个.class文件
7. 如果源文件包含一个public类，则文件名必须按该类名命名!
    > [!attention]
    > 公有类的声明只能在`类名.java`中，否则不能编译！
8. 一个源文件中**最多只能有一个**public类。其它类的个数不限，
    也可以将`main方法`写在`非public类`中，然后指定运行`非public类`，这样`入口方法`就是`非public的main方法`

### 示例
例如：可以将 `Hello.java` 更改为以下内容：
```java
// 作为 java 快速入门，演示其开发步骤
public class Hello {
    /* 建立 public标识 的 Hello类 */
    public static void main(String[] args) {
        /* public标识 的 static静态方法 main
           无返回值void 传入参数为可变String[]
           作为程序的入口 */
        // 使用 System库out类的println方法，传入参数为("Hello World")
        System.out.println("Hello World.");
    }
}

class HelloNotUse{
    /* 同一文件中只能有一个public类作为主类，
    其他类若想作为主类被调用，只能在编译后使用"java 其他类名" */
    public static void main(String[] args) {
        System.out.println("Hello World by HelloNotUss Class.");
    }
}
```
则在编译后会出现两个.class文件：
- Hello.class
- HelloNotUse.class

若在 CMD 中执行 `java Hello` ，只会有输出 `Hello World.`，
而`HelloNotUse`类虽然也在`Hello.java`文件中，但并不作为主类被调用；
若要调用 `HelloNotUse` ，需要执行 `java HelloNotUse`，
这样才会有 `Hello World by HelloNotUss Class.`作为输出。

### 其他易犯错误
1. 找不到文件：  
    控制台爆出：
    ```CMD
        F:\CJava_File\Java-Learn>javac Hello.java
        javac:找不到文件:Hello.java
        用法:
        javac <options><source files>
        -help 用于列出可能的选项
    ```
    **分析**：源文件名不存在或者写错，或者当前路径错误。
2. 主类名和文件名不一致：  
    **解决方法**：声明为public的主类应与文件名一致，否知编译失败。
3. 缺少分号：  
    **解决方法**：编译失败，注意错误出现的行数，再到源代码中指定位置改错。


