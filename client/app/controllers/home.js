;(function() {
	'use strict';

	var Home = function($scope) {
		$scope.title = 'Welcome Easy chat Application';
	};

	Home.$inject = ['$scope'];
	angular.module('EasyChat').controller('Home', Home);
})();
