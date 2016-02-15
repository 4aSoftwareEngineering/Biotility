'use strict';

var mongoose = require('mongoose'),
  QuizQuestion = mongoose.model('QuizQuestion'),
  User = mongoose.model('User'),
  Subject = mongoose.model('Subject');

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
  User.find({'profileType' : 'Student', 'courseCode' : {$in: req.body.courseNums} }).lean().exec(function(err, users) {
    return res.end(JSON.stringify(users));
  });
};
