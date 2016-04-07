'use strict';

module.exports = function(app) {

    // Root routing
    var core = require('../controllers/core.server.controller');
    var users = require('../controllers/core.server.controller');

    var plotly = require('plotly')("biotilitysp18","tmplea9qm7");
    var schedule = require('node-schedule');
    var Email = require('email').Email;
    var CronJob = require('cron').CronJob;

    // Define error pages
    app.route('/server-error').get(core.renderServerError);

    // Fetch subject data from database
    app.route('/api/parse/subjects').get(core.parseSubjects);

    // Fetch student data from database
    app.route('/api/data/students').post(core.findStudents);


    // Fetch user data from database

    app.route('/api/data/users/:userId').put(core.update);

    app.route('/api/parse/user').get(core.parseUsers);
    //Eric's Work

    app.route('/api/parse/resources').get(core.parseResources);
    app.route('/api/data/resources').post(core.addResource);
    app.route('/api/data/resources/:resourceId').delete(core.deleteResource);
    app.route('/api/data/resources/:resourceId').put(core.updateResource);

    //Routes for subheadings
    app.route('/api/parse/subheads').get(core.parseSubHeads);
    app.route('/api/data/subheads').post(core.addSubHead);
    app.route('/api/data/subheads/:subHeadId').delete(core.deleteSubHead);
    app.route('/api/data/subheads/:subHeadId').put(core.updateSubHead);

    // Fetch student data from database
    app.route('/api/data/students').post(core.findStudents);


    //Isabel's Work Sprint2
    app.route('/api/data/plotly').get(core.plot);
    app.route('/api/data/email').post(core.email);
    app.route('/ap/data/cron').get(core.cron);


    // Fetch question data from database
    app.route('/api/data/questions').get(core.parseQuestions);

    //app.route('api/users/:userId').put(core.update);

    // Return a 404 for all undefined api, module or lib routes
    // GOES AFTER ALL API CALLS ^^^^
    app.route('/:url(api|modules|lib)/*').get(core.renderNotFound);


    app.param('@id', core.userByID);
    app.param('resourceId', core.resourceByID);
    app.param('subHeadId', core.subHeadByID);

    // Define application route
    app.route('/*').get(core.renderIndex);
};
