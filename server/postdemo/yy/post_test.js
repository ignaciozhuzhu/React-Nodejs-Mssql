//默认情况下，cookies是禁用的。在defaults或options将jar设为true，使后续的请求都使用cookie.
var request = require('request').defaults({
    jar: true
});
var fun = require('../../data/getHosDataOpeNew');
//var fundel = require('../post_gh_del');
var conf = require('../../sqlserver/config.js');
var fs = require("fs");

var Arraydata = [];
//var ajaxurl = conf.service + "hosDataOpe/importReservation";
var ajaxurl = conf.service + "hosDataOpe/importData";
//前4000条(最近)
var importDataBatch = function() {
    fun.getDoc(function(data) {
        conf.login(function() {
            //  myImport(data);
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
        //console.log(JSON.stringify(Arraydata))
    importGH();
    //console.log("长度:" + options.length)
    for (var i = 0; i < Arraydata.length; i++) {
        console.log(Arraydata.length + "-----" + JSON.stringify(Arraydata[i]));
    }
    fs.writeFile('ghdata.txt', JSON.stringify(Arraydata), function(err) {
        if (err) {
            return console.error(err);
        }
        console.log("数据写入成功！");
    });
    //console.log("长度：" + Arraydata.length + "-----" + JSON.stringify(Arraydata[1]));

    console.log("长度：" + options.length);

    //循环执行导入(批量导入)
    //request(Data(ajaxurl, Arraydata[0]), callback);

    function callback(error, response) {
        //console.log(JSON.stringify(response))
        if (response.body.message == "用户已过期，请重新登录！")
            console.log(response.body.message)
        else if (!error && response.statusCode == 200) {
            console.log('---ok--- \n'); //, data
            console.log("挂号功力传输结束,后台接口正在插入数据,请等候数据数量稳定查询");
            //如果有回调函数的参数,则执行回调函数
        } else {
            console.log('导入失败~~error:' + error + '~~状态:' + JSON.stringify(response) + '~~可能是因为数据量传输过大');
        }

    }
}
importDataBatch();