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
angular.module('core').controller('QuestionControl',['$scope', '$http', '$stateParams', 'Questions',
	function($scope, $http, $stateParams, Questions){
		$scope.findQuestions = function(){
			$http.get('/api/data/questions').success(function(res){
				$scope.data = res;
				Questions = res; 
			});
			// Split it into separate questions
			Questions.then(function(response) {
				$scope.questions = response.data;
			}, function(error){
				$scope.error = 'Unable to retrieve individual questions.\n'+error;
			});
		};
		
		// pull up individual question details 
		$scope.findOneQuestion = function(){
			var id = $stateParams.questionId;	//id of current question
			
			$http.get('/api/data/questions/' + id)
				.then(function(response){
					//redirect to list if successful
				}, function(error){
          			$scope.error = 'Unable to save question!\n' + error;
				});
		};
		
		// add a new question
		$scope.createQuestion = function(isValid){
			if(!isValid){
				return false;
			}
			
			// Create question object
			var question = {
				
			};
			
			// Save the question to DB
			$http.post('/api/data/questions', question)
				.then(function(response){
					//redirect to list if successful
				}, function(error){
          			$scope.error = 'Unable to save question!\n' + error;
				});
		};
		
		$scope.updateQuestion = function(isValid){
			if (!isValid){
				return false;
			}
			
			var id = $stateParams.questionId;	// id of current question 
			
			var question = {
			
			};
			
			$http.put('/api/data/questions/' + id, question)
				.then(function(response){
					//redirect to list if successful
				}, function(error){
          			$scope.error = 'Unable to update question!\n' + error;
				});
		};
		
		// remove a question from DB
		$scope.removeQuestion = function(){
			var id = $stateParams.questionId;	//id of current question
			//.delete map to factory
			//Questions.delete(id)
			$http.delete('/api/data/questions/' + id)
				.then(function(response){
					//redirect to list if successful
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
