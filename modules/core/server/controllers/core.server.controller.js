'use strict';

var mongoose = require('mongoose'),

    QuizQuestion = mongoose.model('QuizQuestion'),
    User = mongoose.model('User'),
    Subject = mongoose.model('Subject'),
    Resource = mongoose.model('Resource'),
    SubHead = mongoose.model('SubHead');
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
    Subject.find({}, function(err, subs) {
        return res.end(JSON.stringify(subs));
    });
};


//Retrieves all Resources from database
exports.parseResources = function(req, res) {

    Resource.find({}, function(err, subs) {
        return res.end(JSON.stringify(subs));
    });
};

//Retrieves all the SubHeadings from database
exports.parseSubHeads = function(req, res) {

    SubHead.find({}, function(err, subs) {
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

//Update a resource from the database
exports.updateResource = function(req, res) {
    var resource_to_update = req.resource;

    resource_to_update.title = req.body.title;
    resource_to_update.url = req.body.url;
    resource_to_update.subject = req.body.subject;


    resource_to_update.save(function(err) {
        if (err) {
            res.status(400).send(err);
        } else {
            res.json(resource_to_update);
        }
    });
};

//Server side mongoose functions for SubHeadings
exports.addSubHead = function(req, res) {
    var newSubHead = new SubHead(req.body);
    newSubHead.save(function(err) {
        if (err) {
            console.log(err);
            res.status(400).send(err);
        } else {
            res.json(newSubHead);
        }
    });
};
exports.deleteSubHead = function(req, res) {
    var subHead_to_delete = req.subHead;
    subHead_to_delete.remove(function(err) {
        if (err) {
            res.status(400).send(err);
        } else {
            res.end();
        }
    });
};
exports.updateSubHead = function(req, res) {
    var subHead_to_update = req.subHead;

    subHead_to_update.title = req.body.title;
    subHead_to_update.subject = req.body.subject;


    subHead_to_update.save(function(err) {
        if (err) {
            res.status(400).send(err);
        } else {
            res.json(subHead_to_update);
        }
    });
};

// Retrieve user data, send as response.
exports.parseUsers = function(req, res) {
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

//middleware for resources
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

//middleware for subheadings
exports.subHeadByID = function(req, res, next, id) {
    SubHead.findById(id).exec(function(err, subHead) {
        if (err) {
            res.status(400).send(err);
        } else {
            req.subHead = subHead;
            next();
        }
    });
};
