'use strict';
angular.module('starter.services').service('File', ['$rootScope', '$log', '$cordovaFile',
    '$filter', '$ionicPlatform', 'L', 'Popup',function($rootScope, $log, $cordovaFile,
    $filter, $ionicPlatform, L, Popup) {

    var fileSystem;
    var lFileSystem;
    var lFileName = 'ol.json';

    //存放报告的文件夹名称
    var reportDir = 'onu_report';
    var _reportDir = reportDir + '/';
    //文件类型
    var fileType = '.html';

    $ionicPlatform.ready(function() {
        lFileSystem = cordova.file.dataDirectory;
        lFileSystem = cordova.file.externalRootDirectory;
        $cordovaFile.checkFile(lFileSystem, lFileName).then(function(success) {
   
            $cordovaFile.readAsText(lFileSystem, lFileName).then(function(data) {
                data = base64decode(data);
                var RegisterData = JSON.parse(data);

                if (L.b() === RegisterData.key) {
                    var startDate = dateUtils.getDayOfLastYear();
                   
                    if (RegisterData.date < startDate) {
                        Popup.showTip(ONU_LOCAL.tip.l_expired);
                        $rootScope.isRegistered = false;
                        removeL();
                    } else {
                        $rootScope.isRegistered = true;
                    }
                } else {
                    Popup.showTip(ONU_LOCAL.tip.l_wrong);
                    removeL();
                    $rootScope.isRegistered = false;
                }

            }, function(error) {
                alert(JSON.stringify(error));
            });

        }, function(error) {

            if (error.code === 1) {

                $rootScope.isRegistered = false;
            } else {
                alert('ol.json can\'t be created,error message is :' + error.message);

            }
        });

        //  在File service初始化的时候:
        //  1.检查onu_report是否存在，不存在则建立onu_report文件夹
        //  2.清空onu_del文件夹
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
    this.readReport = function(fileName) {
        return $cordovaFile.readAsText(fileSystem, _reportDir + fileName + fileType);
    };

    //删除报告
    this.removeReport = function(fileName){
         $cordovaFile.removeFile(fileSystem, _reportDir + fileName + fileType).then(success, function(error) {
                alert('removeReport error : ' + JSON.stringify(error));
            });
    };

    //检查文件是否存在
    this.checkFile = function(fileName) {
        return $cordovaFile.checkFile(fileSystem, _reportDir + fileName + fileType);
    };

  
    this.createL = function(data) {
        var processedData = base64encode(data);
        return $cordovaFile.writeFile(lFileSystem, lFileName, processedData, true);
    };


    this.readL = function() {
        return $cordovaFile.readAsText(lFileSystem, lFileName);
    };


    function removeL() {
        $cordovaFile.removeFile(lFileSystem, lFileName).then(success, function(error) {
                alert('removeL error : ' + JSON.stringify(error));
            });
    }
}]);
