;(function(){
	'use strict';
	
	var mongoose = require('mongoose');
	var account = require('../models/account');
	var Account = mongoose.model('Account');
	var bird = require('bluebird');
	var self = module.exports;

	function findByAccount(account) {
		var query = Account.findOne({
			email: account.email,
			password: account.password
		});

		var queryexec = bird.promisify(query.exec, query);
		return queryexec().then(function(account) {
			return account;
		});
	}

	function findByEmail(email) {
		var query = Account.findOne({
			email: email
		});

		var queryexec = bird.promisify(query.exec, query);
		return queryexec().then(function(account) {
			return account;
		});
	}

	function sendMailer(toEmail) {

	}

	function createToken(req, res, message) {
		var token = new Date().getTime();

		if (!req.cookies.token) {
			res.cookie('token', token, {
			maxAge: 1e9
			});
		}

		return res.json({
			status: 200,
			message: message
			});
		}

	self.getSession = function(req, res, next) {
		if (req.cookies.token) {
			return res.json({
				status: 200,
				token: req.cookies.token
			});
		} else {
			return res.json({
				status: 500
			});
		}
	};

	self.login = function(req, res, next) {
		return findByAccount(req.body).then(function(account) {
			if (account !== null) {
				var message = 'login success';
				return createToken(req, res, message);
			} else {
				return res.json({
					status: 500,
					error: 'User not found'
				});
			}
		});
		
	};

	self.createSession = function(req, res, next) {
		return findByEmail(req.body.email).then(function(account) {
			if (account !== null) {
				return res.json({
					status: 500,
					error: 'Email exist'
				});
			}

			var query = Account({
				email: req.body.email,
				password: req.body.password,
				token: ''
			});

			var queryexec = bird.promisify(query.save, query);

			return queryexec().then(function(account) {
				var message = 'create user success!';
				return createToken(req, res, message);
			});
		});
	};

	self.forgotPassword = function(req, res, next) {
		return findByEmail(req.body.email).then(function(account) {
			if (account === null) {
				return res.json({
					status: 500,
					error: 'Email is not exist'
				});	
			}

			// set new password for account
			account.password = 'changed';

			var queryexec = bird.promisify(account.save, account);
			return queryexec().then(function(account) {
				var message = 'forgot password success!'
				return createToken(req, res, message);
			});
		});
	};
})();