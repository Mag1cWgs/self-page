
## 单窗体功能设计

### 窗体加载事件处理
- 项目背景：
    - 涉及窗口
        - 主页窗口 `FrmMain`
        - 菜单栏窗口 `FrmMenu`
        - 若干均继承自同一父类 `DockContent` 的子窗体
    - 主页窗口唯一，子窗体需要在该主页窗体下实例化
        - 子窗体使用 `Show` 函数，在主页窗口中展示
        - 实际是跨线程操作
- 问题需求：
    - 在菜单栏窗口中设置一个 `Label` 作为触发按钮
        - 点击这个 `Label` 时，触发 `lbl{Name}——Click` 事件
    - 保证子窗体单例化
        - 如果不存在子窗体实例，实例化一个新子窗体，在主页窗口中显示
        - 如果出现已存在子窗体实例，应当激活显示子窗体
- 问题分析：
    - 菜单栏触发事件，但是要在主窗体内渲染显示
    - 如何保证单例化
- 解决方案分析：有两种方案
    - 使用委托（`.Invoke`方法）进行跨线程操作，较为麻烦
    - 调整主窗体类，添加辅助字段来方便其他窗体操作本窗口的实例

- 最后选用了第二种方案
    - 调整主窗体类使之可外部调用
        ```cs
        public partial class FrmMain : Form
        {
            // 用于在其他窗体中调用主窗体
            public static FrmMain frmMain;

            public FrmMain()
            {
                /* 其它代码 */
                frmMain = this; // 将当前窗体赋值给frmMain
            }
        }
        ```
    - 设置窗体加载事件
        - 设计一个加载函数
            - 传入参数为 `DockContent dockContent` 和 ` KryptonLabel label`
                - `DockContent` 是子窗体的父类，类似泛型，实际传入具体窗体子类
                - `KryptonLabel` 是触发事件绑定的控件，传入用于同步子窗体实例化时标题
            - 利用主窗体显示项是集合，使用 `foreach` 进行遍历
                - 查询是否存在与子窗体同名项，存在则激活并退出函数
                > [!attention]
                > 由于使用 WeifenLuo.WinFormsUI.Docking 这一控件中存在 BUG，
                > 子窗体项必须预先修改至少一处属性 / 字段，
                > 否则无法访问到子窗体的属性。
                > 也就是无法使用 `item.Name.Equals(dockContent.Name)` 来进行判断。

                - 不存在则设置子窗体标题与传入 `Label` 一致，并使用 `Show()` 加载到主窗体
        - 设置触发事件
            - 将 `sender` 使用 `as` 运算符取出并传入加载函数
        ```cs
        /// <summary>
        /// 窗体加载事件的辅助函数
        /// </summary>
        /// <param name="dockContent">使用父类传入，实现泛型化</param>
        private void OpenSubForm(DockContent dockContent, KryptonLabel label)
        {
            // 遍历所有窗体，如果已经打开则激活，保证单例
            // 不应在此处设置窗体标题，应在外部直接对目标窗体设置
            foreach (DockContent item in FrmMain.frmMain.dockPanelMain.Contents)
            {
                if (item.Name.Equals(dockContent.Name))
                {
                    item.Activate();
                    return;
                }
            }
            // 设置窗体标题同步，保证在不触发单例判断的情况下也能设置标题
            dockContent.Text = label.Text;
            // 显示窗体，使用静态类FrmMain中的frmMain对象取巧
            dockContent.Show(FrmMain.frmMain.dockPanelMain);
        }
        private void lblMajor_Click(object sender, EventArgs e)
        {
            var lbl = sender as KryptonLabel;
            OpenSubForm(new FrmMajor(),lbl);
        }
        /* 其他 KryptonLabel 对应的 lbl{Name}_Click 事件略 */
        ```

### 保存操作处理
#### 流程设计思路与测试暴露问题
- 原保存按钮的流程设计如下
    1. 使用 `foreach` 语句遍历所有 `DataGridViewRow` 类型的显示表格，并尝试赋值到实例
    2. 根据当前行的标记情况进行数据库的增删改操作
        - 新增标记：尝试执行数据库插入，失败则弹出 1003 错误代码；若成功则更新当前行标记为空。
        - 改动操作：尝试执行数据库更新，失败则弹出 1005 错误代码；若成功则更新当前行标记为空。
        - 删除操作：尝试执行数据库删除，失败则弹出 1004 错误代码，而后直接在 `DataGridView` 中删除当前 `DataGridViewRow`；行标记依据于当前行一起删除。
    3. 弹出 0001 提示信息，提示保存完成
    4. 重新查询表格并显示

