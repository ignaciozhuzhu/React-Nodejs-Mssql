var request = require('request');
var request2 = require('request').defaults({
    jar: true
});
var localService = require('../sqlserver/config').localService;
var service = require('../sqlserver/config').service;

/*同步
 *预约
 *数据,医院暂时写默认值*/
exports.getReservation2 = function(callback, year, month) {
    GetData();

    function GetData() {
        if (month < 10)
            month = '0' + month;
        request(localService + '/Keson_GetYYData?ReturnType=1&NumType=1&cValue=&cStartDate=' + year + '' + month + '01&cEndDate=' + year + '' + month + '31', function(error, response, body) {
            formatYYdata(error, response, body, callback, 0);
        });
    }
};

/*同步
 *挂号
 *数据,医院暂时写默认值*/
exports.getHosDataOpe2 = function(callback, year, month) {
    GetData();

    function GetData() {
        if (month < 10)
            month = '0' + month;
        request(localService + '/Keson_GetJZData?ReturnType=1&NumType=1&Guid=&StartData=' + year + '' + month + '01&EndData=' + year + '' + month + '31', function(error, response, body) {
            formatGHdata(error, response, body, callback, 0);
        });
    }
};


/*增量删除新增
 *预约
 *数据*/
exports.getHosDataOpeDelResnext = function(callback) {
    var Now = date2Format2(getNowFormatDate());
    GetData();

    function GetData() {
        request(localService + '/Keson_GetYYData?ReturnType=1&NumType=1&cValue=&cStartDate=' + Now + '&cEndDate=' + Now + '', function(error, response, body) {
            formatYYdata(error, response, body, callback, 2);
        });
    }

};
/*增量删除新增
 *挂号
 *数据*/
exports.getHosDataOpeDelnext = function(callback) {
    var Now = date2Format2(getNowFormatDate());
    GetData();

    function GetData() {
        request(localService + '/Keson_GetJZData?ReturnType=1&NumType=1&Guid=&StartData=' + Now + '&EndData=' + Now + '', function(error, response, body) {
            console.log("body:" + body)
            formatGHdata(error, response, body, callback, 2);
        });
    }
};


// 预约写入科胜
exports.YYData_Add = function(callback) {
    request(localService + '/Keson_PostYYData_Add?ReturnType=1&IsNewPatient=1&cValue=88cc3052-d92d-4523-adf4-5752500e80c3&cPatNo=10000&cPatName=龙鸿轩1&cDate=20170919&cTime=16:00&nlen=30&Doctorid=00011&DoctorName=侯博&CText=test0&CMemo=test1&Hosp_no=001&nSource=1', function(error, response, body) {
        if (!error && response.statusCode == 200) {
            var str = body;
            str = subJson(str);
            var arr = JSON.parse(str);
            console.log("datajson:" + JSON.stringify(arr));
            callback(arr)
        } else console.log(error);
    });
}

// 删除科胜预约
exports.YYData_Del = function(callback) {
    request(localService + '/Keson_PostYYData_Del?ReturnType=1&cValue=88cc3052-d92d-4523-adf4-5752500e80c3', function(error, response, body) {
        if (!error && response.statusCode == 200) {
            var str = body;
            str = subJson(str);
            var arr = JSON.parse(str);
            console.log("datajson:" + JSON.stringify(arr));
            callback(arr)
        } else console.log(error);
    });
}

