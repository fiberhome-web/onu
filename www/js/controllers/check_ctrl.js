
angular.module('starter.controllers')
	.controller('CheckCtrl', function($scope,$state,$http,Chats,$stateParams,$ionicPopup) {

		//检查checkStatus 0 ：检查全部项
		var checkStatus = $stateParams.checkStatus;

		$scope.chats = Chats.all();

		$scope.remove = function(chat){
		
		}


		// $scope.showAlert = function() {
		//      var alertPopup = $ionicPopup.alert({
		//        title: 'Don\'t eat that!',
		//        template: 'It might taste good'
		//      });
		//      alertPopup.then(function(res) {
		//        console.log('Thank you for not eating my delicious ice cream cone');
		//      });
	 //    };

	   // $scope.showAlert();

		$scope.showPopup = function() {
		   $scope.data = {}

		   // 一个精心制作的自定义弹窗
		   var myPopup = $ionicPopup.show({
		     template: '<input type="text" ng-model="data.wifi">',
		     title: '请输入报告名称',
		   //  subTitle: 'Please use normal things',
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