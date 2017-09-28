var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var multiparty = require('multiparty');
var util = require('util');
var fs = require('fs');
var crypto = require("crypto");

// 前台页
var homeIndex = require('./routes/home/index');
var homeSkill = require('./routes/home/skill');
var homeMood = require('./routes/home/mood');
var homeAbout = require('./routes/home/about');
// 后台页
var adminLogin = require('./routes/admin/login');
var adminUsers = require('./routes/admin/users');
var adminSkills = require('./routes/admin/skills');
var adminEdit = require('./routes/admin/edit');
var adminComments = require('./routes/admin/comments');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json({limit:'10000kb'}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// mongose
var mongoose = require("mongoose"); //引入mongoose
mongoose.connect('mongodb://127.0.0.1:27017/blog',function(err){
  if(err){
    console.log('MongoDB链接失败');
  }else{
    console.log('MongoDB链接成功');
  }
});
mongoose.Promise = global.Promise;
var User = require('./models/users');
// 前台页
app.use('/',homeIndex);
app.use('/skill',homeSkill);
app.use('/mood',homeMood);
app.use('/about',homeAbout);

//后台页路由
app.use('/admin-login',adminLogin);
app.use('/admin-users',adminUsers);
app.use('/admin-skills',adminSkills);
app.use('/admin-edit',adminEdit);
app.use('/admin-comments',adminComments);

// 上传接口
app.use('/upload/images',function(req,res,next){
  //生成multiparty对象，并配置上传目标路径
  var form = new multiparty.Form({uploadDir:'./public/upload/images/'});
  var msg = {};
  //上传完成后处理
  form.parse(req,function(err,fields,files){
    var filesTmp = JSON.stringify(files,null,2);
    res.writeHead(200, {'content-type':'text/plain;charset=utf-8'});
    if(err){
      msg = {
        code:false,
        msg:'上传出错，请重新上传'
      };
      res.end(JSON.stringify(msg));
    }else{
      var inputFile = files.head[0];
      var uploadedPath = inputFile.path;
      var newName = '';
      var dstPath = './public/upload/images/'+inputFile.originalFilename;
      var imgId = ('img_'+Math.random()+Date.now()).replace('.','');
      //重命名为真实文件名
      fs.rename(uploadedPath,dstPath,function(err){
        if(err){
          console.log('重命名失败,'+err);
          newName = uploadedPath.replace('public/','');
          msg = {
            code:true,
            imgId:imgId,
            imgSrc:newName
          };
          res.end(JSON.stringify(msg));
        }else{
          newName = dstPath.replace('public/','');
          msg = {
            code:true,
            imgId:imgId,
            imgSrc:newName
          };
          res.end(JSON.stringify(msg));
        }
      });
    }
  })
});
// 删除图片
app.use('/del/images',function(req,res,next){
  var src = req.body.src;
  if(src){
    fs.unlink('./public/'+src+'',function (err) {
      if(err)
        console.log('删除出错:'+err);
      console.log('删除成功');
    });
  }
});
// 注册;
app.post('/register',function(req,res,next){
  // 性别 data.sex true--男性 false--女性
  var data = JSON.parse(req.body.data);
  var time = new Date().getTime();
  var md5 = crypto.createHash("md5");
  var newPsw = md5.update(data.password).digest("hex");
  User.findOne({
    nickname:data.nickname
  }).then(function(userInfo){
    if(userInfo){
      res.json({
        code:false,
        msg:'该用户已存在，请重新注册'
      });
      return false;
    }
    return new User({
      nickname:data.nickname,
      imgid:data.imgId,
      imgsrc:data.imgSrc,
      password:newPsw,
      sex:data.sex,
      time:time
    }).save();
  }).then(function(newInfo){
    if(newInfo){
      res.json({
        code:true,
        msg:'注册成功'
      });
    }
  });
});
//登陆;
app.post('/login',function(req,res,next){
  var md5 = crypto.createHash("md5");
  var nickname = req.body.nickname;
  var _password = req.body.password;
  var password = md5.update(_password).digest("hex");
  User.findOne({nickname:nickname}).then(function(userInfo){
    if(userInfo){
      if(userInfo.password==password&&userInfo.nickname==nickname){
        res.cookie('user',JSON.stringify(userInfo));
        res.json({
          code:true,
        });
      }else{
        res.json({
          code:false,
          msg:'用户名或密码错误，请重新登陆'
        });
      }
    }else{
      res.json({
        code:false,
        msg:'用户名或密码错误，请重新登陆'
      })
    }
  });
});
app.post('/logout',function(req,res,next){
  res.clearCookie('user');
  res.json({
    code:true
  });
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
