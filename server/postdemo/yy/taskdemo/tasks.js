var fundel = require('./post_gh_del');
var fun = require('./post_gh');


var tasks = [];

function addTask(task) {

	tasks.push(task);

}

function next() {

	if (tasks.length > 0) {

		tasks.shift()();

	} else {

		return;

	}

}
var task1 = function() {

	fundel.deleteAll();
	console.log('task1 is finished');

	next();

}

var task2 = function() {
	fun.importDataBatch();
	console.log('task2 is finished');

	next();

}
addTask(task1);
addTask(task2);
next();