// 将科胜接口获取过来的数据做转化至牙艺接口使用
function formatYYdata(error, response, body, callback, flag) {
    if (!error && response.statusCode == 200) {
        var str = body;
        str = subJson(str);
        var arr = JSON.parse(str);
        var arrNew = [];
        var Ob = {}
        for (var i = 0, len = arr.length; i < len; i++) {
            //科胜的来源需要导,牙艺的不需要 -- > nSource 1：牙艺0:科胜
            if (arr[i].nSource == 0) {
                Ob = {
                    hospitalname: arr[i].Hosp_no == '001' ? '天津市德倍尔口腔诊所' : '北京市德倍尔口腔诊所',
                    doctorname: arr[i].DoctorName, //医生姓名
                    reserved_date: date2Format(arr[i].cDate), //预约日期，格式yyyy-mm-dd（必填）
                    reserved_time: arr[i].cTime, //预约时间，格式hh:mm,例如：08:30
                    remark: arr[i].CText, //备注信息
                    isfirst: arr[i].IsNew == 1 ? 0 : 1, //暂未提供,向对方提出加进来,是否复诊病人 --9.25已提供 1是新,和我们相反
                    // 牙艺: "isfirst": 新老病人，0新病人，1老病人
                    flag: 0, //flag：预约状态，0未确认，1已确认，3已失约..暂未提供
                    fullname: arr[i].PatientName || 'noname',
                    idcard: arr[i].cId, //患者身份证号,10.9已提供
                    anamnesisno: arr[i].PatientNo, //患者病历号
                    gender: arr[i].cGender == null ? 0 : arr[i].cGender == '男' ? 1 : -1,
                    //性别,暂未提供 --9.25已提供null ,
                    // 牙艺: "gender":"性别，1男，-1女，0未知",
                    //--10.9 已提供男女
                    mobile: arr[i].Mobile,
                    otherphone: '', //其他联系方式,暂未提供
                    birthday: arr[i].cBirthday.replace(/\s/g, "").length != 8 ? '2000-01-01' : date2Format(arr[i].cBirthday), //患者生日,暂未提供 --9.25已提供null
                    //10.9 已提供
                    address: arr[i].cAddress, //患者地址,10.9已提供
                    guid: arr[i].cGuid, //cGuid是预约主键值（修改删除时要用）
                    d: flag //d: 操作标志，0增加，1删除，2先删除后增加dd
                }
                arrNew.push(Ob)
            }
        }
        //console.log("datajson:" + JSON.stringify(arrNew));
        callback(arrNew)
    } else console.log(error);
}


// 将科胜接口获取过来的数据做转化至牙艺接口使用
function formatGHdata(error, response, body, callback, flag) {
    if (!error && response.statusCode == 200) {
        var str = body;
        str = subJson(str);
        var arr = JSON.parse(str);
        var arrNew = [];
        for (var i = 0, len = arr.length; i < len; i++) {
            arrNew[i] = {
                pmobile: arr[i].Mobile,
                pname: arr[i].PatientName || 'noname',
                gender: arr[i].cGender == null ? 0 : arr[i].cGender == '男' ? 1 : -1,
                //性别 --9.25已提供null ,
                // 牙艺: "gender":"性别，1男，-1女，0未知",
                //--10.9 已提供男女
                birthday: arr[i].cBirthDay.replace(/\s/g, "").length != 8 ? '2000-01-01' : date2Format(arr[i].cBirthDay),
                //患者生日提供 --9.25已提供null
                //10.9 已提供
                isfirst: arr[i].cIdentity == '初诊' ? 0 : 1,
                //向对方提出加进来,是否复诊病人 --9.25已提供 1是新,和我们相反,挂号未提供
                //10.9提供 cIdentity  挂号身份（初诊，复诊）
                hname: arr[i].Hosp_no == '001' ? '天津市德倍尔口腔诊所' : '北京市德倍尔口腔诊所',
                dname: arr[i].DoctorName, //医生姓名
                booking_items: arr[i].CMx.length > 0 ? arr[i].CMx[0].cDenkName : '',
                //处置明细是一个list,取第一个作为标题  -- 对应牙艺的"挂号事项"
                important: 0, //暂未提供,先默认为0 是否重要  0-不重要   1-重要
                anamnesisno: arr[i].PatientNo, //病历编号
                bookingtime: dateFormatStamp(arr[i].cDate), //科胜的格式是20170901,牙艺的格式是时间戳,需要转
                ordercontent: '服务内容', //暂未提供,给默认值
                totalprice: arr[i].nysje * 100, // 科胜:应收金额,单位元 -- 牙艺:总金额(应收)  单位:分
                reduce: arr[i].nzkje * 100, // 科胜:折扣金额,单位元 -- 牙艺:折扣  单位:分
                services: list2String(arr[i].CMx),
                //牙艺:服务项目  名称1,数量1;名称2,数量2,
                ordertime: dateFormatStamp(arr[i].cDate), //暂未提供,同bookingtime
                tradeno: '', //暂未提供
                channel: 5,
                // 科胜:收费类型(正常收费) -- 牙艺:支付方式 1-支付宝 2-微信 3-银联 4-银行卡 5-现金 
                paytime: dateFormatStamp(arr[i].cDate), //暂未提供,同bookingtime
                refundtime: '', //暂未提供,为空
                refundmoney: '', //暂未提供,为空
                ghid: uuid(), //暂未提供,随机生成
                d: flag //d: 操作标志，0增加，1删除，2先删除后增加dd
            }
        }
        //console.log("datajson:" + JSON.stringify(arrNew));
        callback(arrNew)
    } else console.log(error);
}


