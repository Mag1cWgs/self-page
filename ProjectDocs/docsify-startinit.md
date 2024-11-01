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
```注意：```  
安装包有「长期支持版（LTS）」和「实验/最新版」两种。本地部署且无特殊需求时下载长期支持版安装足矣。  
```*也可以使用『软件包管理器』进行安装```
点击官网中的```下载 Node.js(LTS) ```进行下载，这里我们得到安装文件```node-v22.11.0-x64.msi```，双击进入安装步骤。

```参考链接```
[1][软件的Alpha、Beta、GM、OEM、LTS等版本的含义](https://blog.csdn.net/qq_36761831/article/details/83188138)  
[2][msi和exe安装文件有什么区别](https://blog.csdn.net/weixin_43924896/article/details/120707191)

#### 2. 配置安装
点开安装界面后依照下列顺序操作：
1. Welcome 页 -> ```Next```
2. License 页 -> ```Next```
3. Folder 页 -> 点击```Change```更改安装位置于```C:盘外```位置，比如```D:\NodeJs```（下文默认用此路径）
4. Custom 页 -> ```Next```
5. Tools 页 -> ```Next```   
    ```注意此处无需勾选```
6. Ready 页 -> ```Install```
7. Completed 页 -> ```Finish```
结束上述操作后安装窗口关闭。

按下```Win+R```输入```CMD```并回车进入命令指示符，
输入```node -v ```显示```node版本```，
输入```npm -v```显示```npm版本```，
如果都能显示数字字符串则证明```node```和```npm```安装成功。

```参考链接```
[1][全网最详细的nodejs卸载和安装教程](https://blog.csdn.net/qq_42257666/article/details/129909941)  
[2][下载并安装 node 和 npm](https://npm.nodejs.cn/cli/v8/configuring-npm/install)


### 1.2: 配置 Node.Js
> 主要是对环境变量进行配置，其中涉及 CMD 步骤均需要在管理员模式下运行。  
> 具体操作：按下```Win+R```输入```CMD```并按下```Shift + Ctrl + Enter```，选择```是```进入「管理员: CMD」。

#### 1. 修改全局模块下载路径
将全模块所在路径和缓存路径放在 node.js 安装的文件夹中：
找到你安装的```node.js```的安装位置```D:\NodeJs```，创建两个文件夹```node_global```和```node_cache```。
```
此时文件夹结构应为：
—— NodeJs
 | —— node_cache
 | —— node_global
 · —— node_modules
其中 node_cache 和 node_global 是新建的文件夹。
```
然后打开```CMD（注意应为管理员模式）```分别输入以下指令：  
```「# 」所在行的 # 后的内容不输入```
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
先在下半部分的```系统变量```中```新建```环境变量```NODE_PATH```，值为```D:\NodeJs\node_global\node_modules（填"上一步设置的全局模块位置\node_modules"）```；
后再上半部分的```用户变量```中```选中并编辑```环境变量```path```，将其中```C:\Users\电脑用户名\Appdata\Roaming\npm```改成```D:\NodeJs\node_global\```；
随后一路确定到所有相关窗口关闭，完成对Node.Js的配置


### 1.3: （可选）下载 Express / vue 进行测试
测试是否配置成功：  
进入 CMD ，输入下列指令：
```
npm install Express
npm install -g vue # -g 表示全局安装
```
应显示```Add 数字 package from 数字 contributor in 数字s```，进入上一步设置路径```D:\NodeJs\node_global\node_modules```中发现会新出现两个文件夹```Express```和```vue```。

```参考链接```
[1][NodeJs 的安装及配置环境变量](https://blog.csdn.net/zimeng303/article/details/112167688)  
[2][避坑了避坑了！！！全网最详细Nodejs安装配置](https://blog.csdn.net/weixin_45754463/article/details/135279187)  


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

```参考链接```
[1][使用轻量应用服务器部署Docsify在线文档平台](https://developer.aliyun.com/article/858583)


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
使用```Ctrl + s```保存该Markdown文件，此时Docsify所建立的本地服务器会自动刷新，往下拉取到刚才输入的部分，出现链接```[Example](/ProjectDocs/Example.md)```点击即可打开刚才建立的空Markdown文档```Example.md```。

### 3.2: 其他配置文件的修改

#### 1.左侧导航栏的配置
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
> 参考: [使用轻量应用服务器部署Docsify在线文档平台](https://developer.aliyun.com/article/858583)
> 1. 选择云服务商购买服务器
> 2. 建立实例并成功登陆
> 3. 安装宝塔面板、配置安全组
> 4. 配置宝塔面板
> 5. 优化访问效率（更改配置文件）



---

## 后话与参考链接

### 一点碎碎念

### 参考链接
[Docsify 官网（需魔法）](https://docsify.js.org/)  
[Docsify使用指南，使用Typora+Docsify打造最强、最轻量级的个人&团队文档，及免费和开源且低成本文档工具](https://blog.csdn.net/weixin_48290901/article/details/127772118)  
[使用开源文档工具docsify，用写博客的姿势写文档](https://www.cnblogs.com/throwable/p/13605289.html#%E5%9F%BA%E6%9C%AC%E9%85%8D%E7%BD%AE)  
[Wiki系列（二）：docsify部署及配置](https://zhuanlan.zhihu.com/p/141540641)  
[Docsify文档的部署](https://gitee.com/shafish/docsify-reference/blob/master/Docsify%E6%96%87%E6%A1%A3%E7%9A%84%E9%83%A8%E7%BD%B2.md)  
[部署docsify项目时出现无法访问README.md](https://cloud.tencent.com/developer/article/1855878)  
[关于docsify一直Loading及界面美化](https://zhuanlan.zhihu.com/p/663807103)  
[使用docsify搭建自己的markdown服务器之后强刷访问慢](https://blog.csdn.net/u013530406/article/details/135899309)  
