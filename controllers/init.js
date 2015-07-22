var fairDao = require('../dao/fair');
var userDao = require('../dao/user');
var roleDao = require('../dao/role');
var response = require('../common/response');
var crypto = require('crypto');
exports.init=function (req, res) {
    var  md5 = crypto.createHash('md5');
    var  password = md5.update('admin').digest('base64');
    roleDao.save({
        roleName: '超级管理员',
        value:[
            {label:'展会管理',href:'/fair'},
            {label:'广告管理',href:'/adview'},
            {label:'个人中心',href:'/personal'},
            {label:'同步',href:'/sync'},
            {label:'角色管理',href:'/role'},
            {label:'用户管理',href:'/user'}
        ]
    }, function (err, doc) {
        console.log(doc)
        userDao.save({
            username: 'admin',
            password: password,
            role:doc._id
        }, function (err, user) {
            if(err){
                return res.json(response.buildError(err.code));
            }
            res.json(response.buildOK());
        });
    });
}
/*
var initFair=function (req, res) {
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
};*/
