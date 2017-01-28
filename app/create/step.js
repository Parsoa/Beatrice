
const templates = require('/Users/Parsoa/Desktop/Sharif/Research/Royan/src/Beatrice/app/create/templates.js')
const Workflow = require('./workflow.js').Workflow ;

let $ = require('jQuery');

// ========================================================================================================== \\
// ========================================================================================================== \\
// ========================================================================================================== \\

Step.prototype.get_remove_button_id = function() {
	return '#create_step_button_remove__' + this.index ;
}

Step.prototype.get_activate_button_id = function() {
	return '#create_step_button_activate__' + this.index ;
}

Step.prototype.get_content_div_id = function() {
	return '#create_step_div_content__' + this.index ;
}

Step.prototype.get_root_div_id = function() {
	return '#create_step_div_root__' + this.index ;
}

Step.prototype.get_title_id = function() {
	return '#create_step_title__' + this.index ;
}

// ========================================================================================================== \\
// ========================================================================================================== \\
// ========================================================================================================== \\

function Step(index, previous) {
	this.name = 'Step_' + index ;
	this.index = index ;
	this.inputs = [] ;
	this.outputs = [] ;
	this.next = null ;
	this.previous = previous ;
	this.head_workflow = null ;
	this.workflow_counter = 0 ;
	this.description = "" ;
	if (this.previous != null) {
		this.previous.next = this ;
	}
}

Step.prototype.render = function() {
	if (global.current_step != null) {
		var id = global.current_step.get_activate_button_id() ;
		$(id).removeClass('btn-positive') ;
		$(id).addClass('btn-default') ;
	}
	$('#create_ul_steps').append(templates.render_step(this)) ;
	$(this.get_remove_button_id()).on('click', { step: this }, remove_step_handler) ;
	$(this.get_activate_button_id()).on('click', { step: this }, activate_step_handler) ;
}

Step.prototype.get_first_workflow = function() {
	var workflow = this.head_workflow ;
	while(workflow.previous != null) {
		workflow = workflow.previous ;
	}
	return workflow ;
}

Step.prototype.load_workflows = function(workflows) {
	console.log('Loading workflows for ' + this.name) ;
	this.head_workflow = null ;
	for (var i in workflows) {
		var workflow = workflows[i] ;
		this.head_workflow = new Workflow(workflow.name, workflow.directory, this, workflow.index, this.head_workflow) ;
		this.head_workflow.import_inputs(workflow.inputs) ;
		this.head_workflow.import_outputs(workflow.outputs) ;
		this.head_workflow.render() ;
		this.head_workflow.initialize_input_selectors() ;
		this.head_workflow.restore_input_values() ;
	}
}

Step.prototype.flatten = function() {
	var flat_step = {} ;
	flat_step['index'] = this.index ;
	flat_step['name'] = this.index ;
	flat_step['workflow_counter'] = this.workflow_counter ;
	flat_step['description'] = this.description ;
	flat_step['workflows'] = [] ;
	var workflow = this.get_first_workflow() ;
	while (workflow != null) {
		flat_step['workflows'].push(workflow.flatten()) ;
		workflow = workflow.next ;
	}
	return flat_step ;
}

Step.prototype.add_workflow = function(event) {
	var workflow = new Workflow(event.data.name, event.data.directory, this, this.workflow_counter, this.head_workflow) ;
	this.workflow_counter ++ ;
	if (this.head_workflow != null) {
		this.head_workflow.next = workflow ;
	}
	this.head_workflow = workflow ;
	workflow.read_all_properties() ;
	for (var i in workflow.outputs) {
		this.outputs.push(workflow.outputs[i]) ;
	}
	if (this.next != null) {
		this.next.add_workflow_to_inputs(workflow) ;
	}
	workflow.render() ;
	workflow.initialize_input_selectors() ;
}

Step.prototype.remove_workflow = function(workflow) {
	if (workflow.previous != null) {
		workflow.previous.next = workflow.next ;
	}
	if (workflow.next != null) {
		workflow.next.previous = workflow.previous ;
	} else {
		this.head_workflow = workflow.previous ;
	}
	for (var i in this.outputs) {
		var output = this.outputs[i] ;
		if (output.workflow.name == workflow) {
			this.outputs.splice(i, 1) ;
			i -- ;
		}
	}
	document.getElementById(workflow.get_id().substring(1)).remove() ;
	if (this.next != null) {
		this.next.remove_workflow_from_inputs(workflow) ;
	}
}

// ========================================================================================================== \\

