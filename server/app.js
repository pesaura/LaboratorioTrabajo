/**https://expressjs.com/ */
var express = require('express');

/*https://github.com/expressjs/body-parser*/ 
var bodyParser = require('body-parser');

var taskController=require('./app/task/taskController');

var connection = require('./app/lib/database').connection; 

var SERVER_PORT=5000;
// instancia de express
var app=express();

//middlewares
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json());




/** INCLUDE TASK ON DATABASE */
app.post('/api/v1.0/task', taskController.createTask);

/** OBTAIN TASK FROM DATABASE */
app.get('/api/v1.0/task', taskController.getTask);

/** OBTAIN TASK from id FROM DATABASE */
app.get('/api/v1.0/task/id/:taskId', taskController.getTaskById);

/** update TASK from id FROM DATABASE */
app.put('/api/v1.0/task/id/:taskId', taskController.updateTaskById);

/**borrar task */
app.delete('/api/v1.0/task/id/:taskId', taskController.deleteTaskById);




app.listen(SERVER_PORT, function(){
    console.log("SERVIDOR LANZADO EN EL PUERTO: "+SERVER_PORT);
});