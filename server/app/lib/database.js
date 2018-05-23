var mysql = require('mysql');

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'user',
  password : 'ne9QUv5IYbhtZAlg',
  database : 'test'
});

connection.connect();

module.exports={
    connection : connection
};