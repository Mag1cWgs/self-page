## 1. 两数之和
- 给定一个整数数组 `nums` 和一个整数目标值 `target`
- 请你在该数组中找出 **和为目标值** `target` **的两个整数下标**
    - 返回它们的数组下标。
- 可以假设每种输入只会对应一个答案
    - 不能使用两次相同的元素。
- 你可以按任意顺序返回答案。

- Example:
    - Input: `nums = [2,7,11,15]`, `target = 9`
    - Output：`[0,1]`
    - Explain: `nums[0] + nums[1] == 9`=>`[0, 1]` 

### 解法一：暴力解法
- 时间复杂度是 $O(n^2)$、空间复杂度 $O(1)$
```cs
public class Solution {
public int[] TwoSum(int[] nums, int target) {
    int length = nums.Length;   // 记录数组长度
    for (int i = 0; i < length; i++) // i 从 0 到 length-1
        for (int j = i + 1; j < length; j++) {
            // j 从 i+1 到 length-1
            if (nums[i] + nums[j] == target) 
                return new int[]{i, j};
        }
            return new int[]{-1, -1};
    }
}
```
### 解法二：哈希法
> [!note|label:什么时候使用哈希法]
> - 需要查询一个元素是否出现过
> - 需要确定一个元素是否在集合里的时候
- 解法一中相同的下标被多次遍历
    - 使用哈希进行优化
- 哈希表设计：
    - Key: `nums` 中已经遍历过得元素
    - Value: 相应的下标
- 查找值与目标之间的差值 `target-num[i]` 是否在表内
    - 在表内 => 输出对应的两个 `Value` （存在对应的 Key: `num[i]`）
    - 不在 => 添加当前的 `num[i]` 为新的 Key
