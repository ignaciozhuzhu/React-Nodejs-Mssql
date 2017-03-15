var schedule = require("node-schedule");
var fun_gh = require('./post_gh.js');
var fun_yy = require('./post_yy.js');
var getdate = require('./getDate');
var fun_ghnext = require('./post_gh_del.js')

/*var rule = new schedule.RecurrenceRule();
//周一到周日的凌晨3点执行
rule.dayOfWeek = [0, new schedule.Range(1, 6)];　　
rule.hour = 3;
rule.minute = 00;
rule.second = 00;
var j = schedule.scheduleJob(rule, function() {
	console.log("\n当前时间:" + getdate.fn(new Date()) + "##########################");
	fun_gh.importDataBatch();
	fun_yy.importDataResBatch();　
})　　*/


var rule = new schedule.RecurrenceRule();
//rule.second = 10;
//每小时的30分执行
rule.minute = [5, 25, 45];
var j = schedule.scheduleJob(rule, function() {
	console.log("\n当前时间:" + getdate.fn(new Date()) + "##########################");
	//fun_gh.importDataBatch();
	fun_ghnext.deleteNext();
	fun_yy.importDataResBatch();　　
});