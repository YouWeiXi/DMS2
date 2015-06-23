/**
 * Created by zoey on 2015/6/19.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;


var RoleSchema = new Schema({
    roleName: { type: String }
});

var Role = mongoose.model("role", RoleSchema);

exports.save = function (obj,callback) {
    var obj = new Role(obj);
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
        query = Role.find({'$or': [{roleName: regex}]});
    }else{
        query = Role.find({});
    }
    return query;
}
exports. update = function (obj,callback) {
    var id=obj._id;
    delete obj._id;
    var update = { $set: obj}, options = {};
    Role.update({_id:id},update,options,function(err,docs){
        callback(err,docs)
    });
}
exports.remove = function (query,callback) {
    Role.remove(query,function(err,docs){
        console.log(docs);
        callback(err,docs)
    });
}