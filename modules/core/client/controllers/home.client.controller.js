'use strict';

/** SEE core.server.routes.js  */

angular.module('core').controller('MainController', ['$scope', '$state', '$location', 'Authentication', 'Subjects',
  function($scope, $state, $location, Authentication, Subjects) {
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

angular.module('core').controller('SubjectController', ['$scope', '$state', '$location', 'Authentication', '$stateParams',
  function($scope, $state, $location, Authentication, $stateParams) {
    // This provides Authentication context.
    $scope.authentication = Authentication;

    $scope.subject = $stateParams.courseName;

    $scope.startQuiz = function() {
      $location.path('/' + $scope.subject + '/quiz');
    };

  }
]);

angular.module('core').controller('ProfileController', ['$scope', '$state', '$location', 'Authentication', '$http', 'Subjects', 
  function($scope, $state, $location, Authentication, $http, Subjects) {

    $scope.authentication = Authentication;
    $scope.user = $scope.authentication.user;
    //console.log("ProfileController");
    //console.log($scope.user);

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
          console.log("JHDKJAHSDKFJHA  " + $scope.subjects[i].name);
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

    $scope.classupdates = function(){
      console.log("ADDED A NEW CLASS");
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
        console.log("quiz result: ", res);
        byStudent(res);
      });
    //gets student  grades by student and stores them
    var byStudent = function(allStudentGrades) {
      for (var i = 0; i < allStudentGrades.length; i++) {
        console.log(allStudentGrades[i].studentName);
        console.log($scope.user.userName);
        console.log("BANG: " + allStudentGrades[i].studentName + " " + $scope.user.userName);
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

  }
]);
