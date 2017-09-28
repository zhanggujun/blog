// 数据库；
var mongoose = require("mongoose");
// index表结构;
module.exports = new mongoose.Schema({
    skillId:String,
    nickname:String,
    sex:Boolean,
    imgsrc:String,
    text:String,
    time:Date,
    userId:String,
    headId:String,
});