var schedule = require("node-schedule");
var fun_gh = require('./post_ghNew.js');
var fun_yyNew = require('./post_yyNew.js');
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
    fun_ghnext.deleteNext();
    fun_yynext.deleteResNext();
    //同步预约数据至科胜,包括病人
    fun_yy.sync2KS();
});

var ruleons = new schedule.RecurrenceRule();
//周一到周日的凌晨2点5执行
ruleons.dayOfWeek = [0, new schedule.Range(1, 6)];　　
ruleons.hour = 2;
ruleons.minute = 5;
ruleons.second = 00;
var jons = schedule.scheduleJob(ruleons, function() {
    fun_gh.importDataBatch();
});

var ruleons2 = new schedule.RecurrenceRule();
//周一到周日的凌晨2点20执行
ruleons2.dayOfWeek = [0, new schedule.Range(1, 6)];　　
ruleons2.hour = 2;
ruleons2.minute = 20;
ruleons2.second = 00;
var jons2 = schedule.scheduleJob(ruleons2, function() {
    fun_yyNew.importDataResBatch();　
});