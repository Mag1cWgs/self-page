## 8 图

- 极小生成树的定义
- 实现
    - 用字典推导式储存邻接表
    - 用 `List` 储存边列表（子元素为`tuple` 或 `List`）
    - 用 `List` 储存邻接矩阵（二维矩阵形式）
- `prim` 算法
- `Kruskal` 算法



---



## 8.1 认识图


### 8.1.1 无向图与有向图
无向图 (Undirected) ，有向图 (Directed) 

### 8.1.2 连通性


### 8.1.3 权值图
When we assign weights an a graph, we get a Weight Graph.
对图赋有权值，会得到权值图 (Weight Graph)


### 8.1.4 边值表(List Of Edges) 邻接矩阵(Adjacency Matrix) 
- 边值表 (List Of Edges) ，刻画图中各边值信息
    - 例如有边值表:  

node1 | node2 | weight
------|-------|-------
0 | 0 | 25
0 | 1 | 5
0 | 2 | 3
1 | 3 | 1
1 | 4 | 15
4 | 2 | 7
4 | 3 | 11

- 邻接矩阵 (Adjacency Matrix) ，刻画图中各节点连通性：
    - 有向图：矩阵非对称 $ M_A \not= M_A^T $
    - 无向图：矩阵对称 $ M_A = M_A^T $

\ | 0 | 1 | 2 | 3 | 4
--|---|---|---|---|----
0 | 25 | 5 | 3 | 0 | 0
1 | 0 | 0 | 0 | 1 | 15
2 | 0 | 0 | 0 | 0 | 0 
3 | 0 | 0 | 0 | 0 | 0 
4 | 0 | 0 | 7 | 11 | 0


<div align="center">
    <img src="/ProjectDocs/cs/Back-end-Development/AlgorithmTheory-using-python/image/graph-1-1.png" width = 40%>
</div>

### 8.1.5 邻接表 (Adjacency list)

- 无权图
    - 常用于无权图，其结构如下：

图中节点部分 | 各节点对应联通位置
------  | ---------
节点对应表中起始位置 | 可联通节点

<div align="center">
    <img src="/ProjectDocs/cs/Back-end-Development/AlgorithmTheory-using-python/image/graph-1-2.png" width = 80%>
</div>


---


## 8.2 使用 python 实现

### 8.2.1 使用内建数据结构 list 实现

```python
class GraphList:
    """
    使用 list[[node_start, node_end, weight]] 存储边值表
    初始化后有：
        M_Num_Of_Nodes  : 顶点个数
        M_Directed      : 是否有向
        M_List_Of_edges : 边值表
    """

    def __init__(self, num_of_node: int, directed=True):
        """
        初始化图
        :param num_of_node: 顶点个数
        :param directed: 是否有向(默认有)
        """
        self.M_Num_Of_Node = num_of_node
        self.M_Directed = directed
        self.M_List_Of_edges = []

    def Add_edge(self, node_start, node_end, weight=1):
        """
        添加指定的边值
        对无向图会添加相应的反向边
        :param node_start:  起始点
        :param node_end:    终止点
        :param weight:      边权值
        """
        if self.M_Directed:
            self.M_List_Of_edges.append([node_start, node_end, weight])
        else:
            self.M_List_Of_edges.append([node_end, node_start, weight])

    def Print_Edge_List(self):
        """
        打印边值表
        """
        print("The edge list of graph:\n[Start, End, weight]")
        for x in self.M_List_Of_edges:
            print(x)


test_graph_doubly_list = GraphList(4, True)
test_graph_doubly_list.Add_edge(0, 1, 10)
test_graph_doubly_list.Add_edge(0, 2, 6)
test_graph_doubly_list.Add_edge(0, 3, 5)
test_graph_doubly_list.Add_edge(1, 3, 15)
test_graph_doubly_list.Add_edge(2, 3, 4)
test_graph_doubly_list.Print_Edge_List()
# 输出结果：
# The edge list of graph:
# [Start, End, weight]
# [0, 1, 10]
# [0, 2, 6]
# [0, 3, 5]
# [1, 3, 15]
# [2, 3, 4]

```

### 8.2.2 使用二维数组 [columns[value], rows[value]] 实现

