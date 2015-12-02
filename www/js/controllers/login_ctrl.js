
angular.module('starter.controllers')
	.controller('LoginCtrl', function($scope,$state,$http) {
	//国际化
	$scope.info = ONU_LOCAL.loginModule;

	$scope.loginBtnClick = function(){
		
		// $http.post('https://www.baidu.com/',info).success(function(res){
		// 	alert(res);
		// });
		$state.go('tab.basic');
	}

	//init login page
	function initPage() {
		//default login info
		$scope.loginInfo = {
			ip: '192.168.1.1',
			username: 'admin',
			password: 'checkONT2015@FH'
		};
	}


	initPage();
});