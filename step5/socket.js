module.exports = function(http){
    //待处理任务
    var task = [];
    //正在处理任务量
    var flag = 0;
    //要处理的目标任务  String
    var queryTarget = '';
    var io = require('socket.io')(http);
    var child_process = require('child_process');
    var exec = child_process.exec;
    var https = require('https');
    var fs = require('fs');
    var uuid = require('node-uuid'); 
    var insert = require('./model.js').insert;

    io.on('connection', function(socket){
        socket.on('query', function(data){
            var temp,singletask;
            singletask = convertQuery(data, socket);
            //所有任务数
            socket.allTaskLength = singletask.length;
            //完成的任务数
            socket.complishLength = 0;
            while(temp = singletask.shift()){
                //添加至总的任务中
                task.push(temp);
            }
            //执行任务
            todoTask(task);
        })
    })
    function todoTask(task){
        while(flag<5){           
            queryTarget = task.shift();
            //没有待处理的任务
            if(!queryTarget)  break;
            //任务数+1
            flag += 1;
            console.log(flag);
            Exec(queryTarget.ower);
        }
    }
    //处理返回的数据  下载图片 插入数据库
    function Exec(socket){
        exec(`phantomjs task.js ${queryTarget.query}`, function(err, stdout, stderr){
            var data = JSON.parse(stdout);
            var picTaskList = [];
            //抓取失败
            if(!data.code){
                socket.emit('msg', 'failed');
                return;
            }
			//下载图片
			//这里考虑采用并发请求  所有请求结束后才能插入数据库
			data.dataList.forEach(function(item, index){
				if(item.pic){
				   picTaskList.push(new Promise(function(resolve, reject){
					   https.get(item.pic, function(res){
							var imgId = uuid.v4();
							var cache = '';
							res.setEncoding('binary');
							res.on('data', function(chunk){
								cache += chunk;
							})
							res.on('end', function(){
								fs.writeFile(`./public/pic/${imgId}.png`, cache, 'binary', function(err){
									resolve({
										imgId : imgId,
										index : index
									})
								})
							})
					   })
				   })) 
				}
			})
	
			//插入数据库
			Promise.all(picTaskList).then(function(picMsg){
				picMsg.forEach(function(pic){
					data.dataList[pic.index].imgId = pic.imgId;
				})
	
				insert({
					key : data.word,
					time : data.time,
					data : data.dataList,
					device : data.device,
                    pageNum : data.pageNum
				}).then(function(){
                    socket.complishLength += 1;
                    data.dataList.forEach(function(item){
                        item.device = data.device;
                        item.pageNum = data.pageNum;
                    })
					socket.emit('msg', {
                        dataList : data.dataList,
                        complishPercentage : socket.complishLength / socket.allTaskLength
                    });
				}).catch(function(err){
					socket.emit('msg', 'failed');
				})
			})

            flag -= 1;
            todoTask(task);
        })
    }
    //根据参数转换query
    function convertQuery(data, socket){
        var singletask = [];
        data.devices.forEach(function(device){
            for(var i=0; i<data.pageNum; i++){
                singletask.push({
                    query : `${data.key} ${device} ${10*i}`,
                    ower : socket
                })
            }
        })
        return singletask;
    }
}