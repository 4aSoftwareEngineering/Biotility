'use strict';

angular.module('users').controller('AuthenticationController', ['$scope', '$state', '$http', '$location', '$window', 'PasswordValidator', 'Authentication', 'Subjects', 'Teachers',
    function($scope, $state, $http, $location, $window, PasswordValidator, Authentication, Subjects, Teachers) {

        //Pop for email varification - MA
        $(document).ready(function() {
            $("#myBtn").click(function() {
                $("#myModal").modal();
            });
        });

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
                $scope.Periods.push("Period " + j);
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
            "Other"
        ];

        //Isabel- registration email

        $scope.sendMail = function(contactEmail) {

            console.log('Sending registration email!');
            console.log(contactEmail);
            var data = ({
                email: contactEmail
            });


            console.log(data.email);
            var route = '/api/auth/email';

            // Simple POST request example (passing data) :
            $http.post(route, data).success(function(req, res) {
                console.log("sending email");
            });
        };

        //Isabel- check if course code already existis before adding new course
        $scope.add = function(course, period) {
            console.log("Found course:" + course);
            console.log("user", $scope.authentication.user)

            //need a course!
            if (course == "" || course == null || course == undefined) return;
            if (period == "" || period == null || period == undefined) return;

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
                console.log("teachers", $scope.teachers)
                    //dowload all current course codes
                for (var i = 0; i < $scope.teachers.length; i++) {
                    for (var f = 0; f < $scope.teachers[i].courses.length; f++) {
                        var tc = $scope.teachers[i].courses[f];
                        if (tc == null) continue;
                        var number = tc.number;
                        //save course codes to savedCodes array
                        savedCodes.push(number);
                    }
                    // }  
                }

                var posted = false;
                var match = false;
                var num = Math.floor((Math.random() * 1000) + 1);
                while (posted === false) {
                    match = false;
                    //check if there is a match
                    while (match === false) {
                        //make random number
                        num = Math.floor((Math.random() * 1000) + 1);
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
                    posted = true;
                }
            });
        };

$scope.signup = function(isValid) {
            $scope.error = null;

            if (!isValid) {
                $scope.$broadcast('show-errors-check-validity', 'userForm');

                return false;
            }
             var teaches = false;
            // Add displayName
            $scope.credentials.displayName = $scope.credentials.lastName + ', ' + $scope.credentials.firstName;

            $scope.credentials.courses =  $scope.credentials.courses.length ? $scope.credentials.courses : [];

            console.log("courses", $scope.credentials.courses)
            var route = '/api/auth/signup/teacher';
            if ($scope.credentials.profileType === "Student") {
                route = '/api/auth/signup/student';
                console.log("Is a student");
            } else if ($scope.credentials.profileType === "Admin") {
                // user the teacher route because it doesn't ask for course code to register
                route = '/api/auth/signup/teacher';
                $scope.credentials.courses = []; 
                console.log("Is an Admin");



            } else if ($scope.credentials.profileType === "Teacher") {
                teaches = true;
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

            if(teaches == true){
                var coursename = "";
                for (var i= 0; i < $scope.credentials.courses.length; i++){
                    coursename = coursename + "Class: " + $scope.credentials.courses[i].courseName +" "+  $scope.credentials.courses[i].section+ " "
                }

                var data = ({
                    email : "biotilitysp18@gmail.com", 
                    subject: "A new teacher " + $scope.credentials.firstName +  " " + $scope.credentials.lastName + " registered  "  + coursename
                });
                console.log(data.subject);
                
                var route = '/api/auth/emailTeacherRegistration';
                $http.post(route, data).success(function(req, res) {
                    console.log("sending teacher registration email");
                });
            }

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

        if ($scope.authentication.user) {
            // flags for determining if current user is an admin or teacher
            $scope.authentication = Authentication;
            $scope.isAdmin = false;
            $scope.isTeacher = false;
            if ($scope.authentication.user.profileType === "Admin") {
                console.log("I am a admin");
                $scope.isAdmin = true;
            } else if ($scope.authentication.user.profileType === "Teacher") {
                console.log("I am a teacher");
                $scope.isTeacher = true;
            }
        }
    }
]);
