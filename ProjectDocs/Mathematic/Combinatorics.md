# 0-什么是组合数学

- 组合数学研究的是集合中的对象按照特定规则排列成模式的问题。

- 两种一般类型的题目反复出现：

    - 类型1：排列的存在性。
        - 如果希望将集合中的对象进行排列以满足某些条件，那么这样的排列是否可能并不总是显而易见。
        - 这是最基本的问题。
        - 如果这种排列并不总是可能的，那么接下来就该询问在什么条件下（既是必要的也是充分的）可以实现所需的排列。
    
    - 类型2：排列的枚举或分类。
        - 如果一种指定的排列是可能的，那么可能有多种方式来实现它。
        - 如果是这样的话，人们可能想要计算这些方式的数量或者将它们分类成不同的类型。

- 与这些形式相关的另外两个组合数学问题是：

    - 研究已知的排列。
        - 在完成了（可能是困难的）构建满足某些指定条件的排列的工作之后，接下来可以研究其性质和结构。
        - 这些结构可能对分类问题以及潜在的应用有影响。
    
    - 最优排列的构造。
        - 如果存在多种可能的排列，那么人们可能希望确定一个满足某种最优性标准的排列——也就是说，找到某种特定意义上的“最佳”或“最优”排列。

- Combinatorics is concerned with arrangements of the objects of a set into patterns satisfying specified rules.
- Two general types of problems occur repeatedly:

    - Type1 Existence of the arrangement.
        - If one wants to arrange the objects of a set so that certain conditions are fulfilled, it may not be at all obvious whether such an arrangement is possible.
        - This is the most basic of questions.
        - If the arrangement is not always possible, it is then appropriate to ask under what conditions, both necessary andsufficient, the desired arrangement can be achieved.
    
    - Type 2 Enumeration or classification of the arrangement.
        - If a specified arrangement is possible, there may be several ways of achieving it.
        - If so, one may want to count their number or to classify them into types.

- Two other combinatorial problems that occur in conjunction with these forms are the following:

    - Study of a known arrangement.
        - After one has done the (possibly difficult) work of constructing an arrangement satisfying certain specified conditions, its properties and structure can then be investigated.
        - Such structures may have implications for the classification problem and also for potential applications.
    
    - Construction of an optimal arrangement.
        - If more than one arrangement is possible, one may want to determine an arrangement that satisfies some optimality criterion—that is, to find a "best" or "optimal" arrangement in some prescribed sense.

## 例子-国际象棋棋盘的完美覆盖
- 一个国际象棋棋盘被分成8行8列共64个方格。
    - 假设有一批形状完全相同的多米诺骨牌，每块正好能覆盖棋盘上相邻的两个方格。
    - 是否有可能将32块多米诺骨牌排列在棋盘上，使得任意两块多米诺骨牌不重叠，每块多米诺骨牌覆盖两个方格，并且棋盘上的所有方格都被覆盖？
- 我们称这样的排列为多米诺骨牌对国际象棋棋盘的**完美覆盖**。

- **答案：**
    - 这个数字是 Fischer 在 1961 年发现的，为：
    $$ 12,988,816 = 24 \times 17^2 \times 53^2 $$

- **问题：**

    1. 普通的棋盘可以替换为更一般的棋盘，该棋盘被划分为 $m \times n$ 个方格，位于 *m* 行和 *n* 列。现在不一定存在完美覆盖。对于哪些 *m* 和 *n* 值，$m \times n$ 棋盘具有完美覆盖？
        - 一个 $m \times n$ 的棋盘当且仅当至少有一个维度（即*m*或*n*）是偶数时，才会有完美覆盖。换句话说，当且仅当棋盘的总方格数是偶数时，才会存在完美覆盖。

    2. 如果将 8×8 的棋盘切出两个对角线上相对的角上的方格，剩下总共 62 个方格。是否有可能安排 31 个多米诺骨牌以获得这个“修剪”后的棋盘的完美覆盖？
        - 在一个普通的 8×8 棋盘上，通常方格是黑白交替着色的，有 32 个白色方格和 32 个黑色方格。
        - 如果我们切出两个对角线上相对的角上的方格，我们就移除了两个同色的方格，假设是白色。这就剩下了 32 个黑色方格和 30 个白色方格。
        - 但是每个多米诺骨牌会覆盖一个黑色和一个白色方格，因此棋盘上的 31 个不重叠的多米诺骨牌会覆盖 31 个黑色和 31 个白色方格。
        - 我们得出结论，这个“修剪”后的棋盘没有完美覆盖。


