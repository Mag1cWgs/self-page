# 如何处理（Handle）Web 请求
- 有接受请求的 Handler
- 每次接受请求都会开一个 goroutine 来完成处理请求

- 自定义 Handler 很麻烦，提供了 `http.DefaultServeMux` 做注册转发


---


## 创建 Web Server

- HTTP:
    - 使用结构体 `http.Server`
        - 字段 `Addr` 表示网络地址
        - 字段 `Handler`
        - 函数 `server.ListenAndServer()`
    - `http.ListenAndServer(Addr,Handler)`
        - 第一个参数：`Addr`
            - 如果为空（“”），那么就是所有网络接口的 80 端口
        - 第二个参数：`Handler`
            - 如果为 `nil`，那么就是 `DefaultServeMux`
            - `DefaultServeMux` 实际是一个 `multiplexer` 多路复用器（可以看做路由器）

- HTTPS: 
    - 同样使用 `http.Server`
        - 函数 `server.ListenAndServerTLS()`
    - 函数 `http.ListenAndServeTLS()`

- Handler
    ```go
    type Handler interface{
        ServeHTTP(ResponseWriter, *Request)
    }
    ```

    - 是一个接口 interface
    - 定义了一个方法 `ServeHTTP(ResponseWriter, *Request)`
        - `HTTPResponseWriter` 的实例
        - 指向 Request 这个结构体的指针

- 在 `http.ListenAndServer("...", nil)` 中提及 `nil` 实际上是 `http.DefaultServeMux`
    - 它是一个 Multiplexer（多路复用器）
        - 用于分发请求（路由）
    - 也是一个 Handler
        - 只要接受请求都是 Handler
        - 类似管道


---


## 自定义 Handler
- 访问 `localhost:8080/任意后缀` 均可得到 “Hello World By Customer Handler!”
    ```go
    package main

    import "net/http"

    // 建立自己的 Handler
    type myHandler struct{}

    // 实际只需要实现如下方法
    func (m *myHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
        w.Write([]byte("Hello World By Customer Handler!"))
    }

    func main() {
        // 设置一个自定义Handler
        myhandler_instance := myHandler{}
        // 建立 Web 服务
        server := http.Server{
            Addr:    "localhost:8080",
            Handler: &myhandler_instance,
        }
        server.ListenAndServe()
    }
    ```


---


## http.Handle 函数
- 在上面例子中，所有请求都由 `myHandler` 解决
- 实际应该先由路由器 `DefaultServeMux` 做路由转发，从而实现指定路径由指定 Handler 处理
    - Handler 应该在路由器中做注册
    - 一类路径对应一个 Handler
- 实现方法
    1. 先不指定 `Server` struct 中的 `Handler` 字段
    2. 然后用 `http.Handle` 方法去注册 `Handler` 到 `DefaultServeMux` 中
        - `http` 包中有一个 `Handle` 函数
        - `ServerMux` struct 中也有一个 `Handle` 方法
- http.Handle 和 ServerMux.Handle 的关系
    - 如果调用 `http.Handle`，实际调用的是 `DefaultServeMux.Handle` 上的方法
     - `DefaultServeMux` 就是 `ServerMux` 的指针变量
- 实际常用 `http.Handle` 函数
    ```go
    // pattern 是Url路径字符串
    // handler 是 Handler 接口的实例
    func Handle(pattern string, handler Handler)

    // Handler 接口定义
    type Handler interface{
        // 仅有这个函数
        ServeHTTP(ResponseWriter, *Request)
    }
    ```

- 则有使用例子如下
    ```go
    package main

    import "net/http"

    type helloHandler struct{}

    func (m *helloHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
        w.Write([]byte("Hello World By Customer Handler!"))
    }

    type aboutHandler struct{}

    func (m *aboutHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
        w.Write([]byte("About!"))
    }

    func main() {
        helloHandler_instance := helloHandler{}
        aboutHandler_instance := aboutHandler{}

        server := http.Server{
            Addr:    "localhost:8080",
            Handler: nil, // 使用 DefaultServeMux
        }

        // 进行注册
        http.Handle("/hello", &helloHandler_instance)
        http.Handle("/about", &aboutHandler_instance)
        server.ListenAndServe()
    }
    ```


---


## http.HandleFunc 函数 
- Handler 函数：行为与 handler 类似的函数
    - 签名与 ServeHTTP 方法的签名一样
    - 接受参数 `(http.ResponseWriter, *http.Request)`
- 原理：
    - Golang 有一个函数类型 HandlerFunc
    - 可以将某个具有适当签名的函数 f，适配成为一个具有方法 f 的 Handler
        - 类似 Golang 直接注册为一个新的 struct，不需要自己写为拥有 f 的 struct
    - 实际就是类型适配
- 例子
    ```go
    package main

    import "net/http"

    func welcome(w http.ResponseWriter, r *http.Request) {
        w.Write([]byte("WelCome!"))
    }

    func main() {
        server := http.Server{
            Addr:    "localhost:8080",
            Handler: nil, // 使用 DefaultServeMux
        }

        // 签名均为 (w http.ResponseWriter, r *http.Request)
        // 可以直接将函数写入
        http.HandleFunc("/home", func(w http.ResponseWriter, r *http.Request) {
            w.Write([]byte("Home!"))
        })

        // 也可以传递时传递函数（不要加括号）
        http.HandleFunc("/welcome", welcome)
        server.ListenAndServe()

        // 实际如下（URL区分大小写所以指向不同Handler）
        http.HandleFunc("/Welcome", http.HandlerFunc(welcome))
    }
    ```

