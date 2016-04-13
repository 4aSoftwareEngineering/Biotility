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
    link: {
        type: String
    }

});
var commentSchema = new Schema({
    category: {
        type: String,
        required: true
    },
    comment: {
        type: String,
        required: false
    }
});


var gradeSchema = new Schema({
    analytics: {
        type: Object,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    student: {
        type: Object,
        required: true,
        name: {
            type: String
        },
        courses: {
            type: Array
        }

    }


});

mongoose.model('QuizQuestion', questionSchema);
mongoose.model('StudentGrades', gradeSchema);
mongoose.model('Comments' , commentSchema);