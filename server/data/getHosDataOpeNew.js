var request = require('request');
var localService = require('../sqlserver/config').localService;

var cake = 4000;
//同步挂号数据
exports.getHosDataOpe = function(callback) {
    var db = require('../sqlserver/db');
    var str = creategh(0) + "select top(" + cake + ")  * from ##gh order by ghid desc";
    db.sql(str, function(err, result) {
        if (err) {
            console.log(err);
            return;
        }
        callback(result);
    })
};
exports.getHosDataOpe2 = function(callback, piece) {
    var db = require('../sqlserver/db');
    var str = creategh(0) + getlastghid(piece) + "select top(" + cake + ") * from ##gh where ghid<@lastid order by ghid desc";
    db.sql(str, function(err, result) {
        if (err) {
            console.log(err);
            return;
        }
        callback(result);
    })
};

//同步预约数据,医院暂时写默认值
exports.getReservation = function(callback) {
    var db = require('../sqlserver/db');
    var str = createyy() + "select top(" + cake + ") * from ##yy order by yyid desc ";
    db.sql(str, function(err, result) {
        if (err) {
            console.log(err);
            return;
        }
        callback(result);
    })
};
//同步预约数据,医院暂时写默认值
exports.getReservation2 = function(callback, piece) {
    var db = require('../sqlserver/db');
    var str = createyy() + getlastyyid(piece) + "select top(" + cake + ") * from ##yy where yyid<@lastid order by yyid desc ";
    db.sql(str, function(err, result) {
        if (err) {
            console.log(err);
            return;
        }
        callback(result);
    })
};


//增量删除新增预约数据
exports.getHosDataOpeDelResnext = function(callback) {

    GetData();

    function GetData() {
        request(localService + '/Keson_GetYYData?ReturnType=1&NumType=1&cValue=&cStartDate=20170914&cEndDate=20170914', function(error, response, body) {
            if (!error && response.statusCode == 200) {
                var str = body;
                str = subJson(str);
                var arr = JSON.parse(str);
                var arrNew = [];
                for (var i = 0, len = (arr.length - 40); i < len; i++) {
                    /*                    arrNew[i].hospitalname = arr[i].Hosp_no == '001' ? '天津市德倍尔口腔诊所' : '北京市德倍尔口腔诊所';
                                        arrNew[i].doctorname = arr[i].DoctorName; //医生姓名
                                        arrNew[i].reserved_date = arr[i].cDate; //预约日期，格式yyyy-mm-dd（必填）
                                        arrNew[i].reserved_time = arr[i].cTime; //预约时间，格式hh:mm,例如：08:30
                                        arrNew[i].remark = arr[i].CText; //备注信息
                                        arrNew[i].isfirst = 0; //暂未提供,向对方提出加进来,是否复诊病人
                                        arrNew[i].flag = 0; //flag：预约状态，0未确认，1已确认，3已失约..暂未提供
                                        arrNew[i].fullname = arr[i].PatientName || 'noname';
                                        arrNew[i].idcard = '' //患者身份证号,暂未提供
                                        arrNew[i].anamnesisno = arr[i].PatientNo; //患者病历号
                                        arrNew[i].gender = 1; //性别,暂未提供
                                        arrNew[i].mobile = arr[i].Mobile;
                                        arrNew[i].otherphone = ''; //其他联系方式,暂未提供
                                        arrNew[i].birthday = '20000101' //患者生日,暂未提供
                                        arrNew[i].address = '' //患者地址,暂未提供
                                        arrNew[i].guid = arr[i].cGuid //cGuid是预约主键值（修改删除时要用）
                                        arrNew[i].upt = '20170901'; //当前时间
                                        arrNew[i].d = 2; //d: 操作标志，0增加，1删除，2先删除后增加*/
                    arrNew[i] = {
                        hospitalname: arr[i].Hosp_no == '001' ? '天津市德倍尔口腔诊所' : '北京市德倍尔口腔诊所',
                        doctorname: arr[i].DoctorName, //医生姓名
                        reserved_date: arr[i].cDate, //预约日期，格式yyyy-mm-dd（必填）
                        reserved_time: arr[i].cTime, //预约时间，格式hh:mm,例如：08:30
                        remark: arr[i].CText, //备注信息
                        isfirst: 0, //暂未提供,向对方提出加进来,是否复诊病人
                        flag: 0, //flag：预约状态，0未确认，1已确认，3已失约..暂未提供
                        fullname: arr[i].PatientName || 'noname',
                        idcard: '', //患者身份证号,暂未提供
                        anamnesisno: arr[i].PatientNo, //患者病历号
                        gender: 1, //性别,暂未提供
                        mobile: arr[i].Mobile,
                        otherphone: '', //其他联系方式,暂未提供
                        birthday: '20000101', //患者生日,暂未提供
                        address: '', //患者地址,暂未提供
                        guid: arr[i].cGuid, //cGuid是预约主键值（修改删除时要用）
                        upt: '20170901', //当前时间
                        d: 2 //d: 操作标志，0增加，1删除，2先删除后增加
                    }
                }



                console.log("datajson:" + JSON.stringify(arrNew));
                callback(arrNew)
            } else console.log(error);
        });
    }

};
//增量删除新增挂号数据
exports.getHosDataOpeDelnext = function(callback) {
    var db = require('../sqlserver/db');
    console.log("当前时间戳:" + gettimestamp())
    var str = creategh(2) + " select * from ##gh where bookingtime>= '" + gettimestamp() + "' order by ghid ";
    db.sql(str, function(err, result) {
        if (err) {
            console.log(err);
            return;
        }
        callback(result);
    })
};

