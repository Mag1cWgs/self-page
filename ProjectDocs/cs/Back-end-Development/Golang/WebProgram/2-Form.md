# Form 和 文件
- 通过表单发送请求
- Form 字段
- PostForm 字段
- MultipartForm 字段
- FormValue & PostFormValue 方法
- 文件(Files)
- POST JSON


---


## 通过表单发送请求
- 这个 HTML 表单里面的数据会以 name-value 对的形式，通过 POST 请求发送出去。
- 它的数据内容会放在 POST 请求的 Body 里面
```html
<!--表单对应 URL路径:根目录/process  HTTP行为:POST-->
<form action="/process" method="post">
    <input type="text" name="first name"/>
    <input type="text" name="last name"/>
    <!--点击提交-->
    <input type="submit"/>
</form>
```

### POST 行为
- 表单 POST 请求的数据格式
    - 通过 POST 发送的 name-value 数据对的格式可以通过表单的Content Type 来指定，也就是 enctype 属性
    - 通过对上例补充：
        ```html
        <!--此处指定使用 x-www-form-urlencoded 也就是 URL 编码发送-->
        <form action="/process" method="post" enctype="application/x-www-form-urlencoded">
            <input type="text" name="first name"/>
            <input type="text" name="last name"/>
            <!--点击提交-->
            <input type="submit"/>
        </form>
        ```

- 表单的 `enctype` 属性
    - 默认值就是上面的 `application/x-www-form-urlencoded`
    - 浏览器会被要求至少支持
        - `application/x-www-form-urlencoded`（默认值）
        - `multipart/form-data`
        - HTML5 额外要求支持 `text/plain`
    - 如果 enctype 是默认值，那么
        - 浏览器将会把表单数据编码到查询字符串（`[?query]`）中
        - 比如 `first_name=example%20FirstName&last_name=exampleLastName`
            - 这里就是提交了
                - `first name` 为 `example FirstName`
                - `last name` 为 `exampleLastName` 
                - 这两个 键值对 构成的表单
    - 如果 enctype 是 `multipart/form-data`，那么
        - 每一个 name-value 对都会被转换为一个 MIME 消息部分
        - 每一个部分都有自己的 Content Type 和 Content Disposition
- 选择方法：
    - 简单文本：表单 URL 编码
    - 大量数据，比如上传文件：`multipart-MIME`
        - 甚至可以把二进制数据通过 Base64 编码然后当成文本进行发送

### GET 行为
- 通过表单的 method 属性，也可以设置为 GET 行为
- GET 请求没有 Body，所有的数据都通过 URL 的 name-yalue 对来发送
```html
<!--表单对应 URL路径:根目录/process  HTTP行为:GET-->
<form action="/process" method="get">
    <input type="text" name="first name"/>
    <input type="text" name="last name"/>
    <!--点击提交-->
    <input type="submit"/>
</form>
```


---


## Form 字段
- Request 上的函数允许我们从 URL或"/" 和 Body 中提取数据，通过这些字段:
    - Form
    - PostForm
    - MultipartForm

- Form 里面的数据是 key-value 对。
- 用法
    1. 先调用 `ParseForm` 或 `ParseMultipartForm` 来解析 Request
    2. 然后相应的访问 `Form`、`PostForm` 或 `MultipartForm` 字段

- 例子
    - 建立一个本地 Web 服务器
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
            http.HandleFunc("/process", func(w http.ResponseWriter, r *http.Request) {
                // 解析 Request
                r.ParseForm()
                // 打印表单内容
                fmt.Fprintln(w, r.Form)
            })
            server.ListenAndServe()
        }
        ```

    - 建立一个测试网页 formPOST.html
        ```html
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <title>Form Post</title>
        </head>
        <body>
            <!--点击提交后提交到指定网页-->
            <form action="http://localhost:8080/process" method="post" 
            enctype="application/x-www-form-urlencoded">
                first name
                <input type="text" name="first_name" />
                last name
                <input type="text" name="last_name" />
                <input type="submit" />
            </form>

        </body>
        </html>
        ```
    
    - 测试
        1. 打开建立的 formPOST.html 输入测试字段（比如first_name填"kaka"、last_name填"lala"）
        2. 打开本地服务器的响应页面 `http://localhost:8080/process`
        3. 发现出现了以下内容："map[first_name:[kaka], last_name:[lala]]"
            - 这里的顺序不一定
