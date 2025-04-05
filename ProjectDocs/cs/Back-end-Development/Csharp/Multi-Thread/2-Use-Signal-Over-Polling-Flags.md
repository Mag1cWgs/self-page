# 参考链接
- [十月的寒流: 在多线程开发中用信号量代替轮询和标志位](https://blog.coldwind.top/posts/use-signal-over-polling-flags/#用-blockingcollection-来实现生产者消费者模式)

# 传统方式：标志位/轮询

## 例子
- 例子
    - 标志位 `_shouldStop` 是 `volatile` 的，这样做能够保证编译器不会对其进行优化，从而保证每次读取都是最新的值。
    - 其实一般情况下，如果我们的轮询中包含了 `Thread.Sleep` 等操作，那么即便不加 `volatile`，也依旧是可以读到最新的值的。
    ```cs
    class MyService
    {
        // 使用 volatile 标记的标记位
        private volatile bool _shouldStop;

        // 待实例化的工作线程
        private Thread? _workerThread;

        public void Start()
        {
            // 标记前台线程
            _workerThread = new Thread(Worker);
            _shouldStop = false;
            _workerThread.Start();
        }

        public void Stop()
        {
            _shouldStop = true;
            _workerThread?.Join();
        }

        private void Worker()
        {
            //通过轮询它来判断线程是否需要继续执行
            while (_shouldStop)
            {
                // 执行一些工作
                Thread.Sleep(50); // 模拟工作
            }
        }
    }
    ```

- 如果我们想在上面的基础上再添加暂停和继续的功能，那么我们就需要添加更多的标志位和轮询逻辑
    ```cs
    class MyService
    {
        private volatile bool _shouldStop;
        private volatile bool _isRunning;

        private Thread? _workerThread;

        public void Start()
        {
            _workerThread = new Thread(Worker);
            _shouldStop = false;
            _isRunning = true;
            _workerThread.Start();
        }

        public void Stop()
        {
            _shouldStop = true;
            _workerThread?.Join();
        }

        public void Pause()
        {
            _isRunning = false;
        }

        public void Resume()
        {
            _isRunning = true;
        }

        private void Worker()
        {
            while (_shouldStop)
            {
                if (_isRunning)
                {
                    // 执行一些工作
                }

                Thread.Sleep(50); // 暂停时也要休眠，避免 CPU 占用过高
                
            }
        }
    }
    ```

## 经典标志位

### 用 ManualResetEvent 实现线程的暂停和继续
- `_isRunning` 的作用：
    - 我们想用它的值来控制线程是否要执行操作
    - 但是我们不能在它发生变化时立刻得到通知
    - 因此我们只能每隔一段时间去轮询一下。
- 替代思路
    - 为 `false` 时不需要我们轮询，而是直接阻塞
    - 等到变为 `true` 时再继续执行

- 根据这一需求，我们可以使用 `WaitHandle` 的两个子类——`ManualResetEvent` 及 `AutoResetEvent` 来实现。
    - `ManualResetEvent` 是一个可以手动重置的信号量。
        - 当它 Set 后，将会保持放行状态，直到再次 Reset 才会关闭。
    - 与它相对的是 `AutoResetEvent`，它会在每次放行后自动重置。

>[!tip]
> 参考 [基础概念](./1-Basic.md/#waithandle) 中对两个类的具体说明。

- 这里更符合我们的需求的是 `ManualResetEvent`，因为我们希望放行后能够连续执行多次，而不需要每次都 Set 后执行一次。
    ```cs
    class MyService
    {
        private volatile bool _shouldStop;
        private ManualResetEvent _isRunningEvent = new ManualResetEvent(false); // 初始是关闭的

        private Thread? _workerThread;

        public void Start()
        {
            _workerThread = new Thread(Worker);
            _shouldStop = false;
            _isRunningEvent.Set(); // 线程开始时放行
            _workerThread.Start();
        }

        public void Stop()
        {
            _shouldStop = true;
            _workerThread?.Join();
        }

        public void Pause()
        {
            _isRunningEvent.Reset(); // 关闭信号量
        }

        public void Resume()
        {
            _isRunningEvent.Set(); // 放行信号量
        }

        private void Worker()
        {
            while (_shouldStop)
            {
                _isRunningEvent.WaitOne(); // 等待信号量放行

                // 执行一些工作

                Thread.Sleep(50); // 适当休眠，避免 CPU 占用过高
            }
        }
    }

    ```

### 用 CancellationToken 实现任务的停止
- 使用 `CancellationToken` 来实现任务的停止。
    - `CancellationToken` 是 .NET 中用于取消操作的机制
    - 它可以在任务中传递一个取消请求，并且可以在任务中检查这个请求。
- 它不仅可以用于异步编程，也可以用于多线程编程。
- 这里，我们用它来取代 `_shouldStop` 标志位。

```cs
class MyService
{
    private ManualResetEvent _isRunningEvent 
                        = new ManualResetEvent(false); // 初始是关闭的

    private Thread? _workerThread;
    private CancellationTokenSource _cancellationTokenSource
                        = new CancellationTokenSource();

    public void Start()
    {
        _workerThread = new Thread(Worker);
        _isRunningEvent.Set(); // 线程开始时放行
        _workerThread.Start();
    }

    public void Stop()
    {
        _cancellationTokenSource.Cancel(); // 取消操作
        _workerThread?.Join();
    }

    public void Pause()
    {
        _isRunningEvent.Reset(); // 关闭信号量
    }

    public void Resume()
    {
        _isRunningEvent.Set(); // 放行信号量
    }

    private void Worker()
    {
        while (!_cancellationTokenSource.Token.IsCancellationRequested)
        {
            _isRunningEvent.WaitOne(); // 等待信号量放行

            // 执行一些工作

            Thread.Sleep(50); // 适当休眠，避免 CPU 占用过高
        }
    }
}
```


# 优化方式：消息队列

## 例子：生产——消费队列
- 经常会遇到需要使用一个队列来实现生产者消费者模式的情况，比如：
    ```cs
    class MyService
    {
        private readonly Queue<int> _queue = new Queue<int>();
        private readonly object _lock = new object();

        private volatile bool _shouldStop;
        private volatile bool _isRunning;

        private Thread? _workerThread;

        public void Start()
        {
            _workerThread = new Thread(Worker);
            _shouldStop = false;
            _isRunning = true;
            _workerThread.Start();
        }

        public void Stop()
        {
            _shouldStop = true;
            _workerThread?.Join();
        }

        // 省略 Pause 和 Resume 方法的实现

        public void Enqueue(int item)
        {
            lock (_lock)
            {
                _queue.Enqueue(item);
            }
        }

        public void Worker()
        {
            while (!_shouldStop)
            {
                lock (_lock)
                {
                    if (_queue.Count > 0 && _isRunning)  // 也可以使用 TryDequeue
                    {
                        var item = _queue.Dequeue();
                        // 处理 item
                    }
                }

                Thread.Sleep(50); // 暂停时也要休眠，避免 CPU 占用过高
            }
        }
    }
    ```

- 在上面的例子中，我们具体做了这样几件事情：
    1. 使用 `Queue` 来存储数据，并使用线程锁和 `lock` 语句来保证线程安全；
    2. 使用 `_shouldStop` 和 `_isRunning` 来控制线程的执行；
    3. 在 `Worker` 方法中使用 `lock` 来获取锁，并在队列不为空时获取传入的任务和进行处理；
    4. 暴露一个 `Enqueue` 方法来让生产者添加任务到队列中

## 线程安全的集合类型 ConcurrentQueue\<T\>
- 不需要手动加锁

```cs
class MyService
{
    private readonly ConcurrentQueue<int> _queue = new ConcurrentQueue<int>();

    public void Enqueue(int item)
    {
        _queue.Enqueue(item);
    }

    public void Worker()
    {
        while (!_shouldStop)//轮询
        {
            if (_isRunning && _queue.TryDequeue(out var item)) // 也可以使用 TryDequeue
            {
                // 处理 item
            }

            Thread.Sleep(50); // 暂停时也要休眠，避免 CPU 占用过高
        }
    }
}

```

## 用信号量取代标志位
- 上面的代码中，我们又用到了轮询。
    - 但是这个轮询本质上做的事情是等待队列中有数据可用。
- 基于这一思路，我们可以考虑用一个只在有新数据到来时才放行一次的信号量—
    - 也就是 `AutoResetEvent` 来替代它。

```cs
class MyService
{
    private readonly ConcurrentQueue<int> _queue = new ConcurrentQueue<int>();
    private readonly AutoResetEvent _queueEvent = new AutoResetEvent(false); // 初始是关闭的

    public void Enqueue(int item)
    {
        _queue.Enqueue(item);
        _queueEvent.Set(); // 放行信号量
    }

    public void Worker()
    {
        while (!_shouldStop)
        {
            _queueEvent.WaitOne(); // 等待信号量放行

            if (_isRunning && _queue.TryDequeue(out var item)) // 也可以使用 TryDequeue
            {
                // 处理 item
            }
        }
    }
}
```

- 但是这个例子并不好
    - 因为如果同时来了多条数据，那么我们虽然会调用多次 Set，但是信号量只会放行一次。
    - 可就有可能出现数据处理不及时的情况。
- 所以更好的方式是使用 `Semaphore`。
    - 它好比一扇宽度可变的大门。
    - 每次放行都会让门变宽一些
    - 而不像是 `AutoResetEvent` 那样只有开和关这两种状态。
- 不过这个例子我们就不演示了，因为我们有更好的方法。

## 用 BlockingCollection 来实现生产者消费者模式
- .NET 中已经提供了一个现成的类来实现生产者消费者模式——`BlockingCollection<T>`。
- 它是一个线程安全的集合类型，而且它还提供了阻塞和通知的功能。
- 我们可以直接用它来替代上面的 `ConcurrentQueue<T>` 和 `AutoResetEvent`


```cs
class MyService
{
    private readonly BlockingCollection<int> _queue = new BlockingCollection<int>();

    public void Enqueue(int item)
    {
        _queue.Add(item); // 添加数据到队列中
    }

    public void Worker()
    {
        while (!_shouldStop)
        {
            if (_isRunning && _queue.TryTake(out var item, Timeout.Infinite)) // 等待数据可用
            {
                // 处理 item
            }
        }
    }
}
```

- 这样，如果队列为空时，`TryTake` 会阻塞当前线程，直到有数据可用。
- 当调用 `Add` 方法时，`BlockingCollection<T>` 会自动放行等待的线程。
- 这样我们就不需要手动处理信号量了。

> [!note]
> 其实通过观察 `BlockingCollection<T>` 的源代码，我们不难发现它在底层用到了 `ConcurrentQueue<T>` 和 `SemaphoreSlim`。
> 此外，它底层使用的集合类型也是可变的，比如 `ConcurrentStack<T>` 和 `ConcurrentBag<T>` 等。我们可以通过传入不同的集合类型来实现不同的行为。
