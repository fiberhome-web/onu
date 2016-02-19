'use strict';

angular.module('starter.controllers')
    .controller('BasicCtrl', ['$scope', '$rootScope', '$state', '$http', '$cordovaBarcodeScanner', 
        '$ionicPopup', 'Const', 'Report','Popup', function($scope, $rootScope, $state, $http, $cordovaBarcodeScanner, $ionicPopup, Const, Report,Popup) {



        $scope.local = ONU_LOCAL.basicModule;
        $scope.localInfo = ONU_LOCAL.report.deviceInfo;
        var data = Report.getDeviceInfo();

        //扫一扫函数
        $scope.scanBarcode = function() {
            $cordovaBarcodeScanner.scan().then(function(imageData) {
                    //扫码过程中未取消，并且条形码形式为CODE_128
                    if (!imageData.cancelled && imageData.format === 'CODE_128') {
                        var barcode = imageData.text;
                        //生产批号为12位编号
                        if (barcode.length === 12) {

                            //解析厂家代号
                            var vendor = barcode.substr(0, 2);
                            //厂家代号为字母
                            var vendorReg = /^[A-Za-z]+$/;
                            if (!vendorReg.test(vendor)) 
                            {
                                data.warranty_period.text = $scope.local.tip;
                                return;
                            }

                            //解析设备代号
                            var equipment = barcode.substr(2, 2);
                            //设备代号，用数字或字母表示
                            var equipmentReg =  /^[0-9a-zA-Z]+$/;
                            if (!equipmentReg.test(equipment)) 
                            {
                                data.warranty_period.text = $scope.local.tip;
                                return;
                            }

                            //解析年份代号
                            var year = '20' + barcode.substr(4, 2);
                            //年份代号为非数字
                            if (angular.isNumber(year)) {
                                //年份代号为数字，计算质保期截止年份
                                year = parseInt(year) + $rootScope.warrantyPeriod;
                            } else {
                                data.warranty_period.text = $scope.local.tip;
                                return;
                            }

                            //解析月份代号
                            var month = barcode.substr(6, 1);
                            var monthReg = /[A-C]/;

                            if (angular.isNumber(month)) {
                                month = parseInt(month);
                            } else if (monthReg.test(month)) {
                                month = month.charCodeAt() - 55;
                            } else {
                                data.warranty_period.text = $scope.local.tip;
                                return;
                            }

                            //解析流水号
                            var serial_number = barcode.substr(8, 4);
                            //流水号为数字
                            if (isNaN(serial_number)) {
                                data.warranty_period.text = $scope.local.tip;
                                return;
                            }

                            var today = new Date().format('yyyy-MM');
                            var endDate = new Date(year, month - 1).format('yyyy-MM');

                            if (today <= endDate) {
                                data.warranty_period.text = $scope.local.not_expired + ' ( ' + endDate + ' ) ';

                            } else {
                                data.warranty_period.text = $scope.local.overdue + ' ( ' + endDate + ' ) ';
                            }
                            // data.warranty_period.text = imageData.text;
                            $scope.deviceInfo = data;
                            Report.setDeviceInfo(data);
                        } else {
                            data.warranty_period.text = $scope.local.tip;
                        }
                    } else if (!!data.warranty_period.text) {
                        data.warranty_period.text = $scope.local.tip;
                    }
                },
                function(error) {
                    console.log("An error happened -> " + error);
                });

        }

        var myPopup;
        // Triggered on a button click, or some other target
        $scope.showTip = function(reason, msg) {
            Popup.showPop(reason, msg);
        };

   
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
                    data.led_status.text = ONU_LOCAL.enums.led_status['k_' + data.led_status.val];
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
