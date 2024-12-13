## 3 排序算法


## 3.1 冒泡排序（交换排序）（考察）
- 步骤：
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


## 3.2 选择排序（考察）
- 步骤：
    - 从首位开始
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
- 步骤：
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
- 步骤：
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


## 3.5 合并排序（考察）
- 步骤：
    - 短键值排序为键值对
    - 成对合并为更长键值组
        - 合并过程：两个有序组进行比较插入
    - 合并为整体键值组
- python 实现如下：
    - 无返回值（考察）
        ```python
        """
        无返回值
        使用函数:
            排序归并：merge_no_return(目标list, 起始索引, 分割索引, 终点索引)
            分割归并：merge_sort_no_return(目标list, 起始索引, 终点索引)
        """
        def merge_no_return(target_list: list, start: int, mid: int, end: int):
            """
            :param target_list: 归并对象
            :param start: 归并起点
            :param mid: 分割点
            :param end: 归并终点
            """
            n1 = mid - start + 1  # 第一个子数组长度
            L = [0] * n1    # 储存第一个子数组
            for i in range(n1):
                L[i] = target_list[start + i]

            n2 = end - mid  # 第二个子数组长度
            R = [0] * n2  # 储存第二个子数组
            for j in range(n2):
                R[j] = target_list[mid + 1 + j]

            i, j = 0, 0  # 初始化子数组的索引
            k = start  # 对原数组的操作索引
            while i < n1 and j < n2:
                # 归并临时数组到 target_list[start ... end]
                if L[i] <= R[j]:    # L当前索引值更小时
                    target_list[k] = L[i]   # 对原数组当前位置赋值
                    i += 1  # 后移L的索引
                else:   # R[j] 更小时
                    target_list[k] = R[j]
                    j += 1
                k += 1  # 移动原数组的索引
            #   拷贝 L[] 的保留元素
            while i < n1:
                target_list[k] = L[i]
                i += 1
                k += 1
            #   拷贝 R[] 的保留元素
            while j < n2:
                target_list[k] = R[j]
                j += 1
                k += 1


        def merge_sort_no_return(target_list: list, start: int, end: int):
            """
            :param target_list: 目标
            :param start:
            :param end:
            :return:
            """
            if start < end:
                m = int((start + (end - 1)) / 2)
                # 分割
                merge_sort_no_return(target_list, start, m)
                merge_sort_no_return(target_list, m + 1, end)
                # 归并
                merge_no_return(target_list, start, m, end)


        test_list = [12, 11, 13, 5, 6, 7]
        print("给定的数组", test_list)
        merge_sort_no_return(test_list, 0, len(test_list) - 1)
        print("排序后的数组", test_list)
        # 结果如下：
        # # 给定的数组 [12, 11, 13, 5, 6, 7]
        # # 排序后的数组 [5, 6, 7, 11, 12, 13]
        ```
    - 有返回值
        ```python
        """
        有返回值
        使用函数:
        排序归并：merge_ano(前段list, 后段list)
        分割归并：merge_sort_ano(目标list)
        """
        def merge_ano(list_front: list[int], list_back: list[int]):
            """
            :param list_front: 归并的前半段
            :param list_back:  归并的后半段
            :return:           归并结果列表
            """
            result_list = []
            while list_front and list_back:
                if list_front[0] < list_back[0]:
                    result_list.append(list_front.pop(0))
                else:
                    result_list.append(list_back.pop(0))
            if list_front:
                result_list += list_front
            if list_back:
                result_list += list_back
            return result_list


        def merge_sort_ano(target_list: list[int]):
            """
            :param target_list: 待排序的列表
            :return:            返回排序后的新列表
            """
            if len(target_list) <= 1:
                return target_list
            mid = len(target_list) // 2
            return merge_ano(merge_sort_ano(target_list[:mid]), merge_sort_ano(target_list[mid:]))


        test_list = [17, 56, 71, 38, 61, 62, 48, 28, 57, 42]
        print("原始数据：", test_list)
        test_result = merge_sort_ano(test_list)
        print("归并排序结果：", test_result)
        # 输出结果
        # 原始数据： [17, 56, 71, 38, 61, 62, 48, 28, 57, 42]
        # 归并排序结果： [17, 28, 38, 42, 48, 56, 57, 61, 62, 71]
        ```


## 3.6 快速排序（考察）
- 步骤：
    - 设定中值
    - 将小于中值、大于中值的值分配在中值两侧
    - 对左右两侧执行同样过程
- python 实现如下：
    ```python

    ```


## 3.7 基数排序（分配模式）
- 最高位优先 （Most Significant Digit First / MSD）

- 最低位优先 （Least Significant Digit First / FSD）
