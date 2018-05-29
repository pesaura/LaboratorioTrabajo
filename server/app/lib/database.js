var mysql = require('mysql');

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'user',
  password : 'ne9QUv5IYbhtZAlg',
  database : 'scrum'
});

connection.connect();

module.exports={
    connection : connection
};