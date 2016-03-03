angular.module('starter.controllers')
    .controller('RootCtrl', function($scope, $ionicPlatform, DB, File) {
        $scope.i10n = ONU_LOCAL;

        $ionicPlatform.ready(function() {
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
                            return;
                        default:
                            return;
                    }
                    DB.queryAll().then(function(res) {
                        var length = res.rows.length;
                        var delIds = [];
                        //报告存在
                        if (length > 0) {
                            for (var i = 0; i < length; i++) {
                                var reportEle = res.rows.item(i);
                                //报告时间早于起始时间
                                if (sDate > reportEle.date.substr(0, 10)) {
                                    File.deleteFile(reportEle.name);
                                    delIds.push(reportEle.id);
                                    alert('date:' + reportEle.date);
                                }
                            }
                            DB.deleteByIds(delIds);
                        }
                    }, function(err) {
                        console.error(err);
                    });

                    // alert('retentionTimeIndex:' + retentionTimeIndex);
                } else {
                    alert('Unable to read retention time from DB ');
                }
            }, function(err) {
                console.error(err);
            });




        }
    });
