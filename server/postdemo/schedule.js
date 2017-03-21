var schedule = require("node-schedule");
var fun_gh = require('./post_gh.js');
var fun_yy = require('./post_yy.js');
var getdate = require('./getDate');
var fun_ghnext = require('./post_gh_del.js')
var fun_yynext = require('./post_yy_del.js');

var rule = new schedule.RecurrenceRule();
//rule.second = 10;
//每小时的30分执行
//20分钟一次
rule.minute = [10, 15, 20, 25, 30, 35, 40, 45, 50, 55];
var j = schedule.scheduleJob(rule, function() {
	console.log("\n当前时间:" + getdate.fn(new Date()));
	fun_ghnext.deleteNext();　
	fun_yynext.deleteResNext();　　
});

var rule2 = new schedule.RecurrenceRule();
//周一到周日的凌晨3点执行
rule2.dayOfWeek = [0, new schedule.Range(1, 6)];　　
rule2.hour = 2;
rule2.minute = 00;
rule2.second = 00;
var j2 = schedule.scheduleJob(rule2, function() {
	fun_gh.importDataBatch();
	fun_yy.importDataResBatch();　
});