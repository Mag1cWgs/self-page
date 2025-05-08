# SQL Sugar 基本用法

- 在 .NET 8 学习中，接触到缓存概念
    - [本站链接](../../Back-end-Development/Csharp/DotNet8/2-Customize-Project-Framework.md)
    - 包括其他概念：配置、选项、AutoFac容器等
- 均有相应模板概念
    1. 配置依赖
    2. 服务注册
    3. 引用服务（联动配置）
- 无论是用什么 ORM 工具，基本步骤均一致

## 引用 SqlSugar 并实现注册简单实例
### 1 在 Common 层中引用 SqlSugarCore 的 NUGET 包
### 2 配置 SqlSugarCore 服务
1. 在 Common 层中建立文件夹 DB，并在其中新建类 `MainDb`
    - 记录当前应用链接的数据库实例

    ```cs
    public static class MainDb
    {
        public static string CurrentDbConnId = "Main";
    }
    ```

2. 在 Common.DB 中新建类 `BaseDBConfig`

    ```cs
    public class BaseDBConfig
    {
        /// <summary>
        /// 所有库配置
        /// </summary>
        public static readonly List<ConnectionConfig> AllConfigs = new();

        /// <summary>
        /// 有效的库连接(除去Log库)
        /// </summary>
        public static List<ConnectionConfig> ValidConfig = new();

        public static ConnectionConfig MainConfig;
        public static ConnectionConfig LogConfig; //日志库

        public static bool IsMulti => ValidConfig.Count > 1;

        /* 目前是多库操作，默认加载的是appsettings.json设置为true的第一个db连接。
        *
        * 优化配置连接
        * 老的配置方式,再多库和从库中有些冲突
        * 直接在单个配置中可以配置从库
        *
        * 新增故障转移方案
        * 增加主库备用连接,配置方式为ConfigId为主库的ConfigId+随便数字 只要不重复就好
        *
        * 主库在无法连接后会自动切换到备用链接
        */
        public static (List<MutiDBOperate> allDbs, List<MutiDBOperate> slaveDbs) MutiConnectionString => MutiInitConn();


        public static (List<MutiDBOperate>, List<MutiDBOperate>) MutiInitConn()
        {
            List<MutiDBOperate> listdatabase = AppSettings.app<MutiDBOperate>("DBS")
                .Where(i => i.Enabled).ToList();
            var mainDbId = AppSettings.app(new string[] { "MainDB" }).ToString();
            var mainDbModel = listdatabase.Single(d => d.ConnId == mainDbId);
            listdatabase.Remove(mainDbModel);
            listdatabase.Insert(0, mainDbModel);

            foreach (var i in listdatabase) SpecialDbString(i);
            return (listdatabase, mainDbModel.Slaves);
        }

        private static string DifDBConnOfSecurity(params string[] conn)
        {
            foreach (var item in conn)
            {
                try
                {
                    if (File.Exists(item))
                    {
                        return File.ReadAllText(item).Trim();
                    }
                }
                catch (Exception)
                {
                }
            }

            return conn[conn.Length - 1];
        }

        /// <summary>
        /// 定制Db字符串
        /// 目的是保证安全：优先从本地txt文件获取，若没有文件则从appsettings.json中获取
        /// </summary>
        /// <param name="mutiDBOperate"></param>
        /// <returns></returns>
        private static MutiDBOperate SpecialDbString(MutiDBOperate mutiDBOperate)
        {
            if (mutiDBOperate.DbType == DataBaseType.Sqlite)
            {
                mutiDBOperate.Connection =
                    $"DataSource=" + Path.Combine(Environment.CurrentDirectory, mutiDBOperate.Connection);
            }
            else if (mutiDBOperate.DbType == DataBaseType.SqlServer)
            {
                mutiDBOperate.Connection = DifDBConnOfSecurity(@"D:\my-file\dbCountPsw1_SqlserverConn.txt",
                    mutiDBOperate.Connection);
            }
            else if (mutiDBOperate.DbType == DataBaseType.MySql)
            {
                mutiDBOperate.Connection =
                    DifDBConnOfSecurity(@"D:\my-file\dbCountPsw1_MySqlConn.txt", mutiDBOperate.Connection);
            }
            else if (mutiDBOperate.DbType == DataBaseType.Oracle)
            {
                mutiDBOperate.Connection =
                    DifDBConnOfSecurity(@"D:\my-file\dbCountPsw1_OracleConn.txt", mutiDBOperate.Connection);
            }

            return mutiDBOperate;
        }
    }


    public enum DataBaseType
    {
        MySql = 0,
        SqlServer = 1,
        Sqlite = 2,
        Oracle = 3,
        PostgreSQL = 4,
        Dm = 5,
        Kdbndp = 6,
    }

    public class MutiDBOperate
    {
        /// <summary>
        /// 连接启用开关
        /// </summary>
        public bool Enabled { get; set; }

        /// <summary>
        /// 连接ID
        /// </summary>
        public string ConnId { get; set; }

        /// <summary>
        /// 从库执行级别，越大越先执行
        /// </summary>
        public int HitRate { get; set; }

        /// <summary>
        /// 连接字符串
        /// </summary>
        public string Connection { get; set; }

        /// <summary>
        /// 数据库类型
        /// </summary>
        public DataBaseType DbType { get; set; }

        /// <summary>
        /// 从库
        /// </summary>
        public List<MutiDBOperate> Slaves { get; set; }
    }
    ```

