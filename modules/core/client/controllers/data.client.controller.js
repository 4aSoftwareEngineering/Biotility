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
      
		$scope.deleteQuestion = function(index) {
		  $scope.data.splice(index, 1);
		};
      
  	}
]);

//quiz question CRUD functions
angular.module('core').controller('QuestionControl',['$scope', '$http', 'Questions',
	function($scope, $http, Questions){
		$scope.find = function(){
			$http.get('/api/data/questions').success(function(res){
				$scope.data = res;
				Questions = res; 
			}
			// Split it into separate questions
			Questions.then(function(response) {
				$scope.questions = response.data;
			}, function(error){
				$scope.error = 'Unable to retrieve individual questions.\n'+error;
			});
		};
		
		// pull up individual question details 
		$scope.findOne = function(){
			var id = ;	//id of current question
			
			
		};
		
		// remove a question from DB
		$scope.remove = function(){
			var id = ;	//id of current question
			//.delete map to factory
			//Questions.delete(id)
			$http.delete('/api/data/questions/' + id)
				.then(function(response){
					
				}, function(error){
          			$scope.error = 'Unable to delete question!\n' + error;
				});
		};
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
