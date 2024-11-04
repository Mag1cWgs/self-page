# LaTex 笔记
> [!note|label:插件支持]
> [KaTeX](https://github.com/KaTeX/KaTeX)  
> [docsify-latex](https://scruel.github.io/docsify-latex/#/?id=usage)  
 


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
通过Markdown按照下面的语法：
```math
x=\frac{-b\pm\sqrt{b^2-4ac}}{2a}
```

就自动渲染出数学公式：
 
$$  
 f(x)=\dfrac{1}{2}  
$$  
 
如果要内嵌KaTeX公式，可以用这样的Markdown语法：  
内嵌的Katex效果 $E=mc^2$ 就是这样
```latex
    内嵌的Katex效果 $E=mc^2$ 就是这样
```


