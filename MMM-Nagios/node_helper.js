var NodeHelper = require("node_helper");
var StatusFetcher = require("./statusfetcher.js");

module.exports = NodeHelper.create({
	// Override start method.
	start: function() {
		this.fetchers = [];

		console.log("Starting node helper for: " + this.name);
	},

	// Override socketNotificationReceived method.
	socketNotificationReceived: function(notification, payload) {
		if (notification === "ADD_STATUS_URL") {
			this.createFetcher(payload.apiUrl, payload.username, payload.password, payload.reloadInterval);
		}
	},

	/* createFetcher(station)
	 * Creates a fetcher for a url if it doesn't exist yet.
	 * Otherwise it reuses the existing one.
	 *
	 * attribute url string - The URL to the status page.
	 * attribute reloadInterval number - Reload interval in milliseconds.
	 */

	createFetcher: function(apiUrl, username, password, reloadInterval) {
		var self = this;

		var fetcher;
		if (typeof self.fetchers[apiUrl] === "undefined") {
			console.log("Create new status fetcher for URL: " + apiUrl + " - Interval: " + reloadInterval);
			fetcher = new StatusFetcher(apiUrl, username, password, reloadInterval);

			fetcher.onReceive(function(fetcher) {
				self.sendSocketNotification("STATUS_EVENT", {
					url: fetcher.url(),
					status: fetcher.status()
				});
			});

			fetcher.onError(function(fetcher, error) {
				self.sendSocketNotification("FETCH_ERROR", {
					url: fetcher.url(),
					error: error
				});
			});

			self.fetchers[apiUrl] = fetcher;
		} else {
			console.log("Use existing nagios fetcher for url: " + apiUrl);
			fetcher = self.fetchers[apiUrl];
			fetcher.broadcastStatus();
		}

		fetcher.startFetch();
	}
});
