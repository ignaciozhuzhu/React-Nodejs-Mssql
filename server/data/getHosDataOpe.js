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
	var str = "select top(4000) * from V_GH where ghid>7874 order by ghid";
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
	var str = "select * from V_GH where ghid>15000 order by ghid";
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
	var str = "select top(4000) * from V_YY order by yyid";
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
	var str = "select top(4000) * from V_YY where yyid>6762 order by yyid";
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
	var str = "select top(4000) * from V_YY where yyid>12919 order by yyid";
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
	var str = "select top(4000) * from V_YY where yyid>18240 order by yyid";
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
	var str = "select * from V_GH_Del where ghid>15000";
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