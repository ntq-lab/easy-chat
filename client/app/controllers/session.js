;(function() {
	'use strict';

	var SessionCtrl = function($scope, $location, Session) {
		$scope.error = false;
		$scope.session = new Session();

		$scope.signin = function() {
			$scope.session.$save().then(function(data) {
				$location.path('/');
			}).catch(function(err) {
				$scope.error = true;
			});
		};

		$scope.register = function() {
			$scope.session.$register().then(function(data) {
				$location.path('/');
			}).catch(function(err) {
				$scope.error = true;
			});
		};
	};

	SessionCtrl.$inject = ['$scope', '$location', 'Session'];
	angular.module('EasyChat').controller('SessionCtrl', SessionCtrl);
})();