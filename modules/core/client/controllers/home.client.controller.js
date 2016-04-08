'use strict';

/** SEE core.server.routes.js  */


angular.module('core').controller('MainController', ['$scope', '$state', '$location', 'Authentication','$http', 'Subjects', 'Users',

    function($scope, $state, $location, Authentication, $http, Subjects, Users) {

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

        // $scope.codeReset = function(){
        //      console.log("cron go");
        //     var route = '/api/data/cron';
        //     $http.get(route).success(function (req, res) {
               
        //     });
        // };


    }
]);


angular.module('core').controller('SubjectController', ['$scope', '$http', '$state', '$location', 'Authentication', '$stateParams', 'Resources', 'Subjects', 'SubHeads',
    function($scope, $http, $state, $location, Authentication, $stateParams, Resources, Subjects, SubHeads) {

        // This provides Authentication context.
        $scope.authentication = Authentication;

        //Remember the subjected we are in
        $scope.subject = $stateParams.courseName;

        //some variables for the resource view
        $scope.success = null;
        $scope.error = null;
        $scope.editMode = false;
        $scope.updateMode = false;
        $scope.ResourceField = true;
        $scope.isAdmin = false;

        //Load Subjects
        Subjects.loadSubjects().then(function(response) {
            $scope.subjects = response.data;
        });

        //load all the resources from the database
        Resources.loadResources().then(function(response) {
            $scope.resources = response.data;
        });

        //load all the subheadings from the database
        SubHeads.loadSubHeads().then(function(response) {
            $scope.subHeads = response.data;
        });
        
        //Used to create a new Resource on database
        $scope.addResource = function() {
            var name = $scope.newResource.title;
            $http.post('api/data/resources', $scope.newResource).success(function(response) {
                Resources.loadResources().then(function(response) {
                    $scope.resources = response.data;
                    $scope.success =  name+' Successfully Added.';
                });
            }).error(function(response) {
                $scope.error = name+' Unsuccessfully added.';
            });

            $scope.newResource = null;
        };

        //Used to delete a Resource from the database
        $scope.deleteResource = function(resource_obj) {
            var id = resource_obj._id;
            var name = resource_obj.title;
            $http.delete('api/data/resources/' + id).success(function(response) {
                Resources.loadResources().then(function(response) {
                    $scope.resources = response.data;
                });
                $scope.success =  name+' Successfully Deleted.';
            }).error(function(response) {
                $scope.error = name+' Unsuccessfully Deleted.';
            });

            $scope.newResource = null;
        };

        //Used to update a Resource from the database
        $scope.updateResource = function(resource_obj) {
            var id = resource_obj._id;
            var name = resource_obj.title;
            $http.put('api/data/resources/' + id,$scope.newResource).success(function(response) {
                $scope.newResource = {};
                $scope.updateMode = false;
                $scope.success =  name+' Successfully Edited.';
            }).error(function(response) {
                $scope.error = name+' Unsuccessfully Edited.';
            });
        };

        //Angular SubHeading Functions like the ones above
        $scope.addSubHead = function() {
            var name = $scope.newSubHead.title;
            $http.post('api/data/subHeads', $scope.newSubHead).success(function(response) {
                SubHeads.loadSubHeads().then(function(response) {
                    $scope.subHeads = response.data;
                });
                $scope.success =  name+' Successfully Added.';
            }).error(function(response) {
                $scope.error =  $scope.newSubHead.title+' Unsuccessfully Added.';
            });
            
            $scope.newSubHead = null;
        };
        $scope.deleteSubHead = function(subHead_obj) {
            var id = subHead_obj._id;
            var name = subHead_obj.title;
            $http.delete('api/data/subheads/' + id).success(function(response) {
                SubHeads.loadSubHeads().then(function(response) {
                    $scope.subHeads = response.data;
                });
                $scope.success =  name+' Successfully Deleted.';
            }).error(function(response) {
                $scope.error =  name+' Unsuccessfully Deleted.';
            });
            
            $scope.newResource = null;
        };
        $scope.updateSubHead = function(subHead_obj) {
            var id = subHead_obj._id;
            $http.put('api/data/subheads/' + id,$scope.newSubHead).success(function(response) {
                $scope.success =  $scope.newSubHead.title+' Successfully Edited.';
                $scope.newSubHead = {};
                $scope.updateMode = false;
            }).error(function(response) {
                $scope.error =  $scope.newSubHead.title+' Unsuccessfully Edited.';
            });
        };

        //Used to Update Angular Parameters
        $scope.editResource = function(resource_obj) {
            $scope.updateMode = true;
            $scope.newResource = resource_obj;
            $scope.updateID = resource_obj._id;
            $scope.ResourceField = true;
        };
        $scope.editSubHead = function(subHead_obj) {
            $scope.updateMode = true;
            $scope.newSubHead = subHead_obj;
            $scope.updateSubHeadID = subHead_obj._id;
            $scope.ResourceField = false;
        };

        //Clears all fields, including the SubHead field        
        $scope.clearResourceField = function() {
            $scope.newResource = {};
            $scope.newSubHead = {};
            $scope.updateMode = false;
        };
        $scope.clearSuccessMessage = function() {
            $scope.success = null;
        };
        $scope.clearErrorMessage = function() {
            $scope.error = null;
        };

        $scope.startQuiz = function() {
            $location.path('/' + $scope.subject + '/quiz');
        };


    }
]);