**Example: perfect Covers of Chessboards**
- A chessboard which is divided into 64 squares in 8 rows and 8 columns.
    - Suppose there is available a supply of identically shaped dominoes, pieces which cover exactly two adjacent squares of the chessboard.
    - Is it possible to arrange 32 dominoes on the chessboard so that no 2 dominoes overlap, every domino covers 2 squares, and all the squares of the chessboard are covered?
- We call such an arrangement a *perfect cover* of the chessboard by dominoes.

- **Ans.**
    - This number was found by Fischer in 1961 to be
    $$ 12,988,816 = 24 \times 17^2 \times 53^2 $$

- **Questions:**

    1. The ordinary chessboard can be replaced by a more general chessboard divided into $m \times n$ squares lying in *m* rows and *n* columns. A perfect cover need not exist now. For which values of *m* and *n* does the *m-by-n* chessboard have a perfect cover?
        - An $m \times n$ chessboard will have a perfect cover if and only if at least one of *m* and *n* is even or, equivalently, if and only if the number of squares of the chessboard is even.

    2. If the 8-by-8 chessboard is cut out two diagonally opposite corner squares, leaving a total of 62 squares. Is it possible to arrange 31 dominoes to obtain a perfect cover of this "pruned" board?
        - In an ordinary 8-by-8 chessboard, usually the squares are alternately colored black and white, with 32 of the squares colored white and 32 of the squares colored black.
        - If we cut out two diagonally opposite corner squares, we have removed two squares of the same color, say white.
        - This leaves 32 black and 30 white squares.
        - But each domino will cover one black and one white square, so that 31 non-overlapping dominoes on the board cover 31 black and 31 white squares.
        - We conclude that the pruned board has no perfect cover.

## 例子-切割立方体
- 一块立方体形状的木头，边长3英尺。
- 将立方体切成27个小方块，每边1英尺。

- 这需要最少的切割次数来完成？

- **答案：**
    - 中间的立方体每个面都是通过切割形成的。
    - 因为它有6个面，所以至少需要6次切割才能形成它。
    - 因此，总是至少需要6次切割。


**Example. Cutting a cube**
- A block of wood in the shape of a cube, 3 feet on anedge.
- It is desired to cut the cube into 27 smallercubes, 1 foot on an edge.

- What is the smallest number of cuts in which this can be accomplished?

- **Ans:**
    - The cube in the middle has every one of its faces formed by cuts.
    - Since it has 6 faces, 6 cuts are necessary to form it.
    - Thus at least 6 cuts are always necessary.

## 其他例子-幻方-四色猜想-36军官问题-最短路径


---


# 1-排列与组合

## 基本计数原理
- **加法原则**：如果集合 \( S \) 被分成不相交的部分 \( S_1, S_2, \dots, S_m \)，则集合 \( S \) 中的元素数量等于各部分元素数量之和。
- **乘法原则**：如果 \( A \) 是包含 \( p \) 个元素的集合，\( B \) 是包含 \( q \) 个元素的集合，那么有序对 \( (a, b) \) 的数量（其中 \( a \) 来自 \( A \)，\( b \) 来自 \( B \)）为 \( p \times q \)。
- **减法原则**：如果 \( A \) 是全集 \( U \) 的子集，且 \( A^c \) 是 \( A \) 在 \( U \) 中的补集，则 \( |A| = |U| - |A^c| \)。
- **除法原则**：如果有限集合 \( S \) 被分成 \( k \) 个部分，每个部分包含相同数量的元素，则 \( k = \frac{|S|}{\text{每个部分的元素数量}} \)。

