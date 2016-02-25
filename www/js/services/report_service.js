angular.module('starter.services').service('Report', function() {

    this.deviceInfo = {};

    this.ponPortInfo = [];

    this.dataPortInfo = [];

    this.voicePortInfo = {
        second_sip_registrar_server_port : {val : 'dasssssssssss1'},
        second_mgc_ip: {val : '2'},
        port_detail : []
    };

    this.setDeviceInfo = function(info) {
        this.deviceInfo = info;
    };

    this.getDeviceInfo = function() {
        return this.deviceInfo;
    };

    this.setPonPortInfo = function(info) {
        this.ponPortInfo = info;
    };



    this.getPonPortInfo = function() {
    	if(this.ponPortInfo.length < 1 ) {
    		var pon_num = parseInt(this.deviceInfo.pon_port_number ? this.deviceInfo.pon_port_number.val : 0);
	        for(var i = 0; i< pon_num; i++) {
	            this.ponPortInfo.push({
	                'pon_port_id': '',
	                'temperature': '',            
	                'voltage': '',                  
	                'bias_current': '',         
	                'tx_opt_power': '',          
	                'rx_opt_power': '' 
	            });
	        }
    	}
    	
        return this.ponPortInfo;
    };

    this.setDataPortInfo = function(info) {
        this.dataPortInfo = info;
    };

    this.getDataPortInfo = function() {
    	if(this.dataPortInfo.length < 1 ) {
    		var data_num = parseInt(this.deviceInfo.data_port_number ? this.deviceInfo.data_port_number.val : 0);
	        for(var i = 0; i< data_num; i++) {
	            this.dataPortInfo.push({
	                'data_port_id': '',
                    'port_status': '',            
                    'speed': '',                  
                    'duplex': '',
	            });
	        }
    	}
        return this.dataPortInfo;
    };


    this.setVoicePortInfo = function(info) {
        this.voicePortInfo = info;
    };

    this.getVoicePortInfo = function() {
        if(this.voicePortInfo.port_detail.length < 1) {
            var voice_num = parseInt(this.deviceInfo.voice_port_number ? this.deviceInfo.voice_port_number.val : 0);
            this.voicePortInfo.port_detail = [];
            for(var i = 0; i< voice_num; i++) {
                this.voicePortInfo.port_detail.push({
                    voice_port_id : '',
                    port_status : {val : ''},
                    port_enable : {val : ''},
                    user_tid : {val : ''},
                    telphone_no : {val : ''},
                    sip_user_name: {val : ''},
                    sip_user_pass: {val : ''}
                });
            }
        }
        return this.voicePortInfo;
    };
});
