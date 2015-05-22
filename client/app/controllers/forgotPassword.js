;(function() {
	'use strict';
	
	var ForgotPasswordCtrl = function($scope, $location, Session) {
		$scope.error = false;
		$scope.session = new Session();

		$scope.forgotPassword = function() {
			$scope.session.$forgotPassword().then(function(res) {
				$location.path('/');
			}).catch(function(err) {
				$scope.error = true;
			});
		};
	};

	ForgotPasswordCtrl.$inject = ['$scope', '$location', 'Session'];
	angular.module('EasyChat').controller('ForgotPasswordCtrl', ForgotPasswordCtrl)
})();