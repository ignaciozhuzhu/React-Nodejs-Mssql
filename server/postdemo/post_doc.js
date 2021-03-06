var request = require('request').defaults({
  jar: true
});
var fun = require('../data/getHosDataOpe');
var conf = require('../sqlserver/config.js');

var Arraydata = [];
var count = 0;
fun.getDoc(function(data) {
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
  var importDoc = function() {
    for (var i = 0, len = Arraydata.length; i < len; i++) {
      //从挂号到结束数据导入的接口,增加至可执行post对象中
      options[i] = Data(conf.service + 'hosDataOpe/importDoc', Arraydata[i]);
    }
  }
  importDoc();
  //循环执行导入(批量导入)
  request(options[0], callback);

  function callback(error, response, data) {
    if (!error && response.statusCode == 200) {
      console.log('----info------\n'); //, data
      count++;
      if (count < options.length)
        request(options[count], callback);
    } else {
      console.log('导入失败~~error:' + error + '~~data:' + data);
      //数据量少的情况下可以选择自增
      count++;
      request(options[count], callback);
    }

    console.log("截止目前总共导入" + count + "条记录");
  }

});