- r.Form 实际上是 `url.Values`，底层类型就是 `map[string][]string`


---


## PostForm 字段
- 在上例中
    - 如果只想得到 `first_name` 这个 Key 的 Value，可使用 `r.Form["first_name"]`，它返回含有一个元素的 map:`["kaka"]`
    - 如果想得到一对数据，只需要把 Key 传给 map，比如 `r.Form["first_name"]`，返回一个 slice:`["kaka"]`
- 如果表单和 URL 里有同样的 Key
    - 那么它们都会放在一个 slice 里，表单里的值靠前，URL的值靠后。
    - 如果只想要表单里的键值对，不要 URL 中的，可以使用 `r.PostForm` 字段
- 修改上例
    - main.go 中修改如下
        ```go
		fmt.Fprintln(w, r.Form)
        // 添加一行
		fmt.Fprintln(w, r.PostForm)
        ```
    
    - testPOST.html 修改如下
        ```html
        <!--...-->
        <form action="http://localhost:8080/process?first_name=TEST" method="post" 
                enctype="application/x-www-form-urlencoded">
        <!--...-->
        ```

    - 则输入相同数据后访问有如下显示
        - 第一行为 `r.Form` 结果，含有包括在 URL 中提交的 `first_name=TEST` 在内的两条数据
            - 而且表单数据 `first_name=kaka` 在前，URL 提交数据在后
        - 第二行为 `r.PostForm` 结果，仅含有在 formPOST.html 中提交的单条数据切片
        ```
        map[first_name:[kaka TEST] last_name:[lala]]
        map[first_name:[kaka] last_name:[lala]]
        ```

- 注意：`r.Form` 和 `r.PostForm` 只支持默认的 enctype（也就是`"application/x-www-form-urlencoded"`），如果改成 `"multipart/form-data"`，则会显示如下
    - `r.Form` 只显示 URL 提交数据
    - `r.PostForm` 不显示任何数据
    ```
    map[first_name:[TEST]]
    map[]
    ```


---


## MultipartForm 字段
- 想要使用 `MultipartForm` 这个字段的话，首先需要调用 `ParseMultipartForm` 这个方法
    - 该方法会在必要时调用 `ParseForm` 方法
    - 参数是需要读取数据的长度
- `MultipartForm` 只包含表单的 key-value 对，不包含 URL 中的
- 返回类型是一个 `struct` 而不是 `map`，这个 struct 里有两个 map:
    - key 是string, value 是[]string
    - key 是 string，value 是文件
