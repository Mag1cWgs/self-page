# 介绍 TAP

## 背景
- APM / EAP 的缺点
    - 当使用APM的时候,首先我们要先定义用来包装回调方法的委托,这样难免有点繁琐,
    - 使用EAP的时候,我们又需要实现 `Completed` 事件和 `Progress` 事件，上面两种实现方式感觉都有点繁琐
- 因而出现了基于任务的异步编程模式
    - 该模式主要使用 `System.Threading.Tasks` 下的 `Task` 和 `Task<T>` 类来完成异步编程
    - 相对于前面两种异步模式来讲，TAP 使异步编程模式更加简单(因为这里我们只需要关注 `Task` 这个类的使用)，同时 TAP 也是微软推荐使用的异步编程模式

## 介绍
1. 如何识别使用了 TAP 模式？
    - 看到类中存在 `TaskAsync` 为后缀的方法时就代表该类实现了 TAP
2. TAP 比 EAP 好在哪里
    - 同样也支持异步操作的取消和进度的报告的功能,但是这两个实现都不像EAP中实现的那么复杂
        - 自定义实现EAP的类,我们需要定义多个事件和事件处理程序的委托类型和事件的参数
        - 在TAP实现中，我们只需要通过向异步方法传入 `CancellationToken` 参数
            - 因为在异步方法内部会对这个参数的 `IsCancellationRequested` 属性进行监控
            - 当异步方法收到一个取消请求时,异步方法将会退出执行
            - 具体这点可以使用反射工具查看 `WebClient` 的 `DownloadDataTaskAsync` 方法
    - 在TAP中,我们可以通过 `IProgress<T>` 接口来实现进度报告的功能

# 使用 TAP 

## 基于 TAP 的异步编程
- 建立一个名为 `Download File` 的方法
    ```cs
    // CancellationToken 参数赋值获得一个取消请求
    // progress 参数负责进度报告
    private void DownLoadFile(string url, CancellationToken ct, IProgress<int> progress)
    {
        HttpWebRequest request = null;
        HttpWebResponse response = null;
        Stream responseStream = null;
        int bufferSize = 2048;
        byte[] bufferBytes = new byte[bufferSize];

        try
        {
            request = (HttpWebRequest)WebRequest.Create(url);
            if (DownloadSize != 0)
            {
                request.AddRange(DownloadSize);
            }

            response = (HttpWebResponse)request.GetResponse();
            responseStream = response.GetResponseStream();
            int readSize = 0;
            while (true)
            {
                // 收到取消请求则退出异步操作
                if (ct.IsCancellationRequested == true)
                {
                    MessageBox.Show(String.Format("下载暂停，下载的文件地址为：{0}\n 已经下载的字节数为: {1}字节", downloadPath, DownloadSize));

                    response.Close();
                    filestream.Close();
                    sc.Post((state) =>
                        {   // 退出操作时将按钮设为可用
                            this.btnStart.Enabled = true;
                            this.btnStart.Text = "继续下载";
                            this.btnPause.Enabled = false;
                        }, null);

                    // 退出异步操作
                    break;
                }

                // 记录获取到的字节数
                readSize = responseStream.Read(bufferBytes, 0, bufferBytes.Length);
                if (readSize > 0)
                {
                    DownloadSize += readSize;
                    int percentComplete = (int)((float)DownloadSize / (float)totalSize * 100);
                    filestream.Write(bufferBytes, 0, readSize);

                    // 报告进度
                    progress.Report(percentComplete);
                }
                else
                {
                    MessageBox.Show(String.Format("下载已完成，下载的文件地址为：{0}，文件的总字节数为: {1}字节", downloadPath, totalSize));

                    sc.Post((state) =>
                    {
                        this.btnStart.Enabled = false;
                        this.btnPause.Enabled = false;
                    }, null);

                    response.Close();
                    filestream.Close();
                    break;
                }
            }      
        }
        catch (AggregateException ex)
        {
            // 因为调用Cancel方法会抛出OperationCanceledException异常
            // 将任何OperationCanceledException对象都视为以处理
            ex.Handle(e => e is OperationCanceledException);
        }
    }
    ```

