'use strict';

module.exports = function(app) {

    // Root routing
    var core = require('../controllers/core.server.controller');
    var users = require('../controllers/core.server.controller');

    // var plotly = require('plotly')("biotilitysp18","tmplea9qm7");
    var schedule = require('node-schedule');
    var Email = require('email').Email;

    //Matt
    //Change user photos
    app.route('/photo_upload')
        .post(users.photoUpload);

    // Define error pages
    app.route('/server-error').get(core.renderServerError);

    // Fetch subject data from database
    app.route('/api/parse/subjects').get(core.parseSubjects);

    // Fetch student data from database
    app.route('/api/data/students').post(core.findStudents);

    // Fetch user data from database
    app.route('/api/data/users/:userId').put(core.update);
    app.route('/api/parse/user').get(core.parseUsers);

    //Eric's Routes for Resources
    app.route('/api/parse/resources').get(core.parseResources);
    app.route('/api/data/resources').post(core.addResource);
    app.route('/api/data/resources/:resourceId').delete(core.deleteResource);
    app.route('/api/data/resources/:resourceId').put(core.updateResource);
    app.route('/api/data/resources/click/:resourceId').put(core.clickResource);

    //Eric's Routes for subheadings
    app.route('/api/parse/subheads').get(core.parseSubHeads);
    app.route('/api/data/subheads').post(core.addSubHead);
    app.route('/api/data/subheads/:subHeadId').delete(core.deleteSubHead);
    app.route('/api/data/subheads/:subHeadId').put(core.updateSubHead);

    //Eric's Routes for Admin Page Charts
    app.route('/api/data/resources/clicks').get(core.parseClicks);
    app.route('/api/data/adminGrades').get(core.getGradesForAdmin);

    // Fetch student data from database
    app.route('/api/data/students').post(core.findStudents);

    //Isabel's Work Sprint2/Sprint3
    app.route('/api/data/plot').get(core.plot);
    app.route('/api/data/email').post(core.email);

    //for the comments
    app.route('/api/get_Comments')
        .get(core.getComments);

    app.route('/api/data/adminGrades').get(core.getGradesForAdmin);


    app.route('/api/data/emailV').post(core.sendMail);

    // Routes for question data from database -RB
    app.route('/api/data/questions').get(core.parseQuestions);
    app.route('/api/data/questions').post(core.addQuestion);
    app.route('/api/data/questions/:questionId').put(core.updateQuestion);
    app.route('/api/data/questions/:questionId').delete(core.deleteQuestion);
    app.route('/api/data/questions/:questionId').get(core.readQuestion);

    //app.route('api/users/:userId').put(core.update);

    // Return a 404 for all undefined api, module or lib routes
    // GOES AFTER ALL API CALLS ^^^^
    app.route('/:url(api|modules|lib)/*').get(core.renderNotFound);

    app.param('@id', core.userByID);
    app.param('resourceId', core.resourceByID);
    app.param('subHeadId', core.subHeadByID);
    app.param('questionId', core.questionByID);

    // Define application route
    app.route('/*').get(core.renderIndex);
};
