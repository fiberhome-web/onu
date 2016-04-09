'use strict';

angular.module('starter.controllers')
    .controller('HistoryCtrl', ['$scope', '$state', '$log',
        '$ionicModal', '$rootScope', '$cordovaDatePicker', 'DB', 'File', 'ExpanderService',
        function($scope, $state, $log, $ionicModal, $rootScope,
            $cordovaDatePicker, DB, File, ExpanderService) {

            $scope.i10n = ONU_LOCAL;
            //缓存所有报告记录
            var list = [];
            //查询条件对象
            var condition = {};
            //操作状态 true表示当前是待选择 false是待取消
            $scope.operator = true;
            //ionic bug, $watch只能监视对象，prox用于挂载需要监视的属性
            $scope.prox = {};



            var today = dateUtils.getToday();

            //本地化信息
            $scope.local = ONU_LOCAL.historyModule;
            var date_select_list = [
                $scope.local.date_select.all,
                $scope.local.date_select.today,
                $scope.local.date_select.twoDays,
                $scope.local.date_select.week,
                $scope.local.date_select.month,
                $scope.local.date_select.customized
            ];

            //根据是否登录显示隐藏Tab
            if (!global.isLogin) {
                //隐藏导航栏
                $rootScope.hideTabs = true;

            }

            $rootScope.expanderHandel = [];
            var batchDeleleExpanderConf = {
                templateUrl: 'batchDelele.html',
                scope: $scope,
                backdoor: false
            };
            var batchDeleleExpanderHandel = ExpanderService.init(batchDeleleExpanderConf);
            $rootScope.expanderHandel.push(batchDeleleExpanderHandel);

            var changeDateExpanderConf = {
                templateUrl: 'changeDate.html',
                scope: $scope,
                backdoor: true
            };
            var changeDateExpanderHandel = ExpanderService.init(changeDateExpanderConf);
            $rootScope.expanderHandel.push(changeDateExpanderHandel);

            $scope.eventFun = {
                changeDateBtnEVt: function() {
                    changeDateExpanderHandel.show();
                    changeDateExpanderHandel.scope.range = $scope.range;
                },
                close: function() {
                    changeDateExpanderHandel.hide();
                },
                cancelEnter: function() {
                    $scope.prox.searchContent = '';
                },
                return: function() {
                    $state.go("index");
                    $rootScope.hideTabs = false;
                },
                viewReport: function(reportId) {
                    if(!$scope.shouldShowCheckbox){
                        $state.go('tab.report-detail', {
                        reportId: reportId,
                        reportStatus: 1
                    });
                    }
                    
                }
            };

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
                        // condition.startDate = date;
                        $scope.startDate = date;
                    } else {
                        // condition.endDate = date;
                        $scope.endDate = date;
                    }
                    // setList(filterData());
                });
            };

            //过滤日期范围
            $scope.changeDate = function(range) {
                //range为0是查询所有报告
                if (range === 0) {
                    queryAll();
                }
                //range为5是启用日期精确定位
                else if (range === 5) {
                    condition.startDate = $scope.startDate;
                    condition.endDate = $scope.endDate;
                } else {
                    // range = parseInt(range);
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
                }
                $scope.range = range;
                setList(filterData());
                changeDateExpanderHandel.hide();
                $scope.date_range = date_select_list[range];
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


            //打开“选择”窗口
            $scope.opera = function(e) {
                //如果是待选择
                if ($scope.operator) {
                    //显示checkbox
                    $scope.shouldShowCheckbox = true;
                    $scope.operation = ONU_LOCAL.historyModule.cancel;
                    //隐藏导航
                    $rootScope.hideTabs = true;
                } else {
                    $scope.operation = ONU_LOCAL.historyModule.choose;
                    cancel();
                }

                $scope.operator = !$scope.operator;

                // var delModelHeight = document.getElementById('history-operrator').offsetHeight;
                // var tabHeight = document.getElementsByClassName('tab-nav tabs')[0].offsetHeight;
                // var contentHeight = document.getElementById('historyTab').offsetHeight;
                // $scope.scrollHeight = {height:'65%'};
            };

            //当有一个checkbox选中时，显示操作框
            $scope.$watch('checkboxs', function(ckModels) {
                var ckcekOne = false;
                var num = 0;
                angular.forEach(ckModels, function(val) {
                    if (val) {
                        num++;
                        ckcekOne = true;
                        // return false;
                    }
                });
                $scope.local.del_batch = $scope.local.del + '(' + num + ')';
                if (ckcekOne) {
                    batchDeleleExpanderHandel.show();
                } else {
                    batchDeleleExpanderHandel.hide();
                }
            }, true);


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
                        // File.deleteFile(name);
                        File.removeReport(name);
                        delIds.push(id);
                    }
                }
                //从数据库删除报告数据
                DB.deleteByIds(delIds);
                queryAll();
                $scope.opera();

            };

            //单个删除
            $scope.deleteReport = function(item) {
                var id = item.id;
                var name = item.name;
                DB.deleteByIds(id);
                File.removeReport(name);
                // File.deleteFile(name);
                queryAll();
                cancel();
            };

            //“取消”操作
            function cancel() {
                //隐藏model框
                batchDeleleExpanderHandel.hide();
                //隐藏checkbox
                $scope.shouldShowCheckbox = false;
                //显示导航
                $rootScope.hideTabs = false;
            }


            function initPage() {
                $scope.isLogin = global.isLogin;

                $scope.operation = ONU_LOCAL.historyModule.choose;

                //初始化checkbox模型
                $scope.checkboxs = {};
                //初始化参数
                condition = {
                    startDate: dateUtils.getSpeDate(-6),
                    endDate: today,
                    searchContent: '',
                    type: 0
                };

                //日期范围默认选择“一周内”
                $scope.range = 3;
                $scope.date_range = date_select_list[$scope.range];

                $scope.startDate = today;
                $scope.endDate = today;
                $scope.searchContent = '';
                //报告类型默认选择“全部”
                $scope.type = 0;

                //   DB.insert(datas()); 

                // $scope.scrollHeight = {
                //     height: '70%'
                // };



                //查询所有报告记录
                queryAll();
            }


            function queryAll() {
                list = [];
                $scope.prox.loading = true;
                DB.queryAll().then(function(res) {
                    var length = res.rows.length;
                    // alert("queryAll:" + length);
                    if (length > 0) {
                        for (var i = 0; i < length; i++) {
                            var reportEle = res.rows.item(i);

                            list.push(reportEle);
                        }

                    }
                    setList(filterData());
                }, function(err) {
                    console.error(err);
                });
            }


            //设置数据
            function setList(list) {
                //如果此时是操作状态，则要关闭操作窗口
                if (!$scope.operator) {
                    $scope.opera();
                }
                $scope.list = list;
                //隐藏加载动画
                $scope.prox.loading = false;

            }


            function filterData() {
                $scope.prox.loading = true;
                var result = [];
                angular.forEach(list, function(item) {

                    //若日期选择“全部”，则不用过滤日期
                    if ($scope.range !== 0) {
                        //截取年月日，不用管时分秒
                        var date = item.date.substr(0, 10);
                        //过滤日期
                        if (date < condition.startDate || date > condition.endDate) {
                            return true;
                        }
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
