define([
		'jquery', 
		'backbone',
		'underscore',
		'./BaseView',
		'../uiconfig',
		'../util/Logger',
		'text!templates/log.html',
		'text!templates/logitem.html'], 
function($, Backbone, _, BaseView, config, Logger, template, templateItem) {
	var dtFormat = function(d) {
		function pad(val) {
			val = val + "";
			if (val.length == 1) {
				val = "0" + val;
			}
			return val;
		}
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
	var levelFormat = function(level) {
		return Logger.levelToString(level);
	};
	var View = BaseView.extend({
		events: function() {
		    return _.extend({}, BaseView.prototype.events, {
		    });	
		},
		initialize: function(options, router) {
			this.constructor.__super__.initialize.apply(this, [{
				header: {
					title: "V1 Log"
				},
				router: router
			}]);
			var logMsgs = Logger.getLogMsgs().slice(0);
			logMsgs.reverse();
			this.template = _.template( template) ( {logMsgs: logMsgs, dtFormat: dtFormat, levelFormat: levelFormat} );
			var logListener = function(logMsg) {
				$("#loglist").prepend(_.template( templateItem) ( {logMsg: logMsg, dtFormat: dtFormat, levelFormat: levelFormat} ));
				$("#loglist").listview('refresh');
			}.bind(this);
			
			Logger.addLogListener(logListener);
			var cleanup = function() {
				Logger.removeLogListener(logListener);
			}.bind(this);
			this.cleanup = cleanup;
		},
		render: function() {
			$(this.el).html( this.headerTemplate + this.template + this.menuTemplate + this.footerTemplate );
		}
	});
	
	return View;
});
