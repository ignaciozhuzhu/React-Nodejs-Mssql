//同步挂号数据
exports.getHosDataOpe = function(callback) {
	var db = require('../sqlserver/db');
	var str = creategh(0) + "select top(4000) * from ##gh order by ghid";
	db.sql(str, function(err, result) {
		if (err) {
			console.log(err);
			return;
		}
		callback(result);
	})
};
exports.getHosDataOpe2 = function(callback) {
	var db = require('../sqlserver/db');
	var str = creategh(0) + getlastghid(1) + "select top(4000) * from ##gh where ghid>@lastid order by ghid";
	db.sql(str, function(err, result) {
		if (err) {
			console.log(err);
			return;
		}
		callback(result);
	})
};
exports.getHosDataOpe3 = function(callback) {
	var db = require('../sqlserver/db');
	var str = creategh(0) + getlastghid(2) + "select * from ##gh where ghid>@lastid order by ghid";
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
	var db = require('../sqlserver/db');
	var str = "SELECT    *FROM         dbo.t_yy AS a INNER JOIN                      dbo.t_patient AS b ON a.cbrbh = b.cno INNER JOIN                      dbo.t_hosp AS c ON c.cno = a.hosp_no INNER JOIN                      dbo.t_employee AS d ON a.cysxm = d.cname AND (d.cTel1 IS NOT NULL OR                      d.cTel1 <> '') and d.lzz=1 WHERE     (a.ldele = 0) and a.nid=16901 ";
	db.sql(str, function(err, result) {
		if (err) {
			console.log(err);
			return;
		}
		callback(result);
	})
};

//删除预约数据
exports.getHosDataOpeDelResnext = function(callback) {
	var db = require('../sqlserver/db');
	console.log(getNowFormatDate())
	var str = createyy(2) +
		" select * from ##yy where  CONVERT(varchar(100), upt, 23) ='" + getNowFormatDate() + "' order by yyid";
	db.sql(str, function(err, result) {
		if (err) {
			console.log(err);
			return;
		}
		callback(result);
	})
};
//删除挂号数据
exports.getHosDataOpeDelnext = function(callback) {
	var db = require('../sqlserver/db');
	var str = creategh(2) + " select * from ##gh where bookingtime>= '" + gettimestamp() + "'";
	db.sql(str, function(err, result) {
		if (err) {
			console.log(err);
			return;
		}
		callback(result);
	})
};
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

		"dbo.Convert2Formatdate(a.drq) AS reserved_date, a.csj AS reserved_time, a.ctext AS remark,case when a.lnew=0 then 1 else 0 end AS isfirst, '0' AS flag, a.cbrxm AS fullname, '' AS idcard, a.cbrbh AS anamnesisno, " +

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
	var str = "declare @lastid int  select top 1 @lastid=ghid from (select top(4000*" + n + ") *from ##gh order by ghid ) as t order by ghid desc ";
	return str;
}

function getlastyyid(n) {
	var str = "declare @lastid int  select top 1 @lastid=yyid from (select top(4000*" + n + ") *from ##yy order by yyid ) as t order by yyid desc ";
	return str;
}

exports.getHosDataOpeTest = function(callback) {
	var db = require('../sqlserver/db');
	var str = "select * from V_GH";
	db.sql(str, function(err, result) {
		if (err) {
			console.log(err);
			return;
		}
		callback(result);
	})
};

//同步服务项目数据,医院暂时写默认值
exports.getReservation = function(callback) {
	var db = require('../sqlserver/db');
	var str = createyy() + "select top(4000) * from ##yy order by yyid";
	db.sql(str, function(err, result) {
		if (err) {
			console.log(err);
			return;
		}
		callback(result);
	})
};
//同步服务项目数据,医院暂时写默认值
exports.getReservation2 = function(callback) {
	var db = require('../sqlserver/db');
	var str = createyy() + getlastyyid(1) + "select top(4000) * from ##yy where yyid>@lastid order by yyid";
	db.sql(str, function(err, result) {
		if (err) {
			console.log(err);
			return;
		}
		callback(result);
	})
};
//同步服务项目数据,医院暂时写默认值
exports.getReservation3 = function(callback) {
	var db = require('../sqlserver/db');
	var str = createyy() + getlastyyid(2) + "select top(4000) * from ##yy where yyid>@lastid order by yyid";
	db.sql(str, function(err, result) {
		if (err) {
			console.log(err);
			return;
		}
		callback(result);
	})
};
//同步服务项目数据,医院暂时写默认值
exports.getReservation4 = function(callback) {
	var db = require('../sqlserver/db');
	var str = createyy() + getlastyyid(3) + "select top(4000) * from ##yy where yyid>@lastid order by yyid";
	db.sql(str, function(err, result) {
		if (err) {
			console.log(err);
			return;
		}
		callback(result);
	})
};
//同步服务项目数据,医院暂时写默认值
exports.getReservation5 = function(callback) {
	var db = require('../sqlserver/db');
	var str = createyy() + getlastyyid(4) + "select top(4000) * from ##yy where yyid>@lastid order by yyid";
	db.sql(str, function(err, result) {
		if (err) {
			console.log(err);
			return;
		}
		callback(result);
	})
};
//同步服务项目数据,医院暂时写默认值
exports.getReservation6 = function(callback) {
	var db = require('../sqlserver/db');
	var str = createyy() + getlastyyid(5) + "select top(4000) * from ##yy where yyid>@lastid order by yyid";
	db.sql(str, function(err, result) {
		if (err) {
			console.log(err);
			return;
		}
		callback(result);
	})
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

function gettimestamp() {
	var timeStamp = new Date(new Date().setHours(0, 0, 0, 0)) / 1000;
	return timeStamp;
}


//同步医生数据,医院暂时写默认值,(大部分员工(80来个)没有手机号,则先不导入)
exports.getDoc = function(callback) {
	var db = require('../sqlserver/db');
	var str = "select czw as title,cname as fullname,case when cTel1<>'' then cTel1 when cTel2<>'' then cTel2 end as mobile,'北京市德倍尔口腔诊所' as defaulthospitalName from t_employee";
	db.sql(str, function(err, result) {
		if (err) {
			console.log(err);
			return;
		}
		callback(result);
	})
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