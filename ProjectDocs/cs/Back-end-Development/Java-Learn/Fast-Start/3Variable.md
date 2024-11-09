# 3 变量和数据类型

## 3.1 变量的基本原理与使用

### 1. 变量的声明与赋值
变量是对内存中一个数据储存单元的表示方式。通常我们声明变量与赋值如下：
```java
    // 不赋予初值
    [变量类型] [变量名];
    // 赋予初值
    [变量类型] [变量名] = [初值];
```


### 2. 实质

在Java中，变量分为两种：基本类型的变量和引用类型的变量。

我们先讨论基本类型的变量。

在Java中，变量必须先定义后使用，在定义变量的时候，可以给它一个初始值。例如：

int x = 1;
上述语句定义了一个整型int类型的变量，名称为x，初始值为1。

不写初始值，就相当于给它指定了默认值。默认值总是0。

来看一个完整的定义变量，然后打印变量值的例子：
```java
// 定义并打印变量
public class Main {
    public static void main(String[] args) {
        int x = 100; // 定义int类型变量x，并赋予初始值100
        System.out.println(x); // 打印该变量的值
    }
}
```
变量的一个重要特点是可以重新赋值。例如，对变量x，先赋值100，再赋值200，观察两次打印的结果：
```java
// 重新赋值变量
public class Main {
    public static void main(String[] args) {
        int x = 100; // 定义int类型变量x，并赋予初始值100
        System.out.println(x); // 打印该变量的值，观察是否为100
        x = 200; // 重新赋值为200
        System.out.println(x); // 打印该变量的值，观察是否为200
    }
}
```
注意到第一次定义变量`x`的时候，需要指定变量类型`int`，因此使用语句`int x = 100;`。而第二次重新赋值的时候，变量`x`已经存在了，不能再重复定义，因此不能指定变量类型`int`，必须使用语句`x = 200;`。
变量不但可以重新赋值，还可以赋值给其他变量。让我们来看一个例子：
```java
// 变量之间的赋值
public class Main {
    public static void main(String[] args) {
        int n = 100; // 定义变量n，同时赋值为100
        System.out.println("n = " + n); // 打印n的值
        n = 200; // 变量n赋值为200
        System.out.println("n = " + n); // 打印n的值
        int x = n; // 变量x赋值为n（n的值为200，因此赋值后x的值也是200）
        System.out.println("x = " + x); // 打印x的值
        x = x + 100; // 变量x赋值为x+100（x的值为200，因此赋值后x的值是200+100=300）
        System.out.println("x = " + x); // 打印x的值
        System.out.println("n = " + n); // 再次打印n的值，n应该是200还是300？
   }
}
```
我们一行一行地分析代码执行流程：

1. 执行`int n = 100;`，该语句定义了变量`n`，同时赋值为`100`，因此，JVM在内存中为变量`n`分配一个“存储单元”，填入值`100`：
    ```
          n
          │
          ▼
    ┌───┬───┬───┬───┬───┬───┬───┐
    │   │100│   │   │   │   │   │
    └───┴───┴───┴───┴───┴───┴───┘
    ```
2. 执行`n = 200;`时，JVM把`200`写入变量`n`的存储单元，因此，原有的值被覆盖，现在`n`的值为`200`：
    ``` 
          n
          │
          ▼
    ┌───┬───┬───┬───┬───┬───┬───┐
    │   │200│   │   │   │   │   │
    └───┴───┴───┴───┴───┴───┴───┘
    ```

3. 执行`int x = n;`时，定义了一个新的变量`x`，同时对`x`赋值，因此，JVM需要新分配一个存储单元给变量`x`，并写入和变量`n`一样的值，结果是变量`x`的值也变为`200`：
    ```
          n           x
          │           │
          ▼           ▼
    ┌───┬───┬───┬───┬───┬───┬───┐
    │   │200│   │   │200│   │   │
    └───┴───┴───┴───┴───┴───┴───┘
    ```
4. 执行`x = x + 100;`时，JVM首先计算等式右边的值`x + 100`，结果为`300`（因为此刻`x`的值为`200`），然后，将结果`300`写入`x`的存储单元，因此，变量`x`最终的值变为`300`：
    ```
          n           x
          │           │
          ▼           ▼
    ┌───┬───┬───┬───┬───┬───┬───┐
    │   │200│   │   │300│   │   │
    └───┴───┴───┴───┴───┴───┴───┘
    ```
可见，变量可以反复赋值。注意，等号=是赋值语句，不是数学意义上的相等，否则无法解释`x = x + 100`


### 3. 变量使用注意事项
- 变量表示内存中的一个存储区域  
    - 不同的变量,类型不同，占用的空间大小不同，
    - 比如:int 4 个字节，double 8个字节
- 该区域有自己的名称`变量名`和类型`数据类型`
- 变量必须先声明，后使用，即**有顺序**
- 该区域的数据可以在**同一类型范围内**不断变化
- 变量在同一个作用域内不能重名
- **变量**=**变量名**+**值**+**数据类型**，这一点请大家注意。`变量三要素`





