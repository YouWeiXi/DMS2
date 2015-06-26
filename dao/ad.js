/**
 * Created by zoey on 2015/6/24.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;


var AdSchema = new Schema({
    fair:{type: mongoose.Schema.Types.ObjectId, label: "Fair ID", optional: true},
    name: { type: String },
    url: { type: String },
    pic: { type: String, label: "Advertisement Logo" },
    tags: { type: [String], optional: true },
//    type: { type: String, allowedValues: ["agent", "builder", "transport"]},
    contact: { type: String, optional: true },
    tel: { type: String, optional: true },
    fax: { type: String, optional: true },
    email: { type: String, optional: true },
    qq: { type: Number, optional: true }
});

var Advertisement = mongoose.model("advertisement", AdSchema);

exports.save = function (obj,callback) {
    var obj = new Advertisement(obj);
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
exports.remove = function (query,callback) {
    Advertisement.remove(query,function(err,docs){
        console.log(docs);
        callback(err,docs)
    });
}