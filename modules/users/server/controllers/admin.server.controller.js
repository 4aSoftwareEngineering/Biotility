'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Show the current user
 */
exports.read = function(req, res) {
    res.json(req.model);
};

/**
 * Update a User
 */
exports.update = function(req, res) {
    var user = req.user;
    //For security purposes only merge these parameters
    // user.firstName = req.body;
    user.lastName = user.lastName;
    user.displayName = user.firstName + ' ' + user.lastName;
    user.courses = req.body;
    user.courseCode = req.body; //actual update
    // user.courses = user.courses; //used for testing form
    user.roles = user.roles;
    user.save(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        }

        res.json(user);
    });
};

exports.updates = function(req, res) {
    var user = req.user;
    
    //For security purposes only merge these parameters
   
    user.firstName = req.body.firstName;
    user.lastName = req.body.lastName;
    user.email = req.body.email;
    user.userName = req.body.userName;
    user.password = req.body.password;
    user.displayName = req.body.displayName;
    user.save(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        }

        res.json(user);
    });
};

exports.course = function(req, res) {
    var users = User;

        User.find({}, function(err,users){
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        }
         for (var i = 0; i < users.length; i++) {        
            users[i].courses = [];
            users[i].save(function(err) {
                if (err) {
                }
            });
        }
        res.json(users);
    });
};



/**
 * Delete a user
 */
exports.delete = function(req, res) {
    var user = req.model;

    user.remove(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        }

        res.json(user);
    });
};

/**
 * List of Users
 */
exports.list = function(req, res) {
    User.find({}, '-salt -password').sort('-created').populate('user', 'displayName').exec(function(err, users) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        }

        res.json(users);
    });
};

/**
 * User middleware
 */
exports.userByID = function(req, res, next, id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send({
            message: 'User is invalid'
        });
    }

    User.findById(id, '-salt -password').exec(function(err, user) {
        if (err) {
            return next(err);
        } else if (!user) {
            return next(new Error('Failed to load user ' + id));
        }

        req.model = user;
        next();
    });
};