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
### 有哪些做法
1. `CancellationTokenSource` + `CancellationToken`
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
2. `cts.Cancel()` & `Token.IsCancellationRequested`

3. 推荐异步方法都带上 `CancellationToken` 这一传参
    - 「我可以不用，但你不能没有」

4. 通过两种方式实现选择性使用 `CancellationToken`
    - 参照 `HttpClient` 类中的 `GetStringAsync` 函数的几种重载
    - 第一种：方法重载
        ```cs
        async Task FooAsync(CancellationToken ctsToken)
        {
            await Task.Delay(5000); //模拟耗时操作
            Console.WriteLine();
            var client = new HttpClient(); //模拟耗时操作
            await client.GetStringAsync("...", ctsToken); //模拟耗时操作
        }   // 一旦被取消则抛出异常，记录取消信息在 ctsToken 内部

        async Task FooAsync()
        {
            // 返回 void 无需 return
            await FooAsync(CancellationToken.None);
        }
        // 可以简化到如下形式
        Task FooAsync() => await FooAsync(CancellationToken.None);
        ```
    - 第二种：传入 `default`
        ```cs
        // 参数中的 token 可以直接写 null
        // 因为不修改情况下引用类型 default 就是 null
        async Task FooAsync(int delay, CancellationToken? ctsToken = default)
        {
            // 如果不传入 token 则设置为 Token.None
            var token = ctsToken ?? CancellationToken.None;
            // token 可以为 Token.None，此时不记录内部异常
            await Task(Delay, token);
        }
        ```
    - 面对没有原生支持输入 `CancellationToken` 的情形
        - 只能手动处理
        - 例
            ```cs
            Task FooAsync(CancellationToken token)
            {
                return Task.Run( ()=>
                {
                    //if(token.IsCancellationRequested)
                        // => return;
                        // => throw new OperationCanceledException();
                    
                    token.ThrowIfCancellationRequested();// 循环外部粒度更粗
                    while(true)
                    // while(!token.IsCancellationRequested)
                    {
                        //token.ThrowIfCancellationRequested();
                        Thread.Sleep(1000);
                        Console.WriteLine("Pooling...");
                    }
                });
            }
            ```

    
### 任务取消的对策

#### 1 抛出异常
- 统一沿用标准库的抛出异常的处理方法
    - 多处考虑任务取消的情形下，可以在外部统一 `try-catch`

