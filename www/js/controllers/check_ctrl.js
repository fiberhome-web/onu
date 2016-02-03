'use strict';

angular.module('starter.controllers')
    .controller('CheckCtrl', ['$scope','$rootScope', '$state', '$http', '$stateParams', '$filter', '$ionicPopup', 'Const', 'DB', 'Report', 'ExpanderService',
        function($scope,$rootScope, $state, $http, $stateParams, $filter, $ionicPopup, Const, DB, Report, ExpanderService) {

            initPage();
            var reportId;
            var expanderConf = {
                templateUrl: 'generateReport.html',
                scope: $scope,
                backdoor: true
            };
            var expanderHandel = ExpanderService.init(expanderConf);
            $rootScope.expanderHandel.push(expanderHandel);

            $scope.saved = false;
            $scope.save_failed = false;
            // $rootScope.hideTabs=false;
            // checkStatus 0，说明是从“基本信息”界面点击“一键检测”跳过来的，检查全部项。
            var checkStatus = $stateParams.checkStatus;
            if ('0' === checkStatus) {
                checkAll();
            }

            // 界面事件处理函数
            $scope.eventFun = {
                checkPonBtnEvt: function() {
                    checkPon();
                },
                checkDataBtnEvt: function() {
                    checkData();
                },
                checkVoiceBtnEvt: function() {
                    checkVoice();
                },
                oneKeyCheckBtnEvt: function() {
                    checkAll();
                },
                generateReportBtnEVt: function() {
                    $scope.report.resultStatus = '1';
                    $scope.report.remark = null;
                    $scope.report.reportName = null;
                    $scope.saved = false;
                    $scope.save_failed = false;
                    expanderHandel.show();
                },
                close: function() {
                    expanderHandel.hide();
                },
                sureOrView: function() {
                    if ($scope.saved) {
                        viewReport();
                    } else {
                        sure();
                    }
                }
            };

            // “诊断”界面初始化
            function initPage() {
                // 生成报告默认值
                $scope.report = {
                    // 诊断结果默认“正常”
                    resultStatus: '1'
                };

                // 各检测项排序字段
                $scope.order = {
                    pon: 'pon_port_id',
                    data: 'data_port_id',
                    voice: 'voice_port_id'
                };

                // 光口诊断信息
                $scope.ponInfos = [];
                // 数据口诊断信息
                $scope.dataInfos = [];
                // 语音口诊断信息
                $scope.voiceInfos = [];


            }

            // Pon口诊断
            function checkPon() {
                $scope.isPonChecking = true;

                var url = Const.getReqUrl();
                var params = {
                    command: 'getPonPortStatus'
                };

                $http.post(url, params).success(function(response) {
                    var resultCode = response.ResultCode;

                    if (resultCode === '0') {
                        var data = response.data;

                        // 添加单位
                        angular.forEach(data, function(item) {
                            item.temperature.unit = ONU_LOCAL.unit.temperature;
                            item.voltage.unit = ONU_LOCAL.unit.voltage;
                            item.bias_current.unit = ONU_LOCAL.unit.bias_current;
                            item.tx_opt_power.unit = ONU_LOCAL.unit.opt_power;
                            item.rx_opt_power.unit = ONU_LOCAL.unit.opt_power;
                        });

                        $scope.ponInfos = data;
                    } else {
                        var resultMsg = ONU_LOCAL.enums.result_code['k_' + response.ResultCode];
                        resultMsg && alert(resultMsg);
                    }

                    $scope.isPonChecking = false;
                }).error(function(data, status) {
                    alert('data:' + data + '\n' + 'status:' + status + '\n');
                    $scope.isPonChecking = false;
                });
            }

            // 数据口诊断
            function checkData() {
                $scope.isDataChecking = true;

                var url = Const.getReqUrl();
                var params = {
                    command: 'getDataPortStatus'
                };

                $http.post(url, params).success(function(response) {
                    var resultCode = response.ResultCode;

                    if (resultCode === '0') {
                        var data = response.data;

                        //枚举转化
                        angular.forEach(data, function(item) {
                            item.port_status.text = ONU_LOCAL.enums.data_port_status['k_' + item.port_status.val];
                            item.speed.text = ONU_LOCAL.enums.data_speed['k_' + item.speed.val];
                            item.duplex.text = ONU_LOCAL.enums.data_duplex['k_' + item.duplex.val];
                        });

                        $scope.dataInfos = data;
                    } else {
                        var resultMsg = ONU_LOCAL.enums.result_code['k_' + response.ResultCode];
                        resultMsg && alert(resultMsg);
                    }

                    $scope.isDataChecking = false;
                }).error(function(data, status) {
                    alert('data:' + data + '\n' + 'status:' + status + '\n');
                    $scope.isDataChecking = false;
                });
            }

            // 语音口诊断
            function checkVoice() {
                $scope.isVoiceChecking = true;

                var url = Const.getReqUrl();
                var params = {
                    command: 'getVoicePortStatus'
                };

                $http.post(url, params).success(function(response) {
                    var resultCode = response.ResultCode;

                    if (resultCode === '0') {
                        var data = response.data;

                        //枚举转化
                        angular.forEach(data, function(item) {
                            item.protocol_type.text = ONU_LOCAL.enums.voice_protocol_type['k_' + item.protocol_type.val];
                            item.port_status.text = ONU_LOCAL.enums.voice_port_status['k_' + item.port_status.val];
                        });

                        $scope.voiceInfos = data;
                    } else {
                        var resultMsg = ONU_LOCAL.enums.result_code['k_' + response.ResultCode];
                        resultMsg && alert(resultMsg);
                    }

                    $scope.isVoiceChecking = false;
                }).error(function(data, status) {
                    alert('data:' + data + '\n' + 'status:' + status + '\n');
                    $scope.isVoiceChecking = false;
                });
            }

            // 诊断所有项（Pon、数据、语音）
            function checkAll() {
                checkPon();
                checkData();
                checkVoice();
            }

            function viewReport() {
                expanderHandel.hide();
                $rootScope.hideTabs = true;
            //    $state.go('tab.report-detail');
                 window.location.href = '#/tab/history/' + reportId;
            }

            function sure() {
                var res = $scope.report;
                saveToDB(res).then(function() {
                    expanderHandel.hideMask();
                    $scope.saved = true;

                }, function(info) {
                    alert('error :' + JSON.stringify(info));
                    expanderHandel.hideMask();
                    $scope.save_failed = true;
                });
                expanderHandel.showMask();
                // expanderHandel.hide
            }

            function saveToDB(res) {
                var deviceInfo = Report.getDeviceInfo();
                var ponPortStatus = $scope.ponInfos;
                var dataPortStatus = $scope.dataInfos;
                var voicePortStatus = $scope.voiceInfos;

                var report = {
                    deviceInfo: deviceInfo,
                    ponPortStatus: ponPortStatus,
                    dataPortStatus: dataPortStatus,
                    voicePortStatus: voicePortStatus
                };

                var now = new Date();
                var datas = {
                    id: now.getTime() + '',
                    name: res.reportName,
                    date: $filter('date')(now, 'yyyy-MM-dd HH:mm:ss'),
                    status: parseInt(res.resultStatus),
                    data: JSON.stringify(report),
                    conclusion: res.remark
                };

                reportId = datas.id;
                return DB.insert(datas);
            }

        }
    ]);
