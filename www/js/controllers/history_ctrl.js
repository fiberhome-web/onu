
angular.module('starter.controllers') 
	.controller('HistoryCtrl', function($scope,$log, $ionicGesture, $ionicLoading,
		$ionicActionSheet) {


		 


		$scope.show = function() {
		    $ionicLoading.show({
		      template: 'Loading...'
		    });
	  	};
		 $scope.hide = function(){
		    $ionicLoading.hide();
		 };

		$scope.onTap = function(item){

	    	alert(item.id);
	    }


	    $scope.list = [{name : '万科魅力之城 万科魅力之城 万科魅力之城 ', date : '2015-11-11 11:11:11', status : 1, id : '001'},
				    {name : '万科魅力之城 万科魅力之城 万科魅力之城 ', date : '2015-11-11 11:11:11', status : 0, id : '002'},
				    {name : '万科魅力之城 万科魅力之城 万科魅力之城 ', date : '2015-11-11 11:11:11', status : 2, id : '003'},
				    {name : '万科魅力之城 万科魅力之城 万科魅力之城 ', date : '2015-11-11 11:11:11', status : 3, id : '004'}]
    
	      
});