
var express = require('express');
var router = express.Router();
router.get('/', function(req, res, next) {
    res.render('admin/login',{title:'登陆后台管理系统'});
});

module.exports = router;