- `TaskCanceledException`
    - 类似 `Thread.Interapt`，会抛出 `InterruptedException`，需要使用 `try-catch` 来获取和处理
        - 参考 [Thread的中断机制(interrupt)，循环线程停止的方法](https://www.cnblogs.com/panchanggui/p/9668284.html)
    - 例如
        ```cs
        var sw = Stopwatch.StartNew();  // 计时器
        try
        {
            var cts = new CancellationTokenSource();
            // 可以在这里使用 using var cts = ...
            // 这样就无需在 finally 调用 Dispose
            var token = cts.Token;
            var cancelTask = Task.Run(async()=>
            {
                await Task.Delay(3000);
                cts.Cancel(); // 会抛出 TaskCanceledException
            });
            await Task.WhenAll(Task.Delay(5000,token),cancelTask);


            // 实际上 CancellationTokenSource 还支持传入 TimeSpan
            // 从而实现超时即取消，具体如下
            var cts = new CancellationTokenSource(TimeSpan.FromSecond(3));
            // 或直接 = new CancellationTokenSource(3000)
            var token = cts.Token;
            await Task.Delay(5000, token);
            // 经过 3000ms 后 cts 自动调用 cts.Cancel() 方法


            // CTS 还有一个叫 CancelAfter() 方法
            var cts = new CancellationTokenSource();
            cts.CancelAfter(3000);
            var token = cts.Token;
            await Task.Delay(5000, token);
        }
        catch(TaskCanceledException e)
        {
            Console.WriteLine(e); 
        }
        finally
        {  
            // CancellationTokenSource 实现了 IDispose 接口
            // 需要考虑显式释放防止内存泄漏
            //  - 如果只作为局部变量（如上例）可以考虑 在第一行使用 using
            //  - 如果作为类变量，要考虑在合适位置Dispose
            //      - 在函数内部赋值，然后使用完成即Dispose
            //      - 声明当前类实现 IDispose 接口，在类的 Dispose 函数内部判断 cts 如果实例化则调用 cts.Dispose 进行销毁
            cts.Dispose();
            Console.WriteLine($"Task completed in {sw.ElapsedMilliseconds}ms").
        }
        ```

- `OperationCanceledException`
    - 是 `TaskCanceledException` 的父类
    - 可以用于判断是哪些函数抛出的异常
    - 但是 `Token.ThrowIfCancellationRequestion` 会抛出 `OperationCanceledException`
        - `OperationCanceledException` 属于 `System.Thread` 空间
        - 而非正常会在的 `System.Thread.Task` 空间
        - 说明其实设计之初不是仅仅面对多线程应用

#### 2 提前返回
- 对不返回 `Task` 的函数应当考虑如下处理
    ```cs
    // 返回一个 string
    string s = FooAsync(new CancelllationToken());

    Task<string> FooAsync(CancellationToken token)
    {
        var task = new Task(()=>{});
        task.IsCanceled;//借助 IsCanceled 等类似来判断

        if(token.IsCancellationRequested)
            return Task.FromCanceled<string>(token);
        
        return Task.FromResult("Done.");
    }
    ```

#### 3 记得善后
1. 在 `finally` 中记得调用 `Dispose()`

2. 考虑 `CancellationToken.Register(委托)`
    - `token` 可以被多次注册
        - 每次注册都相当于一个闭包，在当前作用域中生效
        - 后注册的会被先调用
    - 例子
        ```cs
        var cts = new CancellationTokenSource();
        cts.CancelAfter(3000);
        var token = cts.Token;

        token.Register(()=>Console.WriteLine("主线程收到取消请求"));

        try
        {
            token.Register(()=> Console.WriteLineAsync("Try块中收到取消请求"));

            //...
        }
        // ...
        ```

### 其他内容
1. `Task.Run(CancellationToken)`
    - 对 `Task.Run` 传入 `token` 的唯一作用是在进入 `Run` 内部前预检查
        - 进入 `Run` 内部后需要重新检查 `token`
    - 例子
        ```cs
        var cts = new CancellationTokenSource();
        // cts.CancelAfter(3000); // 这条语句不会影响下面委托内的 token
        cts.Cancel();   // 直接不进入 Task.Run
        var token = cts.Token;
        try
        {   
            // - 使用 Task.Run(委托, token) 时
            //      - token 实际是对当前 Task 进行预检查
            // - 对于委托内部的 token，需要在传入委托时注入
            //      - 但是对于 Task.Run 传入委托需要是 Action
            await Task.Run(()=>
            {
                for(int i=0; i<1000; i++)
                {
                    // 此处 token 由内部控制
                    // token.ThrowIfCancellationRequested();
                    Thread.Sleep(500);
                    Console.WriteLine("Pooling...");
                }
            }, token);
        }
        //...
        ```
 
2. `Cancellation` 所在命名空间
    - 属于 `System.Thread` 空间
    - 和多线程常用的其他类级别相同
    - 可以充分使用在多线程中

3. `AsyncRelayCommand`
    - 使用在 WPF 内部
    - [用 CommunityToolkit.Mvvm 加速 MVVM 开发流程](https://www.bilibili.com/video/BV12x4y177qB)
    - 是 `RelayCommand` 的子集


---


## 任务超时如何实现？
- 比如一个简单的例子
    ```cs
    var thread = new Thread(Foo);
    thread.Start();
    //if(thread.Join(TimeSpan.FromMilliseconds(2000)))
    if (!thread.Join(2000)) // 2000ms 内成功则成功
    {
        thread.Interrupt(); // 使用 Interrupt 打断则需要Foo 抛出异常
    }

    ConsoleWriteLine("Done.");

    void Foo()
    {
        try
        {
            Console.WriteLine("Foo Start...");
            Thread.Sleep(5000);
            Console.WriteLine("Foo End...");
        } 
        catch(ThreadInterruptedException)
        {
            Console.WriteLine("Foo INTERRUPTED!");
        }
    }
    ```
- 异步化
    ```cs
    var cts = new CancellationTokenSource();
    var token = cts.Token;
    var fooTask = FooAsync(token);

    // 可能会出现任务结束但是还没有到达 Delay 设定时间
    // await Task.Delay(2000);
    // 更推荐:
    var completedTask = await Task.WhenAny(fooTask, Task.Delay(2000));
    // 会返回先执行完的 Task<Task>
    if(completedTask != fooTask)
    {
        cts.Cancel();   //需要先取消，避免继续进行
        await fooTask;
        Console.WriteLine("Time Out...");
    }
    ConsoleWriteLine("Done.");


    async Task FooAsync(CancellationToken token)
    {
        try
        {
            Console.WriteLine("Foo Start...");
            await Task.Delay(5000, token);
            Console.WriteLine("Foo End...");
        } 
        catch(OperationCanceledException)
        {
            Console.WriteLine("Foo cancelled...");
        }
    }
    ```
- 使用扩展方法（.NET 6以前）
    ```cs
    try
    {
        await FooAsync(CancellationToken.None).TimeoutAfter(TimeSpan.FromSeconds(3));
        Console.WriteLine("Success!");
    }

    static class AsyncExtensions
    {
        public static async Task TimeoutAfter(this Task task, TimeSpan timeout)
        {
            using var cts = new CancellationTokenSource();
            var completedTask = await Task.WhenAny(task, Task.Delay(timeout, cts.tokne));
            if(completedTask != task)
            {
                cts.Cancel();
                throw new TimeoutExcepetion;
            }
            return await task;
        }
    }
    ```
- `WaitAsync` —— .NET 6.0 以后提供的新方法
    - 两种重载
        - `WaitAsync(TimeSpan)`
        - `WaitAsync(TimeSpan, CancelationToken)`
    - 用法
        ```cs
        var cts = new CancellationTokenSource();
        try
        {
            await FooAsync(cts.Token)
                .WaitAsync(TimeSpan.FromSeconds(3));
                // 会触发 TimeoutExcepetion 异常
            Console.WriteLine("Success!");
        }
        catch(TimeoutExcepetion)
        {
            cts.Cancel();
            Console.WriteLine("Timeout!");
        }
        //catch(AggregateException)
        //{
            // 这里是对 FooAsync 中 Task.Delay 中可能出现异常的处理
            // 但是在 FooAsync 中已经对 TaskCanceledException 的父类
            //  OperationCanceledException 进行了处理，所以可以去除
        //}
        finally
        {
            cts.Dispose();
        }

        async Task FooAsync(CancellationToken token)
        {
            try
            {
                Console.WriteLine("Foo Start...");
                await Task.Delay(5000, token);
                // 这里可能会抛出 TaskCanceledException
                // 如果没有捕获的话会跟着 当前方法FooAsync 的返回Task 一起
                // 往上抛出，会包装为 AggregateException 异常
                // 最后需要在一开始调用该函数的 try catch 中处理
                Console.WriteLine("Foo End...");
            } 
            catch(OperationCanceledException)
            {
                Console.WriteLine("Foo cancelled...");
            }
        }
        ```
        
        - 其中提到的异常往上包装，参考[MSDN: 任务取消](https://learn.microsoft.com/zh-cn/dotnet/standard/parallel-programming/task-cancellation)
            - 如果在等待的任务转换为“已取消”状态，就会引发 `System.Threading.Tasks.TaskCanceledException` 异常（包装在 `AggregateException` 异常中）。 此异常表示成功取消，而不是有错误的情况。 因此，任务的 `Exception` 属性返回 `null`。
- 或者直接在 `CancellationTokenSource` 构造时设定
    ```cs
    var cts = new CancellationTokenSource(TimeSpan.FromSeconds(3));
    try
    {
        var task = FooAsync(cts, cts.Token);
        await task; // 这里会直接在 FooAsync 中尝试处理 OperationCanceledException 异常
        Console.WriteLine("Success!");
    }
    catch(OperationCanceledException)
    {   // 如果 FooAsync 中处理了，这里就接收不到异常
        // 除非函数处理这个异常的时候加上了 “throw;” 抛出到这里
        Console.WriteLine("Timeout!");
    }
    //catch(TimeoutException)
    //{
        // 举一反三: 可以通过在 FooAsync 的
        // 对异常 OperationCanceledException 处理中加上:
        //      throw new TimeoutException();
        // 然后在这一层就需要处理 TimeoutException 异常
        // 但是会有混淆风险
    //}
    finally
    {
        cts.Dispose();
    }
    ```


---


## 其他问题
- 在异步任务中汇报进度？
- 如何在同步方法中调用异步方法？
- 有什么冷门点
    - `Console.Out.WriteLineAsync` 是 `Console.WriteLine` 的异步版本
    - 例如
        ```cs
        async void FooAsync() =>
            await Console.Out.WriteLineAsync("异步输出的超长字符串");
        ```


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
- 一些默认提供的，同步多线程所用
    - `ConcurrentBag`/`ConcurrentStack`/`ConcurrentQueue`
    - `BlockingCollection`
- 可用于异步编程的
    - `Channel`

### 使用 Channel 实现异步任务之间的通信
- 原有例子
    - 不能用于异步编程
        - 因为使用阻塞方法
        - 包括 `ConcurrentQueue` 其中也大多不使用异步
        - 与异步编程目标违背
    
    ```cs
    using System.Collections.Concurrent;

    // 建立一个承载 Message 类实例的 BlockingCollection
    // 构造时传入 ConcurrentQueue<Message> 作为后台实际容器
    var queue = new BlockingCollection<Message>(new ConcurrentQueue<Message>());

    // 定义生产者线程
    var sender = new Thread(SendMessageThread);
    // 定义消费者线程
    var receiver_1 = new Thread(ReceiveMessageThread);
    var receiver_2 = new Thread(ReceiveMessageThread);
    var receiver_3 = new Thread(ReceiveMessageThread);

    // 开始发送，其中 1 是 SendMessageThread 的参数
    sender.Start(1);
    // 开始接收，同理 2-4 是 ReceiveMessageThread 的参数
    receiver_1.Start(2);
    receiver_2.Start(3);
    receiver_3.Start(4);

    // 阻塞主线程到生产者线程完成，保证所有 message 都被接受
    sender.Join();
    Thread.Sleep(100); // 短暂等待

    // 中断消费者线程，触发 ThreadInterruptedException 异常
    receiver_1.Interrupt();
    receiver_2.Interrupt();
    receiver_3.Interrupt();
    
    // 阻塞主线程到消费者线程完成
    receiver_1.Join();
    receiver_2.Join();
    receiver_3.Join();

    Console.WriteLine("Press any key to exit...");
    Console.ReadKey();

    // 生成二十个 Message 实例，每次生成线程阻塞 100ms
    void SendMessageThread(object? arg)
    {
        // !是 C#8.0 开始引入的空值检查
        // 哪怕 arg == null 也仍然执行而不是抛出异常
        int id = (int)arg!;
        
        for (int i = 1; i <= 20; i++)
        {
            queue.Add(new Message(id, i.ToString()));
            Console.WriteLine($"Thread {id} sent {i}");
            Thread.Sleep(100);
        }
    }

    // 从队列中依次取出其中的 Message
    void ReceiveMessageThread(object? id)
    {
        try
        {
            // 使用轮询
            while(true)
            {
                // 实际自带信号量
                // 队列为空时阻塞，直到收到新消息被唤醒
                var message = queue.Take();
                Console.WriteLine($"Thread {id} received {message.Content} From {message.FromId}");
                Thread.Sleep(1);
            }
        }
        catch(ThreadInterruptedException)
        {
            Console.WriteLine($"Thread {id} interrupted.");
        }
    }

    // 产物
    record Message(int FromId, string Content);
    ```

- 对原生提供集合不了解情况下可能会做的操作
    - 对集合访问时加锁
    - 通过轮询判断生产者是否有产物可用
    - 使用 信号量/全局布尔值 判断生产者生产结束

- `Channel` 实际上具备如上功能
    - 可以用于异步编程的类似 `BlockingQueue` 的类
    - 相当一个自带信号量的 `ConcurrentQueue`
    
1. 直接用 `Channel` 替换 `BlockingQueue`
    ```cs
    using System.Collections.Concurrent;
    using System.Threading.Channels;

    // 可以使用 BoundedChannelOption 来存储要构建Channel的参数
    // 实际还有可设置参数更少的 UnboundedChannelOption
    //var option = new BoundedChannelOption()
    //{   
    //    // Capacity 可以直接在构造函数内输入
    //    Capacity = 100,
    //    // FullMode还有 DropNewest / DropOldest / DropWrite
    //    FullMode = BoundedChannelFullMode.Wait,
    //    SingleReader = true,
    //    SingleWriter = true
    //    // 还有一个通常在边界情况下考虑的设置
    //    // 高性能要求优化时考虑（一般忽略）
    //    // 对空 Channel 操作优化，避免信号量/入、出队
    //    // ,AllowSynchronousContinuations =
    //};

    // 建立一个承载 Message 类实例的 Channel
    // 还有 CreatedBounded 可选，使用 Create 方法获取
    var channel = Channel.CreateUnbounded<Message>();
    // 实际后台还是ConcurrentQueue

    var sender = new Thread(SendMessageThread);
    var receiver_1 = new Thread(ReceiveMessageThread);
    sender.Start(1);
    receiver_1.Start(2);
    sender.Join();
    Thread.Sleep(100);
    receiver_1.Interrupt();
    receiver_1.Join();

    Console.WriteLine("Press any key to exit...");
    Console.ReadKey();

    void SendMessageThread(object? arg)
    {
        int id = (int)arg!;

        for (int i = 1; i <= 20; i++)
        {   // Channel 实际也有同步方法，调用Writer的TryWrite方法
            if(channel.Writer.TryWrite(new Message(i,i.ToString())))
                Console.WriteLine($"Thread {id} sent {i}");
            Thread.Sleep(100);
        }
    }
    
    void ReceiveMessageThread(object? id)
    {
        try
        {
            while(true)
            {
                // 仅仅使用 Channel 取代 BlockingCollection
                if(channel.Reader.TryRead(out var message))
                    Console.WriteLine($"Thread {id} received {message.Content} From {message.FromId}");
                Thread.Sleep(1);
            }
        }
        catch(ThreadInterruptedException)
        {
            Console.WriteLine($"Thread {id} interrupted.");
        }
    }

    // 产物
    record Message(int FromId, string Content);
    ```

2. 异步化
    ```cs
    using System.Collections.Concurrent;
    using System.Threading.Channels;
    
    var channel = Channel.CreateUnbounded<Message>();
    using var cts = new CancellationTokenSource();

    var sender = SendMessageAsync(channel.Writer, 1);
    var receiver_1 = ReceiveMessageAsync(channel.Writer, 2, cts.Token);

    await sender;
    await Task.Delay(100);
    cts.Cancel();
    await receriver;

    Console.WriteLine("Press any key to exit...");
    Console.ReadKey();


    async Task SendMessageAsync(ChannelWriter<Message> writer, int id)
    {
        int id = (int)arg!;
        
        for (int i = 1; i <= 20; i++)
        {
            await writer.WriteAsync(new Message(id, i.ToString()));
            Console.WriteLine($"Thread {id} received {message.Content} From {message.FromId}");
            await Task.Delay(100);
        }
    }

    async Task ReceiveMessageAsync(ChannelReader<Message> reader, int id
                            , CancellationToken token)
    {
        try
        {   // 仍然轮询
            while(!token.IsCancellationRequest)
            {
                // 类似 BlockingCollection 中的 Take() 方法
                var message = await reader.ReadAsync(token);
                Console.WriteLine($"Thread {id} received {message.Content} From {message.FromId}");
            }
        }
        catch(OperationCanceledException)
        {
            Console.WriteLine($"Task {id} canceled.");
        }
    }

    // 产物
    record Message(int FromId, string Content);
    ```

3. 参照 GO 语言尝试优化
    - C# 中提供了类似 Golang 中 `Close()` 的方法
        - 同样类似一个**信号量**

    ```cs
    using System.Collections.Concurrent;
    using System.Threading.Channels;
    
    var channel = Channel.CreateUnbounded<Message>();

    var sender = SendMessageAsync(channel.Writer, 1);
    var receiver_1 = ReceiveMessageAsync(channel.Writer, 2);

    await sender;
    await Task.Delay(100);
    // 标记 Writer 写入完成
    channel.Writer.Complete();
    await receriver;

    Console.WriteLine("Press any key to exit...");
    Console.ReadKey();


    async Task SendMessageAsync(ChannelWriter<Message> writer, int id)
    {
        int id = (int)arg!;
        
        for (int i = 1; i <= 20; i++)
        {
            await writer.WriteAsync(new Message(id, i.ToString()));
            Console.WriteLine($"Thread {id} received {message.Content} From {message.FromId}");
            await Task.Delay(100);
        }
        // 如果生产者是单例，可以考虑直接
        //channel.Writer.Complete();
    }

    async Task ReceiveMessageAsync(ChannelReader<Message> reader, int id)
    {
        try
        {   // 当前轮开始前检查，触发条件: 
            // 1. writer 标记 Completed
            // 2. Channel 没有新消息
            while(!reader.Completion.IsCompleted)
            {
                var message = await reader.ReadAsync();
                Console.WriteLine($"Thread {id} received {message.Content} From {message.FromId}");
            }
        }
        // 仍然要捕捉异常，大多数占用都在 ReadAsync
        catch(ChannelClosedException)
        {
            Console.WriteLine($"Channel {id} closed.");
        }
    }

    // 产物
    record Message(int FromId, string Content);
    ```

4. 对 `ReceiveMessaggeAsync` 优化
    ```cs
    async Task ReceiveMessageAsync(ChannelReader<Message> reader, int id)
    {
        // ReadAllAsync 方法返回 C#8.0 提供的 IAsyncEnumable
        // 里面自带了对任务结束的处理，无需再捕捉异常
        await foreach(var item in reader.ReadAllAsync())
        {
            Console.WriteLine($"Thread {id} received {message.Content} From {message.FromId}");
        }
    }
    ```



---


## 第三方库
- `AsyncManualResetEvent`
    - 来自 `Microsoft.VisualStudio.Threading`
-  `AsyncLock`
    - 来自 `Nito.AsyncEx`
