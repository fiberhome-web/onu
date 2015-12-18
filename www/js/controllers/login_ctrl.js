angular.module('starter.controllers')
    .controller('LoginCtrl', function($scope, $state, $http, Const) {
        //国际化
        $scope.info = ONU_LOCAL.loginModule;

        $scope.loginBtnClick = function() {
            // var info = {"CommandSrc": "LOCAL", "Command": "ACTIVE", "CommandSeq": "01234", "PASSWORD": "apppwd"};
            // var url = 'https://192.168.1.1:4433/';
            // alert('url:' + url);
            // $http.post(url,info).success(function(res){
            // 	alert('success:' + JSON.stringify(res));
            // }).error(function(data, status, headers, config){
            // 	alert('data:' + data + '\n'
            // 		  + 'status:' + status + '\n'
            // 		  +'headers:' + headers + '\n'
            // 		  +'config:' + config + '\n');
            // });
            $state.go('tab.basic');
        }


        $scope.viewHistory = function() {
        	$state.go('tab.history');
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
