var page = require('webpage').create();
var system = require('system');
//读取配置
var config = require('./config.js');
var device = config[system.args[2]];
//设置设备尺寸
page.viewportSize = {
  width: device.width,
  height: device.height
};
//设置浏览器信息
page.settings.userAgent = device.ua;
//记录开始时间
var t = Date.now();

page.open('https://www.baidu.com/s?wd=' + system.args[1], function(status){
    if(status !== 'success'){
        console.log(JSON.stringify({
            code : 0,
            msg : '抓取失败',
            word : system.args[1],
            device : device
        }))
       phantom.exit();
    }
    page.includeJs("http://ajax.googleapis.com/ajax/libs/jquery/1.6.1/jquery.min.js",function(){
        var data = page.evaluate(function(){
            var data = {
                dataList : []
            };
            $('.c-container').each(function(index, element){
                data.dataList.push({
                    title : $(element).find('h3 a').text(),
                    info : $(element).find('.c-abstract').text(),
                    link : $(element).find('h3 a').attr('href'),
                    pic : $(element).find('.c-img').attr('src')
                })
            })
            return data;
        })
        //The execution is “sandboxed”, there is no way for
        // the code to access any JavaScript objects 
        //and variables outside its own page context. 
        data.code = 1;
        data.msg = '抓取成功';
        data.word = system.args[1];
        data.time = Date.now() - t;
        data.device = device;

        console.log(JSON.stringify(data));
        
        phantom.exit();
    })
})