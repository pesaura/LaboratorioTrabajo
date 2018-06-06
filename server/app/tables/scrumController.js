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

    createSprint: function(req,res){

        var requestData = req.body;
        console.log(requestData);

        if(!requestData){
            return res.status(400).json({code:"sprint_Failed", message: "texto no disponible" })
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
}