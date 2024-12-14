## 7 二叉树

## 7.1 二叉树的 Python 实现
```python
class TreeNode:
    def __init__(self, data):
        self.data = data
        self.right = None
        self.left = None


class BinaryTree:
    def __init__(self):
        """
        初始化二叉树，默认根节点为None
        """
        self.root = None

    def isEmpty(self):
        """
        :return: 二叉树根节点为空节点的布尔值
        """
        if self.root is None:
            return True
        return False

    def setRoot(self, data):
        """
        设定根节点的值，根结点为None时建立根节点
        :param data: 根节点的目标值
        """
        if self.root is None:
            self.root = TreeNode(data)
        else:
            self.root.data = data

    def get_node_depth(self, pos):
        """
        求树深
        使用遍历/递归实现，此处使用递归
        :return:
        """
        if pos is None:
            return "Empty Node!"
        if pos.left is None and pos.right is None:
            return 1
        else:
            max(self.get_node_depth(pos.left) + 1, self.get_node_depth(pos.right) + 1)

    def depth(self):
        return self.get_node_depth(self.root)

    def insert_node_certain_node(self, TargetNode: TreeNode, data, isLeft: bool):
        """
        插入指定值节点到目标位置
        :param TargetNode:    插入目标节点
        :param data:   插入值
        :param isLeft: Left为True时左插
        """
        if TargetNode is None:
            return "ERROR: Node NOT Exist! "
        if isLeft is True and TargetNode.left is None:
            TargetNode.left = TreeNode(data)
        elif isLeft is True and TargetNode.left is not None:
            # pos.left.data = data # 非更改数据函数,应不插入
            return "Tree Branch Not Empty"
        elif isLeft is False and TargetNode.right is None:
            TargetNode.right = TreeNode(data)
        else:
            # pos.right.data = data # 非更改数据函数,应不插入
            return "Tree Branch Not Empty"

```

## 7.2 二叉树的四种遍历

### 7.2.1 前序遍历
```python
    def pre_order_dfs(self):
        """
        Pre-Order Depth-First Search
        先序深度优先遍历: Root-Left-Right
        """
        self.pre_order_dfs_index(self.root)

    def pre_order_dfs_index(self, pos):
        """
        从指定节点开始先序DFS
        :param pos: 起始节点
        """
        if pos is None:
            return "Empty Node!"
        print(pos.data, end=" ")  # 打印当前节点值
        self.pre_order_dfs_index(pos.left)  # 访问左子节点
        self.pre_order_dfs_index(pos.right)  # 访问右子节点


    """
    先序遍历的应用
    """


    def get_key_level_from_certain(self, TargetKey, StartNode, CertainLevel):
    """
    找到指定 key 的层数 level
    使用 Pre-Order-DFS 思想
    :param TargetKey: 要查找的键
    :param StartNode: 当前节点位置
    :param CertainLevel: 当前层级
    :return: 键所在的层级，如果未找到则返回 -1
    """
    if StartNode is None:  # 检查到空节点时返回未找到值 -1
        return -1
    if StartNode.data == TargetKey:  # 检查到一致值时返回当前层数
        return CertainLevel
    if self.get_key_level_from_certain(TargetKey, StartNode.left, CertainLevel + 1) != -1:
        # 对左子树递归检查, 若返回有效层数则直接返回
        return self.get_key_level_from_certain(TargetKey, StartNode.left, CertainLevel + 1)
    else:  # 左子树未检出值，对右子树递归检查
        return self.get_key_level_from_certain(TargetKey, StartNode.right, CertainLevel + 1)

    def get_key_level(self, key):
        """
        获取指定值所在层数
        :param key: 目标值
        :return: 所在层数
        """
        return self.get_key_level_from_certain(key, self.root, 0)
```

### 7.2.2 中序遍历
```python
    def in_order_dfs(self):
        """
        In-Order Depth-First Search
        中序深度优先遍历: Left-Root-Right
        """
        self.in_order_dfs_index(self.root)

    def in_order_dfs_index(self, pos):
        """
        从指定节点开始中序DFS
        :param pos: 起始节点
        """
        if pos is None:
            return "Empty Node!"
        self.in_order_dfs_index(pos.left)
        print(pos.data, end=" ")
        self.in_order_dfs_index(pos.right)
```

### 7.2.3 后序遍历
```python
    def post_order_dfs(self):
        """
        Post-Order Depth-First Search
        后序深度优先遍历: Left-Right-Root
        """
        self.post_order_dfs_index(self.root)

    def post_order_dfs_index(self, pos):
        """
        从指定节点开始后序DFS
        :param pos: 起始节点
        """
        if pos is None:
            return "Empty Node!"
        self.post_order_dfs_index(pos.left)
        self.post_order_dfs_index(pos.right)
        print(pos.data, end=" ")

```

### 7.2.4 层序遍历
```python
    def BFS(self):
        """
        Breadth-First-Search
        广度优先搜索遍历:Level Order Traversal
        Example:
            0: Queue: [RootNode]
            1: [LeftNode, RightNode]
                "RootNode.data"
            2: Queue: [RightNode, Left-LeftNode, Right-LeftNode]
                "RootNode.data LeftNode.data"
            3: Queue: [Left-LeftNode, Right-LeftNode, Left-RightNode, Right-RightNode]
                "RootNode.data LeftNode.data RightNode.data"
        """
        if self.root is None:
            return "Empty Node!"
        queue = [self.root]  # 使用list实现Queue
        while queue:
            node = queue.pop(0)  # 从队列头部开始取出节点
            print(node.data, end=" ")  # 访问该节点值
            if node.left:  # 该节点存在左孩子时添加其左孩子
                queue.append(node.left)
            if node.right:  # 该节点存在右孩子时添加其右孩子
                queue.append(node.right)

    """
    BFS思想应用
    """

    def delete_node_bfs(self, target):
        """
        删除指定值节点及其子树
        :param target: 指定值
        """
        self.del_node_bfs_position(self.root, target)

    def del_node_bfs_position(self, StartNode, TargetKey):
        """
        删除符合指定值的子节点及其后序树
        使用 BFS 思想
        :param StartNode: 起始节点
        :param TargetKey: 目标值
        """
        if not StartNode:
            return None
        queue = [StartNode]
        while queue:
            current = queue.pop(0)
            if current.data == TargetKey:
                # 找到目标节点，删除其子树
                current.left, current.right = None, None
                return
            if current.left:  # 左子树进队
                queue.append(current.left)
            if current.right:  # 右子树进队
                queue.append(current.right)

```
