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
- 为了减少特性路由的重复部分，控制器上的路由特性会和各个操作上的路由特性进行结合。
- 任何定义在控制器上的路由模板都会作为操作路由模板的前缀。
- 在控制器上放置一个路由特性会使所有这个控制器中的操作使用这个特性路由： 
    ```cs
    [Route("products")]
    public class ProductsApiController : Controller
    {
        [HttpGet]
        public IActionResult ListProducts() { ...}

        [HttpGet("{id}")]
        public ActionResult GetProduct(int id) {...}
    }
    ```

    - URL 路径 `/products` 会匹配 `ProductsApi.ListProducts`
    - URL 路径 `/products/5` 会匹配 `ProductsApi.GetProduct(int)`
    - 两个操作都只会匹配 HTTP GET，因为它们使用 `HttpGetAttribute` 进行装饰。

- 应用到操作上的路由模板以 `/` 开头时不会联合控制器上的路由模板。
    - 下面这个例子匹配一组类似默认路由的 URL 路径： 
    ```cs
    // 对 Home 匹配
    [Route("Home")]
    public class HomeController : Controller
    {
        [Route("")]   //定义组合路由模板 "Home"
        [Route("Index")] //定义组合路由模板 "Home/Index"
        [Route("/")]    //不组合，定义路由模板 "/"
        public IActionResult Index()
        {
            ViewData["Message"] = "Home index";
            var url = Url.Action("Index", "Home");
            ViewData["Message"] = "Home index" + "var url = Url.Action == " + url;
            return View();
        }

        [Route("About")] //定义组合路由模板 "Home/About"
        public IActionResult About()
        {
            return View();
        }
    }
    ```

### 2-5-特性路由的顺序
- **常规路由**：根据定义顺序来执行，开发者需要负责路由的合理排序。 
- **特性路由**：
    - 构建树形结构，同时匹配所有路由
    - 最具体的路由会在一般的路由之前执行。
    - 比如 `blog/search/{topic}` 比 `blog/{*article}` 更具体 ，`blog/search/{topic}` 会优先执行。

- 特性路由通过框架提供的`Order`属性配置路由顺序，按`Order`属性升序处理路由。
 - 默认`Order`值为0 。
 - 当设置`Order = -1`时，该路由会在未设置`Order`的路由之前运行。
 - 当设置`Order = 1`时，该路由会在默认路由排序后运行。 


---


## 3-路由模板的标记替换
- 为了方便，特性路由支持**标记替换**，即通过在方括号中封闭一个标记(`[, ]`)来替换对应的名称。
- 标记 `[action]`、`[area]` 以及 `[controller]` 会被替换成路由中定义的操作所对应的操作名、区域名、控制器名。
- 在下面例子中，操作可以匹配注释中描述的 URL 路径： 
    ```cs
    [Route("[controller]/[action]")]
    public class ProductsController : Controller
    {
        [HttpGet] // 匹配'/Products/List'
        public IActionResult List() {
            //...
        }

        [HttpGet("{id}")] // 匹配 '/Products/Edit/{id}'
        public IActionResult Edit(int id) {
            //...
        }
    }
    ```

- 标记替换发生在构建特性路由的**最后一步**。
    - 下面代码的实现效果与上面的例子相同：
    ```cs
    public class ProductsController : Controller
    {   // 匹配 '/Products/List'
        [HttpGet("[controller]/[action]")]
        public IActionResult List() {
            //...
        }

        // 匹配 '/Products/Edit/{id}'
        [HttpGet("[controller]/[action]/{id}")]
        public IActionResult Edit(int id) {
            //...
        }
    }
    ```

- 特性路由也可以与继承结合。
    - 子类会**继承**基类的特性路由
    ```cs
    [Route("api/[controller]")]
    public abstract class MyBaseController : Controller { ... }

    // 继承基类的 [Route("api/[controller]")]
    public class ProductsController : MyBaseController
    {
        [HttpGet] // 匹配 '/api/Products'
        public IActionResult List() { ... }

        [HttpPost("{id}")] // 匹配 '/api/Products/{id}'
        public IActionResult Edit(int id) { ... }
    }
    ```

- **标记替换定义路由名称**：
    - 通过`[Route("[controller]/[action]", Name = "[controller]_[action]")]` 形式，利用标记替换为每个操作生成唯一路由名称
    - `[controller]`会替换成控制器名，`[action]`会替换成操作名。
- **多个路由指向同一操作**：
    - 特性路由支持这种设置，常见用法是模仿默认常规路由。
    ```cs
    [Route("[controller]")]
    public class ProductsController : Controller
    {
        [Route("")]   //匹配 'Products'
        [Route("Index")] //匹配 'Products/Index'
        public IActionResult Index()
    }
    ``` 

