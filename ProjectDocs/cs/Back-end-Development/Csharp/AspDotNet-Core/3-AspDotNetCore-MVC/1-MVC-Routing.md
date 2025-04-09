# 介绍 MVC、路由 Routing


---


# 什么是 MVC 模式

- **模型-视图-控制器**设计模式
    - 有助于实现关注分离
    - 同时通过责任划分有助于扩展程序

- 用户请求Request 路由Routing 到 控制器Controller
- 控制器Controller 负责与 模型Model 协作，以执行用户操作/返回请求结果
- 控制器Controller 选择 视图View，显示给用户，并为其提供所需的 模型Model 数据

- 模型 MODEL
    - 应用的状态和业务逻辑
    - 业务逻辑应该封装在模型中，连同应用持久化状态实现逻辑
    - 强类型视图一般使用视图模型 ViewModel 类型，包含视图显示所需的数据
        - 控制器将创建并根据模型填充这些视图模型

- 视图 VIEW
    - 负责在用户页面呈现内容
    - 使用 Razor 视图引擎在 HTML 标记中插入 .NET 代码
    - 应仅包含少量逻辑，并且这些逻辑应该与呈现内容有关
    - 如果复杂逻辑，请考虑视图组件/视图模型/视图模板来简化视图

- 控制器 CONTROLLER
    - 承载交互/模型运转/选择视图进行渲染
    - 作为程序入口，负责选择模型协作和视图呈现
    - 不应有太多职责，遵守单一职责原则下将业务逻辑移到领域模型
    - 如果频繁执行相同类型方法，应使用过滤器执行这些通用方法


---


# 路由 Routing 与 Url

- ASP.NET Core 默认包含初级路由
- ASP.NET Core MVC 路由是建立于上述的初级路由的 URL 映射组件
- 可以使用**路由模版语法**来定义路由
    - 支持路由值约束、默认值、可选值
    - 基于约束的路由允许全局定义应用支持的 URL 格式，以及这些格式如何各自在给定的控制器中映射到相应的操作
    - 当接受到一个请求的时候，路由引擎解析 URL 并将其匹配到一个定义 URL 格式，然后调用相关的控制器的操作方法
    - 语法如下：
        ```cs
        routes.MapRoute(Name: "Default", template: "{controller=Home}/{action=Index}/{id?}");
        ```
- 特性路由 AttributeRoute
    - 允许控制器和方法使用添加特性的方法来指定路由信息
    - 通过使用 C# [Attribute] 标签

- 使用路由中间件来匹配传入请求的 URL，并将它们映射到操作方法
    - 路由在启动代码/属性中定义
    - 描述网络路径应如何与操作方法匹配
    - 也就是路由决定获取对 Url 请求后如何匹配服务器操作


---


## 1-设置路由中间件

- 新建 ASP.NET CORE 2.1 MVC 项目，在其中的 `Startup.cs` 文件的 `Configure` 函数中有如下内容
    ```cs
    app.UseMvc(routes =>
    {
        routes.MapRoute(
            name: "default",
            template: "{controller=Home}/{action=Index}/{id?}");
    });
    ```

### MapRoute 方法

- `MapRoute`：用于创建单个路由（默认路由）
    - 上例中的路由模版 `template: "{controller=Home}/{action=Index}/{id?}"`

- 可以匹配像 `/Product/Detail/5` 的 URL 路径，它们不符合路由模板中的默认路由
    - 此时会提取值 `{controller = Products, action = Details, id = 5}`
    - MVC 会尝试查找名为 `ProductsController` 的控制器，并运行操作 `Details`
    ```cs
    public class ProductsController : Controller
    {   // 对于上例，此时 id=5
        public IActionResult Details(int id) {...}
    }
    ```

### 默认路由

- 使用默认路由
    ```cs
    route.MapRoute("default", "{controller=Home}/{action=Index}/{id?}");
    ```

    - `{controller=Home}`：将 `Home` 设为默认控制器
    - `{action=Index}`：将 `Index` 定义为默认操作
    - `{id?}`：将 `id` 定义为可选

