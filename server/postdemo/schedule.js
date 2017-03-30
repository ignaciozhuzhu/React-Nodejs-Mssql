var schedule = require("node-schedule");
var fun_gh = require('./post_gh.js');
var fun_yy = require('./post_yy.js');
var getdate = require('./getDate');
var fun_ghnext = require('./post_gh_del.js')
var fun_yynext = require('./post_yy_del.js');

var rule = new schedule.RecurrenceRule();
rule.dayOfWeek = [0, new schedule.Range(1, 6)];　　
rule.hour = [];
//凌晨2点到3点这块时间段留给ons计划使用.
for (var i = 0; i < 24; i++) {
	if (i != 2)
		rule.hour.push(i)
}
rule.minute = [];
//每分钟执行
for (var i = 0; i < 60; i++) {
	rule.minute.push(i)
}
var j = schedule.scheduleJob(rule, function() {
	console.log("\n当前时间:" + getdate.fn(new Date()));
	//fun_ghnext.deleteNext();　
	//fun_yynext.deleteResNext();　　
});

var ruleons = new schedule.RecurrenceRule();
//周一到周日的凌晨2点执行
ruleons.dayOfWeek = [0, new schedule.Range(1, 6)];　　
ruleons.hour = 2;
ruleons.minute = 5;
ruleons.second = 00;
var jons = schedule.scheduleJob(ruleons, function() {
	//fun_gh.importDataBatch();
	//fun_yy.importDataResBatch();　
});

fun_gh.importDataBatch();
fun_yy.importDataResBatch();　