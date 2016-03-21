'use strict';

// Quiz main controller
angular.module('quiz').controller('QuizController', ['$rootScope', '$scope', '$location', '$stateParams', '$state', 'Authentication', '$http',
    function($rootScope, $scope, $location, $stateParams, $state, Authentication, $http) {
        //
        console.log("Loading Qs:", $stateParams.courseName);
        var courseName = $stateParams.courseName;
        switch (courseName) {
            case "Chemistry & Biochemistry":
                courseName = "Chemistry/Biochemistry";
                break;
            case "General Topics":
                courseName = "General Topics in Biotechnology";
                break;
            case "Laboratory Skills and Applications":
                courseName = "Laboratory Skills/Applications";
                break;
            case "Research and Scientific Method":
                courseName = "Research & Scientific Method";
                break;
        }
        $http.get('/api/quiz', {
            params: {
                "category": courseName
            }
        }).then(
            function(listOfQuestions) { //Checks to see if the value is correctly returned before printing out the console.
                byCategory(listOfQuestions.data);
            });
        //console.log("Category before the switch to applications: " + $scope.currCategory);
        //$scope.currCategory = "Applications"; //temp change for current results
        //

        $scope.authentication = Authentication;

        var max = 0;
        $scope.isDone = false; //checks if the quiz is finished ->switches models to done state
        $scope.quizStarted = false; //checks if quiz start button is triggered

        $scope.questions = [];
        $scope.index = -1;
        $scope.score = 0;
        $scope.analytics = [];
        $scope.numQuestion = 0;
        $scope.hasError = false;
        $scope.hasStart = true;
        $scope.loggedIn = $scope.authentication.user ? true : false;
        $scope.currCategory = $stateParams.courseName;
        $scope.progress = 0;

        $scope.changehappened = function(data) {
            $rootScope.$emit('radioSel', data);
        };
        $rootScope.$on('radioSel', function(evt, data) {
            console.log(data);
            $scope.answer = data;
        });

        $scope.start = function() {
            if (max === 0) {
                $scope.error = "No questions found.";
                $scope.hasError = true;
                $scope.hasStart = false;
            } else {
                console.log("Starting quiz.");
                $scope.quizStarted = true;
                $scope.hasStart = false;
                $scope.increment();
                max = $scope.questions.length - 1; // (Index of array starts as 0)
            }
        };

        $scope.checkAnswer = function(answer) {
            //Check answer, log analytics.
            console.log("Checking answer...");
            //Create analytics obj.
            if (!$scope.analytics[$scope.index]) {
                console.log("Creating analytics...");

                $scope.analytics[$scope.index] = {};
                $scope.analytics[$scope.index].question = $scope.question;
                $scope.analytics[$scope.index].attempts = 1;
            }

            //Check based off question type.
            console.log('answer', answer);
            if ($scope.isMultipleChoice || $scope.isTF) {
                var correct = $scope.question.answers.correct;
                var expected;
                if ($scope.isMultipleChoice)
                    expected = $scope.question.answers.MCTF[correct - 1];
                else
                    expected = correct;
                if (expected === answer) {
                    console.log("Correct!");
                    console.dir($scope.analytics[$scope.index]);
                    $scope.increment();
                } else {
                    console.log("Incorrect!");
                    $scope.hasError = true;
                    $scope.error = "Incorrect. Please try again.";
                    if (!$scope.analytics[$scope.index].firstIncorrect)
                        $scope.analytics[$scope.index].firstIncorrect = answer;
                    console.log('first Incorrect', $scope.analytics[$scope.index].firstIncorrect);
                    $scope.analytics[$scope.index].attempts++;
                    console.dir($scope.analytics[$scope.index]);

                }
            }
            /*
            else if ($scope.isMA){
                for (var i = 0; i < $scope.questions[$scope.index].)
            }
            */
            //Load next question.
        };

        $scope.increment = function() {
            //Determines question type and if quiz is finished.
            $scope.answer = 0; //prevent auto selection of radio btns
            if ($scope.index === max) {
                console.log("Quiz finished.");
                $scope.isDone = true;
                $scope.progress = 100;
                $scope.hasStart = false;
            } else {
                $scope.index = ($scope.index + 1) % $scope.questions.length;
                $scope.question = $scope.questions[$scope.index];
                $scope.hasError = false;
                if ($scope.question.type === "TF") {
                    $scope.isMA = false;
                    $scope.isTF = true;
                    $scope.isMultipleChoice = false;
                } else if ($scope.question.type === "SC") {
                    $scope.isMA = false;
                    $scope.isMultipleChoice = true;
                    $scope.isTF = false;
                } else if ($scope.question.type === "MA") {
                    $scope.isMA = true;
                    $scope.isMultipleChoice = false;
                    $scope.isTF = false;
                } else {
                    $scope.hasError = true;
                    $scope.isMA = false;
                    $scope.isMultipleChoice = false;
                    $scope.isTF = false;
                }
                $scope.numQuestion++;
                $scope.progress = 100 * ($scope.numQuestion - 1) / $scope.questions.length;
                // console.log("Max index is " + max);
                // console.log("Index is " + $scope.index);
                // console.log("Score is " + $scope.score);
            }
        };

        var byCategory = function(listOfQuestions) {
            console.log("Questions");
            $scope.loadedQ = false;
            $scope.questions = [];
            for (var i = 0; i < listOfQuestions.length; i++) {
                $scope.questions.push(listOfQuestions[i]);
            }
            max = $scope.questions.length;
            $scope.loadedQ = true;
            console.log($scope.questions.length + " question(s) found.");
            $scope.canStart = $scope.questions.length && $scope.loggedIn;
        };

        $scope.gotoResource = function(subjectName) {
            $location.path('/' + subjectName + '/resources');
        };
        $scope.gotoQuiz = function(subjectName) {
            $location.path('/' + subjectName + '/quiz');
        };

    } //End of function for controller

]);

/*
Controller for the finished quiz results
*/

angular.module('quiz').controller('QuizResults', ['$http', '$scope', '$stateParams', 'Authentication',
    function($http, $scope, $stateParams, Authentication) {
        $scope.authentication = Authentication;
        $scope.user = $scope.authentication.user;
        console.log($scope.user);
        //Creates a new student grades and stores it into collection view StudentGrades
        var studentGrades = {
            analytics: $scope.analytics,
            category: $stateParams.category,
            student: {
                name: $scope.user.userName,
                courses: $scope.user.courses
            }
        };

        console.log("Saving Student Grades");

        $http.post('/api/quiz_result', studentGrades)
            .success(function(res) {
                console.log("Grade Response:", res);
            });

    }
]);


/*
 * Controller for storing quiz into MongoDB
 */
angular.module('quiz').controller('QuizCreate', ['$scope', '$http', 'Upload', '$timeout',
    function($scope, $http, Upload, $timeout) {
        $scope.uploadFiles = function(file, errFiles) {
            $scope.f = file;
            $scope.errFile = errFiles && errFiles[0];
            if (file) {
                file.upload = Upload.upload({
                    url: '/question_upload',
                    data: { file: file }
                });

                file.upload.then(function(response) {
                    $timeout(function() {
                        file.result = response.data;
                    });
                }, function(response) {
                    if (response.status > 0)
                        $scope.errorMsg = response.status + ': ' + response.data;
                }, function(evt) {
                    file.progress = Math.min(100, parseInt(100.0 *
                        evt.loaded / evt.total));

                });
            }
        };
    }
]);