/**
 * Created by zoey on 2015/6/19.
 */
var userDao = require('../dao/user');
var response = require('../common/response');
var path 	   = require('path');
exports.reg=function (req, res) {
    userDao.save(req.body,function(err,list){
        if(err){
            return res.json(response.buildError(err.code));
        }
        res.json(response.buildOK());
    });
};
exports.login=function (req, res) {
    userDao.login(req.body,function(err,list){
        if(err){
            return res.json(response.buildError(err));
        }
        console.log('********')
        console.log(list)
        console.log('********')
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
    var items=[
        {label:'展会管理',href:'/fair'},
        {label:'广告管理',href:'#'},
        {label:'角色管理',href:'/role'},
        {label:'用户管理',href:'/user'},
        {label:'个人中心',href:'/personal'}
    ]
    res.json(response.buildOK(items));
};
