angular.module('starter.services').service('Popup',['$ionicPopup','$rootScope', 
	function($ionicPopup,$rootScope){

	this.showPop = function(option){

		var html = '<div class="warn-tip">'+
                   '<div class="close-btn" ng-click="closePop()">'+
                   '<i class="iconfont">&#xe61d;</i></div>';

        if(option.note) {
        	html = html + '<div>Note:<br/><br/>'+ option.note + '</div>'; 
        } else {
        	if(option.reason) {
				html = html + '<div>Reason:<br/><br/>'+ option.reason + '</div>';                  
			}
			if(option.msg) {
				html = html + '<div>Suggestion:<br/><br/>'+ option.msg + '</div>';                  
			}
        }
                                                                      
		html = html + '</div>';

		var myPopup = $ionicPopup.show({
			template: html,
			scope : $rootScope
		});

		$rootScope.closePop = function(){
			myPopup.close();
		};
        
	};

}]);