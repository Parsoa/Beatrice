const {remote} = require('electron') ;
const spawn = require('child_process').spawn ;
const ipc = require('electron').ipcRenderer ;
const fs = require('/Users/Parsoa/Desktop/Sharif/Research/Royan/src/Beatrice/app/file/fs_interface.js')
const CWLTemplate = require('/Users/Parsoa/Desktop/Sharif/Research/Royan/src/Beatrice/app/home/template_cwl_file.js')
const constants = require('/Users/Parsoa/Desktop/Sharif/Research/Royan/src/Beatrice/app/constants.js')
const commons = require('/Users/Parsoa/Desktop/Sharif/Research/Royan/src/Beatrice/app/common.js')

let $ = require('jQuery');

console.log(constants.WORKLOAD_DIRECTORY)

$(document).ready(function() {

	function run_button_handler(event) {
		console.log(event.data.name) ;
	}

	function view_button_handler(event) {
		ipc.send('load-page', { path: 'file:///Users/Parsoa/Desktop/Sharif/Research/Royan/src/Beatrice/app/workload/index.html',
			name: event.data.name, directory: event.data.directory });
	}

	commons.prepare_navigation('home') ;

	fs.get_cwl_files(constants.WORKLOAD_DIRECTORY, function(cwl_files) {
		console.log(cwl_files) ;
		if (cwl_files != null) {
			var cwl_files_ul = document.getElementById('index_ul_cwl_files')
			for (var i = 0 ; i < cwl_files.length ; i++) {
				$('#index_ul_cwl_files').append(new CWLTemplate.CWLFileTemplate(cwl_files[i], i, constants.WORKLOAD_DIRECTORY).render()) ;
				id = '#home_template_cwl_button_run_' + i ;
				$(id).on('click', { name: cwl_files[i] },  run_button_handler) ;
				id = '#home_template_cwl_button_view_' + i ;
				$(id).on('click', { name: cwl_files[i], directory: constants.WORKLOAD_DIRECTORY },  view_button_handler) ;
			}
		}
	}) ;
}) ;
