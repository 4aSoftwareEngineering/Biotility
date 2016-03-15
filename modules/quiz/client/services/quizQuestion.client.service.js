'use strict';


//Articles service used for communicating with the articles REST endpoints
angular.module('quiz').factory('QuizQuestion', ['$resource',
    function($resource) {
    	console.log("quiz factory");
        return $resource('api/quiz/', {}, {
            getQuestions: {
                method: 'GET',
                url: '/api/quiz',
                isArray: true,
            }
        });
    }
]);
