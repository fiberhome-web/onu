'use strict';
angular.module('starter.controllers')
    .controller('HistoryCtrl', function($scope, $state, $log, $ionicGesture, $ionicLoading,
        $ionicActionSheet, $ionicListDelegate, $ionicModal, $rootScope, $cordovaDatePicker,
        DB) {
        var list = [];

        //本地化信息
        $scope.local = ONU_LOCAL.historyModule;

        //根据是否登录显示隐藏Tab
        if (!global.isLogin) {
            //隐藏导航栏
            $rootScope.hideTabs = true;
        }




        var dateOptions = {
            date: new Date(),
            mode: 'date', // or 'time'
            minDate: new Date() - 10000,
            allowOldDates: true,
            allowFutureDates: false,
            doneButtonLabel: 'DONE',
            doneButtonColor: '#F2F3F4',
            cancelButtonLabel: 'CANCEL',
            cancelButtonColor: '#000000'
        };

        //日期选择事件
        $scope.chooseDate = function(flag) {
            $scope.range = "-1";
            $cordovaDatePicker.show(dateOptions).then(function(date) {
                if (flag) {
                    $scope.condition.startDate = date.format('yyyy-MM-dd');
                } else {
                    $scope.condition.endDate = date.format('yyyy-MM-dd');
                }

            });
        };



        $scope.login = function() {
            $state.go('index');
        };

        //下拉刷新数据
        $scope.doRefresh = function() {
            //关闭刷新
            $scope.$broadcast('scroll.refreshComplete');
        };


        $scope.changeDate = function(range) {
            //range为-1是启用日期精确定位
            if (range === '-1') {
                return;
            }
            range = parseInt(range);
            var sDate = '';
            var eDate = dateUtils.getToday();
            switch (range) {
                case 1:
                    sDate = dateUtils.getToday();
                    break;
                case 2:
                    sDate = dateUtils.getSpeDate(-1);
                    break;
                case 3:
                    sDate = dateUtils.getSpeDate(-6);
                    break;
                case 4:
                    sDate = dateUtils.getSpeDate(-30);
                    break;
                default:
                    sDate = '';
                    eDate = '';
                    break;
            }
            $scope.list = filterDataByDate(list, sDate, eDate);
        }

        $scope.$watch('condition', function(oldval, newval, state) {}, true);

        $scope.show = function() {
            $ionicLoading.show({
                template: 'Loading...'
            });
        };
        $scope.hide = function() {
            $ionicLoading.hide();
        };

        $scope.onTap = function(item) {

            alert(item.id);
        }



        $scope.filterType = function(type) {
            $scope.type = type;
            if (type === 0) {
                $scope.list = list;
            } else {
                $scope.list = filterDataByType(list, type);
            }

        }

        $ionicModal.fromTemplateUrl('my-modal.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.modal = modal;
        });
        $scope.openModal = function() {
            $scope.modal.show();
        };

        $scope.batchDelele = function(e) {
            e.stopPropagation();
            e.preventDefault();
            $scope.modal.hide();
            //隐藏导航栏
            $rootScope.hideTabs = true;
            $scope.shouldShowCheckbox = true;
        }

        $scope.hideDelete = function() {
            $scope.shouldShowCheckbox = false;
            $rootScope.hideTabs = false;
        }



        list = [{
                name: '万科魅力之城 万科魅力之城  ',
                date: '2015-11-11 11:11:11',
                status: 1,
                id: '001'
            }, {
                name: '万科魅力之城 万科魅力之城 万科魅力之城 ',
                date: '2015-11-11 11:11:11',
                status: 2,
                id: '002'
            }, {
                name: '万科魅力之城 万科魅力之城 万科魅力之城 ',
                date: '2015-11-11 11:11:11',
                status: 3,
                id: '002'
            }, {
                name: '万科魅力之城 万科魅力之城 万科魅力之城 ',
                date: '2015-11-11 11:11:11',
                status: 2,
                id: '002'
            }, {
                name: '万科魅力之城 万科魅力之城 万科魅力之城 ',
                date: '2015-11-11 11:11:11',
                status: 2,
                id: '002'
            }, {
                name: '万科魅力之城 万科魅力之城 万科魅力之城 ',
                date: '2015-11-11 11:11:11',
                status: 3,
                id: '002'
            }, {
                name: '万科魅力之城 万科魅力之城 万科魅力之城 ',
                date: '2015-11-11 11:11:11',
                status: 3,
                id: '002'
            }, {
                name: '万科魅力之城 万科魅力之城 万科魅力之城 ',
                date: '2015-11-11 11:11:11',
                status: 4,
                id: '002'
            }, {
                name: '万科魅力之城 万科魅力之城 万科魅力之城 ',
                date: '2015-11-11 11:11:11',
                status: 4,
                id: '002'
            }, {
                name: '万科魅力之城 万科魅力之城 万科魅力之城 ',
                date: '2015-11-11 11:11:11',
                status: 0,
                id: '002'
            }, {
                name: '万科魅力之城 万科魅力之城 万科魅力之城 ',
                date: '2015-11-11 11:11:11',
                status: 0,
                id: '002'
            }, {
                name: '万科魅力之城 万科魅力之城 万科魅力之城 ',
                date: '2015-11-11 11:11:11',
                status: 0,
                id: '002'
            }, {
                name: '万科魅力之城 万科魅力之城 万科魅力之城 ',
                date: '2015-11-11 11:11:11',
                status: 0,
                id: '002'
            }, {
                name: '万科魅力之城 万科魅力之城 万科魅力之城 ',
                date: '2015-11-11 11:11:11',
                status: 0,
                id: '002'
            }, {
                name: '万科魅力之城 万科魅力之城 万科魅力之城 ',
                date: '2015-11-11 11:11:11',
                status: 0,
                id: '002'
            }, {
                name: '万科魅力之城 万科魅力之城 万科魅力之城 ',
                date: '2015-11-11 11:11:11',
                status: 0,
                id: '002'
            }, {
                name: '万科魅力之城 万科魅力之城 万科魅力之城 ',
                date: '2015-11-11 11:11:11',
                status: 0,
                id: '002'
            }, {
                name: '万科魅力之城 万科魅力之城 万科魅力之城 ',
                date: '2015-11-11 11:11:11',
                status: 0,
                id: '002'
            }, {
                name: '万科魅力之城 万科魅力之城 万科魅力之城 ',
                date: '2015-11-11 11:11:11',
                status: 0,
                id: '002'
            }, {
                name: '万科魅力之城 万科魅力之城 万科魅力之城 ',
                date: '2015-11-11 11:11:11',
                status: 0,
                id: '002'
            }, {
                name: '万科魅力之城 万科魅力之城 万科魅力之城 ',
                date: '2015-11-11 11:11:11',
                status: 0,
                id: '002'
            }, {
                name: '万科魅力之城 万科魅力之城 万科魅力之城 ',
                date: '2015-11-11 11:11:11',
                status: 0,
                id: '002'
            }, {
                name: '万科魅力之城 万科魅力之城 万科魅力之城 ',
                date: '2015-11-11 11:11:11',
                status: 0,
                id: '002'
            }, {
                name: '万科魅力之城 万科魅力之城 万科魅力之城 ',
                date: '2015-11-11 11:11:11',
                status: 0,
                id: '002'
            },

            {
                name: '万科魅力之城 万科魅力之城22333  ',
                date: '2015-11-11 11:11:11',
                status: 1,
                id: '003'
            }
        ];



        function initPage() {
            //报告类型默认选择“全部”
            $scope.type = 0;
            //初始化参数
            $scope.condition = {};
            //日期范围默认选择“今天”
            $scope.range = "1";
            $scope.condition.startDate = dateUtils.getToday();
            $scope.condition.endDate = dateUtils.getToday();

            DB.queryAll().then(function(res) {
                if (res.rows.length > 0) {
                    list = res.rows;
                    $scope.list = list;
                } else {
                    $scope.list = [];
                }
            }, function(err) {
                console.error(err);
            })
        }


        //根据日期过滤数据
        function filterDataByDate(datas, sDate, eDate) {
            var result = [];
            angular.forEach(datas, function(item, index) {
                //截取年月日，不用管时分秒
                var date = item.date.substr(0, 10);
                if (date >= sDate && date <= eDate) {
                    result.push(item);
                }
            });
            return result;
        }

        //根据状态过滤数据
        function filterDataByType(datas, type) {
            var normal = [];
            var abnormal = [];

            angular.forEach(datas, function(item, index) {
                if (item.status === 1) {
                    normal.push(item);
                } else {
                    abnormal.push(item);
                }
            });


            return type === 1 ? normal : abnormal;
        }


        initPage();


    });
