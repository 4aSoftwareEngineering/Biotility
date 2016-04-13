'use strict';

/**
 * Module dependencies.
 */
var quiz = require('../controllers/quiz.server.controller');
//var user = require('/user/server/controllers/users.authentication.server.controller');

module.exports = function(app) {
    // Articles collection routes


    app.route('/question_upload')
        .post(quiz.CSVtoJSON);
    
    app.route('/api/quiz/')
        .get(quiz.retrieveQuestionsByCategory);

    app.route('/api/quiz_result')
        .get(quiz.getGrades)
        .post(quiz.updateGrades);
	
	app.route('/api/leave_comment')
		.post(quiz.uploadComments);
	
    app.param('quizID', quiz.quizQuestionByID);
};
