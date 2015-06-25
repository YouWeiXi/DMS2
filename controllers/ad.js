/**
 * Created by zoey on 2015/6/11.
 */
var formidable=require('formidable');
var fs 		   = require('fs');
var path 	   = require('path');
var adDao = require('../dao/ad');
var response = require('../common/response');
var config = require('../config').config;
exports.save=function (req, res) {
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
                            adDao.save(fields,function(err,list){
                                if(err){
                                    return res.json(response.buildError(err.code));
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
    adDao.remove(req.query,function(err,list){
        if(err){
            return res.json(response.buildError(err.code));
        }
        res.json(response.buildOK());
    });
};