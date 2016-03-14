var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var resourceSchema = new Schema({
	//text displayed for resource
	title: {
		type: String,
		required: true
	},
	//address for resource
	url: {
		type: String,
		required: true
	},
	//Though this is called subject it pertains to the subheading title this resource belongs to
	subject: {
		type: String,
		required: true
	}

});

module.exports = mongoose.model('Resource',resourceSchema);

