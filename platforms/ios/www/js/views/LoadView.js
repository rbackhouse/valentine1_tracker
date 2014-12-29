define([
		'jquery', 
		'backbone',
		'underscore',
		'./BaseView',
		'../db/AlertsDB',
		'../util/MessagePopup',
		'../util/Logger',
		'../uiconfig',
		'q',
		'text!templates/load.html',
		'text!templates/loadfooter.html',
		'jqmdatebox'], 
function($, Backbone, _, BaseView, AlertsDB, MessagePopup, Logger, config, Q, template, footerTemplate) {
	var View = BaseView.extend({
		events: function() {
		    return _.extend({}, BaseView.prototype.events, {
			    "click #clear" : function() {
			    	AlertsDB.destroyDatabase(function(err, info) {
			    		if (err) {
							MessagePopup.create("Clear DB", "Clear DB failed");
						} else {
							MessagePopup.create("Clear DB", "Alerts DB has been cleared");
						}
			    	});
			    },
			    "click #load" : function() {
			    	var queryparams = {
			    		start: $('#start').datebox('getTheDate'),
			    		end: $('#end').datebox('getTheDate')
			    	};
			    	var band = $('#band').val();
			    	if (band !== "all") {
			    		queryparams.band = band;
			    	}
					$.mobile.loading("show", { textVisible: false });
					AlertsDB.query(queryparams, function(data) {
						var alerts = [];
						var frequencies = {};
						var defers = [];
						
						data.rows.forEach(function(row) {
							var d = Q.defer();
							defers.push(d.promise);
							var alert = row.value;
							alerts.push(alert);
							var v = frequencies[alert.frequency];
							if (v === undefined) {
								v = frequencies[alert.frequency] = {
									frequency: alert.frequency,
									band: alert.band,
									windowUpper: alert.windowUpper,
									windowLower: alert.windowLower,
									locations: [],
									matches: []
								};
							}
							v.locations.push({ts: alert._id, pos: alert.highest.positions[0]});
							AlertsDB.queryByFrequency({windowUpper: alert.windowUpper, windowLower: alert.windowLower, band: alert.band}, function(results) {
								results.rows.forEach(function(row) {
									v.matches.push({ts: row.value._id, frequency: row.value.frequency, pos: row.value.highest.positions[0]});
								});
								d.resolve();
							});
						}.bind(this));
						Q.allSettled(defers)
						.then(function() {
							$.mobile.loading( "hide");
							MessagePopup.create("Alerts Loaded", "Alerts Loaded total = "+alerts.length);
							this.router.addAlerts(alerts);
							this.router.setFrequencies(frequencies);
						}.bind(this))
						.fail(function(err) {
							$.mobile.loading( "hide");
						});
					}.bind(this));
			    }
		    });	
		},
		initialize: function(data, router) {
			var options = {
				header: {
					title: "V1 Alerts Loader"
				},
				router: router
			};
			this.constructor.__super__.initialize.apply(this, [options]);
			this.template = _.template( template) ({});
			this.footerTemplate = _.template( footerTemplate)( {} );
		},
		render: function() {
			$(this.el).html( this.headerTemplate + this.template + this.menuTemplate + this.footerTemplate );
			
			setTimeout(function() {
				$('#start').datebox({
					calHighToday: false
				});
				$('#end').datebox({
					calHighToday: false
				});
			}, 100);
			
		}
	});
	
	return View;
});
