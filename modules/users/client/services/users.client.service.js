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

//TODO this should be Users service
angular.module('users.admin').factory('Admin', ['$resource',
  function ($resource) {
    return $resource('api/users/:userId', {
      userId: '_id'
    }, {
      update: {
        method: 'PUT'
      }

    });
  }
]);