- 放置多个路由特性到控制器上，意味着每一个特性都会与每一个操作方法上的路由特性进行结合
    - 自由组合
    ```cs
    [Route("Store")]
    [Route("[controller]")]
    public class ProductsController : Controller
    {
        [HttpPost("Buy")]   //匹配 'Products/Buy' 和 'Store/Buy'
        [HttpPost("Checkout")] //匹配 'Products/Checkout' 和 'Store/Checkout'
        public IActionResult Buy()  {...}
    }
    
    ```

- 当多个路由特性（`IActionConstraint` 的实现）在一个操作上
    - 每一个操作约束都会与特性定义的路由模板相结合
    - 虽然使用多个路由到一个操作上看起来很强大,但最好还是保持应用程序的 URL 空间简单和定义明确。
    - 使用多个路由到操作上仅仅在特殊需要的时候使用，例如支持现有客户端。
    ```cs
    [Route ("api/ [controller]")]
    public class ProductsController : Controller 
    {
        [HttpPut ("Buy")]//匹配 PUT 'api/Products/Buy'
        [HttpPost("Checkout")]// 匹配 POST 'api/Products/Checkout'
        public IActionResult Buy()  {...}
    }
    ```


---


## 4-自定义路由特性

## 4-1-IRouteTemplateProvider
- 所有框架提供的路由特性(`[Route(..)]`、`[HttpGet(..)]`等)都实现了 `IRouteTemplateProvider` 接口。
- 当应用程序启动时，MVC查找控制器类和操作方法上都实现了 `IRouteTemplateProvider` 接口的特性来构建初始路由集合。
- 可以通过实现 `IRouteTemplateProvider` 来定义自己的路由特性。
    - 每个 `IRouteTemplateProvider` 都允许定义使用自定义路由模板、顺序以及名称的单一路由

```cs
// 定义 Attribute
public class MyApiControllerAttribute : Attribute, IRouteTemplateProvider
{
    // 指定模版
    public string Template => "api/[controller]";

    public int? Order { get; set; }

    public string Name { get; set; }
}

// 使用
public class Example_1_Controller : Controller  {...}
```

## 4-2-使用应用程序模型来自定义特性路由
- 应用程序模型是在启动时创建的对象模型，其中包含 MVC 用于路由和执行操作的所有元数据。
- 应用程序模型包括从路由特性收集的所有数据（通过 `IRouteTemplateProvider`）。
- 我们可以编写约定以在启动时修改应用程序模型为自定义路由行为。

```cs
using Microsoft.AspNetCore.Mvc.ApplicationModels;
using System.Linq;
using System.Text;

public class NamespaceRoutingConvention : IControllerModelConvention
{
    private readonly string _baseNamespace;

    public NamespaceRoutingConvention(string baseNamespace)
    {
        _baseNamespace = baseNamespace;
    }

    public void Apply(ControllerModel controller)
    {   // 使用 ControllerModel.Selector.Any方法确定是否绑定路由
        var hasRouteAttributes = controller.Selectors.Any(selector => 
            selector.AttributeRouteModel != null);
        if (hasRouteAttributes)
        {
            // 此控制器自定义了一些路由，因此将其视为覆盖，不适用以下约定
            return;
        }

        // 使用命名空间和控制器名称来推断控制器的路由
        // 这使得你的路由大致与你的项目的文件夹结构一致
        //
        // 对应关系示例:
        // controller.ControllerTypeInfo ->
        //          "My.Application.Admin.UsersController"
        // baseNamespace ->
        //          "My.Application"
        // template =>
        //          "Admin/[controller]"
        var namespc = controller.ControllerType.Namespace;

        // 使用 StringBuilder 拼接模板
        var template = new StringBuilder();
        template.Append(namespc, _baseNamespace.Length + 1, 
                        namespc.Length - _baseNamespace.Length - 1);
        template.Replace('.', '/');
        template.Append("/[controller]");

        // 对所有选取器构造特性路由模型
        foreach (var selector in controller.Selectors)
        {
            selector.AttributeRouteModel = new AttributeRouteModel()
            {
                Template = template.ToString()
            };
        }
    }
}
```


---


## 5-URL的几种生成
- MVC应用程序可以使用路由由URL的生成特性来生成URL链接到操作。
- 生成URL可消除硬编码URL，会使你的代码更健壮和易维护。 

### 5-1-路由生成
- `IUrlHelper` 接口是 MVC 与生成 URL 路由之间基础设施的基本块。
- 可以通过控制器、视图以及视图组件中的 `Url` 属性找到一个可用的 `IUrlHelper` 实例：
    - 在下面例子中，`IUrlHelper` 接口用 `Controller.Url` 属性来生成一个到其他操作的URL：
    ```cs
    using Microsoft.AspNetCore.Mvc;

    public class UrlGenerationController : Controller
    {
        public IActionResult Source()
        {
            // 生成 /UrlGeneration/Destination
            var url = Url.Action("Destination");
            return Content($"Go check out {url}, it's really great.");
        }

        public IActionResult Destination()
        {
            return View();
        }
    }
    ```

