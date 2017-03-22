var request = require('request');
var fun = require('../data/getHosDataOpe');
var conf = require('../sqlserver/config.js');

var ajaxurl = conf.service + "hosDataOpe/deleteAll";
exports.deleteAll = function(callbackfunction) {
  var count2 = 0;
  fun.getHosName(function(mdata) {
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
    request(Data(ajaxurl, mdata[0]), callback);

    function callback(error, response, data) {
      if (!error && response.statusCode == 200) {
        if (count2 == 0) {
          console.log("北京挂号已清除")
          request(Data(ajaxurl, mdata[1]), callback);
        } else if (count2 == 1) {
          console.log("天津挂号已清除")
          console.log("开始执行挂号导入")
          callbackfunction();
        }
        count2++;
      } else {
        console.log('清除失败~~error:' + error + '~~data:' + data);
      }
    }

  })
};


var Arraydata = [];
//使用批量后,作为增量更新使用
exports.deleteNext = function() {
  var count = 0;
  fun.getHosDataOpeDelnext(function(data) {
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
        options[i] = Data(conf.service + 'hosDataOpe/importData', Arraydata[i]);
      }
    }
    importGH();
    //循环执行导入(批量导入)
    try {
      request(options[0], callback);
    } catch (error) {}

    function callback(error, response, data) {
      //try {
      if (!error && response.statusCode == 200) {
        console.log('----info------\n'); //, data
        count++;
        if (count < options.length)
          request(options[count], callback);
      } else {
        console.log('导入失败~~error:' + error + '~~data:' + data);
        count++;
        request(options[count], callback);
      }

      console.log("截止目前总共删除" + count + "条记录");
      // } catch (error) {
      if (count == options.length) {
        console.log("-----------终了-----------");
      }
      // }
    }

  })
};