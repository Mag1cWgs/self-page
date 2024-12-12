# 使用Rust建立一个数字猜测游戏

官方文档：[Link](https://kaisery.github.io/trpl-zh-cn/ch02-00-guessing-game-tutorial.html)


## 源代码：
```rust {.line-numbers}
use rand::Rng;
use std::cmp::Ordering;
use std::io;

fn main() {
    println!("Guess the number!");

    let secret_number = rand::thread_rng().gen_range(1..=100);

    loop {
        println!("Please input your guess.");

        let mut guess = String::new();

        io::stdin()
            .read_line(&mut guess)
            .expect("Failed to read line");

        let guess: u32 = match guess.trim().parse() {
            Ok(num) => num,
            Err(_) => continue,
        };

        println!("You guessed: {guess}");

        match guess.cmp(&secret_number) {
            Ordering::Less => println!("Too small!"),
            Ordering::Greater => println!("Too big!"),
            Ordering::Equal => {
                println!("You win!");
                break;
            }
        }
    }
}
```
---
#代码解析

1. 处理猜测值
    1. 请求猜测值
    1. 使用变量`guess`并调用`io::stdin`来导入和储存猜测值
    1. 打印猜测值
1. 生成随机数
    1. 导入rand代码库
    1. 使用rng函数生成
1. 判断随机数与猜测值关系
    1. 导入ordering类型
    1. 对String转换到u32格式
    1. 对两数字进行match比较
1. 反馈关系并引导下一步操作

---
## 对猜测的处理
包括范围：
```rust {.line-numbers}
use std::io;
fn main() {
    println!("Guess the number!");
    println!("Please input your guess.");
    let mut guess = string::new();
    io::stdin()
        .read_line(&mut guess)
        .expect("Failed to read line!");
    println!("Your guessed: {guess}.")
}//
```

### 请求猜测值

1.`use std::io;`

为了获取用户输入并打印结果作为输出，我们需要将 io输入/输出库引入当前作用域。

2.`fn main() {} `

声明新函数

3.`println!("Guess the number!");`
4.`println!("Please input your guess.")`

打印提示，介绍游戏的内容然后请求用户输入

### 使用变量来储存值

5.`let mut guess = String::new();`

创建可变变量guess 绑定值为`String::new`的结果,函数返回String类型新实例。 
new作为string类型的关联函数创建了一个新的空字符串。此时guess绑定了string类型中的名为new的空string类型字符串。

### 接受用户输入

6.`io::stdin()`

调用io库中的stdin函数 
返回一个std::io::stdin的实例 表示终端的标准输入句柄类型

>如果没有预先导入io库 也可以用`std::io::stdin`来调用std中io库的stdin函数

7.`.read_line(&mut guess)`

使用read_line方法从标准输入句柄获取用户的输入，并且将&mut guess作为参数传递给read_line()函数，达到将输入储存到该字符串中目的。

>    .read_line ：
> > 选用原因：
> > > 无论用户在标准输入中键入什么内容，都将其追加（不会覆盖其原有内容）到一个字符串中，因此它需要字符串作为参数。
> > > 这个字符串参数应该是可变的，以便 read_line 将用户输入附加上去。
> >
> >  返回类型：
> > >  返回一个类型为`Result`的枚举值，用来编码错误处理的信息。

8.`.expect("Failed to read line!");`

返回值为err时输出警告行字符串给guess。
> 注意：
> ';'说明作为整个逻辑行，实际不分行。

### 打印猜测值

9.`println!=("Your guessed: {guess}.")`

输出猜测数字

---

## 随机生成一个目标数字

````rust {.line-numbers}
use std::io;
use rand::Rng; //导入`rand`依赖库代码包crate中的trait特性`Rng`
fn main() {
    println!("Guess the number!");
    let secret_number = rand::thread_rng().gen_range(1..=100);//新增生成随机数
    println!("The secret number is: {secret_number}");//新增测试随机数
    println!("Please input your guess.");
    let mut guess = String::new();
    io::stdin()
        .read_line(&mut guess)
        .expect("Failed to read line");
    println!("You guessed: {guess}");
}
````

### 导入rand这个依赖库中的随机数函数
1.`use rand::Rng; `

引入`Rand`库中`Rng`这个trait。
> Rng 是一个 trait，它定义了随机数生成器应实现的方法，想使用这些方法的话，此 trait 必须在作用域中。

### 使用rand依赖库中rng函数生成新函数

2.`let secret_number = rand::thread_rng()`
3.`.gen_range(1..=);`

第一行调用了 rand::thread_rng 函数提供实际使用的随机数生成器：

    它位于当前执行线程的本地环境中，并从操作系统获取 seed。

接着调用随机数生成器的 gen_range 方法。
> 这个方法由 use rand::Rng 语句引入到作用域的 Rng trait 定义。
>.gen_range：
> >    获取一个范围表达式（range expression）作为参数，并生成一个在此范围之间的随机数。
> >
> >    这里使用的这类范围表达式使用了 start..=end 这样的形式，也就是说包含了上下端点，所以需要指定 1..=100 来请求一个 1 和 100 之间的数。

---
## 进行比较

````rust {.line-numbers}
use rand::Rng;
use std::cmp::Ordering;//新增引入std库中cmp库的ordering类型
use std::io;

fn main() {
    // --snip--

    let mut guess = String::new();

    io::stdin()
        .read_line(&mut guess)
        .expect("Failed to read line");

    let guess: u32 = guess.trim().parse()
        .expect("Please type anumber!");//新增 转换数据类型

    println!("You guessed: {guess}");

    //新增
    match guess.cmp(&secret_number) {
        Ordering::Less => println!("Too small!"),
        Ordering::Greater => println!("Too big!"),
        Ordering::Equal => println!("You win!"),
    }
}
````

### 导入Ordering枚举类型

1.`use std::cmp::Ordering;`

增加了另一个 `use` 声明，从标准库引入了 `std::cmp::Ordering` 类型到作用域中。

### 进行数据类型的转换

2.`let guess: u32 = guess.trim().parse()`
   `.expect("Please type anumber!");`

**引入原因：**  
表明这里有 *不匹配的类型（mismatched types）*。  
Rust 有一个静态强类型系统，同时也有类型推断。

    当我们写出 let guess = String::new() 时，Rust 推断出 guess 应该是 String 类型，并不需要我们写出类型。
    另一方面，secret_number，是数字类型。
    几个数字类型拥有 1 到 100 之间的值：32 位数字 i32；32 位无符号数字 u32；64 位数字 i64 等等。
    Rust 默认使用 i32，所以它是 secret_number 的类型，除非增加类型信息，或任何能让 Rust 推断出不同数值类型的信息。
    这里引入的原因在于 Rust 不会比较字符串类型和数字类型。
    所以我们必须把从输入中读取到的 String 转换为一个真正的数字类型，才好与秘密数字进行比较。

> Rust 允许用一个新值来 `隐藏 （Shadowing）` guess 之前的值。这个功能常用在需要转换值类型之类的场景。
> 它允许我们复用 `guess` 变量的名字，而不是被迫创建两个不同变量，诸如 `guess_str` 和 `guess` 之类。

将这个类型为`u32`的`guess`变量绑定到 `guess.trim().parse()` 表达式上。
> 
> 表达式中的`guess` 指的是`包含输入的字符串String类型 guess 变量`。
> > String 实例的 `trim` 方法会去除字符串开头和结尾的空白字符，我们必须执行此方法才能将字符串与 u32 比较，因为 `u32` 只能包含`数值型数据`。
> > 用户必须输入 enter 键才能让 read_line 返回并输入他们的猜想，这将会在字符串中增加一个换行（newline）符。
> > >例如，用户输入 5 并按下 enter（在 Windows 上，按下 enter 键会得到一个回车符和一个换行符，\r\n），
> > >guess 看起来像这样：5\n 或者 5\r\n。\n 代表 “换行”，回车键；\r 代表 “回车”，回车键。
> > >trim 方法会消除 \n 或者 \r\n，只留下 5。
>
> >字符串的 `parse` 方法 将字符串转换成其他类型。
> >这里用它来把字符串转换为数值。我们需要告诉 Rust 具体的数字类型。
> > >这里通过 let guess: u32 指定。guess 后面的冒号（:）告诉 Rust 我们指定了变量的类型。
> >
> > Rust 有一些内建的数字类型；u32 是一个无符号的 32 位整型。对于不大的正整数来说，它是不错的默认类型。
> >
> > 另外，程序中的 `u32` 注解以及与 `secret_number` 的比较，意味着 Rust 会推断出 secret_number 也是 u32 类型。现在可以使用相同类型比较两个值了！
>
> > parse 方法只有在字符逻辑上可以转换为数字的时候才能工作所以非常容易出错。
> > >例如，字符串中包含 A👍%，就无法将其转换为一个数字。
>>
> > 因此，parse 方法返回一个 Result 类型,按部就班的用 expect 方法处理，即：
> > > 如果 parse 不能从字符串生成一个数字，返回一个 Result 的 Err 成员时，expect 会使游戏崩溃并打印附带的信息。
> > > 如果 parse 成功地将字符串转换为一个数字，它会返回 Result 的 Ok 成员，然后 expect 会返回 Ok 值中的数字。

### 进行两个变量值的比较

3.`match guess`
    `.cmp(&secret_number) {`
    `Ordering::Less => println!("Too small!"),`
    `Ordering::Greater => println!("Too big!"),`
    `Ordering::Equal => println!("You win!"),}`
  
使用一个 match 表达式，根据对 guess 和 secret_number 调用 cmp 返回的 Ordering 成员来决定接下来做什么。
cmp 方法用来比较两个值并可以在任何可比较的值上调用。
>   获取一个被比较值的引用：这里是把 guess 与 secret_number 做比较。
    然后它会返回一个刚才通过 use 引入作用域的 Ordering 枚举的成员。


