define([
		'jquery', 
		'backbone',
		'underscore',
		'./BaseView',
		'../db/AlertsDB',
		'../uiconfig',
		'text!templates/alertsmap.html'], 
function($, Backbone, _, BaseView, AlertsDB, config, template) {
	var View = BaseView.extend({
		events: function() {
		    return _.extend({}, BaseView.prototype.events, {
		    });	
		},
		initialize: function(data, router) {
			var options = {
				header: {
					title: "V1 Alerts Map"
				},
				router: router
			};
			this.constructor.__super__.initialize.apply(this, [options]);
			this.template = _.template( template) ( {} );
			this.pos = data.currentPos;
			this.alerts = data.alerts;
			this.markerMap = {};
		},
		render: function() {
			$(this.el).html( this.headerTemplate + this.template + this.menuTemplate + this.footerTemplate );
			var f = function() {
				var mapdiv = $("#map")[0];
				this.map = plugin.google.maps.Map.getMap(mapdiv);
				this.map.addEventListener(plugin.google.maps.event.MAP_READY, function() {
					var firstlocation = new plugin.google.maps.LatLng(this.pos.coords.latitude, this.pos.coords.longitude);
					this.map.setCenter(firstlocation);
					setTimeout(function() {
						this.map.setZoom(14);
					}.bind(this), 1000);
					
					this.alerts.each(function(alert) {
						this.placeAlert(alert);
					}.bind(this));
				}.bind(this));
			}.bind(this);
			setTimeout(f, 1000);
		},
		cleanup: function() {
			if (this.map) {
				this.map.remove();
			}
		},
		newAlert: function(alert) {
			var location = this.placeAlert(alert);
			this.map.setCenter(location);
		},
		updateAlert: function(alert) {
			var marker = this.markerMap[alert._id];
			if (marker) {
				marker.showInfoWindow();
			}
		},
		placeAlert: function(alert) {
			var highest = alert.get("highest");
			var pos = highest.positions[0];
			var band = alert.get("band");
			var frequency = alert.get("frequency");
			var strength = highest.strength;
			var location = new plugin.google.maps.LatLng(pos.latitude, pos.longitude);
			this.map.addMarker({
				'position': location,
				'title': "Band: "+ band + "\nFrequency: "+frequency+"\nStrength: "+strength
			}, function(marker) {
				this.markerMap[alert._id] = marker;
			}.bind(this));
			return location;
		}
	});
	
	return View;
});
