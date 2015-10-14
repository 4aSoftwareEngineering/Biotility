'use strict';

/**
 * Module dependencies.
 */
var config = require('../config'),
    chalk = require('chalk'),
    path = require('path'),
    mongoose = require('mongoose'),
    Schema = mongoose.Schema;

// Load the mongoose models
module.exports.loadModels = function() {
    // Globbing model files
    config.files.server.models.forEach(function(modelPath) {
        require(path.resolve(modelPath));
    });
};

// Manually defining the schemas like a normal human being.

// Student Schema
var studentSchema = new Schema({
    firstname: {type: String, required: 'Please enter your first name.'},
    lastname: {type: String, required: 'Please enter your last name.'},
    email: {type: String, required: 'Please enter your email address.', set: toLower, unique: true},
    coursesTakingIds: [Number]
});

// Instructor/Teacher Schema
var teacherSchema = new Schema({
    firstname: {type: String, required: 'Please enter your first name.'},
    lastname: {type: String, required: 'Please enter your last name.'},
    email: {type: String, required: 'Please enter your email address.', set: toLower, unique: true},
    coursesTeachingIds: [Number]
});

// Subject Schema
var subjectSchema = new Schema({
    name: {type : String, required: true},
    id: {type: Number, required: true},
    description: {type: String}
});

// Question Schema
var questionSchema = new Schema({
    description: {type : String, required: true},
    type: {type: String, required: true},
    answerDesc1: {type: String, required: true},
    answerDesc2: {type: String, required: true},
    answerDesc3: {type: String},
    answerDesc4: {type: String},
    correctAnswer: {type: String, required: true}
});

module.exports.Student = mongoose.model('Student', studentSchema);
module.exports.Subject = mongoose.model('Subject', subjectSchema);
module.exports.Teacher = mongoose.model('Teacher', teacherSchema);
module.exports.Question = mongoose.model('Question', questionSchema);


function toLower(email) {
  return email.toLowerCase();
}


// Initialize Mongoose
module.exports.connect = function(cb) {
    var _this = this;

    var db = mongoose.connect(config.db.uri, config.db.options, function(err) {
        // Log Error
        if (err) {
            console.error(chalk.red('Could not connect to MongoDB!'));
            console.log(err);
        } else {

            // Enabling mongoose debug mode if required
            mongoose.set('debug', config.db.debug);

            // Call callback FN
            if (cb) cb(db);
        }
    });
};



module.exports.disconnect = function(cb) {
    mongoose.disconnect(function(err) {
        console.info(chalk.yellow('Disconnected from MongoDB.'));
        cb(err);
    });
};
