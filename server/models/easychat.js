;(function() {
	'use strict';

	var mongoose = require('mongoose');

	var EasyChatSchema = mongoose.Schema({
		title: {
			require: true,
			type: String
		}
	});

	mongoose.model('EasyChat', EasyChatSchema);
})();
