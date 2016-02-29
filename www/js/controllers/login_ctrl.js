angular.module('starter.controllers')
    .controller('LoginCtrl', function($scope, $rootScope, $state, $http, Const, File, LicenseService, Popup) {
        // .controller('LoginCtrl', function($scope, $rootScope, $state, $http, Const,Popup) {

        $scope.eventFun = {
                cancelEnter: function() {
                    if ($rootScope.isRegistered) {
                        $scope.loginInfo.ip = '';
                    } else {
                        $scope.registerData.key = '';
                    }
                },
                keyDownEvt: function(e) {
                    //回车键执行按钮点击函数
                    if (13 === e.keyCode) {
                        btnClickEvt();
                    }
                },
                loginBtnClick: function() {
                    btnClickEvt();
                }
            }
            // Popup.showTip('License is null');
        function btnClickEvt() {


            if ($rootScope.isRegistered) {
                if (validateIP($scope.loginInfo.ip)) {

                    var info = {'command': 'login', 'username': 'admin', 'password': 'checkONT2015@FH'};
                    var url = Const.getReqUrl();
                    $http.post(url,info).success(function(res){
                        if(res.ResultCode === '0') {
                            global.isLogin = true;
                        
                             $state.go('tab.basic');
                        } else {
                            alert('connected failed'+JSON.stringify(res));
                        }
                      
                    }).error(function(data, status, headers, config){
                     alert('data:' + data + '\n'
                           + 'status:' + status + '\n'
                           +'headers:' + headers + '\n'
                           +'config:' + config + '\n');
                    });

                   
                } else {
                    Popup.showTip('IP is not correct');
                    // $scope.tip = 'ip错误';
                }
            } else {
                if (!$scope.registerData.key) {
                    Popup.showTip('License is null');
                    // $scope.tip = '不能为空';
                    return;
                } else if (LicenseService.isLicenseCorrect($scope.registerData.uuid, $scope.registerData.key)) {
                    $scope.loadding = true;
                    $scope.registerData.date = dateUtils.getToday();
                    File.createLicense(JSON.stringify($scope.registerData)).then(function(success) {
                        console.info(JSON.stringify(success));
                        $rootScope.isRegistered = true;
                        $scope.loadding = false;
                        Popup.showTip('Successful registration');
                    }, function(error) {
                        $scope.loadding = false;
                        alert(JSON.stringify(error));
                    });

                } else {
                    Popup.showTip('License is not correct');
                    // $scope.tip = 'key 错误';
                }
            }
            LicenseService.registerData = $scope.registerData;

        }


        $scope.viewHistory = function() {
            $state.go('tab.history');
        }

        //init login page
        function initPage() {
            //国际化
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
            $scope.loadding = false;
            global.isLogin = false;
        }



        initPage();

        //检测ip是否合法 , 其中255.255.255.255仍认为合法
        function validateIP(str) {
            return !!str.match(/^(?!^0{1,3}(\.0{1,3}){3}$)((25[0-5]|2[0-4]\d|[01]?\d\d?)($|(?!\.$)\.)){4}$/);
        }
    });
