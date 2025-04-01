# 常见概念

---

## 多线程和异步的区分

### 概念不同
- 异步并不意味着多线程，单线程同样可以异步
    - 借助 CPU 时间片轮转调度
    - 异步更多是概念
- 异步默认借助线程池
    - 实际可以不用
- 多线程经常阻塞，而异步要求不阻塞
    - 等待信号量/ `Thread.Sleep`
    - 异步不阻塞提高了系统响应能力

### 适用场景不同
- 多线程
    1. 适合 CPU 密集型操作
    2. 适合长期运行的任务
    3. 线程的创建与销毁开销较大
    4. 提供更底层的控制，操作线程、锁、信号量等
    5. 线程不易于传参及返回
    6. 线程的代码书写较为繁琐
- 异步
    1. 适合 IO 密集型操作
    2. 适合短暂的小任务
    3. 避免线程阻塞，提高系统响应能力


---


## 什么是异步任务（Task）
- 包含了异步任务的各种状态的一个引用类型
    - 正在运行、完成、结果、报错等
    - 另有 `ValueTask` 值类型版本  
- 对于异步任务的抽象（最小模块）
    - 开启异步任务后，当前线程并不会阻塞，而是可以去做其他事情
    - 异步任务（默认）会借助线程池在其他线程上运行
    - 获取结果后回到之前的状态
- 任务的结果
    - 返回值为 `Task` 的方法表示异步任务没有返回值
    - 返回值为 `Task<T>` 则表示有类型为 `T` 的返回值


---


## 异步方法（async Task）
- 将方法标记 `async` 后，可以在方法中使用 `await` 关键字
    - 如果不存在 `await` 关键字，则一直是同步调用
    - 异步方法推荐命名时尾部加上 `Async`
- `await` 关键字会等待异步任务的结束，并获得结果

- `async` + `await` 会将方法包装成状态机，`await` 类似于检查点
    - `MoveNext` 方法会被底层调用，从而切换状态
- `async Task`
    - 返回值依旧是 `Task` 类型，但是在其中可以使用 `await` 关键字
    - 在其中写返回值可以直接写 `Task<T>` 中的 `T` 类型，不用包装成 `Task<T>`
- `async void`
    - 同样是状态机，但缺少记录状态的 `Task` 对象
    - 无法聚合异常（Aggregate Exception），需要谨慎处理异常
    - 几乎只用于对于事件的注册
- 异步编程具有传染性（Contagious）
    - 一处 `async`，处处 `async`
    - 几乎所有自带方法都提供了异步的版本


---


## 重要思想：不阻塞！
- await 会暂时释放当前线程，使得该线程可以执行其他工作，而不必阻塞线程直到异步操作完成
- 不要在异步方法里用任何方式阻塞当前线程
    - 都应当使用 `await`，避免阻塞
- 常见阻塞情形
    1. `Task.Wait()` & `Task.Result`
        - 如果任务没有完成，则会阻塞当前线程，容易导致死锁
            - 任务完成就不会阻塞
        - `Task.GetAwaiter().GetResult()`
            - 不会将 `Exception` 包装为 `AggregateException`
    2. `Task.Delay()` vs. `Thread.Sleep()`
        - 前者是一个异步任务，会立刻释放当前的线程
        - 后者会阻塞当前的线程，这与异步编程的理念不符
    3. IO 等操作的同步方法
        - 较新版本的 .NET 为我们提供了一整套的异步方法，包含 Web、IO、Stream 等
    4. 其他繁重且耗时的任务
        - 使用 Task.Run 包装


---


## 同步上下文
- 一种管理和协调线程的机制，允许开发者将代码的执行切换到特定的线程
- WinForms 与 WPF 拥有同步上下文（UI 线程），而控制台程序默认没有
- 配置方法
    - `ConfigureAwait(False)`
        - 配置任务通过 `await` 方法结束后是否会到原来的线程，默认为 `True` 即返回原来的上下文线程
        - 一般只有 UI 线程会采用这种策略
            - `False` 时会抛出跨线程操作异常
        - 后台进程不使用 `async`/`await` 时可能会造成死锁
            1. UI线程直接调用异步方法（不加 `await`），UI 线程阻塞
            2. 异步方法执行完成后，由于默认的 `ConfigureAwait(True)`，会返回到原有 UI 线程
            3. UI 线程等待调用方法返回再解开阻塞
            4. 调用方法等待 UI 线程解开阻塞再返回
            5. 第 3/4 步间产生死锁
            6. 解决方法：在异步方法中的 `await` 语句块中，附加 `.ConfigureAwait(False)` 即可，因为此时不返回被阻塞的 UI 线程，而是进入新线程，值可以正常返回，继承原 UI 线程的阻塞也因为正常返回值而解除阻塞
    - `TaskScheduler`
        - 控制 `Task` 的调度方式和运行线程
            1. 线程池线程 `Default`
            2. 当前线程 `CurrentThread`
            3. 单线程上下文 `STAThread`
            4. 长时间运行线程 `LongRunning`
        - 优先级、上下文、执行状态等


---


## 一发即忘（Fire and forget）
- 调用一个异步方法，但是并不使用 `await` 或阻塞的方式去等待它的结束
- 无法观察任务的状态（是否完成、是否报错等）


---


# 简单任务


---


## 如何创建异步任务
1. `Task.Run()`
    - 在一个新线程上执行代码
        ```cs
        var res = await Task.Run(非异步方法);
        ```
    - 传入异步匿名方法会被包装成 `Task`
        ```cs
        Task.Run(async () => await Task.Delay(100))
        ```
        - 保证异步方法在别的线程上运行