- 在目标窗体事件中添加这个函数
    ```cs
    // Start DownLoad File
        private void btnStart_Click(object sender, EventArgs e)
        {
            filestream = new FileStream(downloadPath, FileMode.OpenOrCreate);
            this.btnStart.Enabled = false;
            this.btnPause.Enabled = true;

            filestream.Seek(DownloadSize, SeekOrigin.Begin);

            // 捕捉调用线程的同步上下文派生对象
            sc = SynchrnizationContext.Current;
            cts = new CancellationTokenSource();
            // 使用指定的操作初始化新的 Task。

            task = new Task(() => Actionmethod(cts.Token), cts.Token);

            // 启动 Task，并将它安排到当前的 TaskScheduler 中执行。 
            task.Start();

            //await DownLoadFileAsync(txbUrl.Text.Trim(), cts.Token,new Progress<int>(p => progressBar1.Value = p));
        }

        // 任务中执行的方法
        private void Actionmethod(CancellationToken ct)
        {
            // 使用同步上文文的Post方法把更新UI的方法让主线程执行
            DownLoadFile(txbUrl.Text.Trim(), ct, new Progress<int>(p => 
                {
                    sc.Post(new SendOrPostCallback((result)=>progressBar1.Value=(int)result),p);
                }));
        }

        // Pause Download
        private void btnPause_Click(object sender, EventArgs e)
        {
            // 发出一个取消请求
            cts.Cancel();
        }
    ```

# TAP 与 APM/EAP 间的转换

## 从 APM 到 TAP
- 在 `System.Threading.Tasks` 空间中，有一个工厂类 `TaskFactory`
    - 其中有一个方法 `FormAsync()`，可以将APM转换为TAP
```cs
// 大家可以对比这两种实现方式
#region 使用APM实现异步请求
private void APMWay()
{
    WebRequest webRq = WebRequest.Create("http://msdn.microsoft.com/zh-CN/");
    webRq.BeginGetResponse(result =>
    {
        WebResponse webResponse = null;
        try
        {
            webResponse = webRq.EndGetResponse(result);
            Console.WriteLine("请求的内容大小为： " + webResponse.ContentLength);
        }
        catch (WebException ex)
        {
            Console.WriteLine("异常发生，异常信息为： " + ex.GetBaseException().Message);
        }
        finally
        {
            if (webResponse != null)
            {
                webResponse.Close();
            }
        }
    }, null);
}

#endregion

#region 使用FromAsync方法将APM转换为TAP
private void APMswitchToTAP()
{
    WebRequest webRq = WebRequest.Create("http://msdn.microsoft.com/zh-CN/");
    Task.Factory.FromAsync<WebResponse>(webRq.BeginGetResponse, webRq.EndGetResponse, null, TaskCreationOptions.None).
        ContinueWith(t =>
        {
            WebResponse webResponse = null;
            try
            {
                webResponse = t.Result;
                Console.WriteLine("请求的内容大小为： " + webResponse.ContentLength);
            }
            catch (AggregateException ex)
            {
                if (ex.GetBaseException() is WebException)
                {
                    Console.WriteLine("异常发生，异常信息为： " + ex.GetBaseException().Message);
                }
                else
                {
                    throw;
                }
            }
            finally
            {
                if (webResponse != null)
                {
                    webResponse.Close();
                }
            }
        });
}

#endregion
```

## 从 EAP 到 TAP
```cs
#region 将EAP转换为TAP的实现方式

// webClient类支持基于事件的异步模式(EAP)
WebClient webClient = new WebClient();

// 创建TaskCompletionSource和它底层的Task对象
TaskCompletionSource<string> tcs = new TaskCompletionSource<string>();

// 一个string下载好之后，WebClient对象会应发DownloadStringCompleted事件
webClient.DownloadStringCompleted += (sender, e) =>
{
    // 下面的代码是在GUI线程上执行的
    // 设置Task状态
    if (e.Error != null)
    {
        // 试图将基础Tasks.Task<TResult>转换为Tasks.TaskStatus.Faulted状态
        tcs.TrySetException(e.Error);
    }
    else if (e.Cancelled)
    {
        // 试图将基础Tasks.Task<TResult>转换为Tasks.TaskStatus.Canceled状态
        tcs.TrySetCanceled();
    }
    else
    {
        // 试图将基础Tasks.Task<TResult>转换为TaskStatus.RanToCompletion状态。
        tcs.TrySetResult(e.Result);
    }
};

// 当Task完成时继续下面的Task,显示Task的状态
// 为了让下面的任务在GUI线程上执行，必须标记为TaskContinuationOptions.ExecuteSynchronously
// 如果没有这个标记，任务代码会在一个线程池线程上运行
tcs.Task.ContinueWith(t =>
{
    if (t.IsCanceled)
    {
        Console.WriteLine("操作已被取消");
    }
    else if (t.IsFaulted)
    {
        Console.WriteLine("异常发生，异常信息为：" + t.Exception.GetBaseException().Message);
    }
    else
    {
        Console.WriteLine(String.Format("操作已完成，结果为：{0}", t.Result));
    }
}, TaskContinuationOptions.ExecuteSynchronously);

// 开始异步操作
webClient.DownloadStringAsync(new Uri("http://msdn.microsoft.com/zh-CN/"));
#endregion
```
