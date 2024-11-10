# 消费者选择 Consumer choice


---



## 4.1 边际效用分析
> 效用、边际效用、总效用  
> 消费者均衡的条件  
> 需求曲线的推导  
> 消费者剩余  

1. **消费行为**：
    - **定义**：消费行为是指消费者为满足自己的欲望而购买、使用商品的一种经济行为。
    - **目的**：消费者消费商品是为了获取效用.
2. **效用理论分类**：
    1. **基数效用理论**：  
        认为效用可以用基数1，2，3，4...加以测量并加总求和，
        采用**边际效用分析法**，阐述消费者均衡条件，推导单个消费者的需求曲线。
    2. **序数效用理论**：  
        认为效用不可能用1，2，3，4...加以测量，只能排序，
        采用**无差异曲线分析法**，阐述消费者均衡条件，推导单个消费者的需求曲线。



---



### 4.1.1 边际效用递减规律

#### 1. 效用：
1. **定义**：是消费者消费某种商品或劳务而得到的满足感。
    - 满足程度高 —— 效用就大
    - 满足程度低 —— 效用就小
    - 感到不适、不愉快或痛苦 —— 负效用
2. **来源**：
    - 商品本身的有用性或使用价值
    - 商品或劳务满足消费者欲望能力的主观心理感受或评价
3. **标准**：因人、因时、因地而异
> [!note]
> 在讨论一种商品的消费是否对消费者有效用时，经济学并不考虑其本身的价值判断问题。

#### 2. 基数效用理论：
1. 效用是可以计量的
2. 效用的计量单位 —— 效用单位
3. 效用函数的**公式**：
    - 消费者消费某种商品的消费量记为 $Q$
    - 该消费者消费该商品所获得的效用量 $U$
    $$
        U = 
    \begin{cases}
        f(Q) \; , \;  \text{计算单个商品的效用;}    \\
        f(Q_1,Q_2) \;  , \;  \text{计算两个商品的效用;}  \\
        f(Q_1,Q_2,...,Q_n) \; , \;  \text{计算n个商品的效用.}
    \end{cases}
    \label{define-4-1} \tag{def 4-1}
    $$

#### 3. 总效用 $TU$ 与边际效用 $MU$  
1. **总效用 $TU$ ：**
    - **定义**：消费者消费一定量某种物品或一定组合的物品所得到的总满足感。
    $$
        TU = 
    \begin{cases}
        U(X) \; , \;  \text{消费者消费一种商品x，对应消费量X;}    \\
        U(X,Y) \;  , \;  \text{消费者消费商品(x,y)，对应消费量(X,Y).}
    \end{cases}
    \label{define-4-2} \tag{def 4-2}
    $$
    - **常用的总效用函数**：
        - $ TU = f(X)+g(Y) $
        - $ TU = AX^\alpha Y^\beta$
2. **边际效用 $MU$ ：**
    1. **定义**：指从额外一单位(最后一单位)某种商品的消费中所获得的额外的效用(或满足感)。
    2. 例：对某商品有如下表格  
        消费量 $Q$ | 总效用 $TU$ 
        -----|-----
        3 | 9
        4 | 10
    
    则有 $ MU = 10 - 9 = 1 $
    3. **分类**：
        1. 消费**不连续**
        $$
            MU_x = \frac{\Delta TU}{\Delta X}
        \label{define-4-3-1} \tag{def 4-3-1}
        $$
        2. 消费**连续**
        $$
            MU_y = \lim_{\Delta x \to 0}{\frac{\Delta TU}{\Delta X}} = \frac{dTU}{dX}
        \label{define-4-3-2} \tag{def 4-3-2}
        $$
        3. 消费**多种**商品：  
        一般为 $TU$ 公式中**各变量的一阶偏导**，例如对 $ TU = A X^\alpha Y^\beta $ ，则：
        $$
            MU_x = \frac{\partial TU}{\partial X} \qquad
            MU_y = \frac{\partial TU}{\partial Y}
        \label{define-4-3-3} \tag{def 4-3-3}
        $$
3. **总效用 $TU$ 与边际效用 $MU$ 关系**  
    - 例：  
        对某商品作总效用与边际效用表：
        消费数量 $Q$ | 总效用 | 边际效用
        ------------|--------|--------
        1 | 10 | 10
        2 | 16 | 6
        3 | 19 | 3
        4 | 20 | 1
        5 | 20 | 0
        6 | 18 | -2

    <div  align="center">    
    <img src="/ProjectDocs/MicroEconomic/image/chap4/4-1-1.png" width = 40%>
    </div>

