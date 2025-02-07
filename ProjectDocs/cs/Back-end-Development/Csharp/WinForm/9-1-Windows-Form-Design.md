
 ## 9.1 窗体设计
- 窗体（Form）是一个窗口或对话框，是存放各种控件（标签、文本框。按钮）的容器，可以用于显示信息。
    - 窗体可以改变或者隐藏
    - 是最小单元




---



### 9.1.1 创建窗体应用程序
- 创建步骤类似于创建控制台应用程序；
- 常用库已经默认加载，实际开发需要补充所需个别库。



---



### 9.1.2 窗体类型
- C# 中，窗体分为以下两种类型
    - 普通窗体：单文档窗体（SDI 窗体），分为下列两种类型：
        - 模式窗体：此类窗体显示后用户必须响应，只有其关闭后才能操作其他窗体或程序；
        - 无模式窗体：建立后可以不响应，然后随意切换到其他窗体进行操作。
            - 一般建立窗体时默认无模式窗体。
    - MDI窗体：多文档窗体，其中可以放置普通子窗体。



---



### 9.1.3 常用属性
#### 1. 布局属性

|布局属性|说明|
|-|-|
|Location|用于获取或设置窗体左上角在桌面上的坐标。它有X和Y两个值,表示窗体左上角的坐标,默认值为坐标原点(0,0)|
|Size|获取或设置窗体的大小。它有Height和Width两个值,表示窗体的高度和宽度|
|StartPosition|获取或设置执行时窗体的起始位置,其值取如下之一。① `Manual` :窗体的位置由 `Location` 属性确定。② `CenterScreen` :窗体在当前显示窗口中居中,其尺寸在窗体大小中指定。③ `WindowsDefaultLocation` :窗体定位在Windows默认位置,其尺寸在窗体大小中指定(默认值)。④  `WindowsDefaultBounds` :窗体定位在Windows默认位置,其边界也由Windows默认决定。⑤ `CenterParent` :窗体在其父窗体中居中|
|WindowState|获取或设置窗体的窗口状态,其值取如下之一。① `Normal` :默认大小的窗口(默认值)。② `Minimized` :最小化的窗口。③ `Maximized` :最大化的窗口|

#### 2. 窗体样式属性

|窗口样式属性|说明|
|-|-|
|ControlBox|获取或设置一个值，该值指示在该窗体的标题栏中是否显示控件框|
|Helpbutton|获取或设置一个值，该值指示是否在窗体的标题栏中显示“帮助”按钮|
|Icon|获取或设置窗体标题栏中的图标|
|MaximizeBox|获取或设置一个值，该值指示是否在窗体的标题栏中显示“最大化”按钮|
|MinimizeBox|获取或设置一个值，该值指示是否在窗体的标题栏中显示“最小化”按钮|
|Showlcon|获取或设置一个值，该值指示是否在窗体的标题栏中显示图标|
|ShowInTaskbar|获取或设置一个值，该值指示是否在Windows任务栏中显示窗体|
|TopMost|获取或设置一个值，该值指示该窗体是否应显示为最顶层窗体|

#### 3. 外观样式属性

|外观样式属性|说明|
|-|-|
|BackColor|获取或设置窗体的背景色|
|BackgroundImage|获取或设置在窗体中显示的背景图像|
|Cursor|获取或设置当鼠标指针位于控件上时显示的光标|
|Font|获取或设置窗体中显示的文字的字体，有关Font的常用属性如表9.4所示|
|ForeColor|获取或设置窗体的前景色|
|FormBorderStyle|获取或设置窗体的边框样式，其值取如下之一。① `None` :无边框。② `FixedSingle` :固定的单行边框。③ `Fixed3D` :固定的三维边框。④ `FixedDialog` :固定的对话框样式的粗边框。⑤ `Sizeable` :可调整大小的边框（默认值）。⑥ `FixedToolWindow` :不可调整大小的工具窗口边框。⑦ `SizeableToolWindow` :可调整大小的工具窗口边框|
|Text|在窗体顶部的标题栏中显示标题|

其中 `Font` 具体属性如下表：

|Font的属性|说明|
|-|-|
|Name|获取此Font的字体名称|
|Size|获取此Font的全身大小，单位采用Unit属性指定的单位|
|Unit|获取此Font的度量单位|
|Bold|获取一个值，该值指示此Font是否为粗体|
|Italic|获取一个值，该值指示此Font是否为斜体|
|Strikeout|获取一个值，该值指示此Font是否有贯穿字体的横线|
|Underline|获取一个值，该值指示此Font是否有下划线|

