var http = require('http');
var fs 		   = require('fs');
var path 	   = require('path');
var config = require('../config').config;
exports.handleUpload = function(file,callback){
    if(file.size==0){
        return callback()
    }
    // Read file.
    fs.readFile(file.path, function (err, data) {
        var name=new Date().getTime()+'.'+file.name.split('\.')[1];
        var p = path.join(config.upload_dir, name);
        // Save file.
        fs.writeFile(p, data, 'utf8', function (err) {
            if (err) {
                console.log(err)
                return callback(err)
            } else {
                return callback(err,name,p)
            }
        });
    });
}