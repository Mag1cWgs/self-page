## 项目架构设计
- 项目设置为四层：
    - 表示层(UI):       表示信息，处理用户的请求，与用户进行交互
    - 逻辑层(BLL):      实际的业务活动
    - 数据层(DAL):      与数据库进行通信
    - 实体对象(Model):   实体对象

- 实际上如下
    ```
    表示层
    |   ↓
    |  逻辑层     (被上层调用)
    |  |  ↓
    |  |  数据层  (被上层调用)
    ↓  ↓  ↓
    实体对象   (被三层共同调用)
    ```

- 相应的建立四个子项目
    - SimpleERPSystem 表示层
        - 子文件里建立 image 文件夹存储所用图片
            - 项目设置中导入，而非 .resx 导入
    - ERP_BLL 逻辑层
    - ERP_DAL 数据层
    - ERP_MODEL 实体层

- 对表示层中各类窗体，使用文件夹管理
    ```
     + SimpleERPSystem
     |
     * - + Base 基础设置类窗体
     |   | 
     |   * FrmMajor.cs 基础设置中的主代码窗体
     |   * FrmMinor.cs 基础设置中的子代码窗体
     |   |
     |   * - 其他基础设置的窗体
     | 
     * - + Item 商品管理类窗体
     |   | 
     |   * FrmMajor.cs 商品管理中的主代码窗体
     |   * FrmMinor.cs 商品管理中的子代码窗体
     |
     * - ··· 其他类窗体分文件夹
     |
     * FrmMain.cs 系统主窗口
     * FrmMenu.cs 系统菜单窗口
     * FrmHomePage.cs 系统主页窗口
     * - ··· 其他系统窗口
    ```
## 项目引用设置
### 设置项目引用
- 虽然逻辑上是 UI-BLL-DAL-MODEL，但是实际上 UI 的项目本地仍需引用所有项目
    - 保证编译时包含所有支持库

- 修改后有开发项目内引用关系如下：
    - UI 层: BLL、DAL、MODEL
    - BLL 层: DAL、MODEL
    - DAL 层: MODEL



---



## 数据库链接

### 修改项目配置文件
- 为了保证数据库库连接层（DAL 层）能正常访问数据库，需要修改项目的配置文件，用于全局存储访问所用数据
- 修改 UI 层中的 `App.config`
    - 在 `<Configuration>` 标签内部添加了 `<connectionStrings>` 标签
    - 在标签内部通过设置属性来存储所用字段内容
    ```xml
    <!-- App.config -->
    <?xml version="1.0" encoding="utf-8" ?>
    <configuration>
        <!-- 其他配置代码 -->
        <connectionStrings>
            <add name ="sqlconnection"
                connectionString="server=服务器地址; database=数据库名; uid=登录账户; pwd=所用密码"/>
        </connectionStrings>
    </configuration>
    ```
    > [!note]
    > - 服务器地址支持多种格式，对于本地服务器，可用以下三种
    >   - `server=.;` 使用本地服务器
    >   - `server=localhost;` 使用本地域名
    >   - `server=127.0.0.1` 使用本地环回地址
    > - 比如: 在 App.config 内的 `<connectionStrings>` 标签里添加这一标签
    >     ```xml
    >     <add name ="sqlconnection" 
    >          connectionString="server=.\SQLSERVER; database=erpWinform; uid=sa; pwd=******"/>
    >     ```
    >     其中 `server` 还可以使用 `localhost\SQLSERVER`，也可以成功连接

### DBHelper 类
- 为了帮助操作数据库，建立 DBHelper 类来存储常用操作
- 所需类库如下：
    - System
    - System.Collections.Generic
    - System.Collections
    - System.Configuration
        - 这个库一般不会默认引用，需要检查是否在 DAL 层的项目中成功引用
    - System.Data.SqlClient
    - System.Data
- 建立 DBHelper 类应在 DAL 层对应的项目内部
    > [!attention]
    > 但是实际会读取 UI 层对应项目的 `App.config`

## 数据库操作

### 流程分析：查表操作
- 流程分析
    - 在 MODEL 层有查询对象的实体类
    - 在 DAL 层中做对数据库查询并转换为查询对象
    - 在 BLL 层中调用查询到的实体对象，做业务处理
    - 在 UI 层中显示业务处理结果

- 实际实现
    - MODEL 层：
        ```cs
        /* B_major.cs */
        namespace ERP_MODEL
        {
            public class B_major
                {
                    public string major_cd { get; set; }

                    public string major_nm { get; set; }

                    public string remark { get; set; }

                    public string user_cd { get; set; }
                }
        }
        ```
    - DAL 层
        ```cs
        /* B_major_DAL.cs */
        using ERP_MODEL;
        namespace ERP_DAL
        {
            public class B_major_DAL
            {
                /// <summary>
                /// 接受主代码实体，查询主代码表
                /// </summary>
                /// <param name="model">主代码实体类</param>
                /// <returns>匹配 major_cd 或 major_nm 的结果</returns>
                public DataTable Get_B_Major(B_major model)
                {
                    StringBuilder strSql = new StringBuilder();
                    strSql.AppendFormat(@"
                    SELECT major_cd,major_nm,remark FROM dbo.b_major
                    WHERE major_cd LIKE N'%{0}%'
                    OR major_nm LIKE N'%{1}%'",
                    model.major_cd,
                    model.major_nm);

                    return DbHelperSQL.Query(strSql.ToString()).Tables[0];
                }
            }
        }
        ```
    - BLL 层
        ```cs
        /* B_major_BLL.cs */
        using ERP_DAL;
        using ERP_MODEL;

        namespace ERP_BLL
        {
            public class B_major_BLL
            {
                /// <summary>
                /// 接受主代码实体，查询主代码表
                /// </summary>
                /// <param name="model">主代码实体类</param>
                /// <returns>匹配 major_cd 或 major_nm 的结果</returns>
                public DataTable Get_B_Major(B_major model)
                {
                    return new B_major_DAL().Get_B_Major(model);
                }
            }
        }
        ```
    - UI 层
        ```cs
        // 查询按钮对应事件
        private void btnSearch_Click(object sender, EventArgs e)
        {
            B_major model = new B_major()
            {
                major_cd = txtMajor_cd.Text.Trim(),
                major_nm = txtMajor_nm.Text.Trim()
            };
            // 绑定数据源为 BLL 中查询函数获得的 DataTable
            dgView.DataSource = new B_major_BLL().Get_B_Major(model);
        }
        ```
    - 实际流程
        - UI 层: 
            - 建立查询对象对应 MODEL 层实体 `model`，作为参数输入 BLL 层
            - 将 BLL 层返回 DataTable 类对象设置为数据源
        - BLL 层: 
            - 输入 `model`，使用对应 DAL 层的数据库查询函数
            - 返回查询所得的 DataTable 类结果对象
        - DAL 层: 
            - 输入 `model`，提取其中字段并构造 SQL 语句，使用 DBHelper 访问数据库并查询
            - 返回查询所得的结果表的首项
        - MODEL 层只提供实体类
        - 数据库只有 DAL 层的辅助类进行操作
        ```
                        [ U I 层 ]
        查询对象对应model ↓      ↑   DataTable 类对象
                       [ B L L 层 ]
                   model ↓      ↑ 取首项的 DataTable 类对象
                       [ D A L 层 ]
                SQL 查询 ↓      ↑ 所得 DataTableCollection 类对象
                       [ 数 据 库 ]
        ```
