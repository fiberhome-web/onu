angular.module('starter.services').service('File',function($log, $cordovaFile,
	$filter, $ionicPlatform){

	var fileSystem;

	//存放报告的文件夹名称
	var reportDir = 'onu_report';
	//删除的报告存放的文件夹
	var deleteDir = 'onu_del';
	var _reportDir = reportDir + '/';
	var _deleteDir = deleteDir + '/';

	
	//  在File service初始化的时候:
	//  1.检查onu_report是否存在，不存在则建立onu_report文件夹
	//  2.清空onu_del文件夹
	$ionicPlatform.ready(function() {
	  	//fileSystem = cordova.file.externalRootDirectory;

	  	//检查存放报告的文件夹以及用于删除文件的文件夹是否存在，不存在则创建
	  	$cordovaFile.checkDir(fileSystem, reportDir).then(success ,function(error){
			//如果存放报告的文件夹不存在，重新新建
			if(error.code === 1) {
				$cordovaFile.createDir(fileSystem, reportDir, false).then(success, function(error){
					alert("onu_report can't be crated,error message is : " + error.message);
				});
			} else {
				alert("onu_report can't be crated,error message is : " + error.message);
			}

		});


		//清空onu_del的所有内容，重新新建onu_del文件夹
		$cordovaFile.removeRecursively(fileSystem, deleteDir).then(function(){
			$cordovaFile.createDir(fileSystem, deleteDir, true).then(success, function(error){
				alert("onu_del can't be crated,error message is : " + error.message);
			});
		},function(error){
			//如果是错误1表示文件夹不存在，则重新创建
			if(error.code === 1) {
				$cordovaFile.createDir(fileSystem, deleteDir, true).then(success, function(error){
					alert("onu_del can't be crated,error message is : " + error.message);
				});
			}else {
				alert('error :' + JSON.stringify(error));
			}
		});
		
	});

	//成功回调
	function success(success){
		alert('success :' + JSON.stringify(success));
	}
	//失败回调
	function error(error) { 
		alert('error :' + JSON.stringify(error));
	}

	//创建报告
	this.createReport = function(fileName, data){
		$cordovaFile.writeFile(fileSystem , _reportDir + fileName, data, true).then(success,error);
	}

	//增加一条记录
	this.addReportRecord = function(fileName, content){
		$cordovaFile.writeExistingFile(fileSystem, _reportDir + fileName, content).then(success,error);
	}

	//读取文件
	this.readReport = function(fileName){
		return $cordovaFile.readAsText(fileSystem, _reportDir + fileName);
	}

	//移动报告文件到删除文件夹
	this.moveFile = function(fileName){
		$cordovaFile.moveFile(fileSystem, _reportDir + fileName,fileSystem, _deleteDir + fileName).then(success,error);
	}

	//删除文件夹及里面的所有文件
	this.removeRecursively = function(){
		$cordovaFile.removeRecursively(fileSystem,'onu_del').then(success,error);
	}
});