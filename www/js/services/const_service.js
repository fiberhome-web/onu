angular.module('starter.services').service('Const',function(){
	this.reqUrl = 'http://192.168.1.1/app';

	this.getReqUrl = function(){
		return this.reqUrl;
	};

	this.setReqUrl = function(url){
		this.reqUrl = url;
	};

});