define(function() {
	var menuItems = [
        {href: "log", label: "Log"},
        {href: "alerts", label: "Alerts"},
        {href: "alertsmap", label: "Alerts Map"},
        //{href: "frequenciesmap", label: "Frequencies Map"},
        {href: "load", label: "Alerts Loader"},
        {href: "config", label: "Configuration"}
	];
	
	return {
		getMenuItems: function() {
			var items = [];
			menuItems.forEach(function(menuItem) {
				items.push(menuItem);
			});		
			return items;
		}
	}
});