#### 
```python
class GraphMatrix:
    def __init__(self, num_of_nodes, directed=True):
        """
        传入节点数、默认有向图
        初始化二维矩阵作为邻接矩阵
        :param num_of_nodes:
        :param directed:
        """
        self.M_Num_Of_Nodes = num_of_nodes
        self.M_Directed = directed
        self.M_Adj_MaTrix = [[0 for columns in range(self.M_Num_Of_Nodes)],
                             [0 for rows in range(self.M_Num_Of_Nodes)]]

    def Add_edges(self, node_start, node_end, weight=1):
        """
        添加边值
        :param node_start:  起始点
        :param node_end:    终止点
        :param weight:      边权值
        :return:
        """
        self.M_Adj_MaTrix[node_start][node_end] = weight
        if not self.M_Directed:
            self.M_Adj_MaTrix[node_end][node_start] = weight
        
    def Print_Adj_Matrix(self):
        """
        打印邻接矩阵
        """
        if self.M_Num_Of_Nodes > 2:
            print("[", self.M_Adj_MaTrix[0])
            for rows in range(1, self.M_Num_Of_Nodes - 1):
                print(" ", self.M_Adj_MaTrix[rows])
            print(" ", self.M_Adj_MaTrix[self.M_Num_Of_Nodes - 1], "]")
        elif self.M_Num_Of_Nodes < 1:
            print("ERROR: EMPTY Graph")
        else:
            print(self.M_Adj_MaTrix)



test_graph_matrix = GraphMatrix(5)
test_graph_matrix.M_Adj_MaTrix = [[0, 2, 0, 6, 0],
                               [2, 0, 3, 8, 5],
                               [0, 3, 0, 0, 7],
                               [6, 8, 0, 0, 9],
                               [0, 5, 7, 9, 0]]
test_graph_matrix.Print_Adj_Matrix()
# 输出结果：
# [ [0, 2, 0, 6, 0]
#   [2, 0, 3, 8, 5]
#   [0, 3, 0, 0, 7]
#   [6, 8, 0, 0, 9]
#   [0, 5, 7, 9, 0] ]

```

### 8.2.3 使用内建数据结构 dictionary 实现
- 建立类 `Graph_Dict`
    - 初始化时使用 **Dictionary Comprehension (字典推导式)** 实现字典 `self.M_Adj_List` 
    - 对应每一个键值 `key` 的 `value` 均为空集合 `set()` 
    - 建立方法 `Add_Edge(self, node_start, node_end, weight)`
        - 将元组 `(node_end, weight)` 添加进入 `key:node_start` 的值 `set()` 中。

- 例如对下图有：

Key: node_start | Value: set()
----------------|------------
0 | { (0,25) , (1,5) , (2,3) }
1 | { (3,1) , (4,15) }
2 | set()
3 | set()
4 | { (2,7) , (3,11) }

<div align="center">
    <img src="/ProjectDocs/cs/Back-end-Development/AlgorithmTheory-using-python/image/graph-1-1.png" width = 40%>
</div>

- Python 实现

```python
class GraphDict:
    """
    使用 dictionary 存储边值表
    使用字典推导式进行初始化，初始化后有：
        M_Num_Of_Nodes  : 顶点个数
        M_Nodes         : 顶点集
        M_Directed      : 是否有向
        M_Adj_List      : 边值表
    """

    def __init__(self, num, directed=True):
        """
        初始化图
        :param num: 顶点个数
        :param directed: 是否有向(默认有)
        """
        self.M_Num_Of_Nodes = num
        self.M_Nodes = range(self.M_Num_Of_Nodes)
        self.M_Directed = directed
        self.M_Adj_List = {node: set() for node in self.M_Nodes}

    def Add_Edge(self, node_start, node_end, weight):
        """
        添加指定的边值。
        添加tuple(终点，边值)到value:set()中。
            # 只有可哈希hashable的对象才能加入set()
            # list等是不可哈希的，无法加入set()
        对无向图会添加相应的反向边
        :param node_start: 起始点
        :param node_end:   终止点
        :param weight:     边权值
        """
        if self.M_Directed:
            self.M_Adj_List[node_start].add((node_end, weight))
        else:
            self.M_Adj_List[node_end].add((node_start, weight))

    def Print_Edge_List(self):
        print(self.M_Adj_List)

    
test_graph_Dict = GraphDict(5, False)
test_graph_Dict.Add_Edge(1,3,4)
test_graph_Dict.Add_Edge(4,2,3)
test_graph_Dict.Print_Edge_List()
# 输出结果：
# {0: set(), 1: set(), 2: {(4, 3)}, 3: {(1, 4)}, 4: set()}


```

## 8.3 最小生成树 Minimal Spanning Tree

