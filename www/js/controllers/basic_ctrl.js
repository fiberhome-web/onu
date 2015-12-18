angular.module('starter.controllers')
    .controller('BasicCtrl', function($scope, $state, $http, Const) {

        $scope.checking = function() {
            $state.go('tab.check', {
                checkStatus: 0
            })
        }

        $scope.localInfo = ONU_LOCAL.report.deviceInfo;

        var url = Const.getReqUrl();
        var command = {
            'command': 'getDeviceInfo'
        };

        $http.post(url, command).success(function(res) {
            //枚举转化         
            res.onu_regist_status.text = ONU_LOCAL.enums.onu_regist_status['k_' + res.onu_regist_status.val];
            res.onu_auth_status.text = ONU_LOCAL.enums.onu_auth_status['k_' + res.onu_auth_status.val];
            $scope.deviceInfo = res;
        }).error(function(data, status) {
            alert('data:' + data + '\n' + 'status:' + status + '\n');
        });

    });
