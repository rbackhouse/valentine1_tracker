define(['backbone'], function(Backbone) {
	var Alert = Backbone.Model.extend({
		defaults: {
		},
		idAttribute: "_id"
	});
	
	return Alert;
});