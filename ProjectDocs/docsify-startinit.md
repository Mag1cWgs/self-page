# Docsify 从零开发环境到建立个人主页

> 目标：引导从无Node.Js开发环境情况下建立个人主页

## 目录
- Step 1: 下载并配置 Node.Js
    - 1.1: 下载并安装 Node.Js
    - 1.2: 配置 Node.Js
    - 1.3: 下载 Express / vue 进行测试（可选）
- Step 2: 下载并配置 Docsify
    - 2.1: 下载 Docsify 并进行初始化
    - 2.2: 本地访问与测试
    - 2.3: 配置文件的初始化
- Step 3: 个人主页的其他配置与丰富
    - 3.1: 建立自己的文档并添加到链接
    - 3.2: 其他配置文件的修改
- Step 4: 部署到云服务器（以阿里云为例）
    - 4.1: 选择云服务商购买服务器
    - 4.2: 建立实例并成功登陆
    - 4.3: 安装宝塔面板、配置安全组
    - 4.4: 配置宝塔面板
    - 4.5: 优化访问效率（更改配置文件）
    - 4.6: 购买域名、设置DNS解析
    - 4.7: 配置SSL证书、放行443端口、重启服务
    - 4.8: 网站ICP备案、无备案情况下更改端口
    - 4.9: 后续更改/重新部署
- 后话与参考链接
    - 一点碎碎念
    - 参考链接



---



## Step 1: 下载并配置 Node.Js
>   1. 下载并安装 Node.Js
>   2. 配置 Node.Js
>   3. 下载 Express / vue 进行测试（可选）


### 1.1: 下载并安装 Node.Js
> 1. 进入官网下载
> 2. 配置安装

