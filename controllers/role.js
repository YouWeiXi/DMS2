/**
 * Created by zoey on 2015/6/11.
 */
var roleDao = require('../dao/role');
var response = require('../common/response');
var path 	   = require('path');
var config = require('../config').config;
//exports.init=function (req, res) {
//    userDao.save({
//        chnName: i++,
//        engName: 'a',
//        time: new Date(),
//        position: 'a',
//        period: 2,
//        firstYear: 1987,
//        hallName: 'a',
//        sponsors: {},
//        undertakers: {},
//        categories: 'a',
//        lastYearInfo: 'a',
//        exhibitionAgent: 'a',
//        setupAgent: 'a',
//        shippingAgent: 'a',
//        website: 'a',
//        logo: 'a',
//        advertisement: {}
//    },function(err,list){
//        if(err){
//            return res.json(response.buildError(err.code));
//        }
//        res.json(response.buildOK());
//    });
//};
exports.save=function (req, res) {
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
