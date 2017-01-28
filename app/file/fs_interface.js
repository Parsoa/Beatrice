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

module.exports.deleteFolderRecursive = function(path) {
	if( fs.existsSync(path) ) {
		fs.readdirSync(path).forEach(function(file,index){
			var curPath = path + "/" + file;
			if(fs.lstatSync(curPath).isDirectory()) { // recurse
				module.exports.deleteFolderRecursive(curPath);
			} else { // delete file
				fs.unlinkSync(curPath);
			}
		});
		fs.rmdirSync(path);
	}
};

module.exports.get_file_name = function(path) {
	var index = path.lastIndexOf('/') ;
	if (index == -1) { // no path separator
		return path ;
	} else {
		return path.substring(index + 1) ;
	}
}
