;(function() {
	'use strict';

	var bodyParser = require('body-parser');
	var express = require('express');
	var mongoose = require('mongoose');

	mongoose.connect('mongodb://localhost/easychat');

	var app = express();

	app.use(express.static(__dirname + '/../client'));

	app.use(bodyParser.json());

	// Define routes
	require('./routes/easychat')(app);

	module.exports = app;
})();
