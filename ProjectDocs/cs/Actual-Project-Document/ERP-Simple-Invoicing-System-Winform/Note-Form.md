
## 编程处理

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
