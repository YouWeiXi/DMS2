/**
 * Created by zoey on 2015/7/6.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongo = require('./template/mongodb');
var fair = require('./fair');
var ad = require('./ad');
exports.sync=function(cb){
    syncAd(function(err){
        if(err){
            return cb(err)
        }
        syncFair(cb)
    })
}
function syncFair(cb){
    var FromObj = fair.Fair;
    var TargetObj = mongo.datasource.product.model("fair", TargetFairSchema);
    TargetObj.remove({},function(){
        FromObj.find({},function (err, docs) {
            if(err){
                return cb(err)
            }
            docs.forEach(function(doc,index){
                doc = wrapFair(doc);
                var obj = new TargetObj(doc);
                obj.save(function(err){
                    if(index==docs.length-1){
                        cb()
                    }
                });
            })
        })
    });
}
function syncAd(cb){
    var FromObj = ad.Advertisement;
    var TargetObj = mongo.datasource.product.model("advertisement", ad.AdSchema);
    TargetObj.remove({},function(){
        FromObj.find({},function (err, docs) {
            if(err){
                return cb(err)
            }
            docs.forEach(function(doc,index){
                var obj = new TargetObj(doc);
                obj.save(function(err){
                    if(index==docs.length-1){
                        cb()
                    }
                });
            })
        })
    });
}
exports.syncOne=function(id,cb){
    var FromObj = fair.Fair;
    var TargetObj = mongo.datasource.product.model("fair", TargetFairSchema);
    var TargetAdObj = mongo.datasource.product.model("advertisement", ad.AdSchema);
    FromObj.findOne({"_id": id})
        .populate('advertisement')
        .exec(function (err, doc) {
            if(err){
                return cb(err)
            }
            console.log(doc)
            if(doc.hasOwnProperty('advertisement')){
                doc.advertisement.forEach(function(ad){
                    var adobj = new TargetAdObj(ad);
                    adobj.save();
                })
            }
            doc = wrapFair(doc);
            var obj = new TargetObj(doc);
            obj.save(function(err){
                cb()
            });
        })
}
function wrapFair(doc){
    var aFair=doc.toJSON();
    aFair.indexStr = {};
    aFair.indexStr['name'] = (doc.chnName + ' ' + doc.engName).trim();
    aFair.indexStr['sponsor'] = doc.sponsor;
    aFair.indexStr['undertaker'] = doc.undertaker;
    aFair.indexStr['category'] = doc.category;
    aFair.indexStr['simpleSearch'] = doc.chnName + ' ' + doc.engName + ' ' + doc.position + ' ' + doc.time + ' ' + doc.category;
    return aFair;
}
var SponsorSchema = new Schema({
    name: { type: String },
    tel: { type: String },
    fax: { type: String },
    email: { type: String}
});
var TargetFairSchema = new Schema({
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
//    advertisement: {
//        agent: [{ type: Schema.Types.ObjectId, ref: 'advertisement' }],
//        builder: [{ type: Schema.Types.ObjectId, ref: 'advertisement' }],
//        transport: [{ type: Schema.Types.ObjectId, ref: 'advertisement' }]
//    },
    advertisement: { type: [Schema.Types.ObjectId], label: "Advertisement ID", optional: true },
    indexStr:{
        name:{ type: String, optional: true },
        sponsor:{ type: String, optional: true },
        undertaker:{ type: String, optional: true },
        category:{ type: String, optional: true },
        simpleSearch:{ type: String, optional: true }
    }
});