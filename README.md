### ESRI 历史地理
#### Step-by-Step tutorial

##### 首先将本仓库克隆到本地(download or clone)
- 可以直接右上角download后解压
- 或者安装git [https://git-scm.com/downloads/] 并在命令行(CMD or PowerShell or Bash) 执行以下
```
git clone https://github.com/hjylxmhzq/ESRI.git
```

##### 安装Node.js
从 [https://nodejs.org/zh-cn/] 下载最新稳定版Node.js并安装

##### 安装依赖包
在命令行中切换至上面的解压目录，然后执行一下命令安装依赖
```
npm install
```
##### 调试
最后使用以下命令测试
```
npm start
```
##### build
生产环境用以下命令build，输出在build文件夹中
```
npm run build
```