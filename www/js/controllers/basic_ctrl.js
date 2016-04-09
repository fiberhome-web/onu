'use strict';

angular.module('starter.controllers')
    .controller('BasicCtrl', ['$scope', '$rootScope', '$state', '$http', '$timeout', '$cordovaBarcodeScanner',
        'Const', 'Report', 'Popup', 'DB', 'ExpanderService', 'Check',
        function($scope, $rootScope, $state, $http, $timeout, $cordovaBarcodeScanner, Const, Report, Popup, DB, ExpanderService, Check) {
            $scope.i10n = ONU_LOCAL;
            var timer;
            var commentExpanderConf = {
                templateUrl: 'editComment.html',
                scope: $scope,
                backdoor: true
            };
            var commentExpander = ExpanderService.init(commentExpanderConf);

            $rootScope.expanderHandel = [];
            $rootScope.expanderHandel.push(commentExpander);

            $scope.local = ONU_LOCAL.basicModule;
            $scope.localInfo = ONU_LOCAL.reportModule.deviceInfo;

            var data = Report.getDeviceInfo();

            //判断质保期时间
            function getWarrantyPeriod(index) {
                var warrantyPeriod;
                switch (index) {
                    case 0:
                        warrantyPeriod = 1;
                        break;
                    case 1:
                        warrantyPeriod = 2;
                        break;
                    default:
                        warrantyPeriod = 2;
                        break;
                }
                return warrantyPeriod;
            }



            //扫一扫函数
            $scope.scanBarcode = function() {
                $cordovaBarcodeScanner.scan().then(function(imageData) {
                        //扫码过程中未取消，并且条形码形式为CODE_128
                        if (!imageData.cancelled) {
                            if (imageData.format === 'CODE_128') {
                                var barcode = imageData.text;
                                //生产批号为12位编号
                                if (barcode.length === 12) {

                                    //解析厂家代号
                                    var vendor = barcode.substr(0, 2);
                                    //厂家代号为字母
                                    var vendorReg = /^[A-Za-z]+$/;
                                    if (!vendorReg.test(vendor)) {
                                        data.warranty_period.text = $scope.local.tip;
                                        return;
                                    }

                                    //解析设备代号
                                    var equipment = barcode.substr(2, 2);
                                    //设备代号，用数字或字母表示
                                    var equipmentReg = /^[0-9a-zA-Z]+$/;
                                    if (!equipmentReg.test(equipment)) {
                                        data.warranty_period.text = $scope.local.tip;
                                        return;
                                    }

                                    //解析年份代号
                                    var year = '20' + barcode.substr(4, 2);
                                    //年份代号为非数字
                                    if (isNaN(year)) {
                                        data.warranty_period.text = $scope.local.tip;
                                        return;
                                    } else {
                                        //从DB读取质保期时间
                                        DB.queryWarrantyPeriod().then(function(res) {
                                            var length = res.rows.length;
                                            if (length > 0) {
                                                //年份代号为数字，计算质保期截止年份
                                                var warrantyPeriodIndex = res.rows.item(0).value;
                                                year = parseInt(year) + getWarrantyPeriod(warrantyPeriodIndex);
                                            } else {
                                                data.warranty_period.text = 'Unable to read warranty period from DB ';
                                            }
                                        }, function(err) {
                                            console.error(err);
                                            data.warranty_period.text = 'Unable to read warranty period from DB ';
                                        });
                                    }

                                    //解析月份代号
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
                            } else {
                                data.warranty_period.text = $scope.local.tip;
                            }
                        }
                    },
                    function(error) {
                        console.log("An error happened -> " + error);
                    });

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


                        //检测数据
                        Check.checking(CONST.TYPE.BASIC, data);

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

            $scope.eventFun = {
                showTip: function(item) {
                    Popup.showPop(item);

                },

                openEdit: function(title, item) {
                    var note = item.note;
                    var reason = item.reason ? item.reason : '';
                    var msg = item.msg ? item.msg : '';
                    if (note === undefined) {
                        note = '';
                        if (reason) {
                            note = $scope.i10n.checkModule.reason + ' : \r\n' + reason + '\r\n\r\n';
                        }
                        if (msg) {
                            note = note + $scope.i10n.checkModule.suggestion + ' : \r\n' + msg;
                        }


                    }

                    $scope.editer = {
                        title: title,
                        note: note,
                        item: item
                    };
                    commentExpander.show();
                    timer = $timeout(function() {
                        $('#editArea').focus();
                        $timeout.cancel(timer);
                    }, 100);

                },

                closeEdit: function() {
                    commentExpander.hide();
                },

                clearEdit: function() {
                    $scope.editer.note = '';
                    timer = $timeout(function() {
                        $('#editArea').focus();
                        $timeout.cancel(timer);
                    }, 100);

                },

                saveEdit: function() {
                    $scope.editer.item.note = $scope.editer.note;
                    //清空系统建议
                    $scope.editer.item.reason = null;
                    $scope.editer.item.msg = null;
                    commentExpander.hide();
                }
            }
        }
    ]);
