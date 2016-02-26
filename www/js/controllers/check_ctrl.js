'use strict';

angular.module('starter.controllers')
    .controller('CheckCtrl', ['$scope', '$rootScope', '$state', '$http', 'Check', 'Popup','$timeout',
        '$stateParams', '$filter', '$ionicPopup', 'Const', 'Report', 'ExpanderService','DB','File',
        function($scope, $rootScope, $state, $http, Check, Popup,$timeout,
            $stateParams, $filter, $ionicPopup, Const, Report, ExpanderService,DB,File) {

            var timer ;
            var reportId;
            var deviceInfo;
            var expanderConf = {
                templateUrl: 'generateReport.html',
                scope: $scope,
                backdoor: true
            };
            var expanderHandel = ExpanderService.init(expanderConf);

            var suggestExpanderConf = {
                templateUrl: 'editSuggest.html',
                scope: $scope,
                backdoor: true
            };
            var suggestExpander = ExpanderService.init(suggestExpanderConf);

            $rootScope.expanderHandel.push(expanderHandel);
            $rootScope.expanderHandel.push(suggestExpander);

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
                    if (deviceInfo.sn) {
                        $scope.report.reportName = deviceInfo.sn.val;
                    }
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
                },

                showTip: function(item) {
                    Popup.showPop(item);

                },

                openEdit : function(title, item){
                    var note = item.note;
                    var reason = item.reason ? item.reason : '';
                    var msg = item.msg ? item.msg : '';
                    if(note === undefined) {
                        note = '';
                        if(reason) {
                            note = $scope.i10n.checkModule.reason + ' : \r\n' +  reason + '\r\n\r\n';
                        }
                        if(msg) {
                            note = note + $scope.i10n.checkModule.suggestion + ' : \r\n' + msg;
                        }
                        
                                 
                    }

                    $scope.editer = {
                        title : title,
                        note : note,
                        item : item
                    };
                    suggestExpander.show();
                    timer = $timeout(function(){
                        $('#editTextarea').focus();
                        $timeout.cancel( timer );
                    },100);
                },

                closeEdit : function(){
                     suggestExpander.hide();
                },

                clearEdit : function(){
                    $scope.editer.note = '';
                    timer = $timeout(function(){
                        $('#editTextarea').focus();
                        $timeout.cancel( timer );
                    },100);
                    
                },

                saveEdit : function(){
                    $scope.editer.item.note = $scope.editer.note;
                    //清空系统建议
                    $scope.editer.item.reason = null;
                    $scope.editer.item.msg = null;
                    suggestExpander.hide();
                },

                rename : function(){
                    $scope.report.reportName = '';
                    timer = $timeout(function(){
                        $('#rename').focus();
                        $timeout.cancel( timer );
                    },100);

                    $scope.isCover = false;

                },

                cover : function(){
                    $scope.isCover = false;
                    saveToDB($scope.report,2).then(function() {
                        expanderHandel.hideMask();
                        $scope.saved = true;

                    }, function(info) {
                        alert('error :' + JSON.stringify(info));
                        expanderHandel.hideMask();
                        $scope.save_failed = true;
                    });
                    expanderHandel.showMask();
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

                deviceInfo = Report.getDeviceInfo();

                // 光口诊断信息
                $scope.ponInfos = Report.getPonPortInfo();


                // 数据口诊断信息
                $scope.dataInfos = Report.getDataPortInfo();

                // 语音口诊断信息
                $scope.voiceInfos = Report.getVoicePortInfo();
            


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
                            //检测数据
                            Check.checking(CONST.TYPE.PON, item);
                        });

                        Report.setPonPortInfo(data);

                        $scope.ponInfos = Report.getPonPortInfo();
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

                            //检测数据
                            Check.checking(CONST.TYPE.DATA, item);
                        });

                        Report.setDataPortInfo(data);

                        $scope.dataInfos = Report.getDataPortInfo();

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

                        Check.checking(CONST.TYPE.VOICE, data);
                        //枚举转化
                        data.ip_mode.text = ONU_LOCAL.enums.voice_ip_mode['k_' + data.ip_mode.val];
                        data.mgc_reg_status.text = ONU_LOCAL.enums.voice_mgc_reg_status['k_' + data.mgc_reg_status.val];
                        data.protocol_type.text = ONU_LOCAL.enums.voice_protocol_type['k_' + data.protocol_type.val];
                        data.reg_mode.text = ONU_LOCAL.enums.voice_reg_mode['k_' + data.reg_mode.val];

                        angular.forEach(data.port_detail, function(item) {
                           
                            item.port_status.text = ONU_LOCAL.enums.voice_port_status['k_' + item.port_status.val];
                            item.port_enable.text = ONU_LOCAL.enums.voice_port_enable['k_' + item.port_enable.val];

                            Check.checking(CONST.TYPE.VDETAIL, item);

                            //是否需要检查port_status 标志
                            var flag = false;
                            //只有当SIP或者H248且mgc_reg_status为正常时才检查port_status
                            if(data.protocol_type.val === '4' || 
                                (data.protocol_type.val === '2' && data.mgc_reg_status.val === '1')) {
                                flag = true;
                            }

                            //当不需要检查port_status，要去除已经检查出的结果
                            if(!flag) {
                                item.port_status.warn = false;
                                item.port_status.msg = null;
                            }
                        });

                        Report.setVoicePortInfo(data);
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
                var report = $scope.report;
                //检测是否存在同名文件
                DB.queryByName($scope.report.reportName).then(function(res) {
                    var exist = res.rows.length > 0;
                    //存在则提示是否覆盖
                    if(exist) {
                        $scope.isCover = true;
                    } else {
                        saveToDB(report,1).then(function() {
                            expanderHandel.hideMask();
                            $scope.saved = true;

                        }, function(info) {
                            alert('error :' + JSON.stringify(info));
                            expanderHandel.hideMask();
                            $scope.save_failed = true;
                        });
                        expanderHandel.showMask();
                    }
                             
                }, function(err) {
                    console.error(err);
                });
            }

            function saveToDB(res, type) {

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

                //type  1: 新增 2：更新
                if(type === 1) {
                    return DB.insert(datas);
                } else if(type === 2){
                    return DB.updateData(datas);
                }
                
            }


            initPage();

        }



    ]);
