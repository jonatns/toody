var app = angular.module('toodyApp', ['draganddrop']);

app.controller('mainController', function($scope, $http) {
    $scope.formData = {};

    $http.get('/api/tasks')
        .success(function(data) {
            $scope.tasks = data;
            $http.get('/api/employees')
                .success(function(data) {
                    $scope.employees = data;
                })
                .error(function(data) {
                    console.log('Error: ' + data);
                });
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });


    $scope.createTask = function(){
        $http.post('/api/task', $scope.formData)
            .success(function(data) {
                $scope.formData = {};
                $scope.tasks = data;
            })
            .error(function(data) {
                console.log('Error:' + data);
            });
    };

    $scope.deleteTask = function(id) {
        $http.delete('/api/task/' + id)
            .success(function(data) {
                $scope.tasks = data;
                console.log(data);
            })
            .error(function(data) {
                console.log('Error:' + data);
            });
    };

    $scope.onDrop = function (data, event, employee_id) {
      $scope.formData = data['json/custom-object'];
      $http.post('/api/assign/' + employee_id, $scope.formData)
          .success(function(data) {
            $http.get('/api/tasks')
                .success(function(data) {
                    $scope.tasks = data;
                    $http.get('/api/employees')
                        .success(function(data) {
                            $scope.employees = data;
                        })
                        .error(function(data) {
                            console.log('Error: ' + data);
                        });
                })
                .error(function(data) {
                    console.log('Error: ' + data);
                });

          })
          .error(function(data) {
              console.log('Error:' + data);
          });
    };

});
