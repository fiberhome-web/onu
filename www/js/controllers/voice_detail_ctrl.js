'use strict';

angular.module('starter.controllers').controller('VoiceDetailCtrl', 
	['$scope','$rootScope','Report','$state','Popup','ExpanderService','$timeout',
	 function($scope, $rootScope, Report, $state, Popup,ExpanderService,$timeout ) {
    $rootScope.hideTabs = true;
    $scope.i10n = ONU_LOCAL;
    $scope.voiceInfo = Report.getVoicePortInfo();

    $scope.back = function(){
    	$state.go('tab.check');
    	$rootScope.hideTabs = false;
    };

    var suggestExpanderConf = {
        templateUrl: 'editSuggest2.html',
        scope: $scope,
        backdoor: true
    };
    var suggestExpander = ExpanderService.init(suggestExpanderConf);


    // 界面事件处理函数
    $scope.eventFun = {
        showTip: function(item) {
            Popup.showPop(item);

        },

        openEdit : function(title, item){
            var note = item.note;
            var reason = item.reason ? item.reason : '';
            var msg = item.msg ? item.msg : '';
            if(note === undefined) {
                note = '';
                if(reason) {
                    note = $scope.i10n.checkModule.reason + ' : \r\n' +  reason + '\r\n\r\n';
                }
                if(msg) {
                    note = note + $scope.i10n.checkModule.suggestion + ' : \r\n' + msg;
                }
                
                         
            }

            $scope.editer = {
                title : title,
                note : note,
                item : item
            };
            suggestExpander.show();

            $timeout(function(){
                $('#editTextarea2').focus();
            },200);
        },

        closeEdit : function(){
             suggestExpander.hide();
        },

        clearEdit : function(){
            $scope.editer.note = '';
            $timeout(function(){
                $('#editTextarea').focus();
            },100);
            
        },

        saveEdit : function(){
            $scope.editer.item.note = $scope.editer.note;
            //清空系统建议
            $scope.editer.item.reason = null;
            $scope.editer.item.msg = null;
            suggestExpander.hide();
        }

    };


}]);
