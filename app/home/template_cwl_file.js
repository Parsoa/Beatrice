const yaml = require('js-yaml')
const fs = require('fs');
const multiline = require('multiline')
const constants = require('/Users/Parsoa/Desktop/Sharif/Research/Royan/src/Beatrice/app/constants.js')

var CWLFileTemplate = function(file, index, directory) {
	this.directory = directory ;
	this.file = file ;
	this.index = index ;
}

CWLFileTemplate.prototype.render = function() {
	// console.log("Loading file: " + this.file)
	var doc = yaml.safeLoad(fs.readFileSync(constants.WORKLOAD_DIRECTORY + this.file, 'utf8')) ;
	var template = multiline(function() {/*
	<li class="list-group-item position_relative">
		<div class="flex_container_row width_match_parent">
			<div class="layout_weight_3">
	      		<strong> %s </strong>
	      		<p> %s </p>
	    	</div>
			<div class="layout_weight_1 flex_container_row">
				<div class="layout_weight_1 flex_container_row">
					<button id="%s" class="btn btn-positive">Run</button>
				</div>
				<div class="layout_weight_1 flex_container_row">
					<button id="%s" class="btn btn-default">View</button>
				</div>
			</div>
		</div>
	</li>
	*/}) ;
	template = template.replace('%s', this.file) ;
	template = template.replace('%s', doc.doc != undefined ? doc.doc : 'No description available') ;
	template = template.replace('%s', 'home_template_cwl_button_run_' + this.index) ;
	template = template.replace('%s', 'home_template_cwl_button_view_' + this.index) ;
	return template
}

CWLFileTemplate.prototype.render_simple = function() {
	// console.log("Loading file: " + this.file)
	var doc = yaml.safeLoad(fs.readFileSync(constants.WORKLOAD_DIRECTORY + this.file, 'utf8')) ;
	var template = multiline(function() {/*
	<li class="list-group-item position_relative">
		<div class="flex_container_row width_match_parent">
			<div class="layout_weight_3">
	      		<strong> %s </strong>
	      		<p> %s </p>
	    	</div>
		</div>
	</li>
	*/}) ;
	template = template.replace('%s', this.file) ;
	template = template.replace('%s', doc.doc != undefined ? doc.doc : 'No description available') ;
	// template = template.replace('%s', 'home_template_cwl_button_run_' + this.index) ;
	// template = template.replace('%s', 'home_template_cwl_button_view_' + this.index) ;
	return template
}

CWLFileTemplate.prototype.render_create = function() {
	// console.log("Loading file: " + this.file)
	var doc = yaml.safeLoad(fs.readFileSync(constants.WORKLOAD_DIRECTORY + this.file, 'utf8')) ;
	var template = multiline(function() {/*
	<li draggable="true" class="list-group-item position_relative">
		<div class="flex_container_row width_match_parent">
			<div class="layout_weight_3">
	      		<strong> %s </strong>
	    	</div>
			<div class="layout_weight_1 flex_container_row">
				<div class="layout_weight_1 flex_container_row">
					<button id="%s" class="btn btn-positive">Add</button>
				</div>
				<div class="layout_weight_1 flex_container_row">
					<button id="%s" class="btn btn-primary">Info</button>
				</div>
			</div>
		</div>
	</li>
	*/}) ;
	template = template.replace('%s', this.file) ;
	// template = template.replace('%s', doc.doc != undefined ? doc.doc : 'No description available') ;
	template = template.replace('%s', 'create_template_cwl_button_add_' + this.index) ;
	template = template.replace('%s', 'create_template_cwl_button_info_' + this.index) ;
	return template
}

// ========================================================================================================== \\
// ========================================================================================================== \\
// ========================================================================================================== \\

module.exports.CWLFileTemplate = CWLFileTemplate ;
