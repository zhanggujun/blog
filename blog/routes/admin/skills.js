var express = require('express');
var router = express.Router();
var Skills = require('../../models/skills');
var getTime = require('../time');
router.get('/', function(req, res, next){
    Skills.find().count().then(function(count){
        Skills.find().sort({_id:1}).skip(0).limit(15).then(function(skillList){
            var skill = [];
            for(var i=0;i<skillList.length;i++){
                var skills = skillList[i];
                var _time = skills.time.getTime();
                var time = getTime(new Date(skills.time),'mm');
                skill.push({
                    _id:skills._id,
                    title:skills.title,
                    text:skills.text,
                    user:skills.user,
                    type:skills.type,
                    time:time
                })
            }
            res.render('admin/skills',{layout:'admin/layout',title:'后台首页',l:'sel',count:count,skills:skill});
        });
    });
});

router.post('/skills_page',function(req,res,next){
    var page = req.body.page-1;
    console.log(page);
    Skills.find().sort({_id:1}).skip(page*15).limit(15).then(function(skillList){
        var skill = [];
        for(var i=0;i<skillList.length;i++){
            var skills = skillList[i];
            var _time = skills.time.getTime();
            var time = getTime(new Date(skills.time),'mm');
            skill.push({
                _id:skills._id,
                title:skills.title,
                text:skills.text,
                user:skills.user,
                type:skills.type,
                time:time
            });
        }
        if(skillList){
            res.json({
                code:true,
                skill:skill
            });
        }else{
            res.json({
                code:false
            })
        }
    });
});
router.post('/skills_del',function(req,res,next){
    var skillId = req.body.skillId;
    Skills.remove({_id:skillId}).then(function(data){
        if(data.result.ok=='1'){
            res.json({
                code:true
            });
        }else{
            res.json({
                code:false,
                msg:'删除失败，请重试'
            })
        }
    });
});

module.exports = router;
