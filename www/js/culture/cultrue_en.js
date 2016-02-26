var ONU_LOCAL = {
    basicInfo: '基本信息',
    check: '诊断',
    history: '历史',
    setting: 'Setting',

    unit: {
        temperature: '℃',
        voltage: 'V',
        bias_current: 'mA',
        opt_power: 'dBm'
    },

    loginModule: {
        login: 'Connect ONU',
        ok: 'OK',
        history: 'View past report',
        uuid: 'APP Identification Number：',
        license_ph: 'Please enter license'
    },

    basicModule: {
        one_check: 'Detect All',
        scan_bar_code: 'Scan Bar Code',
        tip: 'Scan code error,Please try again',
        overdue: 'Overdue',
        not_expired: 'Not Expired'
    },

    checkModule: {
        begin_check: 'Detect',
        wait_for_checking: '正在检测，请稍后...',
        one_key_check: 'Detect All',
        generate_report: 'Generate Report',
        pon_port_item: 'PON Port Detection',
        data_port_item: 'Data Port Detection',
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
        generate_report_failed: '生成报告失败。',
        exist : 'The report name has already exist.',
        rename : 'Rename',
        cover : 'Cover the file with same name',
    },

    detailModule: {
        address: 'Report Name',
        date: 'Date',
        conclusion: 'Result',
        report: 'Report',
        note: 'Note'
    },

    historyModule: {
        login: '登录',
        return:'Return',
        ok: '确定',
        del: '删除',
        del_sure: '确认删除',
        cancel: '取消',
        choose: '选择',
        start_date: '开始日期',
        end_date: '结束日期',
        date_range: '日期范围',
        search_ph: '请输入查询关键字',
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

    settingModule: {
        report_retention_time: 'Report Retention Time ',
        warranty_period: 'Warranty Period',
        version: 'Version',
        software_version: 'ONUsmartChecker V1.0 Build 10',
        copyright: 'Copyright © 2016, Fiberhome Telecommunication Technologies Co.,LTD',
        ok: '确定',
        reconnect: 'Reconnect',
        date_select: {
            one_year: 'one year',
            two_years: 'two years'
        },
        retention_time_select: {
            day: 'one day',
            month:'one month',
            year:'one year',
            permanent: 'permanent'
        }
    },

    report: {
        deviceInfo: {
            module_name: 'ONU Infomation',
            device_type: 'Equipment ID',
            vendor: 'Vendor',
            hardware_version: 'Hardware Version',
            software_version: 'Software Version',
            mac: 'MAC',
            sn: 'SN',
            warranty_period: 'Warranty Period',
            led_status: 'Registration Status LED',
            onu_regist_status: 'ONU Registration Status',
            onu_auth_status: 'ONU AUTH Status',
            pon_port_number: 'PON Port Number',
            data_port_number: 'Data Port Number',
            voice_port_number: 'Voice Port Number',
        },

        ponPortStatus: {
            module_name: 'PON Port Detection',
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
            module_name: 'Data Port Detection',
            port_status: '端口状态',
            speed: '速率',
            duplex: '双工',

        },

        voicePortStatus: {
            module_name: 'Voice Port Detection',
            signal_svlan_id : 'signal_svlan_id',
            svlan_cos : 'svlan_cos',
            signal_cvlan_id : 'signal_cvlan_id',
            cvlan_cos : 'cvlan_cos',
            ip_mode : 'ip_mode',
            signal_ip : 'signal_ip',
            ip_mask : 'ip_mask',
            signal_gateway : 'signal_gateway',
            pppoe_user : 'pppoe_user',
            pppoe_password : 'pppoe_password',
            first_mgc_ip: 'first_mgc_ip',
            first_mgc_port: 'first_mgc_port',
            second_mgc_ip: 'second_mgc_ip',
            second_mgc_port: 'second_mgc_port',
            h248_local_port : 'h248_local_port',
            reg_mode : 'reg_mode',
            mgid : 'mgid',
            protocol_type: 'protocol_type',
            first_sip_registrar_server_ip: 'first_sip_registrar_server_ip',
            first_sip_registrar_server_port: 'first_sip_registrar_server_port',
            second_sip_registrar_server_ip: 'second_sip_registrar_server_ip',
            second_sip_registrar_server_port: 'second_sip_registrar_server_port',
            first_sip_proxy_server_ip: 'first_sip_proxy_server_ip',
            first_sip_proxy_server_port: 'first_sip_proxy_server_port',
            second_sip_proxy_server_ip: 'second_sip_proxy_server_ip',
            second_sip_proxy_server_port: 'second_sip_proxy_server_port',
            sip_local_port : 'sip_local_port', 
            mgc_reg_status : 'mgc_reg_status',  
            voice_port_id : 'Port No',
            port_status : 'port_status',
            port_enable : 'port_enable',
            user_tid : 'user_tid',
            telphone_no : 'telphone_no',
            sip_user_name: 'sip_user_name',
            sip_user_pass: 'sip_user_pass',

        }

    },

    enums: {
        led_status: {
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
            k_0: 'AUTH_STA_INIT',
            k_1: 'AUTH_STA_OK',
            k_2: 'AUTH_STA_LOID_ERR',
            k_3: 'AUTH_STA_LPWD_ERR',
            k_4: 'AUTH_STA_LOID_COLLISION',
            k_10: 'AUTH_STA_SN_COLLISION',
            k_11: 'AUTH_STA_NO_RESOURCE',
            k_12: 'AUTH_STA_TYPE_ERR',
            k_13: 'AUTH_STA_SN_ERR',
            k_14: 'AUTH_STA_PWD_ERR',
            k_15: 'AUTH_STA_PWD_COLLISION'
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
            k_0: 'Half',
            k_1: 'Full',
            k_2: 'Auto'
        },
        voice_protocol_type: {
            k_0: 'None',
            k_2: 'H.248',
            k_4: 'SIP'
        },

        voice_mgc_reg_status : {
            k_0: 'Registering ',
            k_1: 'Registration Success',
            k_2: 'Registration Failed'
        },

        voice_port_status: {
            k_0: 'EP_STATUS_INACTIVE',
            k_1: 'EP_STATUS_REGING',
            k_2: 'EP_STATUS_IDLE',
            k_3: 'EP_STATUS_OFF_HOOK',
            k_4: 'EP_STATUS_DIALING',
            k_5: 'EP_STATUS_RING',
            k_6: 'EP_STATUS_RINGBACK',
            k_7: 'EP_STATUS_CONNECTING',
            k_8: 'EP_STATUS_CONNECTED',
            k_9: 'EP_STATUS_ON_HOOK',
            k_10: 'EP_STATUS_DISCONNECTING',
            k_11: 'EP_STATUS_BUSY',
            k_12: 'EP_STATUS_REG_FAIL',
            k_13: 'EP_STATUS_NOT_HANGUP'
        },

        voice_reg_mode : {
            k_0: 'IP',
            k_1: 'Domain',
            k_2: 'Equipment'
        },

        voice_port_enable : {
            k_0: 'Disable',
            k_1: 'Enable'
        },

        voice_ip_mode : {
            k_0: 'Static',
            k_1: 'PPPoE',
            k_2: 'DHCP'
        },


        result_code: {
            k_101: '用户名或密码错误',
            // k_201: '获取光口信息失败' ...
        }
    },

    suggest: {
        reason: {
            r1: 'The ONU is not activated.',
            r2: 'The reticle is not plugged or broken.',
            r3: 'Receiving optical power is out of range(-8db ~ -28db).Optical module is abnormal.',
            r4: 'OLT return error. ',
            r5: 'The OLT PON port is disabled.',
            r6: 'In authentication. ',
            r7: 'Not authenticated',
            r8: 'No optical signals are received.',
            r9: 'NOptical module temperature is too high. ',
            r10: 'Optical module voltage is too high. ',
            r11: 'Optical module voltage is too low.',
            r12: 'Optical module current is too high. ',
            r13: 'Optical module “Tx_OptPower” is too high.',
            r14: 'Optical module “Tx_OptPower” is too low. ',
            r15: 'Optical module “Rx_OptPower” is too high. ',
            r16: 'Optical module “Rx_OptPower” is too low.',
            r17: 'The reticle is not plugged or broken. ',
            r18: 'PHY chip fault. ',
            r19: 'The port is disabled. ',
            r20: 'Voice service not configured. ',
            r21: 'Port is not activated. ',
            r22: 'Port Registration Failure. ',
            r23: 'Port Registration Failure.',
            r24: 'The user does not hang up, or outside line has a fault.',
            r25: 'Gateway Registration Failure.',
        },
        msg: {
            m1: 'The ONU is not activated.',
            m2: 'Please check whether the fiber is normal or bad contact.)',
            m3: 'Continuous observation, If the optical module voltage exceeds the threshold for a long time, and optical power is abnormal or report alarms, It may be the optical module is aging or damaged. Please contact technical support to resolve.' + 'Logic ID or password authentication configuration error. (Please confirm whether the authorization information is correct or not, and re-authorize the ONU)',
            m4: 'Please check the ONU configuration in the OLT authentication table is correct.',
            m5: 'Please enable the OLT PON port.',
            m6: 'Please wait a moment, or check the ONU authentication table on OLT and re-authorize the ONU',
            m7: 'Please confirm whether the authorization information is correct or not, and re-authorize the ONU',
            m8: 'Please check whether the fiber is normal or bad contact.',
            m9: 'Check equipment fan is working properly, or open the air conditioner to lower the indoor temperature. Continuous observation, if the optical module temperature exceeds the threshold for a long time, and optical power is abnormal or report alarms, It may be the optical module is aging or damaged. Please contact technical support to resolve.',
            m10: 'Continuous observation, If the optical module voltage exceeds the threshold for a long time, and optical power is abnormal or report alarms, It may be the optical module is aging or damaged. Please contact technical support to resolve.',
            m11: 'Continuous observation, If the optical module current exceeds the threshold for a long time, and optical power is abnormal or report alarms, It may be the optical module is aging or damaged. Please contact technical support to resolve.',
            m12: 'Continuous observation, If the optical module “Tx_OptPower” exceeds the threshold for a long time, It may be the optical module is aging or damaged. Please contact technical support to resolve.',
            m13: 'Check the quality of optical fibers and optical lines. Continuous observation, If the optical module “Rx_OptPower” exceeds the threshold for a long time, or not working properly , You should replace the optical module or contact technical support to resolve.',
            m14: 'Please confirm whether the reticle is broken or bad contact',
            m15: 'Please repair the PHY chip or replace ONU.',
            m16: 'Please enable the port.',
            m17: 'Please configure voice service.',
            m18: 'For SIP ,please check the parameters of 3、6、7、18、19、22、23、26、27、29 are cofigured right  or not for schedule B ;For H.248,please check the parameters of 27、28 are cofigured right or not for schedule B.',
            m19: 'Please check the connection between ONU and server is normal.',
            m20: 'For SIP ,please check the parameters of 3、6、7、18、19、22、23、26、27、29 are cofigured right  or not for schedule B ;For H.248,please check the parameters of 27、28 are cofigured right or not for schedule B.',
            m21: 'If exclude not hang up, You should check the outside line.',
            m22: 'Please check the connection between ONU and server is normal.',
            m23: 'Please check the parameters of 3、6、7、11、12、15 are cofigured right or not for schedule B.',
        }
    }
}
