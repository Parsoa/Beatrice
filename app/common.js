
const ipc = require('electron').ipcRenderer ;

function nav_item_create_handler() {
	ipc.send('load-page', { path: 'file:///Users/Parsoa/Desktop/Sharif/Research/Royan/src/Beatrice/app/create/index.html' });
}

function nav_item_home_handler() {
	ipc.send('load-page', { path: 'file:///Users/Parsoa/Desktop/Sharif/Research/Royan/src/Beatrice/index.html' });
}

exports.prepare_navigation = function(current) {
	$('#nav_item_create').on('click', nav_item_create_handler) ;
	$('#nav_item_home').on('click', nav_item_home_handler) ;
	
	$('#nav_item_home').removeClass('active') ;
	$('#nav_item_create').removeClass('active') ;
	$('#nav_item_home').removeClass('active') ;
	$('#nav_item_' + current).addClass('active') ;
}
