# 2 基本语法

## 2.1 转义字符
代码 | 作用
----|----
\t | 制表位，实现对齐
\n | 换行符
\\ | 一个\，作为区分
\" | 一个"
\' | 一个'
\r | 一个回车

> [!note]
> `\r\n`连用与`\n`一致  
> `\r`单用实际是对该行做回车后覆写

## 2.2 注释comment
被注释的文字不会被 JVM（java虚拟机）所解释
### 单行注释
```java
// 使用//以实现单行注释
// 这里是注释内容
```
### 多行注释
```java
/* 这里是多行注释的注释内容，不允许嵌套！ */
```

### 文档注释
注释内容可以被JDK提供的工具 `javadoc` 所解析，生成一套以网页文件形式体现的该程序的说明文档，一般写在类中。
#### 基本格式
```java
/**
* 文档注释，例如 @author 作为 javadoc 标签
*/
public class 类名{
    /* 多行注释 */
    public static void main(String[] args){
        //单行注释
    }
}
```
#### 如何生成对应的文档注释
有标准语法如下：
```shell
javadoc -d 文件夹名 [-所用的所有标签] [需文档化的文件]
```

比如对内容如下文件 `Hello.java`：
```java
/**
 * 作为 java 快速入门，演示其开发步骤
 * @author Mag1cWgs
 * @version 0.2.0
 */
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
```
只需要在控制台输入
```shell
    javadoc -d F:\Java_File\Java-Learn\HelloJvDoc -author -version Hello.java
```
则在`F:\Java_File\Java-Learn\HelloJvDoc`中就会出现许多`.html`文件，可以双击其中的`index.html`在浏览器中查看
#### javadoc 标签
一般来说，`author`和`version`标签用在每个java文件中最主要的那个类上，然后`param`，`return`，`see`标签用在方法上。

如果项目里面的开发工具是git这种带有版本号的，author和version标签也可以不用。
因为每个版本的修改信息都会附带作者和时间。

全部的标签如下：

标签 | 说明 | JDK 1.1 doclet | 标准doclet | 标签类型
----|------|---------|----------|--------
@author 作者 | 作者标识 | √ | √ |包、类、接口
@version 版本号 | 版本号 | √ | √ |包、类、接口
@param 参数名 描述 | 方法的入参名及描述信息，如入参有特别要求，可在此注释。 | √ | √ |构造函数、方法
@return 描述 | 对函数返回值的注释 | √ | √ | 方法
@deprecated 过期文本 | 标识随着程序版本的提升，当前API已经过期，仅为了保证兼容性依然存在，以此告之开发者不应再用这个API。| √ | √ | 包、类、接口、值域、构造函数 、方法
@throws 异常类名 | 构造函数或方法所会抛出的异常。|  | √ | 构造函数、方法
@exception 异常类名 | 同@throws。 | √ | √ | 构造函数 、方法
@see 引用 | 查看相关内容，如类、方法、变量等。 | √ | √ | 包、类、接口、值域、构造函数、方法
@since 描述文本 | API在什么程序的什么版本后开发支持。 | √ | √ | 包、类、接口、值域、构造函数 、方法
{@link包 类#成员 标签} | 链接到某个特定的成员对应的交档中。 |  | √ | 包、类、接口、值域、构造函数、方法
{@value} | 当对常量进行注释时，如果想将其值包含在文档中，则通过该标签来引用常量的值。 |   | √(JDK1.4) | 静态值域







