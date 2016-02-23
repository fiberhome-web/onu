'use strict';

angular.module('starter.controllers')
    .controller('SettingCtrl', ['$scope', '$rootScope', '$state', 'ExpanderService','SettingService', function($scope, $rootScope, $state, ExpanderService,SettingService) {
        $scope.local = ONU_LOCAL.settingModule;

        $scope.retention_select = [
            $scope.local.retention_time_select.never,
            $scope.local.retention_time_select.day,
            $scope.local.retention_time_select.permanent
        ];

        //报告保留时间弹出框配置
        var reportRetentionTimeExpanderConf = {
            templateUrl: 'autoDeleteReport.html',
            scope: $scope,
            backdoor: true
        };
        var reportRetentionTimeExpanderHandel = ExpanderService.init(reportRetentionTimeExpanderConf);
        //将该句柄添加到list中，硬件返回按钮触发事件中会检查该弹出框知否已显示，若显示则隐藏。
        $rootScope.expanderHandel.push(reportRetentionTimeExpanderHandel);

        $scope.date_select = [
            $scope.local.date_select.one_year,
            $scope.local.date_select.two_years,
        ];
        var warrantyPeriodExpanderConf = {
            templateUrl: 'warrantyPeriod.html',
            scope: $scope,
            backdoor: true
        };
        var warrantyPeriodExpanderHandel = ExpanderService.init(warrantyPeriodExpanderConf);
        $rootScope.expanderHandel.push(warrantyPeriodExpanderHandel);

        $scope.dateIndex = 1;
        $scope.retentionIndex = 0;
        

        $scope.eventFun = {
            closeRetentionTimeBox: function() {
                reportRetentionTimeExpanderHandel.hide();
            },
            closeWarrantyPeriodBox: function() {
                warrantyPeriodExpanderHandel.hide();

            },
            openRetentionTimeBox: function() {
                reportRetentionTimeExpanderHandel.show();
                reportRetentionTimeExpanderHandel.scope.delRange = $scope.retentionIndex;
            },
            openWarrantyPeriodBox: function() {
                warrantyPeriodExpanderHandel.show();
                warrantyPeriodExpanderHandel.scope.dateRange = $scope.dateIndex;
            },
            changeDeletePeriod: function(range) {
                reportRetentionTimeExpanderHandel.hide();
                $scope.retentionIndex = range;
            },
            changeWarrantyPeriod: function(range) {
                warrantyPeriodExpanderHandel.hide();
                $scope.dateIndex = range;
                switch (range) {
                    case 0:
                        $rootScope.warrantyPeriod = 1;
                        break;
                    case 1:
                        $rootScope.warrantyPeriod = 2;
                        break;
                    default:
                        $rootScope.warrantyPeriod = 2;
                        break;
                }
            },
            reconnect: function() {
                $state.go('index');
            }
        };
    }]);
