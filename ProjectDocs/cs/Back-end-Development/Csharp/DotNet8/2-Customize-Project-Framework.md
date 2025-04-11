

# 2-自定义项目框架

## 2-1自定义项目框架模板——如何进行Nuget包打包
- [参考链接](https://www.bilibili.com/video/BV13g4y1Z7in)

- 核心文件
    - content
        - 放置所有源码
        - 不放置 obj 和 bin（但是有 .gitignore .gitattributes .sln和 README.md）
        - 另外需要有一个子文件夹 .template.config
            - 有子文件 `template.json` 内容如下
            ```json
            {
                $schema": "http://json.schemastore.org/template"
                "author": "作者",
                "classifications": [ "Web/WebAPI" 类型],
                "name": "包体显示名",
                "identity": "包体的唯一身份名"
                "shortName": "简称"
                "tags": {
                    "language": "C#语言",
                    "type":"project类型"
                },
                "sourceName":"启动项目名，也是使用模板时被替换的名字"
                "preferNameDirectory": true
            }
            ```
    - license
        - 可以放空 `license.txt`
    - 包体的唯一身份名.nuspec
        ```xml
        <?xml version="1.0" encoding="utf-8"?>
        <package xmlns="http://schemas.microsoft.com/packaging/2012/06/nuspec.xsd">
            <metadata>
                <id>包体的唯一身份名</id>
                <version>版本号</version>
                <description>包描述</description>
                <authors>包作者</authors>
                <packageTypes>
                    <packageType name="Template"/>
                </packageTypes>
                <licenseUrl>许可声明的完整URL</licenseUrl>
                <projectUrl>项目的托管地址完整URL</projectUrl>
                <iconUrl>包体图标的完整URL</iconUrl>
                <copyright>版权声明标识</copyright>
                <tags>包体的标签</tags>
            </metadata>
        </package>
        ```

- 在准备好核心文件后通过命令行来生成项目
    - 可以建立 `Package.bat` 来实现一键打包
    - .bat 脚本内容如下
        ```bash
        nuget package 包体的唯一身份名.nuspec

        pause
        ```
    - 只需要双击运行就可以尝试构建程序包
- 生成好后会出现文件「包体的唯一身份名.版本号.nupkg」

- 使用只需要下载文件然后执行命令行去安装
    - 使用整个文件，需要将上面的 .nupkg 拷贝过来
    - 然后在目标路径下
        - 如果已经上传官网，则无需填入相对路径，可以直接官网下载
        - 实际 `-u` 是删除原有包体（避免版本问题），`-i` 是新建
        ```bash
        dotnet new -u 包体名
        dotnet new -i [相对路径/]包体的唯一身份名.版本号.nupkg
        dotnet new --list
        pause
        ```
- 具体使用
    - 可以直接使用命令行形式新建
        ```bash
        dotnet new -i 包体名
        set /p OP=请输入创建项目名:
        md .输入的项目名
        cd .输入的项目名
        dotnet new 上面包体的简短名 -n %OP%
        cd ../
        ```
    - 也可以直接用 Visual Studio 直接创建


---

