'use strict';

/** SEE core.server.routes.js  */


angular.module('core').controller('MainController', ['$scope', '$state', '$location', 'Authentication', 'Subjects', '`',
    function($scope, $state, $location, Authentication, Subjects, Users) {
        // This provides Authentication context.
        $scope.authentication = Authentication;

        Subjects.loadSubjects().then(function(response) {
            $scope.subjects = response.data;
            //console.log($scope.subjects);
        });

        $scope.gotoQuiz = function(subjectObj) {
            $location.path('/' + subjectObj.name + '/quiz');
        };

        $scope.gotoResource = function(subjectObj) {
            $location.path('/' + subjectObj.name + '/resources');
        };


    }
]);


angular.module('core').controller('SubjectController', ['$scope', '$http', '$state', '$location', 'Authentication', '$stateParams', 'Resources', 'Subjects', 
    function($scope, $http, $state, $location, Authentication, $stateParams, Resources, Subjects) {
        // This provides Authentication context.
        $scope.authentication = Authentication;


        $scope.subject = $stateParams.courseName;

        //some variables for the resource view
        $scope.resourceFilter = { subject: $scope.subject };
        $scope.editMode = false;

        //load all the resources from the database
        Resources.loadResources().then(function(response) {
            $scope.resources = response.data;
        });

        //Used to create a new Resource on database
        $scope.addResource = function() {
            $http.post('api/data/resources', $scope.newResource).success(function(response) {
                console.log("Eric", response.message);
            }).error(function(response) {
                console.log("Eric", response.message);
            });
            $scope.resources.push($scope.newResource);

            $scope.newResource = null;
        };

        //Used to delete a Resource from the database
        $scope.deleteResource = function(index) {
            var id = $scope.resources[index]._id;
            $http.delete('api/data/resources/' + id).success(function(response) {
                console.log("Eric", response.message);
            }).error(function(response) {
                console.log("Eric http delete error", response.message);
            });
            $scope.resources.splice(index, 1);

            $scope.newResource = null;
        };


        $scope.startQuiz = function() {
            $location.path('/' + $scope.subject + '/quiz');
        };


    }
]);

