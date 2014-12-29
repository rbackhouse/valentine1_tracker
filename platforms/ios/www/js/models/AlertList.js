// Copyright (c) 2014 Dell Boomi, Inc.

define(['backbone', './Alert'], function(Backbone, Alert) {
	var AlertList = Backbone.Collection.extend({
		model: Alert,
		initialize: function(options) {
		}
	});
	return AlertList;
});
