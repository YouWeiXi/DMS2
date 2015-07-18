/**
 * Created by zoey on 2015/6/11.
 */
var mongoose = require('mongoose');
var mongo = require('./template/mongodb');
var Schema = mongoose.Schema;
    ObjectId = Schema.ObjectId;

var SponsorSchema = new Schema({
    name: { type: String },
    tel: { type: String },
    fax: { type: String },
    email: { type: String}
});
var FairSchema = new Schema({
    chnName: { type: String },
    engName: { type: String },
    time: { type: String },
    position: { type: String },
    period: { type: Number, min: 0, max: 10, optional: true },
    firstYear: { type: Number, min: 1600, max: 2200, optional: true },
    hallName: { type: String, optional: true },
    sponsors: { type: [SponsorSchema], optional: true },
    undertakers: { type: [SponsorSchema], optional: true },
    categories: { type: [String], optional: true },
    lastYearInfo: { type: String, optional: true },
    website: { type: String, optional: true },
    logo: { type: String, label: "Fair Logo", optional: true },
//    advertisement: {
//        agent: [{ type: Schema.Types.ObjectId, ref: 'advertisement' }],
//        builder: [{ type: Schema.Types.ObjectId, ref: 'advertisement' }],
//        transport: [{ type: Schema.Types.ObjectId, ref: 'advertisement' }]
//    }
    advertisement: [{ type: Schema.Types.ObjectId , ref: 'advertisement'}],
    lastInfo:{
        exhibitionNum:String,
        audienceNum:String,
        fairArea:String
    },
    status:{type:Number , default:0}// 0：未审核 1：审核通过 2：审核失败 3：已同步
});
var Fair = mongo.datasource.default.model("fair", FairSchema);

exports.Fair=Fair;

exports.save = function (obj,callback) {
    var obj = new Fair(obj);
    obj.save(callback);
}
exports.find = function (param,callback) {
    createQuery(param).count(function (err, count) {
        var page=param.page?param.page:1;
        var query=createQuery(param);
        var limit=param.limit?param.limit:10;
        var skip=(page-1)*limit;
        query.skip(skip);
        query.limit(limit);
        query.sort({'_id':-1});
        query.exec(function (err, docs) {
            var a={
                count:count,
                list:docs
            }
            callback(err,a)
        });
    });
}
var createQuery = function(param){
    var query = null;
    var arg={};
    if(param.search){
        var regex = new RegExp(param.search, 'i');
        arg={'$or': [{chnName: regex},{engName:regex},{position:regex},{time:regex}]}
    }else if(param.status){
        arg.status=param.status;
    }
    query = Fair.find(arg);
    return query;
}
exports. update = function (obj,callback) {
    var id=obj._id;
    delete obj._id;
    var update = { $set: obj}, options = {};
    Fair.update({_id:id},update,options,function(err,docs){
        callback(err,docs)
    });
}
exports.remove = function (query,callback) {
    Fair.remove(query,function(err,docs){
        callback(err,docs)
    });
}
exports.findName = function (callback) {
    Fair.find({}, '_id chnName engName', function (err, docs) {
        callback(err,docs)
    })
}
exports.findOne = function (id,callback) {
    Fair.findOne({"_id": id})
        .populate('advertisement')
        .exec(callback)
}
/**
 * 添加指定展会内的指定广告
 * @param id 展会id
 * @param type 广告类型
 * @param adId 广告id
 * @param callback
 */
exports.addAd = function (id,adId,callback) {
//    var key='advertisement.'+type
//    var a={};
//    a[key]=adId
//    var update = {'$push':a};
    var update = {'$push':{advertisement:adId}};
    Fair.update({_id:id},update,{},function(err,docs){
        callback(err,docs)
    });
}
/**
 * 移除指定展会内的指定广告
 * @param id 展会id
 * @param type 广告类型
 * @param adId 广告id
 * @param callback
 */
exports.removeAdByOne = function (id,type,adId,callback) {
//    Fair.findOne({"_id": id},  function(err, documents) {
//        documents.advertisement[type].remove(adId);
//        documents.save(callback);
//    })

//    var a={};
//    if(type){
//        var key='advertisement.'+type
//        a[key]=adId
//    }else{
//        a={'advertisement.agent':adId, 'advertisement.builder':adId,'advertisement.transport':adId}
//    }
//    var update = {'$pull':a};
    var update = {'$pull':{advertisement:adId}};
    Fair.update({_id:id},update,{},function(err,docs){
        callback(err,docs)
    });
}
/**
 * 根据广告id 移除所有于此关联展会的广告
 * @param type 广告类型
 * @param adId 广告id
 * @param callback
 */
exports.removeAdByAll = function (adId,callback) {
//    var q={'$or': [{'advertisement.agent':adId},{ 'advertisement.builder':adId},{'advertisement.transport':adId}]};
//    Fair.find(q,  function(err, docs) {
//        docs.forEach(function(documents){
//            documents.advertisement.agent.remove(adId);
//            documents.advertisement.builder.remove(adId);
//            documents.advertisement.transport.remove(adId);
//            documents.save();
//        })
//        callback(err,{})
//    })
    var q={'advertisement':adId};
    Fair.find(q,  function(err, docs) {
        docs.forEach(function(documents){
            documents.advertisement.remove(adId);
            documents.save();
        })
        callback(err,{})
    })
}
exports.findbyAd = function (adId,callback) {
//    var q={'$or': [{'advertisement.agent':adId},{ 'advertisement.builder':adId},{'advertisement.transport':adId}]};
    var q={'advertisement':adId};
    Fair.find(q,  callback)
}
/**
 * 添加指定展会内的赞助商
 * @param id  展会id
 * @param type  类型sponsors主办方/undertakers承办方
 * @param sponsor  赞助商对象
 * @param callback
 */
exports.addSponsor = function (id,type,sponsor,callback) {
    var a={};
    a[type]=sponsor;
    var update = {'$push':a};
    Fair.update({_id:id},update,{},callback);
}
/**
 * 移除指定展会内的赞助商
 * @param id 展会id
 * @param type 类型sponsors主办方/undertakers承办方
 * @param sponsorId 赞助商id
 * @param callback
 */
exports.removeSponsor = function (id,type,sponsorId,callback) {
    var a={};
    a[type]={
            _id:sponsorId
    };
    var update = {'$pull':a};
    Fair.update({_id:id},update,{},callback);
}