- 此时的路由模版 "{controller=Home}/{action=Index}/{id?}" 也可以匹配 URL 路径
    - 并且产生路由值 `{controller = Home, action = Index}`
    - 控制器和操作值均为默认值，`id` 不产生值，因为 URL 路径中没有相应的必须字段（作为可选项）
    - MVC 将用以上路由值来选择 `HomeController` 和 `Index()`
    ```cs
    public class HomeController : Controller
    {
        public IActionResult Index() {...}
    }
    ```

- 使用此控制器定义和路由模版，将对以下任何 URL 路径执行 `HomeController.Index()` 操作   
    - `/Home/Index/17`
    - `/Home/Index`
    - `/Home`
    - `/`

- 有简化写法 `UseMvcWithDefaultRoute` 方法
    ```cs
    // Startup.cs
    // Configure 方法
    app.UseMvcWithDefaultRoute();

    // 实际可以替换掉一开始给的默认例子
    app.UseMvc(routes =>
    {
        routes.MapRoute(
            name: "default",
            template: "{controller=Home}/{action=Index}/{id?}");
    });
    ```

- `UseMvc` 和 `UseMvcWithDefaultRoute` 都是将 `RouteMiddleware` 的实例添加到中间管道
    - MVC 不直接与中间件交互，均使用路由来处理请求。
    - MVC 通过 `MvcRouteHandler` 的实例连接到路由，实际类似如下过程
        ```cs
        var routeBuilder = new RouteBuilder(app);

        // 添加连接到MVC，通过调用 MapRoute 来作为回调
        routeBuilder.DefaultHandler = new MvcRouteHandler(...);

        // 执行回调，以实现注册路由
        // routeBuilder.MapRoute("default", "{controller=Home}/{action=Index}/{id?}");

        // 创建路由集合，并添加到中间件
        app.UseRouter(routeBuilder.Build());
        ```

- `UseMvc` 不直接定义任何路由，其为 *属性路由* 的路由集合添加一个占位符
    - 重载 `UseMvc(委托Action<IRouteBuilder>)` 可以添加自定义的路由，而且也支持 *属性路由*
    - `UseMvc` 及其所有变体均为 *属性路由* 添加了占位符，使之无论如何配置 `UseMvc` ，属性路由始终可用

- `UseMvcWithDefaultRoute` 定义默认路由并支持属性路由



---


## 2-几种路由

### 2-1常规路由
- 回顾上面的默认路由格式
    ```cs
    route.MapRoute("default", "{controller=Home}/{action=Index}/{id?}");
    ```

- 这就是一种常规路由，建立了一个约定的 URL 路径
    - 第一路径：控制器名称
    - 第二路径：操作名称
    - 第三路径：可选id，用于映射到模型实体
    ```cs
    route.MapRoute("路由名称", "匹配控制器名/操作名/{可选id?}");
    ```

- 使用默认路由格式时
    - 对 URL 路径 `/Products/List` 执行 `ProductsController.List()` 操作
    - 对 URL 路径 `/Blog/Article/17` 执行 `BlogController.Article() 操作`
    - 以下任何 URL 路径执行 `HomeController.Index()` 操作   
        - `/Home/Index/17`
        - `/Home/Index`
        - `/Home`
        - `/`
    - 这些映射仅仅是基于控制器和操作名，不基于命名空间/源文件位置/方法参数


### 2-2-多路由
- 可以在 `UseMvc` 里面通过添加 `MapRoute` 来添加多个路由
- 这样做可以定义多个约定，或者添加专用于特定操作的常规路由
    ```cs
    app.UseMvc(routes =>
    {
        // 专用常规路由，模式名为"blog"，匹配路径是 "blog/{*article}"
        // 路由的默认值设置为 控制器.行为:"BlogController.Article()"
        routes.MapRoute("blog", "blog/{*article}",
                    default: new {controller = "Blog", action = "Article"});
        
        // 默认路由，模式名default，匹配路径{controller=Home}/{action=Index}/{id?}
        // 路由值直接从匹配路径中产生
        routes.MapRoute("default", "{controller=Home}/{action=Index}/{id?}");
    });
    ```

