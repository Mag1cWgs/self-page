# 基本概念

---

## 线程

### 什么是线程？
- **线程**是操作系统中能够独立运行的最小单位，也是程序中能够并发执行的一段指令序列
- 线程是**进程**的一部分，一个进程可以包含多个线程，这些**线程共享进程的资源**
- 进程有**入口线程**，也可以创建更多的线程

### 为什么要多线程？
- 批量重复任务希望同时进行
    - 比如对于数组中的每个元素都进行相同且耗时的操作
- 多个不同任务希望同时进行，互不干扰
    - 比如有多个后台线程需要做轮询等操作


---


## 线程池

- 一组预先创建的线程，可以被重复使用来执行多个任务
- 避免频繁地创建和销毁线程，从而减少了线程创建和销毁的开销，提高了系统的性能和效率
- 异步编程默认使用线程池


---


## 线程安全

### 线程安全
- 多个线程访问共享资源时，对共享资源的访问不会导致数据不一致或不可预期的结果
- 例子
    - 计数例子
        ```cs
        const int total = 100_000;
        int count = 0;

        // 为了保证一致性通常会选择加锁
        // object LockObj = new Object();

        var thread1 = new Thread(Increment);
        var thread2 = new Thread(Increment);

        thread1.Start();
        thread2.Start();

        thread1.Join();
        thread2.Join();

        Console.WriteLine($"Count: {count}");
        void Increment()
        {
            for (int i = 0; i < total; i++)
                //lock(LockObj)
                count++;
        }
        ```
    - 操作队列
        ```cs
        // .NET 中使用循环数组
        var queue = new Queue<int>();

        var producer = new Thread(Producer);
        var consumer1 = new Thread(Consumer);
        var consumer2 = new Thread(Consumer);

        // object LockObj = new object();

        producer.Start();
        consumer1.Start();
        consumer2.Start();

        producer.Join();
        Thread.Sleep(100); // Wait for consumers to finish

        consumer1.Interrupt();
        consumer2.Interrupt();
        consumer1.Join();
        consumer2.Join();

        void Producer()
        {
            for (int i = 0; i < 20; i++)
            {
                Thread.Sleep(20);
                queue.Enqueue(i);
            }
        }

        void Consumer()
        {
            try
            {
                while (true)
                {
                    // lock(LockObj)
                    if (queue.TryDequeue(out var res))
                        Console.WriteLine(res);

                    Thread.Sleep(1);
                }
            }
            catch (ThreadInterruptedException)
            {
                Console.WriteLine("Thread interrupted.");
            }
        }
        ```


### 同步机制
- 用于协调和控制多个线程之间**执行顺序**和**互斥访问**共享资源
    - `lock` 实际就是一种互斥锁
- 确保线程按照特定的顺序执行，避免竞态条件和数据不一致的问题

### 原子操作
- 在执行过程中不会被中断的操作。不可分割，要么完全执行，要么完全不执行，没有中间状态
- 在多线程环境下，原子操作能够保证数据的一致性和可靠性，避免出现竞态条件和数据竞争的问题

- 实现例子
    - `Interlocked` 类，其对应方法有 `Add`/`Or`/`And`/`Decrement`/...
    - 传入参数是 `ref` 到的变量
    - 使用操作系统底层方法


---


## 常用实现方式
- 线程 `Thread`
- 线程池 `ThreadPool`
- 异步编程 `async`/`await`
- 自带方法
    - `Parallel`
        - `For`/`ForEach`/`Invoke`
    - `PLINQ` 并行化 LINQ
        - `AsParallel`/`AsSequential`
        - `AsOrdered`



---



# 线程 Thread 实战

## 线程的创建
- 创建 `Thread` 实例，并传入 `ThreadStart` 委托
    - 还可以配置线程，如是否为后台线程
- 调用 `Thread.Start` 方法启动，可以调用时传参

## 线程的终止
- 调用 `Thread.Join` 方法，等待线程的结束
    - 在主线程上创建子线程后，如果调用 `Join` 方法，主线程会被阻塞，直到子线程结束后才会被释放

- 调用 `Thread.Interrupt` 方法，中断线程的执行
    - 会在相应线程中抛出 `ThreadInterruptedException`
    - 如果线程中包含一个 `while(true)` 循环，那么需要保证包含等待方法
        - 如 IO操作 / `Thread.Sleep` 操作(甚至可以 `Thread.Sleep(0)`)
        - 如果不含有一个等待方法，该线程会占满时间片，从而无法接收外界的中断操作信息

