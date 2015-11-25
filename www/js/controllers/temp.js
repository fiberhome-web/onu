
angular.module('starter.controllers') 
	.controller('HistoryCtrl', function($scope,$log, $cordovaSocialSharing,DB,
		$cordovaFile,File,$filter,$cordovaEmailComposer, $cordovaSQLite,$cordovaFileOpener2) {

		$scope.delTab = function(){
			DB.delete();
		}

		$scope.insertTab = function(){
			DB.insert();
		}

		$scope.queryTab = function(){
			DB.query().then(function(res){
				var length = res.rows.length;
				var str = '';
				for(var i=0; i< length; i++) {
					str += res.rows.item(i).id + res.rows.item(i).name + '\n';
				}
				alert('success :' + str);
			},function(error){
				alert('error :' + JSON.stringify(error));
			});
		}


		var today = $filter('date')(new Date(), 'yyyy-MM-dd');
		var fileName = 'report_' + today + '.html';


		//查看报告
		$scope.open = function(){
			$cordovaFileOpener2.open(
			    '/storage/emulated/0/onu_report/' + fileName,
			    'text/html'
			    //'application/msword'   //text/html
			  ).then(function() {
			      // Success!
			  }, function(err) {
			      alert(JSON.stringify(err));
			 });

		}

		
		$scope.moveFile = function(){
			File.moveFile(fileName);
		}



		$scope.read = function(){
			File.readReport(fileName).then(function (success) {
	        	alert(success);
	      	}, function (error) {
	        	alert(JSON.stringify(error));
	      	});
		}

		$scope.write = function(){	
			File.createReport(fileName,'<!DOCTYPE html<html> <meta charset="utf-8"><head><style type="text/css">span{color:red}</style></head><body><span>测试点2 ： 正常xzzzx</span></body></html>');
		}

		$scope.addReportRecord = function() {
		    File.addReportRecord(fileName, '测试点2 ： 正常\n');
		};


		
		$scope.email = function() {
		    var email = {
		      // to: '',
		      // cc: '',
		      // bcc: [],
		      attachments: [
		        'file:///storage/emulated/0/onu_report/' + fileName
		        // 'res://icon.png',
		        // 'base64:icon.png//iVBORw0KGgoAAAANSUhEUg...',
		        // 'file://README.pdf'
		      ],
		      subject: 'onu 检测报告',
		  //    body: 'How are you? Nice greetings from Leipzig',
		      isHtml: true
		    };

		    $cordovaEmailComposer.open(email).then(null, function () {
		      // user cancelled email
		    });
		};

		$scope.share = function(){
			$cordovaSocialSharing.share('message', 'onu 检测报告', null, 'http://www.baidu.com') // Share via native share sheet
	    	.then(function(result) {
		      // Success!
		    }, function(err) {
		      // An error occured. Show a message to the user
		    });
		}
		
    
	      
});