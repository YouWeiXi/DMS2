/**
 * Created by zoey on 2015/6/19.
 */
var userDao = require('../dao/user');
var response = require('../common/response');
var path 	   = require('path');
var crypto = require('crypto');
exports.reg=function (req, res) {
    var md5 = crypto.createHash("md5");
    var password = md5.update(req.body.password).digest('base64');
    req.body.password=password;
    userDao.get({username:req.body.username}, function (err, user) {
        if(err){
            return res.json(response.buildError(err.code));
        }
        if(user.length>0){
            return res.json(response.buildError('用户名存在'));
        }
        // 如果不存在则新增用户
        userDao.save(req.body,function(err,list){
            if(err){
                return res.json(response.buildError(err.code));
            }
            res.json(response.buildOK());
        });
    });
};
exports.login=function (req, res) {
    //生成口令的散列值
    var  md5 = crypto.createHash('md5');
    var  password = md5.update(req.body.password).digest('base64');
    req.body.password=password;
    userDao.login(req.body,function(err,list){
        if(err){
            return res.json(response.buildError(err));
        }
        console.log(list)
        req.session.user = list;
        res.json(response.buildOK(list));
    });
};
exports.find=function (req, res) {
    userDao.find(req.query,function(err,list){
        if(err){
            return res.json(response.buildError(err));
        }
        res.json(response.buildOK(list));
    });
};
exports.update=function (req, res) {
    userDao.update(req.body,function(err,list){
        if(err){
            console.log(err)
            return res.json(response.buildError(err));
        }
        res.json(response.buildOK());
    });
};
exports.remove=function (req, res) {
    userDao.remove(req.query,function(err,list){
        if(err){
            return res.json(response.buildError(err.code));
        }
        res.json(response.buildOK());
    });
};
exports.menu=function (req, res) {
    var items=[];
    if(req.session.user){
        items=req.session.user.role.value
    }
    res.json(response.buildOK(items));
};
