# 分析
#### 任务又改进了一些，主要有：
- 可以抓取多页
- 可以选择多个设备
- 利用web socket通信
#### 需要注意：每个phantomjs任务只执行一次抓取。同时允许nodejs调起最大5个phantomjs的进程
# 实现
#### 先想一下大体思路，这里不同于任务四的主要一点是采用的web socket通信，每次服务器抓取一页完成后将结果推送至客户端（我感觉这是web socket最具优势的地方，可以主动向客户端推送消息）。
- #### 首先服务端需要一个待处理任务队列，每次收到请求往队列添加任务，完成任务后将任务从队列删除


```
//客户端

//向服务端发送请求
socket.emit('query', {
    // 查询关键字
    key
    // 查询页数
    pageNum
    // 查询设备
    devices
})
```

```
//服务端

//待处理任务队列
var task = [];
io.on('connection', function(socket){
    socket.on('query', function(data){
        //添加至总的任务中 
        task = task.concat(convertQuery(data, socket));
        //执行任务  每次有请求都会执行任务
        todoTask(task);
    })
})
```
```
//将客户端请求转换为一个任务数组
function convertQuery(data, socket){
    var task = [];
    
    // do something
    
    return task;
}

//返回格式如下
[
    { query : 'hello iphone6 第一页'， ower : socket },
    .
    .
]
//注意这里我将socket传了进来  因此每个任务都有对应的socket
```
- #### todoTask的实现需要考虑多进程限制数的问题
#### 采用常规的方法，在外部定义一个全局变量flag，每执行一个任务flag+=1，当flag等于限制数时不再执行，同时每个任务完成时flag-=1并重新执行任务队列。

```
var flag = 0;

function todoTask(task){
    while(flag < 5){
        flag += 1;
        //获取任务 并从任务队列删除
        query = task.shift();
        //处理任务
        processTask(query);
    }
}

function processTask(query){
    //任务完成后 flag-=1 重新执行任务队列
    process(query, function(){
        flag -= 1;
        todoTask(task);
    })
}
```
#### 下图是flag的变化，可以看到进程数达到5个时便不再增加
![image](https://github.com/zyl1314/express-phantomjs/blob/master/step5/public/pic/img1.gif)
#### 测试
![image](https://github.com/zyl1314/express-phantomjs/blob/master/step5/public/pic/img2.gif)