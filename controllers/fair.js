/**
 * Created by zoey on 2015/6/11.
 */
var fairDao = require('../dao/fair');
var response = require('../common/response');

exports.save=function (req, res) {
    fairDao.save({
        chnName: 'a',
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
};
exports.list=function (req, res) {
    var page=req.query.page;
    var limit=req.query.limit;
    var skip=(page-1)*limit;
    var where = {};
    var options = {skip: 0, limit: 1};
    fairDao.find(where,['_id'],options,function(err,list){
        if(err){
            return res.json(response.buildError(err));
        }
        //res.json(response.buildOK(list));
        res.render('fairs', {data: list});
    });

//    fairDao.find({},function(err,list){
//        if(err){
//            return res.json(response.buildError(err));
//        }
//        //res.json(response.buildOK(list));
//        res.render('fairs', {data: list});
//    });
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
    fairDao.remove(req.query.id,function(err,list){
        if(err){
            return res.json(response.buildError(err.code));
        }
        res.json(response.buildOK());
    });
};
