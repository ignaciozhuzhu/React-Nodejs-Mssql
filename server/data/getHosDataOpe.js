//同步挂号数据
exports.getHosDataOpe = function(callback) {
	var db = require('../sqlserver/db');
	var str = "select top(4000) * from V_GH order by ghid";
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
	var str = "select top(4000) * from V_GH where ghid>6608 order by ghid";
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
	var str = "select * from V_GH where ghid>14158 order by ghid";
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
	var str = "select * from v_gh	where bookingtime>=1490025600" //3.21当天
		//var str = "select SUM(totalprice)/100 totalprice,SUM(reduce)/100 reduce from v_gh where dname='王茜'and bookingtime>=1483200000";
		//var str = "select * from V_YY order by yyid";
	db.sql(str, function(err, result) {
		if (err) {
			console.log(err);
			return;
		}
		callback(result);
	})
};

exports.getHosDataOpenext = function(callback) {
	var db = require('../sqlserver/db');
	var str = "select * from V_GH where ghid>16800 order by ghid";
	db.sql(str, function(err, result) {
		if (err) {
			console.log(err);
			return;
		}
		callback(result);
	})
};
exports.getHosDataOpeResnext = function(callback) {
	var db = require('../sqlserver/db');
	var str = createyy() + "select * from ##yy where yyid>25390 order by yyid";
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
	var str = createyy(1) + "select * from ##yy where yyid>25390 order by yyid";
	db.sql(str, function(err, result) {
		if (err) {
			console.log(err);
			return;
		}
		callback(result);
	})
};
//创建预约临时数据表

function createyy(status) {
	if (status)
		status = 1;
	else status = 0;

	var str = "if object_id('tempdb..##yy') is not null " +

		"drop table ##yy " +

		"SELECT     TOP (100) PERCENT CASE WHEN a.hosp_no = '001' THEN '天津市德倍尔口腔诊所' WHEN a.hosp_no = '002' THEN '北京市德倍尔口腔诊所' END AS hospitalname, a.cysxm AS doctorname, " +

		"dbo.Convert2Formatdate(a.drq) AS reserved_date, a.csj AS reserved_time, a.ctext AS remark,case when a.lnew=0 then 1 else 0 end AS isfirst, '" + status + "' AS flag, a.cbrxm AS fullname, '' AS idcard, a.cbrbh AS anamnesisno, " +

		"CASE WHEN b.cxb = '男' THEN 1 ELSE - 1 END AS gender, b.csj AS mobile, '' AS otherphone, CASE WHEN len(replace(b.dsr, ' ', '')) <> 8 THEN '20000101' ELSE b.dsr END AS birthday, " +

		"b.cAddress1 AS address, a.nid AS yyid " +

		"into ##yy " +

		"FROM         dbo.t_yy AS a INNER JOIN " +

		"                     dbo.t_patient AS b ON a.cbrbh = b.cno INNER JOIN " +

		"                    dbo.t_hosp AS c ON c.cno = a.hosp_no INNER JOIN " +

		"                   dbo.t_employee AS d ON a.cysxm = d.cname AND (d.cTel1 IS NOT NULL OR " +

		"                   d.cTel1 <> '') " +
		"WHERE     (a.ldele = 0) ";

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
	var str = createyy() + "select top(4000) * from ##yy where yyid>5672 order by yyid";
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
	var str = createyy() + "select top(4000) * from ##yy where yyid>11218 order by yyid";
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
	var str = createyy() + "select top(4000) * from ##yy where yyid>16532 order by yyid";
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
	var str = createyy() + "select top(4000) * from ##yy where yyid>21206 order by yyid";
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

//删除挂号数据
exports.getHosDataOpeDel = function(callback) {
	var db = require('../sqlserver/db');
	var str = "select * from V_GH_Del where ghid>16800";
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
	var str = "select * from V_GH_Del where ghid>16800";
	db.sql(str, function(err, result) {
		if (err) {
			console.log(err);
			return;
		}
		callback(result);
	})
};


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