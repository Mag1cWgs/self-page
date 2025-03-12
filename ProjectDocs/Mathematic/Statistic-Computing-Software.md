# 日常作业

## 第一次作业

### 题干
1. 运行如下程序：
    ```R
    x <- rnorm(100,mean = 5,sd = 0.1)
    mean( x )
    sd ( x )
    summary( x )
    ```

2. 运行教材 4.4.1 之 2.二项分布模拟中心极限定理的程序，并设置不同的n值，分析其结果
    ```R
    m=100
    n=10;p=0.25
    z=rbinom(m,n,p)
    x=(z-n*p)/sqrt(n*p*(1-p))
    hist(x,prob=T,main=paste("n=",n))
    curve(dnorm(x),add=T)
    ```


### 解答
1. 运行结果
    ```R
    # 运行结果
    >	x <- rnorm(100,mean = 5,sd = 0.1)
    >	mean( x )
    [1]	5.001302
    >	sd ( x )
    [1]	0.1097119
    >	summary( x )
        Min.   1st Qu.  Median    Mean  3rd Qu.   Max. 
    [1]	4.745   4.926    5.021   5.001   5.085   5.281
    ```
2.  结果表格
    | N 值 | 对应图像 |
    |------|---------|
    | 5 | <div align="center"><img src='/ProjectDocs/Mathematic/image/Static-Computing-Software/2.26/2_26_3_Homework_n5.png' width=60%></div>
    | 10 | <div align="center"><img src='/ProjectDocs/Mathematic/image/Static-Computing-Software/2.26/2_26_3_Homework_n10.png' width=60%></div>
    | 5000 | <div align="center"><img src='/ProjectDocs/Mathematic/image/Static-Computing-Software/2.26/2_26_3_Homework_n5000.png' width=60%></div>
    | 100000 | <div align="center"><img src='/ProjectDocs/Mathematic/image/Static-Computing-Software/2.26/2_26_3_Homework_n100000.png' width=60%></div>



---



## 第二次作业

### 题干
1. $\{a_n\}$ 是一个首项为1，公差为3，项数为100的等差数列，$\{b_n\}$ 是一个首项为20，公差为 -1，项数为100的等差数列，求数列 $\{a_n b_n\}$ 的前 $n$ 项和、最大的项以及项数。

2. 若 $\{a_n\}$ 是一个首项为1，公差为3的等差数列，$c_n = a_n^2 + \frac{1}{n}$，求该数列前200项之和以及第200项的值。

### 解答




---



## 第三次作业

### 题干
1. 研究教材56页（章节4.1.2）由均匀分布随机数经变换产生标准正态分布随机数的方法：
    - 模拟图4-2的随机数生成及绘图效果
    - 比较不同的n值情形下，理论分布与经验分布之间的差异程度

2. 根据教材60页（章节4.1.5）中表4-1和表4-2：
    - 应用自己学号的后两位做随机数的种子，分别生成50个以上的贝塔分布、伽玛分布、威布尔分布的随机数
    - 参数自由设定
    - 比较理论分布与样本经验分布之间的差异程度

### 答案

### 涉及知识

使用 `runif(n,  min=0,  max=1)` 生成均匀分布平均数

假设 $U_1$ 和 $U_2$ 是 $[0,1]$ 上均匀分布随机数，做如下变换
$$
X_1=\sqrt{-2\log{\left(U_1\right)}}\cos{\left(2\pi U_2\right)},X_2=\sqrt{-2\log{\left(U_1\right)}}\sin{\left(2\pi U_2\right)}
$$
这样得到的随机数独立同分布于 $N\left(0,1\right)$。



---



## 第四次作业

### 题干
1. 逆函数方法；  
以下是三参数的指数威布尔分布的密度函数，请自行设定三个参数的取值，用逆函数随机数生成方法生成1000个随机数，并作出散点图.
$$
f(t;\alpha,\beta,\sigma) = 
\frac{\alpha\beta}{\sigma} 
\cdot (\frac{t}{\sigma})^{\beta-1} 
\cdot {exp}(-(\frac{t}{\sigma})^\beta)
\cdot (1-{exp}{(\frac{t}{\sigma})^\beta})^{\alpha-1},
\;t>0	
$$

2. 次序抽样方法：  
设 $X_1，X_2，\dots，X_2024$ 是独立同分布，且均值为2，方差为9的正态分布随机变量，记 $X_{(1)}=min{X_1，X_2，\dots，X_{(2024)}}，X_{2024}=max{X_1，X_2，、\dots，X_{2024}}$，请生成1000个服从 $X_{(1)}$ 和 $X_{(2024)}$ 分布的随机数，并作出散点图.

### 解答

