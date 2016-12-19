const yaml = require('js-yaml') ;
const templates = require('/Users/Parsoa/Desktop/Sharif/Research/Royan/src/Beatrice/app/create/templates.js') ;

let $ = require('jQuery');

// ========================================================================================================== \\
// ========================================================================================================== \\
// ========================================================================================================== \\

function Input(workflow, id, type) {
	this.workflow = workflow ;
	this.id = id ;
	this.type = type ;
	this.options = {} ;
	this.is_linked = false ;
	this.value = '' ; //final value
	this.doc = '' ;
	this.selected_id = '' ;
	this.previous_text_value = '' ;
}

Input.prototype.flatten = function() {
	var flat_input = {} ;
	flat_input['id'] = this.id ;
	flat_input['type'] = this.type ;
	flat_input['is_linked'] = this.is_linked ;
	flat_input['doc'] = this.doc ;
	flat_input['value'] = this.workflow.get_input_value(this) ;
	flat_input['selected_id'] = this.selected_id ;
	return flat_input ;
}

// ========================================================================================================== \\
// ========================================================================================================== \\
// ========================================================================================================== \\

function Output(workflow, id, type) {
	this.workflow = workflow ;
	this.id = id ;
	this.type = type ;
	this.doc = '' ;
	this.source = "#" + this.workflow.name + "/" + this.id ;
}

Output.prototype.flatten = function() {
	var flat_output = {} ;
	flat_output['id'] = this.id ;
	flat_output['type'] = this.type ;
	flat_output['doc'] = this.doc ;
	flat_output['source'] = this.source ;
	return flat_output ;
}

// ========================================================================================================== \\
// ========================================================================================================== \\
// ========================================================================================================== \\

Workflow.prototype.get_id_prefix = function() {
	return this.step.index + '__' + this.name + '__' +  this.index ;
}

Workflow.prototype.get_id = function() {
	return '#create_workflow__' + this.get_id_prefix() ;
}

Workflow.prototype.get_remove_button_id = function() {
	return '#create_workflow_button_remove__' + this.get_id_prefix() ;
}

Workflow.prototype.get_input_checkbox_id = function(input) {
	return '#create_checkbox_input__' + this.get_id_prefix() + '__' + input.id ;
}

Workflow.prototype.get_input_selector_id = function(input) {
	return '#create_select_input__' + this.get_id_prefix() + '__' + input.id ;
}

Workflow.prototype.get_input_text_area_id = function(input) {
	return '#create_textarea_input__' + this.get_id_prefix() + '__' + input.id ;
}

Workflow.prototype.get_input_source_id = function(input) {
	return '#create_input_source__' + this.get_id_prefix() + '__' + input.id ;
}

Workflow.prototype.get_input_table_toggle_id = function(event) {
	return '#create_workflow_button_toggle_inputs__' + this.get_id_prefix() ;
}

Workflow.prototype.get_input_table_id = function(event) {
	return '#create_workflow_table_inputs__' + this.get_id_prefix() ;
}

Workflow.prototype.get_output_table_toggle_id = function(event) {
	return '#create_workflow_button_toggle_outputs__' + this.get_id_prefix() ;
}

Workflow.prototype.get_output_table_id = function(event) {
	return '#create_workflow_table_outputs__' + this.get_id_prefix() ;
}

Workflow.prototype.get_input_option_id = function(input, output) {
	return '#create_select_option__' + this.get_id_prefix() + '__' + input.id + '__' + output.workflow.name + '__' + output.id ;
}

// ========================================================================================================== \\
// ========================================================================================================== \\
// ========================================================================================================== \\

function Workflow(name, directory, step, index, previous) {
	this.name = name ;
	this.directory = directory ;
	this.step = step ;
	this.index = index ;
	this.outputs = [] ;
	this.inputs = [] ;
	this.next = null ;
	this.previous = previous ;
	this.input_selections = {} ;
	if (this.previous != null) {
		this.previous.next = this ;
	}
}