//创建挂号临时数据表
function creategh(status) {
    if (!status)
        status = 0;
    var str = "if object_id('tempdb..##gh') is not null " +
        " drop table ##gh " +
        " SELECT TOP (100) PERCENT b.csj AS pmobile, a.cxm AS pname, CASE WHEN b.cxb = '男' THEN 1 ELSE - 1 END AS gender, " +
        " CASE WHEN b.dsr = '' THEN '19900101' WHEN len(replace(b.dsr,' ','')) " +
        " <> 8 THEN '19900101' ELSE b.dsr END AS birthday, CASE WHEN a.cghsf = '初诊' THEN 0 ELSE 1 END AS isfirst,  " +
        " CASE WHEN a.hosp_no = '001' THEN '天津市德倍尔口腔诊所' WHEN a.hosp_no = '002' THEN '北京市德倍尔口腔诊所' END AS " +
        " hname, a.czzys AS dname, CAST(b.tmemo AS nvarchar(50)) " +
        " AS booking_items, CAST(b.tbrxh AS nvarchar(50)) AS booking_msg, '0' AS important, a.cblbh AS anamnesisno," +
        " dbo.Convert2Stamp(a.drq, a.csj) AS bookingtime, '服务内容' AS ordercontent, " +
        " SUM(c.nysje) * 100 AS totalprice, SUM(c.nzkje) * 100 AS reduce, dbo.GetServiceStr(a.cguid) AS services," +
        " dbo.Convert2Stamp(a.drq, a.csj) AS ordertime, MAX(c.cyhkkh) AS tradeno, " +
        " CASE WHEN MAX(c.cyhklb) = '0004' THEN '1' WHEN MAX(c.cyhklb) = '0005' THEN '2' ELSE '5' END AS channel, " +
        " dbo.Convert2Stamp(a.drq, a.csj) AS paytime, '' AS refundtime, '' AS refundmoney, " +
        " '" + status + "' AS d, a.nid AS ghid, c.cghguid " +
        " into ##gh " +
        " FROM  dbo.t_gh AS a INNER JOIN " +
        " dbo.t_patient AS b ON a.cblbh = b.cno INNER JOIN " +
        " dbo.t_sf1 AS c ON c.cghguid = a.cguid AND c.nysje <> 0 INNER JOIN " +
        " dbo.t_employee AS d ON a.czzys = d.cname AND (d.cTel1 IS NOT NULL OR " +
        " d.cTel1 <> '') AND d.lzz=1 " +
        " GROUP BY b.csj, a.cxm, b.cxb, b.dsr, a.cghsf, CAST(b.tmemo AS nvarchar(50)), CAST(b.tbrxh AS nvarchar(50)), a.cblbh," +
        "a.nid, a.cguid, a.drq, a.csj, a.czzys, a.hosp_no, c.cghguid ";
    return str;
}

