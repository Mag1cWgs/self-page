# 介绍 APM / 异步编程模型
## 什么是APM？
- APM即异步编程模型的简写（Asynchronous Programming Model）
- 使用以 `BeginXXX` 和 `EndXXX` 类似的方法的时候，即在使用异步编程模型来编写程序
- 异步编写模型是一种模式
    - 该模式允许用更少的线程去做更多的操作
    - .NET Framework 很多类也实现了该模式
    - 也可以自定义类来实现该模式
        - 在自定义的类中实现返回类型为 `IAsyncResult` 接口的 `BeginXXX` 方法和 `EndXXX` 方法
    - 另外委托类型也定义了 `BeginInvoke` 和 `EndInvoke` 方法
    - 并且我们使用WSDL.exe和SvcUtil.exe工具来生成Web服务的代理类型时，也会生成使用了APM的BeginXxx和EndXxx方法。

## 如何实现？
下面就具体就拿 `FileStream` 的 `BeginRead` 和 `EndRead` 方法来介绍下下异步编程模型的实现。

### Begin 方法 —— 开始执行异步操作

1. **同步方法 Read**
    - 当需要读取文件中的内容时，我们通常会采用 `FileStream` 的同步方法 `Read` 来读取
    - 该同步方法的定义为：
    ```cs
    // 从文件流中读取字节块并将该数据写入给定的字节数组中
    // array 代表把读取的字节块写入的缓存区
    // offset 代表 array 的字节偏量，将在此处读取字节
    // count 代表最多读取的字节数
    public override int Read(byte[] array, int offset, int count )
    ```

2. **同步方法的问题**
    - 该同步方法会堵塞执行的线程
    - 当一个WinForm程序需要实现读取一个大文件的内容然后把内容显示在界面时
        - 如果我们调用该方法去读取文件的内容时，此时Read方法会堵塞UI线程
        - 在读取文件内容没有完成之前，用户不能对窗体进行任何的操作，包括关闭应用程序
        - 此时用户看到的该窗体会出现无法响应，这样就给用户带来不好一个用户体验

3. **解决方法**
    - 从用户角度来看是用户体验不好
    - 能不能让读取文件操作在另外一个线程中执行
        - 这样就不会堵塞UI线程
        - 这时候UI线程继续做属于自己的事情，即响应用户的操作。
    - 即通过 `BeginRead` 方法来实现异步编程，使读取操作不再堵塞UI线程。

4. **异步方法**
    - `BeginRead` 方法代表异步执行 `Read` 操作，并返回实现 `IAsyncResult` 接口的对象
        - 该对象存储着异步操作的信息
    - 下面就看下 `BeginRead` 方法的定义，看看与同步 `Read` 的方法区别在哪里的
    ```cs
    // 开始异步读操作
    // 前面的3个参数和同步方法代表的意思一样
    // userCallback 代表当异步IO操作完成时，你希望由一个线程池线程执行的方法,该方法必须匹配 AsyncCallback 委托
    // stateObject 代表你希望转发给回调方法的一个对象的引用，在回调方法中，可以查询 IAsyncResult 接口的 AsyncState 属性来访问该对象
    public override IAsyncResult BeginRead(byte[] array, int offset, int numBytes, 
                            AsyncCallback userCallback, Object stateObject)
    ```

5. **异步方法和同步方法的区别**
    - 如果你在使用异步方法 `BeginRead` 时，不希望异步操作完成后调用任何代码，你可以把userCallback参数设置为null。
    - 异步方法 `BeginRead` 不会堵塞UI线程
        - 因为调用该方法后，该方法会立即把控制权返回给调用线程
        - 如果是UI线程来调用该方法时，即返回给UI线程
    - 然而同步 `Read` 却不是这样
        - 同步方法是等该操作完成之后返回读取的内容之后才返回给调用线程
        - 从而导致在操作完成之前调用线程就一直等待状态。

### End 方法 —— 结束异步操作
- 所有BeginXxx方法返回的都是实现了 `IAsyncResult` 接口的一个对象
    - 并不是对应的同步方法所要得到的结果的
- 此时我们需要调用对应的EndXxx方法来结束异步操作，并向该方法传递 `IAsyncResult` 对象
    - `EndXxx` 方法的返回类型就是和同步方法一样的
    - 例如，`FileStream` 的 `EndRead` 方法返回一个 `Int32` 来代表从文件流中实际读取的字节数

