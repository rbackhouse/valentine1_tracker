// Copyright (c) 2014 Dell Boomi, Inc.

define(['jquery', 'mobileconfig', 'routers/router'], function($, mobileconfig, router) {
	var uiRouter;
	
	function ready() {
    	console.log("ready");
    	uiRouter = new router();
	}
	
    $(document).ready(function() {
		require(['deviceReady!'], function() {
			ready();
		});
	});
	
	return {};
});
