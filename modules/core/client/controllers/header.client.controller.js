'use strict';

angular.module('core').controller('HeaderController', ['$scope', '$state', '$location', 'Authentication', 'NavCrumbs',
    function($scope, $state, $location, Authentication, NavCrumbs) {
        // Expose view variables
        $scope.$state = $state;
        $scope.authentication = Authentication;

        // Array of page changes for breadcrumb recall
        $scope.breadcrumb = NavCrumbs.breadcrumb;

        // On breadcrumb clicked
        $scope.click = function(crumb) {
            $location.url(crumb.url);
        };

        // Go to profile
        $scope.profile = function() {

            // routing depending on profile type
            if ($scope.authentication.IsTeacher) {
                $location.url('/teacher/' + $scope.authentication.user.userName);
            } else {
                $location.url('/student/' + $scope.authentication.user.userName);

            }
        };

        //check if drop down menu should appear
        $scope.shouldRender = function(user)
        {
            if(user.IsTeacher){
                return true;
            }
            else{
                return false;
            }
            
        };



        // logout: set current auth user to null
        $scope.logout = function() {
            $scope.authentication.user = null;
            $location.url('/');
        };

    }
]);
