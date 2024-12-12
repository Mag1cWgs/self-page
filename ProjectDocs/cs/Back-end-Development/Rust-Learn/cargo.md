# CARGO 构建系统&包管理器

[CARGO官方指引](https://doc.rust-lang.org/cargo/)  

不管使用什么操作系统，其命令都是一样的。  
Cargo 期望源文件存放在 src 目录中。项目根目录只存放 README、license 信息、配置文件和其他跟代码无关的文件。  
如果没有使用 Cargo 开始项目，可以将其转化为一个 Cargo 项目。将代码放入 src 目录，并创建一个合适的 Cargo.toml 文件。  

---
1. Cargo命令行操作
1. 文件显示
1.  crate(以rand依赖为例)

---

## Cargo 命令行操作  

### 创建cargo项目 并且生成初始项目文件
`cargo new xxxxx`  
xxxx 目录初始化了一个 git 仓库，以及一个 .gitignore 文件。  
如果在已存在的 git 仓库中运行 `& cargo new` ，则这些 git 相关文件则不会生成；可以通过运行 `cargo new --vcs=git` 来覆盖这些行为。  

### 编译和检查Cargo项目
`cargo build`  
创建一个可执行文件 target/debug/hello_cargo（在 Windows 上是 target\debug\hello_cargo.exe）  
_由于默认的构建方法是调试构建（debug build），Cargo 会将可执行文件放在名为debug 的目录中。_  
首次运行 cargo build 时，会使 Cargo 在项目根目录创建新文件Cargo.lock。这个文件记录项目依赖的实际版本。  
`cargo build --release`  
使用参数`--realease`优化编译项目，并且在target/release下生成可执行文件优化代码运行，但是消耗更多编译时间  
`cargo run`  
同时编译并运行生成的可执行文件  
`cargo check`  
快速检查代码保证其可编译，但不产生可运行文件  

---

## 文件解释 

### .TOML (Tom's Obvious, Minimal Language) 格式
**cargo配置文件格式.**

```
[package]
name = "项目名称"
version = "0.1.0"
edition = "2021"
[dependencies]
```

`[package]`，是一个片段（section）标题，表明下面的语句用来配置一个包。
随着我们在这个文件增加更多的信息，还将增加其他片段（section）。  
`name`编译程序所需项目名称  
`version`编译程序所需项目版本  
`edition`编译程序所需项目Rust版本  
`[dependencies]`，是罗列项目依赖的片段的开始.  
_在 Rust 中，代码包被称为 crates。_

---

## 使用 crate 来增加更多功能
记住，crate 是一个 Rust 代码包。我们正在构建的项目是一个 二进制 crate，它生成一个可执行文件。  
rand crate 是一个 库 crate，库 crate 可以包含任意能被其他程序使用的代码，但是不能自执行。  
Cargo 对外部 crate 的运用是其真正的亮点所在。  

在我们使用 rand 编写代码之前，需要修改 Cargo.toml 文件，引入一个 rand 依赖。  
现在打开这个文件并将下面这一行添加到 `[dependencies]` 片段标题之下。  
在当前版本下，请确保按照我们这里的方式指定 rand，否则本教程中的示例代码可能无法工作。

文件名：Cargo.toml
```rust
[dependencies]
rand = "0.8.5"
```

在 Cargo.toml 文件中，标题以及之后的内容属同一个片段，直到遇到下一个标题才开始新的片段。  
`[dependencies]` 片段告诉 Cargo 本项目依赖了哪些外部 crate 及其版本。  

本例中，我们使用语义化版本 0.8.5 来指定 rand crate。Cargo 理解 `语义化版本（Semantic Versioning）（有时也称为 SemVer）`，这是一种定义版本号的标准。  
0.8.5 事实上是 ^0.8.5 的简写，它表示任何``至少是 0.8.5 但小于 0.9.0 ``的版本。  
Cargo 认为这些版本与 0.8.5 版本的公有 API 相兼容，这样的版本指定确保了我们可以获取能使本章代码编译的最新的补丁（patch）版本。任何大于等于 0.9.0 的版本不能保证和接下来的示例采用了相同的 API。

现在，不修改任何代码，构建项目，如示例 2-2 所示：
````rust {.line-numbers}
 cargo build
    Updating crates.io index
  Downloaded rand v0.8.5
  Downloaded libc v0.2.127
  Downloaded getrandom v0.2.7
  Downloaded cfg-if v1.0.0
  Downloaded ppv-lite86 v0.2.16
  Downloaded rand_chacha v0.3.1
  Downloaded rand_core v0.6.3
   Compiling libc v0.2.127
   Compiling getrandom v0.2.7
   Compiling cfg-if v1.0.0
   Compiling ppv-lite86 v0.2.16
   Compiling rand_core v0.6.3
   Compiling rand_chacha v0.3.1
   Compiling rand v0.8.5
   Compiling guessing_game v0.1.0 (file:///projects/guessing_game)
    Finished dev [unoptimized + debuginfo] target(s) in 2.53s

示例：将 rand crate 添加为依赖之后运行 cargo build 的输出
````

可能会出现不同的版本号（多亏了语义化版本，它们与代码是兼容的！），同时显示顺序也可能会有所不同。

现在我们有了一个外部依赖，Cargo 从 `registry` 上获取所有包的最新版本信息，这是一份来自 `Crates.io` 的数据拷贝。Crates.io 是 Rust 生态环境中的开发者们向他人贡献 Rust 开源项目的地方。

在更新完 registry 后，Cargo 检查 [dependencies] 片段并下载列表中包含但还未下载的 crates。  
本例中，虽然只声明了 rand 一个依赖，然而 Cargo 还是额外获取了 rand 所需要的其他 crates，因为 rand 依赖它们来正常工作。下载完成后，Rust 编译依赖，然后使用这些依赖编译项目。

如果不做任何修改，立刻再次运行 cargo build，则不会看到任何除了 Finished 行之外的输出。Cargo 知道它已经下载并编译了依赖，同时 Cargo.toml 文件也没有变动。Cargo 还知道代码也没有任何修改，所以它不会重新编译代码。因为无事可做，它简单的退出了。

如果打开 src/main.rs 文件，做一些无关紧要的修改，保存并再次构建，则会出现两行输出：
```
$ cargo build
   Compiling guessing_game v0.1.0 (file:///projects/guessing_game)
    Finished dev [unoptimized + debuginfo] target(s) in 2.53 secs
```

这一行表示 Cargo 只针对 src/main.rs 文件的微小修改而更新构建。依赖没有变化，所以 Cargo 知道它可以复用已经为此下载并编译的代码。它只是重新构建了部分（项目）代码。

***Cargo.lock* 文件确保构建是可重现的**  

Cargo 有一个机制来确保任何人在任何时候重新构建代码，都会产生相同的结果：Cargo 只会使用你指定的依赖版本，除非你又手动指定了别的。例如，如果下周 rand crate 的 0.8.6 版本出来了，它修复了一个重要的 bug，同时也含有一个会破坏代码运行的缺陷。为了处理这个问题，Rust 在你第一次运行 cargo build 时建立了 Cargo.lock 文件，我们现在可以在guessing_game 目录找到它。

当第一次构建项目时，Cargo 计算出所有符合要求的依赖版本并写入 Cargo.lock 文件。当将来构建项目时，Cargo 会发现 Cargo.lock 已存在并使用其中指定的版本，而不是再次计算所有的版本。这使得你拥有了一个自动化的可重现的构建。  
换句话说，项目会持续使用 0.8.5 直到你显式升级，多亏有了 Cargo.lock 文件。由于 Cargo.lock 文件对于“可重复构建”非常重要，因此它通常会和项目中的其余代码一样纳入到版本控制系统中。

**更新 crate 到一个新版本**  

当你 确实 需要升级 crate 时，Cargo 提供了这样一个命令，update，它会忽略 Cargo.lock 文件，并计算出所有符合 Cargo.toml 声明的最新版本。  
Cargo 接下来会把这些版本写入 Cargo.lock 文件。不过，Cargo 默认只会寻找大于 0.8.5 而小于 0.9.0 的版本。

如果 rand crate 发布了两个新版本，0.8.6 和 0.9.0，在运行 cargo update 时会出现如下内容：

```
$ cargo update
    Updating crates.io index
    Updating rand v0.8.5 -> v0.8.6
```

Cargo 忽略了 0.9.0 版本。这时，你也会注意到的 Cargo.lock 文件中的变化无外乎现在使用的 rand crate 版本是0.8.6 。  
如果想要使用 0.9.0 版本的 rand 或是任何 0.9.x 系列的版本，必须像这样更新 Cargo.toml 文件：

```rust
[dependencies]

rand = "0.9.0"
```
下一次运行 cargo build 时，Cargo 会从 registry 更新可用的 crate，并根据你指定的新版本重新计算。  
通过 Cargo 复用库文件非常容易，因此 Rustacean 能够编写出由很多包组装而成的更轻巧的项目。

**注意：**
你不可能凭空就知道应该使用哪个 `trait(特性)` 以及该从 `crate(代码包)` 中调用哪个方法，因此每个 crate 有使用说明文档。
Cargo 有一个很棒的功能是：运行 `cargo doc --open` 命令来构建所有本地依赖提供的文档，并在浏览器中打开。
例如，假设你对 rand crate 中的其他功能感兴趣，你可以运行 `cargo doc --open` 并点击左侧导航栏中的 `rand`。
