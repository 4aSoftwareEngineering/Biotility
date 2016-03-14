
'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash');

var mongoose = require('mongoose'),

    QuizQuestion = mongoose.model('QuizQuestion'),
    User = mongoose.model('User'),
    Subject = mongoose.model('Subject'),
    Resource = mongoose.model('Resource');

/**
 * Extend user's controller
 */
module.exports = _.extend(
  require('./users/users.authentication.server.controller'),
  require('./users/users.authorization.server.controller'),
  require('./users/users.password.server.controller'),
  require('./users/users.profile.server.controller')
);

// // // Retrieve subject data, send as response.
// exports.parseTeachers = function(req, res) {

//     User.find({}, function(err, docs) {

//         if (!err) {
//             console.log(docs);
//         } else {
//             throw err;
//         }
//     });
//     User.find({}, function(err, subs) {
//         return res.end(JSON.stringify(subs));
//     });
// };