- Kruskal算法

```Python
"""
最小生成树
    Prim 算法
    Kruskal 算法
"""

import sys  # 用于 prim 算法中初始化权值图


class GraphList:
    """
    使用 list[[node_start, node_end, weight]] 存储边值表
    初始化后有：
        M_Num_Of_Nodes  : 顶点个数
        M_Directed      : 是否有向
        M_List_Of_edges : 边值表
    """

    def __init__(self, num_of_node: int, directed=True):
        """
        初始化图
        :param num_of_node: 顶点个数
        :param directed: 是否有向(默认有)
        """
        self.M_Num_Of_Node = num_of_node
        self.M_Directed = directed
        self.M_List_Of_edges = []

    def Add_edge(self, node_start, node_end, weight=1):
        """
        添加指定的边值
        对无向图会添加相应的反向边
        :param node_start:  起始点
        :param node_end:    终止点
        :param weight:      边权值
        """
        if self.M_Directed:
            self.M_List_Of_edges.append([node_start, node_end, weight])
        else:
            self.M_List_Of_edges.append([node_end, node_start, weight])

    def Print_Edge_List(self):
        """
        打印边值表
        :return:
        """
        print("The edge list of graph:\n[Start, End, weight]")
        for x in self.M_List_Of_edges:
            print(x)

    def Find(self, parent_list, index_key):
        """
        寻找目标节点的父节点
        :param parent_list: 父节点列表
        :param index_key:   目标节点索引值
        """
        # 如果当前节点的值不是目标值，则递归查找并路径压缩
        if parent_list[index_key] != index_key:
            parent_list[index_key] = self.Find(parent_list, parent_list[index_key])
        return parent_list[index_key]

    def Union(self, parent, rank, x, y):
        """
        对两个集合使用按秩合并, 用于路径压缩
        :param parent: 父节点集合
        :param rank:   秩集合
        :param x:      集合x
        :param y:      集合y
        """
        # 将较小秩的树连接到较大秩的树根下（按秩合并）
        if rank[x] < rank[y]:
            parent[x] = y
        elif rank[x] > rank[y]:
            parent[y] = x
        else:  # 如果秩相同，则选择一个作为根，并将其秩增加1
            parent[y] = x
            rank[x] += 1

    def KruskalMsT(self):
        """
        使用Kruskal算法构建最小生成树的主要函数
        """
        result = []  # 存储结果的最小生成树
        index_of_list = 0  # 用于排序边的索引变量
        end_index = 0  # 用于结果数组的索引变量
        # 使用匿名函数lambda, 权重item[2]即weight, 将所有边按权重非递减顺序排序,
        self.M_List_Of_edges = sorted(self.M_List_Of_edges, key=lambda item: item[2])
        parent = []  # 父节点列表
        rank = []  # 秩列表
        for node in range(self.M_Num_Of_Node):  # 初始化每个节点的父节点和秩
            parent.append(node)
            rank.append(0)
        while end_index < self.M_Num_Of_Node - 1:
            # 结果list中终点数目小于总节点数时循环
            current_start, current_end, current_weight = self.M_List_Of_edges[index_of_list]
            index_of_list += 1
            x = self.Find(parent, current_start)
            y = self.Find(parent, current_end)
            # 如果两个节点不在同一个集合中，则添加这条边到结果中
            if x != y:  # 起点终点不在同一点集内
                end_index += 1  # 完成添加的终点数+=1
                result.append([current_start, current_end, current_weight])  # 添加进入MST
                self.Union(parent, rank, x, y)  # 合并
        print("构造完成的最小生成树里的边有：:")
        minimumCost = 0
        # 计算最小生成树的总权重并打印每条边
        for current_start, current_end, weight in result:
            minimumCost += weight
            print("%d -- %d 权值: %d" % (current_start, current_end, weight))
        print("最小生成树的总权重", minimumCost)

test_graph_list_kruskal = GraphList(4, True)
test_graph_list_kruskal.Add_edge(0, 1, 10)
test_graph_list_kruskal.Add_edge(0, 2, 6)
test_graph_list_kruskal.Add_edge(0, 3, 5)
test_graph_list_kruskal.Add_edge(1, 3, 15)
test_graph_list_kruskal.Add_edge(2, 3, 4)
test_graph_list_kruskal.KruskalMsT()
# 输出结果：
# 构造完成的最小生成树里的边有：:
# 2 -- 3 权值: 4
# 0 -- 3 权值: 5
# 0 -- 1 权值: 10
# 最小生成树的总权重 19

```