- 对于访问异步操作的结果，APM提供了四种方式供开发人员选择：
    1. 在调用 `BeginXxx` 方法的线程上调用 `EndXxx` 方法来得到异步操作的结果
        - 但是这种方式会阻塞调用线程
        - 直到操作完成之后调用线程才继续运行
    2. 查询 IAsyncResu`lt 的 `AsyncWaitHandle` 属性
        - 从而得到 `WaitHandle`
        - 然后再调用它的 `WaitOne` 方法来使一个线程阻塞并等待操作完成
        - 再调用 `EndXxx` 方法来获得操作的结果。
    3. 循环查询 `IAsyncResult` 的 `IsComplete` 属性
        - 操作完成后再调用 `EndXxx` 方法来获得操作返回的结果。
    4. 使用 `AsyncCallback` 委托来指定操作完成时要调用的方法
        - 在操作完成后调用的方法中调用 `EndXxx` 操作来获得异步操作的结果。
- 在上面的4种方式中，第4种方式是APM的首选方式
    - 因为此时不会阻塞执行BeginXxx方法的线程
    - 然而其他三种都会阻塞调用线程，相当于效果和使用同步方法是一样
    - 在实际异步编程中都是使用委托的方式。

### 总结：如何识别某个类实现异步编程模型
- 只需要看是否有以下两个方法
   - `BeginXxx` 方法(当然返回类型需要是 `IAsyncResult` )
   - `EndXxx` 方法(同样)

> [!note]
> - 异步编程模型模式是微软利用委托和线程池帮助我们实现的一个模式
> - 该模式利用一个线程池线程去执行一个操作
>   - 在 `FileStream` 类 `BeginRead` 方法中就是执行一个读取文件操作
>   - 该线程池线程会立即将控制权返回给调用线程
>   - 此时线程池线程在后台进行这个异步操作；
>   - 异步操作完成之后，通过回调函数来获取异步操作返回的结果。
>   - 此时就是利用委托的机制。
> - 所以说各种异步编程模式都是利用委托和线程池搞出来的
>   - 包括后面的 基于事件的异步编程 和 基于任务的异步编程
>   - 还有C# 5中的 `async` 和 `await` 关键字
> - 本质其实一致，只是后面提出来的使异步编程更加简单罢了。

> [!tip]
> - `FileStream` 对象默认情况下是同步打开操作系统句柄
> - 当我们创建一个 `FileStream` 对象
>     - 没有为其指定 `FileOptions.Asynchronous` 参数 或者 没有显示指定 > `useAsync` 为`true` 时
>     - Windows 操作系统会以同步的方法执行所有的文件操作，即使此时你还是可以调用 > `BeginRead` 方法
>     - 但是这样对于你的应用程序，操作只是表面上是异步执行的，但 `FileStream` 类在内> 部会用另一个线程模拟异步行为。
> - 当指定了 `FileOptions.Asynchronous` 参数时，然后我们仍然可以调用 `Read` 同步方> 法
>     - 此时在内部，`FileStream` 类会开始一个异步操作，并立即使调用线程进入睡眠状> 态，直到操作完成才会唤醒
>     - 通过这样来模拟同步行为
> - 因此在使用 `FileStream` 对象时，需要先决定是同步执行还是异步执行。
>     - 并显式地指定 `FileOptions.Asynchronous` 参数或 `useAsync` 参数。


# APM 代码示例
- 使用控制台程序做演示

## 同步方法
- 如果我们调用的是同步方法时，此时会堵塞主线程，直到文件的下载操作被完成之后主线程才继续执行后面的代码

```cs
#region Download File Synchrously
private static void DownLoadFileSync(string url)
{
    // 建立 RequestState 实例
    RequestState requestState=new RequestState();
    try
    {
        // 初始化 HttpWebRequest 对象
        HttpWebRequest myHttpWebRequest = (HttpWebRequest)WebRequest.Create(url);

        // 分配 HttpWebRequest 实例到目标域
        requestState.request = myHttpWebRequest;
        requestState.response = (HttpWebResponse)myHttpWebRequest.GetResponse();
        requestState.streamResponse = requestState.response.GetResponseStream();
        int readSize = requestState.streamResponse.Read(requestState.BufferRead, 0, requestState.BufferRead.Length);
        while (readSize > 0)
        {
            requestState.filestream.Write(requestState.BufferRead, 0, readSize);
            readSize = requestState.streamResponse.Read(requestState.BufferRead, 0, requestState.BufferRead.Length);
        }

        Console.WriteLine("\nThe Length of the File is: {0}", requestState.filestream.Length);
        Console.WriteLine("DownLoad Completely, Download path is: {0}", requestState.savepath);
    }
    catch (Exception e)
    {
        Console.WriteLine("Error Message is:{0}", e.Message);
    }
    finally
    {
        requestState.response.Close();
        requestState.filestream.Close();
    }
}
#endregion
```


## 异步方法
- 在主线程中调用 `DownloadFileAsync(downUrl)` 方法时
    - 方法中的 `myHttpWebRequest.BeginGetResponse` 
    - 调用时没有阻塞调用线程(即主线程)，而是立即返回到主线程
    - 主线程后面的代码可以立即执行

```cs
#region use APM to download file asynchronously

