/**
 * Created by zoey on 2015/6/11.
 */
var config = require('../../config').config;
var mongoose = require('mongoose');
/**
 * 单数据源
 * require('./dao/template/mongodb')(config,mongoose);
 * @param config
 * @param mongoose
 */
/*
module.exports = function (config, mongoose) {

    var connect = function () {
        var options = {
            server: {
                socketOptions: { keepAlive: 1 }
            },
            auto_reconnect:true
        }
        mongoose.connect(config.mongodb.url, options)
    }
    connect()

    // Error handler
    mongoose.connection.on('error', function (err) {
        console.error('✗ MongoDB Connection Error. Please make sure MongoDB is running. -> ' + err)
    })

    // Reconnect when closed
    mongoose.connection.on('disconnected', function () {
        connect()
    })

}
*/
exports.datasource = {
    default:null,
    product:null
}
/**
 * 多数据源
 */
exports.createConnection = function(url,type){
    var isDefault=false;
    if(!url||type=='default'){
        url=config.mongodb.url;
        isDefault=true;
    }
    var connect = function () {
        var options = {
            server: {
                socketOptions: { keepAlive: 1 }
            },
            auto_reconnect:true
        }
        var conn = mongoose.createConnection(url, options);
        if(isDefault){
            exports.datasource.default=conn;
        }else{
            exports.datasource.product=conn;
        }
    }
    connect()

    // Error handler
    mongoose.connection.on('error', function (err) {
        console.error('✗ MongoDB Connection Error. Please make sure MongoDB is running. -> ' + err)
    })
    // Reconnect when closed
    mongoose.connection.on('disconnected', function () {
        connect()
    })
}
