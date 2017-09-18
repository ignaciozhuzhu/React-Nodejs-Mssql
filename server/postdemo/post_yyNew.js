var request = require('request').defaults({
    jar: true
});
var fun = require('../data/getHosDataOpeNew');
var fundel = require('./post_yy_del');
var conf = require('../sqlserver/config.js');

var Arraydata = [];
var ajaxurl = conf.service + "hosDataOpe/importResAll";
//var yypiece_count;
var year = 2013;
var month = 10;
var retryCount;
//前4000条(最近)
exports.importDataResBatch = function() {
    retryCount = 0;
    //先删除,再异步回来去执行新增,所以需要包裹,将成功事件写到callbackfunction
    conf.login(function() {
        fundel.deleteResAll(function(callbackfunction) {
            fun.getReservation2(function(data) {
                year = 2013; //该变量用于计数,与importDataBatch2共存亡
                myImport(data, importDataBatch2);
            }, year, month)
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

    function callback(error, response) {
        if (!error && response.statusCode == 200) {
            console.log('---ok--- \n'); //, data
            console.log("预约功力传输结束,后台接口正在插入数据,请等候数据数量稳定查询");
            //如果有回调函数的参数,则执行回调函数
            if (typeof callbackfun == "function") {
                callbackfun();
            }
        } else {
            setTimeout(function() {
                if (retryCount < 5) {
                    //如遇网络或异常问题连接不上接口,等待2分钟后执行删除所有并重新导入一遍.尝试次数为5次.
                    (function() {
                        console.log('预约导入失败~~error:' + error + '~~状态:' + JSON.stringify(response) + '可能是因为数据量传输过大或连接超时');
                        retryCount++;
                        console.log("预约重试次数:" + retryCount);
                    })(
                        fundel.deleteResAll(function(callbackfunction) {
                            fun.getReservation2(function(data) {
                                year = 2013; //该变量用于计数,与importDataBatch2共存亡
                                myImport(data, importDataBatch2);
                            })
                        }, year, month))
                }
            }, 120e3);
        }

    }
}

//之后剩下的

function importDataBatch2() {
    //先删除,再异步回来去执行新增,所以需要包裹,将成功事件写到callbackfunction
    //fun.getyypiece(function(p) {
    console.log("目前月:" + month)
    console.log("目前年:" + year)
    fun.getReservation2(function(data) {
        if (year < 2015) {
            if (month < 3) {
                myImport(data, function() {
                    importDataBatch2(month++)
                });
            } else {
                myImport(data, function() {
                    importDataBatch2(year++, month = 1)
                });
            }
        }
    }, year, month)
}