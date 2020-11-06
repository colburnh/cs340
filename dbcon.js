var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 10,
  host            : 'classmysql.engr.oregonstate.edu',
  user            : 'cs340_coppintr',
  password        : '5897',
  database        : 'cs340_coppintr'
});
module.exports.pool = pool;