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
    getUser: function(req,res){  // Por alguna razón no devuelve los datos del usuario
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

        //var datos=[requestData.Nombre, requestData.Rol, requestData.Apl, requestData.Nick, requestData.Login, requestData.password, requestData.e-mail, requestData.id_tm];   // 
        var datos=[requestData.Nombre,"Developer", requestData.Apl, requestData.Nick, requestData.Login, requestData.password, requestData.e-mail, requestData.id_tm];   // 
        // El usuario no puede modificar su rol (crear una función en el scrumController para modificarlo)
        
        if(!requestData.id_tm){
            return res.status(400).json({code:"id_UpdateFailed", message: "id no disponible" });
        }

        connection.query("SELECT * FROM Team_Member where id_tm= ?", [id],function(err, result,fields){
            if(err){
                console.log(err);
                return res.status(500).json({code:"userUpdateFailed", message:"error get id_tm de la base de datos"});
            }
            if(result.length===0){
                return res.status(500).json({code:"userUpdateFailed", message:"respuesta vacia en "+ requestData.id_tm});
            }
            connection.query("UPDATE Team_Member SET Nombre=?, Rol=?, Apl=?, Nick=?, Login=?, password=?. e-mail=? where id=?",datos,function(err,result,field){
                if(err){
                    return res.status(500).json({code:"userUpdateFailed", message:"error al actualizar user id "+ requestData.id_tm});
                }
                return res.status(200).json({code:"userUpdate"});     
            });
            
        });
    },
    
   
    getUserHistory :function(req,res){
        var estado = req.params.estado;
        console.log(estado);

        connection.query("SELECT * FROM User_Story where status = ?", [estado],function(err, result,fields){
            if(err){
                console.log(err);
                return res.status(500).json({code:"get User_Story By status Failed", message:"error en "+ estado});
            }
            return res.status(200).json({code:"one match task", data:result});
        });
    },



    /**  Listado de Historias de Usuario del Sprint activo (en cualquier estado).
     * CONSULTA:
     * 
     "SELECT * FROM User_Story where id_us in (
         SELECT id_us FROM Develop where id_sprint in(
           SELECT Id_sprint FROM sprint where Status = "Activo"))"
    */
   getUserHistorySprint :function(req,res){
    var estado = req.params.estado;
    console.log(estado);
    var query = 'SELECT * FROM User_Story where id_us in (SELECT id_us FROM Develop where id_sprint in(SELECT Id_sprint FROM sprint where Status = ?))'

    connection.query(query, [estado],function(err, result,fields){
        if(err){
            console.log(err);
            return res.status(500).json({code:"get User_Story By status Failed", message:"error en "+ estado});
        }
        return res.status(200).json({code:"one match task", data:result});
    });
},




    
    /*Listado de Historias de Usuario asignadas a más de un Sprint (en cualquier estado).
    
    "SELECT * FROM User_Story where id_us in        
        (SELECT id_us 
         FROM Develop 
         group by id_us
         HAVING COUNT(id_sprint) > 1)"
    */
   getUserHistoryMultipleSprint :function(req,res){

    var query = 'SELECT * FROM User_Story where id_us in (SELECT id_us FROM Develop group by id_us HAVING COUNT(id_sprint) > 1)'

    connection.query(query,function(err, result,fields){
        if(err){
            console.log(err);
            return res.status(500).json({code:"get User_Story By status Failed", message:"error en "+ estado});
        }
        return res.status(200).json({code:"one match task", data:result});
    });
},

    /*Listado de Historias de Usuario asignadas a un Desarrollador concreto (en cualquier estado).
      "SELECT * FROM user_story where id_us in(
         select id_us from develop where id_tm=(
             select id_tm from team_member where Login=?",[nombre]
				 )
			)"
    */ 
   getUserHistoryDevelop :function(req,res){
    var nombre = req.params.nombre;
    console.log(nombre);
    var query = 'SELECT * FROM user_story where id_us in(select id_us from develop where id_tm=(select id_tm from team_member where Login=?))'

    connection.query(query, [nombre],function(err, result,fields){
        if(err){
            console.log(err);
            return res.status(500).json({code:"get User_Story By status Failed", message:"error en "+ estado});
        }
        return res.status(200).json({code:"one match task", data:result});
    });
},
      

    /*Listado de Historias de Usuario pendientes. Solo el Scrum Master puede ejecutar esta consulta.
        
    */
};