var express = require('express');
var router = express.Router();
var fair = require('../controllers/fair');
var user = require('../controllers/user');
var role = require('../controllers/role');
var ad = require('../controllers/ad');
/* GET home page. */
router.get('/', checkLogin);
router.get('/', function(req,res){ res.render('index');});
router.get('/fair', checkLogin);
router.get('/fair', function(req,res){ res.render('fair');});
router.get('/login', function(req,res){ res.render('login');});
router.get('/role', checkLogin);
router.get('/role', function(req,res){res.render('role');});
router.get('/user', checkLogin);
router.get('/user', function(req,res){res.render('user');});
router.get('/personal', checkLogin);
router.get('/personal', function(req,res){res.render('personal');});
router.get('/ad', checkLogin);
router.get('/ad', function(req,res){res.render('ad');});
router.get('/adedit', function(req,res){res.render('ad_edit',{layout:false});});
router.get('/adview', checkLogin);
router.get('/adview', function(req,res){res.render('ad_view');});
router.get('/logout', function(req,res){
    req.session.user =  null;
    res.redirect('/login');
});

router.get('/menu', user.menu);
router.get('/fair/init', fair.init);
router.post('/fair/save', fair.save);
router.post('/fair/update', fair.update);
router.get('/fair/find', fair.find);
router.get('/fair/remove', fair.remove);
router.post('/fair/import', fair.import);
router.get('/fair/findName', fair.findName);
router.get('/fair/findOne', fair.findOne);
router.get('/fair/removeAd', fair.removeAd);
router.get('/fair/addAd', fair.addAd);

router.post('/user/reg', user.reg);
router.post('/user/login', user.login);
router.get('/user/find', user.find);
router.post('/user/update', user.update);
router.get('/user/remove', user.remove);

router.post('/role/save', role.save);
router.post('/role/update', role.update);
router.get('/role/find', role.find);
router.get('/role/remove', role.remove);

router.post('/ad/save', ad.save);
router.post('/ad/update', ad.update);
router.get('/ad/find', ad.find);
router.get('/ad/remove', ad.remove);
module.exports = router;

function  checkLogin(req, res, next) {
    if (!req.session.user) {
        return  res.redirect('/login');
    }
    next();
}