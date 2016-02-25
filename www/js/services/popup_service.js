angular.module('starter.services').service('Popup', ['$ionicPopup', '$rootScope',
    function($ionicPopup, $rootScope) {

        this.showPop = function(reason, msg) {

            var html = '<div class="warn-tip">' +
                '<div class="close-btn" ng-click="closePop()">' +
                '<i class="iconfont">&#xe61d;</i></div>';


            if (reason) {
                html = html + '<div>Reason:<br/>' + reason + '</div>';
            }
            if (msg) {
                html = html + '<div>Suggestion:<br/>' + msg + '</div>';
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
                '<div class="tipText show center">' + tip + '</div>' +
                '<button class="button button-outline button-calm  button-block-half" ng-click="closeTip()">OK</button>';

            html = html + '</div>';
            $rootScope.tipWidth = {};
            $rootScope.tipWidth.width = $(window).width() / 2 + 'px';
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
