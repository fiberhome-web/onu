
angular.module('starter.controllers')
	.controller('CheckCtrl', function($scope,$state,$http,Chats,$stateParams,$ionicPopup) {

		//检查checkStatus 0 ：检查全部项
		var checkStatus = $stateParams.checkStatus;

		$scope.chats = Chats.all();

		$scope.remove = function(chat){
		
		}

		$scope.checkPon = function(){
			$scope.check1 = true;
		}


		$scope.localInfo = {
			status : '检测结果'
		}

		$scope.r_status = "0";

		$scope.showPopup = function() {
		   $scope.data = {}

		   // 一个精心制作的自定义弹窗
		   var myPopup = $ionicPopup.show({
		    // template: '<input type="text" ng-model="data.wifi">{{localInfo.status}}',
		     templateUrl : 'popup.html',
		     title: '请输入报告信息',
		     cssClass : 'reportPopup',
		     scope: $scope,
		     buttons: [
		       { text: 'Cancel' },
		       {
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
		       },
		     ]
		   });
		}
	
});