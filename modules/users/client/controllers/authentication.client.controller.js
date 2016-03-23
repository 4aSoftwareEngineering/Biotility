'use strict';

angular.module('users').controller('AuthenticationController', ['$scope', '$state', '$http', '$location', '$window', 'PasswordValidator', 'Authentication', 'Subjects',
    function($scope, $state, $http, $location, $window, PasswordValidator, Authentication, Subjects) {

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
                courseObj.number = Math.floor((Math.random() * 1000) + 1);
                $scope.credentials.courses.push(courseObj);

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
                console.log("Is a Admin");
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
