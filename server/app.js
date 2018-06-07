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
var comunController=require('./app/tables/comunController');
var devController=require('./app/tables/devController');
var scrumController=require('./app/tables/scrumController');
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
//app.post('/api/v1.0/team_member', comunController.getTableBy);
app.post('/api/v1.0/team_member', devController.getUser);
app.post('/api/v1.0/user_story_terminada',comunController.getTableBy);

//añadida 06-06-2018
app.post('/api/v1.0/createUserHistory',scrumController.createUserHistory);
app.post('/api/v1.0/createSprint',scrumController.createSprint);

//07-06-2018
app.delete('/api/v1.0/deleteUserStoyById',scrumController.deleteUserStoyById);




/** OBTAIN TASK FROM DATABASE */
app.get('/api/v1.0/team_member_datos/:id_tm/:tabla', comunController.getTableById);
//app.get('/api/v1.0/task', taskController.getTable);
app.get('/api/v1.0/team_member', comunController.getTable);
app.get('/api/v1.0/user_story_status/:estado',devController.getUserHistory);
app.get('/api/v1.0/user_story_sprint_status/:estado',devController.getUserHistorySprint);
app.get('/api/v1.0/user_story_multiple_sprint',devController.getUserHistoryMultipleSprint);
app.get('/api/v1.0/user_story_develop/:nombre',devController.getUserHistorydevelop);

/** OBTAIN TASK from id FROM DATABASE */
//app.get('/api/v1.0/task/id/:taskId', taskController.getTableById);


/** update TASK from id FROM DATABASE */
app.put('/api/v1.0/task/id/:taskId:nombre', taskController.updateTaskById);
app.post('/api/v1.0/updateUser', devController.updateUser);

/**borrar task */
app.delete('/api/v1.0/task/id/:taskId', taskController.deleteTableById);




app.listen(app.get('port'), function(){
    console.log("SERVIDOR LANZADO EN EL PUERTO: "+app.get('port'));
});