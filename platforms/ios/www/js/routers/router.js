define([
	'jquery', 
	'backbone', 
	'underscore',
	'jquerymobile',
	'views/DisplayView',
	"views/ConfigView",
	"views/AlertView",
	"views/AlertsView",
	"views/AlertsMapView",
	"views/FrequenciesMapView",
	"views/LogView",
	"views/LoadView",
	"models/Alert",
	"models/AlertList",
	'util/MessagePopup',
	'util/Logger',
	'db/AlertsDB'
	], 
function($, Backbone, _, mobile, DisplayView, ConfigView, AlertView, AlertsView, AlertsMapView, FrequenciesMapView, LogView, LoadView, Alert, AlertList, MessagePopup, Logger, AlertsDB) {
	window.onerror = function (errorMsg, url, lineNumber, column, errorObj) {
    	Logger.log(Logger.ERROR, 'Error: ' + errorMsg + ' Script: ' + url + ' Line: ' + lineNumber + ' Column: ' + column + ' StackTrace: ' +  errorObj);
	}
	var Router = Backbone.Router.extend({
		initialize: function(options) {
			$('.back').on('click', function(event) {
	            window.history.back();
	            return false;
	        });
	        this.on("route:display", function() {
	        	this.loadDisplayView();
			});
	        this.on("route:config", function() {
		        this.loadConfigView();
			});
	        this.on("route:alerts", function() {
				this.loadAlertsView();
			});
	        this.on("route:alertsmap", function() {
				this.loadAlertsMapView();
			});
	        this.on("route:frequenciesmap", function() {
				this.loadFrequenciesMapView();
			});
	        this.on("route:alert", function(id) {
				this.loadAlertView(id);
			});
	        this.on("route:log", function() {
				this.loadLogView();
			});
	        this.on("route:load", function() {
				this.loadLoadView();
			});
			
		   	$( document ).on( "swipeleft", ".ui-page", function( event ) {
		   		if (this.currentIndex > 1) {
					this.currentIndex = 0;
		   		} else {
					this.currentIndex++;
				}
				this.loadViewFromIndex(this.currentIndex);	
		   	}.bind(this));
		   	
		   	$( document ).on( "swiperight", ".ui-page", function( event ) {
		   		if (this.currentIndex < 1) {
					this.currentIndex = 5;
		   		} else {
					this.currentIndex--;
				}
				this.loadViewFromIndex(this.currentIndex);	
		   	}.bind(this));
		   	
		   	var currentPosition = function(position) {
		   		this.position = position;
		   	}.bind(this);
		   	var currentPositionError = function(err) {
				Logger.log(Logger.ERROR, "Geo Location error : "+JSON.stringify(err));
		   	};
		   	
			navigator.geolocation.getCurrentPosition(currentPosition, currentPositionError);
		   	this.watchId = navigator.geolocation.watchPosition(currentPosition, currentPositionError, {enableHighAccuracy: true});

		   	var alertListener = function(alertData) {
		   		if (!alertData) {
					Logger.log(Logger.INFO, "Alerts initialized");
		   			return;
		   		}
		   		var position = this.position;
				var location = new plugin.google.maps.LatLng(position.coords.latitude, position.coords.longitude);
				//Logger.log(Logger.TRACE, "Alert : count="+alertData.alertCnt+" isComplete="+alertData.isComplete);
				alertData.alerts.forEach(function(alert) {
					var add = true;
					this.alertList.each(function(currentAlert) {
						if (!currentAlert) {
							Logger.log(Logger.ERROR, "currentAlert is undefined "+this.alertList.length);
							return;
						}
						var windowUpper = currentAlert.get("windowUpper");
						var windowLower = currentAlert.get("windowLower");
						var band = currentAlert.get("band");
						var highest = currentAlert.get("highest");
						if (alert.frequency <= windowUpper && 
							alert.frequency >= windowLower &&
							band === alert.band) {
							add = false;
							var update = false;
							if (alert.normalizedSignalStregth > highest.strength) {
								highest = {
									ts: new Date().toISOString(),
									strength: alert.normalizedSignalStregth, 
									positions: [{
										latitude: position.coords.latitude, 
										longitude: position.coords.longitude
									}] 
								};
								update = true;
							} else if (alert.normalizedSignalStregth === highest.strength) {
								var found = false;
								highest.positions.forEach(function(pos) {
									if (pos.latitude === position.coords.latitude &&
										pos.longitude === position.coords.longitude) {
										found = true;
									}
								});
								if (!found) {
									highest.positions.push({latitude: position.coords.latitude, longitude: position.coords.longitude});
									update = true;
								}
							}
							currentAlert.set("highest", highest);
							currentAlert.set("direction", alert.direction);
							currentAlert.set("normalizedSignalStregth", alert.normalizedSignalStregth);
							if (update) {
								AlertsDB.queryByFrequency({windowUpper: windowUpper, windowLower: windowLower, band: alert.band}, function(results) {
									if (results.rows.length > 0) {
										//Logger.log(Logger.TRACE, "Alert found in DB : "+JSON.stringify(results.rows[0]));
										var alertToUpdate = results.rows[0].value;
										alertToUpdate.highest = highest;
										alertToUpdate.normalizedSignalStregth = alert.normalizedSignalStregth;
										AlertsDB.updateAlert(results.rows[0].id, alertToUpdate);
									}
								});
							}
							//this.alertList.set(currentAlert);
							if (this.currentPage && this.currentPage.updateAlert) {
								this.currentPage.updateAlert(currentAlert);
							}
						}
					}.bind(this));
					if (add) {
						alert._id = new Date().toISOString();
						alert.highest = {
							ts: alert._id,
							strength: alert.normalizedSignalStregth, 
							positions: [{
								latitude: position.coords.latitude, 
								longitude: position.coords.longitude
							}] 
						};
						AlertsDB.queryByFrequency({windowUpper: alert.windowUpper, windowLower: alert.windowLower, band: alert.band}, function(results) {
							if (results.rows.length < 1) {
								AlertsDB.addAlert(alert);
							}
						});
						var alertModel = new Alert(alert);
						this.alertList.add(alertModel);
						if (this.currentPage && this.currentPage.newAlert) {
							this.currentPage.newAlert(alertModel);
						}
					}
				}.bind(this));
			}.bind(this);
		   	
			var displayListener = function(displayData) {
				Logger.log(Logger.INFO, JSON.stringify(displayData));
			};
			
		   	var infoListener = function(info) {
				Logger.log(Logger.INFO, info.info);
			};			
		   	
		   	var connectionListener = function(isConnected) {
		   		if (isConnected) {
		   			valentine1.addAlertListener(alertListener);
		   			//valentine1.addDisplayListener(displayListener);
		   			valentine1.addInfoListener(infoListener);
					if (this.currentPage && this.currentPage.connected) {
						this.currentPage.connected();
					}
		   		} else {
		   			valentine1.removeAlertListener(alertListener);
		   			//valentine1.removeDisplayListener(displayListener);
		   			valentine1.removeInfoListener(infoListener);
					if (this.currentPage && this.currentPage.disconnected) {
						this.currentPage.disconnected();
					}
		   		}
		   	}.bind(this);
		   	
		   	valentine1.addConnectionListener(connectionListener);
		   	
			this.currentIndex = 0;
			this.alertList = new AlertList();   
			Backbone.history.start();
			
			var connectCallback = function(info) {
				var retry = false;
				if (info.state === "connected") {
					Logger.log(Logger.INFO, "Connected to " +info.name);
				} else if (info.state === "disconnected") {
					Logger.log(Logger.INFO, "Disconnected");
					retry = true;
				} else if (info.state === "poweredoff") {
					Logger.log(Logger.INFO, "V1 powered off");
					retry = true;
				} else if (info.state === "notfound") {
					retry = true;
				}
				if (retry) {
					setTimeout(function() {
						valentine1.connect(connectCallback);
					}, 10000);
				}
			};
			
			valentine1.connect(connectCallback);
		},
		loadDisplayView: function() {
			this.currentIndex = 4;
	        this.changePage(new DisplayView(this));
		},
		loadConfigView: function() {
			this.currentIndex = 1;
			this.changePage(new ConfigView(this));
		},
		loadAlertsView: function() {
			this.currentIndex = 2;
			this.changePage(new AlertsView({alerts: this.alertList}, this));
		},
		loadAlertsMapView: function() {
			this.currentIndex = 3;
			this.changePage(new AlertsMapView({currentPos: this.position, alerts: this.alertList}, this));
		},
		loadAlertView: function(id) {
			this.changePage(new AlertView({alert: this.alertList.get(id) }, this));
		},
		loadLogView: function() {
			this.currentIndex = 0;
			this.changePage(new LogView({}, this));
		},
		loadLoadView: function() {
			this.currentIndex = 4;
			this.changePage(new LoadView({}, this));
		},
		loadFrequenciesMapView: function() {
			this.currentIndex = 5;
			this.changePage(new FrequenciesMapView({currentPos: this.position, frequencies: this.frequencies}, this));
		},
		loadViewFromIndex: function(index) {
			switch (index) {
				case 0:
					this.loadLogView();
					break;
				case 1:
					this.loadConfigView();
					break;
				case 2:
					this.loadAlertsView();
					break;
				case 3:
					this.loadAlertsMapView();
					break;
				case 4:
					this.loadLoadView();
					break;
				case 5:
					this.loadFrequenciesMapView();
					break;
			}
		},
	    changePage:function (page) {
	    	if (this.currentPage && this.currentPage.cleanup) {
	    		this.currentPage.cleanup();
	    	}
	    	this.currentPage = page;
	        $(page.el).attr('data-role', 'page');
	        page.render();
	        $('body').append($(page.el));
	        mobile.changePage($(page.el), {changeHash:false, reverse: false});
	    },
	    addAlerts: function(alerts) {
	    	alerts.forEach(function(alert) {
				var alertModel = new Alert(alert);
				this.alertList.add(alertModel);
	    	}.bind(this));
	    },
	    setFrequencies: function(frequencies) {
	    	this.frequencies = frequencies;
	    },
		routes: {
			'display': 'display',
			'config': 'config',
			'alerts': 'alerts',
			'alertsmap': 'alertsmap',
			//'frequenciesmap': 'frequenciesmap',
			'alert/:id': 'alert',
			'log': 'log',
			'load': 'load',
			'': 'log'
		}
	});
	
	return Router;
});
