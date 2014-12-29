define([
		'jquery', 
		'backbone',
		'underscore',
		'../routers/routes',
		'text!templates/menu.html',
		'text!templates/header.html',
		'text!templates/footer.html'
		], 
function($, Backbone, _, routes, menuTemplate, headerTemplate, footerTemplate){
	var View = Backbone.View.extend({
		events: {
			"click #menu" : function() {
				$( "#menuPanel" ).panel().panel( "open" );
			},
			"click #back" : function() {
				if (this.cleanup) {
					this.cleanup();
				}
				window.history.back();
			}
		},
		initialize: function(options) {
			this.router = options.router;
			this.headerTemplate = _.template( headerTemplate )( {header: options.header } );
			this.menuTemplate = _.template( menuTemplate)( {isConnected: valentine1.isConnected(), menuItems: routes.getMenuItems()} );
			this.footerTemplate = _.template( footerTemplate)( {} );
		},
		connected: function() {
			$("#connectionIcon").attr("src", "images/v1connected.png");
			$("#menuConnectionIcon").attr("src", "images/v1connected.png");
		},
		disconnected: function() {
			$("#connectionIcon").attr("src", "images/v1disconnected.png");
			$("#menuConnectionIcon").attr("src", "images/v1disconnected.png");
		}
	});
	
	return View;
});
