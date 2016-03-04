'use strict';
angular.module('starter.services').service('File', function($rootScope, $log, $cordovaFile,
    $filter, $ionicPlatform, LicenseService, Popup) {

    var fileSystem;
    var licenseFileSystem;
    var licenseFileName = 'onu_license.json';

    //存放报告的文件夹名称
    var reportDir = 'onu_report';
    var _reportDir = reportDir + '/';
    //文件类型
    var fileType = '.html';
    


    //  在File service初始化的时候:
    //  1.检查onu_report是否存在，不存在则建立onu_report文件夹
    //  2.清空onu_del文件夹
    $ionicPlatform.ready(function() {
        licenseFileSystem = cordova.file.dataDirectory;
        licenseFileSystem = cordova.file.externalRootDirectory;
        $cordovaFile.checkFile(licenseFileSystem, licenseFileName).then(function(success) {
            // 若存在license文件，表示已注册过
            $cordovaFile.readAsText(licenseFileSystem, licenseFileName).then(function(data) {
                data = base64decode(data);
                var RegisterData = JSON.parse(data);
                //若license正确，判断是否过期
                if (LicenseService.isLicenseCorrect(LicenseService.registerData.uuid, RegisterData.key)) {
                    var startDate = dateUtils.getDayOfLastYear();
                    //若注册时间到今天超过一年
                    if (RegisterData.date < startDate) {
                        Popup.showTip(ONU_LOCAL.tip.license_expired);
                        $rootScope.isRegistered = false;
                        removeLicense();
                    } else {
                        $rootScope.isRegistered = true;
                    }
                } else {
                    Popup.showTip(ONU_LOCAL.tip.license_wrong);
                    removeLicense();
                    $rootScope.isRegistered = false;
                }

                console.log('key if license.json file:'+RegisterData.key);
            }, function(error) {
                alert(JSON.stringify(error));
            });

        }, function(error) {
            //如果license文件不存在
            if (error.code === 1) {
                // 未注册，则弹出注册框
                $rootScope.isRegistered = false;
            } else {
                alert('onu_license.json can\'t be created,error message is :' + error.message);

            }
        });

        fileSystem = cordova.file.externalRootDirectory;

        //检查存放报告的文件夹是否存在，不存在则创建
        $cordovaFile.checkDir(fileSystem, reportDir).then(success, function(error) {
            //如果存放报告的文件夹不存在，重新新建
            if (error.code === 1) {
                $cordovaFile.createDir(fileSystem, reportDir, false).then(success, function(error) {
                    alert('onu_report can\'t be created,error message is : ' + error.message);
                });
            } else {
                alert('onu_report can\'t be created,error message is :' + error.message);
            }

        });

    });

    //成功回调
    function success(info) {
        console.info('success :' + JSON.stringify(info));
    }
    //失败回调
    function error(info) {
        alert('File error :' + JSON.stringify(info));
    }

    //创建报告
    this.createReport = function(fileName, data) {
        //增加报告文件基本的HTML格式代码
        var head = '<!DOCTYPE html><html><head><meta charset="utf-8"></head>';
        var tail = '</html>';
        $cordovaFile.writeFile(fileSystem, _reportDir + fileName + fileType, head + data + tail, true).then(success, function(error) {
            alert('createReport error : ' + JSON.stringify(error));
        });
    };

    //增加一条记录
    this.addReportRecord = function(fileName, content) {
        $cordovaFile.writeExistingFile(fileSystem, _reportDir + fileName + fileType, content).then(success, function(error) {
            alert('addReportRecord error : ' + JSON.stringify(error));
        });
    };

    //读取文件
    this.readReport = function(filePath) {
        return $cordovaFile.readAsText(fileSystem, filePath).then(success, function(error) {
                alert('readReport error : ' + JSON.stringify(error));
            });
    };

    //删除报告
    this.removeReport = function(fileName){
         $cordovaFile.removeFile(fileSystem, _reportDir + fileName + fileType).then(success, function(error) {
                alert('removeReport error : ' + JSON.stringify(error));
            });
    }

    //检查文件是否存在
    this.checkFile = function(fileName) {
        return $cordovaFile.checkFile(fileSystem, _reportDir + fileName + fileType);
    };

    //创建license文件
    this.createLicense = function(data) {
        var processedData = base64encode(data);
        return $cordovaFile.writeFile(licenseFileSystem, licenseFileName, processedData, true);
    };

    //读取license文件
    this.readLicense = function() {
        return $cordovaFile.readAsText(licenseFileSystem, licenseFileName);
    };

    //删除license文件
    function removeLicense() {
        $cordovaFile.removeFile(licenseFileSystem, licenseFileName).then(success, function(error) {
                alert('removeLicense error : ' + JSON.stringify(error));
            });
    }
});
