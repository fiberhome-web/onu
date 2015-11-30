
angular.module('starter.controllers')
	.controller('ReportDetailCtrl', function($scope,$state,$http,$ionicHistory,
		$stateParams, DB, $ionicPopup, $ionicModal, $ionicPopover) {

		$scope.back = function(){
			$ionicHistory.goBack();
		}

		$scope.reportLocal = ONU_LOCAL.report;

		$scope.obj = {abc : '12'}


		//document.getElementById('report').innerHTML

		var basicInfo = {
			equipment_id :  {val : 'AN5506-04-B5'},
			vendor : {val : 'Fiberhome'},
			hardware_version : {val : 'WKE2.201.333R1A'},
			software_version : {val :'RP0700'},
			mac : {val :'11-22-33-44-55'},
			sn : {val :'AN5506-04-B5'},
			onu_regist_status : {val :'Registered'},
			pon_port_number : {val : '12'},
			data_port_number : {val : '12'},
			voice_port_number : {val : '12'},
		}

		var ponPortStatus = {
			temperature : {val :'222', unit : '℃'},
			voltage : {val :'22', unit : 'V'},
			bias_current : {val : '22', unit : 'mA'},
			tx_OptPowe : {val :'23', unit : 'dBm'},
			rx_OptPower : {val :'45', unit : 'dBm'},
		
		}

		var dataPortStatus = {
			port_status : {val :'Link Up'},
			speed : {val :'10M'},
			duplex : {val :'Full'},
			
		}

		var voicePortStatus = {
			protocol_type : {val :'H.248'},
			port_status : {val : 'EP_STATUS_REGING'},
			telphoneNo : {val : '1559229292922'},			
		}

		var report = {basicInfo : basicInfo, ponPortStatus : ponPortStatus,
			dataPortStatus : dataPortStatus, voicePortStatus : voicePortStatus,}
		$scope.report = DB.queryById('123');

		$scope.detail = report;

		console.log(JSON.stringify(report))



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