Workflow.prototype.render = function() {
	$(this.step.get_content_div_id()).append(templates.render_workflow(this)) ;
	this.initialize_checkbox_handlers() ;

	function toggle_hide_show(event) {
		$(event.data.id).toggle() ;
	}

	function remove_workflow_handler(event) {
		event.data.workflow.step.remove_workflow(event.data.workflow) ;
	}

	$(this.get_remove_button_id()).on('click', {workflow: this}, remove_workflow_handler) ;
	$(this.get_input_table_toggle_id()).on('click', { id: this.get_input_table_id() }, toggle_hide_show) ;
	$(this.get_output_table_toggle_id()).on('click', { id: this.get_output_table_id() }, toggle_hide_show) ;
}

// ========================================================================================================== \\

Workflow.prototype.export_inputs = function() {
	var exported_inputs = [] ;
	for (var i in this.inputs) {
		var input = this.inputs[i] ;
		exported_inputs.push({
			id: input.id,
			source: '#' + this.name + '__' + input.id
		}) ;
	}
	return exported_inputs ;
}

Workflow.prototype.export_outputs = function() {
	var exported_outputs = [] ;
	for (var i in this.outputs) {
		var output = this.outputs[i] ;
		exported_outputs.push({
			id: output.id,
		}) ;
	}
	return exported_outputs ;
}

Workflow.prototype.import_inputs = function(inputs) {
	console.log('Loading inputs') ;
	for (var i in inputs) {
		var input = inputs[i] ;
		var new_input = new Input(this, input.id, input.type, null) ;
		new_input.is_linked = input.is_linked ;
		new_input.value = input.value ;
		new_input.selected_id = input.selected_id ;
		this.inputs.push(new_input) ;
	}
}

Workflow.prototype.import_outputs = function(outputs) {
	console.log('Loading outputs') ;
	for (var i in outputs) {
		var output = outputs[i] ;
		this.outputs.push(new Output(this, output.id, output.type, null)) ;
	}
}

Workflow.prototype.flatten = function() {
	var flat_workflow = {} ;
	flat_workflow['name'] = this.name ;
	flat_workflow['directory'] = this.directory ;
	flat_workflow['index'] = this.index ;
	flat_workflow['inputs'] = [] ;
	flat_workflow['outputs'] = [] ;
	for (var i in this.inputs) {
		flat_workflow['inputs'].push(this.inputs[i].flatten()) ;
	}
	for (var i in this.outputs) {
		flat_workflow['outputs'].push(this.outputs[i].flatten()) ;
	}
	return flat_workflow ;
}

// ========================================================================================================== \\

Workflow.prototype.read_all_properties = function() {
	var doc = yaml.safeLoad(node_fs.readFileSync(this.directory + this.name + '.cwl', 'utf8')) ;
	console.log(doc) ;
	if (doc.outputs != undefined) {
		for (var property in doc.outputs) {
			this.outputs.push(new Output(this, property, String(doc.outputs[property].type))) ;
		}
	}
	if (doc.inputs != undefined) {
		for (var property in doc.inputs) {
			this.inputs.push(new Input(this, property, String(doc.inputs[property].type))) ;
		}
	}
}

// ========================================================================================================== \\

Workflow.prototype.add_workflow_to_inputs = function(workflow) {
	for (var j in this.inputs) {
		var input = this.inputs[j] ;
		for (var i in workflow.outputs) {
			var output = workflow.outputs[i] ;
			if (output.type == input.type) {
				tmp = '<option id="%s">' + output.workflow.name + '.' + output.id + '</option>' ;
				tmp = tmp.replace('%s', this.get_input_option_id(input, output).substring(1)) ;
				$(this.get_input_selector_id(input)).append(tmp) ;
				var key = workflow.name + '__' + workflow.index ;
				if (input.options[key] == undefined) {
					input.options[key] = [] ;
				}
				input.options[key].push(tmp) ;
			}
		}
	}
}

Workflow.prototype.remove_workflow_from_inputs = function(workflow) {
	for (var j in this.inputs) {
		var input = this.inputs[j] ;
		for (var i in workflow.outputs) {
			var output = workflow.outputs[i] ;
			$(this.get_input_option_id(input, output)).remove() ;
		}
		delete input.options[workflow.name + '_' + workflow.index] ;
	}
}

// ========================================================================================================== \\

function on_checkbox_trigger(event) {
	event.data.workflow.toggle_input_type(event.data.input) ;
}

Workflow.prototype.initialize_checkbox_handlers = function() {
	for (var i in this.inputs) {
		var input = this.inputs[i] ;
		var id = this.get_input_checkbox_id(input) ;
		$(id).on('click', { input: input, workflow: this}, on_checkbox_trigger) ;
	}
}

