## 5 链表

## 5.1 单向链表的实现

### 5.1.0 基础实现
```python
class SingleNode:
    """
    单向节点
    """

    def __init__(self, data):
        """
        初始化节点，默认指针指空
        :param data:
        """
        self.data = data
        self.next = None


class SingleLinklist:
    """
    单向链表
    """

    def __init__(self):
        """
        初始化链表，默认头结点为空
        """
        self.head = None

```

### 5.1.1 链表的连接
```python
def connectLinklist(FrontLinkedList: SingleLinklist, BackLinkedList: SingleLinklist):
    """
    将两个单向链表链接
    :param FrontLinkedList: 连接时前部的链表
    :param BackLinkedList:  连接时后部的链表
    """
    if FrontLinkedList.head is not None:
        currentNode = FrontLinkedList.head
        while currentNode.next is not None:
            currentNode = currentNode.next
        currentNode.next = BackLinkedList.head
```

### 5.1.2 链表的节点插入
```python
#   class SingleNode :
#       ... # 其它代码
# 
#   class SingleLinklist :
#       ... # 其它代码
#   
    def insertAtBegin(self, data):
        """
        头插法，在链表头插入新节点
        :param data: 插入节点的数据
        """
        newNode = SingleNode(data)
        if self.head is None:
            self.head = newNode
        else:
            newNode.next = self.head
            self.head = newNode

    def insertAtIndex(self, data, index):
        """
        在现有链表中索引值Index位置插入新节点
        :param data: 插入节点的数据
        :param index: 插入位置的索引
        """
        if index == 0:  # 索引位置在头部时头插
            self.insertAtBegin(self, data)
        else:
            position = 0  # 使用 position 来判断是否达到 index
            currentNode = self.head  # 相应记录当前节点位置
            while (currentNode is not None) and (position + 1 != index):
                position += 1  # 后移直到插入位置
                currentNode = currentNode.next  # 后移直到插入位置
            if currentNode is not None:  # 此时 position = index 达到插入位置
                newNode = SingleNode(data)  # 初始化新节点newNode(target_list)
                newNode.next = currentNode.next  # newNode的next 更改 为前序节点的next，保证连续性
                currentNode.next = newNode  # 前序节点的next指向newNode，实现插入
            else:  # 超出索引
                print("ERROR: Out Of Index! ")
                return

    def insertAtEnd(self, data):
        """
        尾插法
        如果链表定义有length时也可以直接调用索引插入
            即：insertAtIndex(self,data,self.length)
        :param data: 插入节点的数据
        """
        newNode = SingleNode(data)
        if self.head is None:  # 空链表头插
            self.head = newNode
            return
        currentNode = self.head
        while currentNode.next is not None:
            # 尾结点条件：指针指空
            currentNode = currentNode.next
        currentNode.next = newNode

```

### 5.1.3 链表的节点删除
```python
#   class SingleNode :
#       ... # 其它代码
# 
#   class SingleLinklist :
#       ... # 其它代码
#   
    def delNodeAtBegin(self):
        """
        删除头部节点
        """
        if self.head is None:
            print("ERROR: The Linkedlist is EMPTY! ")
            return
        else:
            self.head = self.head.next

    def delNodeAtIndex(self, index):
        """
        删除索引位置节点
        :param index: 待删除节点位置索引值
        """
        if self.head is None:
            print("ERROR: The Linkedlist is EMPTY! ")
            return
        elif index == 0:
            self.delNodeAtBegin()
        else:
            dist = index  # 距离索引的位置
            tempNode = self.head
            while dist != 1 and tempNode is not None:
                dist -= 1
                tempNode = tempNode.next
            if dist == 1:
                tempNode.next = tempNode.next.next
            else:
                print("ERROR: Out Of Index! ")

    def delNodeAtEnd(self):
        """
        删除最后一个节点
        """
        if self.head is None:
            print("ERROR: The Linkedlist is EMPTY! ")
            return
        elif self.head.next is None:
            self.head = None
        else:
            tempNode = self.head
            while tempNode.next.next is not None:
                tempNode = tempNode.next
            tempNode.next = None
```

### 5.1.4 链表的翻转
```python
#   class SingleNode :
#       ... # 其它代码
# 
#   class SingleLinklist :
#       ... # 其它代码
#   
    def reverseLinkedlist(self):
        """
        反转链表
        """
        if self.head is None:
            print("ERROR: The Linkedlist is EMPTY! ")
            return
        else:
            new_head = None                    # 记录新头结点
            current_node = self.head           # 记录当前操作节点
            while current_node is not None:  # 当前节点非空
                # 保存当前操作节点的下一个节点
                next_node = current_node.next
                # 更新新头节
                current_node.next = new_head
                new_head = current_node
                # 操作节点重定义为保存的下一个节点
                current_node = next_node
            # 更新链表的头节点为新头节点
            self.head = new_head
```

### 5.1.5 其他基本操作
```python
#   class SingleNode :
#       ... # 其它代码
# 
#   class SingleLinklist :
#       ... # 其它代码
#   
    def print(self):
        """
        实现对链表的打印
        """
        if self.head is None:
            print("The Linkedlist is EMPTY!")
        else:
            currentNode = self.head
            while currentNode.next is not None:
                print(currentNode.data, end=" ")
                currentNode = currentNode.next
            print(currentNode.data)

    def updateNode(self, value, index):
        """
        实现对索引位置值更改
        :param value: 要更新的值
        :param index: 要更新的索引位置
        """
        if self.head is None:  # 空链表不修改
            print("ERROR: The Linkedlist is EMPTY!")
            return
        currentNode = self.head
        position = 0
        while currentNode is not None and position < index:
            # 当前节点非空 且 未到指定位置
            currentNode = currentNode.next
            position += 1
        if currentNode is not None:  # 到达指定位置
            currentNode.data = value
        else:  # 索引超出链表
            print("ERROR: Index Not Present!")
```

## 5.2 双向链表的实现
