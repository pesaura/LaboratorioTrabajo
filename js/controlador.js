

var app = angular.module('scrumApp', []) 

app.factory("cookie",function() {
    return{
        id:"",
        nombre:"",
        rol:"",
        writeCookie: function(name,value,days){
        var date, expires;
            if (days) {
                date = new Date();
                date.setTime(date.getTime()+(days*24*60*60*1000));
                expires = "; expires=" + date.toGMTString();
                    }else{
                expires = "";
            }
        document.cookie = name + "=" + value + expires + "; path=/";
        },
        readCookie: function(name){
        var i, c, ca, nameEQ = name + "=";
        ca = document.cookie.split(';');
            for(i=0;i < ca.length;i++) {
                 c = ca[i];
            while (c.charAt(0)==' ') {
                 c = c.substring(1,c.length);
            }
                if (c.indexOf(nameEQ) == 0) {
                    return c.substring(nameEQ.length,c.length);
                }
            }
         return '';
        }
    } ;
  });
app.controller('iniciarSesion', function ($scope,$http,cookie) {

    //////// Función para iniciar sesión //////////////////
    $scope.nombreLog = "";
    $scope.pass = "";

    $scope.login=function(name,password){
        var data_login={
                Login : name,
                password : password,
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
            
            if($scope.remember){
                cookie.writeCookie('sesionName', nombre,3)
                cookie.writeCookie('sesionId', Id,3);
                cookie.writeCookie('sesionRol', Rol,3); 
            }else{
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
       
    }
    ///////////////////////////////////////////////////////
    $scope.asignarCookies = function(){
        cookie.nombre,$scope.nombre = cookie.readCookie('sesionName');
        cookie.id,$scope.Id = cookie.readCookie('sesionId');
        cookie.rol,$scope.Rol = cookie.readCookie('sesionRol');
    }
    $scope.asignarCookies();

    $scope.logout = function(){
         cookie.writeCookie('sesionName',"")
         cookie.writeCookie('sesionId',"");
         cookie.writeCookie('sesionRol',""); 
        location.reload();
    }

    $scope.verdatos = false;
    $scope.mostrarModificarDatos = function(){
        if($scope.verdatos){
            $scope.verdatos = false;
        }else{
            $scope.verdatos = true;
            var tabla = "team_member"
            var id = cookie.readCookie('sesionId');
            $http.get("http://localhost:5000/api/v1.0/team_member_datos/"+id +"/"+tabla)
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

    $scope.modificarDatos = function(){
       
        var data_login={
            id_tm : parseInt(cookie.readCookie('sesionId')),
            Login : $scope.nombreLog,
            password : $scope.pass,
            e_mail : $scope.correo,
            Nick : $scope.nick,
            Nombre : $scope.nombre,
            Apl : $scope.apellidos,
            Rol : $scope.Rol,
    };    console.log(data_login)
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
app.controller('MainCtrl', function($scope, $http){
    

    //////// Función para el Listado de Historias de Usuario completadas //////////
    $scope.HistoryStatus_general=function(){ // Usando la funcion general getTableBy
        var data={
                table:'user_story',
                column:'status',
                value:'terminada'
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
    $scope.verTerminadas = false;
    $scope.HistoryStatus=function(estado){  // Usando una función mas concreta getUserHistory
        if($scope.verTerminadas == true){
            $scope.verTerminadas = false;
        }else{   
            $http({ // (Nos da las historias de usuario en función del estado)
                method: "GET",
                url: "http://localhost:5000/api/v1.0/user_story_status/" + estado,
            }).then(function mySuccess(response) {
                // console.log(response.data.data);
                if (estado === 'terminada') {
                    $scope.historiasUsuarioTerminada = response.data.data;
                    $scope.verTerminadas = true;
                    $scope.verActivo = false, $scope.verMultiple = false, $scope.verdev = false;
                } else {
                    $scope.historiasUsuario = response.data.data;
                }

            }, function myError(response) {

                console.log(response.data.code);
            });
            }
        
    }
    ///////////////////////////////////////////////////
    //$scope.HistoryStatus_general();
    //$scope.HistoryStatus($scope.estado);

    $scope.verActivo = false;
    ///////Función para el Listado de Historias de Usuario del Sprint activo (en cualquier estado)/////
    $scope.HistorySprintEstatus = function (estado) {
        if ($scope.verActivo == true) {
            $scope.verActivo = false;
        } else {
            $http({
                method: "GET",
                url: "http://localhost:5000/api/v1.0/user_story_sprint_status/" + estado
            }).then(function mySuccess(response) {
                console.log(response.data.data);
                if (estado === 'Activo') {
                    $scope.historiasSprintActivo = response.data.data;
                    $scope.verActivo = true;
                    $scope.verTerminadas = false, $scope.verMultiple = false, $scope.verdev = false;
                } else {
                    $scope.historiasUsuario = response.data.data;
                }

            }, function myError(response) {
                console.log(response.data.code);
            });
        }
    }
    ///////////////////////////////////////////////////
    //$scope.HistorySprintEstatus($scope.estadoSprint);

    ///////Función para el Listado de Historias de Usuario asignadas a más de un Sprint(en cualquier estado)/////
    $scope.HistorySprintMultiple = function () {
        if ($scope.verMultiple == true) {
            $scope.verMultiple = false;
        } else {
            $http({
                method: "GET",
                url: "http://localhost:5000/api/v1.0/user_story_multiple_sprint"
            }).then(function mySuccess(response) {
                console.log(response.data.data);
                $scope.historiasSprintMultiple = response.data.data;
                $scope.verMultiple = true;
                $scope.verActivo = false, $scope.verTerminadas = false, $scope.verdev = false;

            }, function myError(response) {
                console.log(response.data.code);
            });
        }
    }
    ///////////////////////////////////////////////////
   // $scope.HistorySprintMultiple();
    //// Función para obtener los datos de los desarrolladores (necesaraia para la siguiente función)
    $http.get("http://localhost:5000/api/v1.0/table/team_member")
    .then(function mySuccess(response) {
        $scope.datosDevs = response.data.data;
        console.log( $scope.datosDevs);
    });


    $scope.nombreDev = "pepe";
     ///////Listado de Historias de Usuario asignadas a un Desarrollador concreto/////    
     $scope.Historydevelop=function(nombre){ 
         console.log(nombre)
        if ($scope.verdev == true) {
            $scope.verdev = false;
        } else {
            $http({                               
                method : "GET",
                url : "http://localhost:5000/api/v1.0/user_story_develop/"+ nombre
            }).then(function mySuccess(response) {
                console.log(response.data.data);
                $scope.historiasDev = response.data.data;
                $scope.verdev = true;
                $scope.verActivo = false, $scope.verTerminadas = false, $scope.verMultiple = false;
                
                
            }, function myError(response) {        
                console.log(response.data.code);
            });
        }
     }
     ///////////////////////////////////////////////////
    // $scope.Historydevelop($scope.nombre);
    

    ///////////////////////////////////////////////////

    $scope.mostrarBotones = false;

    $scope.iniciado = function(){

        if(!$scope.Id){
            $scope.mostrarBotones = false;
            alert("Inicia sesión");
        }else{
            $scope.mostrarBotones = true;
        }
   }
   //$scope.Id = cookie.readCookie('sesionId');

   $scope.mostrarFormHistorias = false;

    $scope.scrumComp = function(){

        if($scope.Rol != "Scrum_manager"){
            $scope.mostrarFormHistorias = false;
            alert("No eres Scrum Master");
        }else{
            $scope.mostrarFormHistorias = true;
        }
   }

    ///////////////////////////////////////////////////



});
