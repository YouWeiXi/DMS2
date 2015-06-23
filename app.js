var express = require('express');
var session = require('express-session');
var partials = require('express-partials');
var http = require('http');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var routes = require('./routes/index');
var config = require('./config').config;
var mongoose = require('mongoose');
var app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.engine('.html', require('ejs').__express)
app.use(logger('dev'));
app.use(partials());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    resave:false,
    saveUninitialized:false,
    secret: 'keyboard cat'
}))
//app.dynamicHelpers
app.use(function(req, res, next){
    res.locals.user = req.session.user;
    next();
});
app.use('/', routes);
app.set('port', config.port);
http.createServer(app).listen(config.port, function(){
    console.log("Express server listening on port " + config.port);
});
require('./dao/template/mongodb')(config,mongoose);
module.exports = app;
