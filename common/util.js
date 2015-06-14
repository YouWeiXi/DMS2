var http = require('http');
var iconv = require('iconv-lite');
/**
 *
 * @param options 为http options  增加encoding 属性
 *                  或 {url:xx,encoding:gbk}
 * @param callback
 */
exports.get = function(options  ,callback){
    var url=options.url;
    var req = http.get(url?url:options , function(res){
        var buffer = '';
        res.on('data' , function(data){
//            console.log('on data : ' + data);
            if(options.encoding){
                data=iconv.decode(data, options.encoding)
            }
            buffer += data;
        });
        res.on('end' , function(){
//            console.log('get end : ' + buffer);
            callback(buffer);
        });
    });
};