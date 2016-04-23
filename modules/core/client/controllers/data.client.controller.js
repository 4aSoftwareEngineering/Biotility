'use strict';

angular.module('core').controller('UserData', ['$scope', '$http',
    function($scope, $http) {
      $http.get('/api/data/users')
      .success(function(res){
      	$scope.data = res;
      });
  }
]);

// This controller simply retrieves all quiz questions from the DB
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

// This controller defines all of the quiz question CRUD DB functions -RB
// Used for admin capability to add/edit/delete individual questions 
angular.module('core').controller('QuestionControl',['$scope', '$http', '$state', '$location', '$stateParams', 'QuizQuestions',
	function($scope, $http, $state, $location, $stateParams, QuizQuestions){
		$scope.question = null;

		// get full list of quiz questions from DB 
		$scope.findQuestions = function(){
			QuizQuestions.loadQuestions().then(function(response) {
            	$scope.questions = response.data;
        	});
		};
		
		// pull up individual question details for viewing/editing
		$scope.findOneQuestion = function(question_obj){
			var id = $stateParams.questionId;	//id of current question
			console.log("id is " + id);
			$http.get('/api/data/questions/' + id)
				.then(function(response){
					$scope.question = response.data;
					console.log(response.data);
				}, function(error){
          			$scope.error = 'Unable to get question!\n' + error;
				});
		};
		
		// add a new quiz question to the DB 
		$scope.createQuestion = function(isValid){
			if(!isValid){
				return false;
			}

			var quizQuestion_present = [];
			var quizQuestion_correct = [];
			var quizQuestion_MCTF = [];

			if($scope.mc1) quizQuestion_MCTF.push($scope.mc1);
			if($scope.mc2) quizQuestion_MCTF.push($scope.mc2);
			if($scope.mc3) quizQuestion_MCTF.push($scope.mc3);
			if($scope.mc4) quizQuestion_MCTF.push($scope.mc4);
			if($scope.mc5) quizQuestion_MCTF.push($scope.mc5);

			if($scope.ma1) quizQuestion_correct.push($scope.ma1);
			if($scope.ma2) quizQuestion_correct.push($scope.ma2);
			if($scope.ma3) quizQuestion_correct.push($scope.ma3);
			if($scope.ma4) quizQuestion_correct.push($scope.ma4);
			if($scope.ma5) quizQuestion_correct.push($scope.ma5);

			if($scope.ma4) quizQuestion_present.push($scope.ma4);
			if($scope.ma2) quizQuestion_present.push($scope.ma2);
			if($scope.ma5) quizQuestion_present.push($scope.ma5);
			if($scope.ma1) quizQuestion_present.push($scope.ma1);
			if($scope.ma3) quizQuestion_present.push($scope.ma3);
			


			// Multiple Answer question: 
			if($scope.type === 'MA'){
				var quizQuestion = {
					category: $scope.category,
				    type: $scope.type,
				    text: $scope.qtext,
				    answers: {
				        MA: {
				        	present: quizQuestion_present,
				        	correct: quizQuestion_correct
				        },
				        MCTF: quizQuestion_MCTF
				    },
				    hint: $scope.hint,
				    link: $scope.link
				};
			} else if($scope.type === 'TF') {
				// True/False quiz question:
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
				// Single Choice quiz question: 
				var quizQuestion = {
					category: $scope.category,
				    type: $scope.type,
				    text: $scope.qtext,
				    answers: {
				        MCTF: quizQuestion_MCTF,
				        correct: $scope.correct
				    },
				    hint: $scope.hint,
				    link: $scope.link
				};
			}
	
			// Save the question to DB
			$http.post('/api/data/questions', quizQuestion)
				.then(function(response){
					//redirect back to list of all questions if successful
					$scope.findQuestions();	// refresh the list 
          			$state.go('question_edit', { successMessage: 'Question succesfully added!' });
				}, function(error){
          			$scope.error = 'Unable to save question!\n' + error;
				});
		};
		
		// Save new details to an existing quiz question in DB 
		$scope.updateQuestion = function(question_obj, isValid){
			var id = question_obj._id;	//id of current question
			if (!isValid){
				return false;
			}

				var quizQuestion_present = [];
				var quizQuestion_correct = [];
				var quizQuestion_MCTF = [];
				if($scope.question.answers.MCTF[0]) quizQuestion_MCTF.push($scope.question.answers.MCTF[0]);
				if($scope.question.answers.MCTF[1]) quizQuestion_MCTF.push($scope.question.answers.MCTF[1]);
				if($scope.question.answers.MCTF[2]) quizQuestion_MCTF.push($scope.question.answers.MCTF[2]);
				if($scope.question.answers.MCTF[3]) quizQuestion_MCTF.push($scope.question.answers.MCTF[3]);
				if($scope.question.answers.MCTF[4]) quizQuestion_MCTF.push($scope.question.answers.MCTF[4]);

			if($scope.question.answers.MA){
				if($scope.question.answers.MA.correct[0]) quizQuestion_correct.push($scope.question.answers.MA.correct[0]);
				if($scope.question.answers.MA.correct[1]) quizQuestion_correct.push($scope.question.answers.MA.correct[1]);
				if($scope.question.answers.MA.correct[2]) quizQuestion_correct.push($scope.question.answers.MA.correct[2]);
				if($scope.question.answers.MA.correct[3]) quizQuestion_correct.push($scope.question.answers.MA.correct[3]);
				if($scope.question.answers.MA.correct[4]) quizQuestion_correct.push($scope.question.answers.MA.correct[4]);
				if($scope.question.answers.MA.correct[4]) quizQuestion_present.push($scope.question.answers.MA.correct[4]);
				if($scope.question.answers.MA.correct[2]) quizQuestion_present.push($scope.question.answers.MA.correct[2]);
				if($scope.question.answers.MA.correct[0]) quizQuestion_present.push($scope.question.answers.MA.correct[0]);
				if($scope.question.answers.MA.correct[1]) quizQuestion_present.push($scope.question.answers.MA.correct[1]);
				if($scope.question.answers.MA.correct[3]) quizQuestion_present.push($scope.question.answers.MA.correct[3]);

				$scope.question.answers.MA.correct = quizQuestion_correct;
				$scope.question.answers.MA.present = quizQuestion_present;
			}
				$scope.question.answers.MCTF = quizQuestion_MCTF;
				
			
			// save it in the DB 
			$http.put('/api/data/questions/' + id, $scope.question)
				.then(function(response){
					//redirect to list if successful
					$scope.findQuestions();	// refresh the list 
          			$state.go('question_edit', { successMessage: 'Question succesfully added!' });
				}, function(error){
          			$scope.error = 'Unable to save question!\n' + error;
				});
		};
		
		// remove a quiz question from DB
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