#### 1. 进入官网下载
官网地址：[Link](https://nodejs.org/zh-cn)  
> [!note]
> 安装包有『长期支持版（LTS）』和『实验/最新版』两种。本地部署且无特殊需求时下载长期支持版安装足矣。  
> ```*也可以使用『软件包管理器』进行安装```

点击官网中的```下载 Node.js(LTS) ```进行下载，这里我们得到安装文件「node-v22.11.0-x64.msi」，双击进入安装步骤。

```参考链接```  
[1][软件的Alpha、Beta、GM、OEM、LTS等版本的含义](https://blog.csdn.net/qq_36761831/article/details/83188138)  
[2][msi和exe安装文件有什么区别](https://blog.csdn.net/weixin_43924896/article/details/120707191)

#### 2. 配置安装
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

> [!note|style:callout|label:参考链接] 
> [1][全网最详细的nodejs卸载和安装教程](https://blog.csdn.net/qq_42257666/article/details/129909941)  
> [2][下载并安装 node 和 npm](https://npm.nodejs.cn/cli/v8/configuring-npm/install)


### 1.2: 配置 Node.Js
> [!attention]
> 主要是对环境变量进行配置，其中涉及 CMD 步骤均需要在 **管理员模式** 下运行。  
> 具体操作：按下```Win+R```输入```CMD```并按下```Shift + Ctrl + Enter```，选择```是```进入 **「管理员: CMD」** 。

#### 1. 修改全局模块下载路径
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
然后打开「 CMD **（注意应为管理员模式）** 」分别输入以下指令：  
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

#### 2. 配置电脑环境变量
回到桌面后```右键 「我的电脑」``` -> ```「属性」``` -> ```「高级系统设置」``` -> ```「环境变量」```打开环境变量对话框。
先在下半部分的「系统变量」中```新建```环境变量```NODE_PATH```，值为```D:\NodeJs\node_global\node_modules（填"上一步设置的全局模块位置\node_modules"）```；
后再上半部分的「用户变量」中```选中并编辑```环境变量```path```，将其中```C:\Users\电脑用户名\Appdata\Roaming\npm```改成```D:\NodeJs\node_global\```；
随后一路确定到所有相关窗口关闭，完成对Node.Js的配置


### 1.3: （可选）下载 Express / vue 进行测试
测试是否配置成功：  
进入 CMD ，输入下列指令：
```
npm install Express
npm install -g vue # -g 表示全局安装
```
应显示```Add 数字 package from 数字 contributor in 数字s```，进入上一步设置路径```D:\NodeJs\node_global\node_modules```中发现会新出现两个文件夹```Express```和```vue```。

> [!note|style:callout|label:参考链接] 
> [1][NodeJs 的安装及配置环境变量](https://blog.csdn.net/zimeng303/article/details/112167688)  
> [2][避坑了避坑了！！！全网最详细Nodejs安装配置](https://blog.csdn.net/weixin_45754463/article/details/135279187)  



---



## Step 2: 下载并配置 Docsify
>   1. 下载 Docsify 并进行初始化
>   2. 本地访问与测试
>   3. 配置文件的初始化


### 2.1: 下载 Docsify 并进行初始化
建立一个空文件夹，例如建立文件夹```F:\Docsify```，在文件夹内```Shift + 鼠标右键```选择```在终端中打开```，输入以下指令：
```
# 用npm安装全局工具
npm i docsify-cli -g
```
而后输入下列指令:
```
# 在 ./MyDocs 建立 doscify 实例 MyDocs
docsify init ./MyDocs
```
若初始化成功会弹出下列提示：
```
Initalization succeeded! Please run docsify serve ./MyDoce
```
而且在指定目录（对上条指令为当前文件夹）下会生成 Docsify 的初始页面文件，结构如下：
```
—— MyDocs
 | —— .nojekyll
 | —— index.html
 · —— README.md
```
最后在命令行内输入下列命令：
```
docsify serve ./MyDocs
```
如果返回下面提示，这说明服务已启动：
```
Serving F:\Docsfy\Mydocs now.
Listening at http://localhost:3000
```


### 2.2: 本地访问与测试
使用浏览器打开上一步弹出网页```http://localhost:3000```，会看到一个近乎空白的初始Docsify文档站。  
该本地网页是```README.md```经过Docsify配置成为```index.html```后生成的网页。  
我们的站点不能只有一行主题词，需要为站点添加内容。最简单的方法是直接编辑项目docs目录下的README文档，保存文档并刷新浏览器之后，你编辑的内容会直接呈现在网页中。MarkDown的段落和语法非常好理解，建议直接看 [官方文档](https://www.markdownguide.org/basic-syntax/) 或 [（本站）Markdown语法学习](/ProjectDocs/Markdown-Using.md)。

### 2.3: 配置文件的初始化

用编辑器打开```index.html```，修改内容为：
```html
<!DOCTYPE html>
<html lang="zh">
<head>
    <meta charset="UTF-8">
    <title>网页标题</title>
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
    <!-- 设置浏览器图标 -->
    <link rel="icon" href="/favicon.ico" type="image/x-icon" />
    <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
    <meta name="description" content="Description">
    <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <!-- 默认主题 vue-->
    <link rel="stylesheet" href="//cdn.jsdelivr.net/npm/docsify/lib/themes/vue.css">
</head>
<body>
    <!-- 定义加载时候的动作 -->
    <div id="app">加载中...</div>
    <script>
        window.$docsify = {
            // 项目名称
            name: '左侧栏顶部标识',
            // 仓库地址，点击右上角的Github章鱼猫头像会跳转到此地址
            repo: '自己的仓库地址',
            // 侧边栏支持，默认加载的是项目根目录下的_sidebar.md文件
            loadSidebar: true,
            // 导航栏支持，默认加载的是项目根目录下的_navbar.md文件
            loadNavbar: true,
            // 封面支持，默认加载的是项目根目录下的_coverpage.md文件
            coverpage: true,
            // 网页最大支持渲染的标题层级
            maxLevel: 4,
            // 自定义侧边栏后默认不会再生成目录，此处设置侧边栏生成目录的层级，建议1或者2
            subMaxLevel: 2
        }
    </script>
    <script>
        // 搜索配置
        window.$docsify = {
            search: {
                maxAge: 86400000,
                paths: auto,
                placeholder: '搜索',
                noData: '找不到结果',
                depth: 4,
                hideOtherSidebarContent: false,
                //namespace: 'docsify-demo',
            }
        }
    </script>
    <!-- docsify的js依赖 -->
    <script src="//cdn.jsdelivr.net/npm/docsify/lib/docsify.min.js"></script>
    <!-- emoji表情支持 -->
    <script src="//cdn.jsdelivr.net/npm/docsify/lib/plugins/emoji.min.js"></script>
    <!-- 图片放大缩小支持 -->
    <script src="//cdn.jsdelivr.net/npm/docsify/lib/plugins/zoom-image.min.js"></script>
    <!-- 搜索功能支持 -->
    <script src="//cdn.jsdelivr.net/npm/docsify/lib/plugins/search.min.js"></script>
</body>
</html>
```
> [!note|style:callout|label:参考链接] 
> [1][使用轻量应用服务器部署Docsify在线文档平台](https://developer.aliyun.com/article/858583)



---



## Step 3: 个人主页的其他配置与丰富
>   1. 建立自己的文档并添加到链接
>   2. 其他配置文件的修改


### 3.1: 建立自己的文档并添加到链接
在根目录```F:\Docsify\MyDocs```下建立文件夹```ProjectDocs```，建立Markdown文件```Example.md```。
打开根目录下文件```README.md```，添加一行
```markdown
[Example](/ProjectDocs/Example.md)
```
使用```Ctrl + s```保存该Markdown文件，此时Docsify所建立的本地服务器会自动刷新，往下拉取到刚才输入的部分，出现链接```[Example](/ProjectDocs/Example.md)```点击即可打开刚才建立的空Markdown文档「Example.md」。

### 3.2: 其他配置文件的修改

#### 1. 左侧导航栏的配置
建立新文件```_sidebar.md```作为左侧导航栏配置文件，内容示例如下：
```html
<!-- _sidebar.md -->
 <!--连接格式均为[显示名称](地址)，此处地址通常都为相对地址，引用大多均位于本地目录-->
* 如何建立自己的主页
  * [Docsify部署教程](/ProjectDocs/docsify-startinit.md)
* 前端语言学习
  * [Node.Js](/ProjectDocs/NodeJs-DownloadInit.md)
* 工具
  * [命令行的艺术（转载、部分链接丢失）](/ProjectDocs/Command-CMDart.md)
  * [CMD 命令行常用](/ProjectDocs/Command-CMDusing.md)
  * [Git版本管理工具](/ProjectDocs/Git-Using.md)
  * [Markdown语法学习](/ProjectDocs/Markdown-Using.md)
  * [LaTex语法学习](/ProjectDocs/LaTex-Learning.md)
```
#### 2. 右上导航栏的配置
建立新文件```_navbar.md```作为右上导航栏配置文件，内容示例如下：
```html
<!-- _navbar.md -->
* 在哪抓鱼
  * [BiliBili主页](https://space.bilibili.com/171476646?)
  * [知乎地址](https://www.zhihu.com/people/srnd13)
  * [Gitee地址](https://gitee.com/mag1cwgs)
  * [Github地址](https://github.com/Mag1cWgs)
* 友情链接
  * [Docsify](https://docsify.js.org/#/)
  * [博客园](https://www.cnblogs.com/)
```
#### 3. 封面的配置
建立新文件```_coverpage.md```作为封面配置文件，内容示例如下：
```html
<!-- _coverpage.md -->
# 个人主页
> 💪使用Docsify打造的轻量个人文档  
简单、轻便 (压缩后 ~21kB)  
- 无需生成 html 文件  
- 众多主题  
[下滑或点击这里](/README.md)
```


---


## Step 4: 部署到云服务器（以阿里云为例）  
> 1. 选择云服务商，购买服务器
> 2. 建立实例并成功登陆
> 3. 安装宝塔面板、配置安全组
> 4. 配置宝塔面板
> 5. 优化访问效率（更改配置文件）
> 6. 购买域名、设置DNS解析
> 7. 配置ssh证书、放行443端口、重启服务
> 8. 网站ICP备案、无备案情况下更改端口
> 9. 后续更改/重新部署  

> [!note|style:callout|label:参考链接] 
> [1][使用轻量应用服务器部署Docsify在线文档平台](https://developer.aliyun.com/article/858583)  
> [2][阿里云 —— 云服务器 ECS —— 产品概述](https://help.aliyun.com/zh/ecs/product-overview/?spm=a2c4g.11186623.help-menu-25365.d_0.9667629cTNjxmO)  
> [3][阿里云服务器新手入门：从购买、配置到搭建网站全教程](https://blog.csdn.net/tencentcloud_/article/details/134270331)


### 4.1: 选择云服务商、购买服务器

#### 1. 选择云服务商
市面上主流的云服务商有「亚马逊(AWS)」、「Microsoft Azure」、「Google Cloud」、「Alibaba Cloud」、「ORACLE」、「aalesforce」、「IBMCloud」、「Tencent Cloud」等，相关概念可以查看[2024 年的云计算与十大云计算服务提供商](https://tridenstechnology.com/zh/%E4%BA%91%E6%9C%8D%E5%8A%A1%E6%8F%90%E4%BE%9B%E5%95%86/)。  
本次使用 **「Alibaba Cloud」**，也即 **「阿里云」** 作为即将部署的网页服务器。在浏览器搜索```阿里云```，在[官网](https://cn.aliyun.com/)右上角注册账户，完成个人信息验证提交。  
#### 2. 购买服务器
1. 如果对服务器有**性能要求**，建议**按需购买**，具体操作流程为：  
成功登录后在顶部栏选择「产品」——「计算」—— ```轻量应用服务器```并点击进入，在弹出的网页中选择```立即购买```，在弹出的购买详情内选择 ```服务器实例（默认）``` —— ```中国 - 华东1（杭州）``` —— ```镜像 - 应用镜像 - 宝塔Linxu面板``` —— 选择合适```套餐配置``` - 设置所需```额外数据盘``` - 设置```购买时长、数量``` 而后等待服务器分配。  
2. 如果对服务器**无性能要求**或**预算有限**，可以使用阿里云的 **「云服务器ECS免费试用」** ，具体操作如下：  
成功登录后在顶部栏选择「权益中心」——「免费试用」，在下方第一行就会有```云服务器ECS免费试用（个人版）```和```云服务器ECS免费试用（企业版）```，这里我们选择```云服务器ECS免费试用（个人版）```。参考上一情况下进行购买配置，注意购买的是「『Ubuntu』+『宝塔面板 BT-Panel』」的版本，勾选协议后付款0元。
> 注意：试用ECS不支持备案；个人认证且产品新用户可试用；个人、企业试用不同享。 
> 也可以考虑[阿里云学生服务器免费用7个月（申请全流程）](https://developer.aliyun.com/article/1256821) 

### 4.2: 建立实例并成功登陆
成功购买云服务器后，在主页右上角头像旁边```控制台```进入[阿里云控制台首页](https://home.console.aliyun.com/home/dashboard/ProductAndService)，在「概览」——「资源概览」——「我的资源」内应显示 **「云服务器 ECS > 1实例...」** ```（注意：此处默认账户内无原有云服务器实例）```，点击它打开进入[云服务器管理控制台](https://ecs.console.aliyun.com/home#/)，下拉到「我的资源」，点击刚刚创建的服务器实例，进入实例管理页面，在```实例详情```中更改```登录名```及```新密码```，然后在右上角选择```启动```并返回上层。  
回到云服务器控制台概览页面后，刚刚启动的实例右上角出现```远程连接```选项，点击后弹出「远程连接」——「通过Workbench远程连接```默认```」，点击立即登录。
此时会弹出一个以实例为名的窗口，此时需要用刚才更改的用户名和密码进行登录，等待几秒后会弹出 Ubuntu 终端窗口，说明服务器实例成功创立并成功登陆。

> [!note|style:callout|label:参考链接]
> [1][阿里云服务器修改主机名即ID(登陆时root@后显示名)【图文】](https://blog.csdn.net/weixin_51253120/article/details/132008017)  

### 4.3: 安装宝塔面板、配置安全组  

#### 1. 安装宝塔面板  
点开[宝塔官网](https://www.bt.cn/new/index.html)，点击```立即免费安装```，进入「宝塔面板下载界面」，下拉找到「Linux面板安装脚本」，向下找到「Ubuntu/Deepin 安装脚本」，点击右端的```复制命令```，然后关闭该窗口即可。  
回到上一节中打开的 Ubuntu 终端窗口，使用```Ctrl + v```粘贴，在提示「命令包含换行符」窗口位置选择```是```，按下```回车```执行后等待服务器下载宝塔面板，直到弹出以下提示：  
```Ubuntu
Do you want to install Bt-Panel to the /www directory now?(y/n):
```  
输入```y```后系统会自动安装，一分钟左右完成安装。  
安装完成后，显示如下内容：  

```Ubuntu
================================================
Congratulations! Installed successfully
================================================
外网面板地址：https://服务器实例的公网ip:端口号/八位标记符
内网面板地址：https://服务器实例的内网ip:端口号/八位标记符
username: 默认八位面板账号
password: 默认八位面板密码
If you cannot access the panel, 
release the following panel port [端口号] in the security group
若无法访问面板，请检查防火墙/安全组是否有放行面板[端口号]端口
因已开启面板自签证书，访问面板会提示不匹配证书，请参考以下链接配置证书
https://www.bt.cn/bbs/thread-105443-1-1.html
```

**保存好上述信息**，如果是通过外网登录宝塔后台，就是用外网面板地址，如果是在云服务器上登录宝塔可以使用内网面板地址。

#### 2. 配置安全组
打开「云服务器工作台」——「实例」——「上面建立的服务器实例」，切换到实例的```安全组```页面，点击```安全组列表```下唯一的安全组右侧的```管理规则```，点击```手动添加```，在```目的```内填入上一步获得的```端口号```，在```源```中选择```所有IPv4(0.0.0.0/0)```，点击```保存```，而后退回到「实例详情」页面。

### 4.4: 配置宝塔面板  

#### 1. 初始化面板
使用浏览器打开上一节获取的外网面板地址，即```https://服务器实例的公网ip:端口号/八位标记符```，会弹出一个登录窗口，其账号密码均为上一节安装面板时系统生成的```默认八位面板账号```和```默认八位面板密码```，并绑定自己的宝塔账号（若没有宝塔账户请自行注册）。而后进入宝塔面板主页。  
第一次访问时会弹出「推荐安装套件窗口」，选择 **「LNMP(推荐)」** ，点击```一键安装```，等待五分钟左右即可在服务器上成功安装 Docsify 所需的 Web 环境。  
点击主页左上角```消息盒子（橙色背景白色数字）```，出现提示安装完成后，点击面板主页左侧```网站```，进入「PHP项目」配置页面，点击```添加站点```，在弹出的「添加站点」——「传统项目」中，添加```服务器实例的公网ip```到「*域名」内，而后点击```确定```，这样我们就成功的在前两节建立的服务器实例上成功的设置了最基础的宝塔面板，并且提供了最基础的Index页面。
#### 2. 上传docsify文件
点击「宝塔面板主页」——「左侧导航栏」——「文件」，进入目录```/www/wwwroot/服务器实例公网IP```，选择```上传/下载```，将本地的 docsify 文件拖入其中，并点击```确认```，上传任务完成后，我们就可以通过浏览器打开```服务器实例公网IP```来浏览上传的文件了。

### 4.5: 优化访问效率（更改配置文件） 
在完成最基础的面板设置之后，需要完成以下步骤：

#### 1. 更改面板的账号与密码
点击面板主页左侧```面板设置```，在默认的```全部设置```页面下滑，在「面板账号」和「面板密码」右侧均有```设置```，点击后可以重新设置。```注意：更改后会需要重新登录```
#### 2. 更改面板端口与安全入口
点击面板主页左侧```面板设置```，选择```安全设置```页面下滑，在「面板端口」和「安全入口」处更改面板端口值```上一节的端口号```和安全入口值```上一节的八位标记符```。
> [!attention]
> 更改面板端口号后，需要参考上上一节 **「4.3 安装宝塔面板、配置安全组」** 的小节 **「2. 配置安全组」** 中步骤，设置对新设置的端口的放行策略。

### 4.6: 购买域名、设置DNS解析

#### 1. 购买域名
购买域名有众多渠道，建议自行购买非中国大陆的域名，并设置其解析到刚才建立的服务器实例的IP地址上。  
此处使用[阿里云万网](https://wanwang.aliyun.com/)进行购买。  
``详情点击[「阿里云文档」域名产品](https://help.aliyun.com/zh/dws/?spm=a2c4g.750001.0.0.45632842ZUtjAN)``
#### 2. 设置DNS解析
同样也可以在域名服务商处设置域名解析，此处仍使用阿里云自带域名解析服务。
打开阿里云「云解析DNS工作台」，选择左侧「公网DNS解析」——「权威域名解析」，在跳转窗口的「权威域名」界面点击```添加域名```，输入上一小节所购买域名，确认后会退回到「权威域名」界面。  
此时「权威域名」界面会出现「上一小节购买域名」行，点击其右侧的```解析设置```，进入「解析设置」界面，默认有一行「主机记录」为 **「@」** 的解析设置，点击其右侧的```修改```，将其中的「记录值」设置为「4.2节/4.3节」中服务器实例的IP地址```服务器实例的公网IP```，修改完成后点击```确定```。

### 4.7: 配置SSL证书、放行443端口、重启服务器  

#### 1. 申请SSL证书并下载
这里仍然使用阿里云的「[数字证书管理服务](https://yundunnext.console.aliyun.com/?)」。
点击「数字证书管理服务工作台」主页左侧的「证书管理」——「SSL证书管理」，选择```选择个人测试证书（原免费证书）```，点击```立即购买```，勾选服务协议后再次点击```立即购买```，进入申请页面后，参考[免费版个人测试证书快速上手](https://help.aliyun.com/zh/ssl-certificate/getting-started/get-started-with-free-certificates)这一文档填写资料，并提交审核。  
证书签发后，回到「选择个人测试证书（原免费证书）」页面，点击刚签发证书右侧的```更多```，进入「证书详情」页面，点击进入```下载```页面，在提供列表中选择「其他」类型的证书，点击右侧```下载```，浏览器自动下载一个后缀为「.zip」的文件，其中将含有两个后缀分别为「.key」和「.pem」的文件，将这两个文件解压出来并妥善保存，它们是SSL证书本体。
#### 2. 安装SSL证书到服务器
> 由于使用宝塔面板，应参考阿里云文档[在宝塔面板安装SSL证书](https://help.aliyun.com/zh/ssl-certificate/user-guide/install-a-certificate-on-bt-panel)进行操作。

点击「宝塔面板主页」——「左侧导航栏」——「网站」，打开「PHP项目」管理页，单击之前部署的网页项目右侧的```未部署```。在本地使用文本编辑器打开证书文件（.pem）和私钥文件（.key），然后复制其内容并将其粘贴至相应位置，单击```保存并启用证书```。
#### 3. 放行443端口、重启服务
点击「宝塔面板主页」——「左侧导航栏」——「安全」在「系统防火墙」页面点击```添加端口规则```，添加端口```443```后点击```确定```。  
重启nginx服务有两种方法：
1. 回到「宝塔面板主页」——「左侧导航栏」——「网站」，在「PHP项目」管理页上侧「添加站点」的右侧有「nginx 版本号 ▶」，光标移动上去，选择```重启```。
2. 回到「宝塔面板主页」——「左侧导航栏」——「终端」，输入```sudo systemctl restart nginx```或```sudo systemctl reload nginx```，而后输入```sudo nginx -t```以测试是否nginx是否存在任何语法或系统错误，若无错误则应如下列所示：
```Ubuntu
nginx: the configuration file /配置路径/nginx.conf syntax is ok
nginx: configuration file /配置路径/nginx.conf test is successful
```

> [!note|style:callout|label:参考链接] 
> [1][Nginx常用命令（启动、重启、关闭、检查](https://blog.csdn.net/qq_28624243/article/details/115598416)  
> [2][宝塔面板SSL证书文件存放目录位置在哪里?](https://blog.csdn.net/wx23986/article/details/141440990)  
> [3][在宝塔面板安装SSL证书](https://help.aliyun.com/zh/ssl-certificate/user-guide/install-a-certificate-on-bt-panel?spm=a2c4g.11186623.0.i1)  


### 4.8: 网站ICP备案、无备案情况下更改端口  
#### 1. 网站ICP备案
#### 2. 网站无法备案ICP时更改端口
1. 方法1：自行更改配置文件： 
```/www/server/panel/vhost/nginx```中开头```listen 443```改为```listen 目标端口```以实现```https://网站域名:目标端口/```。
2. 方法2：使用面盘网站设置更改端口转发：  
点击主页左上角```消息盒子（橙色背景白色数字）```，出现提示安装完成后，点击面板主页左侧```网站```，进入「PHP项目」配置页面，点击部署网页右侧的```设置```，在弹出窗口左侧找到```配置文件```，更改其```listen 443 ssl http2 ;```为```listen 目标端口号 ssl http2 ;```。

### 4.9: 后续更改/重新部署  
[部署证书至阿里云轻量应用服务器或ECS（云服务器部署）](https://help.aliyun.com/zh/ssl-certificate/user-guide/deploy-ssl-certificates-to-cloud-servers?spm=a2c4g.11186623.help-menu-28533.d_2_1_6_5.4e483574JLTEsM) 



---



## 后话与参考链接
完成上述步骤后，应该能有三种方式来浏览 docsify 转换成的网页：
- localhost:3000/#/ ```记得本地启用docsify服务！：docsify serve ./MyDocs```
- http://服务器实例公网IP/
- https://域名/ ```如果更改非443端口则会是https://域名:更改的端口/```
实际我们也可以用 Github 提供的「Github Page」来实现部署与访问，配合上「版本控制工具GIT」会更方便我们日常更新所用。

### 一点碎碎念

#### 碎碎念 ver 1.0
确实好久没写碎碎念了！最近一直都很懈怠能量很低TT  
转眼大三上也已经过去一半了，明年这个时候可能已经成社畜了（目移），也有可能在准备考研？
未来的事情未来再纠结！  

建立这个网站的初衷其实就是很简单的知识构建、回看，甚至算不上分享什么的，可能一年过去也不会有多少访问量，显然谈不上分享。  
唔，希望能从这个 Docsify 项目开始系统整理学过的知识吧！  
唔，感觉数学也可以建立一个单独的合集——虽然我没学到什么但是就是想记！  
数学我还蛮喜欢记笔记的，计算机的话其实我也喜欢自己记记写写。  
其实也都说要做知识结构框架？唔，于我个人而言是方便回头看，不用再捋那些繁杂的学习之路，可以方便的知道做过什么学过什么。  

蛮有趣的！一次性写五六百行 Markdown 文本，好像又回到年纪小的时候偷偷写网文的日子。（目移）  

下周就学期第 10 周了，期末考试就要来了啊啊啊啊啊！  

希望一切顺利 ——

```小记于24.11.2凌晨4时```  ```剁椒鱼头留记```

#### 碎碎念 ver 2.0
啊对我又碎碎念了，但是这次碎碎念后不会再继续撰写了这份教程了，个人能力有限，很多地方需要感谢```Evan76```和```狸猫```的解惑，说起来还是猫叔向我介绍的 docsify 呢！
又熬大夜了啊啊啊 ——  
```小记与24.11.3凌晨6时``` ```熬夜鱼头留记```  



### 参考链接
[Docsify 官网（需魔法）](https://docsify.js.org/)  
[docsify的配置+全插件列表](https://xhhdd.cc/index.php/archives/80/)
[docsify指南](https://yzqtpl.github.io/docsify-vitepress/)  
[Docsify使用指南，使用Typora+Docsify打造最强、最轻量级的个人&团队文档，及免费和开源且低成本文档工具](https://blog.csdn.net/weixin_48290901/article/details/127772118)  
[使用开源文档工具docsify，用写博客的姿势写文档](https://www.cnblogs.com/throwable/p/13605289.html#%E5%9F%BA%E6%9C%AC%E9%85%8D%E7%BD%AE)  
[Wiki系列（二）：docsify部署及配置](https://zhuanlan.zhihu.com/p/141540641)  
[Docsify文档的部署](https://gitee.com/shafish/docsify-reference/blob/master/Docsify%E6%96%87%E6%A1%A3%E7%9A%84%E9%83%A8%E7%BD%B2.md)  
[部署docsify项目时出现无法访问README.md](https://cloud.tencent.com/developer/article/1855878)  
[关于docsify一直Loading及界面美化](https://zhuanlan.zhihu.com/p/663807103)  
[docsify的插件](https://xhhdd.cc/index.php/archives/80/)  
[使用docsify搭建自己的markdown服务器之后强刷访问慢](https://blog.csdn.net/u013530406/article/details/135899309)  