angular.module('core').controller('ProfileController', ['$scope', '$state', '$location', 'Users', 'Authentication', '$http', 'Subjects', 'Temp', 'plotly',
    function($scope, $state, $location, Users, Authentication, $http, Subjects, Temp, plotly) {
        
        // var plotly = require('plotly')("biotilitysp18","tmplea9qm7");
        $scope.authentication = Authentication;
        $scope.user = $scope.authentication.user;
        //console.log("ProfileController");
        console.log($scope.credentials);
        console.log($scope.user);

        $scope.oneAtATime = true;
        $scope.isTeacher = false;
        $scope.profileVisible = true;
        //checks if teacher
        if ($scope.profileType === "Teacher") {
            console.log("I am a teacher");
            $scope.isTeacher = true;
        }

        //input to put courseNames
        $scope.input = {};
        //courseNums array
        $scope.input.courseNums = [];
        //for each course in their schema
        $scope.authentication.user.courses.forEach(
            function(element, index, array) {
                //stores each course Name and number of the course that a teacher has
                $scope.input.courseNums.push(element.courseName + " : " + element.number);

                //used for testing purposes to make sure a teacher has the correct courses
                console.log($scope.input.courseNums);

            }
        );

        // credentials object
        $scope.credentials = {};
        $scope.credentials.courses = [];

        //get course names
        // array of class names
        $scope.classNames = [];
        Subjects.loadSubjects().then(function(response) {
            $scope.subjects = response.data;

            // grab all the courses, and read their names.
            for (var i = 0; i < $scope.subjects.length; i++) {
                $scope.classNames.push($scope.subjects[i].name);
                //console.log("JHDKJAHSDKFJHA  " + $scope.subjects[i].name);
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
                //$scope.credentials.courses.push(courseObj);
                $scope.authentication.user.courses.push(courseObj);
                console.log("I AM ADDING A CLASS " + courseObj.courseName);
            }

            $scope.authentication.user.courses.forEach(
                function(element, index, array) {
                    //$scope.authentication.user.courses.push(courseObj);
                    console.log("CURRENT CLASSES: " + element.courseName);
                });

            //to display on profile view
            $scope.input = {};
            //courseNums array
            $scope.input.courseNums = [];
            // for each course in their schema
            $scope.authentication.user.courses.forEach(
                function(element, index, array) {
                    //stores each course Name and number of the course that a teacher has
                    $scope.input.courseNums.push(element.courseName + " : " + element.number);
                    //used for testing purposes to make sure a teacher has the correct courses
                    console.log("INPUT CLASSES: " + $scope.input.courseNums);
                });

            // $scope.tester();
            // $scope.update();
            console.dir($scope);
            var route = '/api/users/' + $scope.authentication.user._id;

            $http.put(route, $scope.user.courses).success(function(response) {

                // If successful we assign the response to the global user model
                $scope.authentication.user = response;

                // And redirect to the home page
                $location.url('/');

            }).error(function(response) {
                console.log("Unable to PUT.");
                console.dir(response);
                //sets error if invalid info
                //alert("Not updating.");

                $scope.error = response.message;
            });

            $scope.toAdd = '';
        };

        $scope.settingsupdate = function(isValid) {

            console.log("Changing Settings");
            $scope.error = null;

            // if (!isValid) {
            //     $scope.$broadcast('show-errors-check-validity', 'userForm');

            //     return false;
            // }


            console.dir("SCOPE: " + $scope);
            console.log($scope.credentials.firstName);
            var route = '/api/users/' + $scope.authentication.user._id;
            if ($scope.credentials.firstName !== undefined) {
                $scope.authentication.user.firstName = $scope.credentials.firstName;
            } else {
                console.log("no first");
            }



            if ($scope.credentials.lastName !== undefined) {
                $scope.authentication.user.lastName = $scope.credentials.lastName;
            } else {
                console.log("no last");
            }


            if ($scope.credentials.userName !== undefined) {
                $scope.authentication.user.userName = $scope.credentials.userName;
            } else {
                console.log("no username");
            }

            if ($scope.credentials.email !== undefined) {
                $scope.authentication.user.email = $scope.credentials.email;
            } else {
                console.log("no email");
            }


            if ($scope.credentials.password !== undefined) {
                $scope.authentication.user.password = $scope.credentials.password;
            } else {
                console.log("no password");
            }


            $scope.authentication.user.displayName = $scope.authentication.user.lastName + ', ' + $scope.authentication.user.firstName;
            // $scope.authentication.user.lastName = $scope.credentials.lastName;
            // $scope.authentication.user.email = $scope.credentials.email;
            // $scope.authentication.user.userName = $scope.credentials.userName;
            // $scope.authentication.user.password = $scope.credentials.password;
            // console.log("NEW NAME " + $scope.user.firstName);

            $http.post(route, $scope.user).success(function(response) {

                // If successful we assign the response to the global user model
                $scope.authentication.user = response;

                //redirect to the home page
                //$location.url('/');

            }).error(function(response) {
                console.log("Unable to POST.");
                // console.log(response);
                console.dir("RESPONSE: " + response);
                //sets error if invalid info
                //alert("Not updating.");

                $scope.error = response.message;
            });
        };

        $scope.update = function() {
            $scope.error = null;

            var user = $scope.user;
            console.log("USER= " + user.email);
            user.$update(function() {
                console.log("HOME CONTROLLER UPDATE");
                // $location.path('/teacher/' + user._id);
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        $scope.sendEmail = function(isValid){
            var route = '/api/data/email';
            $http.get(route).success(function (req, res) {
                console.log("sending email");
            });


           //  console.log("sending email for resources" );
           //  console.log("Subject: " + $scope.resource.subject );
           //  console.log("Subject Details: "+ $scope.resource.subjectdetails );
           //  console.log("Link: "+ $scope.resource.resourcelink);
           //  console.log("Comments: " + $scope.resource.comments);

           //  var email = "isalau@me.com" ;
           //  // separate addresses by commas, no spaces //
           //  var subject = "Biotility" ;
           //  var body = "Testing" ;

           // var link = 'mailto:isalau@me.com? subject=Resource Update Request from me &body= Subject:' + $scope.resource.subject ;
           // window.location.href = link;
        };


       




        //creates groups
        $scope.groups = [{
            title: 'Cells',
            content: 'Lesson 4: The Nucleus',
            progress: 0
        }, {
            title: 'Biology',
            content: 'Lesson 2: Ecosystems',
            progress: 25
        }, {
            title: 'Chemistry',
            content: 'Lesson 13: Electron Mobility',
            progress: 75
        }];

        $scope.items = ['Item 1', 'Item 2', 'Item 3'];

        $scope.status = {
            isFirstOpen: true,
            isFirstDisabled: false
        };

        $scope.$on('creation', function(event, args) {
            console.log(args);
            //console.log("controller2");
            $scope.test = "TESTING";
            console.log($scope.section);
            $scope.section = args.firstName;
            console.log($scope.section);

        });
        
        //gets student grades
        $scope.studentGrades = [];
        $http.get('/api/quiz_result')
            .success(function(res) {
                // console.log("quiz result: ", res);
                byStudent(res);
        });

        //gets student  grades by student and stores them
        var byStudent = function(allStudentGrades) {
            for (var i = 0; i < allStudentGrades.length; i++) {
                //console.log(allStudentGrades[i].studentName);
                //console.log($scope.user.userName);
                //console.log("BANG: " + allStudentGrades[i].studentName + " " + $scope.user.userName);
                if (allStudentGrades[i].studentName === $scope.user.userName) {
                    $scope.studentGrades.push(allStudentGrades[i]);
                    //TODO: "Applications" should be the name of the course, like "Biology"
                    //TODO: quiz should have a pass/fail variable, to determine if adding to progress.
                    /*
                    for (var j = 0; j < $scope.groups.length; j++) {
                        if (allStudentGrades[i].category === $scope.groups[j].title) {
                            if (allStudentGrades[i].pass == true) {
                                //add progress to group
                            }
                        }
                    }
                    */
                    if (allStudentGrades[i].category === "Applications") {
                        //have to hardcode this until what "applications" is, is resolved
                        $scope.groups[0].progress++;
                        //TODO: this should be:
                        /* if (allStudentGrades[i].pass == true) { */
                    }
                }
                //console.log($scope.studentGrades[i].studentName);

            }
            $scope.groups[0].progress *= 25;
        };

        //reset a single teachers code
        $scope.resetCodes = function(){

            var d = new Date();
            var dlog = d.getDate();
            console.log("Date: "+dlog);

            var m = new Date();
            var mlog = d.getMonth();
            console.log("Month: "+mlog);

            var h = new Date();
            var hlog = d.getHours();
            console.log("Hour: "+ hlog);

            var mi = new Date();
            var milog = mi.getMinutes();
            console.log("Miniute: "+milog);

            var s = new Date();
            var slog = s.getSeconds();
            console.log("TODAY AND NOW"); 

            //if so change all course arrays to empty
            if(dlog === 1 && mlog === 7 && hlog===0 && milog === 0 && s === 0){
            // if(dlog === 18 && mlog === 2 && hlog === 18 && milog === 22){
                  

                Temp.parseUsers().then(function(response) {
                    $scope.users = response.data;
                    //dowload all current course codes
                    for (var i = 0; i < $scope.users.length; i++) {
                        
                        while ($scope.users[i].courses.length > 0) {
                            $scope.users[i].courses.pop();
                        }

                        updateresetCodes($scope.users[i]);
                    }

                    function updateresetCodes(newuser){
                        

                        // var route = '/api/users/' + newuser._id;
                        var route = '/api/users/no';

                        $scope.put(route, newuser.courses).success(function(response) {
                            // console.log(newuser.firstName + newuser.courses);
                            
                            // If successful we assign the response to the global user model
                            // newuser = response;

                            // And redirect to the home page
                            //$location.url('/');

                            }).error(function(response) {
                                console.log("Unable to PUT.");
                                console.dir(response);
                                $scope.error = response.message;
                        });
                      
                    }
                });
            }
        };


        $scope.viewStats = function(){
            var route = '/api/data/plotly';
            $http.get(route).success(function (req, res) {
                console.log("plotly go");
            });

            location.reload();
        };

        //reset all the teachers code
        $scope.resetAllCodes = function(){
            //get all teachers
           
            
             //check to see if date is August 1st
            var d = new Date();
            var dlog = d.getDate();
            console.log(dlog);

            var m = new Date();
            var mlog = d.getMonth();
            console.log(mlog);


            //if so change all course arrays to empty
            if(dlog === 1 && mlog === 7){
                console.log("It's August 1st, time for a reset!");

                while ($scope.authentication.user.courses.length > 0) {
                $scope.authentication.user.courses.pop();
            }

            
            var route = '/api/users/' + $scope.authentication.user._id;

            $http.put(route, $scope.user.courses).success(function(response) {

                // If successful we assign the response to the global user model
                $scope.authentication.user = response;

                // And redirect to the home page
                $location.url('/');

                }).error(function(response) {
                    console.log("Unable to PUT.");
                    console.dir(response);
                    $scope.error = response.message;
                });
            }    
        };

    }
]);
