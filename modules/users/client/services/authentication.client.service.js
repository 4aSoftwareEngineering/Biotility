'use strict';

// Authentication service for user variables
angular.module('users').factory('Authentication', ['$window',
  function ($window) {
    var auth = {
      user: $window.user
    };

    return auth;
  }
]);

//passes in function to load teachers from database
angular.module('core').service('Teachers', ['$http', function($http) {

  return {
    loadTeachers: function() {
      return $http({
        method: 'GET',
        url: '/api/auth/signup'
      });
    }
  };

}]);