#### 4. 边际效用递减规律
1. **定义**：  
    在其它条件不变的情况下，消费者连续消费某种商品的边际效用，将随其消费量的增加而不断减小。
2. **意义**：
    1. 数学上：$ dTU / dX > 0 $ 且 $ d^2TU / dX^2 < 0 $
    2. 经济学上：
        - 随着消费量的增加，边际效用减小；
        - 随着消费量的增加，边际效用的减小量越来越小。
3. **原理**：  
在一定时间内，随着消费数量和次数的增加，欲望获得的满足最终会达到饱和状态，欲望也减弱到最低限度。
4. **规律**：
    - 边际效用的大小与欲望的强弱成正比；
    - 边际效用具有时间性。
5. **意义**：
    - 根据边际效用递减规律，边际效用随着商品消费量的增加，不断递减，甚至减为负值。
    - 在实际中，边际效用不会为零或负值。
        - 边际效用曲线向右下方倾斜会无限接近于横轴，但不会交于横轴。
        - 微观经济学假设：消费者是理性的追求总效用最大化。
        - 边际效用接近于零，消费者将不再增加消费量。

### 4.1.2 消费者均衡与需求曲线推导
#### 1. 消费者均衡
1. **定义**：所谓消费者均衡，是指消费者在收入和商品价格既定的条件下作出**实现效用最大化**的消费选择。
2. **无约束消费者均衡**：
    1. 在数学上是一个自由极值问题，即**无约束的最优化**。
    2. 消费**一种商品**：  
        当总效用函数为 $\ref{define-4-2}$ 中的 $ TU = U(X) $ ，实现总效用最大化需要：
        - 必要条件：
        $$
            MU_x = \frac{dTU}{dX} = 0
        \label{condition-4-1-1} \tag{Cond 4-1-1}
        $$
        - 充分条件
        $$
            \frac{dMU_x}{dX} = \frac{d^2TU}{dX^2} < 0
        \label{condition-4-1-2} \tag{Cond 4-1-2}
        $$
    3. 消费**多种商品**：  
        当总效用函数为 $\ref{define-4-2}$ 中的 $ TU = U(X,Y) $ ，实现总效用最大化需要：
        - 必要条件
        $$
            \frac{\partial TU}{\partial X} = 0 \qquad
            \frac{\partial TU}{\partial Y} = 0
        \label{condition-4-2-1} \tag{Cond 4-2-1}
        $$
        - 充分条件
        $$
            \frac{\partial ^2 TU}{\partial X ^2} = 0 \qquad
            \frac{\partial ^2 TU}{\partial Y ^2} = 0
        \label{condition-4-2-2} \tag{Cond 4-2-2}
        $$
3. **有约束消费者均衡**
    1. 面临约束条件：
        - 有限的收入及商品、劳务的市场价格
        - 商品的边际效用
    2. 受到边际效用递减规律影响：
        - 多买则边际效用下降
        - 少买则边际效用提高
    3. 考虑主要因素：**价格**、**边际效用**。

#### 2. 消费者均衡的条件
1. 基数效用论中消费者均衡的**基本条件**：
$$
    \frac{MU_x}{P_x} = \frac{MU_y}{P_y}
    \label{condition-4-3} \tag{Cond 4-3}
$$
2. **消费者均衡的条件**：
    - 消费者的既定收入 $M$ ，全部用来购买 $x$ 和 $y$ 两种商品；
        - 用 $P_x$ 和 $P_y$ 分别表示两种商品的价格；
        - 用 $X$ 和 $Y$ 分别表示两种商品的数量。
        - 则有**约束条件**： 
        $$
            M = P_x X + P_yY 
        \label{condition-4-3-1} \tag{Cond 4-3-1}
        $$
    - 若用 $MU_x$ 、 $MU_y$ 分别表示两种商品的边际效用
        - 并用 $\lambda$ 表示单位货币的边际效用
        - 则由 $\ref{condition-4-3}$ 有**实现条件**：
        $$
            \frac{MU_x}{P_x} = \frac{MU_y}{P_y} = \lambda
        \label{condition-4-3-2} \tag{Cond 4-3-2}
        $$
