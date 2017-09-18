var request = require('request').defaults({
    jar: true
});
//var fun = require('../data/getHosDataOpe');
//2017-09-15 因为数据库帐号被删除,无法连接数据库,修改为新的获取数据方法,用纯接口获取
var fun = require('../data/getHosDataOpeNew');
var conf = require('../sqlserver/config.js');

var ajaxurl = conf.service + "hosDataOpe/deleteResAll";
exports.deleteResAll = function(callbackfunction) {
    var count2 = 0;
    // fun.getHosName(function(mdata) {
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
    request(Data(ajaxurl, { "hname": "北京市德倍尔口腔诊所" }), callback);

    function callback(error, response, data) {
        if (!error && response.statusCode == 200) {
            if (count2 == 0) {
                console.log("北京预约已清除")
                request(Data(ajaxurl, { "hname": "天津市德倍尔口腔诊所" }), callback);
            } else if (count2 == 1) {
                console.log("天津预约已清除")
                console.log("开始执行预约导入")
                callbackfunction();
            }
            count2++;
        } else {
            console.log('清除失败~~error:' + error + '~~data:' + data);
        }
    }

    // })
};


var Arraydata = [];
//使用批量后,作为增量更新使用
exports.deleteResNext = function() {
    conf.login(function() {
        var count = 0;
        fun.getHosDataOpeDelResnext(function(data) {
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
                    options[i] = Data(conf.service + 'hosDataOpe/importReservation', Arraydata[i]);
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
                } else if (response == undefined) {
                    console.log("无数据");
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
    })
};