- 类似上例
    - 添加 multipartForm.html
        ```html
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <title>Multipart Form</title>
        </head>
        <body>
            <!--点击提交后提交到指定网页-->
            <form action="http://localhost:8080/process?first_name=TEST" method="post" 
            enctype="multipart/form-data">
                first name
                <input type="text" name="first_name" />
                last name
                <input type="text" name="last_name" />
                <input type="submit" />
            </form>
        </body>
        </html>
        ```

    - 修改 main.go
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

            http.HandleFunc("/process", func(w http.ResponseWriter, r *http.Request) {
                // 设置最大长度 1024 字节
                r.ParseMultipartForm(1024)
                fmt.Fprintln(w, r.MultipartForm)
            })
            server.ListenAndServe()
        }
        ```

    - 则输入相同测试数据后返回如下结果
        - 第一个 map 是提交的数据（不含 URL 提交数据）
        - 第二个 map 是查找到的文件（此时显然为空）
        ```
        &{map[first_name:[kaka] last_name:[lala]] map[]}
        ```


---


## FormValue & PostFormValue 方法

### FormValue
- `FormValue` 方法会返回 Form 字段中指定 key 对应的第一个 value
    - 无需调用 `ParseForm` 或 `ParseMultipartForm`（会自动调用）
- 例子
    - 修改 main.go
        ```go
        http.HandleFunc("/process", func(w http.ResponseWriter, r *http.Request) {
        // 不需要先解析，可以直接读取
        fmt.Fprintln(w, r.FormValue("first_name"))

        // 用于比对
		r.ParseForm()
		fmt.Fprintln(w, r.Form)
        
		r.ParseMultipartForm(1024)
		fmt.Fprintln(w, r.MultipartForm)
        })
        ```
    
    - 则使用 formPOST.html 提交数据（first_name="kakakaka",last_name="lalalala"）后，访问 `http://localhost:8080/process?first_name=TEST` 返回结果
        - 首行 `kakakaka`：
            - 只显示单个数据
        - 第二行 `map[first_name:[kakakaka TEST] last_name:[lala]]`：
            - 实际正常收到数据
            - 但是由于表单提交数据在前，URL提交数据在后，最终在首行只显示了 `kakakaka`
        - 尾行 `<nil>`：
            - 通过 `"application/x-www-form-urlencoded"` 提交的数据不会被 `r.ParseMultipartForm(1024)` 和 `fmt.Fprintln(w, r.MultipartForm)` 识别.
            - 会返回 `nil` 空值
        ```
        kakakaka
        map[first_name:[kakakaka TEST] last_name:[lala]]
        <nil>
        ```
    - 使用 MultipartForm.html 提交数据（first_name="kaka",last_name="lala"）后，访问 `http://localhost:8080/process?first_name=TEST` 返回结果则为
        - 首行 `TEST`：
            - 仅包含 URL 提交数据
            - 是因为使用了 `"multipart/form-data"`，优先提交 URL 数据
        - 第二行 `map[first_name:[TEST kaka] last_name:[lala]]`：
            - 实际成功收到数据
            - 但是 URL 数据在前，表单数据在后
        - 尾行 `&{map[first_name:[kaka] last_name:[lala]] map[]}`：
            - 正常收到数据
        ```
        TEST
        map[first_name:[TEST kaka] last_name:[lala]]
        &{map[first_name:[kaka] last_name:[lala]] map[]}
        ```

#### PostFormValue
- PostFormValue 方法也一样，但只能读取 PostForm
- FormValue 和 PostFormValue 都会调用 ParseMultipartForm 方法
- 例子：
    - 修改 main.go
        ```go
        http.HandleFunc("/process", func(w http.ResponseWriter, r *http.Request) {
            // 不需要先解析，可以直接读取
            fmt.Fprintln(w, r.FormValue("first_name"))
            fmt.Fprintln(w, r.PostFormValue("first_name"))

            r.ParseForm()
            fmt.Fprintln(w, r.Form)
            fmt.Fprintln(w, r.MultipartForm)

            r.ParseMultipartForm(1024)
            fmt.Fprintln(w, r.Form)
            fmt.Fprintln(w, r.MultipartForm)
        })
        ```
    - 使用 formPOST.html 提交后访问数据如下
        - `r.FormValue` 可以正常读取默认 `enctype="application/x-www-form-urlencoded"` 所 POST 的数据，如果没有表单提交则默认是 URL 中的首个匹配字段
        - `r.PostFormValue` 也可以正常读取 POST 的数据，如果没有表单提交则默认返回空行
        - 无论使用哪种解析
            - 只有 `r.Form` 可以读取（而且依旧是表单提交在前，URL在后）
            - `r.MultipartForm` 会固定返回 `nil`
        ```
        kakakaka
        kakakaka
        map[first_name:[kakakaka TEST] last_name:[lala]]
        <nil>
        map[first_name:[kakakaka TEST] last_name:[lala]]
        <nil>
        ```
    - 使用 MultipartForm.html 提交后数据如下
        - `r.FormValue` 无法直接读取 `enctype="multipart/form-data"` 提交的数据，只能读取到 URL 提交数据中的首个
        - `r.PostFormValue` 可以正常直接读取到表单数据（优先显示）
        - 无论使用哪种解析
            - `r.Form` 可以读取到 URL 和表单数据（但是URL在前）
            - `r.MultipartForm` 成功实现只获取表单提交的数据
        ```
        TEST
        kaka
        map[first_name:[TEST kaka] last_name:[lala]]
        &{map[first_name:[kaka] last_name:[lala]] map[]}
        map[first_name:[TEST kaka] last_name:[lala]]
        &{map[first_name:[kaka] last_name:[lala]] map[]}
        ```


