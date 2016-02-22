'use strict';


angular.module('core').controller('UserData', ['$scope', '$http',
    function($scope, $http) {
      $http.get('/api/data/users')
      .success(function(res){
      	$scope.data = res;
      });
  }
]);

angular.module('core').controller('QuestionData', ['$scope', '$http',
    function($scope, $http) {
      $http.get('/api/data/questions')
      .success(function(res){
      	$scope.data = res;
      });
  }
]);

angular.module('core').controller('SubjectData', ['$scope', '$http',
    function($scope, $http) {
      $http.get('/api/parse/subjects')
      .success(function(res){
      	$scope.data = res;
      });
  }
]);

//might not be necessary-Eric G.
angular.module('core').controller('ResourceData', ['$scope', '$http',
    function($scope, $http) {
      $http.get('/api/parse/resources')
      .success(function(res){
        $scope.data = res;
      });
  }
]);