- Prim算法

```Python
class GraphMatrix:
    def __init__(self, num_of_nodes, directed=True):
        """
        传入节点数、默认有向图
        初始化二维矩阵作为邻接矩阵
        :param num_of_nodes:
        :param directed:
        """
        self.M_Num_Of_Nodes = num_of_nodes
        self.M_Directed = directed
        self.M_Adj_MaTrix = [[0 for columns in range(self.M_Num_Of_Nodes)],
                             [0 for rows in range(self.M_Num_Of_Nodes)]]

    def Add_edges(self, node_start, node_end, weight=1):
        """
        添加边值
        :param node_start:  起始点
        :param node_end:    终止点
        :param weight:      边权值
        :return:
        """
        self.M_Adj_MaTrix[node_start][node_end] = weight
        if not self.M_Directed:
            self.M_Adj_MaTrix[node_end][node_start] = weight

    def Print_Adj_Matrix(self):
        """
        打印邻接矩阵
        """
        if self.M_Num_Of_Nodes > 2:
            print("[", self.M_Adj_MaTrix[0])
            for rows in range(1, self.M_Num_Of_Nodes - 1):
                print(" ", self.M_Adj_MaTrix[rows])
            print(" ", self.M_Adj_MaTrix[self.M_Num_Of_Nodes - 1], "]")
        elif self.M_Num_Of_Nodes < 1:
            print("ERROR: EMPTY Graph")
        else:
            print(self.M_Adj_MaTrix)

    def print(self, parent):
        """
        打印点集在图中对应边权
        :param parent:
        :return:
        """
        print("Edge \t Weight")
        for end_node in range(1, self.M_Num_Of_Nodes):
            print(parent[end_node], "-", end_node, "\t", self.M_Adj_MaTrix[end_node][parent[end_node]])

    def minKey(self, key, mstSet):
        """
        用于从尚未包含在MST中的顶点集合中找到具有最小距离值的顶点。
        :param key:
        :param mstSet:
        :return:
        """
        # 初始化最小值
        minValue = sys.maxsize
        min_index = 0
        for v in range(self.M_Num_Of_Nodes):
            if key[v] < minValue and not mstSet[v]:
                minValue = key[v]
                min_index = v
        return min_index

    def primMST(self):
        """
        构造并打印邻接矩阵表示的图的MST
        :return:
        """
        # 初始化key列表
        key = [sys.maxsize] * self.M_Num_Of_Nodes
        parent = [None] * self.M_Num_Of_Nodes  # 存储构造的MST的数组
        parent[0] = -1  # 初始化parent列表
        # 选第一个顶点
        key[0] = 0
        mstSet = [False] * self.M_Num_Of_Nodes
        # 从尚未处理的顶点集合中选择距离最小的顶点
        for count in range(self.M_Num_Of_Nodes):
            # 取u为最小值位置
            u = self.minKey(key, mstSet)
            # 在MST中放置最小距离顶点，通过标记为true实现
            mstSet[u] = True
            # 只有当当前距离大于新距离且该顶点不在最短路径树中时，才更新所选顶点的相邻顶点的dist值
            for v in range(self.M_Num_Of_Nodes):
                # 只有当图[u][v]小于key[v]时，才会更新key
                # 图[u][v]对于m的相邻顶点是非零的
                if 0 < self.M_Adj_MaTrix[u][v] < key[v] and not mstSet[v]:
                    key[v] = self.M_Adj_MaTrix[u][v]
                    parent[v] = u
            # 结束本轮遍历
        # 则 parent 列表存储了最短路径所在节点
        self.print(parent)


test_graph_matrix_prim_1st = GraphMatrix(5)
test_graph_matrix_prim_1st.M_Adj_MaTrix = [[0, 2, 0, 6, 0],
                                           [2, 0, 3, 8, 5],
                                           [0, 3, 0, 0, 7],
                                           [6, 8, 0, 0, 9],
                                           [0, 5, 7, 9, 0]]
test_graph_matrix_prim_1st.primMST()

test_graph_matrix_prim_2nd = GraphMatrix(8)
test_graph_matrix_prim_2nd.M_Adj_MaTrix = [[0, 0.3, 1, 0, 0, 0.5, 0, 0],
                                           [0.3, 0, 1, 0.8, 0.7, 0, 0, 0],
                                           [1, 1, 0, 0, 0.5, 2, 0, 0],
                                           [0, 0.8, 0, 0, 2, 0, 0, 3],
                                           [0, 0.7, 0.5, 2, 0, 1, 2.5, 0.4],
                                           [0.5, 0, 2, 0, 1, 0, 3, 0],
                                           [0, 0, 0, 0, 2.5, 3, 0, 1.5],
                                           [0, 0, 0, 3, 0.4, 0, 1.5, 0]]
test_graph_matrix_prim_2nd.primMST()

# 输出结果：
# Edge 	 Weight
# 0 - 1 	 2
# 1 - 2 	 3
# 0 - 3 	 6
# 1 - 4 	 5
# Edge 	 Weight
# 0 - 1 	 0.3
# 4 - 2 	 0.5
# 1 - 3 	 0.8
# 1 - 4 	 0.7
# 0 - 5 	 0.5
# 7 - 6 	 1.5
# 4 - 7 	 0.4


```


