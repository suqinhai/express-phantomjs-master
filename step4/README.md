# 分析
#### 相较于任务三，任务四有如下改进：
- 请求是通过ajax发出
- 需要将图片下载至本地
# 实现
#### 这里我偷了个懒，使用了vue（省去了繁琐的字符串拼接操作），异步请求配合vue-resource,引入了bootstrap。
- ajax请求
#### 点击按钮的时候发出ajax请求即可，在vue中如下：

```
submit : function(){
    //key 输入的关键字
    //device  选择的设备信息
    this.$http.get('/api', { params : { key : this.key, device : this.device} }).then(function(res){
        // do something with res
    })
}
```
- 下载图片至本地
#### 主要利用https模块

```
https.get(url, function(res){
    //do something with res
})
```
#### 这里有一个需要思考的地方。有缩略图的条目需要下载图片至本地并生成唯一id，最后将所有的信息插入数据库。首先可能不止一个条目有缩略图，所以考虑发起并发请求，其次需要考虑什么什么时候将信息插入数据库，我认为将所有图片下载至本地后即所有异步任务都结束时插入数据库是比较合适的，利用Promise.all()。

```
//taskList存储promise
var taskList = [];
//imgList需要下载的图片队列
imgList.forEach(function(item){
    taskList.push(new Promise(function(resolve, reject){
        https.get(item.url, function(res){
            resolve(res);
        })
    }))
})

Promise.all(taskList).then(function(resList){
    //do something with resList
})
```
![image](https://github.com/zyl1314/express-phantomjs/blob/master/step4/public/pic/img.gif)