angular.module('starter.services').service('Const',function(){
	var reqUrl = 'https://192.168.1.1:4433/app';

	this.getReqUrl = function(){
	 //    var	random = new Date().getTime();
		// return reqUrl + '?v=' + random;
		return reqUrl;
	};

	this.setReqUrl = function(url){
		reqUrl = url;
	};

});