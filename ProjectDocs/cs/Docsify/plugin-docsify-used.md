> [!warning]
> 本地化部署相较联网获取，可以方便本地构建与预览，也同样方便网页端访问，但是失去自动更新与修复推送，本地化部署前慎重！

## 当前本站点已经本地化的Js支持
- Docsify本体
    - 样式主题使用[vue](cdn.jsdelivr.net/npm/docsify/lib/themes/vue.css)
    - 自 v4.13 开始无需引用[emoji表情插件](fastly.jsdelivr.net/npm/docsify/lib/plugins/emoji.min.js)
    ```html
    <head>
        <!-- 默认主题 vue -->
        <link rel="stylesheet" href="/js/vue.css">
    </head>
    <body>
        <!-- docsify的js依赖 -->
        <script src="/js/docsify.min.js"></script>
    </body>
    ```

- [docsify-plugin-flexible-alerts: 自定义高亮块](https://github.com/fzankl/docsify-plugin-flexible-alerts)
    > [!tip]
    > 效果即本高亮块
    ```html
    <!-- 自定义高亮文本框 -->
    <script src="/js/docsify-plugin-flexible-alerts.min.js"></script>
    ```

- 对 $\TeX$ 的支持
    - 引入 $\KaTeX$ 渲染引擎与样式支持
    - 引入 docsify 对 $\LaTeX$ 支持
    ```html
    <head>
            <!-- 其他内容 -->
        
        <!-- 加载 KeTeX 样式 -->
            <link rel="stylesheet" href="js/katex/katex.min.css" />
        <!-- 引入 KeTeX 渲染引擎 -->
            <script src="js/katex/katex.min.js"defer ></script>
        <!-- 引入 Docsify 对 LaTeX 支持 -->
            <script src="js/docsify-latex.js" defer ></script>
    </head>
    ```

- 侧边栏折叠主题
    - [GitHub仓库](https://github.com/iPeng6/docsify-sidebar-collapse/tree/master)
    ```html
    <head>
        <link rel="stylesheet" href="js/docsify-sidebar-collapse/sidebar.min.css" />
    </head>
    ```

- 图片缩放支持
    ```html
    <body>
        <script src="/js/zoom-image.min.js"></script>
    </body>
    ```

- 搜索功能支持
    - [脚本地址(jsdelivr)](fastly.jsdelivr.net/npm/docsify/lib/plugins/search.min.js)
    ```html
    <body>
        <!-- 搜索功能支持 -->
        <script src="js/search.min.js"></script>
    </body>
    ```

- 自定义页脚
    - [docsify-footer: 自定义页脚](https://alertbox.github.io/docsify-footer/#/quick-start)
    - [CDN部署](https://alertbox.github.io/docsify-footer/#/cdn)
    - [jsDelivr 部署](https://www.jsdelivr.com/package/npm/@alertbox/docsify-footer)
    - [unpkg部署](https://unpkg.com/browse/@alertbox/docsify-footer@1.0.0-0/dist/)
    ```html
    <body>
        window.$docsify = {
        loadFooter: '_footer.md',// 默认值为 true , 可改为指定名称
        }

        <!-- 页脚插件 -->
        <script src="js/docsify-footer.min.js"></script>
    </body>
    ```

- 自定义代码高亮
    - 使用 PrismJs 实现自定义代码高亮
    - [CDN部署](https://cdn.jsdelivr.net/npm/prismjs@1/components/)
    ```html
    <head>
        <!-- 代码高亮配置 更改代码块外框 添加行号 -->
        <link rel="stylesheet" href="/js/code-highlight/prism.css">
        <style type = "text/css">
            .markdown-section pre > code {padding: 5px;}
        </style>
    </head>
    <body>
        <!-- 支持脚本 -->
        <script src="js/docsify-prism.js"></script>
        <!--自行导入的支持语言类型-->
        <script src="js/code-highlight/bash.js"></script>
        <script src="js/code-highlight/c.js"></script>
        <script src="js/code-highlight/cpp.js"></script>
        <script src="js/code-highlight/csharp.js"></script>
        <script src="js/code-highlight/css.js"></script>
        <script src="js/code-highlight/fsharp.js"></script>
        <script src="js/code-highlight/git.js"></script>
        <script src="js/code-highlight/go.js"></script>
        <script src="js/code-highlight/json.js"></script>
        <script src="js/code-highlight/java.js"></script>
        <script src="js/code-highlight/javascript.js"></script>
        <script src="js/code-highlight/latex.js"></script>
        <script src="js/code-highlight/lua.js"></script>
        <script src="js/code-highlight/matlab.js"></script>
        <script src="js/code-highlight/nginx.js"></script>
        <script src="js/code-highlight/python.js"></script>
        <script src="js/code-highlight/rust.js"></script>
        <script src="js/code-highlight/shell.js"></script>
        <script src="js/code-highlight/sql.js"></script>
        <script src="js/code-highlight/typescript.js"></script>
        <script src="js/code-highlight/unrealscript.js"></script>
        <script src="js/code-highlight/xml.js"></script>
        <script src="js/code-highlight/yaml.js"></script>
    </body>
    ```
- 代码块右上角复制按钮
    ```html
    <body>
        <script src="/js/docsify-copy-dode.js"></script>
    </body>
    ```
- 最后编辑时间
    ```html
    <body>
        <script src="js/time-update.js"></script>
    </body>
    ```
- 显示当前文章字数
    ```html
    <body>
        <script src="js/countable.min.js"></script>
    </body>
    ```
- 侧边栏折叠
    ```html
    <body>
        <script src="js/docsify-sidebar-collapse/docsify-sidebar-collapse.js"></script>
    </body>
    ```
- 分章节按钮
    ```html
    <body>
        <script src="/js/docsify-pagination.min.js"></script>
    </body>
    ```
- 返回顶部按钮
    - [GitHub仓库](https://github.com/Sumsung524/docsify-backTop/tree/master)
    ```html
    <body>
        <script src="js/docsify-backTop.min.js"></script>
    </body>
    ```

## 未使用插件
- [docsify-tabs: 分页标签](https://jhildenbiddle.github.io/docsify-tabs/#/)
- [docsify-pdf-embed: 提供对PDF格式的显示](https://github.com/lazypanda10117/docsify-pdf-embed)
- [docsify-progress: 进度条插件](github.com/HerbertHe/docsify-progress)
    - 与字数显示冲突
- [docsify-commento: 接入commento实现评论区](https://github.com/ndom91/docsify-commento)
- [docsify-livere: 接入livere实现评论区](https://github.com/TaQini/docsify-livere)
- [docsify-changelog: 显示更新日志](https://github.com/Plugin-contrib/docsify-plugin/tree/master/packages/docsify-changelog-plugin)
- [docsify-top-banner: 横幅显示](https://github.com/Plugin-contrib/docsify-plugin/tree/master/packages/docsify-top-banner-plugin)
- [docsify-sidebar-footer: 侧边栏页脚（用于条款声明）](https://github.com/markbattistella/docsify-sidebar-footer)
- [scroll-to-top(滚动到页面顶部) / custom-footer(自定义页脚)](https://gitee.com/zhangx_study/docsify-plugins#custom-footer)

## 参考内容：
- [Docsify 官方站点](https://docsify.js.org/#/)
- [博客园文章: Docsify | 轻量级无静态构建文档站点生成器](https://www.leavescn.com/Articles/Content/3397)
