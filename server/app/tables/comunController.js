var connection = require('../lib/database').connection; 

module.exports = {

    getTable : function(req,res){
        //console.log(req.route.path);
    
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

    
    /**Listado de Historias de Usuario completadas (en estado “Terminada”).
     *                  {   
     *                      'table': 'user_story' (definido en el controlador de angular)
     *                      'column': 'status'  (definido en el controlador de angular)
     *                      'value':'terminada' (obtenido por ejemplo de un <select> en el html)
     * 
     *                  }
     * Listado de Historias de Usuario pendientes. Solo el Scrum Master puede ejecutar esta consulta
     *                  {   
     *                      'table': 'user_story' (definido en el controlador de angular)
     *                      'column': 'status'  (definido en el controlador de angular)
     *                      'value':'pendiente_de_validación' (obtenido por ejemplo de un <select> en el html)
     *                  }
     *
     * suponemos que el serivor recibe un json 
     *                  {   
     *                      'table': tabla sobre la que se realiza la consulta (definido en el controlador de angular)
     *                      'column': columna sobre la que se realiza la consulta  (definido en el controlador de angular)
     *                      'value': valor buscado en la columna (obtenido por ejemplo de un <select> en el html)
     *                  }
     * con esto podemos hacer consultas a distintas tablas, en funcion de si la columna=valor
     */

    getTableBy :function(req,res){
        var requestData = req.body;

        var value = requestData.value;
        var column = requestData.column; 
        var table = requestData.table; 

        connection.query("SELECT * FROM "+ table +" where "+column+"= ?", [value],function(err, result,fields){
            if(err){
                console.log(err);
                return res.status(500).json({code:"get"+table+"By"+column+" Failed", message:"error en "+value});
            }
            return res.status(200).json({code:"one match task", data:result});
        });
    },



    /**  Listado de Historias de Usuario del Sprint activo (en cualquier estado).
     * CONSULTA:
     * 
     "SELECT * FROM user_story where id_us in (
         SELECT id_us FROM develop where id_sprint in(
           SELECT id_sp FROM sprint where status=activo))"
    */
    
    /*Listado de Historias de Usuario asignadas a más de un Sprint (en cualquier estado).
    
    "SELECT * FROM user_story where id_us in        
        (SELECT id_us 
         FROM develop 
         group by id_us
         HAVING COUNT(id_sprint) > 1)"
    */

    /*Listado de Historias de Usuario asignadas a un Desarrollador concreto (en cualquier estado).
     "SELECT * FROM user_story where id_us in(
         select id_us from develop where id_tm=(
             select id_tm from team_member where Nombre=?",[nombre]
         )
     )
    */       

    /*Listado de Historias de Usuario pendientes. Solo el Scrum Master puede ejecutar esta consulta.
        
    */

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


