var express = require('express');
var router = express.Router();
var Skill = require('../../models/skills');
var getTime = require('../time');

/* GET users listing. */
router.get('/', function(req, res, next) {
  var user = null;
  if(req.cookies.user){
    user = JSON.parse(req.cookies.user);
  }
  Skill.find({type:'杂谈'}).count().then(function(count){
    Skill.find({type:'杂谈'}).sort({_id:1}).skip(0).limit(15).then(function(skillList){
      var list = [];
      for(var i=0;i<skillList.length;i++){
        var skill = skillList[i];
        var time = getTime(new Date(skill.time),'mm');
        list.push({
          _id:skill._id,
          title:skill.title,
          user:skill.user,
          time:time
        });
      }
      if(skillList){
        res.render('home/skill',{layout:'home/layout',title:'Express',s:'header-current',user:user,count:count,skill:list});
      }else{
        res.render('home/skill',{layout:'home/layout',title:'Express',s:'header-current',user:user,count:count,skill:[]});
      }
    });
  });
});
router.post('/get_page',function(req,res,next){
  var page = req.body.page-1;
  Skill.find({type:'杂谈'}).count().then(function(count){
    Skill.find({type:'杂谈'}).sort({_id:1}).skip(page*15).limit(15).then(function(skillList){
      var list = [];
      for(var i=0;i<skillList.length;i++){
        var skill = skillList[i];
        var time = getTime(new Date(skill.time),'mm');
        list.push({
          _id:skill._id,
          title:skill.title,
          user:skill.user,
          time:time
        });
      }
      if(skillList){
        res.json({
          code:true,
          skill:list
        });
      }else{
        res.json({
          code:false
        })
      }
    })
  });
});

module.exports = router;
