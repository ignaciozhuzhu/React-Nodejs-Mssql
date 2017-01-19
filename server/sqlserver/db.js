var db_config = require('./mydb.config');
var mssql = require('mssql');
var db = {};
var config = {
  user: db_config.user,
  password: db_config.password,
  server: db_config.server,
  database: db_config.database,
  port: 1433,
  options: {
    encrypt: false // Use this if you're on Windows Azure  
  },
  pool: {
    min: 0,
    max: 10,
    idleTimeoutMillis: 3000
  }
};

//connection.  
db.sql = function(sql, callBack) {
  console.log(db_config.user)
  var connection = new mssql.Connection(config, function(err) {
    if (err) {
      console.log(err);
      return;
    }
    var ps = new mssql.PreparedStatement(connection);
    ps.prepare(sql, function(err) {
      if (err) {
        console.log(err);
        return;
      }
      ps.execute('', function(err, result) {
        if (err) {
          console.log(err);
          return;
        }

        ps.unprepare(function(err) {
          if (err) {
            console.log(err);
            callback(err, null);
            return;
          }
          callBack(err, result);
        });
      });
    });
  });
};

module.exports = db;