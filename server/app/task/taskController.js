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
    
    getTask : function(req,res){
        connection.query("SELECT * FROM task",function(err, result,fields){
            if(err){
                console.log(err);
                return res.status(500).json({code:"tasknotfound", message:"error get tasks de la base de datos"});
            }
            return res.status(200).json({code:"tasks founded", data:result});
        });
    }


};

/** https://www.getpostman.com/ */