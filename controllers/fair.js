/**
 * Created by zoey on 2015/6/11.
 */
var fairDao = require('../dao/fair');
var response = require('../common/response');
var formidable=require('formidable');
var xlsx = require('node-xlsx');
var util = require('../common/util');

exports.save=function (req, res) {
    var form = new formidable.IncomingForm();
    form.type = 'multipart';
    form.multiples = true;
    // Parse file.
    form.parse(req, function(err, fields, files) {
        if(files) {
            var file=files.logofile;
            util.handleUpload(file,function(err,name){
                if (err) {
                    console.log(err)
                    return res.json(response.buildError('Something went wrong!'));
                } else {
                    if(fields){
                        if(name!=null){
                            fields.logo=name;
                        }
                        fairDao.save(fields,function(err,list){
                            if(err){
                                return res.json(response.buildError(err.code));
                            }
                            res.json(response.buildOK());
                        });
                    }
                }
            })
        } else {
            return res.json(response.buildError('Did not receive any file!'));
        }
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
    var form = new formidable.IncomingForm();
    form.type = 'multipart';
    form.multiples = true;
    // Parse file.
    form.parse(req, function(err, fields, files) {
        if(files) {
            var file=files.logofile;
            util.handleUpload(file,function(err,name){
                if (err) {
                    return res.json(response.buildError('Something went wrong!'));
                } else {
                    if(fields){
                        if(name!=null) {
                            fields.logo = name;
                        }
                        fairDao.update(fields,function(err,list){
                            if(err){
                                console.log(err)
                                return res.json(response.buildError(err));
                            }
                            res.json(response.buildOK());
                        });
                    }
                }
            })
        } else {
            return res.json(response.buildError('Did not receive any file!'));
        }
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
            util.handleUpload(file,function(err,name,p){
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
            })
        } else {
            return res.json(response.buildError('Did not receive any file!'));
        }
    });
};
exports.findName=function (req, res) {
    fairDao.findName(function(err,list){
        if(err){
            return res.json(response.buildError(err));
        }
        res.json(response.buildOK(list));
    });
};
exports.findOne=function (req, res) {
    fairDao.findOne(req.query.id,function(err,docs){
        if(err){
            return res.json(response.buildError(err));
        }
        res.json(response.buildOK(docs));
    });
};
exports.removeAd=function (req, res) {
    //移除fair内ad
    fairDao.removeAdByOne(req.query.fairId,req.query.type,req.query.adId,function(err,doc){
        if(err){
            return res.json(response.buildError(err.code));
        }
        res.json(response.buildOK());
    });
};
exports.addAd=function (req, res) {
    console.log(req.query)
    //更新fair内ad
    fairDao.addAd(req.query.fairId,req.query.type,req.query.adId,function(err,doc){
        if(err){
            return res.json(response.buildError(err.code));
        }
        res.json(response.buildOK());
    });
};
exports.byAd=function (req, res) {
    //更新fair内ad
    fairDao.findbyAd(req.query.adId,function(err,doc){
        if(err){
            console.error(err)
            return res.json(response.buildError(err.code));
        }
        res.json(response.buildOK(doc));
    });
};