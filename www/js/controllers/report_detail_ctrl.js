'use strict';
angular.module('starter.controllers')
    .controller('ReportDetailCtrl', function($scope, $state, $http, $ionicHistory,
        $stateParams, DB, $ionicPopup, $ionicModal, $ionicPopover, File) {

        $scope.reportLocal = ONU_LOCAL.report;

        //获取report id
        var id = $stateParams.reportId;

        //登录按钮事件
        $scope.back = function() {
            $ionicHistory.goBack();
        };


        //根据查询报告并渲染数据
        DB.queryById(id).then(function(res) {
            var item = res.rows.item(0);
            $scope.report = item;
            $scope.detail = JSON.parse(item.data);

            //查看报告文件是否生成过，没有则生成报告
            File.checkFile(item.name).then(function() {}, function(error) {
                //如果code为1说明没有找到文件，则要生成报告文件
                if (error.code === 1) {
                	//延时1s生成报告，防止angular没有将页面没有渲染完成
                    setTimeout(function() {
                        //创建报告
                        File.createReport(item.name, document.getElementById('report').innerHTML);
                    }, 1000);
                }
            });

        });





        //document.getElementById('report').innerHTML


        // .fromTemplateUrl() 方法
        $ionicPopover.fromTemplateUrl('my-popover.html', {
            scope: $scope,
        }).then(function(popover) {
            $scope.popover = popover;
        });


        $scope.openPopover = function($event) {
            $scope.popover.show($event);
        };



        $scope.showOpDiv = function() {
            var myPopup = $ionicPopup.show({
                template: '<input type="password" ng-model="data.wifi">',
                title: 'Enter Wi-Fi Password',
                subTitle: 'Please use normal things',
                scope: $scope,
                buttons: [{
                    text: 'Cancel'
                }, {
                    text: '<b>Save</b>',
                    type: 'button-positive',
                    onTap: function(e) {
                        if (!$scope.data.wifi) {
                            //不允许用户关闭，除非他键入wifi密码
                            e.preventDefault();
                        } else {
                            return $scope.data.wifi;
                        }
                    }
                }, ]
            });
        };



    });
