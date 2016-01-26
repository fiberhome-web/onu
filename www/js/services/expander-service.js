'use strict';

angular.module('starter.services').
factory('ExpanderService', ['$templateCache', '$compile', '$ionicBody', '$rootScope',
    function($templateCache, $compile, $ionicBody, $rootScope) {

        var aniCss = 'show_ani';

        var idList = [];

        var eleMap = {};

        function init(configuration) {
            var self = {};
            //查找是否已经创建过该组件
            if ($.inArray(configuration.templateUrl, idList) > -1) {
                self = eleMap[configuration.templateUrl];
            } else {
                idList.push(configuration.templateUrl);
                var ele = document.createElement('div');
                ele.className = 'operrator ';
                ele.id = configuration.templateUrl;

                $ionicBody.get().appendChild(ele);
                ele.innerHTML = $templateCache.get(configuration.templateUrl);
                ele.style.bottom = (0 - ele.offsetHeight) + 'px';
                ele.style.zIndex = 10;
                self.element = ele;
                
                var modalEle = document.createElement('div');
                modalEle.className = 'mask_layer ';
                self.modalEle = modalEle;

                self.hide = hide;
                self.show = show;
            }



            self.scope = (configuration.scope || $rootScope).$new();
            self.options = configuration;


            //绑定DOM和scope
            $compile(self.element)(self.scope);

            eleMap[configuration.templateUrl] = self;

            return self;
        }


        function hide() {
            if (hasClass(this.element, aniCss)) {
                removeClass(this.element, aniCss);
            }
            if (this.options.backdoor) {
                $ionicBody.removeClass('popup-open');
                $ionicBody.get().removeChild(this.modalEle);
            }
        }

        function show() {
            //如若需要增加
            if (this.options.backdoor) {
                $ionicBody.addClass('popup-open');
                $ionicBody.get().appendChild(this.modalEle);
            }

            if (!hasClass(this.element, aniCss)) {
                addClass(this.element, aniCss);
            }
        }

        function hasClass(element, cName) {
            return !!element.className.match(new RegExp('(\\s|^)' + cName + '(\\s|$)'));
        }

        function addClass(element, cName) {
            if (!hasClass(element, cName)) {
                element.className += ' ' + cName;
            }
        }

        function removeClass(element, cName) {
            if (hasClass(element, cName)) {
                element.className = element.className.replace(new RegExp('(\\s|^)' + cName + '(\\s|$)'), ' ');
            }
        }


        return {
            init: init
        };
    }
]);
