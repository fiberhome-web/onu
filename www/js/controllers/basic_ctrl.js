
angular.module('starter.controllers')
	.controller('BasicCtrl', function($scope,$state,$http) {

		$scope.checking = function(){
			$state.go('tab.check',{checkStatus : 0})
		}
   
});