define(function() {
	var logMsgs = [];
	var listeners = [];
	
	return {
		ERROR: 1,
		WARN: 2,
		INFO: 3,
		TRACE: 4,
		log: function(level, msg) {
			var logMsg = {time: new Date(), msg: msg, level: level};
			logMsgs.push(logMsg);
			listeners.forEach(function(listener) {
				listener(logMsg);
			});
		},
		addLogListener: function(listener) {
			listeners.push(listener);
		},
		removeLogListener: function(listener) {
			var index = listeners.indexOf(listener);
			if (index > -1) {
				listeners.splice(index, 1);
			}
		},
		getLogMsgs: function(level) {
			if (level) {
				var msgs = [];
				logMsgs.forEach(function(msg) {
					if (msg.level === level) {
						msgs.push(msg);
					}
				});
				return msgs;
			} else {
				return logMsgs;
			}
		},
		levelToString: function(level) {
			switch (level) {
				case this.ERROR: 
					return "ERROR";
				case this.WARN: 
					return "WARN";
				case this.INFO: 
					return "INFO";
				case this.TRACE: 
					return "TRACE";
			}
		}
	}
});