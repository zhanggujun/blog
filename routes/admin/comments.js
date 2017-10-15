var express = require('express');
var router = express.Router();
var Comments = require('../../models/comments');
var getTime = require('../time');
router.get('/', function(req, res, next){
    Comments.find().count().then(function(count){
        Comments.find().sort({_id:1}).skip(0).limit(15).then(function(commList){
            if(commList){
                var list = [];
                for(var i=0;i<commList.length;i++){
                    var e = commList[i];
                    var time = getTime(new Date(e.time),'mm');
                    list.push({
                        _id:e._id,
                        imgsrc:e.imgsrc,
                        sex:e.sex?'男':'女',
                        nickname:e.nickname,
                        text:e.text,
                        time:time,
                    })
                }
                res.render('admin/comments',{layout:'admin/layout',title:'后台首页',comm:'sel',count:count,_comm:list});
            }else{
                res.render('admin/comments',{layout:'admin/layout',title:'后台首页',comm:'sel'});
            }
        });
    });
});
router.post('/get_comments',function(req,res,next){
    var page = req.body.page-1;
    Comments.find().sort({_id:1}).skip(page*15).limit(15).then(function(commList){
        if(commList){
            var list = [];
            for(var i=0;i<commList.length;i++){
                var e = commList[i];
                var time = getTime(new Date(e.time),'mm');
                list.push({
                    _id:e._id,
                    imgsrc:e.imgsrc,
                    sex:e.sex?'男':'女',
                    nickname:e.nickname,
                    text:e.text,
                    time:time,
                })
            }
            res.json({
                code:true,
                comm:list
            })
        }else{
            res.json({code:false});
        }
    });
});
router.post('/del_comments',function(req,res,next){
    var commId = req.body.commId;
    Comments.remove({_id:commId}).then(function(result){
        if(result.result.ok=='1'){
            res.json({code:true});
        }else{
            res.json({code:false});
        }
    })
});

module.exports = router;
