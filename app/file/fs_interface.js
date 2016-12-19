const fs = require('fs');

module.exports.get_cwl_files = function(path, callback) {

	fs.readdir(path, function(err, files) {
		if (err) {
			callback(null) ;
			return undefined ;
		}
		var pattern = /.*\.cwl/ ;
		var results = files.filter(v => v.match(pattern) != null) ;
		console.log(results);
		callback(results) ;
	}) ;

}
