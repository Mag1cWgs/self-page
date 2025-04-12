# 请求 Request 是什么
- HTTP 请求
- Request
- URL
- Header
- Body

## HTTP 消息
- 消息有两种：HTTP Request 和 HTTP Response(请求和响应)
- 它们具有相同的结构:
    - 请求(响应)行
    - 0个或多个 Header
    - 空行
    - 可选的消息体(Body)
- 比如有
    ```
    GET /Protocols/rfc2616/rfc2616.html HTTP/1.1
    Host: www.w3.org
    User-Agent: Mozilla/5.0
    (空行)
    ```

- 而在 Golang 中，包 net/http 提供了用于表示 HTTP 消息的结构
    - 其中用于表示请求的结构就是 `Request`
- 结构 `Reqeust`，代表了客户端发送的 HTTP 请求消息
- 重要的字段:
    - URL
    - Header
    - Body
    - Form、PostForm、MultipartForm
- 可以通过 Request 的方法来访问请求中的 Cookie、Url、User-Agent 等信息
- 既可以代表发送到服务器的请求，又可以代表客户端发出的请求

## URL 字段
- Request 的 URL 字段就代表了请求行(请求信息第一行),里面的部分内容
- URL 字段是指向 url.URL 类型的一个指针
    - url 是一个包体 package
    - url.URL 是其中包含的一个 struct:
        ```go
        type URL struct {
            Scheme   string
            Opaque   string
            User     *Userinfo
            Host     string
            Path     string
            RawQuery string
            Fragment string
        }
        ```

- 通用形式：`scheme://[可选用户信息userinfo@]host/path[?query查询字符串][#fragment标记位]`
- 不以斜杠开头的 URL 被解释为：`secheme:opaque[?query查询字符串][#fragment标记位]`

- URL 查询字符串（上面的`[?query]`）
    - `r.URL.RawQuery` 会提供实际查询的原始字符串
        - 例如：`http://www.example.com/post?id=123&thread_id=456`
            - 它的RawQuery的值就是 `id=123&thread_id=456`
    - `r.URL.Query` 会提供 URL.Values 类型，其实质为 `map[string][]string`
        - key: `string`, value: `[]string`
        - 因为 key 可以重复，只需要用 & 分开
        - 用法
            - main.go 内容如下
                ```go
                package main

                import (
                    "log"
                    "net/http"
                )

                func main() {

                    http.HandleFunc("/home", func(w http.ResponseWriter, r *http.Request) {
                        url := r.URL
                        query := url.Query() // map[string][]string

                        id := query["id"] // 返回整个 []string
                        log.Println(id)

                        name := query.Get("name")// 只返回首个字段
                        log.Println(name)
                    })

                    http.ListenAndServe("localhost:8080", nil)
                }
                ```
            
            - http 测试脚本如下
                ```http
                ### Query Test
                GET http://localhost:8080/home?id=123&name=Davel&id=456&name=Nick HTTP/1.1
                ```
            
            - 结果会在控制台打印日志如下：
                ```
                2025/04/12 11:15:21 [123 456]
                2025/04/12 11:15:21 Davel
                ```

    - 还有一个简便方法可以得到 Key-Value 对：
        - 通过 Request 的 Form 字段

- URL 标志位/锚点（`[#fragment]`）
    - 如果从浏览器发出的请求，那么你无法提取出 `Fragment` 字段的值
        - 浏览器在发送请求时会把 `Fragment` 部分去掉
    - 但不是所有的请求都是从浏览器发出的(例如从 HTTP 客户端包)
    - 对下面例子
        - 在浏览器中访问 `localhost:8080/url` 和 `localhost:8080/url#fragment` 都返回空页面
        - 而不是 404NotFound
    
    ```go
    package main

    import (
        "fmt"
        "net/http"
    )

    func main() {
        server := http.Server{
            Addr: "localhost:8080",
        }

        http.HandleFunc("/url", func(w http.ResponseWriter, r *http.Request) {
            fmt.Fprintln(w, r.URL.Fragment)
        })

        server.ListenAndServe()
    }
    ```

## Header 字段
- 请求和响应(Request、Response)的 header 字段是通过 Header 类型来描述的
- `Header` 类型是一个 map，用来表述 HTTP Header 里的 Key-Value对
    - key: `string`，value: `[]string`
    - 设置 key 的时候会创建一个空的 `[]string` 作为 value
        - value 里面第一个元素就是新 header 的值;
    - 为指定的 key 添加一个新的 header 值，执行 `append` 操作即可
- 获取 Header 的方法
    - 使用 `Request.Header` 来返回 Header 这个 map
    - 也可以使用 `r.Header["指定KEY"]` 来返回 `[]string` 的值，比如 `[gzip,deflate]`
    - 也可以 `r.Header.Get("指定KEY")`，返回一个字符串，其中用逗号分隔，比如 `gzip,deflate`
- 例子
    - 建立 Golang Web 服务器如下例
        ```go
        package main

        import (
            "fmt"
            "net/http"
        )

        func main() {
            server := http.Server{
                Addr: "localhost:8080",
            }

            http.HandleFunc("/header", func(w http.ResponseWriter, r *http.Request) {
                fmt.Fprintln(w, r.Header)
                fmt.Fprintln(w, r.Header["Accept-Encoding"])
                fmt.Fprintln(w, r.Header.Get("Accept-Encoding"))
            })

            server.ListenAndServe()
        }
        ```

    - 使用 REST Client 插件，用如下脚本查询
        ```http
        GET http://localhost:8080/header HTTP/1.1
        ```
    
    - 结果如下
        ```
        HTTP/1.1 200 OK
        Date: Sat, 12 Apr 2025 02:54:00 GMT
        Content-Length: 117
        Content-Type: text/plain; charset=utf-8
        Connection: close

        map[Accept-Encoding:[gzip, deflate] Connection:[close] User-Agent:[vscode-restclient]]
        [gzip, deflate]
        gzip, deflate

        ```

## Body 字段
- 请求和响应的 bodies 都是使用 Body 字段来表示的
- Body 是一个 `io.Readcloser` 接口
    - 一个 `Reader` 接口
    - 一个 `Closer` 接口
- `Reader` 接口定义了一个 `Read` 方法:
    - 参数:`[]byte`
    - 返回:`byte` 的数量、可选的错误
- `Closer` 接口定义了一个 `Close` 方法:
    - 没有参数
    - 返回可选的错误

- 想要读取请求 body 的内容，可以调用 Body 的 Read 方法
    - main.go 如下
        ```go
        package main

        import (
            "fmt"
            "net/http"
        )

        func main() {
            server := http.Server{
                Addr: "localhost:8080",
            }

            http.HandleFunc("/post", func(w http.ResponseWriter, r *http.Request) {
                length := r.ContentLength
                body := make([]byte, length)
                r.Body.Read(body)
                fmt.Fprintln(w, string(body))
            })

            server.ListenAndServe()
        }
        ```
    
    - http 测试脚本如下
        ```http
        ### Post Test
        POST http://localhost:8080/post HTTP/1.1
        Content-Type: application/json

        {
            "name": "sample",
            "time": "Wed, 21 Oct 2015 18:27:50 GMT"
        }
        ```
    
    - 结果如下：
        ```
        HTTP/1.1 200 OK
        Date: Sat, 12 Apr 2025 03:03:32 GMT
        Content-Length: 73
        Content-Type: text/plain; charset=utf-8
        Connection: close

        {
        "name": "sample",
        "time": "Wed, 21 Oct 2015 18:27:50 GMT"
        }

        ```
