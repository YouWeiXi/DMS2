var express = require('express');
var router = express.Router();
var fair = require('../controllers/fair');
/* GET home page. */
router.get('/', function(req,res){
    res.render('index');
});
router.get('/fair/init', fair.init);
router.post('/fair/save', fair.save);
router.post('/fair/update', fair.update);
router.get('/fair/find', fair.find);
router.get('/fair/remove', fair.remove);
router.post('/fair/import', fair.import);
module.exports = router;
