'use strict';

angular.module('starter.controllers')
    .controller('SettingCtrl', ['$scope', '$rootScope', '$state', 'ExpanderService', 'DB', 'Report', function($scope, $rootScope, $state, ExpanderService, DB, Report) {
        $scope.local = ONU_LOCAL.settingModule;
        $scope.i10n = ONU_LOCAL;
        $rootScope.hideTabs = false;
        $scope.language = { checked: true };
        $scope.retention_select = [
            $scope.local.retention_time_select.day,
            $scope.local.retention_time_select.month,
            $scope.local.retention_time_select.year,
            $scope.local.retention_time_select.permanent
        ];
        //报告保留时间弹出框配置
        var reportRetentionTimeExpanderConf = {
            templateUrl: 'reportRetentionTime.html',
            scope: $scope,
            backdoor: true
        };
        var reportRetentionTimeExpanderHandel = ExpanderService.init(reportRetentionTimeExpanderConf);
        //将该句柄添加到list中，硬件返回按钮触发事件中会检查该弹出框知否已显示，若显示则隐藏。
        $rootScope.expanderHandel = [];
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

        DB.queryRetentionTime().then(function(res) {
            var length = res.rows.length;
            if (length > 0) {
                $scope.retentionIndex = res.rows.item(0).value;
            } else {
                alert('SettingCtrl read retention time failed ');
            }
        }, function(err) {
            console.error(err);
        });

        DB.queryWarrantyPeriod().then(function(res) {
            var length = res.rows.length;
            if (length > 0) {
                $scope.periodIndex = res.rows.item(0).value;
            } else {
                alert('Unable to read warranty period from DB ');
            }
        }, function(err) {
            console.error(err);
        });

        DB.queryLanguage().then(function(res) {
            
            var length = res.rows.length;
            if (length > 0) {
                if (res.rows.item(0).value === 0) {
                    $scope.language.checked = false;
                } else {
                    $scope.language.checked = true;
                }
                // alert('res.rows.item(0).value: '+res.rows.item(0).value+"$scope.language.checked:"+$scope.language.checked);
            } else {
                alert('SettingCtrl read language failed ');
            }
        }, function(err) {
            console.error(err);
        });


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
                warrantyPeriodExpanderHandel.scope.dateRange = $scope.periodIndex;
            },
            changeDeletePeriod: function(range) {
                reportRetentionTimeExpanderHandel.hide();
                $scope.retentionIndex = range;
                DB.updateRetentionTime(range);
            },
            changeWarrantyPeriod: function(range) {
                warrantyPeriodExpanderHandel.hide();
                $scope.periodIndex = range;
                DB.updateWarrantyPeriod(range);
            },
            pushLanguageChange: function() {
                var languageType;
                // alert("checked:"+$scope.language.checked);
                if($scope.language.checked){
                    languageType =1;
                }else{
                    languageType =0;
                }
                if ($scope.language.checked) {
                    ONU_LOCAL = ONU_LOCAL_EN;
                } else {
                    ONU_LOCAL = ONU_LOCAL_CN;
                }
                DB.updateLanguage(languageType);
                $rootScope.i10n = ONU_LOCAL;
                $state.go('tab.setting' ,{}, { reload: true });
            },
            reconnect: function() {
                $state.go('index');
                var emptyDeviceInfo = {};
                Report.setDeviceInfo(emptyDeviceInfo);
            }
        };
    }]);
