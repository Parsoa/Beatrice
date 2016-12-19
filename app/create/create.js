const spawn = require('child_process').spawn ;
const remote = require('electron').remote ;
const CWLTemplate = require('/Users/Parsoa/Desktop/Sharif/Research/Royan/src/Beatrice/app/home/template_cwl_file.js')
const constants = require('/Users/Parsoa/Desktop/Sharif/Research/Royan/src/Beatrice/app/constants.js')
const commons = require('/Users/Parsoa/Desktop/Sharif/Research/Royan/src/Beatrice/app/common.js')
const ipcRenderer = require('electron').ipcRenderer ;
const node_fs = require('fs');
const fs = require('/Users/Parsoa/Desktop/Sharif/Research/Royan/src/Beatrice/app/file/fs_interface.js')
const exporter = require('./export.js') ;
const cwl = require('../cwl.js') ;
const Step = require('./step.js').Step ;

// ========================================================================================================== \\
// ========================================================================================================== \\
// ========================================================================================================== \\

let $ = require('jQuery');

global.current_step = null ;
global.head_step = null ;
global.step_counter = 0 ;

let pipeline_name = 'test_pipeline' ;
let export_directory = '/Users/Parsoa/Desktop/Beatrice' ;
let library_visible = true ;

// ========================================================================================================== \\
// ========================================================================================================== \\
// ========================================================================================================== \\

function add_workflow_handler(event) {
	if (global.current_step != null) {
		global.current_step.add_workflow(event) ;
	}
}

function get_first_step() {
	var step = global.head_step ;
	while (step.previous != null) {
		step = step.previous ;
	}
	return step ;
}

function activate_step_handler(event) {
	var step = event.data.step ;
	var id = current_step.get_activate_button_id() ;
	$(id).removeClass('btn-positive') ;
	$(id).addClass('btn-default') ;
	current_step = step ;
	id = current_step.get_activate_button_id() ;
	$(id).addClass('btn-positive') ;
	$(id).removeClass('btn-default') ;
}

function remove_step_handler(event) {
	var step = event.data.step ;
	if (step.previous != null) {
		step.previous.next = step.next ;
	}
	if (step.next != null) {
		step.next.previous = step.previous ;
	} else {
		head_step = step.previous ;
		current_step = head_step ;
	}
	$(step.get_root_div_id()).remove() ;
}

function add_step_handler(event) {
	var step = new Step(global.step_counter, head_step) ;
	if (head_step != null) {
		head_step.next = step ;
	}
	step.render() ;
	head_step = step ;
	current_step = head_step ;
	global.step_counter ++ ;
}

// ========================================================================================================== \\
// ========================================================================================================== \\
// ========================================================================================================== \\

function load_pipeline() {
	var path = export_directory + '/' + pipeline_name + '.bpl' ;
	var pipeline = JSON.parse(node_fs.readFileSync(path)) ;
	pipeline_name = pipeline.name ;
	$('#create_ul_steps').empty() ;
	global.current_step = null ;
	global.head_step = null ;
	for (var i in pipeline.steps) {
		step = new Step(pipeline.steps[i].index, head_step) ;
		step.description = pipeline.steps[i].description ;
		step.render() ;
		step.load_workflows(pipeline.steps[i].workflows) ;
		step.workflow_counter = pipeline.steps[i].workflow_counter ;
		global.head_step = step ;
		global.current_step = step ;
		global.step_counter = step.index ;
	}
	console.log(pipeline) ;
}

function export_pipeline(event) {
	if (validate()) {
		// result = ipcRenderer.sendSync('dialog-request', null) ;
		var pipeline = {} ;
		pipeline['name'] = pipeline_name ;
		pipeline['steps'] = [] ;
		var step = get_first_step() ;
		while (step != null) {
			pipeline.steps.push(step.flatten()) ;
			step = step.next ;
		}
		exporter.export_workspace(pipeline, export_directory) ;
		meta = { title: pipeline_name, description: "Something" }
		exporter.export_pipeline(meta, export_directory, get_first_step()) ;
	}
}

function validate() {
	return true ;
}

// ========================================================================================================== \\
// ========================================================================================================== \\
// ========================================================================================================== \\

function reload_page() {
	ipcRenderer.sendSync('reload-page', {path:
		'file:///Users/Parsoa/Desktop/Sharif/Research/Royan/src/Beatrice/app/create/index.html'}) ;
}

function toggle_library_panel(event) {
	var id = '#create_pane_workflow_library' ;
	if (library_visible) {
		$(id).hide() ;
		library_visible = false ;
		document.getElementById('create_button_hide').innerHTML = 'Show Library' ;
	} else {
		$(id).show() ;
		library_visible = true ;
		document.getElementById('create_button_hide').innerHTML = 'Hide Library' ;
	}
	var width = document.getElementById('create_pane_wokflow_creator').offsetWidth ;
	console.log('width: ' + width) ;
	$('#create_header_wokflow_creator').width(width) ;
}

function handle_resize() {
	var width = document.getElementById('create_pane_wokflow_creator').offsetWidth ;
	$('#create_header_wokflow_creator').width(width) ;
}

$(document).ready(function() {
	commons.prepare_navigation('create') ;

	var id = '#create_button_add_step' ;
	$(id).on('click', add_step_handler) ;

	id = '#create_button_save' ;
	$(id).on('click', export_pipeline) ;

	id = '#create_button_hide' ;
	$(id).on('click', toggle_library_panel) ;

	id = '#create_button_load' ;
	$(id).on('click', load_pipeline) ;

	id = '#create_button_discard' ;
	$(id).on('click', reload_page) ;

	handle_resize() ;

	var height = document.getElementById('create_header_workflow_library').offsetHeight ;
	document.getElementById("create_ul_workflow_library").style.marginTop = String(height) + 'px' ;
	document.getElementById("create_header_workflow_library").style.zIndex = "1" ;

	height = document.getElementById('create_header_wokflow_creator').offsetHeight ;
	document.getElementById("create_ul_steps").style.marginTop = String(height) + 'px' ;
	document.getElementById("create_header_wokflow_creator").style.zIndex = "1" ;

	window.addEventListener("resize", handle_resize);

	fs.get_cwl_files(constants.WORKLOAD_DIRECTORY, function(cwl_files) {
		console.log(cwl_files) ;
		if (cwl_files != null) {
			var cwl_files_ul = document.getElementById('create_ul_workflow_library')
			for (var i = 0 ; i < cwl_files.length ; i++) {
				$('#create_ul_workflow_library').append(new CWLTemplate.CWLFileTemplate(cwl_files[i], i,
					constants.WORKLOAD_DIRECTORY).render_create()) ;
				id = '#create_template_cwl_button_add_' + i ;
				$(id).on('click', { name: cwl_files[i].replace('.cwl', ''), directory: constants.WORKLOAD_DIRECTORY }, add_workflow_handler) ;
			}
		}
	}) ;
}) ;
