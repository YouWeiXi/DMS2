var express = require('express');
var router = express.Router();
var fair = require('../controllers/fair');
var user = require('../controllers/user');
var role = require('../controllers/role');
/* GET home page. */
router.get('/', function(req,res){
    res.render('index');
});
router.get('/fair', function(req,res){
    res.render('fair');
});
router.get('/login', function(req,res){
    res.render('login');
});
router.get('/logout', function(req,res){
    req.session.user =  null;
    res.redirect('/login');
});
router.get('/role', function(req,res){
    res.render('role');
});
router.get('/user', function(req,res){
    res.render('user');
});
router.get('/personal', function(req,res){
    res.render('personal');
});
router.get('/menu', user.menu);
router.get('/fair/init', fair.init);
router.post('/fair/save', fair.save);
router.post('/fair/update', fair.update);
router.get('/fair/find', fair.find);
router.get('/fair/remove', fair.remove);
router.post('/fair/import', fair.import);

router.post('/user/reg', user.reg);
router.post('/user/login', user.login);
router.get('/user/find', user.find);
router.post('/user/update', user.update);
router.get('/user/remove', user.remove);

router.post('/role/save', role.save);
router.post('/role/update', role.update);
router.get('/role/find', role.find);
router.get('/role/remove', role.remove);
module.exports = router;
