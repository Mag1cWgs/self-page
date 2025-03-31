# 介绍 APM
## 什么是APM？
- APM即异步编程模型的简写（Asynchronous Programming Model）
- 使用以 `BeginXXX` 和 `EndXXX` 类似的方法的时候，即在使用异步编程模型来编写程序
- 异步编写模型是一种模式
    - 该模式允许用更少的线程去做更多的操作
    - .NET Framework 很多类也实现了该模式
    - 也可以自定义类来实现该模式
        - 在自定义的类中实现返回类型为 `IAsyncResult` 接口的 BeginXXX 方法和 `EndXXX` 方法
    - 另外委托类型也定义了 `BeginInvoke` 和 `EndInvoke` 方法
    - 并且我们使用WSDL.exe和SvcUtil.exe工具来生成Web服务的代理类型时，也会生成使用了APM的BeginXxx和EndXxx方法。

## 如何实现？
下面就具体就拿 `FileStream` 的 `BeginRead` 和 `EndRead` 方法来介绍下下异步编程模型的实现。

### Begin 方法

#### 同步方法 Read
当需要读取文件中的内容时，我们通常会采用FileStream的同步方法Read来读取，该同步方法的定义为：
```cs
// 从文件流中读取字节块并将该数据写入给定的字节数组中
// array代表把读取的字节块写入的缓存区
// offset代表array的字节偏量，将在此处读取字节
// count 代表最多读取的字节数
public override int Read(byte[] array, int offset, int count )
```



