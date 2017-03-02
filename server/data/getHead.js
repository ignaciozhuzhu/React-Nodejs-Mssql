var MessageList = [];

exports.getHeadName = function(callback) {
	var db = require('../sqlserver/db');
	db.sql("select name from syscolumns where id=object_id('t_bl_cz')", function(err, result) {
		if (err) {
			console.log(err);
			return;
		}
		console.log('表头 :', result);
		callback(result);
	})
};