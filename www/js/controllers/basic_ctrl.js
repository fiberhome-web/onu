angular.module('starter.controllers')
    .controller('BasicCtrl', function($scope, $state, $http, Const) {

        $scope.checking = function() {
            $state.go('tab.check', {
                checkStatus: 0
            })
        }

        var url = Const.getReqUrl();
        var command = {
            'command': 'getDeviceInfo'
        };
        $http.post(url, command).success(function(res) {
            var deviceInfo = res;
        }).error(function(data, status) {
            alert('data:' + data + '\n' + 'status:' + status + '\n');
        });

    });
