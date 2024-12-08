## 3 排序算法

## 3.1 冒泡排序（交换排序）
- 原理：
    - 从首位开始
    - 比较相邻元素大小，依照目标选择性**对调**
    - 直到比较到未排序部分的尾部
        - 每次遍历都把未遍历的最小值/最大值**交换到尾部**
- python 实现如下：
    ```python
    """
    冒泡排序，对传入的 list 型变量调整为升序
    """
    def bubble_Sort(target_List: list):
        n = len(target_List)    # 循环数为列表长度
        for i in range(n):  # 对从列表头元素开始遍历
            isSwapped = False  # 交换标志 默认为 False未交换
            for j in range(0, n-i-1):   # 设置遍历提前结束，为了排除已经排序好的部分，提升效率
                if target_List[j] > target_List[j + 1]:
                    target_List[j], target_List[j + 1] = target_List[j + 1], target_List[j]
                    isSwapped = True  # 交换标志 更改为 True交换过
            if isSwapped is False:
                break   # 若此编遍历完发现未交换，则已经保证升序，直接break跳出循环i

    # 示例
    l = [16, 25, 39, 27, 12, 8, 45, 63]
    bubble_Sort(l)
    print(l)
    # 结果如下
    # [8, 12, 16, 25, 27, 39, 45, 63]
    ```


## 3.2 选择排序
- 原理
    - 从首位开始，
    - 初始化索引元素为当前遍历头元素
    - 比较当前元素与索引元素大小，依照目标选择性**更新索引**
    - 直到整个列表尾部
    - 将头元素与更新完成索引元素对调
        - 每次遍历都把后续内的最小值/最大值**交换到头部**
- python 实现如下：
    ```python
    """
    选择排序：对给定 list 型变量调整为升序
    """
    def selection_Sort(target_List: list):
        # 从列表头元素开始替换
        for i in range(len(target_List) - 1):
            smallest_Index = i  # 初始化最小元素索引
            for j in range(i + 1, len(target_List)):
                # 从初始索引元素的下一元素开始比较
                if target_List[smallest_Index] > target_List[j]:
                    smallest_Index = j  # 找到更小元素时更新索引位置
            # 遍历完成后交换最小元素到初始索引位置
            target_List[i], target_List[smallest_Index] \
                    = target_List[smallest_Index], target_List[i]

    # 示例
    data = [9, 15, 31, -4, 0, 94, -25, 16, 27]
    selection_Sort(data)
    print(data)
    # 结果如下：
    # [-25, -4, 0, 9, 15, 16, 27, 31, 94]
    ```


## 3.3 插入排序
- 原理
    - 先对头两个元素确定次序
    - 将后续元素依次插入其中
- python 实现如下：
    ```python
    """
    插入排序
    """
    def insert_Sort(target_List: list):
        for index in range(1, len(target_List)):   # 从列表第二元素开始遍历
            temp = target_List[index]   # 记录需插入值为temp
            pos = index - 1   # 用pos指示插入位置，默认0
            while pos >= 0 and temp < target_List[pos]:
                # 插入位置合法 且 插入值temp比插入位置原值data[i]更小，插入位置不合适
                # 把pos元素后移一位，覆写index位置值，原值存储在temp
                target_List[pos + 1] = target_List[pos]
                pos -= 1    # 插入位置前移
            # 此时插入位置合适，因为插入值temp大于当前位置值，此时在后一位执行插入
            target_List[pos + 1] = temp  # 插入temp到后一位

    # 示例
    data = [9, 15, 31, -4, 0, 94, -25, 16, 27]
    insert_Sort(data)
    print(data)
    # 结果如下
    # [-25, -4, 0, 9, 15, 16, 27, 31, 94]
    ```

## 3.4 希尔排序
- 原理
    - 确定划分指标
    - 依照划分指标对列表跳跃选取建立各个排序子链
    - 排序子链内部插入排序
    - 所有子链排序完成后细化划分指标
- python 实现如下：
    ```python
    """
    希尔排序，对列表跳跃选取建立排序子链，对各排序子链实现插入排序后再度细分划分指标
    """
    def shell_Sort(target_List: list):
        gap = len(target_List) // 2  # 划分指标初始化,默认为列表一半长度
        while gap > 0:  # 划分小于1，整除情况下为0时结束
            j = gap  # 排序子链的尾元素位置记录为j
            while j < len(target_List):  # 排序链尾元素非法时所有元素排序完成
                index = j - gap  # index 初始化为当前排序子链中倒数第二元素位置
                while index >= 0:   # 直到当前排序链中所有值都插入排序完成
                    if target_List[index + gap] > target_List[index]:
                        break  # 如果该序偶中后值大于前值 不执行操作
                    else:  # 后值小，进行交换
                        target_List[index + gap], target_List[index] \
                            = target_List[index], target_List[index + gap]
                    index -= gap  # 做完一轮判断后，index减去一个间隔指标，尝试对该链的前一序偶比较
                # 当前排序链排序完成，对下一排序链执行排序
                j += 1
            # print("当前划分完成：" + str(target_List) + "，划分指标gap= " + str(gap))
            gap //= 2  # 当前划分下排序完成，划分指标减半

    # 示例
    data = [16, 25, 39, 27, 12, 8, 45, 63]
    shell_Sort(data)
    print(data)
    # 结果如下：
    # # 当前划分完成：[12, 8, 39, 27, 16, 25, 45, 63]，划分指标gap= 4
    # # 当前划分完成：[12, 8, 16, 25, 39, 27, 45, 63]，划分指标gap= 2
    # # 当前划分完成：[8, 12, 16, 25, 27, 39, 45, 63]，划分指标gap= 1
    # [8, 12, 16, 25, 27, 39, 45, 63]
    ```


## 3.5 合并排序
- 原理
    - 
- python 实现如下：
    ```python

    ```


## 3.6 快速排序
- 原理
    - 
- python 实现如下：
    ```python

    ```


## 3.7 基数排序

