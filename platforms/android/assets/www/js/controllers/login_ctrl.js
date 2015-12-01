
angular.module('starter.controllers')
	.controller('LoginCtrl', function($scope,$state,$http) {
	//国际化
	$scope.info = ONU_LOCAL.loginModule;

	$scope.goCheck = function(){
		
		// $http.post('https://www.baidu.com/',info).success(function(res){
		// 	alert(res);
		// });
		$state.go('tab.basic');
	}
});