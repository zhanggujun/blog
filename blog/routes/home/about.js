var express = require('express');
var router = express.Router();
/* GET users listing. */
router.get('/', function(req, res, next) {
    var user = null;
    if(req.cookies.user){
        user = JSON.parse(req.cookies.user);
    }
    res.render('home/about', {layout:'home/layout',title:'Express',a:'header-current',user:user});
});

module.exports = router;
