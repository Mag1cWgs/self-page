## 1 什么是LINQ
- LINQ使程序员可以使用类似SQL的语言来操作多种数据源。
- 例如,可以使用C#来查询：
    - Access 数据库
    - ADO.NET数据集
    - XML
    - 文档
    - 以及任何实现 `IEnumerable` 接口或 `IEnumerable<T>` 泛型接口的 .NETFramework 集合类。
- LINQ定义了一组可以在 .NETFramework 3.5 及以上版本中使用的通用标准查询运算
符，使用这些标准查询运算符可以投影、筛选和遍历内存中的上述数据集中的数据。

## 2 LINQ 提供程序
- LINQ提供程序将LINQ查询映射到要查询的数据源。
- 在编写LINQ查询时,提供程序接受该查询并将其转换为数据源能够执行的命令。
    - 提供程序还将数据源中的数据转换为组成查询结果的对象。
    - 最后,当向数据源发送更新时,它能够将对象转换为数据。C#包含以下LINQ 提供程序。
1. LINQ to Objects
    - 使用 LINQ to Objects 提供程序可以查询内存中的集合和数组。
    - 如果对象支持 `IEnumerable` 或 `IEnumerable<T>` 接口,则可以使用 LINQ to Objects 提供程序对其进行查询。
    - 用户可以通过导人 `System.Linq` 命名空间来启用 LINQ to Objects 提供程序,在默认情况下为所有的C#项目导入该命名空间。
2. LINO to DataSet
    - 使用 LINQ to DataSet 提供程序可以査询和更新ADO.NET数据集中的数据,可以将 LINQ 功能添加到使用数据集的应用程序中,以便简化和扩展对数据集中的数据进行查询、聚合和更新的功能。
3. LINO to SOL
    - 使用LINQtoSQL,提供程序可以查询和修改SQL Server 数据库中的数据,这样就可以轻松地将应用程序的对象模型映射到数据库中的表和对象。
    - C#通过包含对象关系设计器(O/R设计器)使LINQtoSQL更加易于使用,此设计器用于在应用程序中创建映射到数据库中的对象的对象模型。
    - 说明:
        从.NET Framework3.5开始,LINQtoSQL被 LINQ toEntities 替代,微软宣布不再提供 LINQ to SQL 更新,但它仍然被支持。
4. LINO to Entities
    - 在使用 LINQ to Entities 时,LINQ查询在后台转换为 SQL,查询,并在需要数据的时候执行,即开始枚举结果的时候执行。
    - LINQtoEntities还为获取的所有数据提供变化追踪,也就是说,可以修改查询获得的对象,然后整批同时把更新提交到数据库，
5. LINO to XML
    - 使用LINQtoXML提供程序可以查询和修改XML,既可以修改内存中的XML,也可以从文件加载XML以及将XML保存到文件中。
