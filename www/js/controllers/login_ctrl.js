angular.module('starter.controllers')
    .controller('LoginCtrl', ['$scope', '$rootScope', '$state', '$http', '$timeout', 'Const', 'File', 'L', 'Popup',
        function($scope, $rootScope, $state, $http, $timeout, Const, File, L, Popup) {

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
            };

            function btnClickEvt() {


                if ($rootScope.isRegistered) {
                    if (validateIP($scope.loginInfo.ip)) {
                        $scope.loading = true;
                        var info = {
                            'command': 'login',
                            'username': 'admin',
                            'password': 'checkONT2015@FH'
                        };
                        var url = Const.getReqUrl();
                        $http.post(url, info, {
                            timeout: 10000
                        }).success(function(res) {
                            if (res.ResultCode === '0') {
                                global.isLogin = true;
                                $state.go('tab.basic');
                            } else {
                                Popup.showTip(ONU_LOCAL.tip.login_failed);
                                alert('connected failed' + JSON.stringify(res));
                            }
                            var timer = $timeout(function() {
                                $scope.loading = false;
                                $timeout.cancel(timer);
                            }, 1000);

                        }).error(function(data, status, headers, config) {
                            Popup.showTip(ONU_LOCAL.tip.login_failed);
                            alert('data:' + data + '\n' + 'status:' + status + '\n' + 'headers:' + headers + '\n' + 'config:' + config + '\n');
                            $scope.loading = false;
                        });


                    } else {
                        Popup.showTip(ONU_LOCAL.tip.ip_wrong);
                    }
                } else {
                    if (!$scope.registerData.key) {
                        Popup.showTip(ONU_LOCAL.tip.license_null);
                        return;
                    } else if (L.b() ===$scope.registerData.key) {
                        $scope.loading = true;
                        $scope.registerData.date = dateUtils.getToday();
                        File.createL(JSON.stringify($scope.registerData)).then(function(success) {
                            console.info(JSON.stringify(success));
                            $rootScope.isRegistered = true;
                            $scope.loading = false;
                            Popup.showTip(ONU_LOCAL.tip.successful_registration);
                        }, function(error) {
                            $scope.loading = false;
                            alert(JSON.stringify(error));
                        });

                    } else {
                        Popup.showTip(ONU_LOCAL.tip.license_wrong);
                    }
                }
                L.registerData = $scope.registerData;

            }


            $scope.viewHistory = function() {
                $state.go('tab.history');
            };

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
                $scope.registerData = L.registerData;
                $scope.loading = false;
                global.isLogin = false;
            }



            initPage();

            //检测ip是否合法 , 其中255.255.255.255仍认为合法
            function validateIP(str) {
                return !!str.match(/^(?!^0{1,3}(\.0{1,3}){3}$)((25[0-5]|2[0-4]\d|[01]?\d\d?)($|(?!\.$)\.)){4}$/);
            }
        }
    ]);
