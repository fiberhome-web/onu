Mock.mock('http://192.168.1.1/app/', 'getDeviceInfo', function(options) {
    return {
        ResultCode: '0',
        data: {
            equipment_id: {
                val: 'AN5506-04-B5',
                ecode: '1'
            },
            vendor: {
                val: 'Fiberhome'
            },
            hardware_version: {
                val: 'WKE2.201.333R1A'
            },
            software_version: {
                val: 'RP0700'
            },
            mac: {
                val: '11-22-33-44-55'
            },
            sn: {
                val: 'AN5506-04-B5'
            },
            registration_status_led:{
                val:'0'
            },
            onu_regist_status: {
                val: '01'
            },
            onu_auth_status: {
                val: '1'
            },
            pon_port_number: {
                val: '4'
            },
            data_port_number: {
                val: '3'
            },
            voice_port_number: {
                val: '2'
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
				'temperature': {'val|1-100': 25, 'warn' : true, 'errMsg' : 'hdsad'},            
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
				'port_status': {'val|0-3': 0},            
				'speed': {'val|1': [0,2,3,4]},					
				'duplex': {'val|0-2': 0}		
			}
		] 
	});
});

Mock.mock('http://192.168.1.1/app/', 'getVoicePortStatus', function(options){
	return Mock.mock({
		'ResultCode': '0',
		'data|1-4': [
			{
				'voice_port_id|1-4': 1,
				'protocol_type': {'val|0-2': 0},            
				'port_status': {'val|0-13': 0},					
				'telphone_no': {'val': /^(186)\d{8}$/ }		
			}
		] 
	});
});

Mock.mock('http://192.168.1.1/appb', {
    'name': '@name',
    'age|1-100': 100,
    'color': '@color'
});
