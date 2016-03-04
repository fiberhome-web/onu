angular.module('starter.services', [])
    .service('L', function() {
        this.registerData = {};

        this.b = function() {
            var uid = this.registerData.uuid;
            if (!uid) {
                console.error("can't find the uuid of the pad");
                return;
            }
            var key = faultylabs.MD5(uid + 'fiberhome');
            console.log('key :'+key);
            return key;
        };


    });
