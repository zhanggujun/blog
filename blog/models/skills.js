// 创建index的mongoose模型；
var mongoose = require('mongoose');
var skills = require('../schemas/skills');
module.exports = mongoose.model('skills',skills);
