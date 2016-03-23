var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

//Schema for SubHeadings
var subheadSchema = new Schema({
	//title is the text that is shown on page
	title: {
		type: String,
		required: true
	},
	//Subject is the Subject that pertains to each subject page e.g. Cells
	subject: {
		type: String,
		required: true
	}

});

module.exports = mongoose.model('SubHead',subheadSchema);

