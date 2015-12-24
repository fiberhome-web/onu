angular.module('starter.services').service('Report', function() {

    this.deviceInfo = {};

    this.setDeviceInfo = function(info) {
        this.deviceInfo = info;
    };

    this.getDeviceInfo = function() {
        return this.deviceInfo;
    };
});
