

angular
.module('sesionS', []) 
.controller('MainCtrl', function ($scope, $http) {

    $scope.recargarDatos = function(){
         $http.get("http://localhost:5000/api/v1.0/task/")
              .then(function(data) {
                $scope.mensajes = data.data.data;
                console.log($scope.mensajes);
        });
    }
    $scope.recargarDatos();

    $http.get("http://localhost:5000/api/v1.0/task/id/1")
        .then(function(data) {
             console.log(data)
        });
  
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