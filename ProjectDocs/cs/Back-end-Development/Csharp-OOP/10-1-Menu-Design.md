## 10.1 菜单设计

1. MenuStrip
2. ContextStrip


## 10.1.1 菜单栏结构
- 菜单栏 MenuStrip
- 菜单项 
    - ToopStripMenuItem
    - ToolStripButton
    - ToolStripTextBox
    - ToolStripComboBox
    - TooolStripLabel
- 子菜单
    - ToolStrip
- 分隔条
    - ToolStripSeparator
- 快捷键
- 热键

## 10.1.2 创建上下文菜单(下拉式菜单) `MenuStrip`
- 拖动到窗口中使用
    - 控件 `MenuStrip` 是**非显示控件**
    - 不直接显示在设计窗口中，而是在底端单独显示
        - 作为组合形式控件不直接显示
- 文件名后端加 `(&[HOTKEY])` 可以指定 `[HOTKEY]` 作为热键
- 输入设定文件名后组件名默认为 `[设定名字][HOTKEY]ToolStripMenuItem`
    - 一般重命名为 `tsmi设定名字`
- 创建 `文件(&F)` 的实例
    - 添加 `打开(&O)`
        - 修改属性 `ShortKey` 为 `Ctrl + O` 作为快捷键
        - 修改属性 `ShortCutKeyDisplayString` 为 `Ctrl+O` 作为快捷键提示
            - 可略过
    - 添加 `保存`
        - 修改属性 `ShortKey` 为 `Ctrl + S` 作为快捷键
    - 添加分隔号 `ToolStripSeparator`
        - 重命名为 `tssFile1`
    - 添加 `退出`

## 10.1.3 设计弹出式菜单 `ContextMenuStrip`


## 10.2 通用对话框
1. 打开文件对话框 `OpenFileDialog`
    - 属性
        - `FileName` 或者 `FileNames`
        - `Filter`
    - 方法
        - `Dispose`
        - `OpenFile`
        - `Reset`
        - `ShowDialog`
    - 相关知识
        - 12.3.2 `File` 类
            - 属于 `System.IO` 空间
2. 保存文件对话框 `SaveFileDialog`
3. 颜色对话框 `ColorDialog`
4. 字体对话框 `FontDialog`
5. 打印相关对话框 `PageSetupDialog` `PrintDialog` `PrintPreviewDialog`


### 10.2.1 创建打开文件对话框 `OpenFileDialog`
- 主要内容
    - 属性
        - `FileName` 或者 `FileNames`
        - `Filter`
    - 方法
        - `Dispose`
        - `OpenFile`
        - `Reset`
        - `ShowDialog`
    - 相关知识
        - 12.3.2 `File` 类
            - 属于 `System.IO` 空间
- 操作
    1. 引用命名空间 `System.IO`
    2. 引入控件 `OpenFileDialog`
        - 重命名为 `ofdMain` 作为控件标识
    3. 引入控件 `TextBox`
        - 重命名为 `tbShowTxt`
        - 用于显示读取内容
    4. 设置 `temiOpen` 的 `Click` 事件
        - 设置过滤规则 `ofdMain.Filter`
            ```cs
            //ofdMain.Filter = "显示内容1|*.文件类型名1|显示内容2|*.文件类型名2|所有文件|*.*";
            ofdMian.Filter = "文本文件|*.txt";  // 两两成对 [显示给用户]|[显示给系统]
            
            ofdMain.Title = "选择打开的文件";
            ```
        - 成功选取后处理
            ```cs
            if (ofdMain.ShowDialog() == System.Windows.Forms.DialogResult.OK)
            {   // 打开成功
                string fileName = ofdMain.FileName; // 获取选取文件路径
                //string text = File.ReadAllText(fileName);  // 获取了 fileName 中的所有文件，保存为 text
                string text = File.ReadAllText(fileName,Encoding.UTF8);  // 读取文件，默认编码设置为UTF8
                // tbShowTxt.Text = text
            }
            ```

## 10.2.2 保存文件对话框
- 操作
    - 引入控件 `SaveFileDIalog`
        - 重命名为 `sfdMain`
    - 处理打开的文件
        - 设置 `sfdMain` 的 `Click` 事件
        ```cs
            sfdMain.Filter = "文本文件|*.txt";
            sfdMain.Title = "选择保存的文件";
            if (sfdMain.ShowDialog() == System.Windows.Forms.DialogResult.OK)
            {   // 打开成功
                string fileName = ofdMain.FileName; ;
                string text = tbShowTxt.Text;
                File.WriteAllText(fileName, text, Encoding.Default);
            }
        ```





