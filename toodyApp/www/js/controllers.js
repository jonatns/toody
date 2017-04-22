angular.module('starter.controllers', [])

.controller('mainController', function($scope, $http) {
	$scope.formData = {};

	$http.get('http://localhost:3000/api/employee/5a200ca2-cb54-4378-b558-cdebf342b51e').then(function(resp) {
		$scope.tasks = resp.data.tasks;
  }, function(err) {
    console.error('ERR', err.status);
  });


  $scope.doRefresh = function() {
    $http.get('http://localhost:3000/api/employee/5a200ca2-cb54-4378-b558-cdebf342b51e').then(function(resp) {
       $scope.tasks = resp.data.tasks
     })
     .finally(function() {
       // Stop the ion-refresher from spinning
       $scope.$broadcast('scroll.refreshComplete');
     });
    }

    $scope.taskDone = function(id) {
      $http.delete('http://localhost:3000/api/task/delete/' + id, $scope.formData ).then(function(resp) {
        $http.get('http://localhost:3000/api/employee/5a200ca2-cb54-4378-b558-cdebf342b51e').then(function(resp) {
         $scope.tasks = resp.data.tasks;
        }, function(err) {
          console.error('ERR', err.status);
        });
       });
    }
});
