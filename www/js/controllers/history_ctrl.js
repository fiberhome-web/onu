'use strict';
angular.module('starter.controllers')
    .controller('HistoryCtrl', function($scope, $state, $log, $ionicGesture, $ionicLoading,
        $ionicActionSheet, $ionicListDelegate, $ionicModal, $rootScope, $cordovaDatePicker,
        DB) {
        //缓存所有报告记录
        var list = [];
        //查询条件对象
        var condition = {};

        //ionic bug, $watch只能监视对象，prox用于挂载需要监视的属性
        $scope.prox = {};

        var today = dateUtils.getToday();

        //本地化信息
        $scope.local = ONU_LOCAL.historyModule;

        //根据是否登录显示隐藏Tab
        if (!global.isLogin) {
            //隐藏导航栏
            $rootScope.hideTabs = true;
        }


        $scope.login = function() {
            $state.go('index');
        };

        //下拉刷新数据
        $scope.doRefresh = function() {
            //关闭刷新
            $scope.$broadcast('scroll.refreshComplete');
        };

        //日期选择事件
        $scope.chooseDate = function(flag) {
            //日期配置
            var dateOptions = {
                date: new Date(),
                mode: 'date', // or 'time'
                //     minDate: new Date() - 10000,
                allowOldDates: true,
                allowFutureDates: false,
                //      doneButtonLabel: 'DONE',
                //      doneButtonColor: '#F2F3F4',
                //      cancelButtonLabel: 'CANCEL',
                //      cancelButtonColor: '#000000'
            };

            $cordovaDatePicker.show(dateOptions).then(function(date) {
                var date = date.format('yyyy-MM-dd');
                if (flag) {
                    condition.startDate = date;
                    $scope.startDate = date;
                } else {
                    condition.endDate = date;
                    $scope.endDate = date;
                }
                $scope.list = filterData();
            });
        };

        //过滤日期范围
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
            condition.startDate = sDate;
            condition.endDate = eDate;
            $scope.list = filterData();
        }

        //过滤类型
        $scope.filterType = function(type) {
            $scope.type = type;
            condition.type = type;
            $scope.list = filterData();
        }

        //过滤search内容
        $scope.$watch('prox.searchContent', function(newVal, oldval, scope) {
            if (newVal) {
                condition.searchContent = newVal.trim();
            } else {
                condition.searchContent = '';
            }

            $scope.list = filterData();
        });


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


        function initPage() {
            //初始化参数
            condition = {
                startDate: today,
                endDate: today,
                searchContent: '',
                type: 0
            };

            //日期范围默认选择“今天”
            $scope.range = "1";
            $scope.startDate = today;
            $scope.searchContent = '';
            $scope.endDate = today;
            //报告类型默认选择“全部”
            $scope.type = 0;

   //         DB.insert(datas());

            //查询所有报告记录
            DB.queryAll().then(function(res) {
                var length = res.rows.length;
                if (length > 0) {
                    for (var i = 0; i < length; i++) {
                        list.push(res.rows.item(i))
                    }
                    $scope.list = filterData();
                } else {
                    $scope.list = [];
                }
            }, function(err) {
                console.error(err);
            })
        }


        function filterData() {
            var result = [];
            angular.forEach(list, function(item, index) {
                //截取年月日，不用管时分秒
                var date = item.date.substr(0, 10);
                //过滤日期
                if (date < condition.startDate || date > condition.endDate) {
                    return true;
                }

                //过滤名称
                var search = condition.searchContent;
                if (search) {
                    if (item.name.indexOf(search) === -1) {
                        return true;
                    }
                }

                //过滤类型
                var type = condition.type;
                //repType 1为正常 2 3 4 对应其他异常
                var repType = item.status;
                //正常
                if (type === 1) {
                    if (repType !== 1) {
                        return true;
                    }
                } else if (type === 2) { //异常
                    if (repType === 1) {
                        return true;
                    }
                }

                result.push(item);
            });

            return result;
        }

        initPage();

    });
