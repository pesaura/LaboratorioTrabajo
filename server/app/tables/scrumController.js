var connection = require('../lib/database').connection; 


module.exports = {

    
    /**espera un POST
     * {
     *      'Nombre':''
     *      'Prioridad':''
     *      'Dificultad': cuidado aqui un numero
     *      'Comentarios':''
     *      'Horas_Acumuladas':''
     *      'Status':''
     *      'As_a':''
     *      'I_Want':''
     *      'So_That':''
     *      
     * }
     * 
     * ejemplo de datos a pasar
     * {
	    "Nombre":"cabeza",
        "Prioridad":"baja",
        "Dificultad": 2,
        "Comentarios":"no hay prisa",
        "Horas_Acumuladas": 200,
        "Status":"terminada",
        "As_a":"",
        "I_Want":"",
        "So_That":""                        
}
     */
    createUserHistory : function(req,res){

        var requestData = req.body;
        console.log(requestData);

        if(!requestData){
            return res.status(400).json({code:"user_story_Failed", message: "texto no disponible" })
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
            So_That:requestData.So_That
        };

        connection.query("INSERT INTO user_story SET ?",data,function(err, result,fields){
            if(err){
                console.log(err);
                return res.status(500).json({code : "user_story failed", message:"error Insert"});
            }
            return res.status(200).json({code:"user_story created", message:"Task creada"});
        });
    },
    /*
        {

            "Fecha_Inicio":2018-01-01,
            "Fecha_Fin": 2018-01-15,
            "Nombre": cabeza,
            "Status": Activo o Terminado  (solo uno de los dos)
            "Review": texto,
        };
     */

    createSprint: function(req,res){

        var requestData = req.body;

        if(!requestData){
            return res.status(400).json({code:"sprint_Failed", message: "texto no disponible" })
        }
        
        var data={

            Fecha_Inicio:requestData.Fecha_Inicio,
            Fecha_Fin:requestData.Fecha_Fin,
            Nombre: requestData.Nombre,
            Status:requestData.Status,
            Review:requestData.Review,
        };

        connection.query("SELECT * FROM sprint WHERE Status=Activo",data,function(err, result,fields){
            if(err){
                console.log(err);
            }
            if(result.length>0){
                return res.status(500).json({code : "sprint_Failed failed", message:"Existe un Sprint en estado Activo"});
            }  
        });

        connection.query("INSERT INTO sprint SET ?",data,function(err, result,fields){
            if(err){
                console.log(err);
                return res.status(500).json({code : "sprint_Failed failed", message:"error Insert"});
            }
            return res.status(200).json({code:"sprint_created", message:"Task creada"});
        });
    },

   /* Scrum Master debe poder: eliminar Historias de Usuario, en caso de que se decida que la Historia
    en concreto es muy grande o ya no es necesaria. La aplicación no debe permitir borrar una
    Historia de Usuario que esté en estado “Terminada”, “Pendiente de validación”, o “En
    desarrollo”==En curso.

    La siguienty funcion espera recibir una peticion de tipo DELETE con el siguiente contenido en formato JSON

        {
            "Id":#id de la historia de usuario 
        }

        o bien

        {
            "Nombre":#nombre de la historia de usuario
        }


    */

    deleteUserStoyById : function(req,res){
        var id=req.body.Id;
        var nombre=req.body.Nombre;

        if(id){
            connection.query("SELECT * FROM user_story  where Id= ?",[id],function(err, result,fields){

                if(err){
                    console.log(err);
                    return res.status(500).json({code:"deleteUserStoyByIdFailed",message:"Error al buscar Id"});
                }
                if(result.length===0){
                    return res.status(500).json({code:"deleteUserStoyByIdFailed", message:"id user_stroy result.length===0"});
                }
                if(result[0].Status=="En_curso" || result[0].Status=="terminada" || result[0].Status=="Pendiente_de_validacion"){
                    return res.status(500).json({code:"deleteUserStoyByIdFailed", message:"Status imposible to delete"});
                }      
                /* en caso de no error, id existe y status permite borrar verificamos si id existe en tabla develop
                id_us, y procedemos a borrarlo de ella, antes de borrarlo en user_story
                */
                connection.query("SELECT * FROM develop  where Id_us= ?",[id],function(err, result,fields){
                    
                    if(err){
                        console.log(err);
                        return res.status(500).json({code:"delete_Develop_ByIdFailed",message:" delete_Develop_ByIdFailed Error al buscar Id"});
                    }

                    
                    if(result.length>0){

                        connection.query("DELETE FROM develop WHERE Id_us=?",[id],function(err, result,fields){
                            if(err){
                                return res.status(500).json({code:"delete_Develop_ByIdFailed", message:"error borrando delete_Develop_ByIdFailed"});
                            }
                            console.log("borrado id_us="+id+" de tabla develop");

                            /* esta siguiente query esta aqu xq necesitamos borrar primero las claves ajenas de la tabla develop primero en caso de que exixtan*/
                            connection.query("DELETE FROM user_story  WHERE Id=?",[id],function(err, result,fields){
                                console.log("1 --------"+err);
                                if(err){
                                    return res.status(500).json({code:"deleteUserStoyByIdFailed", message:"error borrando  user_story id="+id});
                                }
                                return res.status(200).json({code:"deleteUserStoyById Correct"})
                            });
                        });           
                    }
                    else{

                        /* en caso de que no exitan entradas en la tabla develop con el id buscado  */
                        connection.query("DELETE FROM user_story  WHERE Id=?",[id],function(err, result,fields){
                            console.log("2 --------"+err);
                            if(err){
                                return res.status(500).json({code:"deleteUserStoyByIdFailed", message:"error borrando  user_story id="+id});
                            }
                            return res.status(200).json({code:"deleteUserStoyById Correct"})
                        });
                    }   
                });
            });

        }else if(nombre){ /* BORRAR story_user MEDIANTE NOMBRE, PUEDE SER UTIL*/
            connection.query("SELECT Id FROM user_story WHERE Nombre=?",[nombre],function(err, result,fields){
                if(err){
                    return res.status(500).json({code:"deleteUserStoyByIdFailed_using_nombre", message:"error en NOMBRE: "+nombre});
                }
                if(result.length===0 || result.length>1){
                    return res.status(500).json({code:"deleteUserStoyByIdFailed_using_nombre", message:"error "+result.length+" DE user story CON ESE NOMBRE"});
                }
                
                //console.log(result[0].Id);
                id=result[0].Id;

                connection.query("SELECT * FROM user_story  where Id= ?",[id],function(err, result,fields){

                    if(result[0].Status=="En_curso" || result[0].Status=="terminada" || result[0].Status=="Pendiente_de_validacion"){
                        return res.status(500).json({code:"deleteUserStoyByIdFailed_using_nombre", message:"Status imposible to delete"});
                    }      
                /* en caso de no error, id existe y status permite borrar verificamos si id existe en tabla develop
                id_us, y procedemos a borrarlo de ella, antes de borrarlo en user_story
                */
                    connection.query("SELECT * FROM develop  where Id_us= ?",[id],function(err, result,fields){
                        
                        if(err){
                            console.log(err);
                            return res.status(500).json({code:"deleteUserStoyByIdFailed_using_nombre",message:" delete_Develop_ByIdFailed Error al buscar Id"});
                        }

                        
                        if(result.length>0){

                            connection.query("DELETE FROM develop WHERE Id_us=?",[id],function(err, result,fields){
                                if(err){
                                    return res.status(500).json({code:"deleteUserStoyByIdFailed_using_nombre", message:"error borrando delete_Develop_ByIdFailed"});
                                }
                                console.log("borrado id_us="+id+" de tabla develop");

                                /* esta siguiente query esta aqu xq necesitamos borrar primero las claves ajenas de la tabla develop primero en caso de que exixtan*/
                                connection.query("DELETE FROM user_story  WHERE Id=?",[id],function(err, result,fields){
                                    console.log("1 --------"+err);
                                    if(err){
                                        return res.status(500).json({code:"deleteUserStoyByIdFailed_using_nombre", message:"error borrando  user_story id="+id});
                                    }
                                    return res.status(200).json({code:"deleteUserStoyByIdFailed_using_nombre Correct"})
                                });
                            });           
                        }
                        else{

                            /* en caso de que no exitan entradas en la tabla develop con el id buscado  */
                            connection.query("DELETE FROM user_story  WHERE Id=?",[id],function(err, result,fields){
                                console.log("2 --------"+err);
                                if(err){
                                    return res.status(500).json({code:"deleteUserStoyByIdFailed_using_nombre", message:"error borrando  user_story id="+id});
                                }
                                return res.status(200).json({code:"deleteUserStoyById_using_nombre Correct"})
                            });
                        }   
                    });
                });
            });
        }   

    },

    /*OTRAS FUNCIONES DE UTILIDAD*/
    obtainListOfSprint:function(req, res){
        
        connection.query("SELECT * FROM sprint ",[],function(err,result,fields){
            if(err){
                console.log(err);
                return res.status(500).json({code:"obtainListOfSprint_failed",message:"error in obtainListOfSprint"});
            }
            
            return res.status(200).json({code:"obtainListOfSprint_ok",data:result});
        });
    },

    changeSprintStatus:function(req, res){

        var Id=req.body.Id;             // Lo pasamos {"Id":"", "stat":""} mediante HTTP PUT
        var stat=req.body.stat;

        console.log(!Id || !(stat=="Activo" || stat=="Terminado"));  

        if(!Id || !(stat=="Activo" || stat=="Terminado") ){
            return res.status(500).json({code:"changeSprintStatus_failed",message:"Invalid Data ->Id="+Id+" Status="+stat});
        }


        connection.query("UPDATE sprint SET Status=? WHERE Id=? ",[stat,Id],function(err,result,fields){
            if(err){
                console.log(err);
                return res.status(500).json({code:"changeSprintStatus_failed",message:"error in obtainListOfSprint"});
            }
            
            return res.status(200).json({code:"changeSprintStatus_ok"});
        });
    },


}