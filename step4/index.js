var express = require('express');
var path = require('path');
var router = require('./router');
var config = require('./config');

var app = express();


//路由
app.use(router);

app.listen(config.port, function(){
     console.log('app listening...');
})