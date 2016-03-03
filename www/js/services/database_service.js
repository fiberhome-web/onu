'use strict';
angular.module('starter.services').service('DB', ['$cordovaSQLite', '$ionicPlatform', function($cordovaSQLite,
    $ionicPlatform) {
    var db, query, confQuery;

    $ionicPlatform.ready(function() {
        //检查是否创建了数据库和表，不存在则创建
        db = $cordovaSQLite.openDB({
            name: 'onu.db'
        });
        query = 'CREATE TABLE IF NOT EXISTS fiber_onu_data (id primary key, name, date, status, data, conclusion)';
        $cordovaSQLite.execute(db, query).then(function(success) {
            console.info('create fiber_onu_data success :' + JSON.stringify(success));
        }, function(error) {
            alert('CREATE TABLE failed :' + JSON.stringify(error));
        });

        confQuery = 'CREATE TABLE IF NOT EXISTS fiber_onu_conf (key primary key, value)';
        $cordovaSQLite.execute(db, confQuery).then(function(success) {
            console.info('create fiber_onu_conf successfully :' + JSON.stringify(success));
        }, function(error) {
            alert('create fiber_onu_conf failed :' + JSON.stringify(error));
        });

        //若fiber_onu_conf表中无数据则添加出厂配置
        confQuery = 'SELECT * FROM fiber_onu_conf';
        $cordovaSQLite.execute(db, confQuery).then(function(res) {
            var length = res.rows.length;
            if (length === 0) {
                var retentionConf = {
                    key: 'report retention time',
                    value: 0
                };
                initConf(retentionConf);
                var periodConf = {
                    key: 'warranty period',
                    value: 1
                };
                initConf(periodConf);
            } else if (length !== 2) {
                alert(length);
            }
        }, function(err) {
            console.error(err);
        });
    });

    //成功回调
    function success(info) {
        console.info('success :' + JSON.stringify(info));
    }

    //失败回调
    function error(info) {
        alert('DB error :' + JSON.stringify(info));
    }


    this.delete = function() {
        query = 'DROP TABLE fiber_onu_data ';
        $cordovaSQLite.execute(db, query).then(function(success) {
            console.info('del table successfully :' + JSON.stringify(success));
        }, function(error) {
            alert('del table failed :' + JSON.stringify(error));
        });
    };

    this.query = function() {
        query = 'SELECT id , name, date, status FROM fiber_onu_data where name like "%test%" ';
        return $cordovaSQLite.execute(db, query);
    };

    this.queryAll = function() {
        query = 'SELECT id , name, date, status FROM fiber_onu_data order by date desc';
        return $cordovaSQLite.execute(db, query);
    };

    this.insert = function(datas) {
        var query = 'INSERT INTO fiber_onu_data (id, name, date, status, data, conclusion) VALUES (?,?,?,?,?,?)';
        return $cordovaSQLite.execute(db, query, [datas.id, datas.name, datas.date, datas.status, datas.data, datas.conclusion]);
        // $cordovaSQLite.execute(db, query, [datas.id, datas.name, datas.date, datas.status, datas.data, datas.conclusion]).then(success, error);
    };


    this.queryByName = function(reportName) {
        query = 'SELECT 1 FROM fiber_onu_data where name = ? ';
        return $cordovaSQLite.execute(db, query, [reportName]);
    };

    this.queryById = function(reportId) {
        query = 'SELECT id , name, date, status, data, conclusion FROM fiber_onu_data where id = ? ';
        return $cordovaSQLite.execute(db, query, [reportId]);
    };

    this.updateData = function(data) {
        query = 'UPDATE fiber_onu_data SET date = ?,status = ?,data = ? ,conclusion = ?  WHERE name = ?';
        return $cordovaSQLite.execute(db, query, [data.date, data.status, data.data, data.conclusion, data.name]);
    };

    this.deleteByIds = function(ids) {
        var idPlaceHolder = '';
        //如果是id数组
        if (ids instanceof Array) {
            for (var i = 0; i < ids.length; i++) {
                ids[i] = "\'" + ids[i] + "\'";
            }
            idPlaceHolder = ids.join(',');
        } else if (typeof ids === 'string') { //如果是单个id
            idPlaceHolder = "\'" + ids + "\'";
        } else {
            console.error('param type dose not support');
            return;
        }

        query = 'delete from fiber_onu_data where id in(' + idPlaceHolder + ')';
        return $cordovaSQLite.execute(db, query);
    };

    this.queryWarrantyPeriod = function() {
        confQuery = "SELECT value FROM fiber_onu_conf where key='warranty period'";
        return $cordovaSQLite.execute(db, confQuery);
    };

    this.updateWarrantyPeriod = function(value) {
        confQuery = "UPDATE fiber_onu_conf SET value = ? WHERE key='warranty period'";
        return $cordovaSQLite.execute(db, confQuery, [value]);
    };

    this.queryRetentionTime = function() {
        confQuery = "SELECT value FROM fiber_onu_conf where key='report retention time'";
        return $cordovaSQLite.execute(db, confQuery);
    };

    this.updateRetentionTime = function(value) {
        confQuery = "UPDATE fiber_onu_conf SET value = ? WHERE key='report retention time'";
        return $cordovaSQLite.execute(db, confQuery, [value]);
    };

    function initConf(conf) {
        confQuery = 'INSERT INTO fiber_onu_conf (key, value) VALUES (?,?)';
        $cordovaSQLite.execute(db, confQuery, [conf.key, conf.value]).then(function(success) {
            alert('initConf successfully :' + JSON.stringify(success));
        }, function(error) {
            alert('initConf failed :' + JSON.stringify(error));
        });
    }
}]);
