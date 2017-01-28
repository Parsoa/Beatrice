
exports.InputParameter_Fields = ['id', 'label', 'secondaryFiles', 'description', 'inputBinding', 'default', 'type'] ;
exports.WorkflowOutputParameter_Fields = ['id', 'label', 'secondaryFiles', 'description', 'outputBinding', 'source', 'type'] ;
exports.Workflow_Fields = ['inputs', 'outputs', 'class', 'steps', 'id', 'requirements', 'hints', 'label', 'doc', 'cwlVersion'] ;
exports.CommandLineTool_Fields = [	'inputs',
									'outputs',
									'class',
									'steps',
									'id',
									'requirements',
									'hints',
									'label',
									'doc',
									'cwlVersion',
									'baseCommand',
									'arguments',
									'stdin',
									'stderr',
									'stdout',
									'successCodes',
									'temporaryFailCodes',
									'permanentFailCodes'
								] ;
