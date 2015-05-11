;(function() {
	'use strict';

	var mongoose = require('mongoose');
	require('../models/easychat');
	var EasyChat = mongoose.model('EasyChat');

	module.exports = function(app) {
		app.route('/rest/messages')
			.get(function(req, res, next) {
				EasyChat.find(function(err, messages) {
					if (err) {
						console.log(err);

						return res.status(500).json(err);
					}

					return res.json(messages);
				});
			});
	};
})();
