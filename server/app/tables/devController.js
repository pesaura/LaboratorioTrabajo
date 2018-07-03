var connection = require('../lib/database').connection; 




module.exports = {

    /** Obtener info de usuario de tabla team_member, suponiendo que los datos se han enviado  al serivor en un json
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

        var user=requestData.Login;
        var password=requestData.password;
        
        connection.query("SELECT * FROM team_member WHERE Login=? AND password=?",[user,password],function (err,result,fields){
            //console.log(fields)
            if(err){
                console.log(err);
                return res.status(500).json({code : "identificacionFallida", message:"error en el login"});
            }
            if(result.length == 0){
                return res.status(500).json({code:"userLoginFailed", message:"Nombre o contraseña erroneas"});
            }
            
            return res.status(200).json({code:"identificacion correcta", data:result});
        });
    },

    getSprint: function(req,res){ 
        var Status = req.params.estado;
        
        connection.query("SELECT * FROM sprint WHERE Status=?",[Status],function (err,result,fields){
            //console.log(fields)
            if(err){
                console.log(err);
                return res.status(500).json({code : "BusquedaFallida", message:"error al buscar"});
            }
            
            return res.status(200).json({code:"Busqueda correcta", data:result});
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
        var datos=[requestData.Nombre,requestData.Rol, requestData.Apl, requestData.Nick, requestData.Login, requestData.password, requestData.e_mail, requestData.id_tm];   // 
        // El usuario no puede modificar su rol (crear una función en el scrumController para modificarlo)
        console.log(requestData.password)
        if(!requestData.id_tm){
            return res.status(400).json({code:"id_UpdateFailed", message: "id no disponible" });
        }

        connection.query("SELECT * FROM team_member where Id= ?", [requestData.id_tm],function(err, result,fields){
            if(err){
                console.log(err);
                return res.status(500).json({code:"userUpdateFailed", message:"error get id de la base de datos"});
            }
            if(result.length===0){
                return res.status(500).json({code:"userUpdateFailed", message:"respuesta vacia en "+ requestData.id_tm});
            }
            connection.query("UPDATE team_member SET Nombre=?, Rol=?, Apl=?, Nick=?, Login=?, Password=?, E_mail=? where Id=?",datos,function(err,result,field){
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

        connection.query("SELECT * FROM user_story where status = ?", [estado],function(err, result,fields){
            if(err){
                console.log(err);
                return res.status(500).json({code:"get user_story By status Failed", message:"error en "+ estado});
            }
            return res.status(200).json({code:"one match task", data:result});
        });
    },



    /**  Listado de Historias de Usuario del Sprint activo (en cualquier estado).
     * CONSULTA:
     * 
     "SELECT * FROM user_story where id_us in (
         SELECT id_us FROM develop where id_sprint in(
           SELECT Id_sprint FROM sprint where Status = "?"))"
    */
   getUserHistorySprint :function(req,res){
    var estado = req.params.estado;
    console.log(estado);
    var query = 'SELECT * FROM user_story where Id in (SELECT Id_us FROM develop where Id_sprint in(SELECT Id FROM sprint where Status = ?))';

    connection.query(query, [estado],function(err, result,fields){
        if(err){
            console.log(err);
            return res.status(500).json({code:"get user_story By status Failed", message:"error en "+ estado});
        }
        return res.status(200).json({code:"one match task", data:result});
    });
},




    
    /*Listado de Historias de Usuario asignadas a más de un Sprint (en cualquier estado).
    
    "SELECT * FROM user_story where id_us in        
        (SELECT id_us 
         FROM develop 
         group by id_us
         HAVING COUNT(id_sprint) > 1)"
    */
   getUserHistoryMultipleSprint :function(req,res){

    var query = 'SELECT * FROM user_story where Id in (SELECT Id_us FROM develop group by Id_us HAVING COUNT(Id_sprint) > 1)';

    connection.query(query,function(err, result,fields){
        if(err){
            console.log(err);
            return res.status(500).json({code:"get user_story By status Failed", message:"error en "+ estado});
        }
        return res.status(200).json({code:"one match task", data:result});
    });
},

    /*Listado de Historias de Usuario asignadas a un Desarrollador concreto (en cualquier estado).
      "SELECT * FROM user_story where id_us in(
         select id_us from develop where id_tm=(
             select id_tm from team_member where Nombre=?",[nombre]
				 )
			)"
    */ 
   getUserHistorydevelop :function(req,res){
        var nombre = req.params.nombre;
        console.log(nombre);
        var query = 'SELECT * FROM user_story where Id in(select id_us from develop where id_tm=(select Id from team_member where Login=?))';
        connection.query(query, [nombre],function(err, result,fields){
            if(err){
                console.log(err);
                return res.status(500).json({code:"get user_story By developer Failed", message:"error en "+ nombre});
            }
            if(result.length===0){
                return res.status(500).json({code:"get user_story By developer Failed", message: nombre+" asignado a 0 user story"});
            }
            
            return res.status(200).json({code:"one match task", data:result});
        });
    },


    /*listado de histoias de usuario asociadas a un usuario en concreto del sprint activo
        SELECT * FROM user_story where Id in(select id_us from develop where id_tm=tm  and Id_sprint=sprint)
    */
   getUserHistorydevelopOfSprintActive :function(req,res){
    var tm=req.body.Id_tm;
    var sprint=req.body.Id_sprint;
    console.log(req.body);

    var data={
        Id_tm:tm,
        Id_sprint:sprint,
    };

        connection.query('SELECT * FROM user_story where Id in(select id_us from develop where id_tm=?  and Id_sprint=?', [tm, sprint],function(err, result,fields){
            if(err){
                console.log(err);
                return res.status(500).json({code:"get user_story By developer and sprint active Failed", message:"error"});
            }
            if(result.length>0){
                    return res.status(200).json({code:"addDeveloperToUserStory", message:"error emergente"});
                }
            return res.status(200).json({code:"one match task", data:result});
        });
    },



    /*APARTADO: Los Desarrolladores eligen qué Historias de Usuario van a desarrollar durante el Sprint.
        Esto puede variar en funcion de como se implente el codigo angular y el HTML
        
        1º DEBEMOS TENER LOS DATO -> 
        id sprint activo
        id (o toda la info) de las historias de usuario del sprint activo
        id del Desarrollador

        PARTIENDO DE QUE POSEAMOS ESTOS DATOS:

        {
            "Id_tm":1
            "Id_sprint":1
            "Id_us":1
        }

        No se haran verificaciones de estos ids puesto que se sobreentiende que ya existen previamente 
        en sus respectivas tablas

    */ 
        addDeveloperToUserStory:function(req, res){
            var tm=req.body.Id_tm;
            var sprint=req.body.Id_sprint;
            var us=req.body.Id_us;

            var data={
                Id_tm:tm,
                Id_sprint:sprint,
                Id_us:us,
            };

            connection.query("Select * from develop where Id_tm=? and Id_sprint=? and Id_us=?",[tm, sprint,us],function(err,result,fields){
                if(err){
                    return res.status(500).json({code:"addDeveloperToUserStory_failed", message:"error un query"});
                }
                if(result.length>0){
                    return res.status(200).json({code:"addDeveloperToUserStory", message:"Developer ya asignado a User_Story"});
                }

                connection.query("INSERT INTO develop SET ?",data,function(err, result,fields){
                    if(err){
                        console.log(err);
                        return res.status(500).json({code : "addDeveloperToUserStory_Insert_failed", message:"error Insert developer"});
                    }
                    return res.status(200).json({code:"addDeveloperToUserStory_Insert_OK", message:"Developer_asignado"});
                });


            });
        },

        
        /*
            4. Los Desarrolladores van trabajando y actualizando el estado de sus Historias de Usuario.

            se espera recibir el id de la USER_STORY el la que el developer esta trabajando (usar funcion getUserHistorydevelop)
            junto con su nuevo estado al que vamos a actualizar teniendo en cuenta que:

            5. Solo el Scrum Master puede dar por terminada (colocar en estado “Terminada”) una Historia
            de Usuario. 
            El Desarrollador la marca como “Pendiente de Evaluación”, a la espera del cierre.

            Estas condiciones no se verificaran, el cliente ha de crearse para que se cumplan,
            en caso de no se pueda hacer avisad para que se modifique la funcion

            {
                "Id":
                "US_status:"
                "Horas_Acumuladas:"
                "Comentarios":
            }
        */
        updateUserStoryStatus:function(req,res){
            var id=req.body.Id;
            var status=req.body.US_status;
            var Horas_Acumuladas=req.body.Horas_Acumuladas;
            var Comentarios=req.body.Comentarios;
            
            if(!id || !status){
                return res.status(500).json({code:"updateUserStoryStatus_FAILED", message:"missing data in body id= "+id+" status= "+status });
            }
            connection.query("SELECT * FROM user_story WHERE id=?",[id],function(err,result,fields){
                if(err){
                    return res.status(500).json({code:"updateUserStoryStatus_FAILED", message:"Error in select where id= "+id+" "});
                }
                if(result.length===0){
                    return res.status(500).json({code:"updateUserStoryStatus_FAILED", message:"NO match in select where id= "+id+" "});
                }

                connection.query("UPDATE user_story SET Comentarios=?, Horas_Acumuladas=?, Status=?  where Id=?",[Comentarios, Horas_Acumuladas, status, id],function(err,result,fields){
                    if(err){
                        return res.status(500).json({code:"updateUserStoryStatus_FAILED", message:"ERROR in UPDATE where id= "+id+" "});
                    }
                    res.status(200).json({code:"updateUserStoryStatus_OK",message:"USER_STORY="+id+" UPDATED TO STATUS="+status});

                });
            });
        },


           /*OTRAS FUNCIONES DE UTILIDAD*/

        /* EXTRA: FUNCION PARA AÑADIR ENTRADAS A LA TABLA stored_user_story (SNAPSHOTS DE UNA USER_STORY) USABLE CUANDO UN USIARIO 
        SE HA REGISTRADO, LA INFO ENTRANTE QUE SE ESPERA
        {
            'Nombre':''
     *      'Prioridad':''
     *      'Dificultad': cuidado aqui un numero
     *      'Comentarios':''
     *      'Horas_Acumuladas':''
     *      'Status':''
     *      'As_a':''
     *      'I_Want':''
     *      'So_That':''
     *      'Developer': char(50) <- nombre del Developer
     *      'Sprint':    char(50) <- nombre del Sprint ACTIVO (solo debe haber 1 activo)
        }
        
        */
        addEntryToStoredUserStory:function(req,res){
            var requestData = req.body;
            //console.log(requestData);

            if(!requestData){
                return res.status(500).json({code:"user_story_Failed", message: "texto no disponible" })
            }
            console.log(requestData);
            var data={

                Nombre:requestData.Nombre,
                Prioridad:requestData.Prioridad,
                Dificultad: requestData.Dificultad,
                Comentarios:requestData.Comentarios,
                Horas_Acumuladas:requestData.Horas_Acumuladas,
                Status:requestData.Status,
                As_a:requestData.As_a,
                I_Want:requestData.I_Want,
                So_That:requestData.So_That,
                Developer:requestData.Developer,
                Sprint:requestData.Sprint

            };

            connection.query("INSERT INTO stored_user_story SET ?",data,function(err, result,fields){
                if(err){
                    console.log(err);
                    return res.status(500).json({code : "stored_user_story failed", message:"error Insert stored_user_story failed"});
                }
                return res.status(200).json({code:"stored_user_story _OK", message:"Almacenada nueva instantanea"});
            }); 
        },

        getUserStoryWithoutDeveloper:function(req,res){
            connection.query("SELECT * FROM `develop` INNER JOIN user_story ON develop.Id_us=user_story.id WHERE develop.Id_tm='Null'",[],function(err, result,fields){
                if(err){
                    console.log(err);
                    return res.status(500).json({code : "getUserStoryWithoutDeveloper failed", message:"error Insert getUserStoryWithoutDeveloper"});
                }
                return res.status(200).json({code:"getUserStoryWithoutDeveloper _OK", data:result});
            });
        },

};
