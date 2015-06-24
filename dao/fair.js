/**
 * Created by zoey on 2015/6/11.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
//    ObjectId = Schema.ObjectId;
//var AdSchema = new Schema({
//    name: { type: String },
//    url: { type: String},
//    pic: { type: String, label: "Advertisement Logo" },
//    tags: { type: [String], optional: true },
//    type: { type: String, allowedValues: ["agent", "builder", "transport"]},
//    contact: { type: String, optional: true },
//    tel: { type: String, optional: true },
//    fax: { type: String, optional: true },
//    email: { type: String, optional: true },
//    qq: { type: Number, optional: true }
//});

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
    advertisement: { type: mongoose.Schema.Types.ObjectId, label: "Advertisement ID", optional: true }
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