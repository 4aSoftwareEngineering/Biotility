'use strict';

module.exports = function (app) {
  // Root routing
  var core = require('../controllers/core.server.controller');

  // Define error pages
  app.route('/server-error').get(core.renderServerError);

  // Return a 404 for all undefined api, module or lib routes
  app.route('/:url(api|modules|lib)/*').get(core.renderNotFound);

  // Fetch question data from database
  app.route('/api/question-data/:subject-name').get(core.getQuestionData);

  // Fetch student data from database
  app.route('/api/data/students').get(core.getStudentData);

  // Fetch teacher data from database
  app.route('/api/data/teachers').get(core.getTeacherData);

  // Define application route
  app.route('/*').get(core.renderIndex);
};
