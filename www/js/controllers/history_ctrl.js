
angular.module('starter.controllers') 
	.controller('HistoryCtrl', function($scope,$log, $ionicGesture, $ionicLoading,
		$ionicActionSheet, $ionicListDelegate, $ionicModal, $rootScope) {

		//下拉刷新数据
		$scope.doRefresh = function(){
			//关闭刷新
			$scope.$broadcast('scroll.refreshComplete');  
		}

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

	    $scope.type = 1;

	    $scope.filterType = function(type){
	    	$scope.type = type;
	    }

	    $ionicModal.fromTemplateUrl('my-modal.html', {
		    scope: $scope,
		    animation: 'slide-in-up'
		  }).then(function(modal) {
		    $scope.modal = modal;
		  });
		  $scope.openModal = function() {
		    $scope.modal.show();
		  };

		  $scope.batchDelele = function(e){
		  	e.stopPropagation();
		  	e.preventDefault();
		  	$scope.modal.hide();
		  	//隐藏导航栏
		  	$rootScope.hideTabs  = true;
		  	$scope.shouldShowCheckbox = true;
		  }

		  $scope.hideDelete = function(){
		  	$scope.shouldShowCheckbox = false;
		  	$rootScope.hideTabs  = false;
		  }

		  

	    $scope. list = [{name : '万科魅力之城 万科魅力之城  ', date : '2015-11-11 11:11:11', status : 1, id : '001'},
				    {name : '万科魅力之城 万科魅力之城 万科魅力之城 ', date : '2015-11-11 11:11:11', status : 0, id : '002'},
				    {name : '万科魅力之城 万科魅力之城 万科魅力之城 ', date : '2015-11-11 11:11:11', status : 0, id : '002'},
				    {name : '万科魅力之城 万科魅力之城 万科魅力之城 ', date : '2015-11-11 11:11:11', status : 0, id : '002'},
				    {name : '万科魅力之城 万科魅力之城 万科魅力之城 ', date : '2015-11-11 11:11:11', status : 0, id : '002'},
				    {name : '万科魅力之城 万科魅力之城 万科魅力之城 ', date : '2015-11-11 11:11:11', status : 0, id : '002'},
				    {name : '万科魅力之城 万科魅力之城 万科魅力之城 ', date : '2015-11-11 11:11:11', status : 0, id : '002'},
				    {name : '万科魅力之城 万科魅力之城 万科魅力之城 ', date : '2015-11-11 11:11:11', status : 0, id : '002'},
				    {name : '万科魅力之城 万科魅力之城 万科魅力之城 ', date : '2015-11-11 11:11:11', status : 0, id : '002'},
				    {name : '万科魅力之城 万科魅力之城 万科魅力之城 ', date : '2015-11-11 11:11:11', status : 0, id : '002'},
				     {name : '万科魅力之城 万科魅力之城 万科魅力之城 ', date : '2015-11-11 11:11:11', status : 0, id : '002'},
				    {name : '万科魅力之城 万科魅力之城 万科魅力之城 ', date : '2015-11-11 11:11:11', status : 0, id : '002'},
				    {name : '万科魅力之城 万科魅力之城 万科魅力之城 ', date : '2015-11-11 11:11:11', status : 0, id : '002'},
				    {name : '万科魅力之城 万科魅力之城 万科魅力之城 ', date : '2015-11-11 11:11:11', status : 0, id : '002'},
				    {name : '万科魅力之城 万科魅力之城 万科魅力之城 ', date : '2015-11-11 11:11:11', status : 0, id : '002'},
				    {name : '万科魅力之城 万科魅力之城 万科魅力之城 ', date : '2015-11-11 11:11:11', status : 0, id : '002'}, {name : '万科魅力之城 万科魅力之城 万科魅力之城 ', date : '2015-11-11 11:11:11', status : 0, id : '002'},
				    {name : '万科魅力之城 万科魅力之城 万科魅力之城 ', date : '2015-11-11 11:11:11', status : 0, id : '002'},
				    {name : '万科魅力之城 万科魅力之城 万科魅力之城 ', date : '2015-11-11 11:11:11', status : 0, id : '002'},
				    {name : '万科魅力之城 万科魅力之城 万科魅力之城 ', date : '2015-11-11 11:11:11', status : 0, id : '002'},
				    {name : '万科魅力之城 万科魅力之城 万科魅力之城 ', date : '2015-11-11 11:11:11', status : 0, id : '002'},
				    {name : '万科魅力之城 万科魅力之城 万科魅力之城 ', date : '2015-11-11 11:11:11', status : 0, id : '002'},
				    {name : '万科魅力之城 万科魅力之城 万科魅力之城 ', date : '2015-11-11 11:11:11', status : 0, id : '002'},
				    {name : '万科魅力之城 万科魅力之城 万科魅力之城 ', date : '2015-11-11 11:11:11', status : 0, id : '002'},
				   
				    {name : '万科魅力之城 万科魅力之城22333  ', date : '2015-11-11 11:11:11', status : 1, id : '003'},
				   ];


	      
});