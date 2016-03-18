'use strict';

// Users service used for communicating with the users REST endpoint
angular.module('users').factory('Users', ['$resource',
  function ($resource) {
    return $resource('api/users', {}, {
      update: {
        method: 'PUT'
      },
      parseUsers:{
        method: 'GET' , 
        isArray: true
      }
    });
  }
]);

angular.module('users').factory('Temps', ['$resource',
  function ($resource) {
    return $resource('api/users', {}, {
      update: {
        method: 'PUT'
      },
      parseUsers:{
        method: 'GET' , 
        isArray: true
      }
    });
  }
]);

angular.module('core').factory('Users', ['$http', function($http) {

  this.parseUsers = function() {
        return $http.get('/app/parse/users/').then(
            
            function() {
              console.log('Error checking server.');
            }
        );
    };

}]);

//TODO this should be Users service
angular.module('users.admin').factory('Admin', ['$resource',
  function ($resource) {
    return $resource('api/users/:userId', {
      userId: '_id'
    }, {
      update: {
        method: 'PUT'
      },
      parseUsers:{
        method: 'GET' , 
        isArray: true
      }

    });
  }
]);
