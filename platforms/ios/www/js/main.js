require.config({
	baseUrl: 'js/',
	paths: {
		jquery: '../lib/jquery/jquery-2.1.1',
		jquerymobile: '../lib/mobile/jquery.mobile-1.4.4',
		underscore: '../lib/underscore/underscore-1.7.0',
		backbone: '../lib/backbone/backbone-1.1.2',
		text: '../lib/requirejs/text',
		pouchdb: '../lib/pouchdb/pouchdb-3.2.0.min',
		jqmdatebox: '../lib/datebox/jqm-datebox.all.amd.min',
		q: '../lib/q/q',
		templates: '../templates'
	}
});
require(['app']);
