'use strict';

/** SEE core.server.routes.js  */
// function Chart(nonsense){
//     this.nothing = nonsense;
// }

angular.module('core').controller('MainController', ['$scope', '$state', '$location', 'Authentication', '$http', 'Subjects', 'Users',

    function($scope, $state, $location, Authentication, $http, Subjects, Users) {

        $scope.ready  = function() {
            $scope.carousel({
                interval: 1200
            });
        };

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


angular.module('core').controller('SubjectController', ['$scope', '$http', '$state', '$location', 'Authentication', '$stateParams', 'Resources', 'Subjects', 'SubHeads', '$window',
    function($scope, $http, $state, $location, Authentication, $stateParams, Resources, Subjects, SubHeads, $window) {

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
            $scope.newResource.clicks = 0;
            var name = $scope.newResource.title;

            $http.post('api/data/resources', $scope.newResource).success(function(response) {
                Resources.loadResources().then(function(response) {
                    $scope.resources = response.data;
                    $scope.success = name + ' Successfully Added.';
                });
            }).error(function(response) {
                $scope.error = name + ' Unsuccessfully added.';
            });

            $scope.newResource = null;
        };

        //Used to delete a Resource from the database
        $scope.deleteResource = function(resource_obj) {
            var id = $scope.deleteResourceObj._id;
            var name = $scope.deleteResourceObj.title;
            $http.delete('api/data/resources/' + id).success(function(response) {
                Resources.loadResources().then(function(response) {
                    $scope.resources = response.data;
                });
                $scope.success = name + ' Successfully Deleted.';
            }).error(function(response) {
                $scope.error = name + ' Unsuccessfully Deleted.';
            });

            $scope.newResource = null;
        };
        $scope.getDeleteResource = function(resource_obj) {
            $scope.deleteResourceObj = resource_obj;
        };
        //Used to update a Resource from the database
        $scope.updateResource = function(resource_obj) {
            var id = resource_obj._id;
            var name = resource_obj.title;
            $http.put('api/data/resources/' + id, $scope.newResource).success(function(response) {
                $scope.newResource = {};
                $scope.updateMode = false;
                $scope.success = name + ' Successfully Edited.';
            }).error(function(response) {
                $scope.error = name + ' Unsuccessfully Edited.';
            });
        };

        //Angular SubHeading Functions like the ones above
        $scope.addSubHead = function() {
            var name = $scope.newSubHead.title;
            $http.post('api/data/subHeads', $scope.newSubHead).success(function(response) {
                SubHeads.loadSubHeads().then(function(response) {
                    $scope.subHeads = response.data;
                });
                $scope.success = name + ' Successfully Added.';
            }).error(function(response) {
                $scope.error = $scope.newSubHead.title + ' Unsuccessfully Added.';
            });

            $scope.newSubHead = null;
        };

        $scope.deleteSubHead = function(subHead_obj) {
            var id = $scope.deleteSubHeadObj._id;
            var name = $scope.deleteSubHeadObj.title;
            $http.delete('api/data/subheads/' + id).success(function(response) {
                SubHeads.loadSubHeads().then(function(response) {
                    $scope.subHeads = response.data;
                });
                $scope.success = name + ' Successfully Deleted.';
            }).error(function(response) {
                $scope.error = name + ' Unsuccessfully Deleted.';
            });

            $scope.newResource = null;
        };
        $scope.getDeleteSubHead = function(subHead_obj) {
            $scope.deleteSubHeadObj = subHead_obj;
        };
        $scope.updateSubHead = function(subHead_obj) {
            var id = subHead_obj._id;
            $http.put('api/data/subheads/' + id, $scope.newSubHead).success(function(response) {
                $scope.success = $scope.newSubHead.title + ' Successfully Edited.';
                $scope.newSubHead = {};
                $scope.updateMode = false;
            }).error(function(response) {
                $scope.error = $scope.newSubHead.title + ' Unsuccessfully Edited.';
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

        $scope.recordClick = function(resource_obj,index,link_url) {
            var id = resource_obj._id;
            var name = resource_obj.title;
            console.log($scope.resources[index]);
            console.log("Resource_Obj");
            console.log(resource_obj);
            $http.put('api/data/resources/click/' + id, resource_obj).success(function(response) {
            
            }).error(function(response) {

            });
            $scope.resources[index].clicks = $scope.resources[index].clicks + 1;
            console.log($scope.resources[index]);
            $window.open(link_url, '_blank');
        };

    }
]);


angular.module('core').controller('authController', ['$scope', '$state', '$location', 'Users', 'Authentication', '$http', 
    function($scope, $state, $location, Users, Authentication, $http) {
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
}]);

angular.module('core').controller('ProfileController', ['$scope', '$state', '$location', 'Users', 'Authentication', '$http', 'Subjects', 'Temp', 'plotly','Grades', 'ResourceClicks', 'Comments','multipartForm', 
    function($scope, $state, $location, Users, Authentication, $http, Subjects, Temp, plotly, Grades, ResourceClicks, Comments, multipartForm) {


       //Isabel- modal for resource request 
       $(document).ready(function(){
            $("#myBtn").click(function(){
                $("#myModal").modal();
            });
        });
		
		$scope.getComs = function() {
			

			$http.get('/api/leave_comment')
            .success(function(res) {
                console.log(res);
            });		
			
		}
		Comments.loadComments().then(function(response) {
            $scope.Comments = response.data;
        });




        $scope.authentication = Authentication;
        $scope.user = $scope.authentication.user;

        //checks to see if current user information and location
        // console.log("ProfileController");
        // console.log($scope.credentials);
        // console.log("User: " + $scope.user);

        $scope.oneAtATime = true;
        $scope.isTeacher = false;
        $scope.isAdmin = false;
        $scope.profileVisible = true;

        //checks if teacher
        if ($scope.authentication.user.profileType === "Teacher") {
            // console.log("I am a teacher");
            $scope.isTeacher = true;
        } else if ($scope.authentication.user.profileType === "Admin") {
            // console.log("I am an admin");
            $scope.isAdmin = true;
        }
		
        //input to put courseNames
        $scope.input = {};

        //courseNums array
        $scope.input.courseNums = [];
        $scope.input.courseNames = [];
        $scope.input.coursePeriods= [];


        Grades.loadGrades().then(function(response) {
            $scope.Grades = response.data;
        });


        ResourceClicks.loadClicks().then(function(response) {
            $scope.resources = response.data;
        });

        if($scope.authentication.user.profileType !== "Admin") {
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
        }

        //Isabel- how I actuall populate the classes shown
        $scope.input.coursesComplete = $scope.authentication.user.courses; 
      

        // credentials object
        $scope.credentials = {};
        $scope.credentials.courses = [];
        $scope.hello = 0;

       
        // array of class names
        $scope.classNames = [];
        $scope.Periods = [];
        $scope.classCodes = [];
        $scope.classQuiz=[];
        $scope.classPeriods = []

        //get course names
        var teachersCurrentClasses = $scope.authentication.user.courses;
        console.log(teachersCurrentClasses);
        for (var k= 0; k < teachersCurrentClasses.length; k++){
            var label = teachersCurrentClasses[k].courseName;
            // var label = teachersCurrentClasses[k].courseName +" "+  teachersCurrentClasses[k].section;
            $scope.classQuiz.push(label);
            $scope.classCodes.push(teachersCurrentClasses[k].number);
            // console.log(teachersCurrentClasses[k].courseName);
        }

        //get quiz names
        Subjects.loadSubjects().then(function(response) {
            $scope.subjects = response.data;

            // grab all the courses, and read their names.
            for (var i = 0; i < $scope.subjects.length; i++) {
                $scope.classNames.push($scope.subjects[i].name);
                //console.log("JHDKJAHSDKFJHA  " + $scope.subjects[i].name);
            }

            for (var j = 1; j < $scope.subjects.length; j++) {
                $scope.Periods.push("Period " + j);
                $scope.classPeriods.push("Period " + j);
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
                                "Forensics", 
                                "Other"];

        //Isabel- Upload New Profile Photo
        $scope.photos = {};
        $scope.Submit = function(){
            var uploadUrl = '/upload';
            multipartForm.post(uploadUrl, $scope.photos);
        }

        $scope.photoupdate = function(){
            console.log("PHOTO UPDATES");
            var x = document.getElementById("uploadPhoto").files[0];
            console.log(x);

            // var route = '/api/users/' + $scope.authentication.user._id;
            // $scope.authentication.user.profileImageURL = x;
            
            // $http.post(route, $scope.user).success(function(response) {

            //     $scope.authentication.user = response;


            // }).error(function(response) {
            //     console.log("Unable to POST.");
            //     // console.log(response);
            //     console.dir("RESPONSE: " + response);

            //     $scope.error = response.message;
            // });
        };

        //Isabel-change profile picture
        $scope.uploadFiles = function(file, errFiles) {
            // $scope.f = file;
            // $scope.errFile = errFiles && errFiles[0];
            // var data = {
            //     file: file
            // };
            // if (file) {
            //     file.upload = Upload.upload({
            //         url: '/question_upload',
            //         data: data
            //     });

            //     //Progress Bar
            //     file.upload.then(function(response) {
            //         $scope.numSave = response.data.numSaved;
            //         $scope.numDupe = response.data.numDuplicates;
            //         $scope.success = $scope.numSave > 0 || $scope.numDupe > 0;
            //         $scope.error = response.data.error;
            //         $scope.errorMsg = $scope.error ? response.data.errorMsg : null;
            //         console.log($scope.success);
            //         if ($scope.error){
            //             file.progress = 0;
            //             return;
            //         }
            //         $timeout(function() {
            //             file.result = response.config.data.file.progress;
            //         });
            //     }, function(response) {
            //         if (response.status > 0) {
            //             $scope.error = true;
            //             $scope.errorMsg = response.status + ': ' + response.data;
            //         }
            //     }, function(evt) {                    
            //         file.progress = Math.min(100, parseInt(100.0 *
            //             evt.loaded / evt.total));
            //         if (file.progress === 100 || file.progress === 100.00) {
            //             return;
            //         }
            //     });
            // }
        };

	
		//Isabel- add a course 
        $scope.add = function(course, period) {

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
                // console.log("new class " + courseObj.courseName);
            }


            $scope.authentication.user.courses.forEach(
                function(element, index, array) {
                    //$scope.authentication.user.courses.push(courseObj);
                    // console.log("current classes: " + element.courseName);
                });

            //to display on profile view
            $scope.input = {};
            //courseNums array
            $scope.input.courseNums = [];
            // for each course in their schema
            $scope.authentication.user.courses.forEach(
                function(element, index, array) {
                    //stores each course Name and number of the course that a teacher has
                    $scope.input.courseNums.push(element.courseName + " : " + element.number +" : "+  element.section);
                    //used for testing purposes to make sure a teacher has the correct courses
                    // console.log("input class: " + $scope.input.courseNums);
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
                // console.log("Unable to PUT.");
                console.dir(response);
                //sets error if invalid info
                //alert("Not updating.");

                $scope.error = response.message;
            });

            //reset what they see to empty
            $scope.toAdd = '';
        };

        //Isabel- teachers can update their settings
        $scope.settingsupdate = function(isValid) {

            // console.log("Changing Settings");
            $scope.error = null;

            // console.dir("scope: " + $scope);
            // console.log($scope.credentials.firstName);

            var route = '/api/users/' + $scope.authentication.user._id;

            //do if statements to allow users to not have to edit every single element and just pull from database what they did not change
            if ($scope.credentials.firstName !== undefined) {
                $scope.authentication.user.firstName = $scope.credentials.firstName;
            } else {
                // console.log("no first name");
            }


            if ($scope.credentials.lastName !== undefined) {
                $scope.authentication.user.lastName = $scope.credentials.lastName;
            } else {
                // console.log("no last name");
            }


            if ($scope.credentials.userName !== undefined) {
                $scope.authentication.user.userName = $scope.credentials.userName;
            } else {
                // console.log("no username");
            }

            if ($scope.credentials.email !== undefined) {
                $scope.authentication.user.email = $scope.credentials.email;
            } else {
                // console.log("no email");
            }


            if ($scope.credentials.password !== undefined) {
                $scope.authentication.user.password = $scope.credentials.password;
            } else {
                // console.log("no password");
            }


            $scope.authentication.user.displayName = $scope.authentication.user.lastName + ', ' + $scope.authentication.user.firstName;
           
            //check to make sure passwords match
            if( $scope.credentials.password == $scope.confirmpassword){
                // console.log("Passwords match");
                $http.post(route, $scope.user).success(function(response) {

                // If successful we assign the response to the global user model
                $scope.authentication.user = response;

                //redirect to the home page
                //$location.url('/');
                }).error(function(response) {
                    // console.log("Unable to POST.");
                    // console.log(response);
                    console.dir("response: " + response);
                    //sets error if invalid info
                    //alert("Not updating.");

                    $scope.error = response.message;
                });   
            }
            else{
                // console.log("Passwords do not match");
                //do not save, tell user to create matching passwords
                $("#settingsMoodal").modal();          
            }
        };

        //Isabel- update function
        $scope.update = function() {
            $scope.error = null;

            var user = $scope.user;
            console.log("user= " + user.email);
            user.$update(function() {
                console.log("home controller update");
                // $location.path('/teacher/' + user._id);
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };


        //Isabel- send email to Admin for request resource
        $scope.sendEmail = function(isValid){
            // console.log("sending email for resources");
            // console.log("Subject: " + $scope.resource.subject);
            // console.log("Subject Details: " + $scope.resource.subjectdetails);
            // console.log("Link: " + $scope.resource.resourcelink);
            // console.log("Comments: " + $scope.resource.comments);

            //information from the form 
            var data = ({

                subject: $scope.resource.subject,
                subheading: $scope.resource.subjectdetails,
                link: $scope.resource.resourcelink,
                comments: $scope.resource.comments,
                email: $scope.resource.email
            });

            //send the actual data
            var route = '/api/data/email';
            $http.post(route, data).success(function(req, res) {
                console.log("sending email");
            });
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
            $scope.test = "testing";
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


        

/*
<<<<<<< HEAD
        $scope.viewStats = function(course) {
            // Chart.js Stuff
            var ctx = $("#myChart").get(0).getContext("2d");
            // // This will get the first returned node in the jQuery collection.
            // var myNewChart = new Chart(ctx);
            var myBarChart = new Chart(ctx).Bar(data);
            var data = {
                labels: ["January", "February", "March", "April", "May", "June", "July"],
                datasets: [{
                    label: "My First dataset",
                    fillColor: "rgba(220,220,220,0.5)",
                    strokeColor: "rgba(220,220,220,0.8)",
                    highlightFill: "rgba(220,220,220,0.75)",
                    highlightStroke: "rgba(220,220,220,1)",
                    data: [65, 59, 80, 81, 56, 55, 40]
                }, {
                    label: "My Second dataset",
                    fillColor: "rgba(151,187,205,0.5)",
                    strokeColor: "rgba(151,187,205,0.8)",
                    highlightFill: "rgba(151,187,205,0.75)",
                    highlightStroke: "rgba(151,187,205,1)",
                    data: [28, 48, 40, 19, 86, 27, 90]
                }]
            };
*/
            
            //Plotly Stuff
            // console.log("Passing: "+ course);
            // var route = '/api/data/plotly';

            // // var params = ({
            // //     person: $scope.user, 
            // //     given: course 
            // // });

            // $http.get(route, {params:{"person": $scope.user, "given": course}}).success(function (req, res) {
            // // $http.get(route, params).success(function (req, res) {
            //     console.log("plotly go");
            // }); 


            // location.reload();
//=======

        //Isabel - bar graph
        $scope.viewStats = function(classname, code, quiz){
           
            // Plotly Stuff
            console.log("Passing: "+ classname);
            var route = '/api/data/plot';

            // var params = ({
            //     person: $scope.user, 
            //     quiz: quiz 

            // });

            $http.get(route, {params:{"person": $scope.user, "quiz": quiz, "classname": classname, "code": code}}).then(function(res) { 
                // your data
               //  console.log("ploting");
               //  console.log(res.data);
               // console.log(res.data.length);
                
                //get correct number of questions for X axis
                var label =[];
                for(var i = 0; i < res.data.length; i++){
                    var number = i+1;
                    label[i] = "Question " + number; 
                }

                // console.log(res);
                var ctx = $("#myChart").get(0).getContext("2d");
                // ctx.destroy();
                // ctx.canvas.width = 5;
                // ctx.canvas.height = 5;
                  var data = {
                    labels: label,
                    datasets: [
                        {
                            label: "Course Settings",
                            fillColor: "blue",
                            strokeColor: "rgba(220,220,220,0.8)",
                            // highlightFill: "rgba(220,220,220,0.75)",
                            // highlightStroke: "rgba(220,220,220,1)",
                            data: res.data
                        },
                    ]
                  };

                  var options = { 
                        responsive: false,
                        maintainAspectRatio: true,
                        barShowStroke : false
                    }

                  var myBarChart = new Chart(ctx).Bar(data,options);
                    }).then(function(error) {
                        console.log("Plot eror" + error);
                    });

            // if (parsedData.Item1 != "") {
            //     $("#nograpdata").show();
            // }

                  

            // Chart.defaults.global.responsive = true;

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
            

            //if so change all course arrays to empty
            if (dlog === 1 && mlog === 7 && hlog === 0 && milog === 0 && s === 0) {
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

        //Isabel - reset all the teachers code
        $scope.resetAllCodes = function() {
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

        $scope.exportToCSV = function() {
            var arrData = ["Saab", "Volvo", "BMW"];
                
                var CSV = '';    
                //Set Report title in first row or line
                
                CSV += "Statistics" + '\r\n\n';
                
                //This condition will generate the Label/Header
                
                //1st loop is to extract each row
                for (var i = 0; i < arrData.length; i++) {
                    var row = "";
                    
                    //2nd loop will extract each column and convert it in string comma-seprated
                    for (var index in arrData[i]) {
                        row += '"' + arrData[i][index] + '",';
                    }

                    row.slice(0, row.length - 1);
                    
                    //add a line break after each row
                    CSV += row + '\r\n';
                }
            
                if (CSV == '') {        
                    alert("Invalid data");
                    return;
                }   
                
                //Generate a file name
                var fileName = "Statistics";
                var ReportTitle = "Quiz Statistics";
                //this will remove the blank-spaces from the title and replace it with an underscore
                fileName += ReportTitle.replace(/ /g,"_");   
                
                //Initialize file format you want csv or xls
                var uri = 'data:text/csv;charset=utf-8,' + escape(CSV);
                
                // Now the little tricky part.
                // you can use either>> window.open(uri);
                // but this will not work in some browsers
                // or you will not get the correct file extension    
                
                //this trick will generate a temp <a /> tag
                var link = document.createElement("a");    
                link.href = uri;
                
                //set the visibility hidden so it will not effect on your web-layout
                link.style = "visibility:hidden";
                link.download = fileName + ".csv";
                
                //this part will append the anchor tag and remove it after automatic click
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
        };

    }
]);
