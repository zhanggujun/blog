// 创建index的mongoose模型；
var mongoose = require('mongoose');
var user = require('../schemas/users');
module.exports = mongoose.model('user',user);
