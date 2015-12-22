angular.module('starter.controllers')
    .controller('CheckCtrl', function($scope, $state, $http, $stateParams, $ionicPopup, Const) {

        initPage();

        //checkStatus 0，说明是从“基本信息”界面点击“一键检测”跳过来的，检查全部项。
        var checkStatus = $stateParams.checkStatus;
        if (0 === checkStatus) {
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
                showPopup();
            }
        }

        // “诊断”界面初始化
        function initPage() {
            // 诊断结果默认“正常”
            $scope.resultStatus = "0";
            // 各检测项排序字段
            $scope.order = {
                    pon: 'pon_port_id',
                    data: 'data_port_id',
                    voice: 'voice_port_id'
                }
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
                if (response.ResultCode === '0') {
                    $scope.ponInfos = response.data;
                } else {
                }

                $scope.isPonChecking = false;
            }).error(function(data, status) {
                alert('data:' + data + '\n' + 'status:' + status + '\n');
                $scope.isPonChecking = false;
            });
        }

        // 数据口诊断
        function checkData() {
        }

        // 语音口诊断
        function checkVoice() {
        }

        // 诊断所有项（Pon、数据、语音）
        function checkAll() {
            checkPon();
            checkData();
            checkVoice();
        }

        // 显示“生成报告”弹出框
        function showPopup() {
            $scope.data = {}

            // 一个精心制作的自定义弹窗
            var myPopup = $ionicPopup.show({
                // template: '<input type="text" ng-model="data.wifi">{{localInfo.status}}',
                templateUrl: 'popup.html',
                title: '请输入报告信息',
                cssClass: 'reportPopup',
                scope: $scope,
                buttons: [{
                    text: 'Cancel'
                }, {
                    text: '<b>Save</b>',
                    type: 'button-positive',
                    onTap: function(e) {
                        if (!$scope.data.wifi) {
                            //不允许用户关闭，除非他键入wifi密码
                            e.preventDefault();
                        } else {
                            return $scope.data.wifi;
                        }
                    }
                }, ]
            });
        }

    });
