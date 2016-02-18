var ONU_LOCAL = {
    basicInfo: '基本信息',
    check: '诊断',
    history: '历史',
    setup:'设置',

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
        one_check: '一键检测',
        scan_bar_code:'扫一扫'
    },

    checkModule: {
        begin_check: 'Detect',
        wait_for_checking: '正在检测，请稍后...',
        one_key_check: 'Detect All',
        generate_report: 'Generate Report',
        pon_port_item: 'PON Port Detection',
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
        stay_on_this_page: '停留在该页',
        view_report: '查看报告',
        generate_report_successfully: '生成报告成功。',
        generate_report_failed: '生成报告失败。'
    },

    detailModule: {
        address: '检测地点',
        date: '检测时间',
        conclusion: '检测结论',
        report: '检测报告'
    },

    historyModule: {
        login: '登录',
        ok: '确定',
        del: '删除',
        del_sure: '确认删除',
        cancel: '取消',
        choose: '选择',
        start_date: '开始日期',
        end_date: '结束日期',
        date_range: '日期范围',
        search_ph:'请输入查询关键字',
        date_select: {
            all: '全部',
            today: '今天',
            twoDays: '2天内',
            week: '一周内',
            month: '一月内',
            customized: '自定义日期选择'
        },
        types: {
            all: '全部',
            normal: '正常',
            abnormal: '故障'
        },
        faults: {
            pon: '光口异常',
            data: '语音端口异常',
            voice: '数据端口异常'
        }
    },

    setupModule:{
        auto_delete_report:'自动删除报告',
        warranty_period:'保修期',
        version:'版本',
        software_version:'ONUsmartChecker V1.0 Build 10',
        copyright:'Copyright © 2016, Fiberhome Telecommunication Technologies Co.,LTD',
        ok:'确定',
        reconnect:'重新连接',
        date_select: {
            one_year:'一年',
            two_years:'两年'
        },
        del_select:{
            never:'从不',
            day:'一天'
        }
    },

    report: {
        deviceInfo: {
            equipment_id: '设备ID',
            device_type: 'ONU型号',
            vendor: '厂商',
            hardware_version: '硬件版本号',
            software_version: '软件版本号',
            mac: 'MAC',
            sn: 'SN',
            warranty_period:'保修期',
            registration_status_led:'注册状态灯',
            onu_regist_status: 'ONU注册状态',
            onu_auth_status: 'ONU认证状态',
            pon_port_number: '光口个数',
            data_port_number: '数据口个数',
            voice_port_number: '语音口个数',
        },

        ponPortStatus: {
            pon_port_id: 'Port No',
            led_status: 'Status',
            temperature: 'Temperature',
            voltage: 'Voltage',
            bias_current: 'Bias current',
            tx_opt_power: 'Tx_OptPower',
            rx_opt_power: 'Rx_OptPower',

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
        registration_status_led:{
            k_0: 'Off',
            k_1: 'On',
            k_2: 'Blinking',
        },
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
    },

    suggest : {
        reason : {
            r1 : 'The ONU is not activated.',
            r2 : 'The reticle is not plugged or broken.',
            r3 : 'Receiving optical power is out of range(-8db ~ -28db).Optical module is abnormal.',
            r4 : 'OLT return error. ',
            r5 : 'The OLT PON port is disabled.',
            r6 : 'In authentication. ',
            r7 : 'Not authenticated',
            r8 : 'No optical signals are received.',
            r9 : 'NOptical module temperature is too high. ',
            r10 : 'Optical module voltage is too high. ',
            r11 : 'Optical module voltage is too low.',
            r12 : 'Optical module current is too high. ',
            r13 : 'Optical module “Tx_OptPower” is too high.',
            r14 : 'Optical module “Tx_OptPower” is too low. ',
            r15 : 'Optical module “Rx_OptPower” is too high. ',
            r16 : 'Optical module “Rx_OptPower” is too low.',
            r17 : 'The reticle is not plugged or broken. ',
            r18 : 'PHY chip fault. ',
            r19 : 'The port is disabled. ',
            r20 : 'Voice service not configured. ',
            r21 : 'Port is not activated. ',
            r22 : 'Port Registration Failure. ',
            r23 : 'Port Registration Failure.',
            r24 : 'The user does not hang up, or outside line has a fault.',
            r25 : 'Gateway Registration Failure.',
        },
        msg : {
            m1 : 'The ONU is not activated.',
            m2 : 'Please check whether the fiber is normal or bad contact.)',
            m3 : 'Continuous observation, If the optical module voltage exceeds the threshold for a long time, and optical power is abnormal or report alarms, It may be the optical module is aging or damaged. Please contact technical support to resolve.'
                 + 'Logic ID or password authentication configuration error. (Please confirm whether the authorization information is correct or not, and re-authorize the ONU)',
            m4 : 'Please check the ONU configuration in the OLT authentication table is correct.',
            m5 : 'Please enable the OLT PON port.',
            m6 : 'Please wait a moment, or check the ONU authentication table on OLT and re-authorize the ONU',
            m7 : 'Please confirm whether the authorization information is correct or not, and re-authorize the ONU',
            m8 : 'Please check whether the fiber is normal or bad contact.',
            m9 : 'Check equipment fan is working properly, or open the air conditioner to lower the indoor temperature. Continuous observation, if the optical module temperature exceeds the threshold for a long time, and optical power is abnormal or report alarms, It may be the optical module is aging or damaged. Please contact technical support to resolve.',
            m10 : 'Continuous observation, If the optical module voltage exceeds the threshold for a long time, and optical power is abnormal or report alarms, It may be the optical module is aging or damaged. Please contact technical support to resolve.',
            m11 : 'Continuous observation, If the optical module current exceeds the threshold for a long time, and optical power is abnormal or report alarms, It may be the optical module is aging or damaged. Please contact technical support to resolve.',
            m12 : 'Continuous observation, If the optical module “Tx_OptPower” exceeds the threshold for a long time, It may be the optical module is aging or damaged. Please contact technical support to resolve.',
            m13 : 'Check the quality of optical fibers and optical lines. Continuous observation, If the optical module “Rx_OptPower” exceeds the threshold for a long time, or not working properly , You should replace the optical module or contact technical support to resolve.',
            m14 : 'Please confirm whether the reticle is broken or bad contact',
            m15 : 'Please repair the PHY chip or replace ONU.',
            m16 : 'Please enable the port.',
            m17 : 'Please configure voice service.',
            m18 : 'For SIP ,please check the parameters of 3、6、7、18、19、22、23、26、27、29 are cofigured right  or not for schedule B ;For H.248,please check the parameters of 27、28 are cofigured right or not for schedule B.',
            m19 : 'Please check the connection between ONU and server is normal.',
            m20 : 'For SIP ,please check the parameters of 3、6、7、18、19、22、23、26、27、29 are cofigured right  or not for schedule B ;For H.248,please check the parameters of 27、28 are cofigured right or not for schedule B.',
            m21 : 'If exclude not hang up, You should check the outside line.',
            m22 : 'Please check the connection between ONU and server is normal.',
            m23 : 'Please check the parameters of 3、6、7、11、12、15 are cofigured right or not for schedule B.',
        }
    }
}
