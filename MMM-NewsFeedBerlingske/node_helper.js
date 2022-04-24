/* Magic Mirror
 * Node Helper: Newsfeed
 *
 * By Michael Teeuw https://michaelteeuw.nl
 * MIT Licensed.
 */

const NodeHelper = require("node_helper");
const NewsFeedFetcher = require("./MMM-NewsFeedFetcherBerlingske.js");
const Log = require("logger");

module.exports = NodeHelper.create({
	// Override start method.
	start: function () {
		Log.log("Starting node helper for: " + this.name);
		this.fetchers = [];
	},

	// Override socketNotificationReceived received.
	socketNotificationReceived: function (notification, payload) {
		if (notification === "ADD_FEED") {
			this.createFetcher(payload.feed, payload.config);
		}
	},

	/**
	 * Creates a fetcher for a new feed if it doesn't exist yet.
	 * Otherwise it reuses the existing one.
	 *
	 * @param {object} feed The feed object.
	 * @param {object} config The configuration object.
	 */
	createFetcher: function (feed, config) {
		const url = feed.url || "";
		const encoding = feed.encoding || "UTF-8";
		const reloadInterval = feed.reloadInterval || config.reloadInterval || 5 * 60 * 1000;

		try {
			new URL(url);
		} catch (error) {
			this.sendSocketNotification("INCORRECT_URL", { url: url });
			return;
		}

		let fetcher;
		if (typeof this.fetchers[url] === "undefined") {
			Log.log("Create new news fetcher for url: " + url + " - Interval: " + reloadInterval);
			fetcher = new NewsFeedFetcher(url, reloadInterval, encoding, config.logFeedWarnings);

			fetcher.onReceive(() => {
				this.broadcastFeeds();
			});

			fetcher.onError((fetcher, error) => {
				this.sendSocketNotification("FETCH_ERROR", {
					url: fetcher.url(),
					error: error
				});
			});

			this.fetchers[url] = fetcher;
		} else {
			Log.log("Use existing news fetcher for url: " + url);
			fetcher = this.fetchers[url];
			fetcher.setReloadInterval(reloadInterval);
			fetcher.broadcastItems();
		}

		fetcher.startFetch();
	},

	/**
	 * Creates an object with all feed items of the different registered feeds,
	 * and broadcasts these using sendSocketNotification.
	 */
	broadcastFeeds: function () {
		const feeds = {};
		for (let f in this.fetchers) {
			feeds[f] = this.fetchers[f].items();
		}
		this.sendSocketNotification("NEWS_ITEMS", feeds);
	}
});