angular.module('core').controller('authController',['$scope', '$state', '$location', 'Users', 'Authentication', '$http',function($scope, $state, $location, Users, Authentication, $http) {
		//This is a min config for authenticating admin features
        $scope.authentication = Authentication;
        $scope.user = $scope.authentication.user;
        
        $scope.isTeacher = false;
        $scope.isAdmin = false;
        
        //Set flags to true if admin or teacher 
        if ($scope.authentication.user.profileType === "Admin") {
            console.log("I am a admin");
            $scope.isAdmin = true;
        } else if ($scope.authentication.user.profileType === "Teacher") {
            console.log("I am a teacher");
            $scope.isTeacher = true;
        }
	}
]);

angular.module('core').controller('ProfileController', ['$scope', '$state', '$location', 'Users', 'Authentication', '$http', 'Subjects','Temp', 'plotly',
    function($scope, $state, $location, Users, Authentication, $http, Subjects, Temp,  plotly) {

       //Isabel- modal for resource request 
       $(document).ready(function(){
            $("#myBtn").click(function(){
                $("#myModal").modal();
            });
        });


        $scope.authentication = Authentication;
        $scope.user = $scope.authentication.user;
        // console.log("ProfileController");
        console.log($scope.credentials);
        console.log("User: " + $scope.user);

        $scope.oneAtATime = true;
        $scope.isTeacher = false;
        $scope.isAdmin = false;
        $scope.profileVisible = true;

        //checks if teacher
        if ($scope.authentication.user.profileType === "Teacher") {
            console.log("I am a teacher");
            $scope.isTeacher = true;
        } else if ($scope.authentication.user.profileType === "Admin") {
            console.log("I am a admin");
            $scope.isAdmin = true;
        }

        //input to put courseNames
        $scope.input = {};

        //courseNums array
        $scope.input.courseNums = [];
        $scope.input.courseNames = [];
        $scope.input.coursePeriods= [];


        //for each course in their schema
        $scope.authentication.user.courses.forEach(
            function(element, index, array) {
                //stores each course Name and number of the course that a teacher has
                
                $scope.input.courseNames.push(element.courseName);  
                $scope.input.courseNums.push(element.number); 
                $scope.input.coursePeriods.push(element.section);

                //used for testing purposes to make sure a teacher has the correct courses
                // console.log($scope.input.courseNums);
            }
        );

        //Isabel- how I actuall populate the classes shown
        $scope.input.coursesComplete = $scope.authentication.user.courses; 
      

        // credentials object
        $scope.credentials = {};
        $scope.credentials.courses = [];
        $scope.hello = 0;

       
        // array of class names

        $scope.classNames = [];
        $scope.Periods = [];

        //get course names
        Subjects.loadSubjects().then(function(response) {
            $scope.subjects = response.data;

            // grab all the courses, and read their names.
            for (var i = 0; i < $scope.subjects.length; i++) {
                $scope.classNames.push($scope.subjects[i].name);
                //console.log("JHDKJAHSDKFJHA  " + $scope.subjects[i].name);
            }

            for (var j = 1; j < $scope.subjects.length; j++) {
                $scope.Periods.push("Period "+ j);
            }

        });


        //Isabel- New Course Names
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
                                "Forensics"];

        //Isabel- Upload New Profile Photo


        
        $scope.myFunction = function(hello){
            $scope.user.courseCode.push(hello);
        };

        $scope.add = function(course,period) {
            if (course !== '') {

                //Creates a new object to be used for user course schema
                var courseObj = {};
                courseObj.courseName = course;
                courseObj.content = "";
                courseObj.progress = "";
                courseObj.section = period;

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
                    $scope.input.courseNums.push(element.courseName + " : " + element.number + element.section);
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

        //Isabel
        $scope.settingsupdate = function(isValid) {

            console.log("Changing Settings");
            $scope.error = null;

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

        //Isabel
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

        //Isabel
        $scope.sendEmail = function(isValid){

            console.log("sending email for resources" );
            console.log("Subject: " + $scope.resource.subject );
            console.log("Subject Details: "+ $scope.resource.subjectdetails );
            console.log("Link: "+ $scope.resource.resourcelink);
            console.log("Comments: " + $scope.resource.comments);

            var data = ({

                subject: $scope.resource.subject,
                subheading: $scope.resource.subjectdetails,
                link: $scope.resource.resourcelink,
                comments: $scope.resource.comments,
                email: $scope.resource.email

            });

            var route = '/api/data/email';
            $http.post(route, data).success(function (req, res) {
                console.log("sending email");
            });


           

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
                // console.log($scope.studentGrades[i].studentName);

            }
            $scope.groups[0].progress *= 25;
        };

        // Isabel- reset a single teachers code
        $scope.resetCodes = function(){

            var d = new Date();
            var dlog = d.getDate();
            // console.log("Date: "+dlog);

            var m = new Date();
            var mlog = d.getMonth();
            // console.log("Month: "+mlog);

            var h = new Date();
            var hlog = d.getHours();
            // console.log("Hour: "+ hlog);

            var mi = new Date();
            var milog = mi.getMinutes();
            // console.log("Miniute: "+milog);

            var s = new Date();
            var slog = s.getSeconds();
            // console.log("TODAY AND NOW"); 

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
                        
                        var route = '/api/users/no';

                        $scope.put(route, newuser.courses).success(function(response) {


                            }).error(function(response) {
                                console.log("Unable to PUT.");
                                console.dir(response);
                                $scope.error = response.message;
                        });
                      
                    }
                });
            }
        };

        //Isabel - bar graph
        $scope.viewStats = function(course){
           
            // Plotly Stuff
            console.log("Passing: "+ course);
            var route = '/api/data/plot';

            var params = ({
                person: $scope.user, 
                given: course 
            });

            $http.get(route, {params:{"person": $scope.user, "given": course}}).then(function(res) {
                // your data
                console.log(res.data);
                console.log("ploting");
                // console.log(res);
                var ctx = $("#myChart").get(0).getContext("2d");

                  var data = {
                    labels: ["January", "February", "March", "April", "May", "June", "July"],
                    datasets: [
                        {
                            label: "My First dataset",
                            fillColor: "rgba(220,220,220,0.5)",
                            strokeColor: "rgba(220,220,220,0.8)",
                            highlightFill: "rgba(220,220,220,0.75)",
                            highlightStroke: "rgba(220,220,220,1)",
                            data: res.data
                        },
                       
                    ]
                  };

                  var myBarChart = new Chart(ctx).Bar(data);
            }).then(function(error) {
                console.log(error);
            })

            // $http.get(route, {params:{"person": $scope.user, "given": course}}).success(function (req, res) {
            //     console.log("ploting");
            //     console.log(res);
            //     var ctx = $("#myChart").get(0).getContext("2d");

            //       var data = {
            //         labels: ["January", "February", "March", "April", "May", "June", "July"],
            //         datasets: [
            //             {
            //                 label: "My First dataset",
            //                 fillColor: "rgba(220,220,220,0.5)",
            //                 strokeColor: "rgba(220,220,220,0.8)",
            //                 highlightFill: "rgba(220,220,220,0.75)",
            //                 highlightStroke: "rgba(220,220,220,1)",
            //                 data: res
            //             },
                       
            //         ]
            //       };

            //       var myBarChart = new Chart(ctx).Bar(data);    
            // }); 

            

            // location.reload();
        };

        //reset all the teachers code
        $scope.resetAllCodes = function(){
            //get all teachers
           
            
             //check to see if date is August 1st
            var d = new Date();
            var dlog = d.getDate();
            // console.log(dlog);

            var m = new Date();
            var mlog = d.getMonth();
            // console.log(mlog);


            //if so change all course arrays to empty
            if(dlog === 1 && mlog === 7){
                // console.log("It's August 1st, time for a reset!");

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