- 实际调用的 `http` 包中 `HandlerFunc` 函数类
    - 实际就是语法糖
    - 利用下面定义的 `HandlerFunc` 的函数结构进行包装
    - 包装适配成一个 Handler 接口结构对象后，调用其 `ServeHTTP` 函数
    ```go
    type HandlerFunc func(ResponseWriter, *Request)

    // 签名与 ServeHTTP 一致
    func (f HandlerFunc) ServeHTTP(w ResponseWriter, r *Request) {
        f(w, r)
    }
    ```


---


>[!note|label:为什么会有两种函数]
> - 对现有类，只需要通过追加一个方法 `ServeHTTP(...)` 就可以
>   - 从而就可以调用 `http.Handle(URL路径string, &实现类实例)` 来进行注册
>   - 实现类通过追加组合实现 `Handler` 接口
> - 也可以写自定义函数直接作为 Handler
>   - 只需要自定义函数符合签名 `func 可选函数名(w http.ResponseWriter, r *http.Request){...}` 就可以直接作为 Hander函数
>   - 然后 Golang 替我们进行包装到 Handler 接口实现类
>   - 然后再如上面去调用 `http.Handle(URL路径string, &转换得到的实现类实例)`


---


## 内置的 Handler
均在 http 包内

### NotFoundHandler
- 签名：`func NotFoundHandler() Handler`
- 无参数
- 返回值： `Handler` 接口
    - 其给每个请求的相应都是 “404 page not found”

### RedirectHandler
- 签名：`func RedirectHandler(url string, code int) Handler`
- 参数：
    - `url`：字符串类型的路由地址
    - `code`：整型的状态代码（3xx）
        - [参考](https://studygolang.com/articles/10092)
        - 301: Status MovedPermanently
        - 302: Status Found
        - 303: Status SeeOther
- 返回值：`Handler` 接口
    - 把每个请求使用给定的状态码（`code`），跳转到指定的路由地址（`url`）

### StripPrefix
- 签名：`func StripPrefix(prefix string, h Handler) Handler`
- 参数：
    - `prefix`：字符串类型的前缀值
    - `h`：处理后传到的 Handler
- 返回值：
    - 从传入的请求 URL 中去掉指定前缀
    - 然后再调用 `h` 这个 Handler 去做新的处理
    - 如果请求的 URL 没有这个前缀，则返回 404
- 实际就是对请求做预处理，然后传给 `h` 这个 Handler
    - 类似中间件

### TimeoutHandler
- 签名：`func TimeoutHandler(h Handler, dt time.Duration, msg string)Handler`
- 参数：
    - `h`：被执行的 Handler
    - `dt`：表示时间。一个 `time.Duration` 类型的值，是 `Int64` 类型的别名，实际表示两个时间间的纳秒数
    - `msg`：字符串类型的消息
- 返回值：
    - 返回一个 Handler，用于在指定时间内运行传入的 `h` 这个 Hander
- 实际也类似预处理
    - h：将要被修饰的 handler
    - dt：第一个 Handler 允许的处理时间，超时则抛出异常
    - msg：如果超时则返回"503 Service Unavailable" 和这条 msg 给请求，表示响应时间过长

### FileServer
- 签名：`func FileServer(root FileSystem) Handler`
- 参数：
    - `root`：一个 FileSystem 类型值
        - `FileSystem` 是接口类型
        - 有 `Open(name string)(File, error)` 方法
            - 参数：字符串类型的 `name`
            - 传出：`File` 文件类型和一个 `error` 错误类型
        - 由于是接口类型，可以自己实现一个 FileSystem 接口类型的实例
        - 操作时需要操作系统的文件系统，此时需要委托给一个实现类型
            - `type Dir string`：Dir 类型的底层是字符串，所以 `root` 实际上会被转换为 `Dir` 然后调用下面函数
            - `func (d Dir) Open(name string)(File, error)`
- 返回值
    - 返回一个 Handler，使用基于 `root` 的文件系统来响应请求
- 例子
    - 现在有文件系统：
        ```
        根文件夹 wwwrot
            |
            * - 子文件夹 bootstrap
            |       | 
            |       * - bootstrap.min.css
            |       * - bootstrap.min.css.map
            * - index.html
            * main.go
        ```
    - 想要通过 `localhost:8080/` 访问 `index.html`
    ```go
    package main

    import "net/http"

    func main() {

        // 针对 ListenAndServe 根路径提供的下的路径 “根路径/” 来访问 index.html
        http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
            http.ServeFile(w, r, "wwwroot"+r.URL.Path)
        })
        // URL端口的前面不写就是表示默认的 localhost
        http.ListenAndServe(":8080", nil)

        // 实际上面的两端代码可以简化为如下形式:
        // 使用 http.FileServer(文件对应 Dir)
        // 使用 http.Dir(根路径名字符串) 来实现忽略根路径进行匹配
        // 但是此时还是需要访问 localhost:8080/index.html 而不是所需的 localhost:8080
        http.ListenAndServe(":8080", http.FileServer(http.Dir("wwwroot")))
    }
    ```