/*查询牙艺最新预约患者信息,并从牙艺同步至科胜
 *9.25
 *龙鸿轩
 *两步骤 patientSync,reservationSync
 */

//同步患者至科胜
exports.patientSync = function(callbackfun) {
    //先调用牙艺的最新插入病人接口
    request(service + 'hosDataOpe/selectNewHosPatient', function(error, response, body) {
        if (!error && response.statusCode == 200) {
            //console.log(body)
            var arr = JSON.parse(body);
            if (arr.data.length > 0) {
                for (var i = 0; i < arr.data.length; i++) {
                    //这里需要闭包,参照经典闭包法
                    (function(i) {
                        //再调用2.1 得到病人在系统的唯一关键字,判断是否需要往科胜数据库插入新病人.
                        var uriGet = localService + '/GetPatientGuid?ReturnType=1&NumType=1&cNo=' + arr.data[i].mobile + '&cName=' + arr.data[i].patientname + ''
                        request(uriGet, function(error, response, body) {
                            if (!error && response.statusCode == 200) {
                                var str = subJson(body)
                                var arrKs = JSON.parse(str);
                                //console.log("arrKs.cGuid:" + arrKs.cGuid)
                                if (arrKs.cGuid == "") {
                                    //是的话就调用2．7 病人信息写入方法
                                    var newUuid = uuid();
                                    var anamnesisno = arr.data[i].anamnesisno
                                    var patientname = arr.data[i].patientname;
                                    var gender = arr.data[i].gender == '1' ? '男' : '女';
                                    var birthday = arr.data[i].birthday;
                                    var idcard = arr.data[i].idcard;
                                    var mobile = arr.data[i].mobile;
                                    var otherphone = arr.data[i].otherphone;
                                    var wx = arr.data[i].wx;
                                    var address = arr.data[i].address;
                                    var firstdate = arr.data[i].firstdate;
                                    var type = arr.data[i].type;
                                    var Hosp_no = arr.data[i].hospitalname == '天津市德倍尔口腔诊所' ? '001' : '002';
                                    var uriAdd = localService + '/Keson_PostPatientData_Add?ReturnType=1&cValue=' + newUuid + '&cPatNo=' + anamnesisno + '&cPatName=' + patientname + '&cGender=' + gender + '&cBirthDay=' + birthday + '&cId=' + idcard + '&cMobile=' + mobile + '&cTelephone=' + otherphone + '&cweixin=' + wx + '&cAddress1=' + address + '&cFirstdate=' + firstdate + '&cSource=牙艺平台&cType=' + type + '&cIntroducer=牙艺平台&Hosp_no=' + Hosp_no + '';
                                    console.log("uriAdd:" + uriAdd)
                                    request(uriAdd, function(error, response, body) {
                                        if (!error && response.statusCode == 200) {
                                            console.log('病人写入成功')
                                            callbackfun();
                                        } else {
                                            console.log('病人写入失败' + error);
                                            callbackfun()
                                        }

                                    })
                                } else {
                                    console.log("该牙艺新患者已在科胜库中.")
                                    callbackfun();
                                }
                            } else console.log(error);
                        });
                    })(i)
                }
            } else console.log('无最新患者')
        } else console.log(error);
    })
}

