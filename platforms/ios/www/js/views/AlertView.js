define([
		'jquery', 
		'backbone',
		'underscore',
		'./BaseView',
		'../uiconfig',
		'text!templates/alert.html'], 
function($, Backbone, _, BaseView, config, template) {
	var View = BaseView.extend({
		events: function() {
		    return _.extend({}, BaseView.prototype.events, {
		    });	
		},
		initialize: function(data, router) {
			var options = {
				header: {
					title: "V1 Alert Map",
					backHistory: true
				},
				router: router
			};
			this.constructor.__super__.initialize.apply(this, [options]);
			this.template = _.template( template) ( {} );
			this.alert = data.alert;
		},
		render: function() {
			$(this.el).html( this.headerTemplate + this.template + this.menuTemplate + this.footerTemplate );
			var f = function() {
				var mapdiv = $("#map")[0];
				this.map = plugin.google.maps.Map.getMap(mapdiv);
				this.map.addEventListener(plugin.google.maps.event.MAP_READY, function() {
					var highest = this.alert.get("highest");
					var pos = highest.positions[0];
					var band = this.alert.get("band");
					var frequency = this.alert.get("frequency");
					var strength = highest.strength;
					var location = new plugin.google.maps.LatLng(pos.latitude, pos.longitude);
				
					this.map.setCenter(location);
					setTimeout(function() {
						this.map.setZoom(14);
					}.bind(this), 1000);
					highest.positions.forEach(function(position) {
						var location = new plugin.google.maps.LatLng(position.latitude, position.longitude);
						this.map.addMarker({
							'position': location,
							'title': "Band: "+ band + "\nFrequency: "+frequency+"\nStrength: "+strength
						}, function(marker) {
							marker.showInfoWindow();
						});
					}.bind(this));
				}.bind(this));
			}.bind(this);
			setTimeout(f, 0);
		},
		cleanup: function() {
			if (this.map) {
				this.map.remove();
			}
		}
	});
	
	return View;
});