## 集合的排列组合
1. **集合的排列**：
    - 对于集合 \( S \) 的 \( r \) 个元素的排列数记为 \( P(n, r) \)。
    - 当 \( r > n \) 时，\( P(n, r) = 0 \)。
    - 对于任何正整数 \( n \)，\( P(n, 1) = n \)；对于任何非负整数 \( n \)，\( P(n, 0) = 1 \)。

2. **集合的组合**：
    - 对于集合 \( S \) 的 \( r \) 个元素的组合数记为 \( C(n, r) \)。
    - 组合数与排列数的关系为 \( P(n, r) = r! \binom{n}{r} \)，其中 \( \binom{n}{r} = \frac{n!}{r!(n-r)!} \)。

3. **重集的排列和组合**：
   - 对于重集，定义了不同类型重集的排列和组合数。


---


# 2-鸽巢原理-PigeOnHole-Principle

## 鸽巢原理
- 基本概念：如果将 \( n+1 \) 个物体放入 \( n \) 个盒子，那么至少有一个盒子包含两个或更多物体。
- 应用示例：
    1. 在13个人中，有两人的生日在同一个月。
    2. 选择 \( 2n \) 人，保证至少有一对夫妻被选中。

## 鸽巢原理的增强形式
- 基本概念：如果将 \( q_1 + q_2 + \ldots + q_n - n + 1 \) 个物体放入 \( n \) 个盒子，那么至少有一个盒子包含至少 \( q_i \) 个物体。
- 证明方法：假设每盒最多放 \( q_i - 1 \) 个物体，通过反证法得出矛盾。

## Ramsey 定理
1. **Ramsey定理**：
    - 基本概念：对于正整数 \( q_1, q_2, \ldots, q_n, t \)，存在一个最小的正整数 \( N(q_1, q_2, \ldots, q_n; t) \)，使得当集合 \( S \) 的任意 \( t \)-元素子集被分配到 \( n \) 个盒子时，要么某个盒子包含 \( q_1 \) 个满足所有子集都在该盒子的物体，要么存在其他情况。
    - Ramsey数：确定这些数是一个难题，目前已知一些上界和下界。

2. **应用实例**：
    - 准备循环赛的棋手：在11周内每天至少下一盘棋，每周不超过12盘，证明存在连续几天共下21盘棋。
    - 从1到200中选择101个数，证明其中有两个数是彼此的倍数。
    - 水果篮问题：用苹果、香蕉和橙子组成一篮水果，确保篮中至少有8个苹果、6个香蕉或9个橙子。
    - 两圆拼合问题：将两圆分别涂色并拼合，证明总能找到一种放置方式使两圆重合部分颜色匹配数量达到100。

3. **其他相关定理**：
    - 中国剩余定理：设 \( m \) 和 \( n \) 互质，任取整数 \( a \) 和 \( b \)，且 \( 0 \leq a \leq m-1 \) 和 \( 0 \leq b \leq n-1 \)，则存在正整数 \( x \) 使得 \( x = a \mod m \) 且 \( x = b \mod n \)。

4. **进一步探讨**：
    - 实数列中的递增或递减子序列：在实数列中，或存在一个递增子序列，或存在一个递减子序列。
    - 图论中的拉姆齐数：在图论中，拉姆齐数用于描述特定结构的存在性问题。
    - 确定Ramsey数的具体值仍然是一个开放问题，尽管有一些上界和下界的估计。


---


# 3-生成排列和组合-Permutation-Copmbination

## 生成排列
- 介绍了一种通过插入操作生成全排列的算法。

## 逆序排列
- 定义了排列的逆序数，并讨论了逆序数与排列之间的关系。

## 生成组合
- 讨论了如何生成所有可能的组合。