Workflow.prototype.toggle_input_type = function(input) {
	var id = this.get_input_checkbox_id(input) ;
	if ($(id).is(':checked')) {
		input.previous_text_value = this.get_input_value(input) ;
		this.hide_text_area(input) ;
		this.restore_input_selectors(input) ;
	} else {
		this.show_text_area(input) ;
		document.getElementById(this.get_input_text_area_id(input).substring(1)).value = input.previous_text_value ;
	}
}

Workflow.prototype.hide_text_area = function(input) {
	input.is_linked = true ;
	$(this.get_input_text_area_id(input)).remove() ;
	var tmp = '<select id="%s" class="form-control layout_weight_1"></select>' ;
	tmp = tmp.replace('%s', this.get_input_selector_id(input).substring(1)) ;
	$(this.get_input_source_id(input)).append(tmp) ;
}

Workflow.prototype.show_text_area = function(input) {
	input.is_linked = false ;
	$(this.get_input_selector_id(input)).remove() ;
	var tmp = '<textarea id="%s" class="form-control layout_weight_1" rows="1">%s</textarea>' ;
	tmp = tmp.replace('%s', this.get_input_text_area_id(input).substring(1)) ;
	$(this.get_input_source_id(input)).append(tmp) ;
}

// ========================================================================================================== \\

Workflow.prototype.initialize_input_selectors = function() {
	if (this.step.previous != null) {
		console.log('Initializing selectors ... ') ;
		var previous_step = this.step.previous ;
		var workflow = previous_step.get_first_workflow() ;
		while (workflow != null) {
			for (var i in workflow.outputs) {
				var output = workflow.outputs[i] ;
				for (var k in this.inputs) {
					var input = this.inputs[k] ;
					tmp = '<option id="%s">' + output.workflow.name + '.' + output.id + '</option>' ;
					tmp = tmp.replace('%s', this.get_input_option_id(input, output).substring(1)) ;
					$(this.get_input_selector_id(input)).append(tmp) ;
					var key = workflow.name + '__' + workflow.index ;
					if (input.options[key] == undefined) {
						input.options[key] = [] ;
					}
					input.options[key].push(tmp) ;
				}
			}
			workflow = workflow.next ;
		}
	}
}

Workflow.prototype.restore_input_selectors = function(input) {
	if (this.step.previous != null) {
		var id = this.get_input_selector_id(input) ;
		for (var j in input.options) { //object
			for (var k in input.options[j]) { //list
				$(id).append(input.options[j][k]) ;
			}
		}
	}
}

Workflow.prototype.restore_input_values = function() {
	for (var i in this.inputs) {
		var input = this.inputs[i] ;
		if (input.is_linked) {
			$(this.get_input_checkbox_id(input)).attr('checked', true) ;
			console.log('Restoring Link') ;
			this.hide_text_area(input) ;
			this.restore_input_selectors(input) ;
			var select = document.getElementById(this.get_input_selector_id(input).substring(1)) ;
			var options = select.options;
			for(var i = 0 ; i < options.length ; i++){
				if (options[i].value === input.value.replace('__', '.')){
					select.selectedIndex = i;
				}
			}
		} else {
			$(this.get_input_checkbox_id(input)).attr('checked', false) ;
			console.log('Restoring TextArea') ;
			document.getElementById(this.get_input_text_area_id(input).substring(1)).value = input.value ;
			input.previous_text_value = input.value ;
		}
	}
}

Workflow.prototype.get_input_value = function(input) {
	if (input.is_linked) {
		return this.get_input_selector_value(input) ;
	} else {
		return document.getElementById(this.get_input_text_area_id(input).substring(1)).value ;
	}
}

Workflow.prototype.get_input_selector_value = function(input) {
	var select = document.getElementById(this.get_input_selector_id(input).substring(1)) ;
	input.selected_id = $(this.get_input_selector_id(input)).find('option:selected').attr('id') ;
	var source = select.options[select.selectedIndex].text.replace('.', '__') ;
	return source ;
}

// ========================================================================================================== \\
// ========================================================================================================== \\
// ========================================================================================================== \\

exports.Workflow = Workflow ;
exports.Input = Input ;
exports.Output = Output ;
