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

>[!note|label:为什么要进行属性注入]
> - 浏览器发起请求时，会构造一个新的相应的 Controller 实例
>     - IOC 容器负责在构造时将依赖注入
>     - 但是容器不负责调用 Controller 实例
>         - 那么控制器类中的属性也不是容器负责构造进入
> - 因为默认的 `IControlActivator` 接口的实现，是 `DefaultControllerActivator`，其又 `ITypeActivatorCache` 生成实例，所以控制器本身不是 > IOC 容器生成，容器只提供依赖
> - 所以要通过以下方法来替换掉默认的实现，从 `DefaultControllerActivator` 到 `ServiceBasedControllerActivator`
>     - 实际上，`ServiceBasedControllerActivator` 的 `Create` 方法，是从 `actionContext.HttpContext,ReguestServices` 的 `GetReguiredService(controllerType)` 获取的，实际上也是从容器中获取对应的类型，将 `controllerType` 转换为 Service 实例
>     ```cs
>     builder.Services.Replace(ServiceDescriptor
>         .Scoped<IControllerActivator,ServiceBasedControllerActivator>());
>     ```
> - 相应的，实际有如下方法，可以将控制器转为服务。
>     - 从侧面验证控制器的构造不是容器管理下实现
>     - 底层实际还是调用上面的 Replace 方法
>     ```cs
>     builder.Services.AddControllers()
>         .AddControllersAsServices();
>     ```

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

    // 这里这个属性的获取，依赖于在 Program.main() 中的 builder.Services.Replace() 方法
    // 通过上面的替换，将控制器的构造移交给容器管理，容器此时才能访问和注入到这个类的属性中
    // 如果没有替换，使用默认的 DefaultControllerActivator，容器将无法将依赖注入到相应属性内部
    // 实际也可以用如下特性标记来避免因为 Replace 导致的潜在性能问题
    // [FromService]
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


---


## 2-3-AOP服务切面编程-初探
- 上面的 Autofac 没有使用动态代理
- 动态代理需要了解 AOP——服务切面编程

