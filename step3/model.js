var mongoose = require('mongoose');
var config = require('./config');

//链接数据库
mongoose.connect(config.mongodb);

//定义Schame
var phantomSchema = new mongoose.Schema({
    key : String,
    time : Number,
    data : [],
    device : {}
})

var phantom = mongoose.model('phantom', phantomSchema);


module.exports.insert = function(data){
    return phantom
        .create(data);
}