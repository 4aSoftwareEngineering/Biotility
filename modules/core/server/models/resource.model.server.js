var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var resourceSchema = new Schema({
	title: {
		type: String,
		required: true
	},
	url: {
		type: String,
		required: true
	},
	subject: {
		type: String,
		required: true
	}

});

//mongoose.model('Resource',resourceSchema);
module.exports = mongoose.model('Resource',resourceSchema);