3. **条件分析与解释**:
    1. 若有 $ \frac{MU_x}{P_x} > \frac{MU_y}{P_y} $ ，理性消费者会增加对 $x$ 商品购买，减少对 $y$ 商品的购买。
        - $x$ 商品消费量↑ 边际效用↓
        - $y$ 商品消费量↓ 边际效用↑
    2. 若有 $ \frac{MU_x}{P_x} < \frac{MU_y}{P_y} $ ，理性消费者会减少对 $x$ 商品购买，增加对 $y$ 商品的购买。
        - $x$ 商品消费量↓ 边际效用↑
        - $y$ 商品消费量↑ 边际效用↓
    3. $x$ 商品的边际效用 $MU_x$ 与其价格 $P_x$ 之比**不等于** $y$ 商品的边际效用 $MU_y$ 与其价格 $P_y$ 之比时，消费者**没有实现总效用最大**。
4. **消费者均衡的数学解**：  
根据消费者的目标函数 $\ref{define-4-2}$ 和约束条件 $\ref{condition-4-3-1}$，构建 $Lagrange$ 函数：
$$
    L = TU(X,Y) + \lambda (M - P_xX-P_yY)
    \label{condition-4-4-0}
$$
- 总效用 $TU(X,Y)$ 最大化的必要条件：
$$
\begin{cases}
    {L'}_X = U'_X - \lambda P_x = 0 \\
    {L'}_Y = U'_Y - \lambda P_y = 0 \\
    {L'}_{\lambda} = M - P_xX - P_yY = 0
\end{cases}
\label{condition-4-4-1} \tag{Cond 4-4-1}
$$

- 若用 ${L'}_X$ 表示 $L$ 对 $X$ 的偏导，用 ${L'}_Y$ 表示对 $Y$ 的偏导，则有实现条件：
$$
    \frac{{L'}_X}{{L'}_Y} = \frac{P_x}{P_y} = \frac{MU_x}{MU_y}
\label{condition-4-4-2} \tag{Cond 4-4-2}
$$

#### 3. 需求曲线推导
1. **商品的需求价格**
    1. **定义**：指消费者在一定时期内对一定量的某种商品**所愿意支付**的价格。
    2. **影响因素**：其边际效应的大小。
        - 边际效用 $MU$ 高，商品需求价格 $P_D$ 高；
        - 边际效用 $MU$ 低，商品需求价格 $P_D$ 低。
2. 受边际效应递减规律影响，需求曲线向右下角倾斜。
3. 推导：
    - 假定货币的边际效用 $\lambda$ 固定不变
    - 则由上述公式及假定：
        - 当 $\lambda = 1$ 时，有 $MU$ 曲线与 $D(P)$ 曲线重合
        - 当 $\lambda > 1$ 时，由 $\ref{condition-4-3-2}$ 知，$ MU > \lambda P $ 即曲线 $D(P)$ 高于 $MU$ ，但总体趋势一致。
        - 当 $\lambda < 1$ 时同理有相应规律（略）。
    <div  align="center">    
    <img src="/ProjectDocs/MicroEconomic/image/chap4/4-1-2.png" width = 40%>
    </div>

### 4.1.3 消费者剩余
#### 1. 消费者剩余
1. 消费者对同种商品的不同数量**愿意支付的价格**不同
    - 商品数量较少，边际效用高，愿意支付高的价格
    - 商品数量较多，边际效用低，愿意支付低的价格
2. **消费者剩余**:
    1. **定义**：消费者愿意支付的价格总额减去实际支付的价格总额的差额。
    2. **意义**：消费者主观上的收益。
    3. **公式**：
    $$
        D_k = \int_{0}^{Q_k}P_D(t)dt - P_k \times Q_k
    \label{define-4-4} \tag{def 4-4}
    $$
3. 消费者剩余的**图线**：
    对某商品的需求图线：
    <div  align="center">    
    <img src="/ProjectDocs/MicroEconomic/image/chap4/4-1-3.png" width = 40%>
    </div>
    - 当价格为 $P_1$ 、需求量为 $Q_1$ 时：
    $$
    \begin{align}
        \text{消费者剩余} &= \text{愿意支付}- \text{实际支付} \notag \\
        D_1 &= \int_{0}^{Q_1}P_D(t)dt - P_1 \times Q_1 \notag \\
        D_1 &= S_{ABQ_1O}-S_{P_1BQ_1O} \notag
    \end{align} 
    $$
    <div  align="center">    
    <img src="/ProjectDocs/MicroEconomic/image/chap4/4-1-4.png" width = 40%>
    </div>
    - 当价格为 $P_2$ 、需求量为 $Q_2$ 时：
    $$ D_2 = S_{ACQ_2O}-S_{P_2CQ_2O} $$
    <div  align="center">    
    <img src="/ProjectDocs/MicroEconomic/image/chap4/4-1-5.png" width = 40%>
    </div>
4. 消费者剩余的**变动**
    - 价格下降使消费者剩余增加  
        如上例
        $$ \text{消费者剩余变化量}\Delta D = \lvert D_1 - D_2 \rvert $$
        <div  align="center">    
        <img src="/ProjectDocs/MicroEconomic/image/chap4/4-1-6.png" width = 40%>
        </div>

#### 2. 生产者剩余
1. **生产者剩余**:  
    指生产者得到的价格总额超过其支付总成本的差额。
2. **公式**：
$$
    S_k = P_k \times Q_k - \int_{0}^{Q_k}P_S(t)dt
\label{define-4-5} \tag{def 4-5}
$$
3. **与消费者剩余关系**：
<div  align="center">    
<img src="/ProjectDocs/MicroEconomic/image/chap4/4-1-7.png" width = 60%>
</div>



---



## 4.2 无差异曲线分析
> 消费者偏好及其三个公理  
> 无差异曲线  
> 消费者预算线与消费者均衡  
> 需求曲线和恩格尔曲线的推导  
> 正常商品、低档商品和吉芬商品的收入效应、替代效应分析

### 4.2.1 偏好及三大公理

#### 1.偏好、序数效用理论
1. 偏好
    1. **定义**：指消费者对某种商品的喜好或嗜好。
    2. **影响**：消费者的偏好是决定消费者行为的最重要的因素
2. 序数效应理论：
    1. 提出者：帕累托 →希克斯
    2. **观点**：效用无法测量，但可以根据消费者偏好以序数词第一，第二，第三...来排序。

#### 2. 偏好的三个公理
1. **完备性**：消费者能对不同的商品或商品组合按照自身偏好排序。
2. **传递性**：偏好在逻辑上的一致性。
3. **非饱和性**：消费者总是偏好数量较多的一组商品。
    - $MU>0$ ，而消费者追求 $\max TU $ 


### 4.2.2 无差异曲线的特征
> [!note|label:理解]
> 无差异曲线：同一曲线上两种商品的总效用一定，对应购买偏好  
> 即 $TU_{I(X,Y)} = TU_x+TU_y$ ，也即 $\Delta TU_x = \Delta TU_y$

1. **例子**  
    <div  align="center">    
    <img src="/ProjectDocs/MicroEconomic/image/chap4/4-2-1.png" width = 60%>
    </div>
2. **无差异曲线**：
    1. **定义**： 能给消费者带来**相同总效用**的两种商品的**不同数量组合**的连线。
    2. 一个消费者不只有一条无差异曲线，而是有**一组无差异曲线**，构成“无差异曲线图”
        - 对下图中各曲线上效用水平相同，而各曲线间效用水平不同。
    <div  align="center">    
    <img src="/ProjectDocs/MicroEconomic/image/chap4/4-2-2.png" width = 40%>
    </div>
3. **特征**
    1. 无差异曲线向右下方倾斜（**斜率为负**）
        - 同等效用水平下，消费者消费更多的某种商品，就需要减少另一种商品的消费量
        - 维持同等效用水平下，两商品具有替代性
    2. 离原点越远的无差异曲线代表的总效用水平越高
        - 对上例有 $I_3 > I_2 > I_1$
        - 偏好的非饱和性
    3. 任何两条无差异曲线都不相交
    4. 无差异曲线凸向原点（斜率的绝对值递减）
4. **商品边际替代率**：  
    1. 保持总效用水平不变的条件下，增加一单位某种商品消费所**必须放弃**的另一商品的消费数量。
    2. **公式**： 
        $$
            MRS_{xy} = - \frac{\Delta Y}{\Delta X}
        \label{define-4-6} \tag{def 4-6}
        $$
    3. **商品的边际替代率，即无差异曲线的斜率的绝对值。**
    <div  align="center">    
    <img src="/ProjectDocs/MicroEconomic/image/chap4/4-2-3.png" width = 40%>
    </div>
    4. **商品的边际替代率递减**规律：
        - 有 $ \Delta TU_x = \Delta TU_y $
            - 即 $ \Delta X \cdot MU_x = - \Delta Y \cdot MU_y $ 
            - 也即 $ - \Delta Y / \Delta X = MU_x / MU_y $
        - 则 $MRS_{xy} = - \Delta Y / \Delta X = MU_x / MU_y $
5. 特殊情况下的**特殊无差异曲线**
    1. **完全替代品**：
        - 原理：两种商品的替代比率固定不变，相应边界替代率 $ MRS_{xy} $ 为常数。
        - 相应无差异曲线为直线
        - 例子：对下例有 $ MRS_{xy} = 1 $
        <div  align="center">    
        <img src="/ProjectDocs/MicroEconomic/image/chap4/4-2-4.png" width = 60%>
        </div>
    2. 完全互补品:
        - 按照固定比率同时使用两种商品
        - 相应无差异曲线为直角线
        - 例子：对下例有 $ MRS_{xy} = \infty $
        <div  align="center">    
        <img src="/ProjectDocs/MicroEconomic/image/chap4/4-2-5.png" width = 60%>
        </div>


### 4.2.3 消费预算线与消费者均衡
#### 1. 消费预算线
> 对应购买能力

1. 条件：
    - 商品价格既定
    - 货币收入有限
2. 推导：
    - 假设消费者的货币收入为 $M$，要购买两种商品 $x$ 和 $y$ 
        - 其价格分别为 $P_x$ 和 $P_y$ 
        - 其数量分别为 $X$ 和 $Y$ 
    - 则消费者的**预算约束**为:
    $$
        P_x X + P_y Y \le M \quad (X \ge 0 , \,Y \ge 0)
    \label{condition-4-5} \tag{Cond 4-5}
    $$
    <div  align="center">    
    <img src="/ProjectDocs/MicroEconomic/image/chap4/4-2-6.png" width = 60%>
    </div>
3. 消费预算线
    1. **定义**：在收入和商品价格既定的条件下，消费者能够购买到的两种商品最大数量组合的连线。
    2. **方程**：
        $$
            M = P_x X + P_y Y
        \label{condition-4-6} \tag{Cond 4-6}
        $$
    3. **图示**：
    <div  align="center">    
    <img src="/ProjectDocs/MicroEconomic/image/chap4/4-2-7.png" width = 40%>
    </div>
4. 消费预算线的变动
    1. 消费者的收入发生变化：
        - 收入增加时，消费预算线平行外移
        - 收入减少时，消费预算线平行内移
        <div  align="center">    
        <img src="/ProjectDocs/MicroEconomic/image/chap4/4-2-8.png" width = 40%>
        </div>
    2. 一种商品价格变化：
        - 商品价格在 X 上的变化
            - 商品价格上升，消费预算线将以其 Y 轴交点作为轴心顺时针旋转
            - 商品价格下降，消费预算线将以其 Y 轴交点作为轴心逆时针旋转
        - 商品价格在 Y 上的变化
            - 商品价格上升，消费预算线将以其 X 轴交点作为轴心顺逆时针旋转
            - 商品价格下降，消费预算线将以其 X 轴交点作为轴心顺时针旋转
        <div  align="center">    
        <img src="/ProjectDocs/MicroEconomic/image/chap4/4-2-9.png" width = 40%>
        <img src="/ProjectDocs/MicroEconomic/image/chap4/4-2-10.png" width = 40%>
        </div>
    3. 其他变化：
        1) 消费者的收入和所有商品的价格按**同比例同方向**发生变化消费预算线的**位置不变**。
        2) 消费者的收入和所有商品的价格按**同比例不同方向**发生变化消费预算线会**平行移动**。
        3) 消费者的收入和所有商品的价格按**不同比例同一方向**或**不同比例不同方向**发生变化，消费预算线的变动取决于收入与商品价格及两种商品价格间的相对变化率。

