;(function() {
	'use strict';

	var app = angular.module('EasyChat', [
		'ngRoute',
		'ngResource'
	]);

	app.config(['$routeProvider', function($routeProvider) {
		$routeProvider.when('/', {
			controller: 'Home',
			templateUrl: 'app/views/home.html'
		}).otherwise({
			redirecTo: '/'
		});
	}]).run(function() {

	});

	angular.element(window).ready(function() {
		angular.bootstrap(document.body, ['EasyChat']);
	});
})();
