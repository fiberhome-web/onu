'use strict';
angular.module('starter.services').service('LicenseService', function() {

	this.registerData = {};
    this.isLicenseCorrect = function(uuid, key) {
    	var mKey = calculationLicense(uuid);
    	if(mKey===key){
    		return true;
    	}else{
    		return false;
    	}
        
    };
    var calculationLicense = function(uuid) {

        var key = faultylabs.MD5(uuid+'fiberhome');
        console.log('key : '+key);
        return key;
    };
});
