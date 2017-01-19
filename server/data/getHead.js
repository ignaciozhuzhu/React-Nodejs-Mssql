var MessageList = [];

exports.getHeadName = function(callback) {
	var db = require('../sqlserver/db');
	db.sql("select name from syscolumns where id=object_id('WXUser')", function(err, result) {
		if (err) {
			console.log(err);
			return;
		}
		console.log('表数据如下 :', result);
		callback(result);
	})
};