# 参考链接
- 视频合集：[BiliBili: ASP.NET8.0入门与实战](https://www.bilibili.com/video/BV13g4y1Z7in)

---

# 第二课时：仓储——服务架构模式
- 在 Respository/UserResponsitory.cs 中，使用 .Net 高版本的反序列化方法，替代了常用的 Newtonsoft.Json

```cs
using System.Text.Json;

public async Task<List<User>> Query()
{
    await Task.CompletedTask;
    // 模拟从数据库中查询数据
    var data = "[{\"Name\":\"exampleName\"}]";
    //return Newtonsoft.Json.JsonConvert.DeserializeObject<List<User>>(data) ?? new List<User>();
    return JsonSerializer.Deserialize<List<User>>(data) ?? new List<User>();
}
```

- 建立共用层 Common
    - 提供共用的工具类

- 建立实体层 Model
    - 实体目的：
        - 作为数据传输对象（DTO）
        - 作为数据存储对象（Entity）
        - 作为数据传输对象（DTO）和数据存储对象（Entity）之间的转换
        - 不负责业务逻辑
    - 通过对具体实体建立视图对象（ViewModel），来实现 DTO 和 Entity 之间的转换

- 建立仓储层 Respository
    - 仓储目的：
        - 控制实体对象/数据库连接对象（DB），将数据对外抛送
        - 不负责业务逻辑

- 建立服务接口层 IService
    - 仓储层不应暴露给外部
    - 对仓储层抛出的对象数据进行处理
        - 防止数据泄露
    - 对 DTO 进行处理

- 建立服务层 Service
    - 继承 IService
    - 通过对 Respository、Model 的处理
        - 进行业务逻辑处理

- 业务流程分析
    1. 使用 Respository 层的 UserRespository.Query() 模拟从数据库中读取数据
    2. 将读取的数据转换为 Model 层中定义的实体 Model.User
    3. 在 UserService 层中将获取的 User 实体转换为 UserVo 实体，实现从 Entity -> DTO 转换
    4. 在 Controller 层中将 UserVo 实体转换为 UserViewModel 实体，实现从 DTO -> ViewModel 转换
    5. 在网页上发起 Get 请求，获取 UserViewModel 实体
        - 通过 ViewModel 层的 UserViewModel 显示数据

---

# 第三课时：泛型基类使用
- 面对问题
    - 1. 代码重复
    - 2. 代码不易维护
    - 3. 代码不易扩展

## 示例：创建 Role.cs 的 Model
1. 在 Model 层中创建 Role.cs 和 RoleVo.cs
2. 在 Respository 层中创建 IBaseRepository.cs
    - 作为基类接口
    - 进行泛型化
    ```cs
    public interface IBaseRepository<TEntity> where TEntity : class
    {
        Task<List<TEntity>> Query();
    }
    ```
    
3. 在 Respository 层中创建 BaseRepository.cs
    - 作为基类实现
    - 进行泛型化
    ```cs
    public class BaseResposity<TEntity> : IBaseRepository<TEntity> where TEntity : class, new()
    {
        public async Task<List<TEntity>> Query()
        {
            await Task.CompletedTask;
            var data = "[{\"Id\":18,\"Name\":\"exampleName\"}]";
            return JsonSerializer.Deserialize<List<TEntity>>(data) ?? new List<TEntity>();
        }
    }
    ```


4. 在 IService 层中创建 IBaseService.cs
    - 作为基类接口
    - 进行泛型化
    ```cs
    public interface IBaseService<TEntity,TVo>
            where TEntity : class
            where TVo : class
    {
        Task<List<TVo>> Query();
    }
    ```

5. 在 Service 层中创建 BaseService.cs
    - 作为基类实现
    - 进行泛型化
    ```cs
    public class BaseService<TEntity,TVo>
                : IBaseService<TEntity,TVo>
                    where TEntity : class, new()
                    where TVo : class, new()
    {
        public async Task<List<TVo>> Query()
        {
            var baseRepo = new BaseResposity<TEntity>();
            var data = await baseRepo.Query();
            return data.Select(x => new TVo()).ToList();
        }
    }
    ```
6. 在 Controler 层中设置输出

---

# 第四课时：泛型对象的关系映射

- 如果对服务层也做泛型基类的话，需要产生泛型
    - Entity 实体泛型
    - DTO 视图泛型
- 仓储层取得 Entity，服务层暴露 DTO
    - 需要做一个对象关系映射 ORM

- 回顾概念：依赖注入/对象关系映射
- 最终形式
    ```cs
    public class BaseService<TEntity,TVo> : IBaseService<TEntity,TVo>
                where TEntity : class, new() where TVo : class, new()
    {
        private readonly IMapper _mapper;
        public BaseService(IMapper mapper)
        {
            _mapper = mapper;
        }


        public async Task<List<TVo>> Query()
        {
            var baseRepo = new BaseResposity<TEntity>();
            var entitis = await baseRepo.Query();
            var data = _mapper.Map<List<TVo>>(entitis);

            return data.Select(x => new TVo()).ToList();
        }
    }
    ```

1. 在 `Common` 层添加对 `AutoMapper(12.0.0)` 和 `AutoMapper.Extensions.Microsoft.DependencyInjection` Nuget包的引用
    - 实际在 `14.0.0` 版本已经合并
    - 也可以使用 `Maspster`，具有更好的性能
2. 在主程序所在解决方案建立文件夹 `Extensions`
3. 在刚建立的文件夹下建立类文件 `CustomProfile.cs`，内容如下
    ```cs
    using AutoMapper;

    namespace Learn.Net8.Extensions
    {
        public class CustomProfile : Profile
        {
            /// <summary>
            /// 配置构造函数，用于创建映射关系
            /// </summary>
            public CustomProfile()
            {
                CreateMap<Role, RoleVo>()
                    .ForMember(a => a.RoleName, o => o.MapFrom(d =>d.Name));
                CreateMap<RoleVo, Role>()
                    .ForMember(a => a.Name, o => o.MapFrom(d => d.RoleName));
            }
        }
    }
    ```
4. 再建立一个新类 `AutoMapperConfig`，内容如下
    ```cs
    using AutoMapper;

    namespace Learn.Net8.Extensions
    {
        public class AutoMapperConfig
        {
            /// <summary>
            ///     注册 AutoMapper 映射配置，可以写多个配置文件（Profile）
            /// </summary>
            /// <returns>
            ///     返回 MapperConfiguration 对象
            /// </returns>
            public static MapperConfiguration RegisterMapping()
            {
                var config = new MapperConfiguration(cfg =>
                {
                    // 注册 AutoMapper 映射配置
                    cfg.AddProfile<CustomProfile>();
                    // 可以写别的
                    //cfg.AddProfile<其他Profile>();
                });
                return config;
            }
        }
    }
    ```
5. 在主程序的 `Main` 函数做依赖注入（启用服务）
    ```cs
    public static void Main(string[] args)
    {
        //...

        builder.Services.AddAutoMapper(typeof(AutoMapperConfig));
        AutoMapperConfig.RegisterMapping();
    
        //...
    }
    ```

6. 修改 `BaseService` 泛型基类
    ```cs
    using AutoMapper;
    using Learn.Net8.IService;
    using Learn.Net8.Model;
    using Learn.Net8.Repository;

    namespace Learn.Net8.Service
    {
        public class BaseService<TEntity,TVo> : IBaseService<TEntity,TVo>
                    where TEntity : class, new() where TVo : class, new()
        {
            private readonly IMapper _mapper;

            public BaseService(IMapper mapper)
            {
                _mapper = mapper;
            }

            public async Task<List<TVo>> Query()
            {
                var baseRepo = new BaseResposity<TEntity>();
                var entitis = await baseRepo.Query();
                var data = _mapper.Map<List<TVo>>(entitis);

                return data;
            }
        }
    }
    ```
7. 修改 `Controller` 层中的控制文件 `WeatherForecastController.cs`
    ```cs
    using AutoMapper;
    using Learn.Net8.Model;
    using Learn.Net8.Service;
    using Microsoft.AspNetCore.Mvc;

    namespace Learn.Net8.Controllers
    {
        
        [ApiController]
        [Route("[controller]")]
        public class WeatherForecastController : ControllerBase
        {
            //...

            private readonly IMapper _mapper;
            // 修改构造函数，注入 AutoMapper
            // 因为控制器没有使用依赖注入，所以注入 Controller 层
            public WeatherForecastController(ILogger<WeatherForecastController> logger, IMapper mapper)
            {
                _logger = logger;
                _mapper = mapper;
            }

            [HttpGet(Name = "GetWeatherForecast")]
            public async Task<List<RoleVo>> Get()
            {
                // 通过构造时传入使用
                var roleService = new BaseService<Role, RoleVo>(_mapper);
                var role = await roleService.Query();
                return role;
            }
        }
    }
    ```

---

# 第五课时：原生依赖注入串联整体框架
- 使用 泛型仓储基类+泛型服务基类 可以快速搭建框架
- 整体框架只需要引入实体模型和视图模型即可快速映射
- 但是业务逻辑复杂时不方便
    - 更适用于微服务
- 在第四课时中，如果要在 Controller 使用泛型服务基类
    1.  `new` 一个服务基类对象，构造时传入注册服务管理提供的 `IMapper` 配置对象
    2. 再在服务基类对象中 `new` 一个新的泛型仓储基类，使用仓储基类获取实体对象
    3. 再用传入的 `IMapper` 所提供的映射将实体对象转换为视图对象
    4. 将获取的视图对象返回

- 其中有大量的 `new` 操作，有内存泄漏/GC管理复杂的风险
    - 使用依赖注入减少新建实例

- 使用原生方式实现依赖注入
    1. 有一个 DI 容器，其中存放许多实例
    2. 将服务进行注册，写生命周期。
    3. 实现控制反转：不关心怎么产生管理实例，由容器处理，只知道拿到实例

1. 在 `Main` 函数中注册服务
    - 有三种生命周期选择
        - 单例（持续存在） `builder.Services.AddSingleton`
        - 辖域（一次请求到退出间均不变）
            - `builder.Services.AddScoped(接口Type<>, 实现Type<>);`
            - `builder.Services.AddScoped(typeof(IBaseRepository<>), typeof(BaseRespository<>));`
        - 瞬时（每次调用都变） `builder.Services.AddTransient`
    - 选择辖域，代码如下：
        ```cs
        // Program.cs
        main()
        {
            //...其他注册

            // 注入对象映射器服务
            builder.Services.AddAutoMapper(typeof(AutoMapperConfig));
            // 注册 AutoMapper 映射配置
            AutoMapperConfig.RegisterMapping();

            //...
        }
        ```        
    
            
            

