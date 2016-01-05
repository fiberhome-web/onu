'use strict';

angular.module('starter.controllers')
    .controller('HistoryCtrl', ['$scope', '$state', '$log',  '$ionicLoading',
         '$ionicModal', '$rootScope', '$cordovaDatePicker', 'DB',
        '$cordovaToast', 'File', 
        function($scope, $state, $log, $ionicLoading, $ionicModal,$rootScope, 
            $cordovaDatePicker, DB, $cordovaToast,File) {
            //缓存所有报告记录
            var list = [];
            //查询条件对象
            var condition = {};

            $cordovaToast.showShortCenter('再按一次退出系统');

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


            $scope.hideTabs = function() {
                $rootScope.hideTabs = true;
            };

            $scope.showTabs = function() {
                $rootScope.hideTabs = false;
            };

            $scope.login = function() {
                $state.go('index');
            };

            //下拉刷新数据
            $scope.doRefresh = function() {
                queryAll();
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
                    date = date.format('yyyy-MM-dd');
                    if (flag) {
                        condition.startDate = date;
                        $scope.startDate = date;
                    } else {
                        condition.endDate = date;
                        $scope.endDate = date;
                    }
                    setList(filterData());
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
                setList(filterData());
            };

            //过滤类型
            $scope.filterType = function(type) {
                $scope.type = type;
                condition.type = type;
                setList(filterData());
            };

            //过滤search内容
            $scope.$watch('prox.searchContent', function(newVal) {
                if (newVal === undefined) {
                    return;
                }
                if (newVal) {
                    condition.searchContent = newVal.trim();
                } else {
                    condition.searchContent = '';
                }

                setList(filterData());
            });


            //“选择”窗口初始化
            $ionicModal.fromTemplateUrl('my-modal.html', {
                scope: $scope,
                animation: 'slide-in-up',
                backdropClickToClose: false
            }).then(function(modal) {
                $scope.modal = modal;
            });

            $scope.$on('$destroy', function() {
                $scope.modal.remove();
            });

            //打开“选择”窗口
            $scope.openModal = function() {
                //隐藏导航栏
                $rootScope.hideTabs = true;
                $scope.modal.show();
                $scope.shouldShowCheckbox = true;
            };

            //批量删除操作
            $scope.batchDelele = function(e) {
                //防止冒泡
                e.stopPropagation();
                e.preventDefault();
                var checkItems = $scope.checkboxs;
                var delIds = [];
                for (var i = 0; i < list.length; i++) {
                    var id = list[i].id;
                    var name = list[i].name;
                    if (checkItems[id]) {

                        //把要删除的报告移动到删除文件夹
                        File.deleteFile(name);
                        delIds.push(id);
                    }
                }
                //从数据库删除报告数据
                DB.deleteByIds(delIds);
                $scope.cancel();
                queryAll();
                
            };

            //单个删除
            $scope.deleteReport = function(item) {
                var id = item.id;
                var name = item.name;
                DB.deleteByIds(id);
                File.deleteFile(name);
                queryAll();
                $scope.cancel();
            };

            //“取消”操作
            $scope.cancel = function(e) {
                //防止冒泡
                e.stopPropagation();
                e.preventDefault();
                //隐藏model框
                $scope.modal.hide();
                //隐藏checkbox
                $scope.shouldShowCheckbox = false;
                //显示导航
                $rootScope.hideTabs = false;
            };


            function initPage() {
                //初始化参数
                condition = {
                    startDate: dateUtils.getSpeDate(-6),
                    endDate: today,
                    searchContent: '',
                    type: 0
                };

                //日期范围默认选择“一周内”
                $scope.range = '3';
                $scope.startDate = today;
                $scope.endDate = today;
                $scope.searchContent = '';
                //报告类型默认选择“全部”
                $scope.type = 0;

                //   DB.insert(datas()); 

                //查询所有报告记录
                queryAll();
            }


            function queryAll() {
                list = [];
                $scope.prox.loadding = true;
                DB.queryAll().then(function(res) {
                    var length = res.rows.length;
                    if (length > 0) {
                        for (var i = 0; i < length; i++) {
                            list.push(res.rows.item(i));
                        }

                    }
                    setList(filterData());
                }, function(err) {
                    console.error(err);
                });
            }


            //设置数据
            function setList(list) {
                $scope.list = list;
                //隐藏加载动画
                $scope.prox.loadding = false;

            }


            function filterData() {
                $scope.prox.loadding = true;
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




        }
    ]);
