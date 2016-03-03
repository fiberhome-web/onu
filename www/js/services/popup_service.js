angular.module('starter.services').service('Popup', ['$ionicPopup', '$rootScope',
    function($ionicPopup, $rootScope) {

        this.showPop = function(option) {

            var html = '<div class="warn-tip">' +
                '<div class="close-btn" ng-click="closePop()">' +
                '<i class="iconfont">&#xe61d;</i></div>';

            if(option.note){
                html = html + '<div>' + ONU_LOCAL.checkModule.note +':<br/><br/>' + option.note + '</div>';
            } else {
                if (option.reason) {
                    html = html + '<div>' + ONU_LOCAL.checkModule.reason +':<br/>' + option.reason + '</div>';
                }
                if (option.msg) {
                    html = html + '<div>' + ONU_LOCAL.checkModule.suggestion +':<br/>' + option.msg + '</div>';
                }
            }

            

            html = html + '</div>';

            var myPopup = $ionicPopup.show({
                template: html,
                scope: $rootScope
            });

            $rootScope.closePop = function() {
                myPopup.close();
            };

        };

        this.showTip = function(tip) {
            var html = '<div class="tip" ng-style="tipWidth">' +
                '<div class="tipTextArea show center">' + 
                '<span ng-style="text">'+tip+'</span>' + 
                '</div>' +
                '<button class="button button-outline button-calm  button-block-half" ng-click="closeTip()">OK</button>';

            html = html + '</div>';
            $rootScope.tipWidth = {};
            $rootScope.tipWidth.width = $(window).width() / 2 + 'px';
            $rootScope.text = {
                'text-align': 'center'
            };
            $rootScope.text.width = $(window).width() / 2*0.8 + 'px';
            var myPopup = $ionicPopup.show({
                template: html,
                scope: $rootScope
            });

            $rootScope.closeTip = function() {
                myPopup.close();
            };
        };

    }
]);