//同步预约至科胜
exports.reservationSync = function() {
    //先调用牙艺的最新插入病人接口
    request(service + 'hosDataOpe/selectNewReservation', function(error, response, body) {
        if (!error && response.statusCode == 200) {
            //console.log(body)
            var arr = JSON.parse(body);
            if (arr.data.length > 0) {
                for (var i = 0; i < arr.data.length; i++) {
                    //这里需要闭包,参照经典闭包法
                    (function(i) {
                        //2.6.1 预约写入方法 同步至科胜
                        var isfirst = arr.data[i].isfirst == 1 ? 0 : 1
                        var guid = getInitConcatId(arr.data[i].id)
                        var anamnesisno = arr.data[i].anamnesisno
                        var patientname = arr.data[i].patientname
                        var reserved_date = date2Format2(arr.data[i].reserved_date)
                        var reserved_time = (arr.data[i].reserved_time.substring(0, 5))
                        var nlen = ((arr.data[i].duration) / 60);
                        getDoctorId(arr.data[i].doctorname, function(doctorid) {
                            //console.log("doctorid:" + doctorid)
                            var doctorname = arr.data[i].doctorname;
                            var items = arr.data[i].items;
                            var remark = arr.data[i].remark;
                            var Hosp_no = arr.data[i].hospitalname == '天津市德倍尔口腔诊所' ? '001' : '002';
                            var uriAdd = localService + '/Keson_PostYYData_Add?ReturnType=1&IsNewPatient=' + isfirst + '&cValue=' + guid + '&cPatNo=' + anamnesisno + '&cPatName=' + patientname + '&cDate=' + reserved_date + '&cTime=' + reserved_time + '&nlen=' + nlen + '&Doctorid=' + doctorid + '&DoctorName=' + doctorname + '&CText=' + items + '&CMemo=' + remark + '&Hosp_no=' + Hosp_no + '&nSource=1'
                            console.log("uriAdd:" + uriAdd)
                            request(uriAdd, function(error, response, body) {
                                if (!error && response.statusCode == 200) {
                                    var strRes = subJson(body)
                                    if (strRes == 1)
                                        console.log('预约写入成功')
                                    else if (strRes == 0)
                                        console.log('预约写入失败')
                                    else
                                        console.log('预约写入失败2:' + strRes)

                                } else console.log('预约写入失败:' + error);
                            })
                        })
                    })(i)
                }
            } else console.log('无最新患者')
        } else console.log(error);
    })
}


exports.getHosDataOpeTest2 = function(callback) {
    GetData();

    function GetData() {
        request(localService + '/Keson_GetPatienData?ReturnType=1&Guid=f9d84510-b6ce-4baf-9e3c-161697f32a3d', function(error, response, body) {
            if (!error && response.statusCode == 200) {
                var str = body;
                str = subJson(str)
                console.log("datajson:" + str);
                callback(str)
            } else console.log(error);
        });
    }
};

//获取医院名
exports.getHosName = function(callback) {
    var db = require('../sqlserver/db');
    var str = "select '北京市德倍尔口腔诊所' as hname union select '天津市德倍尔口腔诊所' as hname";
    db.sql(str, function(err, result) {
        if (err) {
            console.log(err);
            return;
        }
        callback(result);
    })
};

//获取当前时间戳
function gettimestamp() {
    var timeStamp = new Date(new Date().setHours(0, 0, 0, 0)) / 1000;
    return timeStamp;
}

//裁掉前后这段:<?xml version="1.0" encoding="utf-8"?><string xmlns="http://tempuri.org/"></string>
function subJson(str) {
    return str = str.substr(76, str.length - 85);
}
//获取当前时间
function getNowFormatDate() {
    var date = new Date();
    var seperator1 = "-";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate;
    return currentdate;
}


