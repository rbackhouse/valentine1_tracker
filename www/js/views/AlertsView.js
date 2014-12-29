define([
		'jquery', 
		'backbone',
		'underscore',
		'./BaseView',
		'../uiconfig',
		'text!templates/alerts.html',
		'text!templates/alertitem.html'], 
function($, Backbone, _, BaseView, config, template, templateItem) {
	var dtFormat = function(dt) {
		function pad(val) {
			val = val + "";
			if (val.length == 1) {
				val = "0" + val;
			}
			return val;
		}
		var d = new Date(dt);
		var month = pad(d.getMonth()+1);
		var day = pad(d.getDate());
		var hour = d.getHours();
		var ampm;
		if (hour < 12) {
			ampm = "AM";
		} else {
			ampm = "PM";
		}
		if (hour == 0) {
			hour = 12;
		}
		if (hour > 12) {
			hour = hour - 12;
		}

		var mins = pad(d.getMinutes());
		var secs = pad(d.getSeconds());
		return d.getFullYear()+"-"+month+"-"+day+" "+hour+":"+mins+":"+secs+ " "+ampm;
	};
	
	var View = BaseView.extend({
		events: function() {
		    return _.extend({}, BaseView.prototype.events, {
		    });	
		},
		initialize: function(options, router) {
			this.constructor.__super__.initialize.apply(this, [{
				header: {
					title: "V1 Alerts"
				},
				router: router
			}]);
			if (options.alerts) {
				this.template = _.template( template) ( {alerts: options.alerts.toJSON(), dtFormat: dtFormat} );
				this.alerts = options.alerts;
			} else {
				this.template = _.template( template) ( {alerts: [], dtFormat: dtFormat} );
			}
		},
		render: function() {
			$(this.el).html( this.headerTemplate + this.template + this.menuTemplate + this.footerTemplate );
		},
		newAlert: function(alert) {
			$("#alertlist").prepend(_.template( templateItem) ( {alert: alert.toJSON(), dtFormat: dtFormat} ));
			$("#alertlist").listview('refresh');
		},
		updateAlert: function(alert) {
			$("#alertlist li").remove();
			this.alerts.each(function(alert) {
				$("#alertlist").append(_.template( templateItem) ( {alert: alert.toJSON(), dtFormat: dtFormat} ));
			});
			$("#alertlist").listview('refresh');
		}		
	});
	
	return View;
});
