## 6 堆栈与队列

## 6.1 用 List 实现堆栈
- 用 `.append()` 作为压栈
- 用 `.pop()` 作为出栈

## 6.2 用链表 Linkedlist 实现堆栈
```python
"""
用链表 Linkedlist 实现栈
"""


class Node:
    def __init__(self, value):
        """
            初始化为[ target_list | next ]
        """
        self.value = value
        self.next = None


class Stack:
    def __init__(self):
        self.head = Node("head")  # 初始化添加一个["head"|·]结点
        self.size = 0  # 只有头结点时栈长记0

    def __str__(self):
        """
            栈值Str化输出
            E.X.:Input:[ head | · ]->[ data1 | · ]->[ data2 | None ]
                 Output:"data1->data2"
        """
        cur = self.head.next
        out = ""  # 输出值在空栈时为空
        while cur:
            out += str(cur.value) + "->"
            cur = cur.next
        return out[:-2]  # 输出时去掉最后一个->

    def getSize(self) -> int:
        """
        返回栈长
        """
        return self.size

    def isEmpty(self) -> bool:
        """
        返回是否空栈的逻辑值
        """
        return self.size == 0

    # Get the top item of the stack
    def peek(self):
        """
        返回栈顶元素值
        """
        if self.isEmpty():
            return None  # 空栈时返回None
        return self.head.next.value

    def push(self, value):
        """
        压栈：将value添加在栈顶
        """
        node = Node(value)
        node.next = self.head.next  # 新节点指向原头结点的后继节点(原栈顶)
        self.head.next = node  # 头结点指向新节点
        self.size += 1  # 栈长+1

    def pop(self):
        """
        出栈：栈顶元素节点删除，返回栈顶元素value
        """
        if self.isEmpty():  # 栈空时抛出异常
            raise Exception("Popping from an empty stack")
        remove = self.head.next
        self.head.next = remove.next  # 头结点指向原栈顶元素的后继
        self.size -= 1
        return remove.value

```

## 6.3 用数组实现队列

## 6.4 用链表实现队列

## 6.5 双向队列