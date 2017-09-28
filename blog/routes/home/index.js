var express = require('express');
var router = express.Router();
var Skill = require('../../models/skills');
var Comment = require('../../models/comments');
var User = require('../../models/users');
var getTime = require('../time');

/* GET home page. */
router.get('/', function(req, res, next) {
  var user = null;
  if(req.cookies.user){
    user = JSON.parse(req.cookies.user);
  }
  var skillId = req.query.u_id;
  if(skillId){
    Skill.findOne({_id:skillId}).then(function(skill){
      if(skill){
        var time = getTime(new Date(skill.time),'mm');
        var data = {
          _id:skill._id,
          title:skill.title,
          text:skill.text,
          user:skill.user,
          type:skill.type,
          time:time
        };
        res.render('home/index',{layout:'home/layout',title:'Express',i:'header-current',user:user,skill:data});
      }else{
        res.render('home/index',{layout:'home/layout',title:'Express',i:'header-current',user:user});
      }
    });
  }else{
    Skill.findOne().sort({_id:1}).then(function(skill){
      var time = getTime(new Date(skill.time),'mm');
      var data = {
        _id:skill._id,
        title:skill.title,
        text:skill.text,
        user:skill.user,
        type:skill.type,
        time:time
      };
      res.render('home/index',{layout:'home/layout',title:'Express',i:'header-current',user:user,skill:data});
    });
  }
});
router.post('/save/comments',function(req,res,next){
  var data = JSON.parse(req.body.data);
  User.findOne({_id:data.userId}).then(function(userInfo){
    if(userInfo){
      var time = new Date().getTime();
      new Comment({
        skillId:data.skillId,
        nickname:userInfo.nickname,
        sex:userInfo.sex,
        imgsrc:userInfo.imgsrc,
        text:data.text,
        time:time,
        userId:userInfo._id,
        headId:userInfo.imgid
      }).save().then(function(comm){
        if(comm){
          var _time = getTime(new Date(comm.time),'mm');
          var _comm = [{
            skillId:comm.skillId,
            nickname:comm.nickname,
            sex:comm.sex,
            imgsrc:comm.imgsrc,
            text:comm.text,
            userId:comm.userId,
            headId:comm.headId,
            _id:comm._id,
            time:_time
          }];
          res.json({
            code:true,
            comm:_comm
          });
        }else{
          res.json({
            code:false,
            msg:'保存失败，请重试'
          });
        }
      })
    }else{
      res.json({
        code:false,
        msg:'用户查询失败，请重试'
      })
    }
  })
});
//获取评论；
router.post('/get/comment',function(req,res,next){
  var page = req.body.page-1;
  var skillId = req.body.skillId;
  Comment.find({skillId:skillId}).count().then(function(count){
    return count
  }).then(function(count){
    Comment.find({skillId:skillId}).sort({_id:1}).skip(page*15).limit(15).then(function(commList){
      if(commList){
        var list = [];
        for(var i=0;i<commList.length;i++){
          var comm = commList[i];
          var time = getTime(new Date(comm.time),'mm');
          list.push({
            skillId:comm.skillId,
            nickname:comm.nickname,
            sex:comm.sex,
            imgsrc:comm.imgsrc,
            text:comm.text,
            userId:comm.userId,
            headId:comm.headId,
            _id:comm._id,
            time:time
          });
        }
        res.json({
          code:true,
          data:{
            count:count,
            comm:list
          }
        });
      }else{
        res.json({code:false});
      }
    });
  });
});

module.exports = router;
