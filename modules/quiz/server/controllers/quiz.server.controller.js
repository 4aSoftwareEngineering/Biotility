'use strict';

/**
 * Module dependencies.
 */

var path = require('path'),
 appDir = path.dirname(require.main.filename),
    mongoose = require('mongoose'),
    QuizQuestion = mongoose.model('QuizQuestion'),
    StudentGrades = mongoose.model('StudentGrades'),
    User = mongoose.model('User'),
    xlsxj = require("xlsx-to-json"),
    errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));


/**
 * Create a quiz question
 */
exports.create = function(req, res) {

    var question = new QuizQuestion(req.body);

    question.save(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(question);
        }
    });
};

/*
Retrieve all of the questions by category in quiz_bank
*/
exports.retrieveQuestionsByCategory = function(req, res) {
    //Print all questions in DB.
    QuizQuestion.find({}, function(err, docs) {
        if (!err) {
            console.log(docs);
        } else {
            throw err;
        }
    });
    QuizQuestion.find({
        "category": req.query.category
    }).exec(function(err, questions) {
        console.log("retrieveQuestionsByCategory");
        console.dir(JSON.stringify(questions));
        return res.end(JSON.stringify(questions));
    });
};

exports.getGrades = function(req, res) {
    StudentGrades.find({}).lean().exec(function(err, grades) {
        return res.end(JSON.stringify(grades));
    });
};
/*
Inserts the quiz results to the Student profile
*/

exports.updateGrades = function(req, res) {
    var studentGrade = new StudentGrades(req.body);

    studentGrade.save(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(studentGrade);
        }
    });
};


exports.quizQuestionByID = function(req, res, next, id) {

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send({
            message: 'Quiz is invalid'
        });
    }

    QuizQuestion.findById(id).populate('user', 'displayName').exec(function(err, quiz) {
        if (err) {
            return next(err);
        } else if (!quiz) {
            return res.status(404).send({
                message: 'No article with that identifier has been found'
            });
        }
        req.article = quiz;
        next();
    });
};

exports.CSVtoJSON = function(req) {
    var data = req.body.data;
    xlsxj({
        input: appDir + "/uploads/Web App Uploader.xlsx",
        output: appDir + "/quizJSON/output.json"
    }, function(err, result) {
        if (err) {
            console.error("Error Parsing XLSX", err);
        }
    });
};
