// 数据库；
var mongoose = require("mongoose");
// index表结构;
module.exports = new mongoose.Schema({
    text:String,
    title:String,
    user:String,
    type:String,
    time:Date
});