- 路由集合中的路由是**有序**地，会按照**被添加进去的顺序**进行处理。
    - 所以在上例中先写专用常规路由，最后写默认路由

>[!note|label:路由处理中的几种行为]
> 1. **回退**
>     - 作为请求处理的一部分，MVC 将验证路由值是否可以用于查找相应的 Controller 和 Action
>     - 如果不匹配操作，该路由被认为是不匹配，会尝试下一个路由，直到默认路由
>     - 这一过程称为回退
> 2. **行动歧义**
>     - 当两个一致的操作通过路由时，MVC必须消除歧义
>     - 选择其中最佳的操作，否则抛出异常
>         ```cs
>         public class ProductsController : Controller
>         {
>             public IActionResult Edit(int id) {...}
> 
>             [HttpPost]
>             public IActionResult Edit(int id, Product product) {...}
>         }
>         ```
> 
>     - 此控制器定义将匹配 URL 路径 `/Products/Edit/17` 和路由数据 `{controller=Products,action= Edit,id=17}` 两个操作。
>         - 这是MVC控制器的典型模式
>         - `Edit(int)`用于显示编辑产品的表单
>         - `Edit(int,Product)` 处理已发布的表单。
>     - 为了达成这个目的
>         - MVC需要在请求是 HTTP POST 时选择 `Edit(int,Product)`
>         - 在 其他HTTP动词 时选择 `Edit(int)`。
> 
>     - `HttpPostAttribute`(`[HttpPost]`) 是 `IActionConstraint` 的一个实现
>         - 它只允许在HTTP动词为 `POST` 时选择动作
>         - `IActionConstraint` 的存在使得 `Edit(int,Product)` 比 `Edit(int)` 更好匹配，因此将首先尝试 `Edit(int,Product)`。
>     - 通常只需要在专门的场景中编写自定义的 `IActionConstraint` 实现
>         - 但是了解 `HttpPostAttribute` 等特性的作用很重要
>         - 类似的特性还有其他HTTP动词定义。
>         - 在常规路由中，当操作是「show form → submit form」工作流程的一部分时，使用相同的操作名称是很常见的。
>     - 如果有多个路由匹配，并且MVC无法找到一个“最佳”路由，则会抛出 `AmbiguousActionException` 异常。
> 3. **路由名称**
>     - 原有例子给了名为 "blog" 和 "default" 的路由
>     - 路由名称为路由提供了一个逻辑名称，以便命名的路由可用于生成 URL。在应用程序范围内路由名称必须是唯一的。
>     - 路由名称对 URL 匹配或请求的处理没有影响，它们仅用于URL生成。

### 2-3-特性路由
- **特性路由**使用一组特性（Attribute）直接将操作映射到路由模板。
- 下面的例子是在 `Configure` 中直接使用 `app.UseMvc()` 且没有传递路由。
    - `HomeController` 会匹配一组类似于 `{controller=Home}/{action=Index}/{id?}` 的默认路由URL
    ```cs
    // Startup.cs 中 Configure 方法
    {   //...
        app.UseMvc(); // 不使用 lambda 表达式设置路由
        //...
    }

    // HomeController.cs
    public class HomeController: Controller
    {
        [Route("")]
        [Route("Home")]
        [Route("Home/Index")]
        public IActionResult Index()
        {
            return View();
        }

        [Route("Home/About")]
        public IActionResult About()
        {
            return View();
        }

        [Route("Home/Contact")]
        public IActionResult Contact()
        {
            return View();
        }
    }
    ```

- 此时对各种操作的对应如下
    - `HomeController.Index()`: `/`、`/Home`、`/Home/Index`
    - `HomeController.About()`: `/Home/About`
    - `HomeController.Contact()`: `/Home/Contact`

