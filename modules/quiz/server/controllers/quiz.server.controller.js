'use strict';

/**
 * Module dependencies.
 */

var path = require('path'),
    fs = require('fs'),
    appDir = path.dirname(require.main.filename),
    mongoose = require('mongoose'),
    QuizQuestion = mongoose.model('QuizQuestion'),
    questionBank = [],
    StudentGrades = mongoose.model('StudentGrades'),
    User = mongoose.model('User'),
    xlsxj = require("xlsx-to-json"),
    _ = require("underscore"),
    errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/*
Retrieve all of the questions by category in quiz_bank
*/
exports.retrieveQuestionsByCategory = function(req, res) {
    //Print all questions in DB.
    QuizQuestion.find({
        "category": req.query.category
    }).exec(function(err, questions) {
        console.log("retrieveQuestionsByCategory");
        //console.dir(JSON.stringify(questions));
        return res.end(JSON.stringify(questions));
    });
};

function questionExists(question) {
    var isMatch = false;
    if (!questionBank.length) {
        return isMatch;
    }
    _.find(questionBank, function(item) {
        isMatch = item.text === question.text && item.link === question.link && item.hint === question.hint;
        if (isMatch) return true;
    });
    return isMatch;
}

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

exports.CSVtoJSON = function(req, res) {
    var file = req.files.file;
    var appDir = path.dirname(require.main.filename);
    var newPath = appDir + "/uploads/" + file.originalname;
    var data = file.buffer;
    fs.writeFile(newPath, data, function(err) {
        if (err)
            console.log("Error uploading XLSX.");
        else {
            console.log(file.originalname + " successfully transferred.");
            xlsxj({
                input: newPath,
                output: "./temp/output.json"
            }, function(err, data) {
                if (err) {
                    console.error("Error Parsing XLSX", err);
                } else {
                    console.log("Successfully parsed XLSX.");
                    uploadQuizQuestions(data);
                }
            });
        }
    });
};

function uploadQuizQuestions(result, res) {
    console.log("Uploading quiz questions...");
    QuizQuestion.find({}).exec(function(err, questions) {
        if (!err) {
            questionBank = questions;
            parseQuizQuestions(result);
        } else
            console.log("Error getting all questions:", err);
    });
}

function parseQuizQuestions(result) {
    var output = [];
    var upCount = 0;
    var dupeCount = 0;
    for (var key in result) {
        if (result[key].Category === "")
            break;
        var question = {};
        question.answers = {};
        question.category = result[key].Category;
        question.type = result[key]['Question Type'];
        question.text = result[key].Question;

        if (result[key]['Correct Answer'])
            question.answers.correct = result[key]['Correct Answer'];

        question.answers.MCTF = [
            result[key].Choice1,
            result[key].Choice2,
            result[key].Choice3,
            result[key].Choice4,
            result[key].Choice5
        ];
        //Prune for empty strings.
        question.answers.MCTF = _.compact(question.answers.MCTF);

        //Dont assign if there arent any MA.
        if (result[key]['Matching Answer 1']) {
            question.answers.MA = {};
            question.answers.MA.correct = [
                result[key]['Matching Answer 1'],
                result[key]['Matching Answer 2'],
                result[key]['Matching Answer 3'],
                result[key]['Matching Answer 4'],
                result[key]['Matching Answer 5']
            ];
            //Prune for empty strings.
            question.answers.MA.correct = _.compact(question.answers.MA.correct);

            //Shuffle
            question.answers.MA.present = question.answers.MA.correct;
            question.answers.MA.present = _.shuffle(question.answers.MA.present);
        }
        question.hint = result[key]['Hint upon incorrect answer'];
        question.link = result[key]['Topic Link(s) or Text'];

        var isDuplicate = questionExists(question);
        if (isDuplicate) {
            console.log("Question already exists!");
            dupeCount++;
            continue;
        }
        output.push(question);
        //console.log(question);

        var qModel = new QuizQuestion(question);

        qModel.save(function(err) {
            if (err) {
                console.log('Error saving question: ', err);
            } else {
                console.log('Question saved');
                upCount++;
            }
        });
    }
    console.log(upCount, "questions saved.");
    console.log(dupeCount, "duplicates found.");
}
