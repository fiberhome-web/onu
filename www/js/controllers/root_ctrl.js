angular.module('starter.controllers')
    .controller('RootCtrl', function($scope, $ionicPlatform, DB, File) {


        $ionicPlatform.ready(function() {
            DB.queryLanguage().then(function(res) {

                var length = res.rows.length;
                if (length > 0) {
                    if (res.rows.item(0).value === 0) {
                        ONU_LOCAL = ONU_LOCAL_CN;
                    } else {
                        ONU_LOCAL = ONU_LOCAL_EN;
                    }
                    $scope.i10n = ONU_LOCAL;
                    // alert('RootCtrl: ' + res.rows.item(0).value);
                } else {
                    alert('RootCtrl read language failed ');
                }
            }, function(err) {
                console.error(err);
            });
            
            autoDeleteReport();
        });

        //根据配置删除报告
        function autoDeleteReport() {
            var retentionTimeIndex = 0;
            var sDate = '';
            //查询报告保留时间的配置
            DB.queryRetentionTime().then(function(res) {
                var length = res.rows.length;
                //查询配置成功
                if (length > 0) {
                    retentionTimeIndex = res.rows.item(0).value;
                    // alert('retentionTimeIndex :'+retentionTimeIndex);
                    //根据配置匹配起始日期
                    switch (retentionTimeIndex) {
                        case 0:
                            sDate = dateUtils.getToday();
                            break;
                        case 1:
                            sDate = dateUtils.getSpeDate(-30);
                            break;
                        case 2:
                            sDate = dateUtils.getDayOfLastYear();
                            break;
                        case 3:
                            //永久保留报告则跳出函数，不执行下面的逻辑
                            return;
                        default:
                            return;
                    }
                    // alert('sDate :'+sDate);
                    DB.queryAll().then(function(res) {
                        var length = res.rows.length;
                        var delIds = [];
                        //报告存在
                        if (length > 0) {
                            for (var i = 0; i < length; i++) {
                                var reportEle = res.rows.item(i);

                                //报告时间早于起始时间
                                if (sDate > reportEle.date.substr(0, 10)) {
                                    File.removeReport(reportEle.name);
                                    delIds.push(reportEle.id);
                                    alert('date:' + reportEle.date);
                                }
                            }

                            if (delIds.length > 0) {
                                DB.deleteByIds(delIds).then(function(success) {
                                    alert('del successfully :' + JSON.stringify(success));
                                }, function(error) {
                                    alert('del failed :' + JSON.stringify(error));
                                });
                            }
                        }
                    }, function(err) {
                        alert('RootCtrl DB.queryAll():' + JSON.stringify(err));
                    });
                }
            }, function(err) {
                alert('RootCtrl DB.queryRetentionTime():' + JSON.stringify(err));
            });




        }
    });
