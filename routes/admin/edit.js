var express = require('express');
var router = express.Router();
var Skill = require('../../models/skills');
router.get('/', function(req, res, next) {
    res.render('admin/edit',{layout:'admin/layout',title:'后台首页',e:'sel'});
});
router.post('/save',function(req,res,next){
    var data = JSON.parse(req.body.data);
    console.log(data);
    /*
     text:String,
     title:String,
     user:String,
     type:Number,
     time:Date
    */
    new Skill({
        title:data.title,
        text:data.text,
        user:data.user,
        type:data.type,
        time:data.time
    }).save().then(function(skill){
        if(skill){
            res.json({
                code:true
            });
        }else{
            res.json({
                code:false,
                msg:'保存失败，请重新保存'
            });
        }
    });
});

module.exports = router;
