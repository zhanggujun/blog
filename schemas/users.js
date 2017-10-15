// 数据库；
var mongoose = require("mongoose");
// index表结构;
module.exports = new mongoose.Schema({
    nickname:String,
    imgid:String,
    imgsrc:String,
    password:String,
    sex:Boolean,
    time:Date
});