#### 2. 消费者偏好
1. 对下图中例子：
    <div  align="center">    
    <img src="/ProjectDocs/MicroEconomic/image/chap4/4-2-11.png" width = 40%>
    </div>
    - E 点即为消费者均衡点
    - 点G、点F为效用水平对应无差异曲线 $I_1$ 时，所能达到的两种组合，但是效应水平均小于E点对应的 $I_2$
2. **均衡点的特征**:
    - 无差异曲线与消费预算线相切
    - 无差异曲线斜率 $-\Delta Y/\Delta X$ 与消费预算线斜率 $-P_x/P_y$ **相等**
    $$
        MRS_{xy} = \frac{MU_x}{MU_y} 
        = - \frac{\Delta Y}{\Delta X} = \lvert k \rvert 
        = \frac{P_x}{P_y}
    $$
    即：
    $$
        \frac{MU_x}{MU_y} = \frac{P_x}{P_y} 
        \quad \text{或} \quad 
        \frac{MU_x}{P_x} = \frac{MU_y}{P_y}
    \label{condition-4-7} \tag{Cond 4-7}
    $$


### 4.2.4 需求曲线与恩格尔曲线的推导

#### 1. 需求曲线的推导
1. **商品价格 $P(X_k)$ 变化**：
    1. 商品x价格从 $P(X_0)$ 上升到 $P(X_1)$
        - 对应消费预算线从 $AB_0$ 顺时针旋转到 $AB_1$
        - 对应均衡点从 $E_0$ 转换到 $E_1$
        - 对x的需求量从 $X_0$ 减少到 $X_1$
        - 相应对y的需求量从 $Y_0$ 增加到 $Y_1$
    2. 商品x价格从 $P(X_0)$ 减少到 $P(X_2)$
        - 对应消费预算线从 $AB_0$ 逆时针旋转到 $AB_2$
        - 对应均衡点从 $E_0$ 转换到 $E_2$
        - 对x的需求量从 $X_0$ 增加到 $X_2$
        - 相应对y的需求量从 $Y_0$ 减少到 $Y_2$
    3. 连接 $E_1 \, E_2 \, E_3$ ，形成连续曲线。
    <div  align="center">    
    <img src="/ProjectDocs/MicroEconomic/image/chap4/4-2-12.png" width = 70%>
    </div>
