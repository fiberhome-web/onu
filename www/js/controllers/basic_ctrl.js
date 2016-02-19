'use strict';

angular.module('starter.controllers')
    .controller('BasicCtrl', ['$scope', '$rootScope', '$state', '$http', '$cordovaBarcodeScanner', '$ionicPopup', 'Const', 'Report', function($scope, $rootScope, $state, $http, $cordovaBarcodeScanner, $ionicPopup, Const, Report) {



        $scope.local = ONU_LOCAL.basicModule;
        $scope.localInfo = ONU_LOCAL.report.deviceInfo;
        var data = Report.getDeviceInfo();

        //扫一扫函数
        $scope.scanBarcode = function() {
            $cordovaBarcodeScanner.scan().then(function(imageData) {
                    if (!imageData.cancelled && imageData.format === 'CODE_128') {
                        var barcode = imageData.text;
                        if (barcode.length === 12) {
                            var year = '20' + barcode.substr(4, 2);
                            if (isNaN(year)) {
                                data.warranty_period.text = $scope.local.tip;
                                return;
                            } else {
                                year = parseInt(year) + 2;
                            }
                            var month = barcode.substr(6, 1);
                            var monthReg = /[A-C]/;

                            if (!isNaN(month)) {
                                month = parseInt(month);
                            } else if (monthReg.test(month)) {
                                month = month.charCodeAt() - 55;
                            } else {
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
        $scope.showTip = function(reason,msg) {
            // An elaborate, custom popup
             myPopup = $ionicPopup.show({
                template: '<div class="warn-tip">'+
                                '<div>'+
                                '<button class="button button-stable button-clear" ng-click="closeTip()">'+
                                    '<i class="iconfont">&#xe61d;</i>'+
                                '</button>'+
                                '</div>'+
                                '<div>Reason:<br/>'+reason+
                                '</div>'+
                                '<div>Suggestion:<br/>'+msg+
                                '</div>'+
                            '</div>',
                scope: $scope
            });
        };

        $scope.closeTip=function(){
            myPopup.close();
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
