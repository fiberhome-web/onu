'use strict';

angular.module('starter.services').
factory('ExpanderService', ['$templateCache', '$compile', '$ionicBody', '$rootScope',
    function($templateCache, $compile, $ionicBody, $rootScope) {

        var aniCss = 'show_ani';
        var maskCss = 'front_mask_layer';

        var eleMap = {};

        function init(configuration) {
            var self = {};
            //查找是否已经创建过该组件
            if (eleMap.hasOwnProperty(configuration.templateUrl)) {
                var handle = eleMap[configuration.templateUrl];
                var node = document.getElementById(handle.element.id);
                node.parentNode.removeChild(node);
            }
            var ele = document.createElement('div');
            ele.className = 'operrator ';
            ele.id = configuration.scope.$id;

            $ionicBody.get().appendChild(ele);
            ele.innerHTML = $templateCache.get(configuration.templateUrl);
            ele.style.bottom = (0 - ele.offsetHeight) + 'px';
            self.element = ele;

            //弹出框背景的遮罩层
            var backMaskEle = document.createElement('div');
            backMaskEle.className = 'back_mask_layer ';
            self.backMaskEle = backMaskEle;

            //弹出框上面的遮罩层
            var frontMaskEle = document.createElement('div');
            frontMaskEle.className = 'front_mask_layer ';
            frontMaskEle.innerHTML = '<i class="icon ion-loop"></i>';
            self.frontMaskEle = frontMaskEle;

            self.hide = hide;
            self.show = show;
            self.showMask = showMask;
            self.hideMask = hideMask;




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
                // $ionicBody.removeClass('popup-open');
                $ionicBody.get().removeChild(this.backMaskEle);
            }
        }

        function show() {
            //若需要背景蒙罩层并禁止点击
            if (this.options.backdoor) {
                // $ionicBody.addClass('popup-open');
                $ionicBody.get().appendChild(this.backMaskEle);
            }

            if (!hasClass(this.element, aniCss)) {
                addClass(this.element, aniCss);
            }
        }

        function showMask() {
            $compile(this.frontMaskEle)(this.scope);
            this.element.appendChild(this.frontMaskEle);
        }

        function hideMask() {
            this.element.removeChild(this.frontMaskEle);
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
