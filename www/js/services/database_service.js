'use strict';
angular.module('starter.services').service('DB', function($cordovaSQLite,
    $ionicPlatform) {
    var query, db;

    $ionicPlatform.ready(function() {
        //检查是否创建了数据库和表，不存在则创建
        db = $cordovaSQLite.openDB({
            name: 'onu.db'
        });
        query = 'CREATE TABLE IF NOT EXISTS fiber_onu (id primary key, name, date, status, data, conclusion)';
        $cordovaSQLite.execute(db, query).then(success, error);
    });


    //成功回调
    function success(info) {
        console.info('success :' + JSON.stringify(info));
    }
    //失败回调
    function error(info) {
        alert('error :' + JSON.stringify(info));
    }


    this.delete = function() {
        query = 'DROP TABLE fiber_onu ';
        $cordovaSQLite.execute(db, query).then(success, error);
    };

    this.query = function() {
        query = 'SELECT id , name, date, status FROM fiber_onu where name like "%test%" ';
        return $cordovaSQLite.execute(db, query);
    };

    this.queryAll = function() {
        query = 'SELECT id , name, date, status FROM fiber_onu order by date desc';
        return $cordovaSQLite.execute(db, query);
    };

    this.insert = function(datas) {
        var query = 'INSERT INTO fiber_onu (id, name, date, status, data, conclusion) VALUES (?,?,?,?,?,?)';
        $cordovaSQLite.execute(db, query, [datas.id, datas.name, datas.date, datas.status, datas.data, datas.conclusion]).then(success, error);
    };

    this.queryById = function(reportId) {
        query = 'SELECT id , name, date, status, data, conclusion FROM fiber_onu where id = ? ';
        return $cordovaSQLite.execute(db, query, [reportId]);
    };

    this.deleteByIds = function(ids) {
        query = 'delete from fiber_onu where id in(?)';
        $cordovaSQLite.execute(db, query,[ids]).then(success, error);
    };


});
