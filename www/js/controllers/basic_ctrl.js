angular.module('starter.controllers')
    .controller('BasicCtrl', function($scope, $state, $http, Const) {

        $scope.checking = function() {
            $state.go('tab.check', {
                checkStatus: 0
            })
            
        };

        $scope.local = ONU_LOCAL.basicModule;
        $scope.localInfo = ONU_LOCAL.report.deviceInfo;

        var url = Const.getReqUrl();
        var command = {
            'command': 'getDeviceInfo'
        };

        $http.post(url, command).success(function(res) {
            if (res.ResultCode === CONST.R_CODE.SUCCESS) {
                var data = res.data;
                //检查数据是否存在返回ecode的，存在要转化成错误内容
                angular.forEach(data, function(item, key) {
                    if (item.ecode) {
                        item.text = item.ecode
                    }
                });
                
                //枚举转化
                data.onu_regist_status.text = ONU_LOCAL.enums.onu_regist_status['k_' + data.onu_regist_status.val];
                data.onu_auth_status.text = ONU_LOCAL.enums.onu_auth_status['k_' + data.onu_auth_status.val];
                $scope.deviceInfo = data;

            }
        }).error(function(data, status) {
            alert('data:' + data + '\n' + 'status:' + status + '\n');
        });

    });
