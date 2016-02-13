'use strict';

angular.module('starter.controllers')
    .controller('SetupCtrl', ['$scope', '$rootScope', '$state', 'ExpanderService', function($scope, $rootScope, $state, ExpanderService) {
        $scope.local = ONU_LOCAL.setupModule;


        $scope.del_select = [
            $scope.local.del_select.never,
            $scope.local.del_select.day,
        ];
        var autoDeleteReportExpanderConf = {
            templateUrl: 'autoDeleteReport.html',
            scope: $scope,
            backdoor: true
        };
        var autoDeleteReportExpanderHandel = ExpanderService.init(autoDeleteReportExpanderConf);
        $rootScope.expanderHandel.push(autoDeleteReportExpanderHandel);

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
        $scope.delIndex = 0;

        $scope.eventFun = {
            closeAutoDeleteReportBox: function() {
                autoDeleteReportExpanderHandel.hide();
            },
            closeWarrantyPeriodBox: function() {
                warrantyPeriodExpanderHandel.hide();

            },
            openAutoDeleteReportBox: function() {
                autoDeleteReportExpanderHandel.show();
                autoDeleteReportExpanderHandel.scope.delRange=$scope.delIndex;
            },
            openWarrantyPeriodBox: function() {
                warrantyPeriodExpanderHandel.show();
                warrantyPeriodExpanderHandel.scope.dateRange=$scope.dateIndex;
            },
            changeDeletePeriod: function(range) {
                autoDeleteReportExpanderHandel.hide();
                $scope.delIndex = range;
            },
            changeWarrantyPeriod: function(range) {
                warrantyPeriodExpanderHandel.hide();
                $scope.dateIndex = range;
            },
            reconnect: function() {
                $state.go('index');
            }
        };
    }]);
