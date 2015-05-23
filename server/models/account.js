;(function(){
	'use strict';
	
	var mongoose = require('mongoose');
	var Schema = mongoose.Schema;

	var AccountSchema = new Schema({
		email: {
			type: String,
			required: true
		},
		password: {
			type: String,
			required: true
		},
		token: {
			type: String,
			default: ''
		}
	});	

	mongoose.model('Account', AccountSchema);
})();
