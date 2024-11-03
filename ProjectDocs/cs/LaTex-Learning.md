# LaTex 笔记
> [KaTeX](https://github.com/KaTeX/KaTeX)
> [docsify-katex](https://github.com/upupming/docsify-katex)


## 数学公式输入

### 行内公式
行内公式通常使用$..$来输入，这通常被称为公式环境，例如：  
若$a>0$, $b>0$, 则$a+b>0$.
```tex
若$a>0$, $b>0$, 则$a+b>0$.
```
公式环境通常使用特殊的字体，并且默认为斜体。需要注意的是，只要是公式，就需要放入公式环境中。如果需要在行内公式中展现出行间公式的效果，可以在前面加入```\displaystyle```，例如
设$\displaystyle\lim_{n\to\infty}x_n=x$.
```tex
设$\displaystyle\lim_{n\to\infty}x_n=x$.
```
### 行间公式


## KaTex语法

KaTeX就是这样一个支持HTML的轻量级的数学公式引擎，它由Khan Academy开发，使用起来也非常简单。

第一步，引入KaTeX的JS代码与CSS样式：
```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.10.1/dist/katex.min.css">
<script defer src="https://cdn.jsdelivr.net/npm/katex@0.10.1/dist/katex.min.js"></script>
```

第二步，通过一个简单的JS调用就可以正确渲染出数学公式：

katex.render("x=\\frac{-b\\pm\\sqrt{b^2-4ac}}{2a}", document.getElementById("math"));  

使用JavaScript手动渲染还是稍微麻烦了一点，最好是通过Markdown按照下面的语法：
```math
x=\frac{-b\pm\sqrt{b^2-4ac}}{2a}
```

就自动渲染出数学公式：
 
$$  
 f(x)=\dfrac{1}{2}  
$$  
 
如果要内嵌KaTeX公式，可以用这样的Markdown语法：

内嵌的Katex效果 $`E=mc^2`$ 就是这样

通过一点点JavaScript的代码，很容易实现自动渲染。


## 其他

放<head>中的情况：脚本会优先加载，但加载过程中，<body>还没加载完，会使脚本访问不到<body>中的元素。
放<body>底部：脚本在<body>加载后加载，能够保证脚本有效地访问<body>的元素。



html渲染执行的顺序为从上到下的一个执行顺序，首先第一步执行head中的内容，如果有外联样式，则下载外联样式，如果有script标签，那么浏览器的渲染引擎则停止，交给JavaScript引擎执行，执行完毕之后将权力交给浏览器渲染。执行完head中的内容之后再执行body中的内容，遇到script标签则停止渲染，再次将执行权交给JavaScript引擎，head中样式在下载完毕后会重新渲染html的所有内容。

所以从上面可以看出，在head中使用script标签可能会导致DOM元素还没有加载，在script中就获取了DOM元素，那么就会出现获取不到元素的情况，如果是在body底部加载的话，那么此时的DOM元素已经全部渲染完毕，可以正常获取DOM元素。


