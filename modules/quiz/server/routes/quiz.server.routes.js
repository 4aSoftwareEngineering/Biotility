'use strict';

/**
 * Module dependencies.
 */
var quiz = require('../controllers/quiz.server.controller');
//var user = require('/user/server/controllers/users.authentication.server.controller');

module.exports = function(app) {
    // Articles collection routes
    app.route('/api/quiz')
        .post(quiz.create);

    app.route('/question_upload').post(quiz.CSVtoJSON);
    
    app.route('/api/quiz/')
        .get(quiz.retrieveQuestionsByCategory);

    app.route('/api/quiz_result')
        .get(quiz.getGrades)
        .post(quiz.updateGrades);

    app.param('quizID', quiz.quizQuestionByID);
};