// 
private static void DownloadFileAsync(string url)
{
    try
    {
        // 初始化 HttpWebRequest 实例
        HttpWebRequest myHttpWebRequest = (HttpWebRequest)WebRequest.Create(url);

        // 创建 RequestState 示例，并且将HttpWebRequest实例分配给它的请求字段。
        RequestState requestState = new RequestState();
        requestState.request = myHttpWebRequest;
        // 对 HttpWebRequest 实例调用 BeginGetResponse 方法
        // 返回新的 AsyncCallback 实例，以调用 ResponseCallback 方法
        myHttpWebRequest.BeginGetResponse(new AsyncCallback(ResponseCallback), requestState);
    }
    catch (Exception e)
    {
        Console.WriteLine("Error Message is:{0}",e.Message);
    }
}

// 当每个异步操作完成时调用以下方法。
private static void ResponseCallback(IAsyncResult callbackresult)
{
    // 获取RequestState对象
    RequestState myRequestState = (RequestState)callbackresult.AsyncState;
    HttpWebRequest myHttpRequest = myRequestState.request;

    // 结束对Internet资源的异步请求
    myRequestState.response = (HttpWebResponse)myHttpRequest.EndGetResponse(callbackresult);
    
    // 从服务器获取响应流
    Stream responseStream = myRequestState.response.GetResponseStream();
    myRequestState.streamResponse = responseStream;

    IAsyncResult asynchronousRead = responseStream.BeginRead(myRequestState.BufferRead, 0,
                myRequestState.BufferRead.Length,
                ReadCallBack, myRequestState);         
}

// 向FileStream写入字节
// 回调方法
private static void ReadCallBack(IAsyncResult asyncResult)
{
    try
    {
        // 获取RequestState对象
        RequestState myRequestState = (RequestState)asyncResult.AsyncState;

        // 从服务器获取响应流
        Stream responserStream = myRequestState.streamResponse;

        // 调用 EndRead 方法获取异步结果
        int readSize = responserStream.EndRead(asyncResult);
        if (readSize > 0)
        {
            myRequestState.filestream.Write(myRequestState.BufferRead, 0, readSize);
            responserStream.BeginRead(myRequestState.BufferRead, 0, myRequestState.BufferRead.Length, ReadCallBack, myRequestState);
        }
        else
        {
            Console.WriteLine("\nThe Length of the File is: {0}", myRequestState.filestream.Length);
            Console.WriteLine("DownLoad Completely, Download path is: {0}", myRequestState.savepath);
            myRequestState.response.Close();
            myRequestState.filestream.Close();
        }        
    }
    catch (Exception e)
    {
        Console.WriteLine("Error Message is:{0}", e.Message);
    }
}
#endregion
```


# 使用委托实现异步编程
- 委托类型也会定义了 `BeginInvoke` 方法和 `EndInvoke` 方法
    - 所以委托类型也实现了异步编程模型
    - 所以可以使用委托的 `BeginInvoke` 和 `EndInvoke` 方法来回调同步方法从而实现异步编程。
- 调用委托的 `BeginInvoke` 方法来执行一个同步方法时
    - 此时会使用线程池线程回调这个同步方法并立即返回到调用线程中
    - 由于耗时操作在另外一个线程上运行
    - 所以执行 `BeginInvoke` 方法的主线程就不会被堵塞。
- 但是这里存在的一个问题时，因为同步方法在另外一个线程中执行的，然而我们怎么把同步方法执行的状态反应到UI界面上来呢？
    - 因为在GUI应用程序（包括 Windows 窗体，WPF 和 Silverlight ）中
        - 创建窗口的线程是唯一能够对那个窗口进行更新的线程
        - 所以在执行同步方法的线程就不能对窗口中的控件进行操作
        - 也就不能把方法允许的结果反应到窗体上了。
- 这里有两种解决方案
    1. 设置控件的 `CheckForIllegalCrossThreadCalls` 属性为 `false`
        - 设置为 `false` 的意思代表允许跨线程调用
        - 这种方式虽然可以解决该问题，但是不推荐，因为它违背了.NET安全规范
    2. 使用 `SynchronizationContext` 基类
        - 该类记录着线程的同步上下文对象
        - 我们可以通过在 GUI 线程中调用 `SynchronizationContext.Current` 属性来获得 GUI 线程的同步上下文
        - 然后当线程池线程需要更新窗体时，可以调用保存的 `SynchronizationContext` 派生对象的 `Post` 方法
            - `Post` 方法会将回调函数送到GUI线程的队列中
            - 每个线程都有各自的操作队列的，线程的执行都是从这个队列中拿方法去执行
        - 向 `Post` 方法传递要由GUI线程调用的方法
            - 该方法的定义要匹配 `SendOrPostCallback` 委托的签名
        - 还需要向 `Post` 方法传递一个要传给回调方法的参数。

## 解决方案一的示例
```cs
View Code 

 // 定义用来实现异步编程的委托
