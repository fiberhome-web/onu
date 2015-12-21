angular.module('starter.controllers')
    .controller('CheckCtrl', function($scope, $state, $http, $stateParams, $ionicPopup, Const) {

        //检查checkStatus 0 ：检查全部项
        var checkStatus = $stateParams.checkStatus;

        initPage();

        $scope.checkPon = function() {
            $scope.isPonChecking = true;

            var url = Const.getReqUrl();
            var params = {
                'command': 'getPonPortStatus'
            };

            $http.post(url, params).success(function(response) {
                if (response.ResultCode === '0') {
                    $scope.ponInfos = response.data;
                } else {
                    alert('haha');
                }

                $scope.isPonChecking = false;
            }).error(function(data, status) {
                alert('data:' + data + '\n' + 'status:' + status + '\n');
                $scope.isPonChecking = false;
            });
        }

        $scope.showPopup = function() {
            $scope.data = {}

            // 一个精心制作的自定义弹窗
            var myPopup = $ionicPopup.show({
                // template: '<input type="text" ng-model="data.wifi">{{localInfo.status}}',
                templateUrl: 'popup.html',
                title: '请输入报告信息',
                cssClass: 'reportPopup',
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
        }

        function initPage() {
            $scope.r_status = "1";   
            $scope.order = {
                pon: 'pon_port_id'
            }
            $scope.ponInfos = [];
        }

    });
