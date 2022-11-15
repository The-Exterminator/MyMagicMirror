/* Magic Mirror
 * Module: MMM-Nagios
 *
 * By Michael http://github.com/The-Exterminator/MMM-Nagios
 * MIT Licensed.
 */

Module.register("MMM-Nagios", {
	defaults: {
		reloadInterval: 5 * 60 * 1000,
		showDetails: true,
		showHosts: false,
		labels: {
			"ok":"Ok",
			"warning":"Warning",
			"critical":"Critical",
			"unknown":"Unknown"
		}
	},

	init: function() {
		this.status = {};
	},

	start: function() {
		Log.info("Starting module: " + this.name );
		var self = this;
		setInterval(function() {
			self.updateDom();
		}, this.config.reloadInterval);

		this.addStatusUrl(this.config.statusUrl, this.config.username, this.config.password, this.config.reloadInterval);
	},

	getTranslations: function() {
    		return {
      		 en: "translations/en.json",
      		 da: "translations/da.json"
    		}
  	},

	getStyles: function () {
    		return [
      		"MMM-Nagios.css",
    		]
  	},

	getScripts: function() {
		return [];
	},

	notificationReceived: function(notification, payload, sender) {
		/*if (sender) {
			Log.log(this.name + " received a module notification: " + notification + " from sender: " + sender.name);
		} else {
			Log.log(this.name + " received a system notification: " + notification);
		}*/

		if(notification === "SHOW_DETAILS") {
			this.config.showDetails = !!payload;
			this.updateDom();
		}
	},

	// Override socket notification handler.
	socketNotificationReceived: function (notification, payload) {
		if (notification === "STATUS_EVENT") {
			if (this.hasStatusUrl(payload.url)) {
				this.status = payload.status;
				this.loaded = true;
			}
		} else if (notification === "FETCH_ERROR") {
			Log.error("Nagios Error. Could not fetch status: " + payload.url);
		} else if (notification === "INCORRECT_URL") {
			Log.error("Nagios Error. Incorrect url: " + payload.url);
		} else {
			Log.log("Nagios received an unknown socket notification: " + notification);
		}

		this.updateDom();
	},

	getStatusSpan: function(counts, descr, key) {
		var span = document.createElement("span");
                span.innerHTML = "<span class='bright nagios-"+key+"'>" + counts[key] + "&nbsp;" + descr + "&nbsp;&nbsp;</span>";
		return span;
	},

	getGroupDiv: function(title, state) {
		var groupDiv = document.createElement("div");

		var catHeader = document.createElement("div");
		catHeader.className = "small bright";
		catHeader.innerHTML = title;
		groupDiv.appendChild(catHeader);

		var statusMethod;
		if (this.config.showHosts) {
			statusMethod = this.getHostListWithStatus;
		} else {
			statusMethod = this.getServiceListWithStatus;
		}

		statusMethod(this.status, state).forEach(function(service, i) {
			var divRow = document.createElement("div");
			divRow.style = "display: flex; justify-content: space-between";

                        var divHost = document.createElement("span");
                        divHost.innerHTML = service.host;
                        divRow.appendChild(divHost);

			var divService = document.createElement("span");
			divService.innerHTML = service.service;
			divRow.appendChild(divService);

			groupDiv.appendChild(divRow);
		});

		return groupDiv;
	},

	getDom: function() {
		var wrapper = document.createElement("div");
		wrapper.className = "small";

		var summary = document.createElement("div");
		summary.style = "display: flex; justify-content: space-between;";

		if (!this.loaded) {
                        wrapper.innerHTML = this.translate("LOADING");
			return wrapper;
		}

		var statusTotals;
		if (this.config.showHosts) {
			statusTotals = this.getHostStatusTotals(this.status);
		} else {
			statusTotals = this.getServiceStatusTotals(this.status);
		}

                summary.appendChild(this.getStatusSpan(statusTotals, this.translate("ok"), "ok"));
                summary.appendChild(this.getStatusSpan(statusTotals, this.translate("critical"), "critical"));
		summary.appendChild(this.getStatusSpan(statusTotals, this.translate("warning"), "warning"));
		summary.appendChild(this.getStatusSpan(statusTotals, this.translate("unknown"), "unknown"));
		wrapper.appendChild(summary);

		if (this.config.showDetails) {
			if (statusTotals["critical"] > 0) {
				wrapper.appendChild(this.getGroupDiv(this.translate("critical"), "critical"));
			}
			if (statusTotals["warning"] > 0) {
				wrapper.appendChild(this.getGroupDiv(this.translate("warning"), "warning"));
			}
			if (statusTotals["unknown"] > 0) {
				wrapper.appendChild(this.getGroupDiv(this.translate("unknown"), "unknown"));
			}
		}

		return wrapper;
	},

	addStatusUrl: function(apiUrl, username, password, reloadInterval) {
		this.sendSocketNotification("ADD_STATUS_URL", {
			"apiUrl": apiUrl,
			"username": username,
			"password": password,
			"reloadInterval": reloadInterval,
		});
	},

	hasStatusUrl: function(apiUrl) {
		if(this.config.statusUrl === apiUrl) {
			return true;
		}
		return false;
	},

	getServiceListWithStatus: function(data, state) {
		var stateId = state == "ok" ? 0 : state == "warning" ? 1 : state == "critical" ? 2 : 3;

		var ret = [];
		var hostServices = data["services"];
		Object.keys(hostServices).forEach(function(hostname) {
			Object.keys(hostServices[hostname]).forEach(function(servicename) {
				var currentState = hostServices[hostname][servicename].current_state;
				if (currentState == stateId) {
					ret.push({"host": hostname, "service": servicename, "state": currentState});
				}
			});
		});
		return ret;
	},

	getServiceStatusTotals: function(data) {
		var statusCounts = {ok: 0, warning: 0, unknown: 0, critical: 0};

		var hostServices = data["services"];
		Object.keys(hostServices).forEach(function(hostname) {
			Object.keys(hostServices[hostname]).forEach(function(servicename) {
				switch(parseInt(hostServices[hostname][servicename].current_state)) {
				case 0:
					statusCounts.ok++;
					break;
				case 1:
					statusCounts.warning++;
					break;
				case 2:
					statusCounts.critical++;
					break;
				default:
					statusCounts.unknown++;
					break;
				}
			});
		});

		return statusCounts;
	},

	getHostListWithStatus: function(data, state) {
		var stateId = state == "ok" ? 0 : state == "warning" ? 1 : state == "critical" ? 2 : 3;

		var ret = [];
		var hosts = data["hosts"];
		Object.keys(hosts).forEach(function(hostname) {
			var currentState = hosts[hostname].current_state;
			if (currentState == stateId) {
				ret.push({"host": hostname, "state": currentState});
			}
		});
		return ret;
	},

	getHostStatusTotals: function(data) {
		var statusCounts = {ok: 0, warning: 0, unknown: 0, critical: 0};

		var hosts = data["hosts"];
		Object.keys(hosts).forEach(function(hostname) {
			switch(parseInt(hosts[hostname].current_state)) {
			case 0:
				statusCounts.ok++;
				break;
			case 1:
				statusCounts.warning++;
				break;
			case 2:
				statusCounts.critical++;
				break;
			default:
				statusCounts.unknown++;
				break;
			}
		});

		return statusCounts;
	},

});