private delegate string AsyncMethodCaller(string fileurl);

public Mainform()
{
    InitializeComponent();
    txbUrl.Text = "http://download.microsoft.com/download/7/0/3/703455ee-a747-4cc8-bd3e-98a615c3aedb/dotNetFx35setup.exe";
    
    // 允许跨线程调用
    // 实际开发中不建议这样做的，违背了.NET 安全规范
    CheckForIllegalCrossThreadCalls = false;
}

// 下载按钮的点击事件
private void btnDownLoad_Click(object sender, EventArgs e)
{
    rtbState.Text = "Download............";
    if (txbUrl.Text == string.Empty)
    {
        MessageBox.Show("Please input valid download file url");
        return;
    }

    // 设置回调对象，回调执行函数 DownLoadFileSync
    // 使用 BeginInvoke 进行异步操作
    AsyncMethodCaller methodCaller = new AsyncMethodCaller(DownLoadFileSync);
    methodCaller.BeginInvoke(txbUrl.Text.Trim(), GetResult, null);
}

// 同步下载文件的方法
// 该方法会阻塞主线程，使用户无法对界面进行操作
// 在文件下载完成之前，用户甚至都不能关闭运行的程序。
private string DownLoadFileSync(string url)
{
    // Create an instance of the RequestState 
    RequestState requestState = new RequestState();
    try
    {
        // Initialize an HttpWebRequest object
        HttpWebRequest myHttpWebRequest = (HttpWebRequest)WebRequest.Create(url);

        // assign HttpWebRequest instance to its request field.
        requestState.request = myHttpWebRequest;
        requestState.response = (HttpWebResponse)myHttpWebRequest.GetResponse();
        requestState.streamResponse = requestState.response.GetResponseStream();
        int readSize = requestState.streamResponse.Read(requestState.BufferRead, 0, requestState.BufferRead.Length);
        
        while (readSize > 0)
        {
            requestState.filestream.Write(requestState.BufferRead, 0, readSize);
            readSize = requestState.streamResponse.Read(requestState.BufferRead, 0, requestState.BufferRead.Length);
        }

        // 执行该方法的线程是线程池线程，该线程不是与创建richTextBox控件的线程不是一个线程
        // 如果不把 CheckForIllegalCrossThreadCalls 设置为false，该程序会出现“不能跨线程访问控件”的异常
        return string.Format("The Length of the File is: {0}", requestState.filestream.Length) + string.Format("\nDownLoad Completely, Download path is: {0}", requestState.savepath);
    }
    catch (Exception e)
    {
        return string.Format("Exception occurs in DownLoadFileSync method, Error Message is:{0}", e.Message);
    }
    finally
    {
        requestState.response.Close();
        requestState.filestream.Close();
    }
}

