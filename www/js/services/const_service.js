angular.module('starter.services').service('Const',function(){
	this.reqUrl = 'http://192.168.1.1/app/';

	this.getReqUrl = function(){
		return this.reqUrl;
	}

	this.setReqUrl = function(url){
		this.reqUrl = url;
	}

	//获取枚举值
	this.getEnum = function(eType, val){
		val = parseInt(val);

		var enums = {
			onu_status : ['os_1','os_2']   //onu注册状态枚举
		}

		if(enums[eType]) {
			return enums[eType][val] || '';
		}
		
	} 
})	