'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Article Schema
 */
var questionSchema = new Schema({
    category: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    answers: {
        type: Object,
        required: true
    },
    hint: {
        type: String
    },
    link:{
        type: String
    }

});


var gradeSchema = new Schema({
    category: {
        type: String,
        required: true
    },
    studentName: {
        type: String,
        required: true
    },
    analytics: {
        type: Object,
        required: true
    }
});

mongoose.model('QuizQuestion', questionSchema);
mongoose.model('StudentGrades', gradeSchema);
