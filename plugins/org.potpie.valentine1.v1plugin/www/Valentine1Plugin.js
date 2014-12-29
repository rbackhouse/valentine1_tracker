/*
* The MIT License (MIT)
* 
* Copyright (c) 2014 Richard Backhouse
* 
* Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"),
* to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense,
* and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
* 
* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
* 
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
* DEALINGS IN THE SOFTWARE.
*/

var alertListeners = [];
var displayListeners = [];
var displayStarted = false;
var connectionListeners = [];
var infoListeners = [];
var isConnected = false;

var valentine1 = {
	connect: function(cb) {
		cordova.exec(
			function(info) {
				if (info.state === "connected") {
					isConnected = true;
					setTimeout(function() {
						cordova.exec(
							function(alert) {
								alertListeners.forEach(function(listener) {
									listener(alert);
								});
							},
							function(err) {
							},
							"Valentine1Plugin",
							"startAlerts",
							[]
						);
						cordova.exec(
							function(info) {
								infoListeners.forEach(function(listener) {
									listener(info);
								});
							},
							function(err) {
							},
							"Valentine1Plugin",
							"startInfoListener",
							[]
						);
					}, 1000);	
				} else {
					isConnected = false;
					cordova.exec(
						function() {
						},
						function(err) {
						},
						"Valentine1Plugin",
						"stopInfoListener",
						[]
					);
				}
				cb(info);
				connectionListeners.forEach(function(listener) {
					listener(isConnected);
				});
			},
			function(err) {
				cb(err);
			},
			"Valentine1Plugin",
			"connect",
			[]
		);
	},
	disconnect: function(cb) {
		cordova.exec(
			function() {
				isConnected = false;
				cb();
				connectionListeners.forEach(function(listener) {
					listener(isConnected);
				});
			},
			function(err) {
				cb(err);
			},
			"Valentine1Plugin",
			"disconnect",
			[]
		);
	},
	getVersion: function(cb) {
		cordova.exec(
			function(version) {
				cb(version);
			},
			function(err) {
			},
			"Valentine1Plugin",
			"getVersion",
			[]
		);
	},
	getSerialNum: function(cb) {
		cordova.exec(
			function(serialNum) {
				cb(serialNum);
			},
			function(err) {
			},
			"Valentine1Plugin",
			"getSerialNum",
			[]
		);
	},
	addAlertListener: function(listener) {
		alertListeners.push(listener);
	},
	removeAlertListener: function(listener) {
		var index = alertListeners.indexOf(listener);
		if (index > -1) {
			alertListeners.splice(index, 1);
		}
	},
	addInfoListener: function(listener) {
		infoListeners.push(listener);
	},
	removeInfoListener: function(listener) {
		var index = infoListeners.indexOf(listener);
		if (index > -1) {
			infoListeners.splice(index, 1);
		}
	},
	addDisplayListener: function(listener) {
		displayListeners.push(listener);
		if (!displayStarted) {
			cordova.exec(
				function(displayData) {
					displayListeners.forEach(function(listener) {
						listener(displayData);
					});
				},
				function(err) {
				},
				"Valentine1Plugin",
				"startDisplay",
				[]
			);
			displayStarted = true;
		}
	},
	removeDisplayListener: function(listener) {
		var index = displayListeners.indexOf(listener);
		if (index > -1) {
			displayListeners.splice(index, 1);
		}
		if (displayListeners.length < 1) {
			cordova.exec(
				function() {
				},
				function(err) {
				},
				"Valentine1Plugin",
				"stopDisplay",
				[]
			);
			displayStarted = false;
		}
	},
	addConnectionListener: function(listener) {
		connectionListeners.push(listener);
	},	
	removeConnectionListener: function(listener) {
		var index = connectionListeners.indexOf(listener);
		if (index > -1) {
			connectionListeners.splice(index, 1);
		}
	},	
	getOptions: function(cb) {
		cordova.exec(
			function(options) {
				cb(options);
			},
			function(err) {
				cb(undefined, err);
			},
			"Valentine1Plugin",
			"getOptions",
			[]
		);
	},
	setOptions: function(options) {
		cordova.exec(
			function(options) {
				cb(options);
			},
			function(err) {
			},
			"Valentine1Plugin",
			"setOptions",
			[JSON.stringify(options)]
		);
	},
	isConnected: function() {
		return isConnected;
	}
}

module.exports = valentine1;