Step.prototype.add_workflow_to_inputs = function(new_workflow) {
	console.log('Adding ' + new_workflow.name + 'to input selectors') ;
	var workflow = this.head_workflow ;
	while (workflow != null) {
		workflow.add_workflow_to_inputs(new_workflow) ;
		workflow = workflow.previous ;
	}
}

Step.prototype.remove_workflow_from_inputs = function(deleted_workflow) {
	console.log('Removing ' + deleted_workflow.name + ' from input selectors') ;
	var workflow = this.head_workflow ;
	while (workflow != null) {
		workflow.remove_workflow_from_inputs(deleted_workflow) ;
		workflow = workflow.previous ;
	}
}

// ========================================================================================================== \\

Step.prototype.export_inputs = function() {
	var workflow = this.get_first_workflow() ;
	var exported_inputs = [] ;
	while (workflow != null) {
		for (var j in workflow.inputs) {
			var input = workflow.inputs[j] ;
			if (input.is_linked) {
				exported_inputs.push({
					id: input.workflow.name + '__' + input.id ,
					source: '#' + this.previous.name + '/' + workflow.get_input_selector_value(input)
				}) ;
			}
		}
		workflow = workflow.next ;
	}
	return exported_inputs ;
}

Step.prototype.export_outputs = function() {
	var workflow = this.get_first_workflow() ;
	var exported_outputs = [] ;
	while (workflow != null) {
		for (var j in workflow.outputs) {
			var output = workflow.outputs[j] ;
			exported_outputs.push({
				id: output.workflow.name + '__' + output.id
			}) ;
		}
 		workflow = workflow.next ;
	}
	return exported_outputs ;
}

// ========================================================================================================== \\

Step.prototype.get_all_inputs = function() {
	var all_inputs = [] ;
	var workflow = this.get_first_workflow() ;
	while (workflow != null) {
		for (var j in workflow.inputs) {
			var input = workflow.inputs[j] ;
			var tmp = {} ;
			for (var i in cwl.InputParameter_Fields) {
				field = cwl.InputParameter_Fields[i] ;
				if (input[field] != undefined) {
					tmp[field] = input[field] ;
				}
			}
			if (tmp.type.endsWith('?')) {
				type = tmp.type.substring(0, tmp.type.length - 1) ;
				tmp.type = [] ;
				tmp.type.push(type) ;
				tmp.type.push("null") ;
			}
			else if (tmp.type.endsWith('[]')) {
				type = tmp.type.substring(0, tmp.type.length - 2) ;
				tmp.type = {} ;
				tmp.type['type'] = "array" ;
				tmp.type['items'] = type ;
			}
			tmp.id = input.workflow.name + '__' + input.id ;
			all_inputs.push(tmp) ;
		}
		workflow = workflow.next ;
	}
	return all_inputs ;
}

Step.prototype.get_all_outputs = function() {
	var all_outputs = [] ;
	var workflow = this.get_first_workflow() ;
	while (workflow != null) {
		for (var j in workflow.outputs) {
			var output = workflow.outputs[j] ;
			var tmp = {} ;
			for (var i in cwl.WorkflowOutputParameter_Fields) {
				field = cwl.WorkflowOutputParameter_Fields[i] ;
				if (output[field] != undefined) {
					tmp[field] = output[field] ;
				}
			}
			if (tmp.type.endsWith('?')) {
				type = tmp.type.substring(0, tmp.type.length - 1) ;
				tmp.type = [] ;
				tmp.type.push(type) ;
				tmp.type.push("null") ;
			}
			else if (tmp.type.endsWith('[]')) {
				type = tmp.type.substring(0, tmp.type.length - 2) ;
				tmp.type = {} ;
				tmp.type['type'] = "array" ;
				tmp.type['items'] = type ;
			}
			tmp.id = output.workflow.name + '__' + output.id ;
			all_outputs.push(tmp) ;
		}
		workflow = workflow.next ;
	}
	return all_outputs ;
}

Step.prototype.get_constant_inputs = function() {
	var constant_inputs = {} ;
	var workflow = this.get_first_workflow() ;
	while (workflow != null) {
		for (var j in workflow.inputs) {
			var input = workflow.inputs[j] ;
			if (!input.is_linked) {
				constant_inputs[input.workflow.name + '__' + input.id] = workflow.get_input_value(input) ;
			}
		}
		workflow = workflow.next ;
	}
	return constant_inputs ;
}

// ========================================================================================================== \\
// ========================================================================================================== \\
// ========================================================================================================== \\

exports.Step = Step ;
