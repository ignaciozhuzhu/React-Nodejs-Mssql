var fun = require('../post_yy_del');
var getdate = require('../getDate');
console.log("当前时间:" + getdate.fn(new Date()));
fun.deleteResNext();