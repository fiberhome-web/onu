var ONU_LOCAL = {
	basicInfo: '基本信息',
	check: '诊断',
	history: '历史',

    unit: {
        temperature: '℃',
        voltage: 'V',
        bias_current: 'mA',
        opt_power: 'dBm'
    },

    loginModule: {
        login: '连接设备',
        ip_address: 'IP地址',
        username: '用户名',
        password: '密码',
        history: '查看历史数据'
    },

    basicModule: {
        one_check: '一键检测'
    },

    checkModule: {
    	begin_check: '开始检测',
    	wait_for_checking: '正在检测，请稍后...',
    	one_key_check: '一键检测',
    	generate_report: '生成报告',
    	pon_port_item: 'PON口诊断项',
    	data_port_item: '数据端口诊断项',
    	voice_port_item: '语音端口诊断项',
        report_title: '请输入报告信息',
        report_name: '报告名称',
        report_name_ph: '建议用地址或SN',
        check_result: '检测结果',
        result_status: {
            normal: '正常',
            pon_abnormal: '光口异常',
            data_abnormal: '数据端口异常',
            voice_abnormal: '语音端口异常'
        },
        remark: '备注',
        ok: '確定',
        cancel: '取消',
        remark_ph: '请输入备注',
        stay_on_this_page:'停留在该页',
        view_report:'查看报告',
        generate_report_successfully:'生成报告成功。'
    },

    detailModule : {
        address : '检测地点',
        date : '检测时间',
        conclusion : '检测结论',
        report : '检测报告'
    },

    historyModule: {
        login: '登录',
        del : '删除',
        del_sure : '确认删除',
        cancel : '取消',
        choose : '选择',
        start_date: '开始日期',
        end_date: '结束日期',
        date_range: '日期范围',
        date_select: {
            all: '全部',
            today: '今天',
            twoDays: '2天内',
            week: '一周内',
            month: '一月内',
            customized : '自定义日期选择'
        },
        types : {
            all : '全部',
            normal : '正常',
            abnormal : '故障'
        },
        faults : {
            pon : '光口异常',
            data : '语音端口异常',
            voice : '数据端口异常'
        }
    },

    report: {
        deviceInfo: {
            module_name: '设备信息',
            device_type: 'ONU型号',
            vendor: '厂商',
            hardware_version: '硬件版本号',
            software_version: '软件版本号',
            mac: 'MAC',
            sn: 'SN',
            onu_regist_status: 'ONU注册状态',
            onu_auth_status: 'ONU认证状态',
            pon_port_number: '光口个数',
            data_port_number: '数据口个数',
            voice_port_number: '语音口个数',
        },

        ponPortStatus: {
            pon_port_id: '光口序号',
            module_name: '光口状态',
            temperature: '光模块温度',
            voltage: '光模块电压',
            bias_current: '偏置电流',
            tx_opt_power: '发送光功率',
            rx_opt_power: '接收光功率',

        },

        dataPortStatus: {
            data_port_id: '数据口序号',
            module_name: '数据口状态',
            port_status: '端口状态',
            speed: '速率',
            duplex: '双工',

        },

        voicePortStatus: {
            voice_port_id: '语音口序号',
            module_name: '语音口状态',
            protocol_type: '协议类型',
            port_status: '端口状态',
            telphone_no: '电话号码',

        }

    },

    enums: {
        onu_regist_status: {
            k_01: 'STATE_INIT',
            k_02: 'STATE_STANDBY',
            k_03: 'STATE_SERIAL_NUMBER',
            k_04: 'STATE_RANGING',
            k_05: 'STATE_OPERATION',
            k_06: 'STATE_POPUP',
            k_07: 'STATE_EMERGENCY_STOP'
        },
        onu_auth_status: {
            k_0: '初始化',
            k_1: '注册成功',
            k_2: '逻辑ID错误',
            k_3: '逻辑密码错误',
            k_4: '逻辑ID冲突',
            k_10: '物理SN冲突',
            k_11: '无资源',
            k_12: '类型错误',
            k_13: '物理SN错误',
            k_14: '物理密码错误',
            k_15: '物理密码冲突'
        },
        data_port_status: {
            k_0: 'UP',
            k_1: 'Nolink',
            k_2: 'Error',
            k_3: 'Disable'
        },
        data_speed: {
            k_0: '10M',
            k_2: '100M',
            k_3: '1000M',
            k_4: 'Auto'
        },
        data_duplex: {
            k_0: '半双工',
            k_1: '全双工',
            k_2: '自动'
        },
        voice_protocol_type: {
            k_0: 'MGCP',
            k_1: 'H.248',
            k_2: 'SIP'
        },
        voice_port_status: {
            k_0: '端口未激活',
            k_1: '端口正在注册',
            k_2: '端口状态空闲',
            k_3: '端口已摘机',
            k_4: '端口在拨号',
            k_5: '端口正在振铃',
            k_6: '端口处于回铃音',
            k_7: '端口正在连接中',
            k_8: '端口已连接',
            k_9: '端口已挂机',
            k_10: '端口未连接',
            k_11: '端口状态忙',
            k_12: '端口注册失败',
            k_13: '用户久不挂机'
        },
        result_code: {
            k_101: '用户名或密码错误',
            // k_201: '获取光口信息失败' ...
        }
    }
}
