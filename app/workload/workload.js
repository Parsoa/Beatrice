const spawn = require('child_process').spawn ;
const remote = require('electron').remote ;
const fs = require('/Users/Parsoa/Desktop/Sharif/Research/Royan/src/Beatrice/app/file/fs_interface.js')
const CWLTemplate = require('/Users/Parsoa/Desktop/Sharif/Research/Royan/src/Beatrice/app/home/template_cwl_file.js')
const constants = require('/Users/Parsoa/Desktop/Sharif/Research/Royan/src/Beatrice/app/constants.js')
const commons = require('/Users/Parsoa/Desktop/Sharif/Research/Royan/src/Beatrice/app/common.js')

let $ = require('jQuery');

current_workflow = remote.getGlobal('current_workflow') ;

function execute_test_wrokflow() {
	output = document.getElementById('workload_text_view_stdout') ;
	const cmd = spawn('cwltool', ['/Users/Parsoa/Desktop/Sharif/Research/Royan/src/Beatrice/tests/wf/revsort.cwl',
 		'/Users/Parsoa/Desktop/Sharif/Research/Royan/src/Beatrice/tests/wf/revsort-job.json']) ;
 	cmd.stdout.on('data', (data) => {
		$('#workload_text_view_stdout').append('<p>' + data + '</p>') ;
  		console.log(`stdout: ${data}`) ;
	});

	cmd.stderr.on('data', (data) => {
		$('#workload_text_view_stdout').append('<p>' + data + '</p>') ;
  		console.log(`stdout: ${data}`) ;
	});
}

$(document).ready(function() {
	commons.prepare_navigation('workload') ;
	$('#workload_text_view_stdout').append('<p>' + 'Starting ... ' + '</p>') ;
	execute_test_wrokflow() ;
}) ;
