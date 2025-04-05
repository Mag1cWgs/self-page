# Git-COMMIT 命名规范
>[!note|label:参考转载链接]
> - 参考[Angular提交信息规范](https://zj-git-guide.readthedocs.io/zh-cn/latest/message/Angular提交信息规范/#angular)
> - [知乎-阿里云开发者: 如何规范你的Git commit？](https://zhuanlan.zhihu.com/p/182553920)

commit message格式
```txt
<type>(<scope>): <subject>
```
- type(必须)
    - 用于说明git commit的类别，只允许使用下面的标识。

    - feat：新功能（feature）。
    - fix/to：修复bug，可以是QA发现的BUG，也可以是研发自己发现的BUG。
        - fix：产生 diff 并自动修复此问题。适合于一次提交直接修复问题
        - to：只产生 diff 不自动修复此问题。适合于多次提交。最终修复问题提交时使用fix
    - docs：文档（documentation）。
    - style：格式（不影响代码运行的变动）。
    - refactor：重构（即不是新增功能，也不是修改bug的代码变动）。
    - perf：优化相关，比如提升性能、体验。
    - test：增加测试。
    - chore：构建过程或辅助工具的变动。
    - revert：回滚到上一个版本。
    - merge：代码合并。
    - sync：同步主线或分支的Bug。

- scope(可选)
    - scope用于说明 commit 影响的范围，比如数据层、控制层、视图层等等，视项目不同而不同。
    - 例如在Angular，可以是location，browser，compile，compile，rootScope， ngHref，ngClick，ngView等。
    - 如果你的修改影响了不止一个scope，你可以使用*代替。

- subject(必须)
    - subject是commit目的的简短描述，不超过50个字符。
    - 建议使用中文（感觉中国人用中文描述问题能更清楚一些）。
    - 结尾不加句号或其他标点符号。

- 根据以上规范git commit message将是如下的格式：
    ```txt
    fix(DAO):用户查询缺少username属性 
    feat(Controller):用户查询接口开发
    ```

- 规范git commit到底有哪些好处呢？
    - 便于程序员对提交历史进行追溯，了解发生了什么情况。
    - 一旦约束了commit message，意味着我们将慎重的进行每一次提交，不能再一股脑的把各种各样的改动都放在一个git commit里面，这样一来整个代码改动的历史也将更加清晰。
    - 格式化的commit message才可以用于自动化输出Change log。
    - 监控服务

# 如何设置 GIT 提交屏蔽
>[!note]
> - [Git 如何永久阻止特定部分的文件提交到git中](https://deepinout.com/git/git-questions/323_git_how_to_permanently_prevent_specific_part_of_a_file_from_being_committed_in_git.html)
> - [有三种方法可以实现忽略Git中不想提交的文件](https://blog.csdn.net/hjc_042043/article/details/135965334)

- 前提
```bash
git config --global core.autocrlf false
git config --global core.filemode false
git config --global core.safecrlf true
```

## Git 库中文件的四种状态
- Untracked:
    - 未跟踪, 此文件在文件夹中, 但并没有加入到git库, 不参与版本控制. 
    - 通过 git add 状态变为Staged.
- Unmodify:
    - 文件已经入库, 未修改, 即版本库中的文件快照内容与文件夹中完全一致. 
    - 这种类型的文件有两种去处, 如果它被修改,而变为 Modified. 
    - 如果使用 `git rm` 移出版本库, 则成为Untracked文件
- Modified:
    - 文件已修改, 仅仅是修改, 并没有进行其他的操作. 
    - 这个文件也有两个去处
    - 通过 `git add` 可进入暂存 staged 状态,
    - 使用 `git checkout` 则丢弃修改过, 返回到 unmodify 状态, 这个 `git checkout` 即从库中取出文件, 覆盖当前修改
- Staged:
    - 暂存状态.
    - 执行 `git commit` 则将修改同步到库中, 这时库中的文件和本地文件又变为一致, 文件为 Unmodify状态.
    - 执行 `git reset HEAD filename` 取消暂存, 文件状态为Modified

- 其中状态 untracked 和 not staged的区别
    1. untrack     表示是新文件，没有被add过，是为跟踪的意思。
    2. not staged  表示add过的文件，即跟踪文件，再次修改没有add，就是没有暂存的意思

## 设置 .gitignore 文件
### 全局
- 在任意位置建立一个 `.gitignore` 文件，然后使用命令
```bash
git config --global core.excludesfile 目标目录/.gitignore
```

### 项目
- 长期
    - 在项目目录下建立 `.gitignore` 
- 临时
    - 编辑 .git/info/exclude 文件
    - 这种方式指定的忽略文件的根目录是项目根目录。

## 对远程库的操作
- 如果已经上传到远程服务器，使用如下命令
```bash
git rm -r –cached 目标文件路径
```
