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

// Se puede usar la base de datos remota usando estos datos:
/*host     : 'sql2.freemysqlhosting.net',
  user     : 'sql2240443',
  password : 'dE2!uZ5!',
  database : 'sql2240443' */