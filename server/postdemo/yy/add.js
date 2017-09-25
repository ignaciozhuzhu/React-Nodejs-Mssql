var fun = require('../post_ghNew');
var getdate = require('../getDate');
console.log("当前时间:" + getdate.fn(new Date()));
fun.importDataBatch();