# Node.Js 的下载与环境配置


## 目录
- 1: 下载并安装 Node.Js
    - 1.1: 进入官网下载
    - 1.2: 配置安装
- 2: 配置 Node.Js
    - 2.1: 修改全局模块下载路径
    - 2.2: 配置电脑环境变量
- 3: 下载 Express / vue 进行测试（可选）
- 4: 使用 nvm-Windows 进行  Node 版本管理

---


## 1: 下载并安装 Node.Js
> 1. 进入官网下载
> 2. 配置安装

### 1.1: 进入官网下载
官网地址：[Link](https://nodejs.org/zh-cn)  
「注意：安装包有『长期支持版（LTS）』长和『实验/最新版』两种。本地部署且无特殊需求时下载长期支持版安装足矣。```*也可以使用『软件包管理器』进行安装```」  
点击官网中的```下载 Node.js(LTS) ```进行下载，这里我们得到安装文件「node-v22.11.0-x64.msi」，双击进入安装步骤。

```参考链接```  
[1][软件的Alpha、Beta、GM、OEM、LTS等版本的含义](https://blog.csdn.net/qq_36761831/article/details/83188138)  
[2][msi和exe安装文件有什么区别](https://blog.csdn.net/weixin_43924896/article/details/120707191)

### 1.2: 配置安装
点开安装界面后依照下列顺序操作：
1. Welcome 页 -> ```Next```
2. License 页 -> ```Next```
3. Folder 页 -> 点击```Change```更改安装位置于「C:盘外」位置，比如```D:\NodeJs```（下文默认用此路径）
4. Custom 页 -> ```Next```
5. Tools 页 -> ```Next```   
    ```注意此处无需勾选```
6. Ready 页 -> ```Install```
7. Completed 页 -> ```Finish```
结束上述操作后安装窗口关闭。

按下```Win+R```输入```CMD```并回车进入命令指示符，
输入```node -v ```显示「node版本」，
输入```npm -v```显示「npm版本」，
如果都能显示数字字符串则证明「node」和「npm」安装成功。

```参考链接```  
[1][全网最详细的nodejs卸载和安装教程](https://blog.csdn.net/qq_42257666/article/details/129909941)  
[2][下载并安装 node 和 npm](https://npm.nodejs.cn/cli/v8/configuring-npm/install)


---


## 2: 配置 Node.Js
> 主要是对环境变量进行配置，其中涉及 CMD 步骤均需要在管理员模式下运行。  
> 具体操作：按下```Win+R```输入```CMD```并按下```Shift + Ctrl + Enter```，选择```是```进入「管理员: CMD」。


### 2.1: 修改全局模块下载路径
将全模块所在路径和缓存路径放在 node.js 安装的文件夹中：
找到你安装的「node.js」的安装位置```D:\NodeJs```，创建两个文件夹```node_global```和```node_cache```。
```
此时文件夹结构应为：
—— NodeJs
 | —— node_cache
 | —— node_global
 · —— node_modules
其中 node_cache 和 node_global 是新建的文件夹。
```
然后打开「CMD **（注意应为管理员模式）** 」分别输入以下指令：  
```「#」所在行的 # 后的内容不输入```
```
# 设置全局模块安装路径到 "NodeJs的安装目录\node_global"
npm config set prefix "D:\NodeJs\node_global"
# 设置全局缓存存放路径 "NodeJs的安装目录\node_cache"
npm config set cache "D:\NodeJs\node_cache"
```
正常情况下应无任何输出，如若想确认是否设置完成可以再分别输入以下指令：
```
# 查找 prefix 的安装路径
npm config get prefix
# 查找 cache 的安装路径
npm config get cache
``` 
应输出 :
```
D:\NodeJs\node_global
D:\NodeJs\node_cache
```

### 2.2: 配置电脑环境变量
回到桌面后```右键 「我的电脑」``` -> ```「属性」``` -> ```「高级系统设置」``` -> ```「环境变量」```打开环境变量对话框。
先在下半部分的「系统变量」中```新建```环境变量```NODE_PATH```，值为```D:\NodeJs\node_global\node_modules（填"上一步设置的全局模块位置\node_modules"）```；
后再上半部分的「用户变量」中```选中并编辑```环境变量```path```，将其中```C:\Users\电脑用户名\Appdata\Roaming\npm```改成```D:\NodeJs\node_global\```；
随后一路确定到所有相关窗口关闭，完成对Node.Js的配置


---


## 3: （可选）下载 Express / vue 进行测试
测试是否配置成功：  
进入 CMD ，输入下列指令：
```
npm install Express
npm install -g vue # -g 表示全局安装
```
应显示```Add 数字 package from 数字 contributor in 数字s```，进入上一步设置路径```D:\NodeJs\node_global\node_modules```中发现会新出现两个文件夹```Express```和```vue```。



---



## 4: 使用 nvm-windows 进行  Node 版本管理
0. 卸载现有 node ，清理文件夹，清除系统变量
1. 下载并配置 nvm-windows
2. 使用 nvm 进行 node 的下载和安装
3. 配置 node 的 prefix（全局路径）和 cache（缓存路径）
4. 重新配置环境变量
5. 验证当前 node 版本
6. 进阶：nvm 的其他用法




> [!note|label:参考链接]  
> [1][nvm-Windows](https://github.com/coreybutler/nvm-windows)  
> [2][【nvm】适合小白的 nvm 安装配置教程（Windows版](https://www.cnblogs.com/rnny/p/17839190.html)



---



```参考链接```  
[1][NodeJs 的安装及配置环境变量](https://blog.csdn.net/zimeng303/article/details/112167688)  
[2][避坑了避坑了！！！全网最详细Nodejs安装配置](https://blog.csdn.net/weixin_45754463/article/details/135279187)