// 异步操作完成时执行的方法
private void GetResult(IAsyncResult result)
{
    AsyncMethodCaller caller = (AsyncMethodCaller)((AsyncResult)result).AsyncDelegate;
    // 调用EndInvoke去等待异步调用完成并且获得返回值
    // 如果异步调用尚未完成，则 EndInvoke 会一直阻止调用线程，直到异步调用完成
    string returnstring= caller.EndInvoke(result);
    //sc.Post(ShowState,resultvalue);
    rtbState.Text = returnstring;        
}
```

## 解决方案二的实例（同步上下文）
```cs
public partial class MainForm : Form
{
    // 定义用来实现异步编程的委托
    private delegate string AsyncMethodCaller(string fileurl);

        // 定义显示状态的委托
    private delegate void ShowStateDelegate(string value);
    private ShowStateDelegate showStateCallback;

    // 声明异步上下文对象sc
    SynchronizationContext sc;

    // 构造函数
    public MainForm()
    {
        InitializeComponent();
        txbUrl.Text = "http://download.microsoft.com/download/7/0/3/703455ee-a747-4cc8-bd3e-98a615c3aedb/dotNetFx35setup.exe";
        showStateCallback = new ShowStateDelegate(ShowState);
    }

    // 下载按钮点击事件
    private void btnDownLoad_Click(object sender, EventArgs e)
    {
        rtbState.Text = "Download............";
        btnDownLoad.Enabled = false;
        if (txbUrl.Text == string.Empty)
        {
            MessageBox.Show("Please input valid download file url");
            return;
        }

        // 设置回调
        AsyncMethodCaller methodCaller = new AsyncMethodCaller(DownLoadFileSync);
        methodCaller.BeginInvoke(txbUrl.Text.Trim(), GetResult, null);

        // 捕捉调用线程的同步上下文派生对象
        sc = SynchronizationContext.Current;
    }

    // 同步下载文件的方法
    // 该方法会阻塞主线程，使用户无法对界面进行操作
    // 在文件下载完成之前，用户甚至都不能关闭运行的程序。
    private string DownLoadFileSync(string url)
    {
        // Create an instance of the RequestState 
        RequestState requestState = new RequestState();
        try
        {
            // Initialize an HttpWebRequest object
            HttpWebRequest myHttpWebRequest = (HttpWebRequest)WebRequest.Create(url);

            // assign HttpWebRequest instance to its request field.
            requestState.request = myHttpWebRequest;
            requestState.response = (HttpWebResponse)myHttpWebRequest.GetResponse();
            requestState.streamResponse = requestState.response.GetResponseStream();
            int readSize = requestState.streamResponse.Read(requestState.BufferRead, 0, requestState.BufferRead.Length);

            while (readSize > 0)
            {
                requestState.filestream.Write(requestState.BufferRead, 0, readSize);
                readSize = requestState.streamResponse.Read(requestState.BufferRead, 0, requestState.BufferRead.Length);
            }

            // 执行该方法的线程是线程池线程，该线程不是与创建richTextBox控件的线程不是一个线程
            // 如果不把 CheckForIllegalCrossThreadCalls 设置为false，该程序会出现“不能跨线程访问控件”的异常
            return string.Format("The Length of the File is: {0}", requestState.filestream.Length) + string.Format("\nDownLoad Completely, Download path is: {0}", requestState.savepath);
        }
        catch (Exception e)
        {
            return string.Format("Exception occurs in DownLoadFileSync method, Error Message is:{0}", e.Message);
        }
        finally
        {
            requestState.response.Close();
            requestState.filestream.Close();
        }
    }

    // 异步操作完成时执行的方法
    private void GetResult(IAsyncResult result)
    {
        AsyncMethodCaller caller = (AsyncMethodCaller)((AsyncResult)result).AsyncDelegate;
        // 调用EndInvoke去等待异步调用完成并且获得返回值
        // 如果异步调用尚未完成，则 EndInvoke 会一直阻止调用线程，直到异步调用完成
        string returnstring = caller.EndInvoke(result);

        // 通过获得GUI线程的同步上下文的派生对象，
        // 然后调用Post方法来使更新GUI操作方法由GUI 线程去执行
        // 在方案一中跨线程设置，此处使用 sc 作为GUI线程实例去执行
        sc.Post(ShowState,returnstring);      
    }

    // 显示结果到richTextBox
    // 因为该方法是由GUI线程执行的，所以当然就可以访问窗体控件了
    private void ShowState(object result)
    {
        rtbState.Text = result.ToString();
        btnDownLoad.Enabled = true;
    }
}
```
