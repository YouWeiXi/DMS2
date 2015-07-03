var fairDao = require('../dao/fair');
var userDao = require('../dao/user');
var roleDao = require('../dao/role');
var response = require('../common/response');
exports.init=function (req, res) {
    initRole(function(err,doc){
        userDao.save({
            username: 'admin',
            engName: 'admin',
            role:doc._id
        },function(err,user){

        });
    })
    roleDao.save({
        _id:'99999',
        roleName: '管理员'
    },cb);
}
var initRole=function (cb) {
    roleDao.save({
        _id:'10000',
        roleName: '超级管理员'
    },cb);
};
var initUser=function (cb) {
    userDao.save({
        username: 'admin',
        engName: 'admin'
    },cb);
};
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
