'use strict';

angular.module('starter.controllers')
    .controller('SetupCtrl', ['$scope', '$rootScope', '$state', 'ExpanderService', function($scope, $rootScope, $state, ExpanderService) {
        $scope.local = ONU_LOCAL.setupModule;

        // $scope.del_select = $scope.local.retention_time_select;
        // $scope.date_select = $scope.local.date_select;
        $scope.retention_select = [
            $scope.local.retention_time_select.never,
            $scope.local.retention_time_select.day,
            $scope.local.retention_time_select.permanent
        ];
        var reportRetentionTimeExpanderConf = {
            templateUrl: 'autoDeleteReport.html',
            scope: $scope,
            backdoor: true
        };
        var reportRetentionTimeExpanderHandel = ExpanderService.init(reportRetentionTimeExpanderConf);
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

        $scope.dateIndex = 0;
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
                        $rootScope.warrantyPeriod = range+1;
                        break;
                    case 1:
                        $rootScope.warrantyPeriod = range+2;
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
