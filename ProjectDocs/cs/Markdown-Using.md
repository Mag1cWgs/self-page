# Markdown学习笔记
[MarkDown使用指南](https://www.runoob.com/markdown/md-tutorial.html)


---


## 当前文档目标格式
本网站 Markdown 文档尽量按照下列格式书写：
``` Markdown
# 一级标题

> 前言

## 目录
- 目录1
    - 目录1.1
    - 目录1.2
- 目录2


---


## 目录1
> 本章任务
> 或者本章参考链接
> 或者序言


### 目录1.1
> 本节任务

本节正文

#### 1. 节内小节1
1.1.1小节正文

#### 2. 节内小节1
1.1.2小节正文

### 目录1.2
> 本节任务

本节正文

#### 1. 节内小节1
1.2.1小节正文

#### 2. 节内小节1
1.2.2小节正文
```参考链接```
[1][链接显示名称](链接地址)


---


## 目录2
> 本章任务
> 或者本章参考链接
> 或者序言


### 目录2.1
> 本节任务

本节正文

#### 1. 节内小节1
2.1.1小节正文

#### 2. 节内小节1
2.1.2小节正文

```参考链接```
[1][链接显示名称](链接地址)

```


---


## 基本语法


### 任务列表
- [x] @mentions, #refs, [links](), **formatting**, and <del>tags</del> supported
- [x] list syntax required (any unordered or ordered list supported)
- [x] this is a complete item
- [ ] this is an incomplete item

### 表格
First Header | Second Header
------------ | -------------
Content from cell 1 | Content from cell 2
Content in the first column | Content in the second column

### ~~上标~~
~~30^th^~~

### ~~下标~~
~~H~2~O~~

### ~~脚注~~
~~Content [^1]~~
~~[^1]: Hi! This is a footnote~~

### ~~缩略~~

~~*[HTML]: Hyper Text Markup Language~~  
~~*[W3C]: World Wide Web Consortium~~ 
~~The HTML specificationis maintained by the W3C.~~  

```
*[HTML]: Hyper Text Markup Language

*[W3C]: World Wide Web Consortium

The HTML specification

is maintained by the W3C.
```

### ~~标记~~

~~==marked==~~

```==marked==```

### 文字处理

*这会是 斜体 的文字*  
_这会是 斜体 的文字_  
**这会是 粗体 的文字**  
__这会是 粗体 的文字__  
_你也可以 **组合** 这些符号_  
~~这个文字将会被横线删除~~  

```
*这会是 斜体 的文字*
_这会是 斜体 的文字_
**这会是 粗体 的文字**
__这会是 粗体 的文字__
_你也可以 **组合** 这些符号_
~~这个文字将会被横线删除~~
```

### 导入图片

![mino](/images/mino.png)  
格式为 ![Alt Text](url)  

```
![mino](/images/mino.png)
```

### 链接

https://github.com - 自动生成！  
[GitHub](https://github.com)


```
https://github.com - 自动生成！
[GitHub](https://github.com)
```
