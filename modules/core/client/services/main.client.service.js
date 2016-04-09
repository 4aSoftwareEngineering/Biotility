'use strict';

// Main service for holding persistent data
angular.module('core').service('Subjects',  ['$http', function($http) {

  // Array for question objects we have for the selected subject.
  this.questionsForSubject = [{}];

  // Load questions of a subject into the questions array.
  this.loadQuestions = function() {
    $http({
      method: 'GET',
      url: '/api/question-data/' // ADD subject name var
    }).success(function(res) {

    });
  };

  // A subject was clicked, time to parse the question data we need,
  // while the user is taken to the pre-quiz page.
  this.subjectClicked = function(subject) {
    var subjectName = this.getSubjectByName(subject);
    this.questionsForSubject = this.loadQuestions();
  };

  // Return a subject whose name is equal to the given name.
  this.getSubjectByName = function(subjectName) {

    this.subjects.forEach(function(elem, index, array) {
      if (elem.name === subjectName)
        return elem;
    });

    return null;
  };

  return {
    loadSubjects: function() {
      return $http({
        method: 'GET',
        url: '/api/parse/subjects'
      });
    }
  };

}]);

//passes in function to load resources from database
angular.module('core').service('Resources', ['$http', function($http) {

  return {
    loadResources: function() {
      return $http({
        method: 'GET',
        url: '/api/parse/resources'
      });
    }
  };

}]);

//passes in function to load subheadings from database
angular.module('core').service('SubHeads', ['$http', function($http) {

  return {
    loadSubHeads: function() {
      return $http({
        method: 'GET',
        url: '/api/parse/subheads'
      });
    }
  };

}]);

angular.module('core').service('Grades', ['$http', function($http) {

  return {
    loadGrades: function() {
      return $http({
        method: 'GET',
        url: '/api/data/adminGrades'
      });
    }
  };

}]);


angular.module('core').service('Temp', ['$http', function($http) {

  return {
    parseUsers: function() {
      return $http({
        method: 'GET',
        url: '/api/parse/user'
      });
    }
  };

}]);

angular.module('core').service('plotly', ['$http', function($http) {

}]);


angular.module('core').service('NavCrumbs', [
  function() {
    this.breadcrumb = [{
      name: "Home",
      url: "/"
    }];
  }
]);
