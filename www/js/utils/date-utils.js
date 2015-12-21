var dateUtils = {
    /**
     * 获取当前日期 yyyy-MM-dd 格式字符串
     * @returns {string}
     */
    getToday: function() {
        return new Date().format('yyyy-MM-dd');
    },

    /**
     * 获取当前月份第一天
     * @returns {string}
     */
    getCurrentMonthFirstDay: function() {
        var now = new Date();
        var year = now.getFullYear();
        var month = now.getMonth() + 1;
        if (month < 10) {
            month = '0' + month;
        }
        return year + "-" + month + "-01";
    },

    /**
     * 获取去年今天
     * @returns {Date}
     */
    getDayOfLastYear: function() {
        var now = new Date(new Date().format('yyyy-MM-dd'));
        var time = now.getTime() - 365 * 24 * 60 * 60 * 1000;
        return new Date(time);
    },

    /**
     * 获取指定年的指定天
     * @returns {string}
     */
    getDate: function(year, days) {
        var days = (days - 1) >= 0 ? days - 1 : 0;
        var firstDay = new Date(year + "-01-01");
        var time = firstDay.getTime() + days * 24 * 60 * 60 * 1000;
        return new Date(time).format('yyyy-MM-dd');
    },

    /**
     * 获取指定日期
     * days 正数表示向后几天，附属表示向前几天
     * @returns {string}
     */
    getSpeDate: function(days) {
        var nowTime = new Date().getTime();
        var time = nowTime + parseInt(days) * 24 * 60 * 60 * 1000;
        return new Date(time).format('yyyy-MM-dd');
    }

}
