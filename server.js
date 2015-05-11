;(function() {
	'use strict';

	var app = require('./server/app');

	app.listen(3000, function() {
		console.log('Application easy-chat started at port 3000');
	});
})();