- 不能用 `Abort` 方法
    - 使用 `Abort` 方法来强制终止线程可能导致一些严重的问题，包括资源泄漏和不可预测的行为
    - 较新版本的 .NET 中如果使用这个方法，会报  `PlatformNotSupportedException`
        - 老版本 .NET Framework 不会抛出
    - 推荐使用 `Thread.Interrupt` 或 `CancellationToken`

- 例子
    ```cs
    var thread = new Thread(() =>
    {
        try
        {
            // 10 次循环
            for (int i = 0; i < 10; i++)
            {
                // 每次循环都需要 1 秒
                Thread.Sleep(1000);
                Console.WriteLine("Sub thread: " + i);
            }
        }
        catch (ThreadInterruptedException)
        {
            Console.WriteLine("Thread interrupted");
        }
        finally
        {
            Console.WriteLine("Thread is FINISHED!");
        }
    }){   // 线程构造函数配置
        IsBackground = true, Priority = ThreadPriority.Normal
    };

    thread.Start();
    // 主线程等待 3.5 秒
    Thread.Sleep(3500);
    // 结束子线程
    thread.Interrupt();
    thread.Join(); // 子线程已经被结束，无法 Join
    Console.WriteLine("Done");
    ```


## 线程的挂起与恢复
-  `Thread.Suspend` 以及 `Thread.Resume`
- 较新版本的 .NET 中，这两个方法已经被标记为 `[Obsolete]`，且调用会报错
- 推荐使用锁、信号量等方式实现这一逻辑



---



# 线程安全/同步机制 Thread-Safety

## 原子操作 Interlocked

---

## 锁与信号量

### lock & Monitor
- `lock` 底层基于 `Monitor`
- 例子
    ```cs
    // 源码
        var obj = new object();
        lock (obj)
        {
            Console.WriteLine("123");
        }

    // CLR 生成
        object obj = new object();
        // 引用锁
        object obj2 = obj;
        // 标志量
        bool lockTaken = false;
        try
        {
            // 阻塞方法，尝试判断锁是否被使用
            // 未被占用则继续
            Monitor.Enter(obj2, ref lockTaken);
            Console.WriteLine("123");
        }
        finally
        {   // 如果使用了锁
            if (lockTaken)
            {   // 正确释放锁
                Monitor.Exit(obj2);
            }
        }
    ```

### Mutex
- 进程间共享的互斥锁

### Semaphore
- 单词本意是「旗语」
- 用于线程间同步，控制并发，信号量的pv操作

- 例子
    - 原型
        ```cs
        var inputs = Enumerable.Range(1,20).ToArray();
        var sw = Stopwatch.StartNew();
        // 使用 PLINQ 进行并行操作
        var outputs = inputs.AsParallel()
                            .Asordered()
                            .Select(HeavyJob)
                            .ToArray();
        Console.WriteLine("Outputs:");
        Console.Writeline(string.Join(",",outputs));
        Console.WriteLine($"Elapsed time: {sw.ElapsedMilliseconds}ms ");    // 384 ms

        // 模拟函数
        int HeavyJob(int input)
        {
            Thread.Sleep(300);
            return input * input;
        }
        ```
    - 如果需要限制线程使用
        ```cs
        var inputs = Enumerable.Range(1,20).ToArray();
        var sw = Stopwatch.StartNew();
        // 使用 Semaphore，构造参数是 起始线程数, 最大线程数
        // 还可以三参数构造，在原有两个参数后面加上一个
        var semaphore = new Samaphore(3,3); // 起始3线程, 最多3线程
        // 使用 PLINQ 进行并行操作
        var outputs = inputs.AsParallel()
                            .Asordered()
                            .Select(HeavyJob)
                            .ToArray();
        Console.WriteLine("Outputs:");
        Console.Writeline(string.Join(",",outputs));
        Console.WriteLine($"Elapsed time: {sw.ElapsedMilliseconds}ms ");    // 2222 ms

        // 使用后需要销毁
        semaphore.Dispose();

        // 模拟函数
        int HeavyJob(int input)
        {
            // 调用阻塞的 WaitOne() 方法，等待空闲进程
            semaphore.WaitOne();
            Thread.Sleep(300);
            // 完成业务后要释放当前进程
            semaphore.Release();
            return input * input;
        }
        ```

