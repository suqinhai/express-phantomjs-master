var express = require('express');
var https = require('https');
var fs = require('fs');
var uuid = require('node-uuid');
var router = express.Router();
var child_process = require('child_process');
var exec = child_process.exec;
var insert = require('./model.js').insert;

router.use('/', express.static(__dirname + '/public'));

router.get('/api', function(req, res){
    var key = req.query.key;
    var device = req.query.device;
    
    exec('phantomjs task.js ' + key + ' ' + device, function(err, stdout, stderr){
        var data = JSON.parse(stdout);
        var picTaskList = [];
        //抓取失败
        if(!data.code){
            res.send('抓取失败');
        }

        //下载图片
        //这里考虑采用并发请求  所有请求结束后才能插入数据库
        data.dataList.forEach(function(item, index){
            if(item.pic){
               picTaskList.push(new Promise(function(resolve, reject){
                   https.get(item.pic, function(res){
                        var id = uuid.v4();
                        var cache = '';
                        res.setEncoding('binary');
                        res.on('data', function(chunk){
                            cache += chunk;
                        })
                        res.on('end', function(){
                            fs.writeFile(`./public/pic/${id}.png`, cache, 'binary', function(err){
                                if(err) console.log(err);
                                resolve({
                                    id : id,
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
                data.dataList[pic.index].id = pic.id;
            })

            insert({
                key : data.word,
                time : data.time,
                data : data.dataList,
                device : data.device
            }).then(function(){
                res.json(data);
            }).catch(function(err){
                res.end('插入数据库失败');
            })
        })

    })

})

module.exports = router;