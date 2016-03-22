'use strict';

module.exports = function(app) {
    // Root routing
    var core = require('../controllers/core.server.controller');
    var users = require('../controllers/core.server.controller');
    // Define error pages

    //app.route('/authentication').post(core.sendMail);

    app.route('/contact-form').post(core.sendMail);


    app.route('/server-error').get(core.renderServerError);

    // Fetch subject data from database
    app.route('/api/parse/subjects').get(core.parseSubjects);

    // Fetch student data from database
    app.route('/api/data/students').post(core.findStudents);


    // Fetch user data from database
    app.route('/api/data/users/:userId')
        .get(core.parseUsers)
        .put(core.update);

    //Eric's Work
    app.route('/api/parse/resources').get(core.parseResources);

    app.route('/api/data/resources').post(core.addResource);
    app.route('/api/data/resources/:resourceId').delete(core.deleteResource);

    // Fetch student data from database
    app.route('/api/data/students').post(core.findStudents);


    // Fetch question data from database
    app.route('/api/data/questions').get(core.parseQuestions);

    //app.route('api/users/:userId').put(core.update);

    // Return a 404 for all undefined api, module or lib routes
    // GOES AFTER ALL API CALLS ^^^^
    app.route('/:url(api|modules|lib)/*').get(core.renderNotFound);



    app.param('@id', core.userByID);



    // Define application route
    app.route('/*').get(core.renderIndex);
    app.param('resourceId', core.resourceByID);



};
