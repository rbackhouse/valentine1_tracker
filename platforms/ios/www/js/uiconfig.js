define(function() {
	return {
		getBaseUrl : function() {
			return localStorage["geeohtrack.baseURL"];
		},
		getServerUrl : function() {
			return "https://" + this.getBaseUrl();
		},
		getWSUrl : function() {
			return 'wss://' + this.getBaseUrl();
		},
		setUrl: function(newUrl) {
			localStorage["geeohtrack.baseURL"] = newUrl;
		}
	}
});