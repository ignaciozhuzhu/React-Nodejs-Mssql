var db = require('./db');  
db.sql('select * from WXUser',function(err,result){  
    if (err) {  
        console.log(err);  
        return;  
    }  
    console.log('骚年该表的数据如下 :',result);  
});  