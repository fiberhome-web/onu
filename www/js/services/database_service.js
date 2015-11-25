angular.module('starter.services').service('DB',function($cordovaSQLite, 
	$ionicPlatform, $filter){
	var query,db;

	$ionicPlatform.ready(function() {
		//检查是否创建了数据库和表，不存在则创建
	  	db = $cordovaSQLite.openDB({ name: "onu.db" });
	  	query = "CREATE TABLE IF NOT EXISTS fiber_onu (id primary key, name, date, status, data, conclusion)";
	    $cordovaSQLite.execute(db, query).then(success, error);
	});


	//成功回调
	function success(success){
		alert('success :' + JSON.stringify(success));
	}
	//失败回调
	function error(error) { 
		alert('error :' + JSON.stringify(error));
	}


	this.delete = function(){
		query = "DROP TABLE fiber_onu ";
	    $cordovaSQLite.execute(db, query).then(success, error);
	}

	this.query = function(){
		query = "SELECT id , name, date, status FROM fiber_onu where name like '%test%' ";
	    return $cordovaSQLite.execute(db, query);
	}

	this.insert = function(){
		var query = "INSERT INTO fiber_onu (id , name, date, status) VALUES (?,?,?,?)";
		var id = parseInt(Math.random()*1000000) + '';
		var now = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss');
	    $cordovaSQLite.execute(db, query, [id, 'test111', now, 0]).then(success, error);
	}


});