//YYYYmmdd 转YYYY-mm-dd
function date2Format(str) {
    return str.substr(0, 4) + '-' + str.substr(4, 2) + '-' + str.substr(6, 2);
}

// YYYY-mm-dd 转 YYYYmmdd
function date2Format2(str) {
    return str.substr(0, 4) + str.substr(5, 2) + str.substr(8, 2);
}


//YYYYmmdd转时间戳
function dateFormatStamp(date, time) {
    var strtime = date2Format(date) + ' ' + time + ':00';
    var dateNew = new Date(strtime); //传入一个时间格式，如果不传入就是获取现在的时间了，这样做不兼容火狐。
    return (dateNew.getTime()) / 1000;
}

//随机生成uuid
function uuid() {
    var s = [];
    var hexDigits = "0123456789abcdef";
    for (var i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = "-";

    var uuid = s.join("");
    return uuid;
}

//0+id补全uuid字数
function getInitConcatId(id) {
    var init = '00000000-0000-0000-0000-000000000000'
    return init.substring(0, init.length - id.toString().length) + id
}


// 服务项目list 转string格式
function list2String(list) {
    var str = '';
    if (list.length > 0) {
        for (var i = 0; i < list.length; i++) {
            str = str + list[i].cDenkName + ',' + list[i].nNumber + ';'
        }
        return str;
    } else return ''
}

//2.2 科胜接口 得到医生编号
function getDoctorId(name, callback) {
    var uriGet = localService + '/Keson_GetDoctorGuid?ReturnType=1&NumType=1&cNo=&cName=' + name + ''
    request(uriGet, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            var str = subJson(body)
            var arr = JSON.parse(str)
            callback(arr.cemployee)
        } else console.log('查无此医生')
    })
}

//同步医生数据,医院暂时写默认值,(大部分员工(80来个)没有手机号,则先不导入)
exports.getDoc = function(callback) {
    GetData();

    function GetData() {
        request(localService + '/Keson_GetDoctorList?ReturnType=1', function(error, response, body) {
            if (!error && response.statusCode == 200) {
                var str = body;
                str = subJson(str);
                var arr = JSON.parse(str);
                var arrNew = [];
                for (var i = 0, len = arr.length; i < len; i++) {
                    if (arr[i].lzz == 1) {
                        arrNew.push(arr[i])
                    }
                }
                callback(arrNew)
            } else console.log(error);
        });
    }
};

//同步预约数据,医院暂时写默认值
//导入会有缺少,因为有重复数据,我们的接口会自动过滤,比如有次导出1080条,只导入了1068条,这个其实是正常的.
exports.getService = function(callback) {
    var db = require('../sqlserver/db');
    var str = "select cypmc as title,cast(njhcb*100 as int) as price,cast(njhcb1*100 as int) as reduce,'北京市德倍尔口腔诊所' as hospitalname,'1' as [on],tsm as detail,b.cname as tagname,cdw as unit from t_yp a inner join t_yplb b on a.cyplb=b.cno union all select cypmc as title,cast(njhcb*100 as int) as price,cast(njhcb1*100 as int) as reduce,'天津市德倍尔口腔诊所' as hospitalname,'1' as [on],tsm as detail,b.cname as tagname,cdw as unit from t_yp a inner join t_yplb b on a.cyplb=b.cno ";
    db.sql(str, function(err, result) {
        if (err) {
            console.log(err);
            return;
        }
        callback(result);
    })
};
exports.getServiceYlkm = function(callback) {
    var db = require('../sqlserver/db');
    var str = "select cname as title,0 as price,0 as reduce,'天津市德倍尔口腔诊所' as hospitalname,'1' as [on],'tjms' as detail,ckjkm as tagname,'次' as unit from T_ylkm        union all select cname as title,0 as price,0 as reduce,'北京市德倍尔口腔诊所' as hospitalname,'1' as [on],'bjms' as detail,ckjkm as tagname,'次' as unit from T_ylkm";
    db.sql(str, function(err, result) {
        if (err) {
            console.log(err);
            return;
        }
        callback(result);
    })
};