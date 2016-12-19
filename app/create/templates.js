
const multiline = require('multiline')

// ========================================================================================================== \\
// ========================================================================================================== \\
// ========================================================================================================== \\

var render_step = function(step) {
	var template = multiline(function() {/*
		<div id="%s" class="width_match_parent material_grey_200">
			<header class="toolbar toolbar-header">
				<div class="flex_container_row width_match_parent padding_normal">
					<h1 id="%s" class="layout_weight_1 title text_align_left text_size_large">%s</h1>
					<button id="%s" class="btn btn-positive margin_small">
						Activate
					</button>
					<button id="%s" class="btn btn-negative margin_small">
						Remove
					</button>
				</div>
			</header>
			<div id="%s" class="display_flex flex_no_wrap workflow_step material_grey_200">
			</div>
		</div>
	*/}) ;
	template = template.replace('%s', step.get_root_div_id().substring(1)) ;
	template = template.replace('%s', step.get_title_id().substring(1)) ;
	template = template.replace('%s', step.name) ;
	template = template.replace('%s', step.get_activate_button_id().substring(1)) ;
	template = template.replace('%s', step.get_remove_button_id().substring(1)) ;
	template = template.replace('%s', step.get_content_div_id().substring(1)) ;
	return template ;
}

// ========================================================================================================== \\
// ========================================================================================================== \\
// ========================================================================================================== \\

var render_workflow = function(workflow) {
	var template = multiline(function() {/*
	<div id="%s" class="workflow_table margin_normal position_relative flex_no_shrink">
		<header class="toolbar width_match_parent padding_small">
		<div class="width_match_parent flex_container_row">
			<h1 class="title text_align_left layout_weight_1 text_size_normal">%s</h1>
			<button id="%s" class="btn btn-negative">
			Remove
			</button>
		</div>
		</header>
		<header class="toolbar workflow_item flex_container_row position_relative padding_small width_match_parent">
			<h1 class="title text_align_left layout_weight_1">Inputs</h1>
			<button id="%s" class="btn btn-mini btn-default">
				<span class="icon icon-down-open"></span>
			</button>
		</header>
		<div class="width_match_parent workflow_input_output_table">
			<table id="%s" class="table-striped table_width_match_parent">
				<thead class="width_match_parent">
					<tr>
						<th>Id</th>
						<th>Type</th>
						<th>Reference</th>
						<th>Source</th>
					</tr>
				</thead>
				<tbody class="width_match_parent">
				%s
				</tbody>
			</table>
		</div>
		<header class="toolbar workflow_item flex_container_row position_relative padding_small width_match_parent">
			<h1 class="title text_align_left layout_weight_1">Outputs</h1>
			<button id="%s" class="btn btn-mini btn-default">
				<span class="icon icon-down-open"></span>
			</button>
		</header>
		<div class="width_match_parent workflow_input_output_table">
			<table id="%s" class="table-striped table_width_match_parent">
				<thead class="width_match_parent">
					<tr>
						<th>Id</th>
						<th>Type</th>
						<th>Value</th>
					</tr>
				</thead>
				<tbody class="width_match_parent">
				%s
				</tbody>
			</table>
		</div>
		<header class="toolbar workflow_item">
		</header>
		<div class="width_match_parent" style="height: 72px">
		</div>
	</div>
	*/}) ;
	template = template.replace('%s', workflow.get_id().substring(1)) ;
	template = template.replace('%s', workflow.name) ;
	template = template.replace('%s', workflow.get_remove_button_id().substring(1)) ;
	template = template.replace('%s', workflow.get_input_table_toggle_id().substring(1)) ;
	template = template.replace('%s', workflow.get_input_table_id().substring(1))
	table = '' ;
	for (var i in workflow.inputs) {
		var input = workflow.inputs[i] ;
		var tmp = multiline(function() {/*
			<tr>
				<td>%s</td>
				<td>%s</td>
				%s
				%s
			</tr>
		*/}) ;
		tmp = tmp.replace('%s', input.id) ;
		tmp = tmp.replace('%s', input.type) ;

		tmp = tmp.replace('%s', '<td><input id="%s" type="checkbox"></input></td>') ;
		tmp = tmp.replace('%s', workflow.get_input_checkbox_id(input).substring(1)) ;

		tmp = tmp.replace('%s', '<td id="%s" class="flex_container_row">%s</td>') ;
		tmp = tmp.replace('%s', workflow.get_input_source_id(input).substring(1)) ;

		tmp = tmp.replace('%s', '<textarea id="%s" class="form-control layout_weight_1" rows="1"></textarea>') ;
		tmp = tmp.replace('%s', workflow.get_input_text_area_id(input).substring(1)) ;
		table += tmp ;
	}
	template = template.replace('%s', table) ;

	template = template.replace('%s', workflow.get_output_table_toggle_id().substring(1)) ;
	template = template.replace('%s', workflow.get_output_table_id().substring(1)) ;
	table = '' ;
	for (var i in workflow.outputs) {
		var output = workflow.outputs[i] ;
		var tmp = multiline(function() {/*
			<tr>
				<td>%s</td>
				<td>%s</td>
				<td>%s</td>
			</tr>
		*/}) ;
		tmp = tmp.replace('%s', output.id) ;
		tmp = tmp.replace('%s', output.type) ;
		tmp = tmp.replace('%s', 'N/A') ;
		table += tmp ;
	}
	template = template.replace('%s', table) ;
	return template
}

// ========================================================================================================== \\
// ========================================================================================================== \\
// ========================================================================================================== \\

exports.render_workflow = render_workflow ;
exports.render_step = render_step ;