## 生成 r-子集
- 介绍了按字典序生成所有可能的r-组合的方法。
- 介绍了如何通过字典序排列出n元集合的所有r子集，并给出了生成这些子集的算法[^1.1^][^2.2^]。


---


# 4-二项式系数-Binomial-Coefficient

## 帕斯卡三角
1. **二项式系数**：
    - 定义了二项式系数，并讨论了其性质，如 \(C_{k}^{k} = C_{n}^{n}\) 等[^2.3^][^3.4^]。
    - 通过Pascal公式证明了二项式系数的一些重要恒等式[^3.5^]。

## 二项式定理
1. **二项式定理**：
    - 阐述了二项式定理，即\((x+y)^n = \sum_{k=0}^{n} C_n^k x^k y^{n-k}\)[^3.6^][^4.7^]。

2. **组合恒等式**：
    - 列出了一些重要的组合恒等式，如奇数和偶数二项式系数的和相等，以及二项式系数的平方和等于某个特定的二项式系数[^5.8^]。

## 多项式定理
- 介绍了多项式定理，即\((x_1 + x_2 + \cdots + x_t)^n = \sum (\text{各项次幂之和为n的非负整数解})\)。

## 牛顿二项式定理
- 讨论了牛顿二项式定理，包括正整数和负整数的情况，并展示了如何用它来计算某些特定形式表达式的值[^9.9^][^10.10^]。
- 还涉及了与二项式相关的一些特殊函数，如\(\sqrt{1+z}\)的展开式[^12.11^][^13.12^]。


---


# 5-容斥原理及应用-Inclusion-Exclusion-Principle

## 容斥原理
- 介绍了集合的基本概念，包括交集、并集、差集、绝对差和对称差等。
- 讨论了集合运算的一些基本性质，如对合律、幂等律、交换律、结合律、分配律、否定律、零律、同一律、吸收律和德摩根律。
- 通过具体例子，如计算1到600中不能被6整除的整数个数，展示了容斥原理的应用。

## 带重复组合
- 讨论了带重复的组合数，即从多集中选取若干个元素的组合数。
- 通过具体例子，如从多集{3a, 4b, 5c}中选择10个元素的组合数，展示了带重复组合数的计算方法。

## 错位排列
- 定义了错排的概念，即一个排列中没有任何元素出现在其原始位置上。
- 给出了计算错排数的公式，并证明了该公式的正确性。
- 通过具体例子，如计算10个人的帽子错排数，展示了错排数的应用。


---


# 6-递推关系-Recurrence-Relation

## 基本概念
1. **递归关系的基本概念**：
    - 数列{a_n}的递推关系是由{a_0, a_1, ..., a_{n-1}}中的一些或全部确定a_n的等式。
    - 初始值是数列的有限个元素给定的确定值。

2. **Fibonacci序列**：
    - 描述了Fibonacci数列的定义和递推关系，即f_n = f_{n-1} + f_{n-2}，并给出了通解。

3. **差分表**：
    - 定义了差分表，并解释了如何通过差分表来求解多项式的一般项和求和公式。
    - 差分表由数列的各级差分构成，通过差分表可以推导出数列的通项公式和部分和公式。

## 常系数线性齐次递归关系
- 分为特征根互不同和有重根两种情况。
- 对于特征根互不同的情况，通过特征方程求得通解，并结合初始条件确定常数。
- 对于有重根的情况，通过定理推导出特解形式，并结合初始条件确定常数。

## 常系数线性非齐次递推关系
- 分为寻找齐次递推关系的通解和非齐次递推关系的特解。
- 通过将特解与通解相加，并结合初始条件确定常数，最终得到非齐次递推关系的解。


---


# 7-生成函数-Generating-Function

## 生成函数

1. **生成函数的基本概念**：
    - 生成函数是用于表示数列的一种工具，通常定义为一个幂级数 \( g(x) = h_0 + h_1 x + h_2 x^2 + \cdots \)，其中 \( h_n \) 是数列的第 \( n \) 项。
    - 有限序列和无限序列都可以定义生成函数，有限序列的生成函数是一个多项式，而无限序列的生成函数是幂级数。

