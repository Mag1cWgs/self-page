## 考试安排
### 考试时间 
16周周二16:10 - 18:00
### 考场、考位、详细信息
- 考场：理科楼 L2 - 620
- 考位：19（按照实际考场情况再则）
- 详细信息：
    - 《面向对象程序设计》 1班
    - 考场纪律
        - 不允许连接外部网络
        - 不允许相互抄袭
        - 允许使用自己的离线资料
        - 允许查看自己过往项目文件
## 重点复习

### 掌握常用类型 `string` `int` `double`
- 常用属性
- 常用方法
- 例: `string` 类
    - 索引器方法 `[int index]` 
        ```cs
        string s = "hello world";
        char target = s[4]; // target 值为 char 型的 'o'
        ```
    - 属性 `Length`
        ```cs
        string s = "hello world";

        ```
    - 构造函数
        - 多个重载的构造函数 
            - `string(char , int)`
                ```cs
                string str = new String('A',10);    // 构造一个长度为 10 ，每个字符均为 'A' 的字符串 str
                ```
            - `string(char[])`
                ```cs
                string str = new String(new char[] {'A','B','C'});  // 构造str = "ABC"
                ```
    - 方法
        - `public int IndexOf()`
            ```cs
            string example = "Hello World!";
            
            int targetIndex1st = example.IndexOf('l'); 
            if (targetIndex1st >= 0)
            {   // 找到了返回首个位置，未找到返回 -1
                int targetIndex2nd = example.IndexOf('l',targetIndex1st + 1 ,example.Length - (targetUbdex1st +1)) 
            }
            // 更好的方法是
            List<int> indexList = new List<int>();
            startIndex = -1;
            while(example.IndexOf('l',startIndex+1,example.Length-(startIndex+1)) >= 0)
            {
                indexList.append(example.IndexOf('l',startIndex+1,example.Length-(startIndex+1)));
                startIndex = example.IndexOf('l',startIndex+1,example.Length-(startIndex+1));
            }
            ```
- 例 `DateTime` 类
    - 构造函数
        - `DateTime(int year, int month, int day)`
            ```cs
            DateTime today = new DateTime(2024,12,10);
            ```
    - 常用方法
        - `public DateTime AddDays(double days)`
            ```cs
            DateTime today = new DateTime(2024,12,10);
            DateTime date_100 = today.AddDays(-100d); // 等同于 -100.0
            ```
- 构造函数
    - 特征：
        - 无返回类型
        - 函数名与类名相同
    - 无参构造函数
        - 不设定任何构造函数时编译器自动生成
        - 默认基于 `Objecct` 生成
        - 如果已经构造了有参构造函数，则不会默认生成无参的构造函数
    - 有参构造函数
        - 可以使用关键字 `this` 实现构造链
        - 不会默认生成

### 自行编写类
- 对矩形建模
    - 属性 长度 宽度 是否正方形
    - 方法 返回周长`()` 返回面积`Area()` 返回是否正方形`IsSquare()`
    - 构造函数
        - 双参数
        - 单参数
        - 无参数


### WinForm 窗体编写
- 单窗口间各控件通信
     - 例：对两个窗口内输入的数值进行加法运算并更新到第三窗口
        - 控件
            - `ttbFirst`
            - `ttbSecond`
            - `ttbResult`
            - `btnCalculate`
                - 触发事件 `btnCalculate_Click`
                    - 判断 `ttbFirst` 内是否数值
                    - 判断 `ttbSecond` 内是否数值
                    - 均转换为 `double` 类型然后运算
                        - 使用 `double.TryParse()` 方法
