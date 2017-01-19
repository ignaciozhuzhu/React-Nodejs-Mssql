var getHeadName = require('../../data/getHead');

exports.execute = function(req, res) {
	getHeadName.getHeadName(function(data) {
		res.send(data);
	});
};