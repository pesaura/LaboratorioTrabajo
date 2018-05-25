var connection = require('../lib/database').connection; 

module.exports = {

    /** Obtener info de usuario de tabla Team_member, suponiendo que los datos se han enviado  al serivor en un json
     * de la forma {
     *              'user':'',
     *              'password:''
     *              }
     * la tabla devuelta se espera de la forma
     * 
     *              'id_tm':''
     *              'Nombre':'',
     *              'Rol':'',
     *              'Apl':'',
     *              'Nick':'',
     *              'Login':'',
     *              'password:'',
     *              'e-mail':'' 
     *              }
     * 
     * cuando angular recibe los datos puede crear una cookie local
     * https://www.w3schools.com/js/js_cookies.asp
    */
    getUser: function(req,res){
        var requestData = req.body;

        var user=requestData.user;
        var password=requestData.password;

        connection.query("SELECT * FROM Team_member WHERE Login=? AND password=?",[user,password],function (err,result,fields){
            if(err){
                console.log(err);
                return res.status(500).json({code : "identificacionFallida", message:"error en el login"});
            }
            return res.status(200).json({code:"identificacion correcta", data:result});
        });
    },

    /**El usuario debe poder editar sus datos personales.
     * suponiendo que los datos se han enviado al serivor en un json
     * de la forma {
     *              'id_tm':'' 
     *              'Nombre':'',
     *              'Rol':'',
     *              'Apl':'',
     *              'Nick':'',
     *              'Login':'',
     *              'password:'',
     *              'e-mail':'' 
     *              }
     * Teniendo presente que tras el login es necesario disponer
     * del valor de 'id_tm'
    */
    

    updateUser: function(req,res){
        var requestData = req.body;

        var datos=[requestData.Nombre, requestData.Rol, requestData.Apl, requestData.Nick, requestData.Login, requestData.password, requestData.e-mail, requestData.id_tm];   // 

        if(!requestData.id_tm){
            return res.status(400).json({code:"id_UpdateFailed", message: "id no disponible" });
        }

        connection.query("SELECT * FROM Team_Member where id_tm= ?", [id],function(err, result,fields){
            if(err){
                console.log(err);
                return res.status(500).json({code:"userUpdateFailed", message:"error get id_tm de la base de datos"});
            }
            if(result.length===0){
                return res.status(500).json({code:"userUpdateFailed", message:"respuesta vacia en "+requestData.id_tm});
            }
            connection.query("UPDATE Team_Member SET Nombre=?, Rol=?, Apl=?, Nick=?, Login=?, password=?. e-mail=? where id=?",datos,function(err,result,field){
                if(err){
                    return res.status(500).json({code:"userUpdateFailed", message:"error al actualizar user id "+ requestData.id_tm});
                }
                return res.status(200).json({code:"userUpdate"});     
            });
            
        });
    },
    
    /**Listado de Historias de Usuario completadas (en estado “Terminada”).
     *                  {   
     *                      'table': 'User_Story' (definido en el controlador de angular)
     *                      'column': 'status'  (definido en el controlador de angular)
     *                      'value':'terminada' (obtenido por ejemplo de un <select> en el html)
     * 
     *                  }
     * Listado de Historias de Usuario pendientes. Solo el Scrum Master puede ejecutar esta consulta
     *                  {   
     *                      'table': 'User_Story' (definido en el controlador de angular)
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

        var value=requestData.value;
        var column = requestData.column; 
        var table = requestData.table; 

        connection.query("SELECT * FROM"+ table +"where "+column+"= ?", [value],function(err, result,fields){
            if(err){
                console.log(err);
                return res.status(500).json({code:"get"+table+"By"+column+" Failed", message:"error en "+value});
            }
            return res.status(200).json({code:"one match task", data:result});
        });
    }



    /**  Listado de Historias de Usuario del Sprint activo (en cualquier estado).
     * CONSULTA:
     * 
     "SELECT * FROM User_Story where id_us in (
         SELECT id_us FROM Develop where id_sprint in(
           SELECT id_sp FROM sprint where status=activo))"
    */
    
    /*Listado de Historias de Usuario asignadas a más de un Sprint (en cualquier estado).
    
    "SELECT * FROM User_Story where id_us in        
        (SELECT id_us 
         FROM Develop 
         group by id_us
         HAVING COUNT(id_sprint) > 1)"
    */

    /*Listado de Historias de Usuario asignadas a un Desarrollador concreto (en cualquier estado).
     "SELECT * FROM User_Story where id_us in(
         select id_us from Develop where id_tm=(
             select id_tm from Team_Member where Nombre=?",[nombre]
         )
     )
    */       

    /*Listado de Historias de Usuario pendientes. Solo el Scrum Master puede ejecutar esta consulta.
        
    */
};

