/**
 * Created by zoey on 2015/6/19.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var UserSchema = new Schema({
    username: { type: String },
    password: { type: String }
});

var User = mongoose.model("user", UserSchema);

exports.save = function (obj,callback) {
    var obj = new User(obj);
    obj.save(function(err){
        console.log(err)
        if (err) {
            callback(err)
        }
        callback()
    });
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
    Fair.update({_id:id},update,options,function(err,docs){
        callback(err,docs)
    });
}
exports.remove = function (query,callback) {
    User.remove(query,function(err,docs){
        console.log(docs);
        callback(err,docs)
    });
}