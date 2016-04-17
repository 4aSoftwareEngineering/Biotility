angular.module('core').service('multipartForm', ['$http', function($http){
	this.post = function(uploadUrl, data){
		var fd = new FormData(); //key and value pairs that allow us to post photos
		for(var key in data)
			fd.append(key, data[key]); 
		$http.post(uploadUrl, fd, {
			transformRequest: angular.indentity, //do not serialize data
			headers: { 'Content-Type': undefined } //let server handle data type
		});
	}
}])