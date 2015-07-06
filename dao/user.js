/**
 * Created by zoey on 2015/6/19.
 */
var mongoose = require('mongoose');
var mongo = require('./template/mongodb');
var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var UserSchema = new Schema({
    username: { type: String },
    password: { type: String },
    role: { type: Schema.Types.ObjectId, ref: 'role' }
});

var User = mongo.datasource.default.model("user", UserSchema);

exports.save = function (obj,callback) {
    var obj = new User(obj);
    obj.save(callback);
}
exports.login = function (param,callback) {
    User.findOne(param,function (err, list) {
        callback(err,list)
    });
}
exports.update = function (obj,callback) {
    var id=obj._id;
    delete obj._id;
    var update = { $set: obj}, options = {};
    User.update({_id:id},update,options,function(err,docs){
        callback(err,docs)
    });
}
exports.remove = function (query,callback) {
    User.remove(query,function(err,docs){
        console.log(docs);
        callback(err,docs)
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
            console.log(err)
            callback(err,a)
        });
    });
}
var createQuery = function(param){
    var query = null;
    if(param.search){
        var regex = new RegExp(param.search, 'i');
        query = User.find({'$or': [{username: regex}]});
    }else{
        query = User.find({});
    }
    query = query.populate('role')
    return query;
}
exports.get = function(param,callback){
    User.find(param,callback)
}