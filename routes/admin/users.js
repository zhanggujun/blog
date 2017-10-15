var express = require('express');
var router = express.Router();
var getTime = require('../time');
var User = require('../../models/users');
var fs = require('fs');
router.get('/', function(req, res, next){
    User.find().count().then(function(count){
        return count;
    }).then(function(count){
        User.find().sort({_id:1}).skip(0).limit(15).then(function(userList){
            var list = [];
            for(var i=0;i<userList.length;i++){
                var user = userList[i];
                var time = getTime(new Date(user.time),'mm');
                var sex = user.sex?'男':'女';
                list.push({
                    _id:user._id,
                    nickname:user.nickname,
                    imgsrc:user.imgsrc,
                    sex:sex,
                    time:time
                })
            }
            res.render('admin/users',{layout:'admin/layout',title:'后台首页',u:'sel',count:count,user:list});
        });
    });
});
router.post('/get_user',function(req,res,next){
    var page = req.body.page-1;
    User.find().sort({_id:1}).skip(page*15).limit(15).then(function(userList){
        var list = [];
        for(var i=0;i<userList.length;i++){
            var user = userList[i];
            var _time = user.time.getTime();
            var time = getTime(new Date(user.time),'mm');
            var sex = user.sex?'男':'女';
            list.push({
                _id:user._id,
                nickname:user.nickname,
                imgsrc:user.imgsrc,
                sex:sex,
                time:time
            })
        }
        if(userList){
            res.json({
                code:true,
                user:list
            });
        }else{
            res.json({
                code:false
            })
        }
    });
});
router.post('/del_user',function(req,res,next){
    var userId = req.body.userId;
    User.findOne({_id:userId}).then(function(user){
        var src = user.imgsrc;
        fs.unlink('./public/'+src+'',function(err){
            if(err)
                console.log('删除出错:'+err);
            console.log('删除成功');
            User.remove({_id:userId}).then(function(result){
                if(result.result.ok=='1'){
                    fs.unlink('./public/'+src+'',function (err) {
                        if(err)
                            console.log('删除出错:'+err);
                        console.log('删除成功');
                    });
                    res.clearCookie('user');
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
        })
    });
});

module.exports = router;