## 3.3 基本数据类型
- 变量就是申请内存来存储值。也就是说，当创建变量的时候，需要在内存中申请空间。
- 内存管理系统根据变量的类型为变量分配存储空间，分配的空间只能用来储存该类型数据。
- 因此，通过定义不同类型的变量，可以在内存中储存整数、小数或者字符。
- Java 的两大数据类型:
    - 内置数据类型
    - 引用数据类型
### 1. 内置数据类型
```java
public class VariableLearn {
    static boolean bool;
    static byte by;
    static char ch;
    static double d;
    static float f;
    static int i;
    static long l;
    static short sh;
    static String str;

    public static void main(String[] args) {
        // byte
        System.out.println("基本类型：byte 二进制位数：" + Byte.SIZE);
        System.out.println("包装类：java.lang.Byte");
        System.out.println("最小值：Byte.MIN_VALUE=" + Byte.MIN_VALUE);
        System.out.println("Byte :" + by);
        System.out.println("最大值：Byte.MAX_VALUE=" + Byte.MAX_VALUE);
        System.out.println();

        // short
        System.out.println("基本类型：short 二进制位数：" + Short.SIZE);
        System.out.println("包装类：java.lang.Short");
        System.out.println("最小值：Short.MIN_VALUE=" + Short.MIN_VALUE);
        System.out.println("Short :" + sh);
        System.out.println("最大值：Short.MAX_VALUE=" + Short.MAX_VALUE);
        System.out.println();

        // int
        System.out.println("基本类型：int 二进制位数：" + Integer.SIZE);
        System.out.println("包装类：java.lang.Integer");
        System.out.println("最小值：Integer.MIN_VALUE=" + Integer.MIN_VALUE);
        System.out.println("Integer :" + i);
        System.out.println("最大值：Integer.MAX_VALUE=" + Integer.MAX_VALUE);
        System.out.println();

        // long
        System.out.println("基本类型：long 二进制位数：" + Long.SIZE);
        System.out.println("包装类：java.lang.Long");
        System.out.println("最小值：Long.MIN_VALUE=" + Long.MIN_VALUE);
        System.out.println("Long :" + l);
        System.out.println("最大值：Long.MAX_VALUE=" + Long.MAX_VALUE);
        System.out.println();

        // float
        System.out.println("基本类型：float 二进制位数：" + Float.SIZE);
        System.out.println("包装类：java.lang.Float");
        System.out.println("最小值：Float.MIN_VALUE=" + Float.MIN_VALUE);
        System.out.println("Float :" + f);
        System.out.println("最大值：Float.MAX_VALUE=" + Float.MAX_VALUE);
        System.out.println();

        // double
        System.out.println("基本类型：double 二进制位数：" + Double.SIZE);
        System.out.println("包装类：java.lang.Double");
        System.out.println("Double :" + d);
        System.out.println("最小值：Double.MIN_VALUE=" + Double.MIN_VALUE);
        System.out.println("最大值：Double.MAX_VALUE=" + Double.MAX_VALUE);
        System.out.println();

        // char
        System.out.println("基本类型：char 二进制位数：" + Character.SIZE);
        System.out.println("包装类：java.lang.Character");
        System.out.println("Character:" + ch);
        // 以数值形式而不是字符形式将Character.MIN_VALUE输出到控制台
        System.out.println("最小值：Character.MIN_VALUE="
                + (int) Character.MIN_VALUE);
        // 以数值形式而不是字符形式将Character.MAX_VALUE输出到控制台
        System.out.println("最大值：Character.MAX_VALUE="
                + (int) Character.MAX_VALUE);

        // boolean
        System.out.println("基本类型：boolean 二进制位数非精确定义*");
        System.out.println("包装类：java.lang.Boolean");
        System.out.println("Bool :" + bool);
        System.out.println("true 的数值：" + Boolean.TRUE);
        System.out.println("false 的数值：" + Boolean.FALSE);

        // String
        System.out.println("基本类型：String");
        System.out.println("包装类：java.lang.String");
        System.out.println("String :"+ str);
        System.out.println("如果变量 str 是 null，那么调用 str.length() 会抛出 NullPointerException。");
        str = "";
        System.out.println("则使 str 为空字符串："+str);
        // 如果 str 是一个空字符串（""），则 str.length() 返回 0，
        System.out.println("空字符串长度：" + str.length());
        //System.out.println("字符串内容：" + str.charAt(0));
        // str.charAt(0) 会抛出 StringIndexOutOfBoundsException，
        // 因为访问的位置超出了字符串长度。
    }
}
```
### 2. 引用数据类型
- 在Java中，引用类型的变量非常类似于C/C++的指针。
    - 引用类型指向一个**对象**，指向对象的变量是**引用变量**。
    - 这些变量在声明时被指定为一个特定的类型，比如 `Employee`、`Puppy` 等。
    - 变量一旦声明后，类型就不能被改变了。
- 对象、数组都是引用数据类型。
- 所有引用类型的默认值都是null。
- 一个引用变量可以用来引用任何与之兼容的类型。`类型名 变量名 = new 类型名(参数)`

