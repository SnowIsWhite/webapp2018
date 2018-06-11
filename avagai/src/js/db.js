module.exports = function(){
  var mysql = require('mysql');
  var conn = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'nuri0619',
    database : 'test1',
    multipleStatements : true
  });
  conn.connect(function(err){
    if (err) throw err;
  });
  return conn;
}
