'use strict';

angular.module('users').controller('AuthenticationController', ['$scope', '$state', '$http', '$location', '$window', 'PasswordValidator', 'Authentication', 'Subjects', 'Teachers',
    function($scope, $state, $http, $location, $window, PasswordValidator, Authentication, Subjects, Teachers) {

        //Added Stuff
        $scope.authentication = Authentication;
        $scope.popoverMsg = PasswordValidator.getPopoverMsg();

        // Get an eventual error defined in the URL query string:
        $scope.error = $location.search().err;

        // credentials object
        $scope.credentials = {};
        $scope.credentials.courses = [];

        // array of class names
        $scope.classNames = [];

        //array of saved codes
        var savedCodes = [];
        var test = "HI ISABEL";

        // load subjects
        Subjects.loadSubjects().then(function(response) {
            $scope.subjects = response.data;

            // grab all the courses, and read their names.
            for (var i = 0; i < $scope.subjects.length; i++) {
                $scope.classNames.push($scope.subjects[i].name);
            }

        });

        $scope.add = function(course) {
            if (course !== '') {
                //Creates a new object to be used for user course schema
                    var courseObj = {};
                    courseObj.courseName = course;
                    courseObj.content = "";
                    courseObj.progress = "";
                    courseObj.section = "";

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

                    var num =  Math.floor((Math.random() * 1000) + 1);
                    // var num = 89;
                    var check = true;

                    // console.log("Checking course codes:");
                    //see if num already exists in the savedCodes array
                    for (var s = 0; s < savedCodes.length; s++) {
                        console.log(savedCodes[s]);
                        if (num === savedCodes[s]) {
                            check = false;
                        }
                    }

                    //if so make a new one and keep checking
                    if (check === false){
                        // var num2 =  Math.floor((Math.random() * 1000) + 1);
                        console.log("Duplicate Code");
                        check = true;
                    }
                    //if not assign that number to the courseObj and add it to the array
                    else{
                        console.log("New Course Code Created");
                        courseObj.number = num;
                        $scope.credentials.courses.push(courseObj);
                    }
                });
            }

            $scope.toAdd = '';
        };

        $scope.signup = function(isValid) {
            $scope.error = null;

            if (!isValid) {
                $scope.$broadcast('show-errors-check-validity', 'userForm');

                return false;
            }

            // Add displayName
            $scope.credentials.displayName = $scope.credentials.lastName + ', ' + $scope.credentials.firstName;

            console.log($scope.credentials);
            var route = '/api/auth/signup/';
            if ($scope.credentials.profileType === "Student") {
                route = '/api/auth/signup/student';
                console.log("Is a student");
            }

            $http.post(route, $scope.credentials).success(function(response) {

                // If successful we assign the response to the global user model
                $scope.authentication.user = response;

                // And redirect to the home page
                $location.url('/');

            }).error(function(response) {
                console.log("invalid");
                //sets error if invalid info
                alert("Use a valid course code. For testing, use 863.");

                $scope.error = response.message;
            });

        };

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
                console.log("invalid");
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
