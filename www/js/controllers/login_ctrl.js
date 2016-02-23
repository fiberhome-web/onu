angular.module('starter.controllers')
    .controller('LoginCtrl', function($scope, $rootScope, $state, $http, Const, File, LicenseService) {
        //国际化

        $scope.eventFun = {
            cancelEnter: function() {
                if ($rootScope.isRegistered) {
                    $scope.loginInfo.ip = '';
                } else {
                    $scope.registerData.key = '';
                }
            },
            keyDownEvt:function(e){
                //回车键执行按钮点击函数
                if(13===e.keyCode){
                    btnClickEvt();
                }
            },
            loginBtnClick:function(){
                btnClickEvt();
            }
        }
        
        function btnClickEvt() {
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
                if (validateIP($scope.loginInfo.ip)) {
                    global.isLogin = true;
                    $state.go('tab.basic');
                }else{
                    $scope.tip = 'ip错误';
                }
            } else {
                if (!$scope.registerData.key) {
                    $scope.tip = '不能为空';
                    return;
                } else if (LicenseService.isLicenseCorrect($scope.registerData.uuid, $scope.registerData.key)) {
                    $scope.registerData.date = dateUtils.getToday();
                    File.createLicense(JSON.stringify($scope.registerData)).then(function(success) {
                        $rootScope.isRegistered = true;
                    }, function(error) {
                        alert(JSON.stringify(error));
                    });

                } else {
                    $scope.tip = 'key 错误';
                }
            }
            LicenseService.registerData = $scope.registerData;
        }


        $scope.viewHistory = function() {
            $state.go('tab.history');
        }

        //init login page
        function initPage() {
            $scope.info = ONU_LOCAL.loginModule;
            $scope.tip = ' ';
            $scope.loginHight = {};
            $scope.loginHight.height = $(window).height() + 'px';
            //default login info
            $scope.loginInfo = {
                ip: '192.168.1.1',
                username: 'admin',
                password: 'checkONT2015@FH'
            };
            $scope.registerData = LicenseService.registerData;
        }



        initPage();

        //检测ip是否合法 , 其中255.255.255.255仍认为合法
        function validateIP(str) {
            return !!str.match(/^(?!^0{1,3}(\.0{1,3}){3}$)((25[0-5]|2[0-4]\d|[01]?\d\d?)($|(?!\.$)\.)){4}$/);
        }
    });
