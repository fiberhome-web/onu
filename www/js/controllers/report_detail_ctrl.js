'use strict';
angular.module('starter.controllers')
    .controller('ReportDetailCtrl', ['$scope', '$rootScope', '$state', '$http', '$ionicHistory',
        '$stateParams', 'DB', '$ionicPopup', '$ionicModal', '$ionicPopover', 'File',
        '$cordovaSocialSharing', '$cordovaEmailComposer','Popup',function($scope, $rootScope, $state, $http, $ionicHistory,
        $stateParams, DB, $ionicPopup, $ionicModal, $ionicPopover, File,
        $cordovaSocialSharing, $cordovaEmailComposer,Popup) {

        $scope.reportLocal = ONU_LOCAL.report;

        $rootScope.hideTabs = true;
        var filePath = '';

        //获取report id
        var id = $stateParams.reportId;

        //登录按钮事件
        $scope.back = function() {
            window.location.href = '#/tab/history';
            // $ionicHistory.goBack();
            // $ionicHistory.clearHistory();
            $rootScope.hideTabs = false;
        };

        $scope.showTip = function(item) {
            if (item.msg) {
                Popup.showPop(item.reason, item.msg);
            }

        };


        //根据查询报告并渲染数据
        DB.queryById(id).then(function(res) {
            var item = res.rows.item(0);
            $scope.report = item;
            $scope.detail = JSON.parse(item.data);

            //记录文件地址
            filePath = 'file:///storage/emulated/0/onu_report/' + item.name + '.html';

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

        //popover初始化
        $ionicPopover.fromTemplateUrl('my-popover.html', {
            scope: $scope,
        }).then(function(popover) {
            $scope.popover = popover;
        });


        $scope.openPopover = function($event) {
            $scope.popover.show($event);
        };


        $scope.share = function() {
            $cordovaSocialSharing.share('', 'onu 检测报告', filePath).then(function() {
                //发送结束后关闭popover框
                $scope.popover.hide();
            }, function() {
                //发送结束后关闭popover框
                $scope.popover.hide();
            });
        };


        $scope.email = function() {
            var emailOption = {
                // to: '',
                // cc: '',
                // bcc: [],
                attachments: [
                    filePath
                ],
                subject: 'onu 检测报告',
                body: 'onu 检测报告',
                isHtml: true
            };

            $cordovaEmailComposer.open(emailOption).then(null, function() {
                //发送结束后关闭popover框
                $scope.popover.hide();
            });
        };


        $scope.onSwipeRight = function() {
            $ionicHistory.goBack();
        };


        $scope.onHold = function() {
            alert('onHold');
        };

    }]);
