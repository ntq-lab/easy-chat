;(function(){
	'use strict';

	var account = require('../middlewares/account');

	module.exports = function(app) {
		app.route('/api/session')
			.get(account.getSession)
			.post(account.login);

		app.route('/api/session/register')
			.post(account.createSession);

		app.route('/api/session/forgotPassword')
			.post(account.forgotPassword);
	};
})();