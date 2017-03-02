var MessageList = [];

exports.getMessageList = function(callback) {
	var db = require('../sqlserver/db');
	db.sql("select top 15 * from t_bl_cz", function(err, result) {
		if (err) {
			console.log(err);
			return;
		}
		console.log('表数据如下 :', result);
		callback(result);
	})
};