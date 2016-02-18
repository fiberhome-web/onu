angular.module('starter.services').service('Check',function(){

	var standard = {
		basic : {
			led_status : [{
				op : 'eq',
				val : '0',
				reason : ONU_LOCAL.suggest.reason.r1,
				suggest : ONU_LOCAL.suggest.msg.m1
			}],
			onu_regist_status : [{
				op : 'eq',
				val : '01',
				reason : ONU_LOCAL.suggest.reason.r2,
				suggest : ONU_LOCAL.suggest.msg.m2
			},{
				op : 'eq',
				val : '02',
				reason : ONU_LOCAL.suggest.reason.r3,
				suggest : ONU_LOCAL.suggest.msg.m3
			},{
				op : 'eq',
				val : '03',
				reason : ONU_LOCAL.suggest.reason.r3,
				suggest : ONU_LOCAL.suggest.msg.m3
			},{
				op : 'eq',
				val : '04',
				reason : ONU_LOCAL.suggest.reason.r4,
				suggest : ONU_LOCAL.suggest.msg.m4
			},{
				op : 'eq',
				val : '06',
				reason : ONU_LOCAL.suggest.reason.r4,
				suggest : ONU_LOCAL.suggest.msg.m4
			},{
				op : 'eq',
				val : '07',
				reason : ONU_LOCAL.suggest.reason.r5,
				suggest : ONU_LOCAL.suggest.msg.m5
			}],
			onu_auth_status : [{
				op : 'eq',
				val : '0',
				reason : ONU_LOCAL.suggest.reason.r6,
				suggest : ONU_LOCAL.suggest.msg.m6
			},{
				op : 'gt',
				val : '1',
				reason : ONU_LOCAL.suggest.reason.r7,
				suggest : ONU_LOCAL.suggest.msg.m7
			}]
		},
		pon :{
			led_status : [{
				op : 'eq',
				val : '0',
				reason : ONU_LOCAL.suggest.reason.r8,
				suggest : ONU_LOCAL.suggest.msg.m8
			}],
			temperature : [{
				op : 'gte',
				val : '90',
				reason : ONU_LOCAL.suggest.reason.r9,
				suggest : ONU_LOCAL.suggest.msg.m9
			}],
			voltage : [{
				op : 'gt',
				val : '3.3',
				reason : ONU_LOCAL.suggest.reason.r10,
				suggest : ONU_LOCAL.suggest.msg.m10
			},{
				op : 'lt',
				val : '3.1',
				reason : ONU_LOCAL.suggest.reason.r11,
				suggest : ONU_LOCAL.suggest.msg.m10
			}],
			bias_current : [{
				op : 'gte',
				val : '40',
				reason : ONU_LOCAL.suggest.reason.r12,
				suggest : ONU_LOCAL.suggest.msg.m11
			}],
			tx_opt_power : [{
				op : 'gt',
				val : '5',
				reason : ONU_LOCAL.suggest.reason.r13,
				suggest : ONU_LOCAL.suggest.msg.m12
			},{
				op : 'lt',
				val : '1.5',
				reason : ONU_LOCAL.suggest.reason.r14,
				suggest : ONU_LOCAL.suggest.msg.m12
			}],
			rx_opt_power : [{
				op : 'gt',
				val : '-8',
				reason : ONU_LOCAL.suggest.reason.r15,
				suggest : ONU_LOCAL.suggest.msg.m13
			},{
				op : 'lt',
				val : '-30',
				reason : ONU_LOCAL.suggest.reason.r16,
				suggest : ONU_LOCAL.suggest.msg.m13
			}]
		},
		data : {
			port_status : [{
				op : 'eq',
				val : '1',
				reason : ONU_LOCAL.suggest.reason.r17,
				suggest : ONU_LOCAL.suggest.msg.m14
			},{
				op : 'eq',
				val : '2',
				reason : ONU_LOCAL.suggest.reason.r18,
				suggest : ONU_LOCAL.suggest.msg.m15
			},{
				op : 'eq',
				val : '3',
				reason : ONU_LOCAL.suggest.reason.r19,
				suggest : ONU_LOCAL.suggest.msg.m16
			}]
		},
		voice : {
			signal_svlan_id : [{
				op : 'eq',
				val : '0'
			}],
			signal_ip : [{
				op : 'eq',
				val : '0.0.0.0'
			},{
				op : 'eq',
				val : '127.0.0.1'
			}],
			ip_mask : [{
				op : 'eq',
				val : '0.0.0.0'
			}]
		},

		voice_detail : {
			protocol_type :[{
				op : 'eq',
				val : '0',
				reason : ONU_LOCAL.suggest.reason.r20,
				suggest : ONU_LOCAL.suggest.msg.m17
			}]
		}
	};


	var portStatusCheckFun = function(portStatus){
		var val = portStatus.val;
		if(val === '0') {
			portStatus.warn = true;
			portStatus.reason = ONU_LOCAL.suggest.reason.r21;
			portStatus.msg = ONU_LOCAL.suggest.msg.m18;
		}else if(val === '1') {
			portStatus.warn = true;
			portStatus.reason = ONU_LOCAL.suggest.reason.r22;
			portStatus.msg = ONU_LOCAL.suggest.msg.m19;
		}else if(val === '12') {
			portStatus.warn = true;
			portStatus.reason = ONU_LOCAL.suggest.reason.r23;
			portStatus.msg = ONU_LOCAL.suggest.msg.m20;
		}else if(val === '13') {
			portStatus.warn = true;
			portStatus.reason = ONU_LOCAL.suggest.reason.r24;
			portStatus.msg = ONU_LOCAL.suggest.msg.m21;
		}
	};



	this.checking = function(type, datas){
		//特殊处理语音口的详情信息
		if(type === 'voice') {
			var details =  datas.port_detail;
			$.each(details,function(index,item){
				var protocol = item.protocol_type;
				//Protocol Type异常不需要检查其他参数
				if(protocol.val === '0') {
					protocol.warn = true;
					protocol.reason = ONU_LOCAL.suggest.reason.r20;
					protocol.msg = ONU_LOCAL.suggest.msg.m17;
					return true;
				} else if(protocol.val === '4'){ //SIP协议只需要检查port_status
					var portStatus = item.port_status;
					portStatusCheckFun(portStatus);
				} else {
					//H.248只有当MGC reg Status才检查Port Status
					var mgcRegStatus = item.mgc_reg_status;
					if(mgcRegStatus.val === '0') {
						mgcRegStatus.warn = true;
						mgcRegStatus.reason = ONU_LOCAL.suggest.reason.r25;
						mgcRegStatus.msg = ONU_LOCAL.suggest.msg.m22;
					} else if(mgcRegStatus.val === '2'){
						mgcRegStatus.warn = true;
						mgcRegStatus.reason = ONU_LOCAL.suggest.reason.r25;
						mgcRegStatus.msg = ONU_LOCAL.suggest.msg.m23;
					} else {
						var portStatus2 = item.port_status;
						portStatusCheckFun(portStatus2);
					}
				}
			});
		}


		$.each(datas,function(key,item){
			//如果存在ecode，则不处理
			var ecode = item.ecode;
			if(!ecode) {
				var sts = standard[type][key];
				//是否有检测标准，有检测标准则进行检测
				if(sts){
					$.each(sts,function(index,val){
						var op = val.op;
						var value = val.val;
						if((op === 'eq' && item.val === value) || 
							(op === 'neq' && item.val !== value) ||
							(op === 'gt' && parseFloat(item.val) > parseFloat(value)) || 
							(op === 'lt' && parseFloat(item.val) < parseFloat(value)) ||
							(op === 'gte' && parseFloat(item.val) >= parseFloat(value)) || 
							(op === 'lte' && parseFloat(item.val) <= parseFloat(value))){
							item.warn = true;
							if(val.reason){
								item.reason = val.reason;
							}
							if(val.suggest){
								item.msg = val.suggest;
							}
							
						}
					});
				}
				
			}
			
		});

		return datas;
	};


});