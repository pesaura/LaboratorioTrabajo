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
var path = require('path');
//var http = require('http');
var multer  = require('multer');
var app=express();// instancia de express


//var SERVER_PORT=5000;
// settings
app.set('port', 5000);


//middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}))





/** INCLUDE TASK ON DATABASE */

app.post('/api/v1.0/team_member', devController.getUser);
app.post('/api/v1.0/user_story_terminada',comunController.getTableBy);

//añadida 06-06-2018
app.post('/api/v1.0/createUserHistory',scrumController.createUserHistory);
app.post('/api/v1.0/createSprint',scrumController.createSprint);

//07-06-2018
app.delete('/api/v1.0/deleteUserStoyById',scrumController.deleteUserStoyById);
app.delete('/api/v1.0/deleteDevelopNull',devController.deleteDevelopNull);


/** OBTAIN TASK FROM DATABASE */
app.get('/api/v1.0/team_member_datos/:id_tm/:tabla', comunController.getTableById);
//app.get('/api/v1.0/task', taskController.getTable);
app.get('/api/v1.0/table/:tabla', comunController.getTable);
app.get('/api/v1.0/sprint/:estado', devController.getSprint);
app.get('/api/v1.0/user_story_status/:estado',devController.getUserHistory);
app.get('/api/v1.0/user_story_sprint_status/:estado',devController.getUserHistorySprint);
app.get('/api/v1.0/user_story_multiple_sprint',devController.getUserHistoryMultipleSprint);
app.get('/api/v1.0/user_story_develop/:nombre',devController.getUserHistorydevelop);
app.get('/api/v1.0/getUserHistoryStatus/:estado',scrumController.getUserHistoryStatus);

/*3-07-2018*/
app.post('/api/v1.0/getUserHistorydevelopofSprintActive',devController.getUserHistorydevelopOfSprintActive);

/**22-06-2018 - añadir Developer a User_Story del Sprint activo */
app.post('/api/v1.0/addDeveloperToUserStory',devController.addDeveloperToUserStory);

/*23-06-2018*/
app.put('/api/v1.0/updateUserStoryStatus',devController.updateUserStoryStatus);
app.put('/api/v1.0/updateUserStoryStatusSM',scrumController.updateUserStoryStatusSM);

//26-06
app.get('/api/v1.0/obtainListOfSprint', scrumController.obtainListOfSprint);
app.put('/api/v1.0/changeSprintStatus', scrumController.changeSprintStatus);
//02/07
app.get('/api/v1.0/obtainSprintActive', scrumController.obtainSprintActive);

//02/07
app.get('/api/v1.0/getUserStoryWithoutDeveloper',devController.getUserStoryWithoutDeveloper);

/*--------------------------------------------------------------------------- */

/** OBTAIN TASK from id FROM DATABASE */
//app.get('/api/v1.0/task/id/:taskId', taskController.getTableById);

/** update TASK from id FROM DATABASE */
app.put('/api/v1.0/task/id/:taskId:nombre', taskController.updateTaskById);
app.post('/api/v1.0/updateUser', devController.updateUser);

/**borrar task */
app.delete('/api/v1.0/task/id/:taskId', taskController.deleteTableById);
/*--*/


///////////////////////////////////////////////////// subir archivo

var storage = multer.diskStorage({
    destination: './sprint_review_meeting/',
    filename: function (req, file, cb) {
      cb(null, file.originalname.replace(path.extname(file.originalname), "") + '-' + Date.now() + path.extname(file.originalname))
    }
  })
  
  var upload = multer({ storage: storage })
  
  app.use(express.static(path.join(__dirname, 'public')));
  
 // app.set('port', process.env.PORT || 3000);
  
  
  app.post('/savedata', upload.single('file'), function(req,res,next){
      console.log('Uploade Successful ', req.file, req.body);
  });
  


////////////////////////////////////////////////

app.listen(app.get('port'), function(){
    console.log("SERVIDOR LANZADO EN EL PUERTO: "+app.get('port'));
});