#### 4. 行为属性

|行为属性|说明|
|-|-|
|AllowDrop|获取或设置一个值，该值指示控件是否可以接受用户拖放到它上面的数据|
|Enabled|指示是否启用该控件，获取或设置一个值，该值指示控件是否可以对用户交互做出响应|
|ImeMode|获取或设置控件的输入法编辑器(IME)模式|



---



### 9.1.4 窗体的常用事件

|事 件|说 明|
|-|-|
|Activated|在使用代码激活或用户激活窗体时发生|
|Click|在单击控件时发生|
|Closed|在关闭窗体后发生|
|Closing|在关闭窗体时发生|
|DoubleClick|在双击控件时发生|
|Enter|在进入控件时发生|
|FormClosed|在关闭窗体后发生|
|FormClosing|在关闭窗体前发生|
|GotFocus|在控件接收焦点时发生|
|Load|在第一次显示窗体前发生|
|MouseClick|在鼠标单击该控件时发生|
|MouseDoubleClick|在用鼠标双击控件时发生|
|MouseDown|在鼠标指针位于控件上并按下鼠标左键时发生|
|MouseEnter|在鼠标指针进入控件时发生|
|MouseMove|在鼠标指针移到控件上时发生|
|MouseUp|在鼠标指针在控件上并释放鼠标左键时发生|



---



### 9.1.5 窗体的常用方法

|方法|说明|
|-|-|
|Activate|激活窗体并给予焦点|
|Close|关闭窗体|
|Focus|为控件设置输入焦点|
|Hide|对用户隐藏控件|
|OnClick|引发 `Click` 事件|
|OnClosed|引发 `Closed` 事件|
|OnClosing|引发 `Closing` 事件|
|OnDoubleClick|引发 `DoubleClick` 事件|
|OnFormClosed|引发 `FormClosed` 事件|
|OnFormClosing|引发 `FormClosing` 事件|
|OnGotFocus|引发 `GotFocu`s 事件|
|OnLoad|引发 `Load` 事件|
|OnMouseClick|引发 `MouseClick` 事件|
|OnMouseDoubleClick|引发 `MouseDoubleClick` 事件|
|OnMouseDown|引发 `MouseDown` 事件|
|OnMouseEnter|引发 `MouseEnter` 事件|
|OnMouseLeave|引发 `MouseLeave` 事件|
|OnMouseMove|引发 `MouseMove` 事件|
|Refresh|强制控件使其工作区无效，并立即重绘自己和任何子控件|
|Show|将窗体显示为无模式对话框|
|ShowDialog|将窗体显示为模式对话框|




---



### 9.1.6 多个窗体之间的调用



---



### 9.1.7 窗体上各事件的引发顺序



---



### 9.1.8 焦点与 Tab 键次序

---



### 课上实操1: 建立登录窗口

#### 1. 窗体架构设计
- 头部：Logo图片
- 中部：登录信息
- 底部：确定登录、增强选项
#### 2. 选用控件、确定资源
- 头部
    - Logo图片
- 中部
    - 账号栏：
        - 用户名输入提示 `Text` 控件
        - 输入框 `TextBox` 控件
        - 提示栏
    - 密码栏：
        - 密码输入提示 `Text` 控件
        - 输入框 `TextBox` 控件
        - 提示栏
- 底部
    - 确认：
        - 按钮 `Button` 控件
    - 取消：
        - 按钮 `Button` 控件

#### 3. 建立窗口
- 头部
    - Logo图片
- 中部
    - 账号栏：
        - `Text` 控件：“用户名”
            - 将属性 `Name` 修改为 `lblUserName` 作为标识
        - 输入框 `TextBox` 控件
            - 将属性 `Name` 修改为 `TB1` 作为标识
            - 将属性 `text` 修改为 "请输入账户名" 作为提示
            - 修改事件 `Enter` 
                - 一个窗口中只能有一个控件触发 `Enter` 事件
                - 在设置事件处理方法窗口中设置
                    ```cs
                    if (tBUserName.Text == "请输入账户名")
                    tBUserName.Text = string.Empty;
                    ```
        - 提示栏
    - 密码栏：同上
- 底部
    - 确认：
        - `Button` 控件
            - 属性 `Name` 修改为 `BTNOk` 作为标识
    - 取消：
        - `Button` 控件
        - 设置 `TableIndex` 为 `0`
            - 即默认获得焦点（被高亮）


