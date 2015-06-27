/**
 * Created by zoey on 2015/6/11.
 */
var formidable=require('formidable');
var fs 		   = require('fs');
var path 	   = require('path');
var adDao = require('../dao/ad');
var fairDao = require('../dao/fair');
var response = require('../common/response');
var config = require('../config').config;
exports.save=function (req, res) {
    var form = new formidable.IncomingForm();
    form.type = 'multipart';
    form.multiples = true;
    // Parse file.
    form.parse(req, function(err, fields, files) {
        if(files.adlogofile) {
            var file=files.adlogofile;
            // Read file.
            fs.readFile(file.path, function (err, data) {
                var name=new Date().getTime()+'.'+file.name.split('\.')[1];
                var p = path.join(config.upload_dir, name);
                // Save file.
                fs.writeFile(p, data, 'utf8', function (err) {
                    if (err) {
                        console.log(err)
                        return res.json(response.buildError('Something went wrong!'));
                    } else {
                        if(fields){
                            fields.pic=name;
                            save(fields,res)
                        }
                    }
                });
            });
        } else {
            save(fields,res);
        }
    });
};
var save=function(fields,res){
    //保存广告
    adDao.save(fields,function(err,doc){
        //更新fair
        fairDao.addAd(fields.fairId,fields.type,doc._id,function(err,doc){
            if(err){
                return res.json(response.buildError(err.code));
            }
            res.json(response.buildOK());
        })
    });
}
exports.find=function (req, res) {
    adDao.find(req.query,function(err,list){
        if(err){
            return res.json(response.buildError(err));
        }
        res.json(response.buildOK(list));
    });
};
exports.update=function (req, res) {
    var form = new formidable.IncomingForm();
    form.type = 'multipart';
    form.multiples = true;
    // Parse file.
    form.parse(req, function(err, fields, files) {
        if(files) {
            var file=files.adlogofile;
            // Read file.
            fs.readFile(file.path, function (err, data) {
                var name=new Date().getTime()+'.'+file.name.split('\.')[1];
                var p = path.join(config.upload_dir, name);
                // Save file.
                fs.writeFile(p, data, 'utf8', function (err) {
                    if (err) {
                        console.log(err)
                        return res.json(response.buildError('Something went wrong!'));
                    } else {
                        if(fields){
                            fields.pic=name;
                            adDao.update(fields,function(err,list){
                                if(err){
                                    console.log(err)
                                    return res.json(response.buildError(err));
                                }
                                res.json(response.buildOK());
                            });
                        }
                    }
                });
            });
        } else {
            return res.json(response.buildError('Did not receive any file!'));
        }
    });
};
exports.remove=function (req, res) {
    adDao.remove(req.query._id,function(err,list){
        //更新fair
        fairDao.removeAd(req.query.fairId,req.query.type,req.query._id,function(err,doc){
            if(err){
                return res.json(response.buildError(err.code));
            }
            res.json(response.buildOK());
        })
    });
};