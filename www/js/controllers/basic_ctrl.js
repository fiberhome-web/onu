'use strict';

angular.module('starter.controllers')
    .controller('BasicCtrl', ['$scope', '$rootScope', '$state', '$http', '$cordovaBarcodeScanner', 'Const', 'Report', function($scope, $rootScope, $state, $http, $cordovaBarcodeScanner, Const, Report) {



        $scope.local = ONU_LOCAL.basicModule;
        $scope.localInfo = ONU_LOCAL.report.deviceInfo;
        var data = Report.getDeviceInfo();

        //扫一扫函数
        $scope.scanBarcode = function() {
            $cordovaBarcodeScanner.scan().then(function(imageData) {
                console.log("imageData.text -> " + imageData.text);
                data = Report.getDeviceInfo();
                data.warranty_period.text = imageData.text;
                $scope.deviceInfo = data;
                Report.setDeviceInfo(data);

            }, function(error) {
                console.log("An error happened -> " + error);
            });

        }



        //若没有请求过数据
        if ($.isEmptyObject(data)) {
            var url = Const.getReqUrl();
            var command = {
                'command': 'getDeviceInfo'
            };
            $http.post(url, command).success(function(res) {
                if (res.ResultCode === CONST.R_CODE.SUCCESS) {
                    data = res.data;
                    //检查数据是否存在,返回ecode的，存在要转化成错误内容
                    angular.forEach(data, function(item, index) {
                        if (item.ecode) {
                            item.text = item.ecode;
                        }
                    });

                    data.warranty_period = {
                        val: ONU_LOCAL.basicModule.scan_bar_code
                    };

                    //枚举转化
                    data.registration_status_led.text = ONU_LOCAL.enums.registration_status_led['k_' + data.registration_status_led.val];
                    data.onu_regist_status.text = ONU_LOCAL.enums.onu_regist_status['k_' + data.onu_regist_status.val];
                    data.onu_auth_status.text = ONU_LOCAL.enums.onu_auth_status['k_' + data.onu_auth_status.val];

                    $scope.deviceInfo = data;
                    Report.setDeviceInfo(data);
                }
            }).error(function(data, status) {
                alert('data:' + data + '\n' + 'status:' + status + '\n');
            });
        } else {
            $scope.deviceInfo = data;
        }

        //一键检测函数
        $scope.checking = function() {
            $state.go('tab.check', {
                checkStatus: 0
            });

        };
    }]);
