angular.module('starter.controllers')
    .controller('LoginCtrl', function($scope, $rootScope, $state, $http, $ionicPopup, Const, File) {
        //国际化
        $scope.info = ONU_LOCAL.loginModule;

       
        $scope.eventFun = {
            cancelEnter: function() {
                $scope.loginInfo.ip = '';
            }
        }
        $scope.loginBtnClick = function() {
            // var info = {"CommandSrc": "LOCAL", "Command": "ACTIVE", "CommandSeq": "01234", "PASSWORD": "apppwd"};
            // var url = 'https://192.168.1.1:4433/';
            // alert('url:' + url);
            // $http.post(url,info).success(function(res){
            //  alert('success:' + JSON.stringify(res));
            // }).error(function(data, status, headers, config){
            //  alert('data:' + data + '\n'
            //        + 'status:' + status + '\n'
            //        +'headers:' + headers + '\n'
            //        +'config:' + config + '\n');
            // });
            //eeeee

            if ($rootScope.isRegistered) {
                global.isLogin = true;
                $state.go('tab.basic');
            } else {
                if (!$rootScope.registerData.key) {
                    return;
                } else if ($rootScope.isPassed()) {
                    $rootScope.registerData.date = dateUtils.getToday();
                    File.createLicense(JSON.stringify($rootScope.registerData)).then(function(success){
                        $rootScope.isRegistered = true;
                    },function(error){
                        alert(JSON.stringify(error));
                    });
                    
                }
            }
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
