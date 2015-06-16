/**
 * Created by zoey on 2015/6/11.
 */
var fairDao = require('../dao/fair');
var response = require('../common/response');
var formidable=require('formidable');
var fs 		   = require('fs');
var path 	   = require('path');
var xlsx = require('node-xlsx');
var config = require('../config').config;
exports.init=function (req, res) {
    for(var i=0;i<20;i++){
        fairDao.save({
            chnName: i++,
            engName: 'a',
            time: new Date(),
            position: 'a',
            period: 2,
            firstYear: 1987,
            hallName: 'a',
            sponsors: {},
            undertakers: {},
            categories: 'a',
            lastYearInfo: 'a',
            exhibitionAgent: 'a',
            setupAgent: 'a',
            shippingAgent: 'a',
            website: 'a',
            logo: 'a',
            advertisement: {}
        },function(err,list){
            if(err){
                return res.json(response.buildError(err.code));
            }
            res.json(response.buildOK());
        });
    }
};
exports.save=function (req, res) {
    fairDao.save(req.body,function(err,list){
        if(err){
            return res.json(response.buildError(err.code));
        }
        res.json(response.buildOK());
    });
};
exports.find=function (req, res) {
    fairDao.find(req.query,function(err,list){
        if(err){
            return res.json(response.buildError(err));
        }
        res.json(response.buildOK(list));
    });
};
exports.update=function (req, res) {
    fairDao.update(req.body,function(err,list){
        if(err){
            console.log(err)
            return res.json(response.buildError(err));
        }
        res.json(response.buildOK());
    });
};
exports.remove=function (req, res) {
    fairDao.remove(req.query,function(err,list){
        if(err){
            return res.json(response.buildError(err.code));
        }
        res.json(response.buildOK());
    });
};
/**
 * 导入模块
 **/
exports.import = function(req, res) {
    var form = new formidable.IncomingForm();
    form.type = 'multipart';
    form.multiples = true;
    // Parse file.
    form.parse(req, function(err, fields, files) {
        if(files) {
            var file=files.uploadfile;
            // Read file.
            fs.readFile(file.path, function (err, data) {
                var name=new Date().getTime()+'.'+file.name.split('\.')[1];
//                var name=uuid.v1()+'.'+item.name.split('\.')[1];
                var p = path.join(config.upload_dir, name);
                // Save file.
                fs.writeFile(p, data, 'utf8', function (err) {
                    if (err) {
                        console.log(err)
                        return res.json(response.buildError('Something went wrong!'));
                    } else {
                        var xlsObject = xlsx.parse(p);
                        console.log(JSON.parse(JSON.stringify(xlsObject[0].data)))
                        var data=xlsObject[0].data;
                        for(var i= 1;i<data.length;i++){
                            var fair={};
                            for(var j=0;j<data[0].length;j++){
                                fair[data[0][j]]=data[i][j];
                            }
                            fairDao.save(fair,function(err,list){
                                console.log(err)
                            });
                            if(i==data.length-1){
                                res.json(response.buildOK());
                            }
                        }
                    }
                });
            });
        } else {
            return res.json(response.buildError('Did not receive any file!'));
        }
    });
};