2. **价格消费曲线PCC**:  
    表示某一商品价格变化对消费者均衡的影响。
3. **需求曲线**：
    - 将价格消费曲线上每一点对应价格 $P(X_k)$ 与其需求量 $X_k$ 建立直角坐标系得出
    - 对上例为：
    <div  align="center">    
    <img src="/ProjectDocs/MicroEconomic/image/chap4/4-2-13.png" width = 60%>
    </div>
4. 两种效用理论推导需求曲线的比较
    - 基数效用论：在效用可度量和边际效用递减规律假定的条件下推导出需求曲线；
    - 序数效用理论：在效用水平可根据偏好假定的条件下，用商品的边际替代率递减规律推导出需求曲线。

#### 2. 恩格尔曲线的推导
1. **收入水平 $M$ 变化**：
    <div  align="center">    
    <img src="/ProjectDocs/MicroEconomic/image/chap4/4-2-14.png" width = 60%>
    </div>
2. **收入消费曲线ICC**:  
    表示收入变化对消费者均衡的影响。
3. **恩格尔曲线(EC)**:  
    表明消费者的货币收入与某种商品需求量之间关系的曲线，也称收入需求曲线。
    <div  align="center">    
    <img src="/ProjectDocs/MicroEconomic/image/chap4/4-2-15.png" width = 60%>
    </div>
4. 利用恩格尔曲线分类商品：
    - 恩格尔曲线斜率为正，则为正常商品，即随着收入水平的上升，消费者对这类商品的需求增加。
        - 正常商品还可以分为必需品和高档品。
            - 必需品：$EC_2$ 二阶导数 < 0
            - 高档品：$EC_1$ 二阶导数 > 0
    - 曲线斜率为负则为低档商品$EC_3$ 
    - 吉芬商品对应可变恩格尔曲线
    <div  align="center">    
    <img src="/ProjectDocs/MicroEconomic/image/chap4/4-2-16.png" width = 60%>
    <img src="/ProjectDocs/MicroEconomic/image/chap4/4-2-17.png" width = 60%>
    </div>
5. 恩格尔系数：
    - 食品消费支出占总消费支出的比例
    - 恩格尔系数 = 食品支出总额 ÷ 消费者支出总额
6. 恩格尔定律：
    - 收入少的家庭，恩格尔系数大于0.5;
    - 收入多的家庭，恩格尔系数小于0.5。



---



## 4.3 收入效应与替代效应分析

### 4.3.1 收入效应与替代效应


### 4.3.2 案例：工资变化与劳动供给


