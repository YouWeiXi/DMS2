var express = require('express');
var router = express.Router();
var fair = require('../controllers/fair');

/* GET home page. */
router.get('/fair/save', fair.save);
router.get('/fair/list', fair.list);
router.get('/', fair.list);
module.exports = router;