### WaitHandle
- 信号量，有两个派生类

-  ManualResetEvent
    - 通过信号状态控制开闭

    >[!note]
    > - `ManualResetEvent` 在创建的时候可以设置信号状态
    >     ```cs
    >     ManualResetEvent manualResetEvent = new ManualResetEvent(false);
    >     ```
    > 
    > - `ManualResetEvent.WaitOne()` 作用是等待信号到达
    >     - 如果没有信号就会让线程再此等待
    >     - 简单说就是信号状态为 `True` 的时候才会继续执行，信号状态为 `False` > 时，线程会卡在这里
    > - `ManualResetEvent.Set()` 就是将信号状态设置为 `True`，也就是会让 > `WaitOne` 能够接受信号
    > - `ManualResetEvent.Reset()`，将信号状态设置为 `False`，也就是设置为非信号 状态

- AutoResetEvent

>[!note|label:Manual与Auto的区别]
> 区别主要在于：
> 1. 如果有多个线程都在用 `WaitOne` 等待信号量，那么每次 `Set()`，auto只会释放> 一个 `WaitOne`，而manual会全部释放
> 2. 调用 `WaitOne` 后，auto会自动调用 `Reset()` 方法，而manual则会保持开放
> 
> - 注意这里是两个子类的区别
>     - `ManualResetEvent` 发送信号后，信号状态会设置为 `True`，也就是此时程> 序只要执行到 `WaitOne()` 就会接收到信号，只有调用 `Reset` 的时候信号状态> 才会被设置为False
>     - `AutoResetEvent` 将信号状态会设置为 True 后自动调用 Reset，将非信号状> 态立即设置为 False，如果此时有 `WaitOne()` 函数在等待信号，则会执行，之> 后的 `WaitOne()` 则不会接收到信号

### ReaderWriterLock
- 读写锁
    - 理解为安全度更高一些的互斥锁
        - 写操作优先于读操作
        - 写操作一次只能有一个线程访问
        - 读操作可以多线程读


---


## 轻量型
- SemaphoreSlim
- ManualResetEventSlim
- ReaderWriterLockSlim


---


## 使用现有类

### 线程安全的单例：Lazy
- 使用 `Lazy` 代替两次确认（`!=null`->`lock`->`!=null`）
- 使用 IOC 容器注册单例
- 使用日志工具

### 线程安全的集合类型
- `ConcurrentBag`
    - 无所谓顺序
- `ConcurrentStack`
    - 后进先出
- `ConcurrentQueue`
    - 先进先出
    ```cs
    using System.Collections.Concurrent;

    // 使用 ConcurrentQueue 无需加锁保证线程安全
    var queue = new ConcurrentQueue<int>();

    var producer = new Thread(AddNumbers);
    var consumer1 = new Thread(ReadNumbers);
    var consumer2 = new Thread(ReadNumbers);

    producer.Start();
    consumer1.Start();
    consumer2.Start();

    producer.Join();
    consumer1.Interrupt();
    consumer2.Interrupt();
    consumer1.Join();
    consumer2.Join();

    void AddNumbers()
    {
        for (int i = 0; i< 20; i++)
        {
            Thread.Sleep(millisecondsTimeout:20);
            // ConcurrentQueue 保证写入时线程安全
            queue.Enqueue(i);
        }
    }

    void ReadNumbers()
    {
        try
        {
            while (true)
            {   // 使用 Try 实现线程安全的访问
                if (queue.TryDequeue(out var res))
                    Console.WriteLine(res);
                Thread.Sleep(1);
            }
        }
        catch (ThreadInterruptedException)
        {
            Console.WriteLine("Thread interrupted.");
        }
    }
    ```

- `ConcurrentDictionary`
    - 线程安全的 `Dictionary`

### 阻塞集合：BlockingCollection
- 低延迟要求优先考虑
- 生产者-消费者模型
    - 每次生产完成时通知消费者取用
- 不需要加锁/使用信号量通知
- 除了信号量/阻塞集合之外可以考虑轮询
    - CPU占用较高

### 通道：Channel
- 高吞吐量时优先考虑

### 原子操作：Interlocked

### 周期任务：PeriodicTimer
