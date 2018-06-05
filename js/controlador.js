

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
    $scope.nombre = "";
    $scope.pass = "";

    $scope.login=function(){
        var data_login={
                Login : $scope.nombre,
                password : $scope.pass,
        };   
        $http({
            url: 'http://localhost:5000/api/v1.0/team_member', 
            method: 'POST',
            data: JSON.stringify(data_login),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(function mySuccess(response) {
            console.log(response.data.data[0].Id_tm);
            console.log(response.data.data[0].Rol);
            var Id = response.data.data[0].Id_tm;
            var Rol = response.data.data[0].Rol;
            var nombre = response.data.data[0].Nombre;
            
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

    //$scope.logout();

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
    $scope.estado = "terminada";
    $scope.HistoryStatus=function(estado){  // Usando una función mas concreta getUserHistory
        $http({                               // (Nos da las historias de usuario en función del estado)
            method : "GET",
            url : "http://localhost:5000/api/v1.0/user_story_status/"+ estado,
        }).then(function mySuccess(response) {
            console.log(response.data.data);
            
        }, function myError(response) {
            
            console.log(response.data.code);
        });
    }
    ///////////////////////////////////////////////////
    //$scope.HistoryStatus_general();
    //$scope.HistoryStatus($scope.estado);

    $scope.estadoSprint = "Activo";
    ///////Función para el Listado de Historias de Usuario del Sprint activo (en cualquier estado)/////
    $scope.HistorySprintEstatus=function(estado){ 
        $http({                               
            method : "GET",
            url : "http://localhost:5000/api/v1.0/user_story_sprint_status/"+ estado
        }).then(function mySuccess(response) {
            console.log(response.data.data);
            
        }, function myError(response) {        
            console.log(response.data.code);
        });

    }
    ///////////////////////////////////////////////////
    //$scope.HistorySprintEstatus($scope.estadoSprint);

    ///////Función para el Listado de Historias de Usuario del Sprint activo (en cualquier estado)/////
    $scope.HistorySprintMultiple=function(estado){ 
        $http({                               
            method : "GET",
            url : "http://localhost:5000/api/v1.0/user_story_multiple_sprint"
        }).then(function mySuccess(response) {
            console.log(response.data.data);
            
        }, function myError(response) {        
            console.log(response.data.code);
        });

    }
    ///////////////////////////////////////////////////
   // $scope.HistorySprintMultiple();

    $scope.nombre = "Carmelo_Coton";
     ///////Función para el Listado de Historias de Usuario del Sprint activo (en cualquier estado)/////    
     $scope.Historydevelop=function(nombre){ 
         $http({                               
             method : "GET",
             url : "http://localhost:5000/api/v1.0/user_story_develop/"+ nombre
         }).then(function mySuccess(response) {
             console.log(response.data.data);
             
             
         }, function myError(response) {        
             console.log(response.data.code);
         });
 
     }
     ///////////////////////////////////////////////////
    // $scope.Historydevelop($scope.nombre);
    

});
