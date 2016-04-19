'use strict';

// Quiz main controller - this work is a combination of Matt (4a)'s work and the old groupm 5c's work.
//The quiz feedback/comments are Spencer's.
angular.module('quiz').controller('QuizController', ['$rootScope', '$scope', '$location', '$stateParams', '$state', 'Authentication', '$http', '$window',
    function($rootScope, $scope, $location, $stateParams, $state, Authentication, $http, $window) {
        //Get questions for each category.
        console.log("Loading Qs:", $stateParams.courseName);
        //Matt
        //Account for slight variations in excel file course name differences.
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


        $scope.authentication = Authentication;
        //Matt
        //Init variables.
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
        //Matt
        //Used for when radio selection happens in MC questions.
        $scope.changehappened = function(data) {
            $rootScope.$emit('radioSel', data);
        };
        $rootScope.$on('radioSel', function(evt, data) {
            $scope.answer = data;
        });
        //
        //Matt
        //Start quiz
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


        //Matt
        //Check answer, log analytics.
        $scope.checkAnswer = function(answer) {
            console.log("Checking answer...");

            //Boolean values to see if there is no selection for true/false, multi. choice, and matching answer.
            var TF_NoSel = $scope.isTF && $scope.answer.val === -1;
            var MC_NoSel = $scope.isMultipleChoice && $scope.answer === -1;
            var MA_NoSel = $scope.isMA && $scope.ansMA.length < $scope.question.answers.MCTF.length;

            //No answer selected.
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

                //First attempt, make sure to show hint.
                $scope.hasHint = true;
            }

            var correct = $scope.question.answers.correct;
            var expected;

            //Check answer based on question type.
            //MA needs array comparison.
            if ($scope.isMultipleChoice)
                expected = $scope.question.answers.MCTF[correct - 1];
            else if ($scope.isTF) {
                answer = answer.val;
                expected = correct;
            } else if ($scope.isMA) {
                //Check MA questions.
                expected = $scope.question.answers.MA.correct;
                answer = [];

                //Letter array before conversion.
                console.log($scope.ansMA);

                //Convert answer's characters to numbers; A->1, B->2,...
                for (var i = 0; i < $scope.ansMA.length; i++) {
                    var letterIdx = $scope.ansMA[i];
                    var idx = $scope.charToNum(letterIdx.toLowerCase()) - 1;
                    var ansDesc = $scope.question.answers.MA.present[i];
                    answer[idx] = ansDesc;
                }

                //Make sure that same answer options were not selected.
                if (hasDuplicates($scope.ansMA)) {
                    $scope.hasError = true;
                    $scope.error = "Make sure to make unique selections.";
                    return;
                }


                console.log('expected');
                console.log(expected);
                console.log('answer');
                console.log(answer);
            }

            //Correct answer.
            if (expected === answer || $scope.isMA && arraysEqual(expected, answer)) {
                console.log("Correct!");
                console.dir($scope.analytics[$scope.index]);
                $scope.increment();
            } else {
                //Incorrect answer.
                console.log("Incorrect!");
                $scope.hasError = true && $scope.questions[$scope.index].hint.length;
                $scope.error = "Incorrect. Please try again.";

                //If first incorrect, log the answer selection.
                if (!$scope.analytics[$scope.index].firstIncorrect)
                    $scope.analytics[$scope.index].firstIncorrect = answer;
                console.log('First Incorrect', $scope.analytics[$scope.index].firstIncorrect);

                //Increment attempts for current question.
                $scope.analytics[$scope.index].attempts++;
                console.dir($scope.analytics[$scope.index]);

            }

            //Load next question.
        };
        //Matt
        //Determines question type and if quiz is finished.
        $scope.increment = function() {
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
                    //Unknown question type.
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

        //Matt - used Eric's function.
        //Open link in new tab.
        $scope.openTab = function(link_url) {
            $window.open(link_url, '_blank');
        };


        //Get question by category.
        var byCategory = function(listOfQuestions) {
            console.log("Questions");
            $scope.loadedQ = false;
            $scope.questions = [];
            for (var i = 0; i < listOfQuestions.length; i++) {
                $scope.questions.push(listOfQuestions[i]);
            }

            //Matt
            //Added # questions found to inform user BEFORE they start their quiz that there are x # of questions.
            max = $scope.questions.length;
            $scope.loadedQ = true;
            console.log($scope.questions.length + " question(s) found.");
            console.log($scope.questions);
            $scope.canStart = $scope.questions.length && $scope.loggedIn;
        };
        //Matt
        //Create array of numbers.
        $scope.getNumber = function(num) {
            return new Array(num);
        };
        //Matt
        //Num -> Char, 1->A, ...
        $scope.numToChar = function(n) {
            return String.fromCharCode(96 + parseInt(n)).toUpperCase();
        };
        //Matt
        //Num -> Char, arr, [1,2,3] -> [A,B,C]
        $scope.numToCharArr = function(arr) {
            var ltrArr = [];
            for (var num in arr) {
                ltrArr.push($scope.numToChar(num));
            }
            return ltrArr.join(", ");
        };
        //Matt
        //A->1,...
        $scope.charToNum = function(c) {
            return c.charCodeAt(0) - 96;
        };
        //Matt
        //Load resource from quiz start page.
        $scope.gotoResource = function(subjectName) {
            $location.path('/' + subjectName + '/resources');
        };
        //Matt
        //Load quiz from quiz start page.
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
        $scope.comment = null;
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
        };

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

        };

        $http.post('/api/quiz_result', studentGrades)
            .success(function(res) {
                console.log(res);
            });

    }
]);


//Matt
//Controller for storing quiz into MongoDB
angular.module('quiz').controller('QuizCreate', ['$scope', '$http', 'Upload', '$timeout',
    function($scope, $http, Upload, $timeout) {
        //Create quiz via file upload.
        $scope.success = false;
        $scope.numSave = 0; //successfully saved.
        $scope.numDupe = 0; //duplicates found.

        $scope.uploadFiles = function(file, errFiles) {
            //File upload
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

                //Results from file upload.
                file.upload.then(function(response) {
                    $scope.numSave = response.data.numSaved;
                    $scope.numDupe = response.data.numDuplicates;
                    $scope.success = $scope.numSave > 0 || $scope.numDupe > 0;
                    $scope.error = response.data.error;
                    $scope.errorMsg = $scope.error ? response.data.errorMsg : null;

                    //Progress bar
                    if ($scope.error) {
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

//Matt
//Compare two arrays.
function arraysEqual(a, b) {
    if (a === b) return true;
    if (a === null || b === null) return false;
    if (a.length !== b.length) return false;

    for (var i = 0; i < a.length; ++i) {
        if (a[i] !== b[i]) return false;
    }
    return true;
}

//Matt
//Array has duplicates.
function hasDuplicates(array) {
    return (new Set(array)).size !== array.length;
}
