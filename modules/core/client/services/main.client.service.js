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

angular.module('core').service('NavCrumbs', [
  function() {
    this.breadcrumb = [{
      name: "Home",
      url: "/"
    }];
  }
]);