3. 同样，新建类 `SqlSugarConst`

    ```cs
    public class SqlSugarConst
    {
        /// <summary>
        /// 默认Log数据库标识
        /// </summary>
        public const string LogConfigId = "Log";
    }
    ```

4. 在 Common 新建类 `UtilConvert`
    - 方便做字符串扩展

    ```cs
    public static class UtilConvert
    {
        /// <summary>
        /// 拓展方法：从 object 到 int
        /// </summary>
        /// <param name="thisValue"></param>
        /// <returns></returns>
        public static int ObjToInt(this object thisValue)
        {
            int reval = 0;
            if (thisValue == null) return 0;
            if (thisValue != DBNull.Value && int.TryParse(thisValue.ToString(), out reval))
            {
                return reval;
            }

            return reval;
        }

        /// <summary>
        /// 扩展方法：从 object 到 int
        /// </summary>
        /// <param name="thisValue"></param>
        /// <param name="errorValue">转换失败时指定值</param>
        /// <returns></returns>
        public static int ObjToInt(this object thisValue, int errorValue)
        {
            int reval = 0;
            if (thisValue != null && thisValue != DBNull.Value && int.TryParse(thisValue.ToString(), out reval))
            {
                return reval;
            }

            return errorValue;
        }

        /// <summary>
        /// 拓展方法：从 object 到 long
        /// </summary>
        /// <param name="thisValue"></param>
        /// <returns></returns>
        public static long ObjToLong(this object thisValue)
        {
            long reval = 0;
            if (thisValue == null) return 0;
            if (thisValue != DBNull.Value && long.TryParse(thisValue.ToString(), out reval))
            {
                return reval;
            }

            return reval;
        }

        public static double ObjToMoney(this object thisValue)
        {
            double reval = 0;
            if (thisValue != null && thisValue != DBNull.Value && double.TryParse(thisValue.ToString(), out reval))
            {
                return reval;
            }

            return 0;
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="thisValue"></param>
        /// <param name="errorValue"></param>
        /// <returns></returns>
        public static double ObjToMoney(this object thisValue, double errorValue)
        {
            double reval = 0;
            if (thisValue != null && thisValue != DBNull.Value && double.TryParse(thisValue.ToString(), out reval))
            {
                return reval;
            }

            return errorValue;
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="thisValue"></param>
        /// <returns></returns>
        public static string ObjToString(this object thisValue)
        {
            if (thisValue != null) return thisValue.ToString().Trim();
            return "";
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="thisValue"></param>
        /// <returns></returns>
        public static bool IsNotEmptyOrNull(this object thisValue)
        {
            return thisValue.ObjToString() != "" && thisValue.ObjToString() != "undefined" &&
                thisValue.ObjToString() != "null";
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="thisValue"></param>
        /// <param name="errorValue"></param>
        /// <returns></returns>
        public static string ObjToString(this object thisValue, string errorValue)
        {
            if (thisValue != null) return thisValue.ToString().Trim();
            return errorValue;
        }

        public static bool IsNullOrEmpty(this object thisValue) => thisValue == null || thisValue == DBNull.Value ||
                                                                string.IsNullOrWhiteSpace(thisValue.ToString());

        /// <summary>
        /// 
        /// </summary>
        /// <param name="thisValue"></param>
        /// <returns></returns>
        public static decimal ObjToDecimal(this object thisValue)
        {
            decimal reval = 0;
            if (thisValue != null && thisValue != DBNull.Value && decimal.TryParse(thisValue.ToString(), out reval))
            {
                return reval;
            }

            return 0;
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="thisValue"></param>
        /// <param name="errorValue"></param>
        /// <returns></returns>
        public static decimal ObjToDecimal(this object thisValue, decimal errorValue)
        {
            decimal reval = 0;
            if (thisValue != null && thisValue != DBNull.Value && decimal.TryParse(thisValue.ToString(), out reval))
            {
                return reval;
            }

            return errorValue;
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="thisValue"></param>
        /// <returns></returns>
        public static DateTime ObjToDate(this object thisValue)
        {
            DateTime reval = DateTime.MinValue;
            if (thisValue != null && thisValue != DBNull.Value && DateTime.TryParse(thisValue.ToString(), out reval))
            {
                reval = Convert.ToDateTime(thisValue);
            }
            else
            {
                //时间戳转为时间
                var seconds = thisValue.ObjToLong();
                if (seconds > 0)
                {
                    var startTime = TimeZoneInfo.ConvertTime(new DateTime(1970, 1, 1), TimeZoneInfo.Local);
                    reval = startTime.AddSeconds(Convert.ToDouble(thisValue));
                }
            }

            return reval;
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="thisValue"></param>
        /// <param name="errorValue"></param>
        /// <returns></returns>
        public static DateTime ObjToDate(this object thisValue, DateTime errorValue)
        {
            DateTime reval = DateTime.MinValue;
            if (thisValue != null && thisValue != DBNull.Value && DateTime.TryParse(thisValue.ToString(), out reval))
            {
                return reval;
            }

            return errorValue;
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="thisValue"></param>
        /// <returns></returns>
        public static bool ObjToBool(this object thisValue)
        {
            bool reval = false;
            if (thisValue != null && thisValue != DBNull.Value && bool.TryParse(thisValue.ToString(), out reval))
            {
                return reval;
            }

            return reval;
        }


        /// <summary>
        /// 获取当前时间的时间戳
        /// </summary>
        /// <param name="thisValue"></param>
        /// <returns></returns>
        public static string DateToTimeStamp(this DateTime thisValue)
        {
            TimeSpan ts = thisValue - new DateTime(1970, 1, 1, 0, 0, 0, 0);
            return Convert.ToInt64(ts.TotalSeconds).ToString();
        }

        public static object ChangeType(this object value, Type type)
        {
            if (value == null && type.IsGenericType) return Activator.CreateInstance(type);
            if (value == null) return null;
            if (type == value.GetType()) return value;
            if (type.IsEnum)
            {
                if (value is string)
                    return Enum.Parse(type, value as string);
                else
                    return Enum.ToObject(type, value);
            }

            if (!type.IsInterface && type.IsGenericType)
            {
                Type innerType = type.GetGenericArguments()[0];
                object innerValue = value.ChangeType(innerType);
                return Activator.CreateInstance(type, new object[] { innerValue });
            }

            if (value is string && type == typeof(Guid)) return new Guid(value as string);
            if (value is string && type == typeof(Version)) return new Version(value as string);
            if (!(value is IConvertible)) return value;
            return Convert.ChangeType(value, type);
        }

        public static object ChangeTypeList(this object value, Type type)
        {
            if (value == null) return default;

            var gt = typeof(List<>).MakeGenericType(type);
            dynamic lis = Activator.CreateInstance(gt);

            var addMethod = gt.GetMethod("Add");
            string values = value.ToString();
            if (values != null && values.StartsWith("(") && values.EndsWith(")"))
            {
                string[] splits;
                if (values.Contains("\",\""))
                {
                    splits = values.Remove(values.Length - 2, 2)
                        .Remove(0, 2)
                        .Split("\",\"");
                }
                else
                {
                    splits = values.Remove(0, 1)
                        .Remove(values.Length - 2, 1)
                        .Split(",");
                }

                foreach (var split in splits)
                {
                    var str = split;
                    if (split.StartsWith("\"") && split.EndsWith("\""))
                    {
                        str = split.Remove(0, 1)
                            .Remove(split.Length - 2, 1);
                    }

                    addMethod.Invoke(lis, new object[] { str.ChangeType(type) });
                }
            }

            return lis;
        }

        public static string ToJson(this object value)
        {
            return JsonConvert.SerializeObject(value);
        }

        public static bool AnyNoException<T>(this ICollection<T> source)
        {
            if (source == null) return false;

            return source.Any() && source.All(s => s != null);
        }
    }
    ```

