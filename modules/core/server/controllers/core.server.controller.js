'use strict';


var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport();
var mongoose = require('mongoose'),

    QuizQuestion = mongoose.model('QuizQuestion'),
    User = mongoose.model('User'),
    Subject = mongoose.model('Subject'),
    Resource = mongoose.model('Resource');
/**
 * Render the main application page
 */
exports.renderIndex = function(req, res) {
    res.render('modules/core/server/views/index', {
        user: req.user || null
    });
};

/**
 * Render the server error page
 */
exports.renderServerError = function(req, res) {
    res.status(500).render('modules/core/server/views/500', {
        error: 'Oops! Something went wrong...'
    });
};

exports.signup = function(req, res){
    var data = req.body;
    if(data.credentials.profileType === "Student2") {
        transporter.signup({
            from: 'biotility-donot-reply@biotility.com',
            to: data.credentials.email,
            subject: 'Biotility: Course Code',
            text: 'Your course code is 1234'
        });
    }
};



/**
 * Render the server not found responses
 * Performs content-negotiation on the Accept HTTP header
 */
exports.renderNotFound = function(req, res) {

    res.status(404).format({
        'text/html': function() {
            res.render('modules/core/server/views/404', {
                url: req.originalUrl
            });
        },
        'application/json': function() {
            res.json({
                error: 'Path not found'
            });
        },
        'default': function() {
            res.send('Path not found');
        }
    });
};

// Retrieve subject data, send as response.
exports.parseSubjects = function(req, res) {

    Subject.find({}, function(err, docs) {

        if (!err) {
            console.log(docs);
        } else {
            throw err;
        }
    });
    Subject.find({}, function(err, subs) {
        return res.end(JSON.stringify(subs));
    });
};


//retrives all Resources from database
exports.parseResources = function(req, res) {

    Resource.find({}, function(err, subs) {
        return res.end(JSON.stringify(subs));
    });
};

//Creates a new resource for the database
exports.addResource = function(req, res) {
    var newResource = new Resource(req.body);
    newResource.save(function(err) {
        if (err) {
            console.log(err);
            res.status(400).send(err);
        } else {
            res.json(newResource);
        }
    });
};

//Deletes a resource from the database
exports.deleteResource = function(req, res) {
    var resource_to_delete = req.resource;
    resource_to_delete.remove(function(err) {
        if (err) {
            res.status(400).send(err);
        } else {
            res.end();
        }
    });
};


// Retrieve user data, send as response.
exports.parseUsers = function(req, res) {
    User.find({}, function(err, docs) {
        if (!err) {
            console.log(docs);
        } else {
            throw err;
        }
    });
    User.find({}).lean().exec(function(err, users) {
        return res.end(JSON.stringify(users));
    });
};

// Retrieve question data, send as response.
exports.parseQuestions = function(req, res) {
    QuizQuestion.find({}, function(err, docs) {
        if (!err) {
            console.log(docs);
        } else {
            throw err;
        }
    });
    QuizQuestion.find({}).lean().exec(function(err, users) {
        return res.end(JSON.stringify(users));
    });
};

// Find student data
exports.findStudents = function(req, res) {
    User.find({ 'profileType': 'Student', 'courseCode': { $in: req.body.courseNums } }).lean().exec(function(err, users) {
        return res.end(JSON.stringify(users));
    });
};

exports.update = function(req, res) {
    console.log("UPDATES");
    var User = req.User;

    User.courses = req.body.courses;


    User.save(function(err) {
        if (err) {
            console.log("NOOOOO");
            return res.status(400).send({
                message: err
            });
        } else {
            res.json(req.User);
        }
    });
};

exports.userByID = function(req, res, next, id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send({
            message: 'No user'
        });
    }

    User.findOne({
        _id: id
    }).exec(function(err, user) {
        if (err) {
            return next(err);
        } else if (!user) {
            return next(new Error('Failed to load User ' + id));
        }

        req.profile = user;
        next();
    });
};

exports.tester = function(req, res) {
    console.log("TESTER");
    User.find({ 'profileType': 'Student', 'courseCode': { $in: req.body.courseNums } }).lean().exec(function(err, users) {
        return res.end(JSON.stringify(users));
    });
};

//middleware to delete resources
exports.resourceByID = function(req, res, next, id) {
    Resource.findById(id).exec(function(err, resource) {
        if (err) {
            res.status(400).send(err);
        } else {
            req.resource = resource;
            next();
        }
    });
};
