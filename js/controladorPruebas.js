

angular
.module('sesionS', []) 
.controller('MainCtrl', function ($scope, $http) {
    $scope.tasktext="";

    $scope.savetask=function(){
        var task={
                taskMessage : $scope.tasktext
        };
        console.log(JSON.stringify(task));
        var res = $http({
            url: 'http://localhost:5000/api/v1.0/task', 
            method: 'POST',
            data: JSON.stringify(task),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        console.log(res);
    }

});