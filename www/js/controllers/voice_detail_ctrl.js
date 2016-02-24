'use strict';

angular.module('starter.controllers').controller('VoiceDetailCtrl', 
	['$scope','$rootScope','Report','$state','Popup',
	 function($scope, $rootScope, Report, $state, Popup ) {
    $rootScope.hideTabs = true;

    $scope.voiceInfo = Report.getVoicePortInfo();

    $scope.back = function(){
    	$state.go('tab.check');
    	$rootScope.hideTabs = false;
    };

    $scope.showTip = function(item) {
        if (item.msg) {
            Popup.showPop(item.reason, item.msg);
        }
    };

}]);
