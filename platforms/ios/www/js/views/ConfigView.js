define([
		'jquery', 
		'backbone',
		'underscore',
		'./BaseView',
		'../uiconfig',
		'text!templates/config.html'], 
function($, Backbone, _, BaseView, config, template) {
	var View = BaseView.extend({
		events: function() {
		    return _.extend({}, BaseView.prototype.events, {
			    "click #save" : function() {
			    	
			    }
		    });	
		},
		initialize: function(router) {
			var options = {
				header: {
					title: "V1 Configuration"
				},
				router: router
			};
			this.constructor.__super__.initialize.apply(this, [options]);
			if (valentine1.isConnected()) {
				$.mobile.loading("show", { textVisible: false });
				valentine1.getOptions(function(options, err) {
					$.mobile.loading( "hide");
					if (options) {
						this.configData = options;
						$('#XbandOn').prop("checked", options.XbandOn).flipswitch('refresh');
						$('#KbandOn').prop("checked", options.KbandOn).flipswitch('refresh');
						$('#KAbandOn').prop("checked", options.KAbandOn).flipswitch('refresh');
						$('#KUBandOn').prop("checked", options.KUBandOn).flipswitch('refresh');
						$('#LaserOn').prop("checked", options.LaserOn).flipswitch('refresh');
						$('#KAFalseGuardOn').prop("checked", options.KAFalseGuardOn).flipswitch('refresh');
						$('#KMutingOn').prop("checked", options.KMutingOn).flipswitch('refresh');
						$('#KRearMuteOn').prop("checked", options.KRearMuteOn).flipswitch('refresh');
						$('#PopOn').prop("checked", options.PopOn).flipswitch('refresh');
						$('#EuroOn').prop("checked", options.EuroOn).flipswitch('refresh');
						$('#EuroXBandOn').prop("checked", options.EuroXBandOn).flipswitch('refresh');
						$('#FilterOn').prop("checked", options.FilterOn).flipswitch('refresh');
					}
				}.bind(this));
			}
			this.template = _.template( template) ({config: {
					XbandOn: false, 
					KbandOn: false, 
					KAbandOn: false, 
					KUBandOn: false, 
					LaserOn: false, 
					KAFalseGuardOn: false, 
					KMutingOn: false, 
					KRearMuteOn: false, 
					PopOn: false, 
					EuroOn: false, 
					EuroXBandOn: false, 
					FilterOn: false
				}			
			});
		},
		render: function() {
			$(this.el).html( this.headerTemplate + this.template + this.menuTemplate + this.footerTemplate );
		}
	});
	
	return View;
});