5. 在 Extensions.ServiceExtensions 中添加类 `SqlSugarSetUp`
    ```cs
    /// <summary>
    /// SqlSugar 启动服务
    /// </summary>
    public static class SqlsugarSetup
    {
        public static void AddSqlsugarSetup(this IServiceCollection services)
        {
            if (services == null) throw new ArgumentNullException(nameof(services));

            // 默认添加主数据库连接
            if (!string.IsNullOrEmpty(AppSettings.app("MainDB")))
            {
                MainDb.CurrentDbConnId = AppSettings.app("MainDB");
            }


            BaseDBConfig.MutiConnectionString.allDbs.ForEach(m =>
            {
                var config = new ConnectionConfig()
                {
                    ConfigId = m.ConnId.ObjToString().ToLower(),
                    ConnectionString = m.Connection,
                    DbType = (DbType)m.DbType,
                    IsAutoCloseConnection = true,
                    MoreSettings = new ConnMoreSettings()
                    {
                        IsAutoRemoveDataCache = true,
                        SqlServerCodeFirstNvarchar = true,
                    },
                    InitKeyType = InitKeyType.Attribute
                };
                if (SqlSugarConst.LogConfigId.ToLower().Equals(m.ConnId.ToLower()))
                {
                    BaseDBConfig.LogConfig = config;
                }
                else
                {
                    BaseDBConfig.ValidConfig.Add(config);
                }

                BaseDBConfig.AllConfigs.Add(config);
            });

            if (BaseDBConfig.LogConfig is null)
            {
                throw new ApplicationException("未配置Log库连接");
            }

            // SqlSugarScope是线程安全，可使用单例注入
            // 参考：https://www.donet5.com/Home/Doc?typeId=1181
            services.AddSingleton<ISqlSugarClient>(o =>
            {
                return new SqlSugarScope(BaseDBConfig.AllConfigs);
            });
        }
    }
    ```

6. 修改接口层中的 `appsettings.json`

    ```json
    
    ```

### 3 服务注册
### 4 引用服务