- 测试中出现问题：
    - 对第 `i` 行数据执行删除时，会忽略对第 `i+1` 行的处理。
- 分析问题：
    - `foreach` 语句是基于 `MoveNext` 等函数顺序执行，删除正在遍历元素会导致索引的异常。
    - 比如：
        - 第六行标记为删除，删除后，第七行变为第六行，
        - 但是 `foreach` 会认为新的第六行已经被遍历过了，
        - 会导致原本的第七行被跳过，无法进行任何处理。
    > [!tip]
    > 参考
    > - [MSDN: 迭代语句 - for、foreach、do 和 while](https://learn.microsoft.com/zh-cn/dotnet/csharp/language-reference/statements/iteration-statements#the-foreach-statement)
    > - [MSDN: 13.9.5 foreach 语句](https://learn.microsoft.com/zh-cn/dotnet/csharp/language-reference/language-specification/statements#1395-the-foreach-statement)

    > [!note]
    > 对于原类型 `V`，在集合 `x` 中的 `foreach` 遍历
    > ```cs
    > foreach (V v in x) «嵌入语句块»
    > ```
    > 会利用 `x` 对应的集合类型 `C`，枚举器类型 `E`，迭代类型 `T`/`ref T`/`ref readonly T` 进行操作。
    > 实际等价于：
    > ```cs
    > {
    >   E e = ((C)(x)).GetEnumerator();
    >   try
    >   {
    >       while (e.MoveNext())
    >       {
    >           V v = (V)(T)e.Current;
    >           «嵌入语句块»
    >       }
    >   }
    >   finally
    >   {
    >       ... // Dispose e
    >   }
    > }

#### 解决方案的选用
- 有两种方案：
    1. 方案一：
        - 既然 `foreach` 是自 `i` 到 `i+1` 的不断使用 `MoveNext` 往下过程；
        - 那就使用 `for` 语句来从下往上操作，这样对 `i+1` 的删除操作不会影响 `i` 的正常检查与操作。
            - 也就是说对第 `i+1` 行执行删除操作后，索引指向的新的第 `i+1` 行是已经处理过的行；
            - 对于 `for` 语句，索引会继续正常地向上移动到第 `i` 行，而该行并未被处理。
            - 保证了各行之间处理不会冲突
        - 但是如果是逆向遍历，会优先处理最后的删除行，与正常的自上而下检查顺序相反。
            - 因而寻找更好的方法，仅作为备选
    2. 方案二：
        - 问题来自于步骤二的删除标记处理，其在处理标记后直接删除了所在行实体；
        - 那么可以将删除实体这一步去除，因为实际在数据库已经成功删除对应键值；
        - 只需要重新查询就可以在显示层面显示删除后的结果。
            - 而且要调整查询完成的显示位置

- 最终选用**方案二**，新流程如下：
    1. 使用 `foreach` 语句遍历所有 `DataGridViewRow` 类型的显示表格，并尝试赋值到实例
    2. 根据当前行的标记情况进行数据库的增删改操作
        - 新增标记：尝试执行数据库插入，失败则弹出 1003 错误代码。（不对标记处理）
        - 改动操作：尝试执行数据库更新，失败则弹出 1005 错误代码。（不对标记处理）
        - 删除操作：尝试执行数据库删除，失败则弹出 1004 错误代码。（不在此处删除表格中的行）（仍不对标记处理）
    3. 统一更新标记为空标记。
    4. 重新查询表格并显示
    5. 弹出 0001 提示信息，提示保存完成并重新查询完成。

#### 改正前后的源码
- 原方案代码:
    ```cs
    /// <summary>
    ///    保存按钮，保存表格内容
    /// </summary>
    /// <param name="sender"></param>
    /// <param name="e"></param>
    private void btnSave_Click(object sender, EventArgs e)
    {
        // 数据封装
        B_major model = new B_major();
        foreach (DataGridViewRow row in dgView.Rows)
        {   // 数据保存
            model.major_cd = (row.Cells[major_cd.Name].Value == null)
                            ? "" : row.Cells[major_cd.Name].Value.ToString();
            model.major_nm = (row.Cells[major_nm.Name].Value == null)
                            ? "" : row.Cells[major_nm.Name].Value.ToString();
            model.remark = (row.Cells[remark.Name].Value == null)
                            ? "" : row.Cells[remark.Name].Value.ToString();
            model.user_cd = FrmMain.user_id;

            // 根据标记进行增删改操作
            switch (row.Cells["idu"].ToolTipText)
            {
                case "":    // 无标记
                    break;
                case "Insert":  // 新增操作，返回值为 false 时，提示错误信息并返回
                    if (!new B_major_BLL().Insert_B_Major(model))
                    {
                        B_Message_BLL.ShowConfirm("1003");
                        return;
                    }
                    // 保存成功后，将标记改为无标记
                    row.Cells["idu"].Value = Properties.Resources.table;
                    row.Cells["idu"].ToolTipText = "";
                    break;
                case "Update":  // 修改操作，返回值为 false 时，提示错误信息并返回
                    if (!new B_major_BLL().Update_B_Major(model))
                    {
                        B_Message_BLL.ShowConfirm("1005");
                        return;
                    }
                    // 保存成功后，将标记改为无标记
                    row.Cells["idu"].Value = Properties.Resources.table;
                    row.Cells["idu"].ToolTipText = "";
                    break;
                case "Delete":  // 删除操作，返回值为 false 时，提示错误信息并返回
                    if (!new B_major_BLL().Delete_B_Major(model))
                    {
                        B_Message_BLL.ShowConfirm("1004");
                        return;
                    }

                    // 保存成功后，删除该行
                    dgView.Rows.Remove(row); // <- 此处删除后会影响下一行索引
                    break;
            }
        }
        // 显示查询提示，确认后查询并更新数据表
        B_Message_BLL.ShowConfirm("0001");
        Query();
    }
    ```

- 修正后的源码:
    ```cs
        /// <summary>
        ///    保存按钮，保存表格内容。
        ///    若操作成功会触发保存成功提示框 (<c>0001</c>)。
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        /// <remarks>
        ///     若保存失败会触发两次提示框：一是失败原因，二是具体失败的操作(插入/删除/更新)。
        /// </remarks>
        /// <exception cref="1003: 未找到要插入的数据"/>
        /// <exception cref="1004: 未找到要删除的数据"/>
        /// <exception cref="1005: 未找到要更新的数据"/>
        private void btnSave_Click(object sender, EventArgs e)
        {
            // 数据封装
            B_major model = new B_major();
            // 数据保存
            foreach (DataGridViewRow row in dgView.Rows)
            {
                model.major_cd = (row.Cells[major_cd.Name].Value == null)
                                ? "" : row.Cells[major_cd.Name].Value.ToString();
                model.major_nm = (row.Cells[major_nm.Name].Value == null)
                                ? "" : row.Cells[major_nm.Name].Value.ToString();
                model.remark = (row.Cells[remark.Name].Value == null)
                                ? "" : row.Cells[remark.Name].Value.ToString();
                model.user_cd = FrmMain.user_id;

                // 根据标记进行增删改操作
                switch (row.Cells["idu"].ToolTipText)
                {
                    case "":    // 无标记
                        break;
                    case "Insert":  // 新增操作，返回值为 false 时，提示错误信息并返回
                        if (!new B_major_BLL().Insert_B_Major(model))
                        {
                            /// <remarks>
                            /// 在插入失败时会弹出两次提示框，
                            /// 一次是插入自身的不合法提示(<c>1001/2001/2002</c>)
                            /// 一次是插入失败(<c>1003</c>)
                            /// </remarks>
                            B_Message_BLL.ShowConfirm("1003");
                            return;
                        }
                        break;
                    case "Update":  // 修改操作，返回值为 false 时，提示错误信息并返回
                        if (!new B_major_BLL().Update_B_Major(model))
                        {
                            /// <remarks>
                            /// 在更新失败时会弹出两次提示框，
                            /// 一次是插入自身的不合法提示(<c>1005/2002</c>)
                            /// 一次是插入失败(<c>1005</c>)
                            /// </remarks>
                            B_Message_BLL.ShowConfirm("1005");
                            return;
                        }
                        break;
                    case "Delete":  // 删除操作，返回值为 false 时，提示错误信息并返回
                        if (!new B_major_BLL().Delete_B_Major(model))
                        {
                            /// <remarks>
                            /// 在插入失败时会弹出两次提示框，
                            /// 一次是插入自身的不合法提示(<c>1004</c>)
                            /// 一次是插入失败(<c>1004</c>)
                            /// </remarks>
                            B_Message_BLL.ShowConfirm("1004");
                            return;
                        }

                        ///<remarks>
                        /// <c>foreach</c> 语句是基于 <c>MoveNext</c> 等函数顺序执行，
                        /// 删除正在遍历元素会导致索引的异常。比如：
                        ///     第六行标记为删除，删除后，第七行变为第六行，
                        ///     但是 foreach 会认为新的第六行已经被遍历过了,
                        ///     会导致原本的第七行被跳过，无法进行 switch 判断
                        /// </remarks>
                        // 无需直接删除，只需修正标记即可，后续查询时会自动过滤
                        // dgView.Rows.Remove(row);  // 保存成功后，删除表中该行
                        break;
                }
                // 数据库操作成功后，将需操作标记改为无标记
                row.Cells["idu"].Value = Properties.Resources.table;
                row.Cells["idu"].ToolTipText = "";
            }
            // 使用查询函数刷新数据，避免因为原 Delete 操作中对行直接删除导致的索引错误
            Query();
            B_Message_BLL.ShowConfirm("0001");  // 查询后提示保存成功
        }
    ```



---



## 多窗体间交互设计

### 子代码窗体中主代码查询与选取

#### 方案设计与选择
- 当前子代码窗体样式
    <div align="center">
    <img src='/ProjectDocs/cs/Actual-Project-Document/ERP-Simple-Invoicing-System-Winform/image/BaseInformationManageForm/Base.FrmMinor_窗体样式.png' width=60%>
    </div>
    - 其中主代码编号是对子表查询的必须项
    - 查询前获取主代码编号有几种方案:
        1. 用户自己输入完整主代码
            - 会有人工失误
        2. 使用下拉菜单辅助用户查询
            - 数据过多时人工查找困难
        3. 使用参照窗体，单独设置搜索并跨窗体传参
            - 可以用户输入
            - 也可以点击查询按钮弹出搜索主代码窗体
                - 但是一旦查询就设置为只读，只能重新查询并自动填充
        4. 使用参照窗体，单独设置搜索并跨窗体传参
            - 不允许用户手动输入
            - 设置为只能点击查询按钮弹出搜索主代码窗体

- 最终选择第四方案：
    1. 参照主代码窗体进行查找主代码参照窗体布局设计
        - 仅设置查询按钮
        - 查询结果只读，只允许单行选择
        <div align="center">
        <img src='/ProjectDocs/cs/Actual-Project-Document/ERP-Simple-Invoicing-System-Winform/image/BaseInformationManageForm/Base.POP.FrmPopMajor_窗体样式.png' width=60%>
        </div>
    2. 在子代码窗体中点击查找主代码参照窗体时弹出该窗体
        - 弹出时默认查询所有主代码
        - 在其中输入查询按钮进行查询
        - 并选择一行作为查询结果
        <div align="center">
        <img src='/ProjectDocs/cs/Actual-Project-Document/ERP-Simple-Invoicing-System-Winform/image/BaseInformationManageForm/Base.FrmMinor.btnSearchMajor_cd_Click事件_现方案.png' width=60%>
        </div>
    3. 选择完成后将选择结果返回到子代码窗体
        - 自动填充
    
    > [!tip|label:textMajor_cd设为只读的原因]
    > - 子代码数据在数据库中是综合主键：主代码编号、子代码编号。
    > - 在对子代码数据修改后进行保存时候，需要读取当前数据的主代码编号，读取值来自查询时输入值
    >   - 当前在按钮点击事件中会修改 `textMajor_cd.Text` 并将 `FrmMinor.selectedMajor_cd` 先赋值后重置
    >   - 读取的是主窗体中控件 `string major_cdForQuery` 的 `Text` 属性作为查询条件中主代码编号
    > - 优化: 
    >   - 可以直接在子代码窗体文件中设置一个专门存储和查询的字段
    >   - 也就是建立一个 `string major_cdForQuery` 字段来存储查询所用字段
    >   - 只需在按钮点击事件中，修改 `textMajor_cd.Text` 的同时也赋值给 `major_cdForQuery`
    >   - 无需在另外设置  `string major_cdForQuery` 为只读
    >   - 在查询前比较按钮点击时设置的 `major_cdForQuery` 是否与 `textMajor_cd.Text` 一致
    >       - 如果一致则正常查询，不一致则弹窗提示用户再次选择取用查询结果还是后来修正的结果。
    > - 如果用第四方案，可以直接在查询过程中判断是否要更改 `textMajor_cd.Text`，
    >   - 无需设置 `FrmMinor.selectedMajor_cd` 字段来存储

> [!note]
> 窗体之间传参的几种常用方案：
> - 使用静态变量，被调用窗体中有方法可以改变该变量，外部只需调用这个静态变量
>   - 实际应当减少静态字段使用，因为会持续占用内存空间，不会随着实例回收。
> - 使用委托进行跨线程操作
