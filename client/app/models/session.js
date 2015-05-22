;(function(){
	'use strict';
	
	var SessionFactory = function($resource) {
		var Session = $resource('/api/session/', {

		}, {
			register: {
				method: 'POST',
				url: '/api/session/register'
			},
			forgotPassword: {
				method: 'POST',
				url: '/api/session/forgotPassword'
			}
		});
			
		return Session;
	};

	SessionFactory.$inject = ['$resource'];

	angular.module('EasyChat').factory('Session', SessionFactory);
})();