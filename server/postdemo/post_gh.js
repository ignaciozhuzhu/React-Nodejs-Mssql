var request = require('request');
var fun = require('../data/getHosDataOpe');
var fundel = require('./post_gh_del');
var conf = require('../sqlserver/config.js');

var Arraydata = [];
var ajaxurl = conf.service + "hosDataOpe/importAll";
//前4000条(最近)
exports.importDataBatch = function() {
  //先删除,再异步回来去执行新增,所以需要包裹,将成功事件写到callbackfunction
  fundel.deleteAll(function(callbackfunction) {
    fun.getHosDataOpe(function(data) {
      myImport(data, importDataBatch2);
    })
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
  request(Data(ajaxurl, Arraydata), callback);
  var retryCount = 0;

  function callback(error, response) {
    if (!error && response.statusCode == 200) {
      console.log('---ok--- \n'); //, data
      console.log("挂号功力传输结束,后台接口正在插入数据,请等候数据数量稳定查询");
      //如果有回调函数的参数,则执行回调函数
      if (typeof callbackfun == "function") {
        callbackfun();
      }
    } else {
      console.log('导入失败~~error:' + error + '~~可能是因为数据量传输过大或连接超时');
      //如遇网络或异常问题连接不上接口,等待2分钟后执行删除所有并重新导入一遍.尝试次数为5次.
      setTimeout(function() {
        if (retryCount < 5) {
          console.log("重试次数:" + retryCount)
          fundel.deleteAll(function(callbackfunction) {
            request(Data(ajaxurl, Arraydata), callback);
            retryCount++;
          })
        }
      }, 60e3);
    }

  }
}

//之后剩下的
function importDataBatch2() {
  //先删除,再异步回来去执行新增,所以需要包裹,将成功事件写到callbackfunction
  fun.getHosDataOpe2(function(data) {
    myImport(data, importDataBatch3);
  })
};
//之后剩下的
function importDataBatch3() {
  //先删除,再异步回来去执行新增,所以需要包裹,将成功事件写到callbackfunction
  fun.getHosDataOpe3(function(data) {
    myImport(data);
  })
};


var count = 0;
//使用批量后,弃用
exports.importData = function() {
  fun.getHosDataOpe(function(data) {
    //func_gh_del.importData;
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
      console.log(body)
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
    request(options[0], callback);

    function callback(error, response, data) {
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

      console.log("截止目前总共导入" + count + "条记录");
    }

  })
};