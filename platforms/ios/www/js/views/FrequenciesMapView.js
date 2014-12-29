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
					title: "V1 Frequencies Map"
				},
				router: router
			};
			this.constructor.__super__.initialize.apply(this, [options]);
			this.template = _.template( template) ( {} );
			this.pos = data.currentPos;
			this.frequencies = data.frequencies;
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
					
					for (var frequency in this.frequencies) {
						this.placeFrequency(this.frequencies[frequency]);
					}
				}.bind(this));
			}.bind(this);
			setTimeout(f, 1000);
		},
		cleanup: function() {
			if (this.map) {
				this.map.remove();
			}
		},
		placeFrequency: function(frequency) {
			frequency.locations.forEach(function(location) {
				this.map.addMarker({
					'position': new plugin.google.maps.LatLng(location.pos.latitude, location.pos.longitude),
					'title': "Band: "+ frequency.band + "\nFrequency: "+frequency.frequency+"\nTime: "+location.ts+"\nMatches: "+frequency.matches.length,
					'icon': "www/images/Marker_Azure.png"
				}, function(marker) {
				}.bind(this));
			}.bind(this));
			var points = [];
			frequency.matches.forEach(function(match) {
				points.push(new plugin.google.maps.LatLng(match.pos.latitude, match.pos.longitude));
			});
			this.map.addPolygon({
				points: points,
				strokeWidth: 3
			}, function(polygon) {
			});
			
			/*
			frequency.matches.forEach(function(match) {
				this.map.addMarker({
					'position': new plugin.google.maps.LatLng(match.pos.latitude, match.pos.longitude),
					'title': "Band: "+ frequency.band + "\nFrequency: "+frequency.frequency+"\nTime: "+match.ts,
					'icon': "www/images/Marker_Chartreuse_full.png"
				}, function(marker) {
				}.bind(this));
			}.bind(this));
			*/
		}
	});
	
	return View;
});