2. **生成函数的计算方法**：
    - 通过组合计数的方法，可以计算特定条件下的组合数。
    - 使用生成函数的乘法和除法规则来求解复杂的组合问题。

    - **应用实例**：
        - 多个例子展示了如何利用生成函数解决实际的组合问题，如分配球到不同班级、求方程的非负整数解等。
        - 通过生成函数，可以系统地处理涉及多种条件的组合问题，例如某些变量的取值范围和数量限制。

3. **生成函数**：
    - 定义了普通生成函数和指数生成函数。
    - 生成函数可以用来求解组合问题和计数问题。
    - **例子**：
        - 通过生成函数求解具体问题，如将18个球分给甲乙丙三班，每班至少得3个球，至多分得10个球，丙班至少2个球，求不同分发数。
        - 生成函数法可以简洁地表达和求解这些组合问题。

4. **递归关系**：
    - 用生成函数方法解递归关系。
    - 例如，a_n = 5a_{n-1} - 6a_{n-2} + 4^{n-1} (n≥2)，通过生成函数g(x) = a_0 + a_1 x + a_2 x^2 + ... 求解。

5. **组合问题**：
    - 用生成函数方法解决各种组合问题，如用数字1, 2, 3, 4可组成多少个含奇数个1和偶数个2且至少1个3的n位数，以及用红白蓝三种颜色给1×n棋盘上涂色，要求白色方格数为偶数等。

## 指数生成函数

1. **指数生成函数**：
    - 定义了指数生成函数，并讨论了其在计数问题中的应用。
    - 例如，求出特定条件下的n-排列数，如含奇数个1和偶数个2且至少1个3的n位数，以及用数字1, 2, 3, 4可组成多少个含奇数个1和偶数个2的n位数等。

2. **生成函数的扩展**：
    - 讨论了指数生成函数（Exponential Generating Function），其形式为 \( g^{(e)}(x) = \sum_{n=0}^{\infty} h_n \frac{x^n}{n!} \)，适用于处理排列和阶乘相关的问题。
    - 通过具体例子，解释了如何用指数生成函数来解决涉及排列和组合的问题。

3. **递归关系与生成函数**：
    - 介绍了如何用生成函数求解递归关系。
    - 通过将递归关系转化为生成函数，可以简化求解过程，得到显式的通项公式。


---


# 8-特殊计数序列

## 差分序列

1. **差分表与生成函数**：
   - 定义了一阶差分序列、二阶差分序列，并推广到p阶差分序列。
   - 通过差分表，可以确定一个序列的一般项形式，特别是当差分表的零次对角线有特定值时。

2. **定理**：
   - 对于多项式序列，其差分表的零次对角线为0, 0, ..., 1, 0, 0, ...，可以表示为一个多项式。
   - 差分表的零次对角线为C_0, C_1, ..., C_p, 0, 0, ... 的序列，其一般项可以表示为一个多项式，满足h_n = C_0 binom{n}{0} + C_1 binom{n}{1} + ... + C_p binom{n}{p}。

3. **例子**：
   - 通过计算差分表，求出多项式的一般项。
   - 例如，h_n = n^3 + 3n^2 - 2n + 1，其差分表的零次对角线为1, 2, 12, 6, 0, 0, ...，因此 h_n = 1 binom{n}{0} + 2 binom{n}{1} + 12 binom{n}{2} + 6 binom{n}{3}。

4. **部分和**：
   - 利用差分表的性质，可以求出序列的部分和。
   - 例如，h_n = 1 binom{n}{0} + 2 binom{n}{1} + 12 binom{n}{2} + 6 binom{n}{3}，其部分和为 ∑_k=0^n h_k = 1 binom{n+1}{1} + 2 binom{n+1}{2} + 12 binom{n+1}{3} + 6 binom{n+1}{4}。
