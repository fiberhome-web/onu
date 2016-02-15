'use strict';

angular.module('starter.controllers')
    .controller('BasicCtrl', ['$scope', '$state', '$http', 'Const', 'Report', function($scope, $state, $http, Const, Report) {

        $scope.checking = function() {
            $state.go('tab.check', {
                checkStatus: 0
            });

        };

        $scope.local = ONU_LOCAL.basicModule;
        $scope.localInfo = ONU_LOCAL.report.deviceInfo;
$scope.alert=function(){
    alert(1);
}

        var url = Const.getReqUrl();
        var command = {
            'command': 'getDeviceInfo'
        };

        $http.post(url, command).success(function(res) {
            if (res.ResultCode === CONST.R_CODE.SUCCESS) {
                var data = res.data;
                //检查数据是否存在,返回ecode的，存在要转化成错误内容
                angular.forEach(data, function(item, index) {
                    if (item.ecode) {
                        item.text = item.ecode;
                    }
                });

                data.warranty_period = {
                    val: 'scan_bar_code'
                };
                data.warranty_period.text = ONU_LOCAL.basicModule[data.warranty_period.val];
                //枚举转化
                data.registration_status_led.text = ONU_LOCAL.enums.registration_status_led['k_' + data.registration_status_led.val];
                data.onu_regist_status.text = ONU_LOCAL.enums.onu_regist_status['k_' + data.onu_regist_status.val];
                data.onu_auth_status.text = ONU_LOCAL.enums.onu_auth_status['k_' + data.onu_auth_status.val];

                $scope.deviceInfo = data;
                Report.setDeviceInfo(data);
            }
        }).error(function(data, status) {
            alert('data:' + data + '\n' + 'status:' + status + '\n');
        });

    }]);
