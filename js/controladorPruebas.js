

var app = angular.module('sesionS', ['ngResource']) 
 app.factory("URL", function($resource) {
    return $resource("http://localhost:5000/api/v1.0/team_member/");
  });

app.controller('MainCtrl', function ($scope, $http, URL) {
   
      
    /////////////////////Pruebas no pensadas para la practica en concreto ///////////
    $scope.recargarDatos = function(){
       /*   $http.get("http://localhost:5000/api/v1.0/task/")
              .then(function(data) {
                $scope.mensajes = data.data.data;
                console.log($scope.mensajes);
        }); */
    }
    $scope.recargarDatos();
    URL.get( function(data) {
        $scope.post = data;
     //   console.log($scope.post);
      });

    $http.get("http://localhost:5000/api/v1.0/team_member/")
    .then(function(data) {
      $scope.usuarios = data.data.data;
    ///  console.log($scope.usuarios);
    });
    ///////////////////////////////////////////////////////////////////


    //////// Función para iniciar sesión //////////////////
    $scope.login = "Carmelo_Coton";
    $scope.password = "hola123";

    $scope.login=function(){
        var data_login={
                Login : $scope.login,
                password : $scope.password,
        };   
        $http({
            url: 'http://localhost:5000/api/v1.0/team_member', 
            method: 'POST',
            data: JSON.stringify(data_login),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(function mySuccess(response) {
            console.log(response.data);
            
        }, function myError(response) {        
            console.log(response.data.code);
        });
       
    }
    ///////////////////////////////////////////////////////
    $scope.login();

    //////// Función para el Listado de Historias de Usuario completadas //////////
    $scope.HistoryStatus_general=function(){ // Ssando la funcion general getTableBy
        var data={
                table:'User_Story',
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
    $scope.HistoryStatus_general();
    $scope.HistoryStatus($scope.estado);

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
    $scope.HistorySprintEstatus($scope.estadoSprint);

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
    $scope.HistorySprintMultiple();

    $scope.nombre = "Carmelo_Coton";
     ///////Función para el Listado de Historias de Usuario del Sprint activo (en cualquier estado)/////    
     $scope.HistoryDevelop=function(nombre){ 
         $http({                               
             method : "GET",
             url : "http://localhost:5000/api/v1.0/user_story_Develop/"+ nombre
         }).then(function mySuccess(response) {
             console.log(response.data.data);
             
             
         }, function myError(response) {        
             console.log(response.data.code);
         });
 
     }
     ///////////////////////////////////////////////////
     $scope.HistoryDevelop($scope.nombre);
    

   /////////////////////Pruebas no pensadas para la practica en concreto ///////////
    $scope.borrar = function(index){
        console.log(index);
       $http({
        method: 'DELETE',
        url: 'http://localhost:5000/api/v1.0/task/id/' + index,
        })
        .then(function(response) {
            console.log(response.data);
            $scope.recargarDatos();
        }, function(rejection) {
            console.log(rejection.data);
        });

    }
    

    $scope.tasktext="";
    $scope.myTasks =[];
    $scope.myErr="";

    $scope.savetask=function(){
        var task={
                taskMessage : $scope.tasktext
        };
        
        $http({
            url: 'http://localhost:5000/api/v1.0/task', 
            method: 'POST',
            data: JSON.stringify(task),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(function mySuccess(response) {
            console.log(response.data.code);
            console.log(response.data);
            $scope.recargarDatos();
            
        }, function myError(response) {
            
            console.log(response.data.code);
        });
       
    }

    $scope.seetask=function(){
        
        $http({
            method : "GET",
            url : "http://localhost:5000/api/v1.0/task"
        }).then(function mySuccess(response) {
            angular.copy(response.data.data, $scope.myTasks);
            
        }, function myError(response) {
            
            console.log(response.data.code);
        });
        
    }

 
  

});