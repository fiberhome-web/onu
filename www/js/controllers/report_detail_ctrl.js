
angular.module('starter.controllers')
	.controller('ReportDetailCtrl', function($scope,$state,$http,$ionicHistory,
		$stateParams, DB, $ionicPopup, $ionicModal, $ionicPopover) {

		$scope.reportLocal = ONU_LOCAL.report;

		var id = $stateParams.reportId;

		$scope.back = function(){
			$ionicHistory.goBack();
		}


		DB.queryById(id).then(function(res){
			var item = res.rows.item(0);
			$scope.report = item;
			$scope.detail = JSON.parse(item.data);
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



		$scope.showOpDiv = function(){
			var myPopup = $ionicPopup.show({
		     template: '<input type="password" ng-model="data.wifi">',
		     title: 'Enter Wi-Fi Password',
		     subTitle: 'Please use normal things',
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