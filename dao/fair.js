/**
 * Created by zoey on 2015/6/11.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var AdSchema = new Schema({
    name: { type: String },
    url: { type: String},
    pic: { type: [String], optional: true }
});

var SponsorSchema = new Schema({
    name: { type: String },
    tel: { type: String },
    fax: { type: String },
    email: { type: String}
});

var FairSchema = new Schema({
    chnName: { type: String },
    engName: { type: String },
    time: { type: Date },
    position: { type: String },
    period: { type: Number, min: 0, max: 5, optional: true },
    firstYear: { type: Number, min: 1600, max: 2200, optional: true },
    hallName: { type: String, optional: true },
    sponsors: { type: [SponsorSchema], optional: true },
    undertakers: { type: [SponsorSchema], optional: true },
    categories: { type: [String], optional: true },
    lastYearInfo: { type: String, optional: true },
    exhibitionAgent: { type: String, optional: true },
    setupAgent: { type: String, optional: true },
    shippingAgent: { type: String, optional: true },
    website: { type: String, optional: true },
    logo: { type: String, optional: true },
    advertisement: { type: [AdSchema], optional: true }
});

var Fair = mongoose.model("fair", FairSchema);

exports.save = function (obj,callback) {
    var obj = new Fair(obj);
    obj.save(function(err){
        if (err) {
            console.log('save failed');
        }
        console.log('save success');
    });
}
exports.find = function (query,callback) {
    Fair.find(query,function(err,docs){
        callback(err,docs);
    });
}
exports.update = function (obj,callback) {
    var update = { $set: obj}, options = {};
    Fair.update({_id:obj.id},update,options,function(err,docs){
        console.log(JSON.stringify(docs)+","+err);
    });
}
exports.remove = function (id,callback) {
    var conditions = {_id: id};
    Fair.remove(conditions,function(err,docs){
        console.log(docs);
    });
}