- 这个例子突出了特性路由和常规路由的一个关键不同之处:
    - 特性路由需要有更多的输入来指定一个路由
        - 特性路由允许(也必须)精确控制每个操作的路由模板。
    - 而常规路由处理路由时则更加简洁。

- 控制器名和操作名在特性路由中不会影响选择哪个操作。
    - 路由参数（`action`/`area`/`controller`）不允许出现在特性路由中
        - 路由模板已经关联操作了，再对 Url 进行解析是无意义的
    - 使用特性路由时，单凭 Url 无法解析出目标操作
    - 下面这个例子会匹配与上个例子相同的 URL:
    ```cs
    public class MyDemoController: Controller
    {
        [Route("")]
        [Route("Home")]
        [Route("Home/Index")]
        public IActionResult MyIndex()
        {
            return View("Index");
        }

        [Route("Home/About")]
        public IActionResult MyAbout()
        {
        return View("About");
        }

        [Route("Home/Contact")]
        public IActionResult MyContact()
        {
            return View("Contact");
        }
    }
    ```

>[!note|label:使用特性路由和常规路由的区别]
> - 使用特性路由：
>     - 对控制器的方法加特性
>     - 保证特性中的这些一定会使用该方法
>     - 不需要在 Url 中使用 `{action=?}` 或类似的字段来辅助解析
> - 使用常规路由：
>     - 直接在 `Startup.cs` 中指定
>     - 有路由名做标记
>     - 需要通过对 Url 解析来判断使用的控制器和方法

- 特性路由也可以使用 `HTTP[动词]特性`，如 `HttpPostAttribute`。
    - 所有这些特性都可以接受路由模板。
    - 下面这个例子展示了两个操作匹配同一个路由模板:
        ```cs
        // Get
        [HttpGet("/products")]
        public IActionResult ListProducts()
        {
            // ...
        }

        // Post
        [HttpPost("/products")]
        public IActionResult CreateProduct(...)
        {
            // ...
        }
        ```
    - 对于 `/products` 这个 URL 路径来说
        - `ProductsApi.ListProducts` 操作会在 HTTP 动词是 `GET` 时执行
        - `ProductsApi.CreateProduct` 会在 HTTP 动词是 `POST` 时执行。

- 特性路由**首先**匹配路由模板集合中通过路由特性定义的URL。
    - **一旦**路由模板相**匹配**，`IActionConstraint` 会约束应用并决定执行哪个操作。

- 由于特性路由适用于特定操作，因此很容易使参数作为路由模板定义中必需的一部分。
    - 下面这个例子中，id 必须作为 URL 路径中的一部分。
        ```cs
        public class ProductsApiController : Controller
        {
            [HttpGet("/products/{id}", Name ="Products_List")]
            public IActionResult GetProduct(int id){...}
        }
        ```
    - `ProductsApiController.GetProduct` 操作对 Url 匹配如下
        - Get: `/products/5`：执行，传入参数 `id=5`
        - Get: `/products`：不执行路由
    - 同时在特性路由标记中声明了当前行为对应的路由名称为 `Products_List`
        - 路由名称可以用来生成基于特定路由的 Url
        - 路由名称对 URL 的匹配行为没影响
            - 不影响 Url → 路由匹配
            - 只影响 路由 → Url生成
        - 路由名称必须在应用程序内唯一
- 常规的默认路由定义 `id` 参数作为可选项(`{id?}`)，而特性路由的这种精确指定 API的能力更有优势
    - 比如把 `/products` 和 `/products/5` 分配到不同的操作。

### 2-4-组合路由

### 2-5-特性路由的顺序


---


## 3-路由模板的标记替换


---


## 4-IRouteTemplateProvider-自定义路由特性


---


## 5-使用应用程序模型来自定义特性路由


---


## 6-URL的几种生成

### 6-1-特性路由生成

### 6-2-操作名生成

### 6-3-路由生成

### 6-4-操作结果生成

### 6-5-专用常规路由

## 7-区域


---


## 8-IActionConstraint