2. `Task.Factory.StartNew()`
    - 相当于 `Task.Run` 的完整版
    - 提供更多功能，比如 `TaskCreationOptions.LongRunning`
3. `new Task` + `Task.Start()`
    - 看起来类似 `new Thread` + `Thread.Start()`，不常用


---


## 如何同时开启多个异步任务
- 不要 `for`/`foreach` 循环中使用 `await`
    - 线程被释放后，交还给线程池
    - 下一轮循环中还要重新获取线程

- `Task.WhenAll()`
- `Task.WhenAny()`

- 例子
    ```cs
    var tasks = new list<Task<参数>>();

    foreach(var item in Col)
    {
        tasks.Add(new Task()); // 或者 Task.Run(方法) / 方法(参数)
    }

    // 等待 tasks 内所有任务完成才会继续往下
    await Task.WhenAll(tasks);
    // 下面这条会等待 x.Result 完成，实际上造成阻塞
    // 通过 Task.WhenAll/ Task.WhenAny 避免 tasks 未完成带来的阻塞
    var outputs = tasks.Select(x => x.Result).ToArray();
    ```


---


## 任务如何取消
- `CancellationTokenSource` + `CancellationToken`
    - 例如
        ```cs
        var cts = new CancellationTokenSource();

        try
        {
            // 执行一个 Task 具体内容是 Delay 1000ms，记录在 cts.Token
            var task = Task.Delay(1000, cts.Token);

            //...其他操作
            cts.Cancel(); // 中途取消

            await task; // 尝试获取 task 的结果
        }
        catch(TaskCanceledException e)
        {
            Console.WriteLine("Task Canceled");
        }
        finally
        {
            cts.Dispose();
        }
        ```
-  `OperationCanceledException` & `TaskCanceledException`
- 推荐异步方法都带上 `CancellationToken` 这一传参
    - 「我可以不用，但你不能没有」

## 其他问题
- 任务超时如何实现？
- 在异步任务中汇报进度？
- 如何在同步方法中调用异步方法？


---


# 常见误区


---


## 异步一定是多线程吗
- 异步编程不必需要多线程来实现
    - 时间片轮转调度
- 比如可以在单个线程上使用异步 I/O 或事件驱动的编程模型（EAP）
- 单线程异步：自己定好计时器，到时间之前先去做别的事情
- 多线程异步：将任务交给不同的线程，并由自己来进行指挥调度

## 异步方法一定要写成 async Task？
- `async` 关键字只是用来配合 `await` 使用，从而将方法包装为状态机
- 本质上仍然是 `Task`，只不过提供了语法糖，并且函数体中可以直接 `return Task` 的泛型类型
- 接口中无法声明 `async Task`
    - 只能写 `Task`，实现的时候可以加 `async`

## await 一定会切换同步上下文？
- 在使用 `await` 关键字调用并等待一个异步任务时，异步方法不一定会立刻来到新的线程上
- 如果 `await` 了一个已经完成的任务（包括 `Task.Delay(0)`），会直接获得结果

## 异步可以全面取代多线程？
- 异步编程与多线程有一定关系，但两者并不是可以完全互相替代

## Task.Result 一定会阻塞当前线程？
- 如果任务已经完成，那么 `Task.Result` 可以直接得到结果

## 开启的异步任务一定不会阻塞当前线程？
- `await` 关键字不一定会立刻释放当前线程
    - 所以如果调用的异步方法中存在阻塞（如 `Thread.Sleep(0)`），那么依旧会阻塞当前上下文对应的线程
    - 比如
        ```cs
        // 在主线程中调用一个异步方法
        var res = FooAsync();
        // 下面这种方法会：
        // 主线程 -> Run开启的线程 -> Sleep -> 新线程完成 await
        var resAno = await Task.Run(FooAsync());

        // 被调用的异步方法
        async Task FooAsync()
        {
            Thread.Sleep(1000); // 此处仍然在主线程中
            await Task.Delay(2000); // 此处才进入新线程
        }
        ```


---


# 异步编程中的同步机制

## 传统方法
- Monitor / lock
    - 在 `lock` 块中不能使用 `await` 关键字，因为 `lock` 要求同线程进同线程出
    - 实际可以通过 `Monitor.Enter/Exit` 突破（但是不推荐）
- Mutex
- Semaphore
- EventWaitHandle

## 轻量型
- SemaphoreSlim
    - 唯一适用于异步编程的多线程信号量 
    ```cs
    // 初始化变量
    var inputs=Enumerable.Range(1,10).ToArray();
    // 实例化 SemaphoreSlim，设置 2 初始通行量，2 最大通行量
    var sem= new SemaphoreSlim(2,2);
    // 调用异步方法
    var tasks=inputs.Select(HeavyJob).ToList();
    // 等待所有 tasks 任务完成
    await Task.WhenAll(tasks);
    //
    var outputs = tasks.Select(x => x.Result).ToArray();

    async Task<int> HeavyJob(int input)
    {
        await sem.WaitAsync();  // 通过 sem 分配
        await Task.Delay(1000);
        sem.Release();  // 使用完 sem 释放
        return input * input;
    }
    ```
- ManualResetEventSlim

## 并发集合
- `ConcurrentBag`/`ConcurrentStack`/`ConcurrentQueue`
- `BlockingCollection`
- `Channel`

## 第三方库
- `AsyncManualResetEvent`
    - 来自 `Microsoft.VisualStudio.Threading`
-  `AsyncLock`
    - 来自 `Nito.AsyncEx`
