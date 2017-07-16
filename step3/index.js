var express = require('express');
var insert = require('./model.js').insert;
var child_process = require('child_process');
var exec = child_process.exec;
var config = require('./config');

var app = express();

app.use(function(req, res){
    //关键字
    var key = req.query.key;
    //设备
    var device = req.query.device;

    exec('phantomjs task.js ' + key + ' ' + device, function(err, stdout, stderr){
        var data = JSON.parse(stdout);
        //抓取失败
        if(!data.code){
            res.send('抓取失败');
        }
        //插入数据库
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
}).listen(config.port, function(){
    console.log('app listening...')
})