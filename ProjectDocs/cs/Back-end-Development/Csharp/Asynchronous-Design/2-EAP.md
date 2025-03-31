# 介绍 EAP
- 实现了基于事件的异步模式的类将具有一个或者多个以Async为后缀的方法和对应的Completed事件，并且这些类都支持异步方法的取消、进度报告和报告结果。
- 在.NET类库中并不是所有的类都支持EAP的，只有部分的类支持（并且也只有部分类支持APM），这些类有(共17个类)：
    - System.Object的派生类型：
        - System.Activies.WorkflowInvoke　　
        - System.Deployment.Application.ApplicationDeployment
        - System.Deployment.Application.InPlaceHosingManager
        - System.Net.Mail.SmtpClient
        - System.Net.PeerToPeer.PeerNameResolver
        - System.Net.PeerToPeer.Collaboration.ContactManager
        - System.Net.PeerToPeer.Collaboration.Peer
        - System.Net.PeerToPeer.Collaboration.PeerContact
        - System.Net.PeerToPeer.Collaboration.PeerNearMe
        - System.ServiceModel.Activities.WorkflowControlClient
        - System.ServiceModel.Discovery.AnnoucementClient
        - System.ServiceModel.Discovery.DiscoveryClient
    - System.ComponentModel.Component的派生类型：
        - [System.ComponentModel.BackgroundWorker](http://msdn.microsoft.com/zh-cn/library/system.componentmodel.backgroundworker_members(v=vs.80).aspx)
        - [System.Media.SoundPlay](http://msdn.microsoft.com/zh-cn/library/system.media.soundplayer.aspx)
        - [System.Net.WebClient](http://msdn.microsoft.com/zh-cn/library/system.net.webclient(v=VS.80).aspx)
        - [System.Net.NetworkInformation.Ping](http://msdn.microsoft.com/zh-cn/library/system.net.networkinformation.ping.aspx)
        - [System.Windows.Forms.PictureBox](http://msdn.microsoft.com/zh-cn/library/system.windows.forms.picturebox.aspx)(继承于Control类，Control类派生于Component类)

- 当我们调用实现基于事件的异步模式的类的 `XxxAsync` 方法时，即代表开始了一个异步操作
    - 该方法调用完之后会使一个线程池线程去执行耗时的操作
    - 所以当UI线程调用该方法时，当然也就不会堵塞UI线程了。
- 并且基于事件的异步模式是建立了APM的基础之上的，而APM又是建立了在委托之上的。

# 通过 BackgroundWorker 看 EAP
- 下面就 BackgroundWorker 类来给大家详解解释EAP是建立在APM的基础上的。
- 该类在异步编程中经常使用的属性和方法：
    |BackgroundWorker类|说明|
    |-|-|
    |公共属性||
    |属性名|说明|
    |CancellationPending|获取一个值,指示应用程序是否已请求取消后台操作|
    |IsBusy|获取一个值,指示BackgroundWorker是否正在运行异步操作。|
    |WorkReportsProgress|获取或设置一个值,该值指示BackgroundWorker能否报告进度更新。|
    |WorkerSupportsCancellation|获取或设置一个值,该值指示BackgroundWorker是否支持异步取消。|
    |公共方法||
    |名称|说明|
    |CancelAsync|请求取消挂起的后台操作。|
    |ReportProgress|引发ProgressChanged事件|
    |RunWorkerAsync|开始执行后台操作。|
    |公共事件||
    |名称|说明|
    |DoWork|调用RunWorkerAsync时发生|
    |ProgressChanged|调用ReportProgress时发生|
    |RunWorkerCompleted|当后台操作已完成、被取消或引发异常时发生。|

## 为什么调用RunWorkerAsync方法就会触发DoWorker事件
1. RunWorkerAsync 方法的源码
    ```cs
    // RunWorkerAsync的源码什么都没有做，只是调用了该方法的重载方法RunWorkerAsync(object argument)方法
    public void RunWorkerAsync()
    {
        this.RunWorkerAsync(null);
    }

    // 下面就看看RunWorkerAsync带有一个参数的重载方法的源码
    public void RunWorkerAsync(object argument)
    {
        if (this.isRunning)
        {
            throw new InvalidOperationException(SR.GetString("BackgroundWorker_WorkerAlreadyRunning"));
        }
        // 这个方法把一些私有字段赋值
        // 这些赋值是为了我们使用isBusy公共属性来检查BackgroundWorker组件是否在运行异步操作
        // 和检查公共属性 CancellationPending属性来检查异步操作是否取消
        this.isRunning = true;
        this.cancellationPending = false;

        // AsyncOperation类是通过获得调用线程的同步上下文来实现跨线程访问，这个实现在APM专题中我们是自己通过代码来实现的，然而实现EAP的类在内容帮我们实现了，这样就不需要我们自己去解决这个问题了，从中也可以看出EAP的实现是基于APM的，只是实现EAP的类帮我们做了更多的背后的事情
        this.asyncOperation = AsyncOperationManager.CreateOperation(null);

        // 这里就是我们上一专题中介绍的使用委托实现的异步编程部分
        // 我们在EAP的类中调用了BeginInvoke方法，从而也可以证明EAP是基于APM的，所以APM的介绍很有必要。
        this.threadStart.BeginInvoke(argument, null, null);
    }
    ```

2. 我们从上面的代码可以看到调用 `RunWorkerAsync` 方法就是调用 `threadStart` 委托，我们要知道 `RunWorkerAsync` 方法到底背后发生了什么事情，就首先需要知道 `threadStart` 委托包装了哪个方法？并且需要知道委托在什么地方实例化。

3. 委托什么地方实例化的？
    - 谈到实例化当然大家首先想到的就是构造函数了
    - 不错，我们就看看BackgroundWorker构造函数：
        ```cs
        // 这里查看构造函数都是因为前面的分析
        // 从构造函数中我们可以确实可以看到threadStart委托是这里初始化的
        public BackgroundWorker()
        {
        // 初始化threadStart委托
            this.threadStart = new WorkerThreadStartDelegate(this.WorkerThreadStart);

        // 这里也初始化了操作完成委托和进度报告委托
            this.operationCompleted = new SendOrPostCallback(this.AsyncOperationCompleted);
            this.progressReporter = new SendOrPostCallback(this.ProgressReporter);
        }
        ```

4. 从构造函数中已经知道 `threadStart` 包装了 `WorkerThreadStart` 方法,从而解决了第一步的疑惑，接下来就让我们看看 `WorkerThreadStart` 方法的代码：
    ```cs
    private void WorkerThreadStart(object argument)
    {
        object result = null;
        Exception error = null;
        bool cancelled = false;
        try
        {
            DoWorkEventArgs e = new DoWorkEventArgs(argument);

            // 该方法中又是调用了onDoWork方法
            // 
            this.OnDoWork(e);
            if (e.Cancel)
            {
                cancelled = true;
            }
            else
            {
                result = e.Result;
            }
        }
        catch (Exception exception2)
        {
            error = exception2;
        }
        // 这里也解释了操作完成时会触发Completed事件
    // 分析过程和调用RunWorkerAsync方法触发DoWork事件类似
        RunWorkerCompletedEventArgs arg = new RunWorkerCompletedEventArgs(result, error, cancelled);
        this.asyncOperation.PostOperationCompleted(this.operationCompleted, arg);
    }
    ```

5. 上面的代码中可以知道 `WorkerThreadStart` 调用了受保护的 `OnDoWork` 方法,下面就让我们看看 `OnDoWork` 方法的代码，到这里我们离事物的本质已经不远了。
    ```cs
    // OnDoWork的源码
    protected virtual void OnDoWork(DoWorkEventArgs e)
    {
        // 从事件集合中获得委托对象
        DoWorkEventHandler handler = (DoWorkEventHandler) base.Events[doWorkKey];
        if (handler != null)
        {
            // 调用委托，也就是调用注册DoWork事件的方法
            // 我们在使用BackgroundWorker对象的时候，首先需要对它的DoWork事件进行注册        // 到这里就可以解释为什么调用RunWorkerAsync方法会触发DoWork事件了
            handler(this, e);
        }
    }

    // 当我们使用+=符号对DoWork事件进行注册时，背后调用确实Add方法，具体可以查看我的事件专题。
    public event DoWorkEventHandler DoWork
    {
        add
        {
            // 把注册的方法名添加进一个事件集合中
            // 这个事件集合也是类似一个字典，doWorkKey是注册方法的key,通过这个key就可以获得包装注册方法的委托
            base.Events.AddHandler(doWorkKey, value);
        }
        remove
        {
            base.Events.RemoveHandler(doWorkKey, value);
        }
    }
    ```

## 使用 BackgroundWorker 组件进行异步编程
```cs
// Begin Start Download file or Resume the download
private void btnDownload_Click(object sender, EventArgs e)
{
    if (bgWorkerFileDownload.IsBusy != true)
    {
            // Start the asynchronous operation
            // Fire DoWork Event 
            bgWorkerFileDownload.RunWorkerAsync();
            
            // Create an instance of the RequestState 
            requestState = new RequestState(downloadPath);
            requestState.filestream.Seek(DownloadSize, SeekOrigin.Begin);
            this.btnDownload.Enabled = false;
            this.btnPause.Enabled = true;
    }
    else
    {
        MessageBox.Show("正在执行操作，请稍后");
    }
}

// Pause Download
private void btnPause_Click(object sender, EventArgs e)
{
    if (bgWorkerFileDownload.IsBusy&&bgWorkerFileDownload.WorkerSupportsCancellation == true)
    {
        // Pause the asynchronous operation
        // Fire RunWorkerCompleted event
        bgWorkerFileDownload.CancelAsync();
    }
}

#region BackGroundWorker Event
// Occurs when RunWorkerAsync is called.
private void bgWorkerFileDownload_DoWork(object sender, DoWorkEventArgs e)
{
    // Get the source of event
    BackgroundWorker bgworker = sender as BackgroundWorker;
    try
    {
        // Do the DownLoad operation
        // Initialize an HttpWebRequest object
        HttpWebRequest myHttpWebRequest = (HttpWebRequest)WebRequest.Create(txbUrl.Text.Trim());

        // If the part of the file have been downloaded, 
        // The server should start sending data from the DownloadSize to the end of the data in the HTTP entity.
        if (DownloadSize != 0)
        {
            myHttpWebRequest.AddRange(DownloadSize);
        }

        // assign HttpWebRequest instance to its request field.
        requestState.request = myHttpWebRequest;
        requestState.response = (HttpWebResponse)myHttpWebRequest.GetResponse();     
        requestState.streamResponse = requestState.response.GetResponseStream();
        int readSize = 0;
        while (true)
        {
            if (bgworker.CancellationPending == true)
            {
                e.Cancel = true;
                break;
            }

            readSize = requestState.streamResponse.Read(requestState.BufferRead, 0, requestState.BufferRead.Length);
            if (readSize > 0)
            {
                DownloadSize += readSize;
                int percentComplete = (int)((float)DownloadSize / (float)totalSize * 100);
                requestState.filestream.Write(requestState.BufferRead, 0, readSize);

                // 报告进度，引发ProgressChanged事件的发生
                bgworker.ReportProgress(percentComplete);
            }
            else
            {
                break;
            }
        }
    }
    catch
    {
        throw;
    }
}

// Occurs when ReportProgress is called.
private void bgWorkerFileDownload_ProgressChanged(object sender, ProgressChangedEventArgs e)
{
    this.progressBar1.Value = e.ProgressPercentage;
}

// Occurs when the background operation has completed, has been canceled, or has raised an exception.
private void bgWorkerFileDownload_RunWorkerCompleted(object sender, RunWorkerCompletedEventArgs e)
{
    if (e.Error != null)
    {
        MessageBox.Show(e.Error.Message);
        requestState.response.Close();
    }
    else if (e.Cancelled)
    {
        MessageBox.Show(String.Format("下载暂停，下载的文件地址为：{0}\n 已经下载的字节数为: {1}字节", downloadPath, DownloadSize));
        requestState.response.Close();
        requestState.filestream.Close();

        this.btnDownload.Enabled = true;
        this.btnPause.Enabled = false;
    }
    else
    {
        MessageBox.Show(String.Format("下载已完成，下载的文件地址为：{0}，文件的总字节数为: {1}字节", downloadPath, totalSize));

        this.btnDownload.Enabled = false;
        this.btnPause.Enabled = false;
        requestState.response.Close();
        requestState.filestream.Close();
    }
}
#endregion

// Get Total Size of File
private void GetTotalSize()
{
    HttpWebRequest myHttpWebRequest = (HttpWebRequest)WebRequest.Create(txbUrl.Text.Trim());
    HttpWebResponse response = (HttpWebResponse)myHttpWebRequest.GetResponse();
    totalSize = response.ContentLength;
    response.Close();
}

// This class stores the State of the request.
public class RequestState
{
public int BufferSize = 2048;

public byte[] BufferRead;
public HttpWebRequest request;
public HttpWebResponse response;
public Stream streamResponse;

public FileStream filestream;
public RequestState(string downloadPath)
{
    BufferRead = new byte[BufferSize];
    request = null;
    streamResponse = null;
    filestream = new FileStream(downloadPath, FileMode.OpenOrCreate);
}
}
```

