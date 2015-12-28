'use strict';
angular.module('starter.services').service('File', function($log, $cordovaFile,
    $filter, $ionicPlatform) {

    var fileSystem;

    //存放报告的文件夹名称
    var reportDir = 'onu_report';
    //文件类型
    var fileType = '.html';
    //删除的报告存放的文件夹
    var deleteDir = 'onu_del';
    var _reportDir = reportDir + '/';
    var _deleteDir = deleteDir + '/';


    //  在File service初始化的时候:
    //  1.检查onu_report是否存在，不存在则建立onu_report文件夹
    //  2.清空onu_del文件夹
    $ionicPlatform.ready(function() {
        fileSystem = cordova.file.externalRootDirectory;

        //检查存放报告的文件夹以及用于删除文件的文件夹是否存在，不存在则创建
        $cordovaFile.checkDir(fileSystem, reportDir).then(success, function(error) {
            //如果存放报告的文件夹不存在，重新新建
            if (error.code === 1) {
                $cordovaFile.createDir(fileSystem, reportDir, false).then(success, function(error) {
                    alert('onu_report can\'t be crated,error message is : ' + error.message);
                });
            } else {
                alert('onu_report can\'t be crated,error message is :'  + error.message);
            }

        });


        //清空onu_del的所有内容，重新新建onu_del文件夹
        $cordovaFile.removeRecursively(fileSystem, deleteDir).then(function() {
            $cordovaFile.createDir(fileSystem, deleteDir, true).then(success, function(error) {
                alert('onu_del can\'t be crated,error message is : ' + error.message);
            });
        }, function(error) {
            //如果是错误1表示文件夹不存在，则重新创建
            if (error.code === 1) {
                $cordovaFile.createDir(fileSystem, deleteDir, true).then(success, function(error) {
                    alert('onu_del can\'t be crated,error message is : ' + error.message);
                });
            } else {
                alert('error :' + JSON.stringify(error));
            }
        });

    });

    //成功回调
    function success(info) {
        console.info('success :' + JSON.stringify(info));
    }
    //失败回调
    function error(info) {
        alert('error :' + JSON.stringify(info));
    }

    //创建报告
    this.createReport = function(fileName, data) {
    	//增加报告文件基本的HTML格式代码
    	var head = '<!DOCTYPE html><html><head><meta charset="utf-8"></head>';
    	var tail = '</html>';
        $cordovaFile.writeFile(fileSystem, _reportDir + fileName + fileType, head + data + tail, true).then(success, error);
    };

    //增加一条记录
    this.addReportRecord = function(fileName, content) {
        $cordovaFile.writeExistingFile(fileSystem, _reportDir + fileName + fileType, content).then(success, error);
    };

    //读取文件
    this.readReport = function(fileName) {
        return $cordovaFile.readAsText(fileSystem, _reportDir + fileName + fileType);
    };

    //移动报告文件到删除文件夹
    this.moveFile = function(fileName) {
        $cordovaFile.moveFile(fileSystem, _reportDir + fileName + fileType, fileSystem, _deleteDir + fileName + fileType).then(success, error);
    };

    //删除文件夹及里面的所有文件
    this.removeRecursively = function() {
        $cordovaFile.removeRecursively(fileSystem, deleteDir).then(success, error);
    };

    //检查文件是否存在
    this.checkFile = function(fileName){
    	return $cordovaFile.checkFile(fileSystem, _reportDir + fileName + fileType);
    };
});
