;(function() {
	'use strict';

	var app = angular.module('EasyChat', [
		'ngRoute',
		'ngResource'
	]);

	app.config(['$routeProvider', function($routeProvider) {
		$routeProvider.when('/', {
			controller: 'Home',
			templateUrl: 'app/views/home.html',
			resolve: {
				checkToken: checkToken
			}
		}).when('/signin', {
			controller: 'SessionCtrl',
			templateUrl: 'app/views/signin.html'
		}).when('/forgotPassword',{
			controller: 'ForgotPasswordCtrl',
			templateUrl: 'app/views/forgotPassword.html'
		}).otherwise({
			redirectTo: '/signin'
		});
	}]).run(function() {
		//Todo: write logic code
	});

	function checkToken($location, Session) {
        Session.get().$promise.then(function(data) {
            if (data.status === 500) {
                $location.path('/signin');
            }
        });
    };

	angular.element(window).ready(function() {
		angular.bootstrap(document.body, [ 'EasyChat' ]);
	});
})();