- 如果应用程序使用默认的常规路由，则url变量的值会是URL路径字符串 `/UrlGeneration/Destination`。
- 这个URL路径是由路由由值与当前请求相结合而成的路由创建，并将值传递给 `Url.Action`，从而替换这些值到路由模板，过程大致如下：
    1. 环境值: `{ controller = "UrlGeneration", action = "Source" }`
    2. 值传递给 `Url.Action`: `{ controller = "UrlGeneration", action = "Destination" }`
    3. 构建路由模板: `{controller}/{action}/{id?}`
    4. 结果: `/UrlGeneration/Destination`

- 路由参数替换规则
    - 路由模板中的每个路由参数值会被匹配名字的值和环境值替换。
    - 若路由参数无值，有默认值则用默认值，若为可选参数则跳过（如示例中`id`）。
    - 必需路由参数无对应值会导致URL生成失败，此时会尝试下一个路由，直到所有路由尝试完或找到匹配路由。 

- 常规路由与特性路由在URL生成上的区别
    - **常规路由**：
        - 路由值用于扩展模板
            - `controller` 和`action` 的路由值常出现在模板中
        - 因为路由匹配的URL遵循特定约定。
    - **特性路由**：
        - `controller` 和`action` 的路由值不允许出现在模板中，而是用于查找应使用哪个模板。

- 有特性路由例子如下
    ```cs
    // Startup.cs
    public void Configure(IApplicationBuilder app)
    {
        app.UseMvc();
    }

    // UrlGenerationController.cs
    using Microsoft.AspNetCore.Mvc;

    public class UrlGenerationController : Controller
    {
        [HttpGet("")]   // GET /UrlGeneration
        public IActionResult Source()
        {   // 生成 /custom/url/to/destination
            var url = Url.Action("Destination"); //调用下面的 Desitination
            return Content($"Go check out {url}, it's really great.");
        }

        // 生成 Get URL:custom/url/to/destination
        [HttpGet("custom/url/to/destination")]
        public IActionResult Destination()
        {
            return View();
        }
    }
    ```
- MVC 构建了一个所有特性路由操作的查找表，并且会匹配 Controller 和 Action 值来选择路由模板用于 URL 生成
    - 在上例中，生成了 `custom/url/to/destination`

### 5-2-操作名生成
- 生成URL的依据
    - `Url.Action`及其重载方法基于指定的控制器名和操作名来确定要链接的内容。
    - 在使用时，当前的 controller 和 action 路由值会被自动指定
        - 它们既是环境值也是值的一部分
        - 以此生成指向当前操作的URL路径。 
- 路由值填充规则
    - 路由会优先使用环境值来填充信息生成URL，无需额外提供值，因为默认认为所有路由参数都有值。
    - 例如对于路由`{a}/{b}/{c}/{d}`
        - 环境值为`{a=Alice, b=Bob, c=Carol, d=David}`
        - 若添加`{d=Donovan}` ，`d=David` 会被忽略，此时生成的URL是`Alice/Bob/Carol/Donovan` 。 
 - URL路径是分层的。
    - 若添加值如`{c = Cheryl}` ，会导致`c` 和`d` 原有的值（`c=Carol, d = David` ）被忽略，若此时`d` 是必需参数，因缺少值URL生成会失败。
    - 不过实际中，`Url.Action` 总会明确指定`controller` 和`action` 的值

- `Url.Action` 较长的重载也采取额外的路由值对象来提供除了 controller 和 action 意外的路由参数。
    - 最常看到的是使用 `id`，比如 `Url.Action("Buy","Products",new{id=17})`。
    - 按照惯例，路由值通常是一个匿名类的对象
        - 但是它也可以是一个IDictionary<>或者一个普通的.NET 对象。
    - 任何额外的路由值都不会匹配放置在查询字符串中的路由参数
    ```cs
    using Microsoft.AspNetCore.Mvc;

    public class TestController : Controller
    {
        public IActionResult Index()
        {
            // 生成 /Products/Buy/17?color=red
            var url = Url.Action("Buy", "Products", new { id = 17, color = "red" });
            return Content(url);
        }
    }
    ```
- 如果你想创建一个绝对URL，则可以使用一个接受protocol的重载：
    - 在该重载中，除了指定目标动作名（`"Buy"` ）、目标控制器名（`"Products"` ） 、路由值（`new { id = 17 }` ）外，还通过`protocol: Request.Scheme` 来指定协议部分
    - `Request.Scheme` 会获取当前请求的协议（如`http`或`https`），从而生成完整的绝对URL
    ```cs
    Url.Action("Buy", "Products", new { id = 17 }, protocol: Request.Scheme)
    ```

### 5-3-路由生成

### 5-4-操作结果生成

### 5-5-专用常规路由


---

## 6-区域


---


## 7-IActionConstraint
