var app = angular.module('scrumApp', [])

app.factory("cookie", function () {
    return {
        writeCookie: function (name, value, days) {
            var date, expires;
            if (days) {
                date = new Date();
                date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
                expires = "; expires=" + date.toGMTString();
            } else {
                expires = "";
            }
            document.cookie = name + "=" + value + expires + "; path=/";
        },
        readCookie: function (name) {
            var i, c, ca, nameEQ = name + "=";
            ca = document.cookie.split(';');
            for (i = 0; i < ca.length; i++) {
                c = ca[i];
                while (c.charAt(0) == ' ') {
                    c = c.substring(1, c.length);
                }
                if (c.indexOf(nameEQ) == 0) {
                    return c.substring(nameEQ.length, c.length);
                }
            }
            return '';
        }
    };
});
app.controller('iniciarSesion', function ($scope, $http, cookie) {

    //////// Función para iniciar sesión //////////////////
    $scope.nombreLog = "";
    $scope.pass = "";

    $scope.login = function (name, password) {
        var data_login = {
            Login: name,
            password: password,
        };
        $http({
            url: 'http://localhost:5000/api/v1.0/team_member',
            method: 'POST',
            data: JSON.stringify(data_login),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(function mySuccess(response) {
            var Id = response.data.data[0].Id;
            var Rol = response.data.data[0].Rol;
            var nombre = response.data.data[0].Nombre;
            $scope.datoPersonales = response.data.data[0];

            if ($scope.remember) {
                cookie.writeCookie('sesionName', nombre, 3)
                cookie.writeCookie('sesionId', Id, 3);
                cookie.writeCookie('sesionRol', Rol, 3);
            } else {
                cookie.writeCookie('sesionName', nombre)
                cookie.writeCookie('sesionId', Id);
                cookie.writeCookie('sesionRol', Rol);
            }
            $scope.asignarCookies();
        }, function myError(response) {
            console.log(response.data.code);
            console.log(response.data.message);
            $scope.loginError = response.data.message;
        });
        location.reload(true);
    }
    ///////////////////////////////////////////////////////
    $scope.asignarCookies = function () {
        $scope.nombre = cookie.readCookie('sesionName');
        $scope.Id = cookie.readCookie('sesionId');
        $scope.Rol = cookie.readCookie('sesionRol');
    }
    $scope.asignarCookies();

    $scope.logout = function () {
        cookie.writeCookie('sesionName', "")
        cookie.writeCookie('sesionId', "");
        cookie.writeCookie('sesionRol', "");
        location.reload(true);
    }

    $scope.verdatos = false;
    $scope.mostrarModificarDatos = function () {
        if ($scope.verdatos) {
            $scope.verdatos = false;
        } else {
            $scope.verdatos = true;
            var tabla = "team_member"
            var id = cookie.readCookie('sesionId');
            $http.get("http://localhost:5000/api/v1.0/team_member_datos/" + id + "/" + tabla)
                .then(function mySuccess(response) {
                    $scope.datoPersonales = response.data.data[0];
                    $scope.nombreLog = $scope.datoPersonales.Login
                    $scope.correo = $scope.datoPersonales.E_mail
                    $scope.pass = $scope.datoPersonales.Password
                    $scope.nick = $scope.datoPersonales.Nick
                    $scope.nombre = $scope.datoPersonales.Nombre
                    $scope.apellidos = $scope.datoPersonales.Apl
                    $scope.Rol = $scope.datoPersonales.Rol
                    console.log($scope.datoPersonales)
                });
        }
    }

    $scope.modificarDatos = function () {

        var data_login = {
            id_tm: parseInt(cookie.readCookie('sesionId')),
            Login: $scope.nombreLog,
            password: $scope.pass,
            e_mail: $scope.correo,
            Nick: $scope.nick,
            Nombre: $scope.nombre,
            Apl: $scope.apellidos,
            Rol: $scope.Rol,
        };
        console.log(data_login)
        $http({
            url: 'http://localhost:5000/api/v1.0/updateUser',
            method: 'POST',
            data: JSON.stringify(data_login),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(function mySuccess(response) {
            console.log(response)

        }, function myError(response) {
            console.log(response.data.code);
            console.log(response.data.message);
        });
    }

    //http://localhost:5000/team_member_datos/1/team_member  
    //http://localhost:5000/api/v1.0/team_member_datos/1/team_member

});
app.controller('MainCtrl', function ($scope, $http, cookie,fileUpload) {
    
    $scope.Id_usuario = cookie.readCookie('sesionId');
    $scope.Rol_usuario = cookie.readCookie('sesionRol');


    ///Funcion para ver el menu de listas de usuario
    $scope.vermenu = false;
    $scope.mostrarMenuListas = function () {
        if ($scope.vermenu) {
            $scope.vermenu = false;  
        } else {
            $scope.vermenu = true;
            $scope.vermenuSM = false; 
        }
    }
    $scope.mostrarMenuSM = function () {
        if ($scope.vermenuSM) {
            $scope.vermenuSM = false;
        } else {
            $scope.vermenuSM = true;
            $scope.vermenu = false;
        }
    }

    //////// Función para el Listado de Historias de Usuario completadas //////////
    $scope.verHistorias = false;
    $scope.HistoryStatus = function (estado) { // Usando una función mas concreta getUserHistory
        $http({ // (Nos da las historias de usuario en función del estado)
            method: "GET",
            url: "http://localhost:5000/api/v1.0/user_story_status/" + estado,
        }).then(function mySuccess(response) {
            $scope.verHistorias = true;
            $scope.actualizarEstadoHist = false; 
            $scope.verdatosCuandoNoMod =true;
            $scope.addsprintActivo = false;
            switch (estado) {
                case 'terminada':
                    $scope.historias = response.data.data;
                    break;
                case 'No_iniciada':
                    $scope.historiasNo_iniciada = response.data.data;
                    console.log($scope.historiasNo_iniciada);
                    break;
                case 'Suspendida':
                     $scope.historiasSuspendida = response.data.data;
                     console.log($scope.historiasSuspendida);
                     $scope.JuntarHistorias();
                    break;
                default:
                    break;
            }
           
        }, function myError(response) {

            console.log(response.data.code);
        });
    }
    ///////////////////////////////////////////////////
    //$scope.HistoryStatus_general();
    //$scope.HistoryStatus($scope.estado);

    $scope.verActivo = false;
    ///////Función para el Listado de Historias de Usuario del Sprint activo (en cualquier estado)/////
    $scope.HistorySprintEstatus = function (estado) {
        $http({
            method: "GET",
            url: "http://localhost:5000/api/v1.0/user_story_sprint_status/" + estado
        }).then(function mySuccess(response) {
            console.log(response.data.data);
            $scope.verHistorias = true;
            $scope.actualizarEstadoHist = false; 
            $scope.verdatosCuandoNoMod =true;
            if (estado === 'Activo') {
                $scope.historias = response.data.data;
                $scope.Pendientes = response.data.data;
                $scope.addsprintActivo = true;
            }
        }, function myError(response) {
            console.log(response.data.code);
        });
    }
    ///////////////////////////////////////////////////
    //$scope.HistorySprintEstatus($scope.estadoSprint);
    
    $scope.actualizarEstadoHist = false;
    $scope.verdatosCuandoNoMod = true;
    ///////Funcion que nos muestra las historias de usuario asociadas al usuario actual del sprint activo//////
    $scope.ModHistorySprintEstatus = function () {
        var data = {
            Id_tm:parseInt(cookie.readCookie('sesionId')),
            Id_sprint:$scope.Id_sprintActivo
        };
        //console.log(data);
        $http({
            url: "http://localhost:5000/api/v1.0/getUserHistorydevelopOfSprintActive/",
            method: "POST",
            data: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(function mySuccess(response) {
            $scope.verHistorias = true;
            $scope.actualizarEstadoHist = true; 
            $scope.verdatosCuandoNoMod = false;
            $scope.addsprintActivo = false;
            
            //console.log(response.data.data);

            $scope.historias = response.data.data;

        }, function myError(response) {
            console.log(response.data.code);
            $scope.historias  ="";
        });
    }

    ///////Función para Modificar el Listado de Historias de Usuario del Sprint activo (en cualquier estado)/////
    $scope.actualizarEstadodeHistorias= function(id_hist,coment,horasAcu,statu){
        var data = {
            Id:id_hist,
            US_status: statu,
            Horas_Acumuladas: horasAcu,
            Comentarios: coment
        };
        console.log(data);
        $http({
            url: 'http://localhost:5000/api/v1.0/updateUserStoryStatus',
            method: 'PUT',
            data: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(function mySuccess(response) {
            console.log(response.data);
            //$scope.ModHistorySprintEstatus();
            $scope.addsprintActivo = false;
        }, function myError(response) {
            console.log(response.data.code);
        });
    }


    ///////Función para el Listado de Historias de Usuario asignadas a más de un Sprint(en cualquier estado)/////
    $scope.HistorySprintMultiple = function () {
        $http({
            method: "GET",
            url: "http://localhost:5000/api/v1.0/user_story_multiple_sprint"
        }).then(function mySuccess(response) {
            console.log(response.data.data);
            $scope.verHistorias = true;
            $scope.actualizarEstadoHist = false; 
            $scope.verdatosCuandoNoMod = true;
            $scope.historias = response.data.data;
            $scope.addsprintActivo = false;

        }, function myError(response) {
            console.log(response.data.code);
        });

    }
    ///////////////////////////////////////////////////
    // $scope.HistorySprintMultiple();
    //// Función para obtener los datos de los desarrolladores (necesaraia para la siguiente función)
    $scope.NombresUser = function(){
        $http.get("http://localhost:5000/api/v1.0/table/team_member")
        .then(function mySuccess(response) {
            $scope.datosDevs = new Array()
            angular.forEach(response.data.data, function (v, k) {
                $scope.datosDevs[k] = v.Login;
            });
            console.log($scope.datosDevs);
        });
    }
    $scope.NombresUser();
    ///////Listado de Historias de Usuario asignadas a un Desarrollador concreto/////    
    $scope.Historydevelop = function (nombre) {
        console.log(nombre)
        $http({
            method: "GET",
            url: "http://localhost:5000/api/v1.0/user_story_develop/" + nombre
        }).then(function mySuccess(response) {
            $scope.verHistorias = true;
            $scope.actualizarEstadoHist = false; 
            $scope.verdatosCuandoNoMod =true;
            console.log(response.data.data);
            $scope.historias = response.data.data;
            $scope.sprintActivo = false;
        }, function myError(response) {
            console.log(response.data.code);
        });
    }
    ///////////////////////////////////////////////////
    
    $scope.obtenerIdSprintActivo = function(){
        $http({
            url: 'http://localhost:5000/api/v1.0/obtainSprintActive',
            method: 'GET'
        }).then(function mySuccess(response) {
            $scope.dataSprintActivo = response.data.data;
            if($scope.dataSprintActivo.length != 0){
               $scope.Id_sprintActivo = $scope.dataSprintActivo[0].Id;
               console.log($scope.SprintActivo)  
            } 
            else
            $scope.SprintActivo = false;
            console.log($scope.SprintActivo)
           
        }, function myError(response) {
            console.log(response.data.code);
        });  
      
    }

    $scope.obtenerIdSprintActivo(); 
   
    $scope.addDeveloperAHistoria = function(Id_us){
        var data = {
            Id_tm:parseInt(cookie.readCookie('sesionId')),
            Id_sprint: $scope.Id_sprintActivo,
            Id_us: Id_us
        };
        console.log(data);
        $http({
            url: 'http://localhost:5000/api/v1.0/addDeveloperToUserStory',
            method: 'POST',
            data: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(function mySuccess(response) {
            console.log(response.data);
            $scope.MensajeAddHistory = response.data.message;
            $scope.deleteDevelopNull(Id_us);
            console.log($scope.MensajeAddHistory)
            
        }, function myError(response) {
            console.log(response.data.code);
        });
    }
    //Borramos la entrada el develop null (Entradas no asignadas a nigun developer que 
    //creo el Scrum Master al crear la relación sprint-historia)
    $scope.deleteDevelopNull = function(id){
        var data = {
            Id_us: id,
        };
        $http({
            url: 'http://localhost:5000/api/v1.0/deleteDevelopNull',
            method: 'DELETE',
            data: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(function mySuccess(response) {
          //  console.log(response.data);
        }, function myError(response) {
            console.log(response.data.code);
        });
    }

    $scope.getUserStoryWithoutDeveloper = function(id_historia){
        $http.get("http://localhost:5000/api/v1.0/getUserStoryWithoutDeveloper")
        .then(function mySuccess(response) {
            console.log(response.data.data);
            console.log(response.data.data);
        });

    }
    $scope.getUserStoryWithoutDeveloper(39)
//////////////////////////////////////////////////////////////////


    ////////////////////////////////////////////////////////
    /// Funciones del Scrum Master //////

    $scope.mostrarSM = function (entrada) {
        switch (entrada) {
            case 'verSprint':
                $scope.verSeccionSM = '';
                $scope.verSprint = true;
                $scope.verCreacionHistoriasUsuario = false;
                $scope.verTerminarSprint = false;
                $scope.MensajeDevelop ="";
                break;
            case 'historiaUsuarioP':
                $scope.verSeccionSM = 'historiaUsuarioP';
                $scope.activarSprint = false;
                $scope.mostrarHistoriasUsuarioSprintPendiente();
                $scope.verSprint =false;
                $scope.verCreacionHistoriasUsuario = false;
                $scope.verTerminarSprint = false;
                $scope.MensajeDevelop ="";
                break;
            case 'activarSprint':
                $scope.verSeccionSM ='historiaUsuarioP';
                $scope.activarSprint = true;
                $scope.mostrarHistoriasUsuarioSprintPendiente();
                $scope.comprobacionSprintActivo();
                $scope.verSprint = false;
                $scope.verCreacionHistoriasUsuario = false;
                $scope.verTerminarSprint = false;
                $scope.MensajeDevelop ="";
                break;
            case 'verHistoriasPendientes':
                $scope.verSeccionSM ='verHistoriasSM';
                $scope.mostrarHistoriasPendientes()
                $scope.verEliminarHistorias = false;
                $scope.verSprintActivo = false;
                $scope.verSprint =false;
                $scope.verCreacionHistoriasUsuario = false;
                $scope.verTerminarSprint = false;
               
                break;
            case 'verSprintActivo':
                 $scope.verSeccionSM ='verHistoriasSM';
                $scope.verSprintActivo = true;
                $scope.HistorySprintEstatus('Activo');
                $scope.verEliminarHistorias = false;
                $scope.verSprint =false;
                $scope.verCreacionHistoriasUsuario = false;
                $scope.verTerminarSprint = false;
                break;
            case 'verEliminarHistorias':
                $scope.verSeccionSM ='verHistoriasSM';
                $scope.verEliminarHistorias = true;
                $scope.mostrarHistoriasEliminar();
                $scope.verSprintActivo = false;
                $scope.verSprint = false;
                $scope.verCreacionHistoriasUsuario = false;
                $scope.verTerminarSprint = false;
                break;
            case 'verTerminarSprint':
                $scope.verSeccionSM ='verTerminarSprint';
                $scope.verTerminarSprint = true;
                $scope.reviewMeeting = true;
                $scope.comprobacionSprintActivo();
                $scope.mostrarSprintActivo();
                $scope.verSprint =false;
                $scope.verCreacionHistoriasUsuario = false;
                
        }
    }
   
    $scope.comprobacionSprintActivo = function () {
        $http.get("http://localhost:5000/api/v1.0/user_story_sprint_status/Activo")
            .then(function mySuccess(response) {
                $scope.Activo = response.data.data;
                console.log($scope.Activo)
                if ($scope.Activo.length != 0)
                    $scope.SprintActivo = true;
                else
                    $scope.SprintActivo = false;
            });

    }

    //// Funcion para Crear Un Sprnt
    $scope.crearSprint = function () {
        console.log($scope.fechaInicio)
        console.log($scope.fechaFin)
        console.log($scope.nombreSprint)
        var data = {
            Fecha_Inicio: $scope.fechaInicio,
            Fecha_Fin: $scope.fechaFin,
            Nombre: $scope.nombreSprint,
            Review: $scope.descSprint
        };
        $http({
            url: 'http://localhost:5000/api/v1.0/createSprint',
            method: 'POST',
            data: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(function mySuccess(response) {
            console.log(response.data);
            $scope.mostrarHistoriasUsuarioSprintPendiente();
            $scope.verSeccionSM = 'historiaUsuarioP';
            $scope.verSprint = false;
        }, function myError(response) {
            console.log(response.data.code);
        });

    }
    /////////////// Fin de función/////////////////////////////////

    ///////Función para ver los Sprint pendietes, necesaria para añadirles historias de usuario
    $scope.mostrarHistoriasUsuarioSprintPendiente = function () {
        $http.get("http://localhost:5000/api/v1.0/sprint/Pendiente")
            .then(function mySuccess(response) {
                $scope.SprintPendientes = response.data.data;
                console.log($scope.SprintPendientes);
            });
    }
    //////Función para recivir el ID de sprint al que la añadiremos la historia de usuario
    $scope.mostrarCreacionHistoriaUsuario = function (Id) {
        $scope.Id_sprint = Id;
        $scope.verSeccionSM ='verCreacionHistoriasUsuario';
        $scope.verCreacionHistoriasUsuario = true;
        console.log($scope.Id_sprint);
    }
    //Función que crea la historia de usuario
    $scope.addHistoriasUsuarioSprint = function () {
        var data = {
            Nombre: $scope.nombreHistoria,
            Prioridad: $scope.prioridad,
            Dificultad: $scope.dificultad,
            Comentarios: $scope.comentarios,
            As_a: $scope.as_a,
            I_Want: $scope.i_want,
            So_That: $scope.so_that
        };
        console.log(data);
        $http({
            url: 'http://localhost:5000/api/v1.0/createUserHistory',
            method: 'POST',
            data: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(function mySuccess(response) {
            console.log(response.data.data.insertId);
            $scope.Id_historiasUsuario = response.data.data.insertId;
            $scope.crearDevelop($scope.Id_sprint,$scope.Id_historiasUsuario);

        }, function myError(response) {
            console.log(response.data.code);
        });
    }
    ////////////////Fin de la función

    ///// Relacionamos el Id del sprint con el Id de la historia en la tabla develop
    $scope.crearDevelop = function(id_sprint,id_us){
        var data = {
            Id_sprint: id_sprint,
            Id_us: id_us,
        };
        $http({
            url: 'http://localhost:5000/api/v1.0/addDeveloperToUserStory',
            method: 'POST',
            data: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(function mySuccess(response) {
            console.log(response.data);
            console.log(id_sprint)
            console.log($scope.Id_sprintActivo)
            if(id_sprint == $scope.Id_sprintActivo){
                $scope.mostrarSM('verSprintActivo');
                $scope.verCreacionHistoriasUsuario = false;
                $scope.MensajeDevelop = "Historia de usuario creada y asociada a un sprint correctamente";
            }else{
                 $scope.mostrarSM('historiaUsuarioP');
                 $scope.verCreacionHistoriasUsuario = false;
                 $scope.MensajeDevelop = "Historia de usuario creada y asociada a un sprint correctamente";
            }
           

        }, function myError(response) {
            console.log(response.data.code);
            $scope.MensajeDevelopError = "Error en la creación de la historia de usuario";
        });
    }

    ////// Función que cambia el estado del del Sprint
    $scope.cambiarEstadoSprint = function (Id, status) {
        var data = {
            Id:Id,
            stat: status
        };
        
        $http({
            url: 'http://localhost:5000/api/v1.0/changeSprintStatus',
            method: 'PUT',
            data: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(function mySuccess(response) {
            console.log(response.data);
            if(status == 'Activo'){
                $scope.mostrarSM('verSprintActivo');
                $scope.obtenerIdSprintActivo();   
            }
            $scope.mostrarHistoriasUsuarioSprintPendiente();
        }, function myError(response) {
            console.log(response.data);
        });

    }

    /////////////Funciones para devolver las Historias pendientes y validarlas//////////
    $scope.mostrarHistoriasPendientes = function () {
        $http.get("http://localhost:5000/api/v1.0/getUserHistoryStatus/Pendiente_de_validacion")
            .then(function mySuccess(response) {
                $scope.Pendientes = response.data.data;
                console.log($scope.Pendientes);
            });
    }
    $scope.validarHistoria = function(Id){
        var data = {
            Id: Id,
            US_status: "Terminada"
        };
        $http({
            url: 'http://localhost:5000/api/v1.0/updateUserStoryStatusSM',
            method: 'PUT',
            data: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(function mySuccess(response) {
            console.log(response.data);
            $scope.mostrarHistoriasPendientes();
        }, function myError(response) {
            console.log(response.data.code);
        });
    }

    //Funcion para ver las historias No iniciadas y pendientes
    $scope.mostrarHistoriasEliminar = function(){
        $scope.HistoryStatus('No_iniciada');
        $scope.HistoryStatus('Suspendida');
    }
    $scope.JuntarHistorias = function(){
       console.log($scope.historiasNo_iniciada);
       console.log($scope.historiasSuspendida);
       $scope.Pendientes = $scope.historiasNo_iniciada.concat($scope.historiasSuspendida);
       console.log($scope.Pendientes)
    }

    $scope.EliminarHistorias = function(ID){
        var data = {
            Id: ID,
        };
        $http({
            url: 'http://localhost:5000/api/v1.0/deleteUserStoyById',
            method: 'DELETE',
            data: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(function mySuccess(response) {
            console.log(response.data);
            $scope.mostrarHistoriasEliminar();
        }, function myError(response) {
            console.log(response.data.code);
        });
    }


    $scope.mostrarSprintActivo = function () {
        $http.get("http://localhost:5000/api/v1.0/team_member_datos/"+$scope.Id_sprintActivo+"/sprint")
            .then(function mySuccess(response) {
                $scope.SprintActivoTerminar = response.data.data;
                console.log($scope.SprintActivoTerminar);
            });
    }
    $scope.terminarSrintActivo = function(){
        console.log($scope.Id_sprintActivo)
        $scope.cambiarEstadoSprint($scope.Id_sprintActivo,'Terminado');
        $scope.obtenerIdSprintActivo();
        $scope.SprintActivoTerminar  ="";
        $scope.mostrarSM('verSprint');
       
    }

    $scope.uploadFile = function () {
        var file = $scope.myFile;
        var uploadUrl = "http://localhost:5000/savedata";
        fileUpload.uploadFileToUrl(file, uploadUrl);
        $scope.reviewMeeting = false;
        $scope.MensajeCerrarSprint = "Sprint cerrado Correctamente";
    };


});

////////////////////////////////////////////////////////


app.directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;
            element.bind('change', function () {
                scope.$apply(function () {
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}]);

app.service('fileUpload', ['$http', function ($http) {
    this.uploadFileToUrl = function (file, uploadUrl) {
        var fd = new FormData();
        fd.append('file', file);
            $http.post(uploadUrl, fd, {
                transformRequest: angular.identity,
                headers: {
                    'Content-Type': undefined
                }
            })
            .then(function mySuccess() {
                console.log("EnvioCorrecto");
               
            }, function myError() {
                console.log("Error");
            });
    }
}]);

