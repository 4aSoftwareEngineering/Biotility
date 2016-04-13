'use strict';

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider',
  function($stateProvider, $urlRouterProvider) {
    // Redirect to 404 when route not found
    $urlRouterProvider.otherwise(function($injector, $location) {
      $injector.get('$state').transitionTo('not-found', null, {
        location: false
      });
    });
    // Home state routing
    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: 'modules/core/client/views/home.client.view.html'
      })
      .state('quiz', {
        url: '/{courseName:.+}/quiz',
        templateUrl: 'modules/quiz/client/views/quizTemplate.client.view.html'
      })
      .state('quiz.results', {
        url: '/results',
        templateUrl: 'modules/quiz/client/views/quizResults.client.view.html',
        params: {
          correctScore: null,
          numQuestion: null,
          category: null,
        }
      })
      .state('resources', {
        url: '/{courseName:.+}/resources',
        templateUrl: 'modules/core/client/views/resources.client.view.html'
      })
      .state('question_upload', {
        url: '/admin/question_upload',
        templateUrl: 'modules/quiz/client/views/quizUpload.client.view.html'
      })
      .state('question_edit', {
        url: '/admin/question_edit',
        templateUrl: 'modules/core/client/views/data.questions.client.view.html'
      })
      .state('question_view', {
        url: '/admin/question_edit/:questionId',
        templateUrl: '/modules/core/client/views/view-question.client.view.html'
      })
      .state('question_create', {
        url: '/admin/question_edit/new',
        templateUrl: '/modules/core/client/views/create-question.client.view.html'
      })
      .state('studentprofile', {
        url: '/student/{userName:.+}',
        templateUrl: 'modules/core/client/views/profile.client.view.html'
      })
      .state('teacherprofile', {
        url: '/teacher/{userName:.+}',
        templateUrl: 'modules/core/client/views/teacherprofile.client.view.html'
      })
      .state('adminprofile', {
        url: '/admin/{userName:.+}',
        templateUrl: 'modules/core/client/views/adminprofile.client.view.html'
      })
      .state('userData', {
        url: '/data/users',
        templateUrl: 'modules/core/client/views/data.users.client.view.html'
      })
      // .state('questionData', {
      //   url: '/data/questions',
      //   templateUrl: 'modules/core/client/views/data.questions.client.view.html'
      // })
      .state('about', {
        url: '/about',
        templateUrl: 'modules/core/client/views/about.client.view.html'
      })
      .state('contact', {
        url: '/contact',
        templateUrl: 'modules/core/client/views/contact.client.view.html'
      })
      .state('bad-request', {
        url: '/bad-request',
        templateUrl: 'modules/core/client/views/400.client.view.html',
        data: {
          ignoreState: true
        }
      })
      .state('not-found', {
        url: '/not-found',
        templateUrl: 'modules/core/client/views/404.client.view.html',
        data: {
          ignoreState: true
        }
      })
      .state('forbidden', {
        url: '/forbidden',
        templateUrl: 'modules/core/client/views/403.client.view.html',
        data: {
          ignoreState: true
        }
      });
  }
]);
