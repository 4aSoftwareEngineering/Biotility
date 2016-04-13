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
	Comments = mongoose.model('Comments'),
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
        console.log("No questions found.");
        return isMatch;
    }
    _.find(questionBank, function(item) {
        isMatch = item.text === question.text && item.link === question.link && item.hint === question.hint;
        if (isMatch) {
            return true;
        }
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
exports.uploadComments = function(req, res) {
	console.log("it is in the upload export func");
    var comment = new Comments(req.body);
	console.log(comment.category);
	console.log(comment.comment);
	comment.save(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(comment);
        }
    });
};
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
                    uploadQuizQuestions(data, res);
                }
            });
        }
    });
    //res.end("hello lol");
};

function uploadQuizQuestions(result, res) {
    console.log("Uploading quiz questions...");
    QuizQuestion.find({}).exec(function(err, questions) {
        if (!err) {
            //Load Quiz Bank and then parse to check for dupes.
            questionBank = questions;
            parseQuizQuestions(result, res);
        } else {
            console.log("Error getting all questions:", err);
        }
    });

}

function parseQuizQuestions(result, res) {
    var dupeCount = 0;
    var itrCount = -1;
    var out = null;
    for (var key in result) {
        itrCount++;
        var item = result[key];
        if (itrCount === 0) {
            if (!item.Category && !item['Question Type'] && !item.Question) {
                out = {
                    error: true,
                    errorMsg: "Excel file does not match expected template!"
                };
                return res.end(JSON.stringify(out));
            }
        }

        if (item.Category === "") break;

        //Set up question obj
        var question = {};
        question.answers = {};

        question.category = item.Category;
        question.type = item['Question Type'];
        question.text = item.Question;

        //Assign correct answer if exists.
        if (item['Correct Answer']) question.answers.correct = item['Correct Answer'];

        //Assign MCTF as they always exist.
        question.answers.MCTF = [];
        if (item.Choice1 !== "") question.answers.MCTF.push(item.Choice1);
        if (item.Choice2 !== "") question.answers.MCTF.push(item.Choice2);
        if (item.Choice3 !== "") question.answers.MCTF.push(item.Choice3);
        if (item.Choice4 !== "") question.answers.MCTF.push(item.Choice4);
        if (item.Choice5 !== "") question.answers.MCTF.push(item.Choice5);

        //Prune empty strings as failsafe.
        question.answers.MCTF = _.compact(question.answers.MCTF);

        //Dont assign if there arent any MA.
        if (item['Matching Answer 1']) {
            question.answers.MA = {};
            question.answers.MA.correct = [];

            if (item['Matching Answer 1'] !== "") question.answers.MA.correct.push(item['Matching Answer 1']);
            if (item['Matching Answer 2'] !== "") question.answers.MA.correct.push(item['Matching Answer 2']);
            if (item['Matching Answer 3'] !== "") question.answers.MA.correct.push(item['Matching Answer 3']);
            if (item['Matching Answer 4'] !== "") question.answers.MA.correct.push(item['Matching Answer 4']);
            if (item['Matching Answer 5'] !== "") question.answers.MA.correct.push(item['Matching Answer 5']);

            //Prune for empty strings.
            question.answers.MA.correct = _.compact(question.answers.MA.correct);

            //Shuffle
            question.answers.MA.present = question.answers.MA.correct;
            question.answers.MA.present = _.shuffle(question.answers.MA.present);
        }
        question.hint = item['Hint upon incorrect answer'];
        question.link = item['Topic Link(s) or Text'];

        var isDuplicate = questionExists(question);
        if (isDuplicate) {
            dupeCount++;
            continue;
        }

        saveQuestion(question);
    }
    out = {
        error: false,
        numDuplicates: dupeCount,
        numSaved: itrCount - dupeCount
    };
    console.log(itrCount - dupeCount, "questions saved.");
    console.log(dupeCount, "duplicates found.");
    return res.end(JSON.stringify(out));
}

function saveQuestion(question) {
    var qModel = new QuizQuestion(question);

    qModel.save(function(err) {
        if (err) {
            console.log('Error saving question: ', err);
        }
    });
}
