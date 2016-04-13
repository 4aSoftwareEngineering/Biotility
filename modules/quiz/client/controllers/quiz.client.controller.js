'use strict';

// Quiz main controller
angular.module('quiz').controller('QuizController', ['$rootScope', '$scope', '$location', '$stateParams', '$state', 'Authentication', '$http', '$window',
    function($rootScope, $scope, $location, $stateParams, $state, Authentication, $http, $window) {
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
        $scope.hasHint = false;
        $scope.hasStart = true;
        $scope.loggedIn = $scope.authentication.user ? true : false;
        $scope.currCategory = $stateParams.courseName;
        $scope.progress = 0;
        $scope.numOpts = 0;
        $scope.ansMA = [];
        $scope.answer = { val: -1 };

        $scope.changehappened = function(data) {
            $rootScope.$emit('radioSel', data);
        };
        $rootScope.$on('radioSel', function(evt, data) {
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

            var TF_NoSel = $scope.isTF && $scope.answer.val === -1;
            var MC_NoSel = $scope.isMultipleChoice && $scope.answer === -1;
            var MA_NoSel = $scope.isMA && $scope.ansMA.length < $scope.question.answers.MCTF.length;

            if (TF_NoSel || MC_NoSel || MA_NoSel) {
                $scope.hasError = true;
                $scope.error = "Please select a valid option.";
                return;
            }

            //Create analytics obj.
            if (!$scope.analytics[$scope.index]) {
                console.log("Creating analytics...");

                $scope.analytics[$scope.index] = {};
                $scope.analytics[$scope.index].question = $scope.question;
                $scope.analytics[$scope.index].attempts = 1;
                $scope.hasHint = true;
            }

            console.log('answer');
            console.log(answer);
            var correct = $scope.question.answers.correct;
            var expected;

            //Check answer
            if ($scope.isMultipleChoice)
                expected = $scope.question.answers.MCTF[correct - 1];
            else if ($scope.isTF) {
                answer = answer.val;
                expected = correct;
            } else if ($scope.isMA) {
                expected = $scope.question.answers.MA.correct;
                answer = [];

                console.log($scope.ansMA); //Letter array before conversion.
                for (var i = 0; i < $scope.ansMA.length; i++) {
                    var letterIdx = $scope.ansMA[i];
                    var idx = $scope.charToNum(letterIdx.toLowerCase()) - 1;
                    var ansDesc = $scope.question.answers.MA.present[i];
                    answer[idx] = ansDesc;
                }

                for (i = 0; i < answer.length; i++) {
                    if (!answer[i]) {
                        $scope.hasError = true;
                        $scope.error = "Make sure to make unique selections.";
                        return;
                    }
                }

                console.log('expected');
                console.log(expected);
                console.log('answer');
                console.log(answer);
            }


            if (expected === answer || $scope.isMA && arraysEqual(expected, answer)) {
                console.log("Correct!");
                console.dir($scope.analytics[$scope.index]);
                $scope.increment();
            } else {
                console.log("Incorrect!");
                $scope.hasError = true && $scope.questions[$scope.index].hint.length;
                $scope.error = "Incorrect. Please try again.";
                if (!$scope.analytics[$scope.index].firstIncorrect)
                    $scope.analytics[$scope.index].firstIncorrect = answer;
                console.log('First Incorrect', $scope.analytics[$scope.index].firstIncorrect);
                $scope.analytics[$scope.index].attempts++;
                console.dir($scope.analytics[$scope.index]);
            }

            //Load next question.
        };

        $scope.increment = function() {
            //Determines question type and if quiz is finished.
            $scope.hasError = false;
            $scope.hasHint = false;
            //Set question info.
            if ($scope.index === max) {
                console.log("Quiz finished.");
                $scope.isDone = true;
                $scope.progress = 100;
                $scope.hasStart = false;
            } else {
                $scope.index = ($scope.index + 1) % $scope.questions.length;
                $scope.question = $scope.questions[$scope.index];
                $scope.hasError = false;
                if ($scope.questions[$scope.index].answers.MA) {
                    $scope.numOpts = $scope.questions[$scope.index].answers.MA.present.length;
                    for (var i = $scope.questions[$scope.index].answers.MA.present.length - 1; i >= 0; i--) {
                        if ($scope.questions[$scope.index].answers.MA.present[i].length)
                            break;
                        else
                            $scope.numOpts--;
                    }
                }

                //Set new question type.
                if ($scope.question.type === "TF") {
                    $scope.answer = { val: -1 }; //Resets for TF
                    $scope.isMA = false;
                    $scope.isTF = true;
                    $scope.isMultipleChoice = false;
                } else if ($scope.question.type === "SC") {
                    $scope.isMA = false;
                    $scope.isMultipleChoice = true;
                    $scope.isTF = false;
                    $scope.answer = -1; //Resets for MC
                } else if ($scope.question.type === "MA") {
                    $scope.ansMA = []; //Resets for MA
                    $scope.isMA = true;
                    $scope.isMultipleChoice = false;
                    $scope.isTF = false;
                } else {
                    $scope.hasError = true;
                    $scope.isMA = false;
                    $scope.isMultipleChoice = false;
                    $scope.isTF = false;
                }

                //Set progress.
                $scope.numQuestion++;
                $scope.progress = Math.round(100 * ($scope.numQuestion - 1) / $scope.questions.length);
            }
        };

        //In controller
        $scope.openTab = function(link_url) {
            $window.open(link_url, '_blank');
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
            console.log($scope.questions);
            $scope.canStart = $scope.questions.length && $scope.loggedIn;
        };
        $scope.getNumber = function(num) {
            return new Array(num);
        };
        $scope.numToChar = function(n) {
            return String.fromCharCode(96 + parseInt(n)).toUpperCase();
        };
        $scope.numToCharArr = function(arr) {
            var ltrArr = [];
            for (var num in arr) {
                ltrArr.push($scope.numToChar(num));
            }
            return ltrArr.join(", ");
        };
        $scope.charToNum = function(c) {
            return c.charCodeAt(0) - 96;
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
		$scope.comment=null;
        $scope.authentication = Authentication;
        $scope.user = $scope.authentication.user;
        $(document).ready(function() {
            $("#myBtn").click(function() {
                $("#myModal").modal();
            });
        });

		var sub = document.getElementsByClassName("btn btn-default btn-success btn-block")[0];
		sub.onclick = function() {
	
			$scope.uploadUserComment();
		}		

        //Creates a new student grades and stores it into collection view StudentGrades
        var studentGrades = {
            category: $stateParams.category,
            student: {
                studentName: $scope.user.userName,
                courses: $scope.user.courses
            },
            analytics: $scope.analytics,
        };

        console.log("User", $scope.user);
		
		$scope.uploadUserComment = function() {
			
			$scope.comment = $('input[id="comment"]').val();
			
			var commentToUpload = {
			category: $stateParams.category,
			comment: $scope.comment,
		};
			
			
			$http.post('/api/leave_comment', commentToUpload)
            .success(function(res) {
                console.log(res);
            });		
			
		}
		
        $http.post('/api/quiz_result', studentGrades)
            .success(function(res) {
                console.log(res);
            });
		
    }
]);


/*
 * Controller for storing quiz into MongoDB
 */
angular.module('quiz').controller('QuizCreate', ['$scope', '$http', 'Upload', '$timeout',
    function($scope, $http, Upload, $timeout) {
        $scope.success = false;
        $scope.numSave = 0;
        $scope.numDupe = 0;
        $scope.uploadFiles = function(file, errFiles) {
            $scope.f = file;
            $scope.errFile = errFiles && errFiles[0];
            var data = {
                file: file
            };
            if (file) {
                file.upload = Upload.upload({
                    url: '/question_upload',
                    data: data
                });

                //Progress Bar
                file.upload.then(function(response) {
                    $scope.numSave = response.data.numSaved;
                    $scope.numDupe = response.data.numDuplicates;
                    $scope.success = $scope.numSave > 0 || $scope.numDupe > 0;
                    $scope.error = response.data.error;
                    $scope.errorMsg = $scope.error ? response.data.errorMsg : null;
                    console.log($scope.success);
                    if ($scope.error){
                        file.progress = 0;
                        return;
                    }
                    $timeout(function() {
                        file.result = response.config.data.file.progress;
                    });
                }, function(response) {
                    if (response.status > 0) {
                        $scope.error = true;
                        $scope.errorMsg = response.status + ': ' + response.data;
                    }
                }, function(evt) {                    
                    file.progress = Math.min(100, parseInt(100.0 *
                        evt.loaded / evt.total));
                    if (file.progress === 100 || file.progress === 100.00) {
                        return;
                    }
                });
            }
        };
    }
]);

function arraysEqual(a, b) {
    if (a === b) return true;
    if (a === null || b === null) return false;
    if (a.length !== b.length) return false;

    for (var i = 0; i < a.length; ++i) {
        if (a[i] !== b[i]) return false;
    }
    return true;
}
