'use strict';

// Quiz main controller
angular.module('quiz').controller('QuizController', ['$scope', 'QuizQuestion','$stateParams', '$state', 'Authentication', '$http',
  function ($scope, QuizQuestion, $stateParams, $state, Authentication, $http) {
    $scope.authentication = Authentication;
    console.log($scope.authentication.user);

    $scope.isDone = false; //checks if the quiz is finished ->switches models to done state
    $scope.isStart = false; //checks if quiz start button is triggered

    $scope.questions = [];
    var max = 0;
    $scope.isMultipleChoice = false;
    $scope.index = -1;
    $scope.score = 0;
    $scope.numQuestion = 0;
    $scope.hasError = false;
    $scope.hasStart = true;
    $scope.currCategory = $stateParams.courseName;

    $scope.start = function() {
      if (max === 0) {
        console.log(max);
        $scope.hasError = true;
        $scope.hasStart = false;
      }else {
        $scope.isStart = true;
        $scope.increment();
        max = $scope.questions.length - 1; // (Index of array starts as 0)
      }
    };

    $scope.checkAnswer = function(answer) {
      console.log("Check answer");
      if ($scope.questions[$scope.index].correctAnswer === answer) {
        $scope.score++;
      }
      $scope.increment();
    };

    $scope.increment = function() {
      //Preparing next question
      if ($scope.index === max) {
        console.log("Done");
        $scope.isDone = true;
        $scope.isStart = false;
        $scope.hasStart = false;
      } else {
        $scope.index = ($scope.index + 1) % $scope.questions.length;

        if ($scope.questions[$scope.index].questionType === "TF") {
          $scope.isMultipleChoice = false;
        } else {
          $scope.isMultipleChoice = true;
        }
        $scope.numQuestion++;
        // console.log("Max index is " + max);
        // console.log("Index is " + $scope.index);
        // console.log("Score is " + $scope.score);
      }
    };


    $http.get('/api/quiz', {params: {"category": $stateParams.courseName} }).then(
      function(listOfQuestions) { //Checks to see if the value is correctly returned before printing out the console.
        console.log("List of questions: " );
        console.dir(listOfQuestions.data);
        byCategory(listOfQuestions.data);
      });


    console.log("Category before the switch to applications: " + $scope.currCategory);
    //$scope.currCategory = "Applications"; //temp change for current results

    var byCategory = function(listOfQuestions) {
      console.log("By category");
      console.dir(listOfQuestions);
      $scope.questions = [];
      for (var i = 0 ; i < listOfQuestions.length; i++) {
        console.log(i, listOfQuestions[i].category, $scope.currCategory)
        if (listOfQuestions[i].category === $scope.currCategory) {
         $scope.questions.push(listOfQuestions[i]);
        }
      }
      max = $scope.questions.length;
      console.dir($scope.questions);
    };

  }//End of function for controller

]);

/*
Controller for the finished quiz results
*/

angular.module('quiz').controller('QuizResults', ['$http', '$scope','$stateParams', 'Authentication',
  function ($http, $scope, $stateParams, Authentication) {
    $scope.authentication = Authentication;
    $scope.user = $scope.authentication.user;

    $scope.score = $stateParams.correctScore;
    $scope.totalNumQuestion = $stateParams.numQuestion;
    
    //Creates a new student grades and stores it into collection view StudentGrades
    var studentGrades = {
      category :    $stateParams.category,
      studentName : $scope.user.userName,
      score :       $scope.score,
      totalNum:     $stateParams.numQuestion
    };

    console.log($scope.user.userName + " " + $stateParams.correctScore + " " +  $stateParams.category);
    
    $http.post('/api/quiz_result', studentGrades)
      .success(function(res){
        console.log (res);
      });

  }
]);


/*
* Controller for storing quiz into MongoDB
*/
angular.module('quiz').controller('QuizCreate', ['$scope', 'QuizQuestion',
  function($scope, QuizQuestion) {
    $scope.uploadQuestions = function($fileContent) {
      //console.log("Show content");
      var fileText = $fileContent;
      var rows = fileText.split('\n');
      var obj = [];
      angular.forEach(rows, function(val) {
        var o = val.split(',');
        if (o[0] !== 'Category') { //sketchy way to get rid of first row
          console.log(o);
          var quizQuestion;
          if (o[1] === 'TF') {
            quizQuestion = new QuizQuestion({
              category: o[0],
              questionType: o[1],
              description: o[2],
              correctAnswer: o[3]
            });
          } else {
            quizQuestion = new QuizQuestion({
              category: o[0],
              questionType: o[1],
              description: o[2],
              correctAnswer: o[3],
              answerDesc1: o[4],
              answerDesc2: o[5],
              answerDesc3: o[6],
              answerDesc4: o[7]
            });
          }
          obj = quizQuestion;
          quizQuestion.$save(function(response) {
            console.log("save done");
          }, function(errorResponse) {
            console.log("Error occured" + errorResponse.data.message);
          });
        } //End category if
      });

      $scope.content = obj;
    };

  }
]);
