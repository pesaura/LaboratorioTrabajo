var connection = require('../lib/database').connection; 

module.exports = {

    createTask : function(req,res){

        var requestData = req.body;
        
        if(!requestData.taskMessage){
            return res.status(400).json({code:"taskCreationFailed", message: "texto no disponible" })
        }
        
        var taskData={
            taskMessage: requestData.taskMessage,
            createdAt : new Date(),
            updateAt : new Date()
        };

        connection.query("INSERT INTO task SET ?",taskData,function(err, result,fields){
            if(err){
                console.log(err);
                return res.status(500).json({code : "taskCreationFailed", message:"error Insert"});
            }
            return res.status(200).json({code:"taskCreated", message:"Task creada"});
        });
    },
    
    getTable : function(req,res){
       // console.log(req.route.path);
        var requestData = req.body;
        console.log(requestData);
        var value=requestData.value;
        var column = requestData.column; 
        var table = requestData.table; 
        //console.log(table);

        var ruta = req.route.path; //obtener la ruta 
        var tabla = req.route.path.substr(10,ruta.length); //obtener el nombre de la tabla
       // console.log(tabla);
        connection.query("SELECT * FROM "+tabla,function(err, result,fields){
            if(err){
                console.log(err);
                return res.status(500).json({code:"tasknotfound", message:"error get lista de tasks de la base de datos"});
            }
            return res.status(200).json({code:"tasks founded", data:result});
            
        });
    },
    getTableById :function(req,res){
        //obtener Id
        var taskId=req.params.taskId;
        var ruta = req.route.path; //obtener la ruta 
        var tabla = req.route.path.substr(10,ruta.length - 21); //obtener el nombre de la tabla

        connection.query("SELECT * FROM " + tabla + " where id= ?", [taskId],function(err, result,fields){
            if(err){
                console.log(err);
                return res.status(500).json({code:"tasknotfound", message:"error get taskId de la base de datos"});
            }
            return res.status(200).json({code:"one match task", data:result});
        });
    },
    updateTaskById :function(req,res){
        //obtener Id a actualizar
        var taskId=req.params.taskId;
        //obtener datos a actualizar 
        var requestData=req.body;

        if(!requestData.taskMessage){
            return res.status(400).json({code:"taskUpdateFailed", message: "texto no disponible" });
        }

        connection.query("SELECT * FROM task where id= ?", [taskId],function(err, result,fields){
            if(err){
                console.log(err);
                return res.status(500).json({code:"taskUpdateFailed", message:"error get taskId de la base de datos"});
            }
            if(result.length===0){
                return res.status(500).json({code:"taskUpdateFailed", message:"result===0"});
            }
            connection.query("UPDATE task SET taskMessage=?, updateAt=? where id=?",[requestData.taskMessage, new Date(),taskId],function(err,result,field){
                if(err){
                    return res.status(500).json({code:"taskUpdateFailed", message:"error al actualizar task"});
                }
                return res.status(200).json({code:"taskUpdate"});     
            });
            
        });
    },

    deleteTableById : function(req,res){
        var taskId=req.params.taskId;
        var ruta = req.route.path; //obtener la ruta 
        var tabla = req.route.path.substr(10,ruta.length - 21);  //obtener el nombre de la tabla
        
        connection.query("SELECT * FROM "+ tabla + " where id= ?",[taskId],function(err, result,fields){
            if(err){
                console.log(err);
                return res.status(500).json({code:"taskDeletedFailed",message:"Error al buscar task"});
            }
            if(result.length===0){
                return res.status(500).json({code:"taskDeletedFailed", message:"result.length===0"});
            }            

            connection.query("DELETE FROM "+ tabla +" WHERE id=?",[taskId],function(err, result,fields){
                if(err){
                    return res.status(500).json({code:"taskDeletedFailed", message:"error borrando ese task"});
                }
                return res.status(200).json({code:"Taskdeleted"})
            });
        });    

    }

};

/** https://www.getpostman.com/ */