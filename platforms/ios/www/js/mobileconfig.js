define(['jquery'], function($) {
	$(document).bind("mobileinit", function() {
	    $.mobile.linkBindingEnabled = false;
	    $.mobile.hashListeningEnabled = false;
	    $.mobile.pushStateEnabled = false;
		$.support.cors = true;
		$.mobile.allowCrossDomainPages = true;
		$.mobile.document.bind('pagehide', function (event, ui) {
    		$(event.target).remove();
  		});
  		//window.plugins.insomnia.keepAwake();
  		cordova.plugins.backgroundMode.enable();
		StatusBar.overlaysWebView(false);
	});
});