/**https://expressjs.com/ */
var express = require('express');

/**con objetivo de solucionar
 * Solicitud desde otro origen bloqueada: la política de mismo origen 
 * impide leer el recurso remoto en 
 * http://localhost:5000/api/v1.0/task
 *  (razón: falta la cabecera CORS 'Access-Control-Allow-Origin').
 */
var cors = require('cors')

/*https://github.com/expressjs/body-parser*/ 
var bodyParser = require('body-parser');
var taskController=require('./app/tables/taskController');
var connection = require('./app/lib/database').connection; 
var app=express();// instancia de express


//var SERVER_PORT=5000;
// settings
app.set('port', 5000);


//middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}))





/** INCLUDE TASK ON DATABASE */
app.post('/api/v1.0/task', taskController.createTask);

/** OBTAIN TASK FROM DATABASE */
app.get('/api/v1.0/task', taskController.getTable);
app.get('/api/v1.0/usuarios', taskController.getTable);

/** OBTAIN TASK from id FROM DATABASE */
app.get('/api/v1.0/task/id/:taskId', taskController.getTableById);

/** update TASK from id FROM DATABASE */
app.put('/api/v1.0/task/id/:taskId', taskController.updateTaskById);

/**borrar task */
app.delete('/api/v1.0/task/id/:taskId', taskController.deleteTableById);




app.listen(app.get('port'), function(){
    console.log("SERVIDOR LANZADO EN EL PUERTO: "+app.get('port'));
});