/**
 * Created by zoey on 2015/6/24.
 */
var mongoose = require('mongoose');
var mongo = require('./template/mongodb');
var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;


var AdSchema = new Schema({
    fair:{type: mongoose.Schema.Types.ObjectId, label: "Fair ID", optional: true},
    name: { type: String },
    url: { type: String },
    pic: {
        small:String,
        big:String
    },
    tags: { type: [String], optional: true },
    type: { type: String },//, allowedValues: ["agent", "builder", "transport"]
    contact: { type: String, optional: true },
    tel: { type: String, optional: true },
    fax: { type: String, optional: true },
    email: { type: String, optional: true },
    qq: { type: Number, optional: true }
});

var Advertisement = mongo.datasource.default.model("advertisement", AdSchema);

exports.Advertisement=Advertisement;

exports.AdSchema=AdSchema;

exports.save = function (obj,callback) {
    var obj = new Advertisement(obj);
    obj.save(callback);
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
        query = Advertisement.find({'$or': [{name: regex},{tags: regex},{type: regex},{contact: regex}]});
    }else{
        query = Advertisement.find({});
    }
    return query;
}
exports. update = function (obj,callback) {
    var id=obj._id;
    delete obj._id;
    var update = { $set: obj}, options = {};
    Advertisement.update({_id:id},update,options,function(err,docs){
        callback(err,docs)
    });
}
exports.remove = function (id,callback) {
    Advertisement.remove({_id:id},function(err,docs){
        callback(err,docs)
    });
}