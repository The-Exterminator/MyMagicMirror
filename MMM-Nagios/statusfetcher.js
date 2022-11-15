var Client = require("node-rest-client").Client;

var StatusFetcher = function(url, user, pass, reloadInterval) {
	var self = this;

	var reloadTimer = null;
	var status = {};

	var fetchFailedCallback = function() {};
	var statusReceivedCallback = function() {};

	var opts = {
		mimetypes: {
			"json": ["application/json"]
		}
	};

	if (user && pass) {
		opts.user = user;
		opts.password = pass;
	}

	var apiClient = new Client(opts);
	apiClient.registerMethod("getStatus", url, "GET");

	/* fetchStatus()
	 * Initiates status fetch.
	 */
	var fetchStatus = function() {
		clearTimeout(reloadTimer);
		reloadTimer = null;

		apiClient.methods.getStatus(handleApiResponse);
	};

	var handleApiResponse = function(data, response) {
		if (data === undefined) {
			fetchFailedCallback(self, "Received data empty or invalid.");
			return;
		}

		status = data;

		self.broadcastStatus();
		scheduleTimer();
	}

	/* scheduleTimer()
	 * Schedule the timer for the next update.
	 */
	var scheduleTimer = function() {
		//console.log("Schedule update timer.");
		clearTimeout(reloadTimer);
		reloadTimer = setTimeout(function() {
			fetchStatus();
		}, reloadInterval);
	};

	/* public methods */

	/* startFetch()
	 * Initiate fetchStatus();
	 */
	this.startFetch = function() {
		fetchStatus();
	};

	/* broadcastStatus()
	 * Broadcast the existing trains.
	 */
	this.broadcastStatus = function() {
		statusReceivedCallback(self);
	};

	/* onReceive(callback)
	 * Sets the on success callback
	 *
	 * argument callback function - The on success callback.
	 */
	this.onReceive = function(callback) {
		statusReceivedCallback = callback;
	};

	/* onError(callback)
	 * Sets the on error callback
	 *
	 * argument callback function - The on error callback.
	 */
	this.onError = function(callback) {
		fetchFailedCallback = callback;
	};

	/* status()
	 * Returns the status of this fetcher.
	 *
	 * return string - The status of this fetcher.
	 */
	this.status = function() {
		return status;
	};

	/* url()
	 * Returns the url of this fetcher.
	 *
	 * return string - The url of this fetcher.
	 */
	this.url = function() {
		return url;
	};

};

module.exports = StatusFetcher;
