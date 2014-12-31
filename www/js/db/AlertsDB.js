define(['pouchdb', '../util/Logger'], function(PouchDB, Logger) {
	var distanceBetween = function(pos1, pos2) {
		var lat1 = pos1.latitude;
		var lat2 = pos3.latitude;
		var lon1 = pos1.longitude;
		var lon2 = pos2.longitude;
		
		var R = 6371; // km
		var dLat = (lat2-lat1)*Math.PI/180;
		var dLon = (lon2-lon1)*Math.PI/180; 
		var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
				Math.cos(lat1*Math.PI/180) * Math.cos(lat2*Math.PI/180) * 
				Math.sin(dLon/2) * Math.sin(dLon/2); 
		var c = 2 * Math.asin(Math.sqrt(a)); 
		var d = R * c;
		return d;
	}
	
	var db = new PouchDB('AlertsDatabase', {adapter: 'websql'});
	db.info(function(err, info) { 
		Logger.log(Logger.INFO, "Connected to DB "+info.doc_count+ " alerts available");
	});
	return {
		addAlert: function(alert) {
			db.put(alert);
			return alert._id;
		},
		updateAlert: function(id, updated) {
			db.get(id, function(err, doc) {
				if (err) {
					Logger.log(Logger.ERROR, "Failed to get alert with id "+id+ " err: "+err.message);
					return;
				}
				db.put(updated, id, doc._rev, function(err, response) {
					if (err) {
						Logger.log(Logger.ERROR, "Failed to update alert with id "+id+ " err: "+err.message);
					}
				});
			});
		},
		getAll: function(cb) {
			db.allDocs({include_docs: true}, function(err, response) { 
				cb(response);
			});
		},
		query: function(queryparam, cb) {
			var startTime = queryparam.start.getTime();
			var endTime = queryparam.end.getTime();
			
			db.query(
				function(doc, emit) {
					var docTime = Date.parse(doc._id);
					if (docTime > startTime && docTime < endTime) {
						if (queryparam.band) { 
							if (queryparam.band === doc.band) {
								emit(doc._id, doc);
							}
						} else {
							emit(doc._id, doc);
						}
					}
				}, 
				function(err, results) { 
					cb(results);
				}
			);
		},
		queryByProximity: function(queryparam, cb) {
			db.query(
				function(doc, emit) {
					if (distanceBetween(queryparam.pos, doc.highest.positions[0]) < 0.3) {
						emit(doc._id, doc);
					}
				}, 
				function(err, results) { 
					cb(results);
				}
			);
		},
		queryByFrequency: function(queryparam, cb) {
			db.query(
				function(doc, emit) {
					if (doc.frequency <= queryparam.windowUpper && 
						doc.frequency >= queryparam.windowLower &&
						doc.band === queryparam.band) {
						emit(doc._id, doc);
					}					
				}, 
				function(err, results) { 
					cb(results);
				}
			);
		},
		destroyDatabase: function(cb) {
			db.destroy(function(err, info) { 
				cb(err, info);
			});
		}
	}
});