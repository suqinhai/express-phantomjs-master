var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('./socket.js')(http);
var config = require('./config');

//静态服务器
app.use('/', express.static(__dirname + '/public'));

//启动服务器
http.listen(config.port, function(){
     console.log('app listening...');
})