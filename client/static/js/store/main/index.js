var EventEmitter = require('events').EventEmitter;

class Store_MessageList extends EventEmitter {
	constructor() {
		this.contentData = null;
		this.headData = null;
	}
	getData(callback) {
		var self = this;
		fetch(
				"/data/getMessage/"
			)
			.then(function(res) {
				if (res.ok) {
					res.json().then(function(data) {
						self.contentData = data;
						callback(self.contentData);
					});
				} else {
					console.log("Looks like the response wasn't perfect, got status", res.status);
				}
			}, function(e) {
				console.log("Fetch failed!", e);
			});
	}
	getHead(callback) {
		var self = this;
		fetch(
				"/data/getHeadName/"
			)
			.then(function(res) {
				if (res.ok) {
					res.json().then(function(data) {
						self.headData = data;
						callback(self.headData);
					});
				} else {
					console.log("Looks like the response wasn't perfect, got status", res.status);
				}
			}, function(e) {
				console.log("Fetch failed!", e);
			});
	}
}

module.exports = new Store_MessageList();