## 8.4 最短路径问题
### 8.4.1 dijkstra 算法
- Python实现

```Python
"""
    dijkstra 算法
"""


class GraphMatrix:
    def __init__(self, num_of_nodes, directed=True):
        """
        传入节点数、默认有向图
        初始化二维矩阵作为邻接矩阵
        :param num_of_nodes:
        :param directed:
        """
        self.M_Num_Of_Nodes = num_of_nodes
        self.M_Directed = directed
        self.M_Adj_MaTrix = [[0 for columns in range(self.M_Num_Of_Nodes)] for rows in range(self.M_Num_Of_Nodes)]

    def Add_edges(self, node_start, node_end, weight=1):
        """
        添加边值
        :param node_start:  起始点
        :param node_end:    终止点
        :param weight:      边权值
        :return:
        """
        self.M_Adj_MaTrix[node_start][node_end] = weight
        if not self.M_Directed:
            self.M_Adj_MaTrix[node_end][node_start] = weight

    def Print_Adj_Matrix(self):
        """
        打印邻接矩阵
        """
        if self.M_Num_Of_Nodes > 2:
            print("[", self.M_Adj_MaTrix[0])
            for rows in range(1, self.M_Num_Of_Nodes - 1):
                print(" ", self.M_Adj_MaTrix[rows])
            print(" ", self.M_Adj_MaTrix[self.M_Num_Of_Nodes - 1], "]")
        elif self.M_Num_Of_Nodes < 1:
            print("ERROR: EMPTY Graph")
        else:
            print(self.M_Adj_MaTrix)

    def minDistance(self, dist: list, sptset: list):
        """
        返回最小值位置；
        对dist中值寻找最小，并对照sptset筛选未选取项。
        :param dist:
        :param sptset:
        :return min_index:
        """
        min = float('inf')
        min_index = -1
        for v in range(self.M_Num_Of_Nodes):
            if dist[v] < min and not sptset[v]:
                min = dist[v]
                min_index = v
        return min_index

    def dijkstra(self, src):
        """
        使用dijkstra算法实现最短路径树
        :param src:
        :return:
        """
        dist = [float('inf')] * self.M_Num_Of_Nodes
        dist[src] = 0
        sptSet = [False] * self.M_Num_Of_Nodes
        for count in range(self.M_Num_Of_Nodes):
            u = self.minDistance(dist, sptSet)
            if u == -1:
                break
            sptSet[u] = True
            for v in range(self.M_Num_Of_Nodes):
                if (self.M_Adj_MaTrix[u][v] > 0 and not sptSet[v] and dist[v] > dist[u] + self.M_Adj_MaTrix[u][v]):
                    dist[v] = dist[u] + self.M_Adj_MaTrix[u][v]
        return dist



test_graph_matrix_1st = GraphMatrix(5)
test_graph_matrix_1st.M_Adj_MaTrix = [[0, 2, 0, 6, 0],
                                      [2, 0, 3, 8, 5],
                                      [0, 3, 0, 0, 7],
                                      [6, 8, 0, 0, 9],
                                      [0, 5, 7, 9, 0]]
test_graph_matrix_1st.Print_Adj_Matrix()
print("dijkstra:", test_graph_matrix_1st.dijkstra(0))

# 输出结果：
# [ [0, 2, 0, 6, 0]
#   [2, 0, 3, 8, 5]
#   [0, 3, 0, 0, 7]
#   [6, 8, 0, 0, 9]
#   [0, 5, 7, 9, 0] ]
# dijkstra: [0, 2, 5, 6, 7]

```