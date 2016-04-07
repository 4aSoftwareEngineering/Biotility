'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
  mongoose = require('mongoose'),
  User = mongoose.model('User');

/**
 * User middleware
 */
exports.userByID = function (req, res, next, id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'User is invalid'
    });
  }

  User.findOne({
    _id: id
  }).exec(function (err, user) {
    if (err) {
      return next(err);
    } else if (!user) {
      return next(new Error('Failed to load User ' + id));
    }

    req.profile = user;
    next();
  });
};

// Retrieve subject data, send as response.
exports.parseTeachers = function(req, res) {

    User.find({}, function(err, docs) {

        if (!err) {
            console.log(docs);
        } else {
            throw err;
        }
    });
    User.find({}, function(err, subs) {
        return res.end(JSON.stringify(subs));
    });
};