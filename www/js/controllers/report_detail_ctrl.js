
angular.module('starter.controllers')
	.controller('ReportDetailCtrl', function($scope,$state,$http,$ionicHistory,
		$stateParams, DB, $ionicPopup, $ionicModal, $ionicPopover) {

		$scope.back = function(){
			$ionicHistory.goBack();
		}


		//document.getElementById('report').innerHTML

		var basicInfo = {
			equipment_id : 'AN5506-04-B5',
			vendor : 'Fiberhome',
			hardware_version : 'WKE2.201.333R1A',
			software_version : 'RP0700',
			mac : '11-22-33-44-55',
			sn : 'AN5506-04-B5',
			onu_regist_status : 'Registered',
			pon_port_number : '12',
			data_port_number : '12',
			voice_port_number : '12',
		}

		var ponPortStatus = {
			temperature : '22',
			voltage : '22',
			bias_current : '22',
			tx_OptPowe : '23',
			rx_OptPower : '45',
		
		}

		var dataPortStatus = {
			port_status : 'Link Up',
			speed : '10M',
			duplex : 'Full',
			
		}

		var voicePortStatus = {
			protocol_type : 'H.248',
			port_status : 'EP_STATUS_REGING',
			telphoneNo : '1559229292922',
			
		}

		var report = {basicInfo : basicInfo, ponPortStatus : ponPortStatus,
			dataPortStatus : dataPortStatus, voicePortStatus : voicePortStatus,}
		$scope.report = DB.queryById('123');


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