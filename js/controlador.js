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
app.controller('MainCtrl', function ($scope, $http, cookie) {

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
    $scope.HistoryStatus_general = function () { // Usando la funcion general getTableBy
        var data = {
            table: 'user_story',
            column: 'status',
            value: 'terminada'
        };

        $http({
            url: 'http://localhost:5000/api/v1.0/user_story_terminada',
            method: 'POST',
            data: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(function mySuccess(response) {
            console.log(response.data);

        }, function myError(response) {
            console.log(response.data.code);
        });
    }
    $scope.verHistorias = false;
    $scope.HistoryStatus = function (estado) { // Usando una función mas concreta getUserHistory
        $http({ // (Nos da las historias de usuario en función del estado)
            method: "GET",
            url: "http://localhost:5000/api/v1.0/user_story_status/" + estado,
        }).then(function mySuccess(response) {
            $scope.verHistorias = true;
            if (estado === 'terminada') {
                $scope.historias = response.data.data;
            } else {
                $scope.historiasUsuario = response.data.data;
            }
            $scope.sprintActivo = false;
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
            if (estado === 'Activo') {
                $scope.historias = response.data.data;
                $scope.sprintActivo = true;
            }
        }, function myError(response) {
            console.log(response.data.code);
        });
    }
    ///////////////////////////////////////////////////
    //$scope.HistorySprintEstatus($scope.estadoSprint);    

    ///////Función para el Listado de Historias de Usuario asignadas a más de un Sprint(en cualquier estado)/////
    $scope.HistorySprintMultiple = function () {
        $http({
            method: "GET",
            url: "http://localhost:5000/api/v1.0/user_story_multiple_sprint"
        }).then(function mySuccess(response) {
            console.log(response.data.data);
            $scope.verHistorias = true;
            $scope.historias = response.data.data;
            $scope.sprintActivo = false;

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
    
    ///////Listado de Historias de Usuario asignadas a un Desarrollador concreto/////    
    $scope.Historydevelop = function (nombre) {
        console.log(nombre)
        $http({
            method: "GET",
            url: "http://localhost:5000/api/v1.0/user_story_develop/" + nombre
        }).then(function mySuccess(response) {
            $scope.verHistorias = true;
            console.log(response.data.data);
            $scope.historias = response.data.data;
            $scope.sprintActivo = false;
        }, function myError(response) {
            console.log(response.data.code);
        });
    }
    ///////////////////////////////////////////////////
    // $scope.Historydevelop($scope.nombre);
    $scope.obtenerIdSprintActivo= function(){
        $http({
            url: 'http://localhost:5000/api/v1.0/obtainSprintActive',
            method: 'GET'
        }).then(function mySuccess(response) {
            $scope.Id_sprintActivo = response.data.data[0].Id;
            //console.log($scope.Id_sprintActivo);
            
        }, function myError(response) {
            console.log(response.data.code);
        });  
    }

        $scope.obtenerIdSprintActivo(); //prueba

    $scope.addDeveloperAHistoria= function(Id_us){
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
            console.log(response.data.data);
        }, function myError(response) {
            console.log(response.data.code);
        });
    }
//////////////////////////////////////////////////////////////////


    ////////////////////////////////////////////////////////
    /// Funciones del Scrum Master //////

    $scope.mostrarSM = function (entrada) {
        switch (entrada) {
            case 'sprint':
                $scope.verSprint = true;
                $scope.comprobacionSprintActivo();
                $scope.historiaUsuarioP = false, $scope.verCreacionHistoriasUsuario = false, $scope.verHistoriasPendientes = false,$scope.activarSprint = false, $scope.verEliminarHistorias = false;
                break;
            case 'historiaUsuarioP':
                $scope.historiaUsuarioP = true;
                $scope.mostrarHistoriasUsuarioSprintPendiente();
                $scope.verSprint = false, $scope.verCreacionHistoriasUsuario = false, $scope.verHistoriasPendientes = false,$scope.activarSprint = false, $scope.verEliminarHistorias = false;
                break;
            case 'activarSprint':
                $scope.activarSprint = true;
                $scope.historiaUsuarioP = true;
                $scope.mostrarHistoriasUsuarioSprintPendiente();
                $scope.comprobacionSprintActivo();
                $scope.verSprint = false, $scope.verCreacionHistoriasUsuario = false, $scope.verHistoriasPendientes = false,$scope.verEliminarHistorias = false;
                break;
            case 'verHistoriasPendientes':
                $scope.verHistoriasPendientes = true;
                $scope.mostrarHistoriasPendientes()
                $scope.activarSprint  = false, $scope.historiaUsuarioP  = false, $scope.verSprint = false, $scope.verCreacionHistoriasUsuario = false, $scope.verEliminarHistorias = false;
                break;
            case 'verEliminarHistorias':
                $scope.verEliminarHistorias = true;
                $scope.mostrarHistoriasEliminar()
                $scope.verHistoriasPendientes = false ,$scope.activarSprint  = false, $scope.historiaUsuarioP  = false, $scope.verSprint = false, $scope.verCreacionHistoriasUsuario = false;
                break;
        }
    }
   
    $scope.comprobacionSprintActivo = function () {
        $http.get("http://localhost:5000/api/v1.0/user_story_sprint_status/Activo")
            .then(function mySuccess(response) {
                $scope.Activo = response.data.data;
                if ($scope.Activo.length != 0)
                    $scope.SprintActivo = true;
                else
                    $scope.SprintActivo = false;
            });
    }

    //// Funcion para Crear Un Sprnt
    $scope.crearSprint = function () {
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
            $scope.verSprint = false;
            $scope.verCreacionHistoriasUsuario = false;
            $scope.historiaUsuarioP = true;
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
    $scope.mostrarHistoriaUsuario = function (Id) {
        $scope.Id_sprint = Id;
        $scope.verCreacionHistoriasUsuario = true;
        console.log($scope.Id_sprint);
    }
    //Función que crea la hisroria de usuario
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
            $scope.crearDevelop();

        }, function myError(response) {
            console.log(response.data.code);
        });
    }
    ////////////////Fin de la función

    ///// Relacionamos el Id del sprint con el Id de la historia en la tabla develop
    $scope.crearDevelop = function(){
        var data = {
            Id_sprint: $scope.Id_sprint,
            Id_us: $scope.Id_historiasUsuario
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
        }, function myError(response) {
            console.log(response.data.code);
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
            url: 'http://localhost:5000/api/v1.0/updateUserStoryStatus',
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
        
    }













    ///////////////////////////////////////////////////

    $scope.mostrarBotones = false;

    $scope.iniciado = function () {

        if (!$scope.Id) {
            $scope.mostrarBotones = false;
            alert("Inicia sesión");
        } else {
            $scope.mostrarBotones = true;
            //$("#collapseThree").collapse({toggle});
        }
    }
    //$scope.Id = cookie.readCookie('sesionId');

    $scope.mostrarFormHistorias = false;

    $scope.scrumComp = function () {

        if ($scope.Rol != "Scrum_manager") {
            $scope.mostrarFormHistorias = false;
            alert("No eres Scrum Master");
        } else {
            $scope.mostrarFormHistorias = true;
            //$("#collapseTwo").collapse({toggle});
        }
    }

    ///////////////////////////////////////////////////



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
            .success(function () {
                console.log("GOOD");
            })
            .error(function () {
                console.log("BAD");

            });
    }
}]);

app.controller('myCtrl', ['$scope', 'fileUpload', function ($scope, fileUpload) {
    $scope.uploadFile = function () {
        var file = $scope.myFile;
        var uploadUrl = "http://localhost:5000/savedata";
        fileUpload.uploadFileToUrl(file, uploadUrl);
    };
}]);