---


## 文件(Files)
- `enctype="multipart/form-data"` 最常见的应用场景就是上传文件
    1. 调用 `r.ParseMultipartForm` 方法解析请求
    2. 从 `r.MultipartForm` 的 `File` 字段获取 `FileHeader` 指针
    3. 然后调用 `io.ReadAll` 函数将文件内容读取到 `byte` 切片中（不是 []byte）
- 例子
    - 构建服务器
        ```go
        package main

        import (
            "fmt"
            "io"
            "net/http"
        )

        func main() {
            server := http.Server{
                Addr: "localhost:8080",
            }

            http.HandleFunc("/process", func(w http.ResponseWriter, r *http.Request) {
                // 解析请求
                r.ParseMultipartForm(4096)
                // 获取上传的第一个文件
                fileHeader := r.MultipartForm.File["uploaded"][0]
                file, err := fileHeader.Open()
                // 打开无错误时记录
                if err == nil {
                    // 原本用的 io/ioutil 包中的ReadAll，现在弃用改成 io.ReadAll
                    data, err := io.ReadAll(file) // data 是字符串
                    // 读取无错误时打印
                    if err == nil {
                        fmt.Fprintln(w, string(data))
                    }
                }

            })

            server.ListenAndServe()
        }
        ```
    - 构建提交网页
        ```html
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta http-equiv="Content-Type" content="text/html;charset=UTF-8"/>
            <title>File Post</title>
        </head>
        <body>
            <!--点击提交后提交到指定网页-->
            <form action="http://localhost:8080/process?hello=world&thread=123" method="post" 
                enctype="multipart/form-data">
                first name
                <input type="text" name="first_name" value="sausheong" />
                last name
                <input type="text" name="last_name" value="456"/>
                <input type="file" name="uploaded"/>
                <input type="submit" />
            </form>
        </body>
        </html>
        ```

- 简化方法：`FormFile`
    - 对上例的 main.go
        ```go
        // 获取上传的第一个文件
		fileHeader := r.MultipartForm.File["uploaded"][0]
		file, err := fileHeader.Open()
		// 可以简化为
		file, _, err := r.FormFile("uploaded")
        ```
    - 无需调用 `ParseMultipartForm` 方法
    - 返回指定 key 对应的第一个 value
    - 同时返回 `File` 和 `FileHeader`，以及错误信息
    - 如果只上传一个文件，那么这种方式会快一些


---


## POST JSON
- 不是所有的 POST 请求都来自 Form
- 客户端框架(例如 Angular 等)会以不同的方式对 POST 请求编码:
    - jQuery 通常使用 application/x-www-form-urlencoded
    - Angular 是application/json
- ParseForm 方法无法处理 application/json


---


## 总结与补充
- 一共介绍了五种读取表单 Form 的值的方法
    - Form
    - PostForm
    - FormValue()
    - PostFormValue()
    - FormFile()
- 介绍第六种方法 `MultipartReader`
    - 签名：
        ```go
        func (r *Request)MultipartReader()(*multipart.Reader, error)
        ```
    - 如果是 multipart/form-data 或 multipart 混合的 POST 请求:
        - `MultipartReader` 返回一个MIME multipart reader
        - 否则返回 `nil` 和一个错误
    - 可以使用该函数代替 ParseMultipartForm 来把请求的 body 作为stream 进行处理
        - 不是把表单作为一个对象来处理的，不是一次性获得整个 map
        - 逐个检查来自表单的值，然后每次处理一个
