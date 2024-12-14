## 8 图

- 极小生成树的定义
- 实现
    - 用字典推导式储存邻接表
    - 用 `List` 储存边列表（子元素为`tuple` 或 `List`）
    - 用 `List` 储存邻接矩阵（二维矩阵形式）
- `prim` 算法
- `Kruskal` 算法

## 8.1 认识图


### 8.1.1 无向图与有向图
无向图 (Undirected) ，有向图 (Directed) 

### 8.1.2 连通性


### 8.1.3 权值图
When we assign weights an a graph, we get a Weight Graph.
对图赋有权值，会得到权值图 (Weight Graph)


### 8.1.4 边值表(List Of Edges) 邻接矩阵(Adjacency Matrix) 
边值表 (List Of Edges) ，刻画图中各边值信息
例如有边值表:  

node1 | node2 | weight
------|-------|-------
0 | 0 | 25
0 | 1 | 5
0 | 2 | 3
1 | 3 | 1
1 | 4 | 15
4 | 2 | 7
4 | 3 | 11

邻接矩阵 (Adjacency Matrix) ，刻画图中各节点连通性：
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

#### 无权图
常用于无权图，其结构如下：

图中节点部分 | 各节点对应联通位置
------  | ---------
节点对应表中起始位置 | 可联通节点

<div align="center">
    <img src="/ProjectDocs/cs/Back-end-Development/AlgorithmTheory-using-python/image/graph-1-2.png" width = 80%>
</div>

#### 有权图
使用 **字典 (Dictionary)** 实现有权图：
<div align="center">
    <img src="/ProjectDocs/cs/Back-end-Development/AlgorithmTheory-using-python/image/graph-1-1.png" width = 40%>
</div>

- 无权图：  

```python
dic_NO_weight{
    {0,1,2},
    {3,4},
    {},
    {},
    {2,3}
}
```
- 有权图：  
> [!attention]
> 注意：这里键值均是数据结构为`tuple`的数据。

```python
dic_weight{
    {(0,25),(1,5),(2,3)},
    {(3,1),(4,15)},
    {},
    {},
    {(2,7),(3,11)}
}
```


## 8.2 使用 python 实现

### 8.2.1 使用内建数据结构 list 实现

```python
class Graph:
    # constructor
    def __init__(self, num_of_node: int, directed=True):
        self.M_Num_Of_Node = num_of_node
        self.M_Directed = directed
        self.M_List_Of_edges = []

    # Add edge to a graph
    def Add_edge(self, node_start, node_end, weight=1):
        # Add the edge from node_start to node_end
        self.M_List_Of_edges.append([node_start, node_end, weight])
        # If a graph is undirected, add the same edge
        # but also in the opposite direction
        if not self.M_Directed:
            self.M_List_Of_edges.append([node_end, node_start, weight])

    # Print the edge list of graph
    def print_edge_list(self):
        print("The edge list of graph:\n[Start, End, weight]")
        for x in self.M_List_Of_edges:
            print(x)
```

### 8.2.2 使用二维数组 list\[list\] 实现

#### 
```python
class Graph_Matrix:
    # constructor
    def __init__(self, num_of_nodes, directed = True):
        self.M_Num_Of_Nodes = num_of_nodes
        self.M_Directed = directed
        # Initialize the adjacenct matirx
        # Create a matrix with num_of_node rows amd columns
        self.M_Adj_MaTrix = [[0 for columns in range(self.M_Num_Of_Nodes)],
                             [0 for rows in range(self.M_Num_Of_Nodes)]]

    # Add edge to a graph
    def Add_edges(self, node_start, node_end, weight = 1):
        self.M_Adj_MaTrix[node_start][node_end] = weight
        if not self.M_Directed:
            self.M_Adj_MaTrix[node_end][node_start] = weight

    # Print the Adjacenct Matrix of the graph
    def Print_Adj_Matrix(self):
        print(self.M_Adj_MaTrix)
```

### 8.2.3使用内建数据结构 dictionary 实现
建立类 `Graph_Dict` ，初始化时使用 **Dictionary Comprehension (字典推导式)** 实现字典 `self.M_Adj_List` ，对应每一个键值 `key` 的 `value` 均为空集合 `set()` ；再建立方法 `Add_Edge(self, node_start, node_end, weight)` ，将元组 `(node_end, weight)` 添加进入 `key:node_start` 的值 `set()` 中。
```python
class Graph_Dict:
    # constructor
    def __init__(self, num, directed=True):
        self.M_Num_Of_Nodes = num
        self.M_Nodes = range(self.M_Num_Of_Nodes)
        self.M_Directed = directed
        # Using Dictionary Comprehension 
        self.M_Adj_List = {node: set() for node in self.M_Nodes}

    # Add edge to a graph
    def Add_Edge(self, node_start, node_end, weight):
        # Add Element: Tuple[node_end,weight]
        # INTO Key:node_start 's Value(set)
        # list is NOT hashable that CAN't add in set
        self.M_Adj_List[node_start].add((node_end, weight))
        if not self.M_Directed:
            self.M_Adj_List[node_end].add((node_start, weight))

    # Print the Adjacenct List of the graph
    def Print_Edge_List(self):
        print(self.M_Adj_List)
```



