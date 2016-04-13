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

//quiz question CRUD functions -RB
angular.module('core').controller('QuestionControl',['$scope', '$http', '$state', '$location', '$stateParams', 'QuizQuestions',
	function($scope, $http, $state, $location, $stateParams, QuizQuestions){
		// get full list of questions from DB 
		$scope.findQuestions = function(){
			QuizQuestions.loadQuestions().then(function(response) {
            	$scope.questions = response.data;
        	});
		};
		
		// pull up individual question details 
		$scope.findOneQuestion = function(question_obj){
			var id = $stateParams.questionId;	//id of current question
			console.log("id is " + id);
			$http.get('/api/data/questions/' + id)
				.then(function(response){
					$scope.question = response.data;
				}, function(error){
          			$scope.error = 'Unable to get question!\n' + error;
				});
		};
		
		// add a new question
		$scope.createQuestion = function(isValid){
			if(!isValid){
				return false;
			}
			if($scope.type === 'MA'){
				var quizQuestion = {
					category: $scope.category,
				    type: $scope.type,
				    text: $scope.qtext,
				    answers: {
				        MA: {
				        	present: [
				        		$scope.ma3,
				        		$scope.ma1,
				        		$scope.ma5,
				        		$scope.ma2,
				        		$scope.ma4
				        	],
				        	correct: [
				        		$scope.ma1,
				        		$scope.ma2,
				        		$scope.ma3,
				        		$scope.ma4,
				        		$scope.ma5
				        	],
				        },
				        MCTF: [
				        	$scope.mc1,
				        	$scope.mc2,
				        	$scope.mc3,
				        	$scope.mc4,
				        	$scope.mc5
				        ]
				    },
				    hint: $scope.hint,
				    link: $scope.link
				};
			} else if($scope.type === 'TF') {
				var quizQuestion = {
					category: $scope.category,
				    type: $scope.type,
				    text: $scope.qtext,
				    answers: {
				        MCTF: [],
				        correct: $scope.correct
				    },
				    hint: $scope.hint,
				    link: $scope.link
				};
			} else {
				var quizQuestion = {
					category: $scope.category,
				    type: $scope.type,
				    text: $scope.qtext,
				    answers: {
				        MCTF: [
				        	$scope.mc1,
				        	$scope.mc2,
				        	$scope.mc3,
				        	$scope.mc4,
				        	$scope.mc5
				        ],
				        correct: $scope.correct
				    },
				    hint: $scope.hint,
				    link: $scope.link
				};
			}
	
			// Save the question to DB
			$http.post('/api/data/questions', quizQuestion)
				.then(function(response){
					//redirect to list if successful
					$scope.findQuestions();	// refresh the list 
          			$state.go('question_edit', { successMessage: 'Question succesfully added!' });
				}, function(error){
          			$scope.error = 'Unable to save question!\n' + error;
				});
		};
		
		$scope.updateQuestion = function(question_obj, isValid){
			var id = question_obj._id;	//id of current question
			if (!isValid){
				return false;
			}
			if($scope.type === 'MA'){
				var quizQuestion = {
					category: $scope.category,
				    type: $scope.type,
				    text: $scope.qtext,
				    answers: {
				        MA: {
				        	present: [
				        		$scope.ma3,
				        		$scope.ma1,
				        		$scope.ma5,
				        		$scope.ma2,
				        		$scope.ma4
				        	],
				        	correct: [
				        		$scope.ma1,
				        		$scope.ma2,
				        		$scope.ma3,
				        		$scope.ma4,
				        		$scope.ma5
				        	],
				        },
				        MCTF: [
				        	$scope.mc1,
				        	$scope.mc2,
				        	$scope.mc3,
				        	$scope.mc4,
				        	$scope.mc5
				        ]
				    },
				    hint: $scope.hint,
				    link: $scope.link
				};
			} else if($scope.type === 'TF') {
				var quizQuestion = {
					category: $scope.category,
				    type: $scope.type,
				    text: $scope.qtext,
				    answers: {
				        MCTF: [],
				        correct: $scope.correct
				    },
				    hint: $scope.hint,
				    link: $scope.link
				};
			} else {
				var quizQuestion = {
					category: $scope.category,
				    type: $scope.type,
				    text: $scope.qtext,
				    answers: {
				        MCTF: [
				        	$scope.mc1,
				        	$scope.mc2,
				        	$scope.mc3,
				        	$scope.mc4,
				        	$scope.mc5
				        ],
				        correct: $scope.correct
				    },
				    hint: $scope.hint,
				    link: $scope.link
				};
			} 
			
			// save it in the DB 
			$http.put('/api/data/questions/' + id, quizQuestion)
				.then(function(response){
					//redirect to list if successful
					$scope.findQuestions();	// refresh the list 
          			$state.go('question_edit', { successMessage: 'Question succesfully added!' });
				}, function(error){
          			$scope.error = 'Unable to save question!\n' + error;
				});
		};
		
		// remove a question from DB
		$scope.removeQuestion = function(question_obj){
			var id = question_obj._id;	//id of current question
			//.delete map to service
			$http.delete('api/data/questions/' + id)
				.success(function(response){
					//redirect to list if successful
					$scope.findQuestions();	// refresh the list 
          			$state.go('question_edit', { successMessage: 'Question succesfully deleted!' });
				}).error( function(response){
          			$scope.error = 'Unable to delete question!\n' + response;
					console.log(response);
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
