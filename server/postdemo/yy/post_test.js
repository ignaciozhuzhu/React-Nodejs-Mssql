var request = require('request');
var fun = require('../../data/getHosDataOpe');
var fundel = require('../post_gh_del');
var conf = require('../../sqlserver/config.js');

var Arraydata = [];
var ajaxurl = conf.service + "hosDataOpe/importAll";
//前4000条(最近)
var importDataBatch = function() {
	fun.getHosDataOpe(function(data) {
		myImport(data);
	})
};

function myImport(data, callbackfun) {
	Arraydata = data;

	function Data(url, body) {
		var O = new Object();
		O.headers = {
			"Connection": "close"
		};
		O.url = url;
		O.method = 'POST';
		O.json = true;
		O.body = body;
		return O;
	}

	var options = [];
	var importGH = function() {
		for (var i = 0, len = Arraydata.length; i < len; i++) {
			//从挂号到结束数据导入的接口,增加至可执行post对象中
			options[i] = Data(ajaxurl, Arraydata[i]);
		}
	}
	importGH();
	//循环执行导入(批量导入)
	//request(Data(ajaxurl, Arraydata), callback);

	function callback(error, response) {
		if (!error && response.statusCode == 200) {
			console.log('---ok--- \n'); //, data
			console.log("挂号功力传输结束,后台接口正在插入数据,请等候数据数量稳定查询");
			//如果有回调函数的参数,则执行回调函数
		} else {
			console.log('导入失败~~error:' + error + '~~可能是因为数据量传输过大');
		}

	}
}
importDataBatch();