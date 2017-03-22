var request = require('request');
var fun = require('../data/getHosDataOpe');
var fundel = require('./post_yy_del');
var conf = require('../sqlserver/config.js');

var Arraydata = [];
var ajaxurl = conf.service + "hosDataOpe/importResAll";
//前4000条(最近)
exports.importDataResBatch = function() {
  //先删除,再异步回来去执行新增,所以需要包裹,将成功事件写到callbackfunction
  fundel.deleteResAll(function(callbackfunction) {
    fun.getReservation(function(data) {
      myImport(data, importDataBatch2);
    })
  })
};

function myImport(data, callbackfun) {
  Arraydata = data;
  console.log("预约此次传递数据的长度:" + JSON.stringify(data).length)

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
      console.log("预约功力传输结束,后台接口正在插入数据,请等候数据数量稳定查询");
      //如果有回调函数的参数,则执行回调函数
      if (typeof callbackfun == "function") {
        callbackfun();
      }
    } else {
      console.log('预约导入失败~~error:' + error + '~~状态:' + JSON.stringify(response) + '可能是因为数据量传输过大或连接超时');
      //如遇网络或异常问题连接不上接口,等待2分钟后执行删除所有并重新导入一遍.尝试次数为5次.
      setTimeout(function() {
        if (retryCount < 5) {
          console.log("预约重试次数:" + retryCount)
          fundel.deleteResAll(function(callbackfunction) {
            request(Data(ajaxurl, Arraydata), callback);
            retryCount++;
          })
        }
      }, 120e3);
    }

  }
}

//之后剩下的
function importDataBatch2() {
  //先删除,再异步回来去执行新增,所以需要包裹,将成功事件写到callbackfunction
  fun.getReservation2(function(data) {
    myImport(data, importDataBatch3);
  })
};
//之后剩下的
function importDataBatch3() {
  //先删除,再异步回来去执行新增,所以需要包裹,将成功事件写到callbackfunction
  fun.getReservation3(function(data) {
    myImport(data, importDataBatch4);
  })
};
//之后剩下的
function importDataBatch4() {
  //先删除,再异步回来去执行新增,所以需要包裹,将成功事件写到callbackfunction
  fun.getReservation4(function(data) {
    myImport(data, importDataBatch5);
  })
};
//之后剩下的
function importDataBatch5() {
  //先删除,再异步回来去执行新增,所以需要包裹,将成功事件写到callbackfunction
  fun.getReservation5(function(data) {
    myImport(data, importDataBatch6);
  })
};
//之后剩下的
function importDataBatch6() {
  //先删除,再异步回来去执行新增,所以需要包裹,将成功事件写到callbackfunction
  fun.getReservation6(function(data) {
    myImport(data);
  })
};

//使用批量后,弃用
exports.getReservation = function(index_b, index_e) {
  var Arraydata = [];
  var count = index_b;
  fun.getReservation(function(data) {
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
        options[i] = Data(conf.service + '/hosDataOpe/importReservation', Arraydata[i]);
      }
    }
    importGH();
    //循环执行导入(批量导入)
    for (var j = 0; j < 1000; j++) {
      request(options[j], callback);
    }

    function imp() {
      count++;
      if (count < index_e) {
        request(options[count], callback);
      } else if (count == index_e) {
        //console.log("导入结束.");
        //return
      }
    }

    function callback(error, response, data) {
      if (!error && response.statusCode == 200) {
        count++;
        console.log('----info------\n'); //, data
        //imp();
      } else {
        console.log('导入失败~~error:' + error + '~~data:' + data);
        //imp();
      }
      console.log("截止目前总共导入" + count + "条记录");
    }

  });
}