

angular
.module('sesionS', []) 
.controller('MainCtrl', function ($scope, $http) {
    $http({

        method: 'GET',
        url: 'http://localhost:5000/api/v1.0/task'
     }).then(function (data){
        $scope.mensajes = data.data.data;
        console.log($scope.mensajes);

       
  


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

 
    },function (error){
        console.log(error);

    });

});