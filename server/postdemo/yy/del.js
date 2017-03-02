var fun = require('../post_gh_del');
var getdate = require('../getDate');
console.log("当前时间:" + getdate.currentdate);

function a() {
	console.log("del")
}
fun.deleteAll(a);