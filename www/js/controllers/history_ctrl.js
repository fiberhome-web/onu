angular.module('starter.controllers')
    .controller('HistoryCtrl', function($scope, $state, $log, $ionicGesture, $ionicLoading,
        $ionicActionSheet, $ionicListDelegate, $ionicModal, $rootScope, $cordovaDatePicker) {

        //本地化信息
        $scope.local = ONU_LOCAL.historyModule;

        //根据是否登录显示隐藏Tab
        if (!global.isLogin) {
            //隐藏导航栏
            $rootScope.hideTabs = true;
        }

        //报告类型默认选择“全部”
        $scope.type = 1;
        //初始化参数
        $scope.condition = {};
        //日期范围默认选择“今天”
        $scope.range = "1";



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
            $cordovaDatePicker.show(dateOptions).then(function(date) {
                if (flag) {
                    $scope.condition.startDate = date;
                } else {
                    $scope.condition.endDate = date;
                }

            });
        }



        $scope.login = function() {
            $state.go('index');
        }

        //下拉刷新数据
        $scope.doRefresh = function() {
            //关闭刷新
            $scope.$broadcast('scroll.refreshComplete');
        }


        $scope.changeDate = function(range) {
            debugger;
            alert(range)
            range = parseInt(range);
            var sDate = '';
            var eDate = '';
            switch (range) {
                case 1:
                    break;
                case 2:
                    break;
                case 3:
                    break;
                case 4:
                    break;
                    defalut: return;
                    break;
            }
        }

        $scope.$watch('condition', function(oldval, newval, state) {
        }, true);

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



        $scope.list = [{
                name: '万科魅力之城 万科魅力之城  ',
                date: '2015-11-11 11:11:11',
                status: 1,
                id: '001'
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
            },
        ];




    });
