## 异步 参考链接
- [博客园: 聊一聊 C#异步 任务延续的三种底层玩法](https://www.cnblogs.com/huangxincheng/p/18662162)
- [Learning C# Hard: 你必须知道的异步编程](https://www.cnblogs.com/zhili/category/475336.html)
    - [[你必须知道的异步编程]——异步编程模型(APM)](https://www.cnblogs.com/zhili/archive/2013/05/10/APM.html)
    - [[你必须知道的异步编程]——基于事件的异步编程模式](https://www.cnblogs.com/zhili/archive/2013/05/11/EAP.html)
    - [[你必须知道的异步编程]——基于任务的异步模式](https://www.cnblogs.com/zhili/archive/2013/05/13/TAP.html)
    - [[你必须知道的异步编程]C# 5.0 新特性——Async和Await使异步编程更简单](https://www.cnblogs.com/zhili/archive/2013/05/15/Csharp5asyncandawait.html)
- [BiliBili: C#多线程与异步](https://space.bilibili.com/600592/lists/2053170?type=season)

## 前言
- 在 .NET 4.5 的更新中，除了提供了一些新的类和一些新的模板外
    - 在 C# 5.0 中提供了 `async` 和 `await` 两个关键字
    - 这两个关键字是我们实现异步编程更加容易了
- 早在 .NET 1.0 / C# 1.0 开始微软就对异步编程做了相应的支持——即异步编程模型(APM)
- 之后在 .NET 2.0 / C# 2.0 中又提出了基于事件的异步编程模型（EAP）
- .NET 4.0 / C# 4.0 中又提出了基于任务的异步编程模型（TAP）

