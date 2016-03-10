'use strict';

//controler for teacher page list retrieval of students
angular.module('users').controller('StudentListController', ['$rootScope', '$scope', '$state', '$location', '$filter', '$http', 'Authentication',
    function($rootScope, $scope, $state, $location, $filter, $http, Authentication) {
        $scope.$state = $state;
        $scope.authentication = Authentication;
        // $scope.section = null;
        $scope.user = "";
        $scope.email = "";
        $scope.firstname = "";
        $scope.lastname = "";
        $scope.check = "hello";

        $scope.input = {};
        $scope.input.courseNums = [];
        $scope.authentication.user.courses.forEach(
            function(element, index, array) {
                $scope.input.courseNums.push(element.number);
            }
        );

        $http.post('/api/data/students', $scope.input)
            .then(function(response) {
                $scope.data = response.data;
                console.log(response);
            });

        //gets the name from the param list
        $scope.getName = function(disName) {
            $scope.user = disName.userName;
            $scope.email = disName.email;
            $scope.firstname = disName.firstName;
            $scope.lastname = disName.lastName;
            console.log("hello");
            console.log($scope.user);
        };
    }
]);
//controller for the student teacher page
angular.module('users').controller('StudentGetController', ['$rootScope', '$scope', '$state', '$stateParams', '$location', '$filter', '$http', 'Authentication',
    function($rootScope, $scope, $state, $stateParams, $location, $filter, $http, Authentication) {

        $scope.authentication = Authentication;
        // $scope.section = null;
        //testing
        console.log("in state params:");
        //testing
        console.log($stateParams.username);
        //pass to scope
        $scope.userFinal = $stateParams.username;
        $scope.emailFinal = $stateParams.email;
        $scope.firstnameFinal = $stateParams.firstname;
        $scope.lastnameFinal = $stateParams.lastname;

        //testing
        console.log("Second controller");
        console.log($scope.userFinal);
        console.log($scope.email);
        console.log($scope.firstname);
        console.log($scope.lastname);
    }
]);
