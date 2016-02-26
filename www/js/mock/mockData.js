Mock.mock('http://192.168.1.1/app/', 'getDeviceInfo', function(options) {
    return {
        ResultCode: '0',
        data: {
            device_type: {
                val: 'AN5506-04-B5',
                ecode: '1',
                warn:true,
                reason:'lallalallala',
                msg:'jsjsjjsjsjsjs'
            },
            vendor: {
                val: 'Fiberhome',
                warn:false
            },
            hardware_version: {
                val: 'WKE2.201.333R1A',
                warn:false
            },
            software_version: {
                val: 'RP0700',
                warn:false
            },
            mac: {
                val: '11-22-33-44-55',
                warn:false
            },
            sn: {
                val: 'AN5506-04-B5',
                warn:false
            },
            led_status:{
                val:'0',
                warn:false
            },
            onu_regist_status: {
                val: '01',
                 warn:true
            },
            onu_auth_status: {
                val: '1',
                warn:false
            },
            pon_port_number: {
                val: '1',
                warn:false
            },
            data_port_number: {
                val: '4',
                warn:false
            },
            voice_port_number: {
                val: '2',
                warn:false
            },
        }
    }
});

Mock.mock('http://192.168.1.1/app/', 'getPonPortStatus', function(options){
	return Mock.mock({
		'ResultCode': '0',
		'data|1-4': [
			{
				'pon_port_id|1-4': 1,
				'temperature': {'val|1-100': 25,warn:true},            
				'voltage': {'val|1-5': 5},					
				'bias_current': {'val|1-100': 100},			
				'tx_opt_power': {'val|1-100': 23},			
				'rx_opt_power': {'val|1-100': 45}		
			}
		] 
	});
});

Mock.mock('http://192.168.1.1/app/', 'getDataPortStatus', function(options){
	return Mock.mock({
		'ResultCode': '0',
		'data|1-4': [
			{
				'data_port_id|1-4': 1,
				'port_status': {val : '1'},            
				'speed': {'val' : '2'},					
				'duplex': {'val': '0'}		
			}
		] 
	});
});

Mock.mock('http://192.168.1.1/app/', 'getVoicePortStatus', function(options){
	return Mock.mock({
		'ResultCode': '0',
		'data': {
		    'signal_svlan_id' : {val : '4095'},
            'svlan_cos' : {val : '1'},
            'signal_cvlan_id' : {val : '123'},
            'cvlan_cos' : {val : '2'},
            'ip_mode' : {val : '0'},
            'signal_ip' : {val : '12.34.56.78'},
            'ip_mask' : {val : ''},
            'signal_gateway' : {val : ''},
            'pppoe_user' : {val : ''},
            'pppoe_password' : {val : ''},
            'first_mgc_ip': {val : '0.0.0.0'},
            'first_mgc_port': {val : '2944'},
            'second_mgc_ip': {val : ''},
            'second_mgc_port': {val : ''},
            'h248_local_port' : {val:'2944'},
            'reg_mode' : {val : '1'},
            'mgid' : {val:'10'},
			'protocol_type': {'val': '4'},
            'first_sip_registrar_server_ip': {val : ''},
            'first_sip_registrar_server_port': {val : ''},
            'second_sip_registrar_server_ip': {val : ''},
            'second_sip_registrar_server_port': {val : ''},
            'first_sip_proxy_server_ip': {val : ''},
            'first_sip_proxy_server_port': {val : ''},
            'second_sip_proxy_server_ip': {val : ''},
            'second_sip_proxy_server_port': {val : ''},
            'sip_local_port' : {val : ''}, 
            'mgc_reg_status' : {val : '1'},           
            'port_detail' :  [{
                voice_port_id : 1,
                port_status : {val : '1'},
                port_enable : {val : '1'},
                user_tid : {val : '12'},
                telphone_no : {val : '1555265656'},
                sip_user_name: {val : 'adad'},
                sip_user_pass: {val : '12323'},              
            }]
		}
		
	});
});

Mock.mock('http://192.168.1.1/appb', {
    'name': '@name',
    'age|1-100': 100,
    'color': '@color'
});
