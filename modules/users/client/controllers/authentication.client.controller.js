'use strict';

angular.module('users').controller('AuthenticationController', ['$scope', '$state', '$http', '$location', '$window', 'PasswordValidator', 'Authentication', 'Subjects', 'Teachers',
    function($scope, $state, $http, $location, $window, PasswordValidator, Authentication, Subjects, Teachers) {

        //Pop for email varification - MA
        $(document).ready(function(){
            console.log('Hello');
            $("#myBtn").click(function(){
                $("#myModal").modal();
            });
        });

        //Added Stuff
        $scope.authentication = Authentication;
        $scope.popoverMsg = PasswordValidator.getPopoverMsg();

        // Get an eventual error defined in the URL query string:
        $scope.error = $location.search().err;

        $scope.emText = ' ';


        // credentials object
        $scope.credentials = {};
        $scope.credentials.courses = [];

        // array of class names
        $scope.classNames = [];
        $scope.Periods = [];

        //array of saved codes
        var savedCodes = [];
        

        // load subjects
        Subjects.loadSubjects().then(function(response) {
            $scope.subjects = response.data;

            // grab all the courses, and read their names.
            for (var i = 0; i < $scope.subjects.length; i++) {
                $scope.classNames.push($scope.subjects[i].name);
            }
            //periods
            for (var j = 1; j < $scope.subjects.length; j++) {
                $scope.Periods.push("Period "+ j);
            }

        });

        $scope.newclassNames = ["Biotechnology 1",
                            "Biotechnology 2",
                            "Biotechnology 3",
                            "PLTW Principles of Biomedical Science",
                            "PLTW Human Body Systems",
                            "PLTW Medical Interventions",
                            "PLTW Biomedical Innovation",
                            "Agricultural Biotechnology",
                            "Biology",
                            "Honors Biology",
                            "AP Biology",
                            "AICE Biology",
                            "IB Biology",
                            "Genetics",
                            "Forensics",
                            "Other"];

        //Send email if code needed.
        $scope.sendMail = function () {

            console.log('HELLO!!!!');
            var data = ({
                contactEmail : $scope.emText
            });


            console.log(data.contactEmail);
            var route = '/api/data/emailV';

            // Simple POST request example (passing data) :
            $http.post(route, data).success(function(req, res) {
                console.log("sending email");
            });
        };

        //Isabel- check if course code already existis before adding new course
        $scope.add = function(course,period) {
            console.log("Found course:" + course);
            if (course !== '') {
                //Creates a new object to be used for user course schema
                var courseObj = {};
                courseObj.courseName = course;
                courseObj.content = "";
                courseObj.progress = "";
                courseObj.section = period;

                //Generate number when you add the course
                //get all the coursecodes
                Teachers.loadTeachers().then(function(response) {
                    $scope.teachers = response.data;
                    //dowload all current course codes
                    for (var i = 0; i < $scope.teachers.length; i++) {
                        // if ($scope.teacher[i].courses !== undefined) {
                            // console.log("not empty");
                            // console.log($scope.teachers[i].courses[0].number);
                            // var number = $scope.teachers[i].courses[0].number;
                            for(var f = 0; f < $scope.teachers[i].courses.length; f++){
                                // console.log($scope.teachers[i].courses[f].number);
                                var number = $scope.teachers[i].courses[f].number;
                                //save course codes to savedCodes array
                                savedCodes.push(number);
                            }
                        // }  
                    }

                    var posted = false;
                    var match = false;
                    var num =  Math.floor((Math.random() * 1000) + 1);
                    while (posted === false){
                        match = false;
                        //check if there is a match
                        while (match === false){
                            //make random number
                            num =  Math.floor((Math.random() * 1000) + 1);
                            match = true;
                            for (var s = 0; s < savedCodes.length; s++) {
                                //if there is go back to beginning 
                                if (num === savedCodes[s]) {
                                    match = false;
                                    console.log("Duplicate Code");
                                    break;
                                }
                            }

                        }
                        //if not add course code
                        console.log("New Course Code Created");
                        courseObj.number = num;
                        $scope.credentials.courses.push(courseObj);
                        console.log($scope.credentials.courses[0]);
                        posted = true; 
                    }
                });
            }

            $scope.toAdd = '';
        };

        $scope.signup = function(isValid) {
            $scope.error = null;
			//recaptcha.validate(key)
			//.then(function(){
			  // validated and secure
			//})
			//.catch(function(errorCodes){
			  // invalid
			//  console.log(recaptcha.translateErrors(errorCodes));// translate error codes to human readable text
			//  console.log("invalid");
                //sets error if invalid info
            //    alert("Use a valid course code. For testing, use 863.");

            //    $scope.error = response.message;
			//});
            if (!isValid) {
                $scope.$broadcast('show-errors-check-validity', 'userForm');
				
                return false;
            }

            // Add displayName
            $scope.credentials.displayName = $scope.credentials.lastName + ', ' + $scope.credentials.firstName;
            console.log($scope.credentials);
            var route = '/api/auth/signup/teacher';
            if ($scope.credentials.profileType === "Student") {
                route = '/api/auth/signup/student';
                console.log("Is a student");
            } else if($scope.credentials.profileType === "Admin") {
                route = '/api/auth/signup/admin';
                console.log("Is an Admin");
            } else if($scope.credentials.profileType === "Teacher") {
                route = '/api/auth/signup/teacher';
                console.log("Is a Teacher");
            }


            $http.post(route, $scope.credentials).success(function(response) {

                // If successful we assign the response to the global user model
                $scope.authentication.user = response;

                // And redirect to the home page
                $location.url('/');
            }).error(function(response) {
                console.log("Invalid (Sign up)", response);
                //sets error if invalid info
                alert("Use a valid course code. For testing, check the database for a teacher and use their course numbers.");

                $scope.error = response.message;
            });

        };
// 

      
        $scope.signin = function(isValid) {

            $scope.error = null;

            if (!isValid) {
                //$scope.$broadcast('show-errors-check-validity', 'userForm');
                return false;
            }

            $http.post('/api/auth/signin', $scope.credentials).success(function(response) {

                // If successful we assign the response to the global user model
                $scope.authentication.user = response;

                // And redirect to home page
                $state.go('home');
            }).error(function(response) {
                console.log("Invalid (Sign in)", response);
                //sets popup for invalid usernmae or password
                setTimeout(function() {
                    alert("Invalid Username or Password");
                }, 0);
                $scope.error = response.message;
            });
        };

        // OAuth provider request
        $scope.callOauthProvider = function(url) {
            if ($state.previous && $state.previous.href) {
                url += '?redirect_to=' + encodeURIComponent($state.previous.href);
            }

            // Effectively call OAuth authentication route:
            $window.location.href = url;
        };
    }
]);
