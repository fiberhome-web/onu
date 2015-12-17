Mock.mock('http://192.168.1.1/app/', function(options){
	return {
				equipment_id :  {val : 'AN5506-04-B5'},
				vendor : {val : 'Fiberhome'},
				hardware_version : {val : 'WKE2.201.333R1A'},
				software_version : {val :'RP0700'},
				mac : {val :'11-22-33-44-55'},
				sn : {val :'AN5506-04-B5'},
				onu_regist_status : {val :'Registered'},
				pon_port_number : {val : '12'},
				data_port_number : {val : '12'},
				voice_port_number : {val : '12'},
	}
});

Mock.mock('http://192.168.1.1/appb',{
	'name'     : '@name',
    'age|1-100': 100,
    'color'    : '@color'
});

