// 创建index的mongoose模型；
var mongoose = require('mongoose');
var comments = require('../schemas/comments');
module.exports = mongoose.model('comments',comments);
