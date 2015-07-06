/**
 * Created by zoey on 2015/7/6.
 */
var config = require('../config').config;
var syncDao = require('../dao/sync');
var response = require('../common/response');
var mongo=require('../dao/template/mongodb')
/**
 * 配置数据源
 * @param req
 * @param res
 */
exports.getDatasource=function (req, res) {
    var url;
    var type=req.query.type;
    if(type=='default'){
        url=config.mongodb.url;
    }else{
        url=config.mongodb.productUrl;
    }
    res.json(response.buildOK(url));
};
exports.setting=function (req, res) {
    var type=req.query.type;
    var url=req.query.url;
    if(type=='default'){
        config.mongodb.default=url;
    }else{
        config.mongodb.productUrl=url;
    }
    mongo.createConnection(url,type)
    res.json(response.buildOK());
};
exports.sync=function (req, res) {
    syncDao.sync(function(err){
        if(err){
            return res.json(response.buildError(err));
        }
        res.json(response.buildOK());
    })
};