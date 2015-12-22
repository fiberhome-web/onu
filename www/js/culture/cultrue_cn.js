var ONU_LOCAL = {
	basicInfo: '基本信息',
	check: '诊断',
	history: '历史',
    //fjsdjflskdfkj

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
    	voice_port_item: '语音端口诊断项'
    },

    historyModule: {
        login: '登录',
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
        }
    }
}
