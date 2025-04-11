# 2-自定义项目框架

## 2-1-自定义项目框架模板——如何进行Nuget包打包
- [参考链接](https://www.bilibili.com/video/BV13g4y1Z7in)

### 核心文件
- content
    - 放置所有源码
    - 不放置 obj 和 bin（但是有 .gitignore .gitattributes .sln和 README.md）
    - 另外需要有一个子文件夹 .template.config
        - 有子文件 `template.json` 内容如下
        ```json
        {
            $schema": "http://json.schemastore.org/template"
            "author": "作者",
            "classifications": [ "Web/WebAPI" 类型],
            "name": "包体显示名",
            "identity": "包体的唯一身份名"
            "shortName": "简称"
            "tags": {
                "language": "C#语言",
                "type":"project类型"
            },
            "sourceName":"启动项目名，也是使用模板时被替换的名字"
            "preferNameDirectory": true
        }
        ```
- license
    - 可以放空 `license.txt`
- 包体的唯一身份名.nuspec
    ```xml
    <?xml version="1.0" encoding="utf-8"?>
    <package xmlns="http://schemas.microsoft.com/packaging/2012/06/nuspec.xsd">
        <metadata>
            <id>包体的唯一身份名</id>
            <version>版本号</version>
            <description>包描述</description>
            <authors>包作者</authors>
            <packageTypes>
                <packageType name="Template"/>
            </packageTypes>
            <licenseUrl>许可声明的完整URL</licenseUrl>
            <projectUrl>项目的托管地址完整URL</projectUrl>
            <iconUrl>包体图标的完整URL</iconUrl>
            <copyright>版权声明标识</copyright>
            <tags>包体的标签</tags>
        </metadata>
    </package>
    ```

### 打包 Nuget 包
- 在准备好核心文件后通过命令行来生成项目
    - 可以建立 `Package.bat` 来实现一键打包
    - .bat 脚本内容如下
        ```bash
        nuget package 包体的唯一身份名.nuspec

        pause
        ```
    - 只需要双击运行就可以尝试构建程序包
- 生成好后会出现文件「包体的唯一身份名.版本号.nupkg」

- 使用只需要下载文件然后执行命令行去安装
    - 使用整个文件，需要将上面的 .nupkg 拷贝过来
    - 然后在目标路径下
        - 如果已经上传官网，则无需填入相对路径，可以直接官网下载
        - 实际 `-u` 是删除原有包体（避免版本问题），`-i` 是新建
        ```bash
        dotnet new -u 包体名
        dotnet new -i [相对路径/]包体的唯一身份名.版本号.nupkg
        dotnet new --list
        pause
        ```
- 具体使用
    - 可以直接使用命令行形式新建
        ```bash
        dotnet new -i 包体名
        set /p OP=请输入创建项目名:
        md .输入的项目名
        cd .输入的项目名
        dotnet new 上面包体的简短名 -n %OP%
        cd ../
        ```
    - 也可以直接用 Visual Studio 直接创建


---


## 2-2-使用Autofac实现框架的依赖注入
- 在[第一部分](/ProjectDocs/cs/Back-end-Development/Csharp/DotNet8/1-Reponsitory-Service.md)中，使用原生依赖注入

- 建立一个新的类库项目，作为拓展层（`Learn.Net8.Extension`）
    - 将原有项目中的 Extension 文件夹中的文件迁移过来
        - （以上例名说明：）如果原有项目为 `Learn.Net8`，其中有文件夹 `./Extension`
        - 则默认其中所有类均在与拓展层同名的命名空间（`Learn.Net8.Extension`），无需再调整命名空间
    - 并将相应的引用更改到拓展层项目
        - 拓展层应该引用服务层
        - 接口层应该引用拓展层

> [!tip]
> 此时有依赖关系：
> ```
> - 接口层
>     -> 拓展层
>         -> 服务层
>             -> 抽象服务层（无依赖）
>             -> 仓储层
>                 -> 实体层
>                     -> 共用底层
> ```


### 改造原有项目，设置为 Autofac 容器
- 对[第一部分](/ProjectDocs/cs/Back-end-Development/Csharp/DotNet8/1-Reponsitory-Service.md)的项目不使用原生依赖注入。
- 改为使用 Autofac 组件实现框架依赖注入

1. 添加 Nuget 包
    - 在管理 Nuget 包中搜索 Autofac
    - 安装 Autofac.Extensions.DependencyInjection（注意看版本支持）
        - 已经包括核心组件 Autofac

2. 在 Extension 层中添加配置注册文件 AutofacModuleRegister.cs
    ```cs
    using Autofac;
    using System.Reflection;
    using Learn.Net8.IService;
    using Learn.Net8.Service;
    using Learn.Net8.Repository;

    namespace Learn.Net8.Extension
    {
        // 继承 Autofac.Module 类
        // Autofac.Module 是 Autofac 的模块化注册类
        public class AutofacModuleRegister : Autofac.Module
        {
            protected override void Load(ContainerBuilder builder)
            {
                // 记录上下文当前目录，生成在 Bin 同文件夹下
                var basePath = AppContext.BaseDirectory;
                // 记录服务层目录
                var servicesDllFile = Path.Combine(basePath, "Learn.Net8.Service.dll");
                // 记录仓储层目录
                var repositoryDllFile = Path.Combine(basePath, "Learn.Net8.Repository.dll");

                // 设置注册模式
                builder.RegisterGeneric(typeof(BaseRepository<>))
                    .As(typeof(IBaseRepository<>))
                    .InstancePerDependency();
                
                builder.RegisterGeneric(typeof(BaseService<,>))
                    .As(typeof(IBaseService<,>))
                    .InstancePerDependency();

                // 通过反射获取 Service.dll 程序集服务
                var assemblyServices = Assembly.LoadFrom(servicesDllFile);
                // 注册：
                //  限定以 Service 结尾的类才会被注册
                //  对其实现的所有接口注册当前类为实现类
                //  设置属性自动注入
                //  设置生命周期为每次请求创建一个新的实例
                builder.RegisterAssemblyTypes(assemblyServices)
                                    .Where(t => t.Name.EndsWith("Service"))
                                    .AsImplementedInterfaces()
                                    .PropertiesAutowired()
                                    .InstancePerLifetimeScope();

                // 同样设置仓储层
                var assemblyRepository = Assembly.LoadFrom(repositoryDllFile);
                builder.RegisterAssemblyTypes(assemblyRepository)
                                    .Where(t => t.Name.EndsWith("Repository"))
                                    .AsImplementedInterfaces()
                                    .PropertiesAutowired()
                                    .InstancePerLifetimeScope();
            }
        }
    }
    ```

3. 修改 Program.cs
    - 取消原有的服务注册语句
        ```cs
        // 原来的 main:
        var builder = WebApplication.CreateBuilder(args);

        //注入服务
        builder.Services.AddControllers();
        builder.Services.AddEndpointsApiExplorer();
        builder.Services.AddSwaggerGen();
        builder.Services.AddAutoMapper(typeof(AutoMapperConfig));
        AutoMapperConfig.RegisterMapping();

        // 注入自定义服务
        builder.Services.AddScoped(typeof(IBaseRepository<>), typeof(BaseRepository<>));
        // 均是双参数泛型，需要在尖括号中指定类型，这里直接使用逗号分隔空填
        builder.Services.AddScoped(typeof(IBaseService<,>), typeof(BaseService<,>));
        
        // 后续 Build 和中间件注册
        ```
    
    - 重新设置容器
        ```cs
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);
            // 配置 builder 的宿主机 Host
            // 通过 AutofacServiceProviderFactory 创建 Autofac 容器
            builder.Host
                .UseServiceProviderFactory(new AutofacServiceProviderFactory())
                .ConfigureContainer<ContainerBuilder>(builder => {
                    // 使用自定义注册器
                    builder.RegisterModule<AutofacModuleRegister>();

                    // 这里还需要属性注册
                });

            // 这里在属性注册时要设置服务实例传递

            builder.Services.AddControllers();
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();
            builder.Services.AddAutoMapper(typeof(AutoMapperConfig));
            AutoMapperConfig.RegisterMapping();

            // 构建应用程序
            var app = builder.Build();

            // 注入中间件
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }
            // 启动授权中间件
            app.UseAuthorization();
            // 启动路由中间件
            app.MapControllers();
            // 启动应用程序
            app.Run();
        }
        ```

- 上面的 AutofacModuleRegister 使用了 `InstancePerLifetimeScope`
    - 每次做 Get 请求开始到完成，整体是一个 Scope 规划的过程
    - 例子：考虑如下场景
        - 在控制器的 `Get` 中，如果进行了两次 `Query` 操作
        - 两次操作之间的 HashCode 是否会改变
        ```cs
        [HttpGet(Name = "GetWeatherForecast")]
        public async Task<List<RoleVo>> Get()
        {
            var roleList = await _roleService.Query();
            Console.Writeline(_roleService.GetHashCode());
            var roleList_ReQuery = await _roleServide.Query();
            Console.Writeline(_roleService.GetHashCode());

            return roleList;
        }
        ```

        - 发现在这一次 Get 内部，HashCode 不变


- 如果想看到每次 Query 都拿到不一样的服务实例，需要这样更改控制器
    ```cs
    private readonly IServiceScopeFactory _scopeFactory;
    // 依赖注入一个 服务辖域工厂 IServiceScopeFactory
    public WeatherForecastController(ILogger<WeatherForecastController> logger,
                        IBaseService<Role,RoleVo> roleService,
                        IServiceScopeFactory scopeFactory)
    {
        _logger = logger;
        _roleService = roleService;
        _scopeFactory = scopeFactory;
    }

    [HttpGet(Name = "GetWeatherForecast")]
    public async Task<List<RoleVo>> Get()
    {
        using var scope = _scopeFactory.CreateScope();

        var _dateStaticService = scope.ServiceProvider
            .GetRequiredService<IBaseService<Role, RoleVo>>();
        var roleList = await _dateStaticService.Query();

        var _dateStaticService_Ano = scope.ServiceProvider
            .GetRequiredService<IBaseService<Role, RoleVo>>();
        var roleList_Ano = await _dateStaticService_Ano.Query();

        return roleList;
    }
    ```

- 在 IOC 影响下，取服务是瞬态的，但是在注入到 Contoller 时引入的这个服务就是确定的
    - 内部不会产生新的服务实例
    - 没有 return 响应就算同一辖域，使用同一个服务实例
        - 类似如下：
            ```cs
            class A(B b, C c)
            {
                // 内部均使用在实例化 A 时构造的 b 和 c
            }
            ```

### 对当前容器设置属性注入
1. 在接口层添加注册配置文件
    - 在 Learn.Net8 项目的 Extension 文件夹中添加类 AutofacPropertityModuleReg.cs
    ```cs
    using Autofac;

    namespace Learn.Net8.Extensions
    {
        public class AutofacPropertityModuleReg :Autofac.Module
        {
            protected override void Load(ContainerBuilder builder)
            {
                var controllerBaseType = typeof(Microsoft.AspNetCore.Mvc.ControllerBase);
                builder.RegisterAssemblyTypes(typeof(Program).Assembly)
                    .Where(t => controllerBaseType.IsAssignableFrom(t) && t!=controllerBaseType.BaseType)
                    .PropertiesAutowired();

                //也可以使用下面的方式
                //builder.RegisterAssemblyTypes(typeof(Program).Assembly)
                //    .PropertiesAutowired();
            }
        }
    }
    ```

2. 在 Program.cs 的容器注册部分添加属性注入
    - 并且要设置控制器
    ```cs
    //...
    builder.Host
        .UseServiceProviderFactory(new AutofacServiceProviderFactory())
        .ConfigureContainer<ContainerBuilder>(builder => {
            builder.RegisterModule<AutofacModuleRegister>();


            // 添加属性注入
            builder.RegisterModule<AutofacPropertityModuleReg>();

        });
    
    // 将 IControllerActivator 服务的实现替换为 ServiceBasedControllerActivator
    // 这里选择使用 Scoped 生命周期
    builder.Services.Replace(ServiceDescriptor
                            .Scoped<IControllerActivator,ServiceBasedControllerActivator>());

    //然后再注入控制器服务
    builder.Services.AddControllers();
    ```

3. 在控制器进行注入
    - 这里要求是公共属性
    ```cs
    private readonly IBaseService<Role, RoleVo> _roleService;
    public IBaseService<Role, RoleVo> _roleServiceObj { get; set; }

    public WeatherForecastController(ILogger<WeatherForecastController> logger,
                        IBaseService<Role, RoleVo> roleService)
    {
        _logger = logger;
        _roleService = roleService;
    }

    [HttpGet(Name = "GetWeatherForecast")]
    public async Task<List<RoleVo>> Get()
    {
        var roleList = await _roleServiceObj.Query();
        return roleList;
    }
    ```

### 忘记注册服务所带来错误的区别：
- 回顾：原生框架下
    - 如果在 `Program.cs` 中只注册了一个服务：
        - 应该注册两个服务：
            - 仓储层 `builder.Services.AddScoped(typeof(IBaseRepository<>), typeof(BaseRepository<>));`
            - 服务层 `builder.Services.AddScoped(typeof(IBaseService<,>), typeof(BaseService<,>));`
        - 会抛出异常：
            ```
            System.InvalidOperationException:
                Unable to resolve service for type
                    '主项目名.服务所在层.具体服务名`1[对应实体模型]'
                while attempting to activate
                    '主项目名.服务所在层.具体服务名`2[传入的对应实体模型]'.
            ```

- 使用 Autofac 设置后
    ```
    Autofac.Core.DependencyResolutionException:
        An exception was throw while activating
            项目名.控制器名
        -> 对应服务`1[[参数名, 所在命名空间, Version, Culture, PublicKeyToken],...].
        ---> 详细信息
    ```

