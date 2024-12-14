## 4 查找算法


## 4.1 线性查找法/顺序查找法（考察）
- 步骤：
    - 从首位开始
    - 遍历直到找到第一个目标值
- Python实现

```python
"""
线性查找法/顺序查找法
"""
def linear_search(target_list: list, target_key: int) -> int:
    """
    :param target_list: 待查找的列表
    :param target_key:  查找的目标值
    :return:    返回查找结果索引值，未查找到则返回-1
    """
    for i in range(len(target_list)):
        if target_key == target_list[i]:
            return i  # "在第{0}位".format(i + 1)
        else:
            continue
    return -1  # "未查找到索引值"


test_list = [1, 4, 16, 8, 8, 10]
test_key = 8
print(linear_search(test_list, test_key))
# 输出结果：
# 3
```

## 4.2 二分查找法
- 要求：查找的表有序
- 步骤：

- Python实现：

```python
"""
二分查找法
"""
def bin_search(target_list: list, target_key: int) -> int:
    """
    适用于有序表，自动判断升降序
    :param target_list: 待查找列表
    :param target_key:  查找的目标值
    :return:    目标值在列表中的索引，如果未找到则返回-1
    """
    low = 0
    high = len(target_list) - 1
    if target_list[low] < target_list[high]:
        while low <= high:
            mid = (low + high) // 2
            if target_key < target_list[mid]:
                high = mid - 1
            elif target_key > target_list[mid]:
                low = mid + 1
            else:
                return mid
    else:
        while low <= high:
            mid = (low + high) // 2
            if target_key > target_list[mid]:
                high = mid - 1
            elif target_key < target_list[mid]:
                low = mid + 1
            else:
                return mid
    return -1


test_list_1 = [12, 16, 55, 110, 160, 200]
test_list_2 = [210, 130, 110, 101, 26, 16, 0, -1]
test_key = 16
print(bin_search(test_list_1, test_key))
print(bin_search(test_list_2,test_key))
# 输出结果：
# 1
# 5

```