- 使用 `Dictionary<TKey, TValue>` 作为哈希表
    - 参考 [Dictionary<TKey,TValue> 类](https://learn.microsoft.com/zh-cn/dotnet/api/system.collections.generic.dictionary-2?view=net-9.0)
    - 使用 `ContainsKey` 方法查找键
    - 使用 `TryAdd` 方法添加值
- 基础实现：
    ```cs
    public class Solution {
        public int[] TwoSum(int[] nums, int target) {
            // 使用字典类 Dictionary<int,int> 作为哈希结构
            // 使用对应接口 IDictionary 访问
            IDictionary<int, int> dictionary = new Dictionary<int, int>();
            // 单 for 循环遍历
            for (int i = 0; i < nums.Length; i++) {
                // 计算当前下标对应的查找目标Key
                int targetKey = target - nums[i];
                // 使用 ContainsKey 方法查找 Key，若成功则返回
                if (dictionary.ContainsKey(targetKey))
                    return new int[]{dictionary[targetKey], i};
                // 若失败则添加当前下标对应的Key
                dictionary.TryAdd(nums[i], i);
            }
            return new int[]{-1, -1};   // 不存在
        }
    }
    ```
    > [!note|label:使用接口声明的优点]
    > - 接口并不涉及实例化，不涉及内存运用、相较 `var` 更节省编译时间
    > - 但是相较使用类名声明，体现「依赖倒置」原则
    >       - 比如使用 `IFoo example = new FooA()` 时，可直接将 `FooA()` 换为其他实现 `IFoo` 的类
    > - 同时也减少了类间的耦合度，只需要关注与接口间交互

- 优化：使用双向指针优化
    ```cs
    public class Solution {
        public int[] TwoSum(int[] nums, int target) {
            IDictionary<int, int> dic = new Dictionary<int, int>();
            for (int i = 0, j = nums.Length - 1; i <= j; i++, j--)
            {
                if (dic.ContainsKey(target - nums[i]))
                    return new int[2] { dic[target - nums[i]], i };
                else
                    dic.TryAdd(nums[i], i);
                if (dic.ContainsKey(target - nums[j]))
                    return new int[2] { dic[target - nums[j]], j };
                else
                    dic.TryAdd(nums[j], j);
            }
            return new int[2];
        }
    }
    ```

### 相关内容
- 类似题型：
    - 242.有效的字母异位词（数组作为哈希表）
    - 349.两个数组的交集（通过集合类作为哈希表）

- 参考题解：
    - [「代码随想录」梦开始的地方！](https://leetcode.cn/problems/two-sum/solutions/1680357/by-carlsun-2-sarb)
    - [两数之和 三数之和【基础算法精讲 01】](https://www.bilibili.com/video/BV1bP411c7oJ/?share_source=copy_web&vd_source=9ba1a80902ec14f4f1601626d29e43c7)

## 49.字母异位词分组
- 给你一个字符串数组
- 请你将 字母异位词 组合在一起
    - 字母异位词 是由重新排列源单词的所有字母得到的一个新单词。
- 可以按任意顺序返回结果列表。

### 解法：使用哈希表记录
- 思路
    - 先将当前元素重新排序
    - 然后查找哈希表有没有相应的键
        - 有 => 记录下标
        - 无 => 建立新键值对
- 使用 `Dictionary` 来作为哈希表，使用 LinQ 中方法处理
    - 结构
        - Key: `string` 重排后的字符串
        - Value: `List<string>` 对应存在的值
    - 使用 `Enumerable.Order<T>` 来升序化当前 Key
        - [System.LinQ.Enumerable.Order<T>方法](https://learn.microsoft.com/zh-cn/dotnet/api/system.linq.enumerable.order?view=net-9.0&devlangs=csharp&f1url=%3FappId%3DDev17IDEF1%26l%3DZH-CN%26k%3Dk(System.Linq.Enumerable.Order%2560%25601)%3Bk(DevLang-csharp)%26rd%3Dtrue)
        - 因为 `Dictionary<TKey,TValue> 类` 继承了接口 `IEnumerable<T>`
    - 使用 `ToArray` 来当前转换升序后的Key为 `string`
        - 参考[Enumerable.ToArray<TSource>(IEnumerable<TSource>) 方法](https://learn.microsoft.com/zh-cn/dotnet/api/system.linq.enumerable.toarray?view=net-9.0#system-linq-enumerable-toarray-1(system-collections-generic-ienumerable((-0))))
    - 使用 `TryGetValue` 来获取当前 Key 对应的 Value
        - 返回 `null` 时就添加一个新的空键值对


- 基础实现
    ```cs
    public class Solution {
        public IList<IList<string>> GroupAnagrams(string[] strs) {
            // 思路：用 Dictionary 建立查找哈希表
            var theHash = new Dictionary<string, List<string>>();   // string => List<string>
            foreach (var str in strs) {
                // 用.Order升序而后.ToArray转换为string
                var sortedStr = new string(str.Order().ToArray());
                if (!theHash.TryGetValue(sortedStr, out var value))
                // 不含当前重排数组值时向字典中添加新的键值对 List<string> 记为 value
                // 含有时已经存在对应 List<string> value
                    theHash[sortedStr] = value = new List<string>();
                value.Add(str); // 向 value 添加未排序的原值
            }
            // 使用.Select选取所有键值对中的值 .Value
            // 使用.Cast方法强制转换到 IList<string>
            // 使用.ToList方法构成外部 List 并返回
            return theHash.Select(pair => pair.Value).Cast<IList<string>>().ToList();
        }
    }
    ```
### 进阶解法
- 使用值存储而非 string 存储
    ```cs
    public class Solution {
        public IList<IList<string>> GroupAnagrams(string[] strs) {
            // Dictionary o : long => IList<string>
            IDictionary<long,IList<string>> o = new Dictionary<long,IList<string>>();
            for (int i = 0;i<strs.Length;i++){
                long k=0;
				// 利用 string 将文本表示为 char 值的序列
                foreach(char c in strs[i])
                    k += c*c*c*c; // 记录当前 str 所有字符的四次方求和到 k
                if (o.ContainsKey(k))
                    o[k].Add(strs[i]);	// 如果 o 中存在 Key: k 则添加当前 str
                else
                    o.Add(k,new List<string>(){strs[i]}); // 不存在时添加新的键值对
            }
            return new List<IList<string>>(o.Values);	// 直接输出 o 中的所有值集合
        }
    }
    ```
- 不使用 LinQ (优化性能)
    ```cs
    public class Solution {
        public IList<IList<string>> GroupAnagrams(string[] strs)
        {
            Dictionary<string,IList<string>> dic = new ();
            foreach(var item in strs){
				// 转换 string 到 Char[] 然后使用 Array.Sort 排序
                var chars = item.ToCharArray();
                Array.Sort(chars);
				// 将 Char[] chars 转换回 string
                var sortStr = new string(chars);
				// 如果不存在重排后的string 添加空键值对
                if(!dic.ContainsKey(sortStr))
                	dic.Add(sortStr,new List<string>());
				// 若存在则对重排后的键添加原字符串
                dic[sortStr].Add(item);
            }
            return dic.Values.ToList();	// 返回所有值
        }
    }
    ```

## 128.最长连续序列
- 给定一个未排序的整数数组 `nums`
- 找出数字连续的最长序列（不要求序列元素在原数组中连续）的长度。
- 请你设计并实现时间复杂度为 $O(n)$ 的算法解决此问题。

- 难点：时间复杂度要求$O(n)$  
    => 使用更大空间复杂度
### 解法
- 使用 `HashSet<T>` 作为哈希表存储
    - 使用 `IEnumerable<T>.ToHashSet` 方法将 `int[]` => `HashSet`
        - 继承自 `IEnumerable<T>` 的实现
            - 数组类型是从抽象的基类型 `Array` 派生的。
            - 所有数组都会实现 `IList` 和 `IEnumerable`。
            - 可以使用 `foreach` 语句循环访问数组。
            - 单维数组还实现了 `IList<T>` 和 `IEnumerable<T>`。
        - 参考文档: [ToHashSet<TSource>(this IEnumerable<TSource>)](https://learn.microsoft.com/zh-cn/dotnet/api/system.linq.enumerable.tohashset?view=net-9.0#system-linq-enumerable-tohashset-1(system-collections-generic-ienumerable((-0))))
    - 使用 `IEnumerable<TSource>.Where<TSource>` 方法，实现基于谓词筛选值序列
        - 继承自 `IEnumerable` 的实现
        - 参考文档: [Where<TSource>(this IEnumerable<TSource>, Func<TSource,Boolean>)](https://learn.microsoft.com/zh-cn/dotnet/api/system.linq.enumerable.where?view=net-9.0#system-linq-enumerable-where-1(system-collections-generic-ienumerable((-0))-system-func((-0-system-boolean))))
    - 使用 `IEnumerable<TSource>.Contains<TSource>` 方法
        - 继承自 `IEnumerable` 的实现
        - 参考文档: [Contains<TSource>(this IEnumerable<TSource>, TSource)](https://learn.microsoft.com/zh-cn/dotnet/api/system.linq.enumerable.contains?view=net-9.0#system-linq-enumerable-contains-1(system-collections-generic-ienumerable((-0))-0))
    > [!note]
    > - 与 `Dictionary` 不同，`HashSet` 只存储元素本身，不存储键值对
    > - 也就是说只能查找元素，不能查找键
    > - `HashSet<T>` 的[官方文档](https://learn.microsoft.com/zh-cn/dotnet/api/system.collections.generic.hashset-1?view=net-9.0)

- 基础实现
    ```cs
    public class Solution{
        public int LongestConsecutive(int[] nums){
            // 转化为 HashSet
            var theHash = nums.ToHashSet();
            var result = 0;
            // 对 HashSet 中不存在 num-1 的值
            foreach (var num in theHash.Where(num => !theHash.Contains(num - 1))){
                // 每个键都初始化
                int currNum = num, currLen = 1;
                while (theHash.Contains(++currNum)){
                // 存在 currNum+1 时 currLen+1
                    currLen++;
                }
                // 与遍历过的 result 比较值，保留最大 result
                result = Math.Max(result, currLen);
            }
            return result;
        }
    }
    ```

### 进阶解法

### 参考链接
- [哈希表tv之苏醒后的五条排序直言会赢的惨遭O(n)腰斩](https://leetcode.cn/problems/longest-consecutive-sequence/solutions/2936118/ha-xi-biao-tvzhi-su-xing-hou-de-wu-tiao-mhz7b)
