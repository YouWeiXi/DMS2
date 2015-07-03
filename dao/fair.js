/**
 * Created by zoey on 2015/6/11.
 */
var mongoose = require('mongoose');
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
    period: { type: Number, min: 0, max: 5, optional: true },
    firstYear: { type: Number, min: 1600, max: 2200, optional: true },
    hallName: { type: String, optional: true },
    sponsors: { type: [SponsorSchema], optional: true },
    undertakers: { type: [SponsorSchema], optional: true },
    categories: { type: [String], optional: true },
    lastYearInfo: { type: String, optional: true },
    website: { type: String, optional: true },
    logo: { type: String, label: "Fair Logo", optional: true },
    advertisement: {
        agent: [{ type: Schema.Types.ObjectId, ref: 'advertisement' }],
        builder: [{ type: Schema.Types.ObjectId, ref: 'advertisement' }],
        transport: [{ type: Schema.Types.ObjectId, ref: 'advertisement' }]
    }
//    advertisement: { type: [mongoose.Schema.Types.ObjectId], label: "Advertisement ID", optional: true }
});

var Fair = mongoose.model("fair", FairSchema);

exports.save = function (obj,callback) {
    var obj = new Fair(obj);
    obj.save(function(err){
        console.log(err)
        if (err) {
            callback(err)
        }
        callback()
    });
}
exports.find = function (param,callback) {
    createQuery(param).count(function (err, count) {
        var page=param.page?param.page:1;
        var query=createQuery(param);
        var limit=param.limit?param.limit:15;
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
    if(param.search){
        var regex = new RegExp(param.search, 'i');
        query = Fair.find({'$or': [{chnName: regex},{engName:regex},{position:regex},{time:regex}]});
    }else{
        query = Fair.find({});
    }
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
        console.log(docs);
        callback(err,docs)
    });
}
exports.findName = function (callback) {
    Fair.find({}, '_id chnName engName', function (err, docs) {
        console.log(docs)
        callback(err,docs)
    })
}
exports.findOne = function (id,callback) {
    Fair.findOne({"_id": id})
        .populate('advertisement.agent')
        .populate('advertisement.builder')
        .populate('advertisement.transport')
        .exec(callback)
}
/**
 * 添加指定展会内的指定广告
 * @param id 展会id
 * @param type 广告类型
 * @param adId 广告id
 * @param callback
 */
exports.addAd = function (id,type,adId,callback) {
    var key='advertisement.'+type
    var a={};
    a[key]=adId
    var update = {'$push':a};
    Fair.update({_id:id},update,{},function(err,docs){
        callback(err,docs)
    });
    //    Fair.findOne({"_id": id},  function(err, documents) {
//        documents.advertisement[type].push(adId);
//        documents.save(callback);
//    })
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
    var a={};
    if(type){
        var key='advertisement.'+type
        a[key]=adId
    }else{
        a={'advertisement.agent':adId, 'advertisement.builder':adId,'advertisement.transport':adId}
    }
    var update = {'$pull':a};
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
    var q={'$or': [{'advertisement.agent':adId},{ 'advertisement.builder':adId},{'advertisement.transport':adId}]};
    Fair.find(q,  function(err, docs) {
        docs.forEach(function(documents){
            documents.advertisement.agent.remove(adId);
            documents.advertisement.builder.remove(adId);
            documents.advertisement.transport.remove(adId);
            documents.save();
        })
        callback(err,{})
    })
}
exports.findbyAd = function (adId,callback) {
    var q={'$or': [{'advertisement.agent':adId},{ 'advertisement.builder':adId},{'advertisement.transport':adId}]};
    Fair.find(q,  callback)
}