/**
 * Created by zoey on 2015/6/11.
 */
var roleDao = require('../dao/role');
var response = require('../common/response');
var path 	   = require('path');
var config = require('../config').config;
exports.save=function (req, res) {
    req.body.value=JSON.parse(req.body.value)
    roleDao.save(req.body,function(err,list){
        if(err){
            return res.json(response.buildError(err.code));
        }
        res.json(response.buildOK());
    });
};
exports.find=function (req, res) {
    roleDao.find(req.query,function(err,list){
        if(err){
            return res.json(response.buildError(err));
        }
        res.json(response.buildOK(list));
    });
};
exports.update=function (req, res) {
    req.body.value=JSON.parse(req.body.value)
    roleDao.update(req.body,function(err,list){
        if(err){
            console.log(err)
            return res.json(response.buildError(err));
        }
        res.json(response.buildOK());
    });
};
exports.remove=function (req, res) {
    roleDao.remove(req.query,function(err,list){
        if(err){
            return res.json(response.buildError(err.code));
        }
        res.json(response.buildOK());
    });
};
exports.findOne=function (req, res) {
    roleDao.findOne(req.query.id,function(err,list){
        if(err){
            return res.json(response.buildError(err.code));
        }
        res.json(response.buildOK(list));
    });
};
