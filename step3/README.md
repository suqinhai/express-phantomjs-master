# 分析
#### 按照肖老师发布的任务简要分析，需要实现以下几块：
- 需要一个服务器
- 可以接受地址栏输入的参数
- 开启本地进程
- 数据库的使用
# 实现
## 搭建服务器
#### 这里我偷懒了，直接使用了express

```
var express = require('express');
var app = express();
```

## 接受参数

```
app.use(function(req, res){
    //参数
    req.query 
})
```
## 开启本地进程

```
var child_process = require('child_process');
exec('phantomjs task.js', function(err, stdout, stderr){
    // do something with stdout
})
```
## 插入数据库
#### 数据库采用mongodb，利用mongoose简化操作
#### mongoose是文档对象模型

###### *细节见源码*