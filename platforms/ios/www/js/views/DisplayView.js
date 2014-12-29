define([
		'jquery', 
		'backbone',
		'underscore',
		'./BaseView',
		'../uiconfig',
		'text!templates/display.html',
		'text!templates/alertitem.html'], 
function($, Backbone, _, BaseView, config, template, alertitemTemplate) {
	var View = BaseView.extend({
		events: function() {
		    return _.extend({}, BaseView.prototype.events, {
		    });	
		},
		initialize: function(router) {
			var options = {
				header: {
					title: "V1 Display"
				},
				router: router
			};
			this.constructor.__super__.initialize.apply(this, [options]);
			this.template = _.template( template) ( {} );
			
			var displayListener = function(displayData) {
				if (this.displayData && displayData.xOn != this.displayData.xOn) {
					if (displayData.xOn === true) {
						$("#x").attr("src","images/red_dot.png");
					} else {
						$("#x").attr("src","images/green_dot.png");
					}
				}
				if (this.displayData && displayData.kOn != this.displayData.kOn) {
					if (displayData.kOn === true) {
						$("#k").attr("src","images/red_dot.png");
					} else {
						$("#k").attr("src","images/green_dot.png");
					}
				}
				if (this.displayData && displayData.kaOn != this.displayData.kaOn) {
					if (displayData.kaOn === true) {
						$("#ka").attr("src","images/red_dot.png");
					} else {
						$("#ka").attr("src","images/green_dot.png");
					}
				}
				if (this.displayData && displayData.laserOn != this.displayData.laserOn) {
					if (displayData.laserOn === true) {
						$("#laser").attr("src","images/red_dot.png");
					} else {
						$("#laser").attr("src","images/green_dot.png");
					}
				}
				if (this.displayData && displayData.frontOn != this.displayData.frontOn) {
					if (displayData.frontOn === true) {
						$("#front").attr("src","css/images/icons-png/arrow-u-black.png");
					} else {
						$("#front").attr("src","css/images/icons-png/arrow-u-white.png");
					}
					$("#front").toggleClass("ui-btn-b");
				}
				if (this.displayData && displayData.sideOn != this.displayData.sideOn) {
					if (displayData.sideOn === true) {
						$("#left").attr("src","css/images/icons-png/arrow-u-black.png");
						$("#right").attr("src","css/images/icons-png/arrow-u-black.png");
					} else {
						$("#left").attr("src","css/images/icons-png/arrow-u-white.png");
						$("#right").attr("src","css/images/icons-png/arrow-u-white.png");
					}
					$("#left").toggleClass("ui-btn-b");
					$("#right").toggleClass("ui-btn-b");
				}
				if (this.displayData && displayData.rearOn != this.displayData.rearOn) {
					if (displayData.rearOn === true) {
						$("#rear").attr("src","css/images/icons-png/arrow-u-black.png");
					} else {
						$("#rear").attr("src","css/images/icons-png/arrow-u-white.png");
					}
					$("#rear").toggleClass("ui-btn-b");
				}
				this.displayData = displayData;

			}.bind(this);
			
		   	var connectionListener = function(isConnected) {
		   		if (isConnected) {
		   			valentine1.addDisplayListener(displayListener);
		   		} else {
		   			valentine1.removeDisplayListener(displayListener);
		   		}
		   	}.bind(this);
		   	
		   	valentine1.addConnectionListener(connectionListener);
		},
		render: function() {
			$(this.el).html( this.headerTemplate + this.template + this.menuTemplate + this.footerTemplate );
		}
	});
	
	return View;
});
