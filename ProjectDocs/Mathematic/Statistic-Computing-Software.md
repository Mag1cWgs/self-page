# 日常作业

## 第一次作业 
1. 运行如下程序，并将结果保存到一个word文档中。
    - 题目源码
        ```R
        x <- rnorm(100,mean = 5,sd = 0.1)
        mean( x )
        sd ( x )
        summary( x )
        ```
    - 运行结果
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

2. 运行教材 4.4.1 之 2.二项分布模拟中心极限定理的程序，并设置不同的n值，分析其结果
    ```R
    m=100
    n=10;p=0.25
    z=rbinom(m,n,p)
    x=(z-n*p)/sqrt(n*p*(1-p))
    hist(x,prob=T,main=paste("n=",n))
    curve(dnorm(x),add=T)
    ```
    | N 值 | 对应图像 |
    |------|---------|
    | 5 | <div align="center"><img src='/ProjectDocs/Mathematic/image/Static-Computing-Software/2.26/2_26_3_Homework_n5.png' width=60%></div>
    | 10 | <div align="center"><img src='/ProjectDocs/Mathematic/image/Static-Computing-Software/2.26/2_26_3_Homework_n10.png' width=60%></div>
    | 5000 | <div align="center"><img src='/ProjectDocs/Mathematic/image/Static-Computing-Software/2.26/2_26_3_Homework_n5000.png' width=60%></div>
    | 100000 | <div align="center"><img src='/ProjectDocs/Mathematic/image/Static-Computing-Software/2.26/2_26_3_Homework_n100000.png' width=60%></div>

## 第二次作业

## 第三次作业

## 第四次作业

使用 `runif(n,  min=0,  max=1)` 生成均匀分布平均数

假设 $U_1$ 和 $U_2$ 是 $[0,1]$ 上均匀分布随机数，做如下变换
$$
X_1=\sqrt{-2\log{\left(U_1\right)}}\cos{\left(2\pi U_2\right)},X_2=\sqrt{-2\log{\left(U_1\right)}}\sin{\left(2\pi U_2\right)}
$$
这样得到的随机数独立同分布于 $N\left(0,1\right)$。


