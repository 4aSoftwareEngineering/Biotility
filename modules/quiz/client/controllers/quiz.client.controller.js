'use strict';

// Quiz main controller
angular.module('quiz').controller('QuizController', ['$scope', '$location', 'QuizQuestion', '$stateParams', '$state', 'Authentication', '$http',
    function($scope, $location, QuizQuestion, $stateParams, $state, Authentication, $http) {
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
        console.log($scope.authentication.user);
        console.log($stateParams);

        $scope.isDone = false; //checks if the quiz is finished ->switches models to done state
        $scope.quizStarted = false; //checks if quiz start button is triggered

        $scope.questions = [];
        var max = 0;
        $scope.index = -1;
        $scope.score = 0;
        $scope.analytics = [];
        $scope.numQuestion = 0;
        $scope.hasError = false;
        $scope.hasStart = true;
        $scope.currCategory = $stateParams.courseName;

        $scope.start = function() {
            if (max === 0) {
                console.log("No questions found.");
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
            if (!$scope.analytics[$scope.index] || isNaN($scope.analytics[$scope.index]) ) {
                $scope.analytics[$scope.index] = {};
                $scope.analytics[$scope.index].question = $scope.questions[$scope.index];
                $scope.analytics[$scope.index].attempts = 1;
            }
            if ($scope.isTF || $scope.isMultipleChoice) {
                if ($scope.questions[$scope.index].correctAnswer === answer) {
                    console.log("Correct!");
                    console.dir($scope.analytics[$scope.index]);
                    $scope.increment();
                } else {
                    console.log("Incorrect!");
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
            if ($scope.index === max) {
                console.log("Quiz finished.");
                $scope.isDone = true;
                $scope.hasStart = false;
            } else {
                $scope.index = ($scope.index + 1) % $scope.questions.length;

                if ($scope.questions[$scope.index].questionType === "TF") {
                    $scope.isMA = false;
                    $scope.isTF = true;
                    $scope.isMultipleChoice = false;
                } else if ($scope.questions[$scope.index].questionType === "SC") {
                    $scope.isMA = false;
                    $scope.isMultipleChoice = true;
                    $scope.isTF = false;
                } else if ($scope.questions[$scope.index].questionType === "MA") {
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
            console.dir($scope.questions);
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

        //Creates a new student grades and stores it into collection view StudentGrades
        var studentGrades = {
            category: $stateParams.category,
            studentName: $scope.user.userName,
            analytics: $scope.analytics,
        };

        console.log($scope.user.userName);

        $http.post('/api/quiz_result', studentGrades)
            .success(function(res) {
                console.log(res);
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
	    // need to convert $fileContent to CSV (; delim) before upload
            var fileText = $fileContent;
	    var head = fileText.split('URL\n');	//remove header
	    var text = head[1];
            var rows = text.split(';\n');	//grab each individual row
            var obj = [];
            angular.forEach(rows, function(val) {
                var o = val.split(';');	   //separate by "commas"	
                if (o[0] !== 'Category') { //sketchy way to get rid of first row
                   // console.log(o);
                    var quizQuestion;
                    if (o[1] === 'TF') {
			//True/False question
                        quizQuestion = new QuizQuestion({
                            category: o[0],
                            questionType: o[1],
                            description: o[2],
                            correctAnswer: o[3],
			    hint: o[14],
			    links: o[15]
                        });
                    } 
		// need to add other question types! (sc, ma)
		    else if(o[1] === 'SC') {
			// Single choice answer question
                        quizQuestion = new QuizQuestion({
                            category: o[0],
                            questionType: o[1],
                            description: o[2],
                            correctAnswer: o[3],
                            answerDesc1: [o[4],o[5],o[6],o[7],o[8]],
                            //answerDesc2: o[5],
                            //answerDesc3: o[6],
                            //answerDesc4: o[7],
			    //answerDesc5: o[8],
			    hint: o[14],
			    links: o[15]
                        });
                    }
		    else{// if(o[1] === 'MA') {
			// Multiple Answer question
                        quizQuestion = new QuizQuestion({
                            category: o[0],
                            questionType: o[1],
                            description: o[2],
                            correctAnswer: o[3],
                            answerDesc1: [o[4],o[5],o[6],o[7],o[8]],
                            //answerDesc2: o[5],
                            //answerDesc3: o[6],
                            //answerDesc4: o[7],
			    //answerDesc5: o[8],
                            MA1: [o[9],o[10],o[11],o[12],o[13]],
                            //MA2: o[10],
                            //MA3: o[11],
                            //MA4: o[12],
			    //MA5: o[13],
			    hint: o[14],
			    links: o[15]
                        });
                    }
                    obj = quizQuestion;
		    // save stores in DB?? (server controller)
                    quizQuestion.$save(function(response) {
                        console.log("save done");
                    }, function(errorResponse) {
                        console.log("Error occured" + errorResponse.data.message);
                    });
                } //End category if
            }); // end loop
	    // content is the text displayed after a file is uploaded
            $scope.content = fileText;
        };

    }
]);
