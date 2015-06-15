/**
 * Created by zoey on 2015/6/11.
 */
var fairDao = require('../dao/fair');
var response = require('../common/response');
exports.init=function (req, res) {
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
};
exports.save=function (req, res) {
    fairDao.save(req.body,function(err,list){
        if(err){
            return res.json(response.buildError(err.code));
        }
        res.json(response.buildOK());
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
    fairDao.update(req.query,function(err,list){
        if(err){
            return res.json(response.buildError(err.code));
        }
        res.json(response.buildOK());
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
