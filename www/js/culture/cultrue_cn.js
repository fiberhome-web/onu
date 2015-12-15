var ONU_LOCAL = {
	loginModule : {
		login : '登录',
		IPAddress : 'IP地址',
		username : '用户名',
		password : '密码'
	},

	report :{
		deviceInfo : {
			moduleName : '设备信息',
			equipment_id :  'ONU型号',
			vendor : '厂商',
			hardware_version : '硬件版本号',
			software_version : '软件版本号',
			mac : 'MAC',
			sn : 'SN',
			onu_regist_status : 'ONU注册状态',
			pon_port_number : '光口个数',
			data_port_number : '数据口个数',
			voice_port_number : '语音口个数',
		},

		ponPortStatus : {
			moduleName : '光口状态',
			temperature : '光模块温度',
			voltage : '光模块电压',
			bias_current : '偏置电流',
			tx_OptPowe : '发送光功率',
			rx_OptPower : '接收光功率',
		
		},
		
		dataPortStatus : {
			moduleName : '数据口状态',
			port_status : '端口状态',
			speed : '速率',
			duplex : '双工',
			
		},

		voicePortStatus : {
			moduleName : '语音端口状态',
			protocol_type : '协议类型',
			port_status : '端口状态',
			telphoneNo : '电话号码',
			
		}
		
	}

	
}