> 参考[JAVA Guide: IoC & AOP详解（快速搞懂](https://javaguide.cn/system-design/framework/spring/ioc-and-aop.html)

- AOP 服务切面编程
    - 对于分层结构必然会带来切面概念
    - 分两种
        - 动态代理
        - 静态支柱

### 在 Autofac 中使用 AOP 思想
1. 添加依赖注入
    - 在 Extension 层中添加 Autofac.Extensions.DependencyInjection
    - 在 Extension 层中添加 Autofac.Extras.DynamicProxy

2. 写相应配置（设计AOP拦截器）
    - 在 Extension 层中添加AOP类拦截器 ServiceAOP.cs
        - 需要依赖 IInterceptor 接口
            - 实现 Intercept 方法
    - 在 Common 层中添加数据模型类 AOPLogInfo.cs

3. 将拦截器绑定到 Autofac
    - 在 AutofacModuleRegister.cs 中，修改服务注册
        ```cs
        // 记录目录 ...

        // 记录 AOP 切面类
        var aopTypes = new List<Type>() { typeof(ServiceAOP) };
        builder.RegisterType<ServiceAOP>();

        // 对服务类注册...
        // BaseRepository BaseServices

        // 对 Service 程序集追加配置
        // PropertiesAutowired EnableInterfaceInterceptors InterceptedBy
        builder.RegisterAssemblyTypes(assemblyServices)
                    .Where(t => t.Name.EndsWith("Service"))
                    .AsImplementedInterfaces()
                    .InstancePerLifetimeScope()
                    .PropertiesAutowired()
                    .EnableInterfaceInterceptors()
                    .InterceptedBy(aopTypes.ToArray());
        // 设置注册模式 ...
        ```

4. 但是此时还是没有成功
    - 因为控制器层中 `Get` 方法仍然调用的 `IBaseService` 对象
    - 使用服务系类泛型的注册方式
    - 需要在 AutofacModuleRegister.cs 中修改原有的注册语句
        ```cs
        // 追加三条注册配置
        // InstancePerDependency EnableInterfaceInterceptors InterceptedBy
        builder.RegisterGeneric(typeof(BaseService<>))
                .As(typeof(IBaseService<>))
                .InstancePerDependency()
                .EnableInterfaceInterceptors()
                .InterceptedBy(aopTypes.ToArray());
        ```


---


## 2-4-封装Appsetting单例类获取配置
> [老张的哲学8: 封装Appsetting单例类获取配置](https://www.bilibili.com/video/BV13g4y1Z7in/?p=8)

- 实际 .NET 底层提供了一个 IConfiguration 接口和相应扩展

- 这里使用静态类
- 也可以动态类
    - 新建一个配置文件对应的特定类
    - 然后项目中均使用引用而非硬编码
    - 这样只需要修改特定类就可以实现批量替换

### 实现
1. 写单例操作类
    - 在 Common 层中引入依赖的 Nuget 包
        - Microsoft.Extensions.Configuration
        - Microsoft.Extensions.Configuration.Json
        - Microsoft.Extensions.Configuration.Binder
    - 在 Common 层建立操作类 AppSettings.cs
        ```cs
        using Microsoft.Extensions.Configuration;
        using Microsoft.Extensions.Configuration.Json;

        namespace Learn.Net8.Common
        {
            /// <summary>
            /// appsettings.json操作类
            /// </summary>
            public class AppSettings
            {
                public static IConfiguration Configuration { get; set; }
                static string contentPath { get; set; }

                public AppSettings(string contentPath)
                {
                    string Path = "appsettings.json";

                    //如果你把配置文件 是 根据环境变量来分开了，可以这样写
                    //Path = $"appsettings.{Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT")}.json";

                    Configuration = new ConfigurationBuilder()
                        .SetBasePath(contentPath)
                        .Add(new JsonConfigurationSource
                        {
                            Path = Path,
                            Optional = false,
                            ReloadOnChange = true
                        }) //这样的话，可以直接读目录里的json文件，而不是 bin 文件夹下的，所以不用修改复制属性
                        .Build();
                }

                public AppSettings(IConfiguration configuration)
                {
                    Configuration = configuration;
                }

                /// <summary>
                /// 封装要操作的字符
                /// </summary>
                /// <param name="sections">节点配置</param>
                /// <returns></returns>
                public static string app(params string[] sections)
                {
                    try
                    {
                        if (sections.Any())
                        {
                            return Configuration[string.Join(":", sections)];
                        }
                    }
                    catch (Exception)
                    {
                    }

                    return "";
                }

                /// <summary>
                /// 递归获取配置信息数组
                /// </summary>
                /// <typeparam name="T"></typeparam>
                /// <param name="sections"></param>
                /// <returns></returns>
                public static List<T> app<T>(params string[] sections)
                {
                    List<T> list = new List<T>();
                    // 引用 Microsoft.Extensions.Configuration.Binder 包
                    Configuration.Bind(string.Join(":", sections), list);
                    return list;
                }

                /// <summary>
                /// 根据路径  configuration["App:Name"];
                /// </summary>
                /// <param name="sectionsPath"></param>
                /// <returns></returns>
                public static string GetValue(string sectionsPath)
                {
                    try
                    {
                        return Configuration[sectionsPath];
                    }
                    catch (Exception)
                    {
                    }

                    return "";
                }
            }
        }
        ```

2. 在接口层的 Program.cs 中进行单例化注册
    ```cs
    // 使用 builder.Configuration 读取 appsettings.json 配置文件
    //builder.Services.AddSingleton(new AppSettings(builder.Environment.ContentRootPath));
    builder.Services.AddSingleton(new AppSettings(builder.Configuration));
    ```

3. 使用配置文件
    1. 修改 appsetting.json（在`"AllowedHosts": "*"`后添加）
        ```json
        "AllowedHosts": "*", // 记得加逗号
        "Redis": {
            "Enabled": false,
            "ConnectionString": "localhost:6379",
            "InstanceName": "Learn.Net8" //前缀
        }
        ```
    2. 修改 Contoller
        ```cs
        [HttpGet(Name = "GetWeatherForecast")]
        public async Task<List<RoleVo>> Get()
        {
            var roleList = await _roleServiceObj.Query();
            // 下面两种读取配置文件的方法类似
            var redisEnable = AppSettings.app(new string[] { "Redis", "Enabled" }); // 但是这个自定义方法做了拼接
            var redisConnectionString = AppSettings.GetValue("Redis:ConnectionString");
            Console.WriteLine($"Enable:{redisEnable}, ConnectionString:{redisConnectionString}");
                return roleList;
        }
        ```

## 2-5-注册到原生接口 IOptions
- 原有方案（单例化 appsetting.json）
    - 启动时将配置文件中获取的内容填充到 `IConfiguration` 中，然后在 main 函数的服务注册中注入到 `AppSettings` 类中实现单例持久化，而后就可以通过特定路径读取
    - 优点：简单，可读性好
    - 弊端：使用硬编码，后续重构有风险

- 为了避免硬编码带来的弊端
    - 通过 IOptions 接口实现来动态化获取

### 实现
1. 在 Common 层添加 Nuget 包依赖
    - Microsoft.Extensions.DependencyModel
    - Microsoft.Extensions.Options.ConfigurationExtensions
2. 在 Common 层中添加配置类
    - 建立接口类作为配置类，作为标志
        ```cs
        public interface IConfigurableOptions  {   }
        ```
    - 写相应的配置类 `ConfigurableOptions`
        ```cs
        public static class ConfigurableOptions
        {
            #region 构造函数，使用 DI 注入
            internal static IConfiguration Configuration;
            public static void ConfigureApplication(this IConfiguration configuration)
            {
                Configuration = configuration;
            }
            #endregion

            #region 辅助函数
            /// <summary>获取配置路径</summary>
            /// <param name="optionsType">选项类型</param>
            /// <returns></returns>
            public static string GetConfigurationPath(Type optionsType)
            {
                var endPath = new[] { "Option", "Options" };
                var configurationPath = optionsType.Name;
                foreach (var s in endPath)
                {
                    if (configurationPath.EndsWith(s))
                    {
                        return configurationPath[..^s.Length];
                    }
                }
                return configurationPath;
            }
            #endregion

            #region 添加选项配置（注册函数）
            /// <summary>添加选项配置</summary>
            /// <typeparam name="TOptions">选项类型</typeparam>
            /// <param name="services">服务集合</param>
            /// <returns>服务集合</returns>
            public static IServiceCollection AddConfigurableOptions<TOptions>(this IServiceCollection services)
                where TOptions : class, IConfigurableOptions
            {
                Type optionsType = typeof(TOptions);
                string path = GetConfigurationPath(optionsType);
                services.Configure<TOptions>(Configuration.GetSection(path));

                return services;
            }

            public static IServiceCollection AddConfigurableOptions(this IServiceCollection services, Type type)
            {   // 根据动态类型添加路径
                string path = GetConfigurationPath(type);
                // 根据路径获取配置节点
                var config = Configuration.GetSection(path);
                // 获取值
                Type iOptionsChangeTokenSource = typeof(IOptionsChangeTokenSource<>);
                Type iConfigureOptions = typeof(IConfigureOptions<>);
                Type configurationChangeTokenSource = typeof(ConfigurationChangeTokenSource<>);
                Type namedConfigureFromConfigurationOptions = typeof(NamedConfigureFromConfigurationOptions<>);
                iOptionsChangeTokenSource = iOptionsChangeTokenSource.MakeGenericType(type);
                iConfigureOptions = iConfigureOptions.MakeGenericType(type);
                configurationChangeTokenSource = configurationChangeTokenSource.MakeGenericType(type);
                namedConfigureFromConfigurationOptions = namedConfigureFromConfigurationOptions.MakeGenericType(type);
                // 进行服务注册
                services.AddOptions();
                services.AddSingleton(iOptionsChangeTokenSource,
                    Activator.CreateInstance(configurationChangeTokenSource, Options.DefaultName, config) ?? throw new InvalidOperationException());
                return services.AddSingleton(iConfigureOptions,
                    Activator.CreateInstance(namedConfigureFromConfigurationOptions, Options.DefaultName, config) ?? throw new InvalidOperationException());
            }
            #endregion
        }
        ```
    - 回顾前面在 appsettings.json 中的 Redis 配置，写 `RedisOptions`
        ```cs
        /// <summary>
        /// Redis缓存配置选项
        /// </summary>
        public sealed class RedisOptions : IConfigurableOptions
        {
            /// <summary>
            /// 是否启用
            /// </summary>
            public bool Enable { get; set; }

            /// <summary>
            /// Redis连接
            /// </summary>
            public string ConnectionString { get; set; }

            /// <summary>
            /// 键值前缀
            /// </summary>
            public string InstanceName { get; set; }
        }
        ```
3. 在 Extension 层中添加注册配置文件 AllOptionRegister.cs
    ```cs
    public static class AllOptionRegister
    {
        /// <summary>
        /// 注册所有选项配置
        /// </summary>
        /// <param name="services">主服务</param>
        /// <exception cref="ArgumentNullException"></exception>
        public static void AddAllOptionRegister(this IServiceCollection services)
        {
            // 检查服务集合是否为空
            if (services == null) throw new ArgumentNullException(nameof(services));

            // 获取所有实现 IConfigurableOptions 接口的类型，并注册
            foreach (var optionType in typeof(ConfigurableOptions).Assembly.GetTypes().Where(s =>
                         !s.IsInterface && typeof(IConfigurableOptions).IsAssignableFrom(s)))
            {
                services.AddConfigurableOptions(optionType);
            }
        }
    }
    ```
4. 在接口层 Program.cs 的 main 函数中注册
    - 在 `builder.Host` 中使用 `ConfigureAppConfiguration` 注册
        - 如果此处不注册，也可以在下面注入配置文件前调用 `ConfigurableOptions.ConfigureApplication(builder.Configuration);` 注册
    - 注册服务时调用 `builder.Services.AddAllOptionRegister();`
    ```cs
        var builder = WebApplication.CreateBuilder(args);
        builder.Host
            .UseServiceProviderFactory(new AutofacServiceProviderFactory())
            .ConfigureContainer<ContainerBuilder>(builder =>
            {
                //...
            })
            .ConfigureAppConfiguration((hostingContent, config) =>
            {
                // 读取配置文件
                hostingContent.Configuration.ConfigureApplication();
            });
    //其他服务注册...

    // 2-4 中的硬编码方法
    // 使用 builder.Configuration 读取 appsettings.json 配置文件
    //builder.Services.AddSingleton(new AppSettings(builder.Configuration));

    // 用如下方法替代
    // 如果 builder.host.Configuration 未配置则加上此行
    //ConfigurableOptions.ConfigureApplication(builder.Configuration);
    // 注入全体配置文件（实现 IConfigurableOptions 接口）
    builder.Services.AddAllOptionRegister();
    ```
5. 在控制器中设置测试
    ```cs
    [HttpGet(Name = "GetWeatherForecast")]
    public async Task<List<RoleVo>> Get()
    {
        var roleList = await _roleService.Query();       
        var redisOptions = _redisOptions.Value;
        Console.WriteLine($"Redis Service Options: Enable:{redisOptions.Enable}, ConnectionString:{redisOptions.ConnectionString}, InstanceName: {redisOptions.InstanceName}");
        return roleList;
    }
    ```


---


## 2-6-非依赖注入管道中获取所有服务
- 配置的几种选择
    - 静态化配置文件 `appsettings.json` `App.config`
        - 优点：灵活
        - 缺点：（硬编码）不方便修改和重构
    - IOptions 依赖注入
        - 优点：方便修改，取用灵活
        - 缺点：只能借助容器进行获取，没办法自由取用服务实例
    - 使用非依赖注入的管道

1. 在 Common 层中引用 Nuget 包
    - Serilog
    - Serilog.AspNetCore
    - 不使用 Log4Net，虽然使用 ILogger 接口，但是不如所用的 Serilog

2. 在 Common 层中新建文件夹 `Core`
    - 在 Common.Core 中建立一个类 `InternalApp`
        ```cs
        using Microsoft.AspNetCore.Builder;
        using Microsoft.AspNetCore.Hosting;
        using Microsoft.Extensions.Configuration;
        using Microsoft.Extensions.DependencyInjection;
        using Microsoft.Extensions.Hosting;

        //命名空间相关...

        /// <summary>
        /// 内部只用于初始化使用
        /// </summary>
        public static class InternalApp
        {
            internal static IServiceCollection InternalServices;

            /// <summary>根服务</summary>
            internal static IServiceProvider RootServices;

            /// <summary>获取Web主机环境</summary>
            internal static IWebHostEnvironment WebHostEnvironment;

            /// <summary>获取泛型主机环境</summary>
            internal static IHostEnvironment HostEnvironment;

            /// <summary>配置对象</summary>
            internal static IConfiguration Configuration;

            public static void ConfigureApplication(this WebApplicationBuilder web)
            {
                HostEnvironment = web.Environment;
                WebHostEnvironment = web.Environment;
                InternalServices = web.Services;
            }

            public static void ConfigureApplication(this IConfiguration configuration)
            {
                Configuration = configuration;
            }

            public static void ConfigureApplication(this IHost app)
            {
                RootServices = app.Services;
            }
        }
        ```

    - 在 Common.Core 建立依赖类 `RuntimeExtension`
        ```cs
        public static class RuntimeExtension
        {
            /// <summary>
            /// 获取项目程序集，排除所有的系统程序集(Microsoft.***、System.***等)、Nuget下载包
            /// </summary>
            /// <returns></returns>
            public static IList<Assembly> GetAllAssemblies()
            {
                var list = new List<Assembly>();
                var deps = DependencyContext.Default;
                //只加载项目中的程序集
                var libs = deps.CompileLibraries.Where(lib => !lib.Serviceable && lib.Type == "project"); //排除所有的系统程序集、Nuget下载包
                foreach (var lib in libs)
                {
                    try
                    {
                        var assembly = AssemblyLoadContext.Default.LoadFromAssemblyName(new AssemblyName(lib.Name));
                        list.Add(assembly);
                    }
                    catch (Exception e)
                    {
                        Log.Debug(e, "GetAllAssemblies Exception:{ex}", e.Message);
                    }
                }

                return list;
            }

            public static Assembly GetAssembly(string assemblyName)
            {
                return GetAllAssemblies().FirstOrDefault(assembly => assembly.FullName.Contains(assemblyName));
            }

            public static IList<Type> GetAllTypes()
            {
                var list = new List<Type>();
                foreach (var assembly in GetAllAssemblies())
                {
                    var typeInfos = assembly.DefinedTypes;
                    foreach (var typeInfo in typeInfos)
                    {
                        list.Add(typeInfo.AsType());
                    }
                }

                return list;
            }

            public static IList<Type> GetTypesByAssembly(string assemblyName)
            {
                var list = new List<Type>();
                var assembly = AssemblyLoadContext.Default.LoadFromAssemblyName(new AssemblyName(assemblyName));
                var typeInfos = assembly.DefinedTypes;
                foreach (var typeInfo in typeInfos)
                {
                    list.Add(typeInfo.AsType());
                }

                return list;
            }

            public static Type GetImplementType(string typeName, Type baseInterfaceType)
            {
                return GetAllTypes().FirstOrDefault(t =>
                {
                    if (t.Name == typeName &&
                        t.GetTypeInfo().GetInterfaces().Any(b => b.Name == baseInterfaceType.Name))
                    {
                        var typeInfo = t.GetTypeInfo();
                        return typeInfo.IsClass && !typeInfo.IsAbstract && !typeInfo.IsGenericType;
                    }

                    return false;
                });
            }
        }
        ```

    - 在 Common.Core 中建立类 `App`
        - 类似 `AppSettings.cs` 的作用
    
        ```cs
            public class App
        {
            static App()
            {
                EffectiveTypes = Assemblies.SelectMany(GetTypes);
            }

            private static bool _isRun;

            /// <summary>是否正在运行</summary>
            public static bool IsBuild { get; set; }

            public static bool IsRun
            {
                get => _isRun;
                set => _isRun = IsBuild = value;
            }

            /// <summary>应用有效程序集</summary>
            public static readonly IEnumerable<Assembly> Assemblies = RuntimeExtension.GetAllAssemblies();

            /// <summary>有效程序集类型</summary>
            public static readonly IEnumerable<Type> EffectiveTypes;

            /// <summary>优先使用App.GetService()手动获取服务</summary>
            public static IServiceProvider RootServices => IsRun || IsBuild ? InternalApp.RootServices : null;

            /// <summary>获取Web主机环境，如，是否是开发环境，生产环境等</summary>
            public static IWebHostEnvironment WebHostEnvironment => InternalApp.WebHostEnvironment;

            /// <summary>获取泛型主机环境，如，是否是开发环境，生产环境等</summary>
            public static IHostEnvironment HostEnvironment => InternalApp.HostEnvironment;

            /// <summary>全局配置选项</summary>
            public static IConfiguration Configuration => InternalApp.Configuration;

            /// <summary>
            /// 获取请求上下文
            /// </summary>
            public static HttpContext HttpContext => RootServices?.GetService<IHttpContextAccessor>()?.HttpContext;

            //public static IUser User => GetService<IUser>();

            #region Service

            /// <summary>解析服务提供器</summary>
            /// <param name="serviceType"></param>
            /// <param name="mustBuild"></param>
            /// <param name="throwException"></param>
            /// <returns></returns>
            public static IServiceProvider GetServiceProvider(Type serviceType, bool mustBuild = false, bool throwException = true)
            {
                if (HostEnvironment == null || RootServices != null &&
                    InternalApp.InternalServices
                        .Where(u =>
                            u.ServiceType ==
                            (serviceType.IsGenericType ? serviceType.GetGenericTypeDefinition() : serviceType))
                        .Any(u => u.Lifetime == ServiceLifetime.Singleton))
                    return RootServices;

                //获取请求生存周期的服务
                if (HttpContext?.RequestServices != null)
                    return HttpContext.RequestServices;

                if (RootServices != null)
                {
                    IServiceScope scope = RootServices.CreateScope();
                    return scope.ServiceProvider;
                }

                if (mustBuild)
                {
                    if (throwException)
                    {
                        throw new ApplicationException("当前不可用，必须要等到 WebApplication Build后");
                    }

                    return default;
                }

                ServiceProvider serviceProvider = InternalApp.InternalServices.BuildServiceProvider();
                return serviceProvider;
            }

            public static TService GetService<TService>(bool mustBuild = true) where TService : class =>
                GetService(typeof(TService), null, mustBuild) as TService;

            /// <summary>获取请求生存周期的服务</summary>
            /// <typeparam name="TService"></typeparam>
            /// <param name="serviceProvider"></param>
            /// <param name="mustBuild"></param>
            /// <returns></returns>
            public static TService GetService<TService>(IServiceProvider serviceProvider, bool mustBuild = true)
                where TService : class => (serviceProvider ?? GetServiceProvider(typeof(TService), mustBuild, false))?.GetService<TService>();

            /// <summary>获取请求生存周期的服务</summary>
            /// <param name="type"></param>
            /// <param name="serviceProvider"></param>
            /// <param name="mustBuild"></param>
            /// <returns></returns>
            public static object GetService(Type type, IServiceProvider serviceProvider = null, bool mustBuild = true) =>
                (serviceProvider ?? GetServiceProvider(type, mustBuild, false))?.GetService(type);

            #endregion

            #region private

            /// <summary>加载程序集中的所有类型</summary>
            /// <param name="ass"></param>
            /// <returns></returns>
            private static IEnumerable<Type> GetTypes(Assembly ass)
            {
                Type[] source = Array.Empty<Type>();
                try
                {
                    source = ass.GetTypes();
                }
                catch
                {
                    Console.WriteLine($@"Error load `{ass.FullName}` assembly.");
                }

                return source.Where(u => u.IsPublic);
            }

            #endregion

            #region Options

            /// <summary>获取配置</summary>
            /// <typeparam name="TOptions">强类型选项类</typeparam>
            /// <returns>TOptions</returns>
            public static TOptions GetConfig<TOptions>()
                where TOptions : class, IConfigurableOptions
            {
                TOptions instance = Configuration
                    .GetSection(ConfigurableOptions.GetConfigurationPath(typeof(TOptions)))
                    .Get<TOptions>();
                return instance;
            }

            /// <summary>获取选项</summary>
            /// <typeparam name="TOptions">强类型选项类</typeparam>
            /// <param name="serviceProvider"></param>
            /// <returns>TOptions</returns>
            public static TOptions GetOptions<TOptions>(IServiceProvider serviceProvider = null) where TOptions : class, new()
            {
                IOptions<TOptions> service = GetService<IOptions<TOptions>>(serviceProvider ?? RootServices, false);
                return service?.Value;
            }

            /// <summary>获取选项</summary>
            /// <typeparam name="TOptions">强类型选项类</typeparam>
            /// <param name="serviceProvider"></param>
            /// <returns>TOptions</returns>
            public static TOptions GetOptionsMonitor<TOptions>(IServiceProvider serviceProvider = null)
                where TOptions : class, new()
            {
                IOptionsMonitor<TOptions> service =
                    GetService<IOptionsMonitor<TOptions>>(serviceProvider ?? RootServices, false);
                return service?.CurrentValue;
            }

            /// <summary>获取选项</summary>
            /// <typeparam name="TOptions">强类型选项类</typeparam>
            /// <param name="serviceProvider"></param>
            /// <returns>TOptions</returns>
            public static TOptions GetOptionsSnapshot<TOptions>(IServiceProvider serviceProvider = null)
                where TOptions : class, new()
            {
                IOptionsSnapshot<TOptions> service = GetService<IOptionsSnapshot<TOptions>>(serviceProvider, false);
                return service?.Value;
            }

            #endregion
        }
        ```

3. 设置启动时构造 App 类
    - 在 Extension.ServiceExtensions 中添加一个配置类 
        ```cs
        using Learn.Net8.Common.Core;
        using Microsoft.AspNetCore.Builder;
        using Serilog;

        namespace Learn.Net8.Extension.ServiceExtensions

        public static class ApplicationSetup
        {
            public static void UseApplicationSetup(this WebApplication app)
            {
                // app 的生命周期开始的时候，注册 App 类的 IsRun 属性为 true
                app.Lifetime.ApplicationStarted.Register(() =>
                {
                    App.IsRun = true;
                });
                // app 的生命周期结束的时候，注册 App 类的 IsRun 属性为 false
                app.Lifetime.ApplicationStopped.Register(() =>
                {
                    App.IsRun = false;

                    //清除日志
                    Log.CloseAndFlush();
                });
            }
        }
        ```

4. 在 Program.cs 中注册
    - 建立了了 App 类后，实际就不需要再使用 `ConfigurableOptions` 类中的 `ConfigureApplication` 方法来获取
    - 修改 Extension.ServiceExtensions.ConfigurableOptions.cs
        ```cs
        #region 构造函数，使用 DI 注入，被非依赖注入管道调用替代
        //internal static IConfiguration Configuration;
        //public static void ConfigureApplication(this IConfiguration configuration)
        //{
        //    Configuration = configuration;
        //}
        #endregion

        // 修改注册函数
        IServiceCollection AddConfigurableOptions<TOptions>(this IServiceCollection services)
        {
            //...前缀代码

            // 使用 App.Configuration
            // 而非当前类原有的依靠IOC注入的 ConfigurableOptions.Configuration
            services.Configure<TOptions>(App.Configuration.GetSection(path));

            //...后续代码
        }

        // 修改注册配置函数
        IServiceCollection AddConfigurableOptions(this IServiceCollection services, Type type)
        {
            //...前缀代码

            // 同样改用 App.Configuration
            // 原有用 IOC 容器获取配置对象 ConfigurableOptions.Configuration
            // var config = Configuration.GetSection(path);
            var config = App.Configuration.GetSection(path);

            //...后续代码
        }
        ```
    
    - 回顾 [上一节](#2-5-注册到原生接口-ioptions) 中的注入方法，进行修改如下
        - 其中使用 `builder.Host.ConfigureAppConfiguration<ContainerBuilder>{...} `读取配置文件的部分
            - 未修改 ConfigurableOptions.cs 前指向的是 ConfigurableOptions 类通过 IOC 容器构造时 DI 获取的
            - 修改后变为基于 App.cs
        - 而后追加了配置的绑定
        ```cs
        builder.Host
        .UseServiceProviderFactory(new AutofacServiceProviderFactory())
        .ConfigureContainer<ContainerBuilder>(builder =>
        {
            // 使用自定义注册器
            //...
        }).
        ConfigureAppConfiguration((hostingContent, config) =>
        {
            // 读取配置文件
            hostingContent.Configuration.ConfigureApplication();
        });

        // 使用 InternalApp.ConfigureApplication() 方法
        // 配置 WebApplicationBuilder 获取 WebHost 和 环境变量
        builder.ConfigureApplication();

        //... 其他builder 服务注册

        var app = builder.Build();  // 不修改此处，正常进行app构建

        // 只有 Build() 完成后才能获取容器中的 Service 实例
        // 对 App 实例进行配置
        app.ConfigureApplication();
        // 使用 ApplicationSetup 类的扩展方法，设置 App 的 IsRun 属性，作为标记
        app.UseApplicationSetup();
        ```

5. 在 Controller 中这样使用
    ```cs
    [HttpGet(Name = "GetWeatherForecast")]
    public async Task<List<RoleVo>> Get()
    {
        // 通过 App 的 GetService 方法从 RootServices 获取服务
        var roleServiveObjNew = App.GetService<IBaseService<Role,RoleVo>>(false);
        var roleList = await roleServiveObjNew.Query();

        // 可以通过如下方法获取配置文件
        var redisOptions = App.GetOptions<RedisOptions>();
        var redisConnetionString = redisOptions.ConnectionString;

        return roleList;
    }
    ```

## 2-7-分布式缓存接口
- 项目大小对缓存选择的影响：
    - 小项目建议使用内存缓存
    - 大项目建议使用分布式缓存(如REDIS)
- 使用多种缓存时，控制器注入不同的接口可能导致复杂性
    - 实现类可能不同，导致兼容性问题
    - 使用统一接口和实现类的解决方案
- 需要一种方法能够控制多个实现类，同时不让调用者过多关注底层实现。

- .NET 提供了一个标准分布式缓存接口 `IDistributedCache`
    - 来自 Microsoft.Extensions.Caching.Distributed 

### 实现
1. 引用依赖环境：在 Extensions 层中添加依赖
    ```xml
    <!---->
    <Project Sdk="Microsoft.NET.Sdk">
        <!--其他配置-->
        <ItemGroup>
            <!--其他依赖项-->
            <PackageReference Include="Microsoft.Extensions.Caching.StackExchangeRedis" Version="9.0.2" />
            <PackageReference Include="StackExchange.Redis" Version="2.8.31" />
        </ItemGroup>
    ```

2. 添加依赖服务实体
    - 在 Extensions 层中添加 Redis 文件夹
    - 在 Extensions.Redis 中添加接口 `IRedisBasketRepository`

        ```cs
        /// <summary>
        /// Redis缓存接口
        /// </summary>
        [Description("普通缓存考虑直接使用ICaching,如果要使用Redis队列等还是使用此类")]
        public interface IRedisBasketRepository
        {

            //获取 Reids 缓存值
            Task<string> GetValue(string key);

            //获取值，并序列化
            Task<TEntity> Get<TEntity>(string key);

            //保存
            Task Set(string key, object value, TimeSpan cacheTime);

            //判断是否存在
            Task<bool> Exist(string key);

            //移除某一个缓存值
            Task Remove(string key);

            //全部清除
            Task Clear();

            Task<RedisValue[]> ListRangeAsync(string redisKey);
            Task<long> ListLeftPushAsync(string redisKey, string redisValue, int db = -1);
            Task<long> ListRightPushAsync(string redisKey, string redisValue, int db = -1);
            Task<long> ListRightPushAsync(string redisKey, IEnumerable<string> redisValue, int db = -1);
            Task<T> ListLeftPopAsync<T>(string redisKey, int db = -1) where T : class;
            Task<T> ListRightPopAsync<T>(string redisKey, int db = -1) where T : class;
            Task<string> ListLeftPopAsync(string redisKey, int db = -1);
            Task<string> ListRightPopAsync(string redisKey, int db = -1);
            Task<long> ListLengthAsync(string redisKey, int db = -1);
            Task<IEnumerable<string>> ListRangeAsync(string redisKey, int db = -1);
            Task<IEnumerable<string>> ListRangeAsync(string redisKey, int start, int stop, int db = -1);
            Task<long> ListDelRangeAsync(string redisKey, string redisValue, long type = 0, int db = -1);
            Task ListClearAsync(string redisKey, int db = -1);

        }
        ```

    - 在 Exntensions.Redis 中添加它的实现类 `RedisBasketRepository`

        ```cs
        [Description("普通缓存考虑直接使用ICaching,如果要使用Redis队列等还是使用此类")]
        public class RedisBasketRepository : IRedisBasketRepository
        {
            private readonly ILogger<RedisBasketRepository> _logger;
            private readonly ConnectionMultiplexer _redis;
            private readonly IDatabase _database;

            public RedisBasketRepository(ILogger<RedisBasketRepository> logger, ConnectionMultiplexer redis)
            {
                _logger = logger;
                _redis = redis;
                _database = redis.GetDatabase();
            }

            private IServer GetServer()
            {
                var endpoint = _redis.GetEndPoints();
                return _redis.GetServer(endpoint.First());
            }

            public async Task Clear()
            {
                foreach (var endPoint in _redis.GetEndPoints())
                {
                    var server = GetServer();
                    foreach (var key in server.Keys())
                    {
                        await _database.KeyDeleteAsync(key);
                    }
                }
            }

            public async Task<bool> Exist(string key)
            {
                return await _database.KeyExistsAsync(key);
            }

            public async Task<string> GetValue(string key)
            {
                return await _database.StringGetAsync(key);
            }

            public async Task Remove(string key)
            {
                await _database.KeyDeleteAsync(key);
            }

            public async Task Set(string key, object value, TimeSpan cacheTime)
            {
                if (value != null)
                {
                    if (value is string cacheValue)
                    {
                        // 字符串无需序列化
                        await _database.StringSetAsync(key, cacheValue, cacheTime);
                    }
                    else
                    {
                        //序列化，将object值生成RedisValue
                        await _database.StringSetAsync(key, SerializeHelper.Serialize(value), cacheTime);
                    }
                }
            }

            public async Task<TEntity> Get<TEntity>(string key)
            {
                var value = await _database.StringGetAsync(key);
                if (value.HasValue)
                {
                    //需要用的反序列化，将Redis存储的Byte[]，进行反序列化
                    return SerializeHelper.Deserialize<TEntity>(value);
                }
                else
                {
                    return default;
                }
            }

            /// <summary>
            /// 根据key获取RedisValue
            /// </summary>
            /// <typeparam name="T"></typeparam>
            /// <param name="redisKey"></param>
            /// <returns></returns>
            public async Task<RedisValue[]> ListRangeAsync(string redisKey)
            {
                return await _database.ListRangeAsync(redisKey);
            }

            /// <summary>
            /// 在列表头部插入值。如果键不存在，先创建再插入值
            /// </summary>
            /// <param name="redisKey"></param>
            /// <param name="redisValue"></param>
            /// <returns></returns>
            public async Task<long> ListLeftPushAsync(string redisKey, string redisValue, int db = -1)
            {
                return await _database.ListLeftPushAsync(redisKey, redisValue);
            }
            
            /// <summary>
            /// 在列表尾部插入值。如果键不存在，先创建再插入值
            /// </summary>
            /// <param name="redisKey"></param>
            /// <param name="redisValue"></param>
            /// <returns></returns>
            public async Task<long> ListRightPushAsync(string redisKey, string redisValue, int db = -1)
            {
                return await _database.ListRightPushAsync(redisKey, redisValue);
            }

            /// <summary>
            /// 在列表尾部插入数组集合。如果键不存在，先创建再插入值
            /// </summary>
            /// <param name="redisKey"></param>
            /// <param name="redisValue"></param>
            /// <returns></returns>
            public async Task<long> ListRightPushAsync(string redisKey, IEnumerable<string> redisValue, int db = -1)
            {
                var redislist = new List<RedisValue>();
                foreach (var item in redisValue)
                {
                    redislist.Add(item);
                }
                return await _database.ListRightPushAsync(redisKey, redislist.ToArray());
            }

            /// <summary>
            /// 移除并返回存储在该键列表的第一个元素  反序列化
            /// </summary>
            /// <param name="redisKey"></param>
            /// <returns></returns>
            public async Task<T> ListLeftPopAsync<T>(string redisKey, int db = -1) where T : class
            {
                return JsonConvert.DeserializeObject<T>(await _database.ListLeftPopAsync(redisKey));
            }

            /// <summary>
            /// 移除并返回存储在该键列表的最后一个元素   反序列化
            /// 只能是对象集合
            /// </summary>
            /// <param name="redisKey"></param>
            /// <returns></returns>
            public async Task<T> ListRightPopAsync<T>(string redisKey, int db = -1) where T : class
            {
                return JsonConvert.DeserializeObject<T>(await _database.ListRightPopAsync(redisKey));
            }

            /// <summary>
            /// 移除并返回存储在该键列表的第一个元素   
            /// </summary>
            /// <param name="redisKey"></param>
            /// <param name="db"></param>
            /// <returns></returns>
            public async Task<string> ListLeftPopAsync(string redisKey, int db = -1)
            {
                return await _database.ListLeftPopAsync(redisKey);
            }

            /// <summary>
            /// 移除并返回存储在该键列表的最后一个元素   
            /// </summary>
            /// <typeparam name="T"></typeparam>
            /// <param name="redisKey"></param>
            /// <param name="db"></param>
            /// <returns></returns>
            public async Task<string> ListRightPopAsync(string redisKey, int db = -1)
            {
                return await _database.ListRightPopAsync(redisKey);
            }

            /// <summary>
            /// 列表长度
            /// </summary>
            /// <param name="redisKey"></param>
            /// <param name="db"></param>
            /// <returns></returns>
            public async Task<long> ListLengthAsync(string redisKey, int db = -1)
            {
                return await _database.ListLengthAsync(redisKey);
            }

            /// <summary>
            /// 返回在该列表上键所对应的元素
            /// </summary>
            /// <param name="redisKey"></param>
            /// <returns></returns>
            public async Task<IEnumerable<string>> ListRangeAsync(string redisKey, int db = -1)
            {
                var result = await _database.ListRangeAsync(redisKey);
                return result.Select(o => o.ToString());
            }

            /// <summary>
            /// 根据索引获取指定位置数据
            /// </summary>
            /// <param name="redisKey"></param>
            /// <param name="start"></param>
            /// <param name="stop"></param>
            /// <param name="db"></param>
            /// <returns></returns>
            public async Task<IEnumerable<string>> ListRangeAsync(string redisKey, int start, int stop, int db = -1)
            {
                var result = await _database.ListRangeAsync(redisKey, start, stop);
                return result.Select(o => o.ToString());
            }

            /// <summary>
            /// 删除List中的元素 并返回删除的个数
            /// </summary>
            /// <param name="redisKey">key</param>
            /// <param name="redisValue">元素</param>
            /// <param name="type">大于零 : 从表头开始向表尾搜索，小于零 : 从表尾开始向表头搜索，等于零：移除表中所有与 VALUE 相等的值</param>
            /// <param name="db"></param>
            /// <returns></returns>
            public async Task<long> ListDelRangeAsync(string redisKey, string redisValue, long type = 0, int db = -1)
            {
                return await _database.ListRemoveAsync(redisKey, redisValue, type);
            }

            /// <summary>
            /// 清空List
            /// </summary>
            /// <param name="redisKey"></param>
            /// <param name="db"></param>
            public async Task ListClearAsync(string redisKey, int db = -1)
            {
                await _database.ListTrimAsync(redisKey, 1, 0);
            }
        }
        ```
    
    - 在 Common 层中添加缓存常量存储类 `CacheConst`

        ```cs
         /// <summary>
        /// 缓存相关常量
        /// </summary>
        public class CacheConst
        {
            /// <summary>
            /// 用户缓存
            /// </summary>
            public const string KeyUser = "user:";

            /// <summary>
            /// 用户部门缓存
            /// </summary>
            public const string KeyUserDepart = "userDepart:";

            /// <summary>
            /// 菜单缓存
            /// </summary>
            public const string KeyMenu = "menu:";

            /// <summary>
            /// 菜单
            /// </summary>
            public const string KeyPermissions = "permissions";

            /// <summary>
            /// 权限缓存
            /// </summary>
            public const string KeyPermission = "permission:";

            /// <summary>
            /// 接口路由
            /// </summary>
            public const string KeyModules = "modules";

            /// <summary>
            /// 系统配置
            /// </summary>
            public const string KeySystemConfig = "sysConfig";

            /// <summary>
            /// 查询过滤器缓存
            /// </summary>
            public const string KeyQueryFilter = "queryFilter:";

            /// <summary>
            /// 机构Id集合缓存
            /// </summary>
            public const string KeyOrgIdList = "org:";

            /// <summary>
            /// 最大角色数据范围缓存
            /// </summary>
            public const string KeyMaxDataScopeType = "maxDataScopeType:";

            /// <summary>
            /// 验证码缓存
            /// </summary>
            public const string KeyVerCode = "verCode:";

            /// <summary>
            /// 所有缓存关键字集合
            /// </summary>
            public const string KeyAll = "keys";

            /// <summary>
            /// 定时任务缓存
            /// </summary>
            public const string KeyTimer = "timer:";

            /// <summary>
            /// 在线用户缓存
            /// </summary>
            public const string KeyOnlineUser = "onlineuser:";

            /// <summary>
            /// 常量下拉框
            /// </summary>
            public const string KeyConstSelector = "selector:";

            /// <summary>
            /// swagger登录缓存
            /// </summary>
            public const string SwaggerLogin = "swaggerLogin:";
        }
        ```

    - 在 Common 层中添加序列化工具类 `SerializeHelper`

        ```cs
        public class SerializeHelper
        {
            /// <summary>
            /// 序列化
            /// </summary>
            /// <param name="item"></param>
            /// <returns></returns>
            public static byte[] Serialize(object item)
            {
                var jsonString = JsonConvert.SerializeObject(item);

                return Encoding.UTF8.GetBytes(jsonString);
            }
            /// <summary>
            /// 反序列化
            /// </summary>
            /// <typeparam name="TEntity"></typeparam>
            /// <param name="value"></param>
            /// <returns></returns>
            public static TEntity Deserialize<TEntity>(byte[] value)
            {
                if (value == null)
                {
                    return default;
                }
                var jsonString = Encoding.UTF8.GetString(value);
                return JsonConvert.DeserializeObject<TEntity>(jsonString);
            }
        }
        ```

    - 在 Common 层中添加文件夹 Caches
    - 在 Common.Caches 中添加接口 `ICaching`，其继承了 `IDistributed`

        ```cs
        /// <summary>
        /// 缓存抽象接口,基于IDistributedCache封装
        /// </summary>
        public interface ICaching
        {
            public IDistributedCache Cache { get; }
            void AddCacheKey(string cacheKey);
            Task AddCacheKeyAsync(string cacheKey);

            void DelByPattern(string key);
            Task DelByPatternAsync(string key);

            void DelCacheKey(string cacheKey);
            Task DelCacheKeyAsync(string cacheKey);

            bool Exists(string cacheKey);
            Task<bool> ExistsAsync(string cacheKey);

            List<string> GetAllCacheKeys();
            Task<List<string>> GetAllCacheKeysAsync();

            T Get<T>(string cacheKey);
            Task<T> GetAsync<T>(string cacheKey);

            object Get(Type type, string cacheKey);
            Task<object> GetAsync(Type type, string cacheKey);

            string GetString(string cacheKey);
            Task<string> GetStringAsync(string cacheKey);

            void Remove(string key);
            Task RemoveAsync(string key);

            void RemoveAll();
            Task RemoveAllAsync();

            void Set<T>(string cacheKey, T value, TimeSpan? expire = null);
            Task SetAsync<T>(string cacheKey, T value);
            Task SetAsync<T>(string cacheKey, T value, TimeSpan expire);

            void SetPermanent<T>(string cacheKey, T value);
            Task SetPermanentAsync<T>(string cacheKey, T value);

            void SetString(string cacheKey, string value, TimeSpan? expire = null);
            Task SetStringAsync(string cacheKey, string value);
            Task SetStringAsync(string cacheKey, string value, TimeSpan expire);

            Task DelByParentKeyAsync(string key);
        }
        ```
    
    - 在 Common.Caches 中添加其实现类 `Caching`

        ```cs
        public class Caching : ICaching
        {
            private readonly IDistributedCache _cache;

            public Caching(IDistributedCache cache)
            {
                _cache = cache;
            }

            private byte[] GetBytes<T>(T source)
            {
                return Encoding.UTF8.GetBytes(JsonConvert.SerializeObject(source));
            }

            public IDistributedCache Cache => _cache;

            public void AddCacheKey(string cacheKey)
            {
                var res = _cache.GetString(CacheConst.KeyAll);
                var allkeys = string.IsNullOrWhiteSpace(res) ? new List<string>() : JsonConvert.DeserializeObject<List<string>>(res);
                if (!allkeys.Any(m => m == cacheKey))
                {
                    allkeys.Add(cacheKey);
                    _cache.SetString(CacheConst.KeyAll, JsonConvert.SerializeObject(allkeys));
                }
            }

            /// <summary>
            /// 增加缓存Key
            /// </summary>
            /// <param name="cacheKey"></param>
            /// <returns></returns>
            public async Task AddCacheKeyAsync(string cacheKey)
            {
                var res = await _cache.GetStringAsync(CacheConst.KeyAll);
                var allkeys = string.IsNullOrWhiteSpace(res) ? new List<string>() : JsonConvert.DeserializeObject<List<string>>(res);
                if (!allkeys.Any(m => m == cacheKey))
                {
                    allkeys.Add(cacheKey);
                    await _cache.SetStringAsync(CacheConst.KeyAll, JsonConvert.SerializeObject(allkeys));
                }
            }

            public void DelByPattern(string key)
            {
                var allkeys = GetAllCacheKeys();
                if (allkeys == null) return;

                var delAllkeys = allkeys.Where(u => u.Contains(key)).ToList();
                delAllkeys.ForEach(u => { _cache.Remove(u); });

                // 更新所有缓存键
                allkeys = allkeys.Where(u => !u.Contains(key)).ToList();
                _cache.SetString(CacheConst.KeyAll, JsonConvert.SerializeObject(allkeys));
            }

            /// <summary>
            /// 删除某特征关键字缓存
            /// </summary>
            /// <param name="key"></param>
            /// <returns></returns>
            public async Task DelByPatternAsync(string key)
            {
                var allkeys = await GetAllCacheKeysAsync();
                if (allkeys == null) return;

                var delAllkeys = allkeys.Where(u => u.Contains(key)).ToList();
                delAllkeys.ForEach(u => { _cache.Remove(u); });

                // 更新所有缓存键
                allkeys = allkeys.Where(u => !u.Contains(key)).ToList();
                await _cache.SetStringAsync(CacheConst.KeyAll, JsonConvert.SerializeObject(allkeys));
            }

            public void DelCacheKey(string cacheKey)
            {
                var res = _cache.GetString(CacheConst.KeyAll);
                var allkeys = string.IsNullOrWhiteSpace(res) ? new List<string>() : JsonConvert.DeserializeObject<List<string>>(res);
                if (allkeys.Any(m => m == cacheKey))
                {
                    allkeys.Remove(cacheKey);
                    _cache.SetString(CacheConst.KeyAll, JsonConvert.SerializeObject(allkeys));
                }
            }

            /// <summary>
            /// 删除缓存
            /// </summary>
            /// <param name="cacheKey"></param>
            /// <returns></returns>
            public async Task DelCacheKeyAsync(string cacheKey)
            {
                var res = await _cache.GetStringAsync(CacheConst.KeyAll);
                var allkeys = string.IsNullOrWhiteSpace(res) ? new List<string>() : JsonConvert.DeserializeObject<List<string>>(res);
                if (allkeys.Any(m => m == cacheKey))
                {
                    allkeys.Remove(cacheKey);
                    await _cache.SetStringAsync(CacheConst.KeyAll, JsonConvert.SerializeObject(allkeys));
                }
            }

            public bool Exists(string cacheKey)
            {
                var res = _cache.Get(cacheKey);
                return res != null;
            }

            /// <summary>
            /// 检查给定 key 是否存在
            /// </summary>
            /// <param name="cacheKey">键</param>
            /// <returns></returns>
            public async Task<bool> ExistsAsync(string cacheKey)
            {
                var res = await _cache.GetAsync(cacheKey);
                return res != null;
            }

            public List<string> GetAllCacheKeys()
            {
                var res = _cache.GetString(CacheConst.KeyAll);
                return string.IsNullOrWhiteSpace(res) ? null : JsonConvert.DeserializeObject<List<string>>(res);
            }

            /// <summary>
            /// 获取所有缓存列表
            /// </summary>
            /// <returns></returns>
            public async Task<List<string>> GetAllCacheKeysAsync()
            {
                var res = await _cache.GetStringAsync(CacheConst.KeyAll);
                return string.IsNullOrWhiteSpace(res) ? null : JsonConvert.DeserializeObject<List<string>>(res);
            }

            public T Get<T>(string cacheKey)
            {
                var res = _cache.Get(cacheKey);
                return res == null ? default : JsonConvert.DeserializeObject<T>(Encoding.UTF8.GetString(res));
            }

            /// <summary>
            /// 获取缓存
            /// </summary>
            /// <typeparam name="T"></typeparam>
            /// <param name="cacheKey"></param>
            /// <returns></returns>
            public async Task<T> GetAsync<T>(string cacheKey)
            {
                var res = await _cache.GetAsync(cacheKey);
                return res == null ? default : JsonConvert.DeserializeObject<T>(Encoding.UTF8.GetString(res));
            }

            public object Get(Type type, string cacheKey)
            {
                var res = _cache.Get(cacheKey);
                return res == null ? default : JsonConvert.DeserializeObject(Encoding.UTF8.GetString(res), type);
            }

            public async Task<object> GetAsync(Type type, string cacheKey)
            {
                var res = await _cache.GetAsync(cacheKey);
                return res == null ? default : JsonConvert.DeserializeObject(Encoding.UTF8.GetString(res), type);
            }

            public string GetString(string cacheKey)
            {
                return _cache.GetString(cacheKey);
            }

            /// <summary>
            /// 获取缓存
            /// </summary>
            /// <param name="cacheKey"></param>
            /// <returns></returns>
            public async Task<string> GetStringAsync(string cacheKey)
            {
                return await _cache.GetStringAsync(cacheKey);
            }

            public void Remove(string key)
            {
                _cache.Remove(key);
                DelCacheKey(key);
            }

            /// <summary>
            /// 删除缓存
            /// </summary>
            /// <param name="key"></param>
            /// <returns></returns>
            public async Task RemoveAsync(string key)
            {
                await _cache.RemoveAsync(key);
                await DelCacheKeyAsync(key);
            }

            public void RemoveAll()
            {
                var catches = GetAllCacheKeys();
                foreach (var @catch in catches) Remove(@catch);

                catches.Clear();
                _cache.SetString(CacheConst.KeyAll, JsonConvert.SerializeObject(catches));
            }

            public async Task RemoveAllAsync()
            {
                var catches = await GetAllCacheKeysAsync();
                foreach (var @catch in catches) await RemoveAsync(@catch);

                catches.Clear();
                await _cache.SetStringAsync(CacheConst.KeyAll, JsonConvert.SerializeObject(catches));
            }

            public void Set<T>(string cacheKey, T value, TimeSpan? expire = null)
            {
                _cache.Set(cacheKey, GetBytes(value),
                    expire == null
                        ? new DistributedCacheEntryOptions() { AbsoluteExpirationRelativeToNow = TimeSpan.FromHours(6) }
                        : new DistributedCacheEntryOptions() { AbsoluteExpirationRelativeToNow = expire });

                AddCacheKey(cacheKey);
            }

            /// <summary>
            /// 增加对象缓存
            /// </summary>
            /// <param name="cacheKey"></param>
            /// <param name="value"></param>
            /// <returns></returns>
            public async Task SetAsync<T>(string cacheKey, T value)
            {
                await _cache.SetAsync(cacheKey, Encoding.UTF8.GetBytes(JsonConvert.SerializeObject(value)),
                    new DistributedCacheEntryOptions() { AbsoluteExpirationRelativeToNow = TimeSpan.FromHours(6) });

                await AddCacheKeyAsync(cacheKey);
            }

            /// <summary>
            /// 增加对象缓存,并设置过期时间
            /// </summary>
            /// <param name="cacheKey"></param>
            /// <param name="value"></param>
            /// <param name="expire"></param>
            /// <returns></returns>
            public async Task SetAsync<T>(string cacheKey, T value, TimeSpan expire)
            {
                await _cache.SetAsync(cacheKey, Encoding.UTF8.GetBytes(JsonConvert.SerializeObject(value)),
                    new DistributedCacheEntryOptions() { AbsoluteExpirationRelativeToNow = expire });

                await AddCacheKeyAsync(cacheKey);
            }

            public void SetPermanent<T>(string cacheKey, T value)
            {
                _cache.Set(cacheKey, Encoding.UTF8.GetBytes(JsonConvert.SerializeObject(value)));
                AddCacheKey(cacheKey);
            }

            public async Task SetPermanentAsync<T>(string cacheKey, T value)
            {
                await _cache.SetAsync(cacheKey, Encoding.UTF8.GetBytes(JsonConvert.SerializeObject(value)));
                await AddCacheKeyAsync(cacheKey);
            }

            public void SetString(string cacheKey, string value, TimeSpan? expire = null)
            {
                if (expire == null)
                    _cache.SetString(cacheKey, value, new DistributedCacheEntryOptions() { AbsoluteExpirationRelativeToNow = TimeSpan.FromHours(6) });
                else
                    _cache.SetString(cacheKey, value, new DistributedCacheEntryOptions() { AbsoluteExpirationRelativeToNow = expire });

                AddCacheKey(cacheKey);
            }

            /// <summary>
            /// 增加字符串缓存
            /// </summary>
            /// <param name="cacheKey"></param>
            /// <param name="value"></param>
            /// <returns></returns>
            public async Task SetStringAsync(string cacheKey, string value)
            {
                await _cache.SetStringAsync(cacheKey, value, new DistributedCacheEntryOptions() { AbsoluteExpirationRelativeToNow = TimeSpan.FromHours(6) });

                await AddCacheKeyAsync(cacheKey);
            }

            /// <summary>
            /// 增加字符串缓存,并设置过期时间
            /// </summary>
            /// <param name="cacheKey"></param>
            /// <param name="value"></param>
            /// <param name="expire"></param>
            /// <returns></returns>
            public async Task SetStringAsync(string cacheKey, string value, TimeSpan expire)
            {
                await _cache.SetStringAsync(cacheKey, value, new DistributedCacheEntryOptions() { AbsoluteExpirationRelativeToNow = expire });

                await AddCacheKeyAsync(cacheKey);
            }

            /// <summary>
            /// 缓存最大角色数据范围
            /// </summary>
            /// <param name="userId"></param>
            /// <param name="dataScopeType"></param>
            /// <returns></returns>
            public async Task SetMaxDataScopeType(long userId, int dataScopeType)
            {
                var cacheKey = CacheConst.KeyMaxDataScopeType + userId;
                await SetStringAsync(cacheKey, dataScopeType.ToString());

                await AddCacheKeyAsync(cacheKey);
            }

            /// <summary>
            ///  根据父键清空
            /// </summary>
            /// <param name="key"></param>
            /// <returns></returns>
            public async Task DelByParentKeyAsync(string key)
            {
                var allkeys = await GetAllCacheKeysAsync();
                if (allkeys == null) return;

                var delAllkeys = allkeys.Where(u => u.StartsWith(key)).ToList();
                delAllkeys.ForEach(Remove);
                // 更新所有缓存键
                allkeys = allkeys.Where(u => !u.StartsWith(key)).ToList();
                await SetStringAsync(CacheConst.KeyAll, JsonConvert.SerializeObject(allkeys));
            }
        }
        ```

    - 在 Extensions.ServiceExtensions 中添加类 `CacheSetup`
        ```cs
        public static class CacheSetup
        {
            /// <summary>
            /// 统一注册缓存
            /// </summary>
            /// <param name="services"></param>
            public static void AddCacheSetup(this IServiceCollection services)
            {
                // 取用 App.GetOptions<RedisOptions>() 读取配置文件
                var cacheOptions = App.GetOptions<RedisOptions>();
                // 如果开启了Redis缓存
                if (cacheOptions.Enable)
                {
                    // 配置启动Redis服务
                    // 虽然可能影响项目启动速度，但是不能在运行的时候报错，所以是合理的
                    services.AddSingleton<IConnectionMultiplexer>(sp =>
                    {
                        //获取连接字符串
                        var configuration = ConfigurationOptions.Parse(cacheOptions.ConnectionString, true);
                        configuration.ResolveDns = true;
                        return ConnectionMultiplexer.Connect(configuration);
                    });
                    // 使用单例模式，初始化Redis连接池
                    services.AddSingleton<ConnectionMultiplexer>(p => p.GetService<IConnectionMultiplexer>() as ConnectionMultiplexer);

                    // 使用 Redis 的分布式缓存
                    // 核心在如下语句，通过对 IDistributedCache 的实现类 RedisCacheImpl 进行注册
                    // services.Add(ServiceDescriptor.Singleton<IDistributedCache, RedisCacheImpl>());
                    services.AddStackExchangeRedisCache(options =>
                    {
                        options.ConnectionMultiplexerFactory = () => Task.FromResult(App.GetService<IConnectionMultiplexer>(false));
                        if (!string.IsNullOrEmpty(cacheOptions.InstanceName)) options.InstanceName = cacheOptions.InstanceName;
                    });
                    // 注册 RedisBasketRepository 服务
                    services.AddTransient<IRedisBasketRepository, RedisBasketRepository>();
                }
                else  // 如果没有开启Redis缓存
                {
                    // 使用内存缓存
                    services.AddMemoryCache();
                    // 使用分布式内存缓存
                    // 核心在如下语句，通过对 IDistributedCache 的实现类 MemoryDistributedCache 进行注册
                    // services.TryAdd(ServiceDescriptor.Singleton<IDistributedCache, MemoryDistributedCache>());
                    services.AddDistributedMemoryCache();
                }

                // 注册缓存服务
                services.AddSingleton<ICaching, Caching>();
            }
        }
        ```

3. 服务注册：在接口层 Program 类的 Main 函数中做如下修改

    ```cs
        // ...其他服务注册...

        // 添加 Redis 缓存
        builder.Services.AddCacheSetup();

        // 构建应用程序
        var app = builder.Build();
        //...
    ```

4. 使用缓存：在控制器中使用如下方法使用缓存
    - 记得设置接口层中的 appsetting.json 中的 `Redis:Enabled` 为 `true`
    ```cs
    private readonly IBaseService<Role, RoleVo> _roleService;
    private readonly IOptions<RedisOptions> _redisOptions;
    private readonly IServiceScopeFactory _scopeFactory;
    private readonly ICaching _caching;

    public WeatherForecastController(ILogger<WeatherForecastController> logger,
                        IBaseService<Role, RoleVo> roleService,
                        IOptions<RedisOptions> options,
                        IServiceScopeFactory scopeFactory,
                        ICaching caching)
    {
        _logger = logger;
        _roleService = roleService;
        _redisOptions = options;
        _scopeFactory = scopeFactory;
        _caching = caching;
    }

    /// <summary>
    /// 测试分布式缓存，这里修改返回值为 object
    /// </summary>
    /// <returns>测试使用的空字符串返回</returns>
    [HttpGet(Name = "GetWeatherForecast")]
    public async Task<object> Get()
    {
        Console.WriteLine("api GET begin");

        var cacheKey = "cache-key";

        List<string> cacheKeys = await _caching.GetAllCacheKeysAsync();

        await Console.Out.WriteLineAsync($"缓存列表：{JsonConvert.SerializeObject(cacheKeys)}");

        await Console.Out.WriteLineAsync("添加一个缓存");
        await _caching.SetStringAsync(cacheKey, "Hi, Add Cache To REDIS!");
        await Console.Out.WriteLineAsync($"缓存列表：{JsonConvert.SerializeObject(await _caching.GetAllCacheKeysAsync())}");
        await Console.Out.WriteLineAsync($"当前Key内容：{JsonConvert.SerializeObject(await _caching.GetStringAsync(cacheKey))}");

        await Console.Out.WriteLineAsync("删除一个缓存");
        await _caching.RemoveAsync(cacheKey);
        await Console.Out.WriteLineAsync($"缓存列表：{JsonConvert.SerializeObject(await _caching.GetAllCacheKeysAsync())}");

        Console.WriteLine("api GET end");
        return "";
    }
    ```
