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
    - MODEL 层: 提供 `b_major` 对应的实体类
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
    - DAL 层: 返回对数据库查询所得到的 `DataTable`
        ```cs
        /* B_major_DAL.cs */
        using ERP_MODEL;
        namespace ERP_DAL
        {
            public class B_major_DAL
            {
                /// <summary>
                /// 查询主代码表
                /// </summary>
                /// <param name="model">主代码实体类</param>
                /// <returns>匹配 major_cd 或 major_nm 的结果</returns>
                public DataTable Get_B_Major(B_major model)
                {
                    StringBuilder strSql = new StringBuilder();
                    strSql.AppendFormat(@"
                            SELECT major_cd,major_nm,remark FROM dbo.b_major
                            WHERE major_cd LIKE N'%{0}%'
                            AND major_nm LIKE N'%{1}%'",
                            model.major_cd,
                            model.major_nm);
                    return DbHelperSQL.Query(strSql.ToString()).Tables[0];
                }
            }
        }
        ```
    - BLL 层: 正常返回查询结果，不处理空返回
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
                ///     <para>
                ///     如果查询为空，则返回<c>null</c>，由UI层进行处理。
                ///     </para>
                /// </summary>
                /// <param name="model">主代码实体类</param>
                /// <returns>
                ///     匹配 <c>major_cd</c> 或 <c>major_nm</c> 的结果，
                ///     如果查询为空，则返回<c>null</c>。
                /// </returns>
                /// <exception cref="9999: 未知异常"/>
                public DataTable Get_B_Major(B_major model)
                {   
                    try  // 异常处理
                    {
                    // 正常返回查询结果，在UI层进行处理
                    //DataTable dt = new B_major_DAL().Get_B_Major(model);
                    //if(dt.Rows.Count == 0)
                    //    B_Message_BLL.ShowConfirm(1002);
                    //KryptonMessageBox.Show("查询成功！共有" + dt.Rows.Count + "条数据。");
                        return new B_major_DAL().Get_B_Major(model);
                    }
                    catch (Exception ex)
                    {
                        B_Message_BLL.ShowUnkownError(ex);
                        return null;
                    }
                }
            }
        }
        ```
    - UI 层: 
        - 建立查询函数 `Query()` 对 BLL 返回数据进行实体封装，并尝试绑定数据源
            - 绑定失败报 1002 异常代码
        - 搜索按钮使用建立的查询函数
        ```cs
        /// <summary>
        ///     查询函数，为方便调用而设置
        /// </summary>
        private void Query()
        {
            // 数据封装
            B_major model = new B_major()
            {
                major_cd = txtMajor_cd.Text.Trim(),
                major_nm = txtMajor_nm.Text.Trim()
            };

            B_major_BLL bll = new B_major_BLL();
            DataTable dt = bll.Get_B_Major(model);
            /* 不能用 dt.DefaultView 作为 DataSource，会与添加行功能冲突:
            * “无法将类型为“System.Data.DataView”的对象强制转换为类型“System.Data.DataTable” */
            dgView.DataSource = dt;
            // 先绑定数据源，再判断是否有数据
            if (dt.Rows.Count == 0)
            {
                B_Message_BLL.ShowConfirm("1002");
            }
        }

        /// <summary>
        ///     搜索按钮，根据输入条件查询主代码表
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void btnSearch_Click(object sender, EventArgs e)
        {
            Query();
        }

        ```
    - 实际流程
        - UI 层: 搜索按钮调用 `Query()` 方法:
            - 建立查询条件对应 MODEL 层实体 `model`，并将其作为参数输入 BLL 层
            - 将 BLL 层返回 DataTable 类对象尝试绑定为数据源
                - 绑定失败则报 1002 异常代码
        - BLL 层: 
            - 输入 `model`，使用对应 DAL 层的数据库查询函数
            - 返回查询所得的 `DataTable` 类结果对象
        - DAL 层: 
            - 输入 `model`，提取其中字段并构造 SQL 语句，使用 `DBHelper` 访问数据库并查询
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

### 查询异常编号
#### 方案分析与选择
- 对于异常编号的存储，通常有两种：
    - 本地存储（使用 xml/json 等）（单机查找）
    - 数据库存储（云端查找）
- 其中本地存储与修改不能同步更改，只适合单机运行的程序；
- 而数据库存储可以通过与数据库服务器链接查询来实现并发时同步。
    - 因而此处选择使用数据库存储。

- 对于数据库上表格设计，也有两种建表方式：
    - 标量值函数
    - 正常建表查表
- 其中:
    - 标量值函数：通过访问时输入键，调用数据库函数获取信息字符串。
    - 正常建表查表：需要在项目中建立完整的 MODEL-DAL-BLL-UI，以实现对异常信息的增删改查。
- 处于项目体量考虑，最后选用标量值函数

- 具体实现
    - 可以建立枚举类，然后在 DAL 层将枚举类转换为键值再查询
        - 有助于语义化函数，但会形成的超长行
        - 比如 `KryptonMessageBox.Show(B_Message_DAL.Get_Exception_Message(MessageCode.DeleteFailedNoFound));`
        - 也会带来额外的性能开销：
            - 需要建立一个枚举类
            - 处理函数需要接受枚举类变量，转换为其索引对应的错误代码，然后再拼接字符串
                - 也就是 `((int)messageCode).ToString()`
    - 直接在 DAL 层函数中处理接受的键值并查询
        - 处理函数直接接收错误代码，然后 `.ToString`，再拼接字符串

#### 具体实现
- 数据库: 使用标量函数
    ```sql
    USE [erpWinform]
    GO
    /****** Object:  UserDefinedFunction [dbo].[Get_Message]    Script Date: 2025/2/25 11:37:52 ******/
    SET ANSI_NULLS ON
    GO
    SET QUOTED_IDENTIFIER ON
    GO
    -- =============================================
    -- Author:		<Author,,Name>
    -- Create date: <Create Date, ,>
    -- Description:	<异常信息管理，1000-1999为SQL中异常，2000-2999为窗体中异常>
    -- =============================================
    CREATE FUNCTION [dbo].[Get_Message] -- 修改时更改CREATE 为 ALTER
    (
        @msg_cd NVARCHAR(10)
    )
    RETURNS NVARCHAR(500)
    AS
    BEGIN
        -- 声明返回变量
        DECLARE @msg_text NVARCHAR(500)
        -- 函数处理主体
        SELECT @msg_text = 
        CASE WHEN @msg_cd = '0000' THEN N'操作成功！'
            WHEN @msg_cd = '0001' THEN N'保存成功，请确认！已自动查询保存后数据！'

            WHEN @msg_cd = '1001' THEN	N'已经存在相同的主代码，无法添加！'
            WHEN @msg_cd = '1002' THEN N'查找失败！未找到所要操作数据，请确认查找条件是否正确！'
            WHEN @msg_cd = '1003' THEN N'插入失败！未找到待插入数据！'
            WHEN @msg_cd = '1004' THEN N'删除失败！未找到待删除数据！'
            WHEN @msg_cd = '1005' THEN N'更新失败！未找到待更新数据！'

            WHEN @msg_cd = '2001' THEN N'主代码编号不能为空！'
            WHEN @msg_cd = '2002' THEN N'主代码名称不能为空！'

            WHEN @msg_cd = '9999' THEN N'未知错误！'
            ELSE NULL END ;

        -- 返回函数结果
        RETURN @msg_text
    END
    ```

- DAL 层: 使用数据库中的标量值函数来查询异常代码对应的异常信息字符串
    ```cs
    /* B_Message_DAL.cs */
    namespace ERP_DAL
    {
        /// <summary>
        /// 消息提示类数据访问层
        /// </summary>
        public abstract class B_Message_DAL
        {
            /// <summary>
            ///     获取异常信息，通过输入的消息代码获取对应的消息文本：
            ///     接受 <c>string</c> 类型的 <paramref name="code"/>，拼接后作为 <c>msg_cd</c> 字段进行查询。
            /// </summary>
            /// <remarks>
            /// <para>
            ///     <c>string</c> 类变量 <paramref name="code"/> 
            ///     保证了 <c>0000 ~ 0999</c> 之间值可以正常的拼接在数据库查询语句中。
            /// </para>
            /// <para>
            ///     因为数据库中的标量值函数中 <c>@msg_cd</c> 是以 <c>'XXXX'</c> 格式判断，
            ///     使用 <c>int</c> 类型的参数会丢失全 <c>0</c> 前缀。
            /// </para>
            /// </remarks>
            /// <param name="msg_cd">消息代码</param>
            /// <returns>
            ///     异常信息字符串 <c>msg_text</c>
            /// </returns>
            public static string Get_Exception_Message(string code)
            {
                StringBuilder strSql = new StringBuilder();
                strSql.AppendFormat(@"
                        SELECT dbo.Get_Message('{0}') AS msg_text",
                        code);
                SqlDataReader reader = DbHelperSQL.ExecuteReader(strSql.ToString());
                if ( reader.Read())
                {
                    return reader["msg_text"].ToString();
                }
                return null;
            }
        }
    }
    ```

- BLL 层: 建立信息提示类 `B_Message_BLL` 用于弹出响应信息提示。
    - 建立信息提示函数 `ShowConfirm`，弹出响应信息窗口。
    - 建立异常提示函数 `ShowUnknownError`，弹出位置的异常信息。
    ```cs
    /* B_Message_BLL.cs */
    namespace ERP_BLL
    {
        /// <summary>
        /// 消息提示类的业务逻辑层，用于弹出响应信息的提示窗口。
        /// </summary>
        public abstract class B_Message_BLL
        {
            /// <summary>
            ///     信息提示窗，显示向数据库查询所得到的异常信息。
            /// <para>
            ///     使用<c> B_Message_DAL</c>中的
            ///     <c>Get_Exception_Message(string <paramref name="msg_cd"/>)</c>
            ///     函数获取异常信息。
            /// </para>
            /// </summary>
            /// <param name="msg_cd">信息编号，有效范围在'0000'~'9999'</param>
            public static void ShowConfirm(string msg_cd)
            {
                string str = B_Message_DAL.Get_Exception_Message(msg_cd);
                KryptonMessageBox.Show(str,msg_cd.ToString(),
                                        MessageBoxButtons.OK, MessageBoxIcon.Warning);
            }

            /// <summary>
            ///     信息提示窗，显示系统 Try Catch 捕获的异常错误<paramref name="ex"/>。
            ///     <para>
            ///     仍然会对数据库进行查询，获取异常信息。对应的异常信息编号为 <c>9999</c>。
            ///     </para>
            /// </summary>
            /// <param name="ex">发生的异常错误</param>
            public static void ShowUnkownError(Exception ex)
            {
                StringBuilder str = new StringBuilder();
                str.Append(B_Message_DAL.Get_Exception_Message("9999"))
                    .Append("\r\n")
                    .Append(ex.Message);
                KryptonMessageBox.Show(str.ToString(), "9999",
                                        MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
        }
    }
    ```