//创建预约临时数据表
function createyy(status) {
    if (!status)
        status = 0;

    var str = "if object_id('tempdb..##yy') is not null " +

        "drop table ##yy " +

        "SELECT     TOP (100) PERCENT CASE WHEN a.hosp_no = '001' THEN '天津市德倍尔口腔诊所' WHEN a.hosp_no = '002' THEN '北京市德倍尔口腔诊所' END AS hospitalname, a.cysxm AS doctorname, " +

        "dbo.Convert2Formatdate(a.drq) AS reserved_date, a.csj AS reserved_time, a.ctext AS remark,case when a.lnew=0 then 1 else 0 end AS isfirst, '0' AS flag, case when a.cbrxm='' then 'noname' else a.cbrxm end AS fullname, '' AS idcard, a.cbrbh AS anamnesisno, " +

        "CASE WHEN b.cxb = '男' THEN 1 ELSE - 1 END AS gender, b.csj AS mobile, '' AS otherphone, CASE WHEN len(replace(b.dsr, ' ', '')) <> 8 THEN '20000101' ELSE b.dsr END AS birthday, " +

        "b.cAddress1 AS address, a.nid AS yyid ,a.duptdate as upt , " + status + " as d " +

        "into ##yy " +

        "FROM         dbo.t_yy AS a INNER JOIN " +

        "                     dbo.t_patient AS b ON a.cbrbh = b.cno INNER JOIN " +

        "                    dbo.t_hosp AS c ON c.cno = a.hosp_no INNER JOIN " +

        "                   dbo.t_employee AS d ON a.cysxm = d.cname AND (d.cTel1 IS NOT NULL OR " +

        "                   d.cTel1 <> '') and d.lzz=1 " +
        "WHERE     (a.ldele = 0) ";

    return str;

}

function getlastghid(n) {
    var str = "declare @lastid int  select top 1 @lastid=ghid from (select top(" + cake + "*" + n + ") *from ##gh order by ghid desc ) as t order by ghid ";
    return str;
}

function getlastyyid(n) {
    var str = "declare @lastid int  select top 1 @lastid=yyid from (select top(" + cake + "*" + n + ") *from ##yy order by yyid desc ) as t order by yyid ";
    return str;
}

function getghcount() {
    var str = creategh() + "declare @count int  select  @count=count(*) from ##gh ";
    return str;
}

function getyycount() {
    var str = createyy() + "declare @count int  select  @count=count(*) from ##yy ";
    return str;
}

exports.getghpiece = function(callback) {
    var db = require('../sqlserver/db');
    var str = getghcount() + "select @count/" + cake + " +1 as count";
    db.sql(str, function(err, result) {
        if (err) {
            console.log(err);
            return;
        }
        callback(result);
    })
};
exports.getyypiece = function(callback) {
    var db = require('../sqlserver/db');
    var str = getyycount() + "select @count/" + cake + " +1 as count";
    db.sql(str, function(err, result) {
        if (err) {
            console.log(err);
            return;
        }
        callback(result);
    })
};


exports.getHosDataOpeTest = function(callback) {
    var db = require('../sqlserver/db');
    var str = "select * from V_GH order by ghid";
    db.sql(str, function(err, result) {
        if (err) {
            console.log(err);
            return;
        }
        callback(result);
    })
};
exports.getHosDataOpeTest2 = function(callback) {
    GetData();

    function GetData() {
        request('http://192.168.1.254/WebService/Keson_Interface.asmx/Keson_GetPatienData?ReturnType=1&Guid=f9d84510-b6ce-4baf-9e3c-161697f32a3d', function(error, response, body) {
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
    var seperator2 = ":";
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
                    // arr[i].title = '主任医师';
                    //  arr[i].fullname = arr[i].cname;
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
    var str = "select cname as title,0 as price,0 as reduce,'天津市德倍尔口腔诊所' as hospitalname,'1' as [on],'tjms' as detail,ckjkm as tagname,'次' as unit from T_ylkm		union all select cname as title,0 as price,0 as reduce,'北京市德倍尔口腔诊所' as hospitalname,'1' as [on],'bjms' as detail,ckjkm as tagname,'次' as unit from T_ylkm";
    db.sql(str, function(err, result) {
        if (err) {
            console.log(err);
            return;
        }
        callback(result);
    })
};