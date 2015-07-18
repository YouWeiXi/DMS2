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
        fields.categories=fields.category.split(',');
        var file=files.logofile;
        if(file) {
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
            fairDao.save(fields,function(err,list){
                if(err){
                    return res.json(response.buildError(err.code));
                }
                res.json(response.buildOK());
            });
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
        fields.categories=fields.category.split(',');
        var file=files.logofile;
        if(file) {
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
            fairDao.update(fields,function(err,list){
                if(err){
                    console.log(err)
                    return res.json(response.buildError(err));
                }
                res.json(response.buildOK());
            });
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
//                    console.log(JSON.parse(JSON.stringify(xlsObject[0].data)))
                    var data=xlsObject[0].data;
                    var fairlist=[];
                    var results=[];
                    for(var i= 1;i<data.length;i++){
                        var fair={
                            lastInfo:{},
                            sponsors:[],
                            undertakers:[],
                            categories:[]
                        };
                        for(var j=0;j<data[0].length;j++){
                            if(data[i][j]==null||data[i][j]==''){
                                continue;
                            }
                            if(data[0][j]=='lastInfo'){
                                var lastInfo=data[i][j].split('|');
                                if(lastInfo[0]!=''&&lastInfo[0]!=undefined){
                                    fair.lastInfo.exhibitionNum=lastInfo[0];
                                }
                                if(lastInfo[1]!=''&&lastInfo[1]!=undefined) {
                                    fair.lastInfo.audienceNum = lastInfo[1];
                                }
                                if(lastInfo[2]!=''&&lastInfo[2]!=undefined) {
                                    fair.lastInfo.fairArea = lastInfo[2];
                                }
                            }else if(data[0][j]=='category'){
                                if(data[i][j])
                                var category=data[i][j].split('$');
                                for(var m in category){
                                    fair.categories.push(category[m]);
                                }
                            }else if(data[0][j]=='sponsor'||data[0][j]=='undertaker'){
                                var array=data[i][j].split('|');
                                for(var m in array){
                                    var values=array[m].split('$');
                                    var a={};
                                    if(values[0]!=''&&values[0]!=undefined) {
                                        a.name=values[0]
                                    }
                                    if(values[1]!=''&&values[1]!=undefined) {
                                        a.tel=values[1]
                                    }
                                    if(values[2]!=''&&values[2]!=undefined) {
                                        a.fax=values[2]
                                    }
                                    if(values[3]!=''&&values[3]!=undefined) {
                                        a.email=values[3]
                                    }
                                    if(data[0][j]=='undertaker'){
                                        fair.undertakers.push(a);
                                    }else{
                                        fair.sponsors.push(a);
                                    }
                                }
                            }else{
                                fair[data[0][j]]=data[i][j];
                            }
                        }
                        checkFair(fair,results,i)
                        fairlist.push(fair);
                        if(i==data.length-1){
                            if(results.length>0){
                                res.json(response.buildError(results));
                            }else{
                                fairlist.forEach(function(item,index){
                                    fairDao.save(item,function(error,list){
                                        if(error){
                                            console.error(error+'-- '+list)
                                        }
                                    });
                                    if(index==fairlist.length-1){
                                        res.json(response.buildOK());
                                    }
                                })
                            }
                        }
                    }
                }
            })
        } else {
            return res.json(response.buildError('Did not receive any file!'));
        }
    });
};
var checkFair=function(fair,results,index){
    if(!fair.chnName||fair.chnName==''){
        results.push('['+(index+1)+']'+'   chnName 不能为空')
    }
    if(!fair.time||fair.time==''){
        results.push('['+(index+1)+']'+'   time 不能为空')
    }
    if(!fair.position||fair.position==''){
        results.push('['+(index+1)+']'+'   position 不能为空')
    }
    if(fair.period){
        if(fair.period<0||fair.period>10){
            results.push('['+(index+1)+']'+'   period 为'+fair.period+'. 必须大于等于0 小于等于10')
        }
    }
    if(fair.firstYear){
        if(fair.firstYear<1600||fair.firstYear>2200){
            results.push('['+(index+1)+']'+'   firstYear 为'+fair.firstYear+'. 必须大于1600 小于等于2200')
        }
    }
}
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
    fairDao.addAd(req.query.fairId,req.query.adId,function(err,doc){
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
exports.addSponsor=function (req, res) {
    fairDao.addSponsor(req.query.fairId,req.query.type,req.query.sponsor,function(err,doc){
        if(err){
            return res.json(response.buildError(err.code));
        }
        res.json(response.buildOK());
    });
};
exports.removeSponsor=function (req, res) {
    fairDao.removeSponsor(req.query.fairId,req.query.type,req.query.sponsorId,function(err,doc){
        if(err){
            return res.json(response.buildError(err.code));
        }
        res.json(response.buildOK());
    });
};
exports.audit=function (req, res) {
    fairDao.update(req.query,function(err,doc){
        if(err){
            return res.json(response.buildError(err.code));
        }
        res.json(response.buildOK());
    });
};