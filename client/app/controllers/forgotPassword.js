;(function() {
	var ForgotPasswordCtrl = function($scope, $location, Session){
		$scope.error = false;
		
        $scope.session = new Session();

        $scope.forgotPassword = function() {
            $scope.session.$forgotPassword().then(function(data) {
                console.log(data);
                $location.path('/');
            }).catch(function(err) {
                $scope.error = true;
            });
        };
	};

	ForgotPasswordCtrl.$inject = ['$scope', '$location', 'Session'];

	angular.module('EasyChat').controller('ForgotPasswordCtrl', ForgotPasswordCtrl);
})();