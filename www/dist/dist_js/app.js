var app = angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'ngCordova','templates']);

//定义全局变量

var global = {
    //是否已经登陆
    isLogin: false
};

var CONST = {
    R_CODE: {
        SUCCESS: '0'
    },
    TYPE: {
        BASIC: 'basic',
        PON: 'pon',
        DATA: 'data',
        VOICE: 'voice',
        VDETAIL: 'voice_detail'
    }
};

//使用mockjax替换ajax
// Mock.mockjax(app);

app.run(function($ionicPlatform, $ionicPopup, $cordovaToast, $location, $rootScope, $ionicHistory, $state, $stateParams, $cordovaDevice, L, $timeout) {
    'use strict';
    //放置当前页面上弹框组件handel
    $rootScope.expanderHandel = [];
    $rootScope.isRegistered = false;

    //监听键盘弹出事件
    window.addEventListener('native.keyboardshow', keyboardShowHandler);
    function keyboardShowHandler(e) {
        angular.forEach($rootScope.expanderHandel, function(handel) {
            if (handel.isShow) {
                if ($(handel.element).is(":animated")) {
                    $(handel.element).stop(false, true);
                }
                $(handel.element).css('bottom', e.keyboardHeight + 'px');
            }
        });
    }

    //监听键盘隐藏事件
    window.addEventListener('native.keyboardhide', keyboardHideHandler);
    function keyboardHideHandler(e) {
        angular.forEach($rootScope.expanderHandel, function(handel) {
            if (handel.isShow) {
                $(handel.element).css('bottom', '0px');
            }
        });
    }

    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            cordova.plugins.Keyboard.disableScroll(true);

        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleLightContent();
        }
        //禁止横屏
        screen.lockOrientation('portrait');

        L.registerData.uuid = $cordovaDevice.getUUID();
        window.plugins.SharedPrefs.saveData(function(result) {
            console.log('Has it been saved? Ans:' + JSON.stringify(result));
            window.plugins.SharedPrefs.getData(function(result) {
                console.log("Could I retrieve the data? Ans:" + JSON.stringify(result));
                return result;
            }, "", "ONU_Fiberhome_NFF", "FITTING");
            return result;
        }, '', 'ONU_Fiberhome_NFF', 'FITTING', 'PASS');
        

        window.plugins.webintent.hasExtra(window.plugins.webintent.EXTRA_TEXT,
            function(has) {
                // has is true iff it has the extra
                console.log('hasExtra:' + has);

            },
            function() {
                // Something really bad happened.
                console.log('Something really bad happened.');
            }
        );
        window.plugins.webintent.getExtra(window.plugins.webintent.EXTRA_TEXT,
            function(url) {
                // url is the value of EXTRA_TEXT
                console.log('the value of EXTRA_TEXT:' + url);
                if (url !== 'fiberhome') {
                    // ionic.Platform.exitApp();
                }
            },
            function() {
                // There was no extra supplied.
                console.log('There was no extra supplied.');
                // ionic.Platform.exitApp();
            }
        );
        window.plugins.webintent.getUri(function(url) {
            if (url !== "") {
                // url is the url the intent was launched with
                console.log('window.plugins.webintent.getUri:' + url);
            } else {
                console.log('getUri url===""');
            }
        });
    });

    //主页面显示退出提示框  
    $ionicPlatform.registerBackButtonAction(function(e) {

        var actionCompletion = false;
        angular.forEach($rootScope.expanderHandel, function(handel) {
            if (handel.isShow) {
                handel.hide();
                actionCompletion = true;
            }
        });

        //判断处于哪个页面时双击退出
        if (!actionCompletion) {
            if ($location.path() === '/tab/basic' || $location.path() === '/') {
                if ($rootScope.backButtonPressedOnceToExit) {
                    ionic.Platform.exitApp();
                } else {
                    $rootScope.backButtonPressedOnceToExit = true;
                    $cordovaToast.showShortCenter('再按一次退出系统');
                    setTimeout(function() {
                        $rootScope.backButtonPressedOnceToExit = false;
                    }, 2000);
                }
                $ionicHistory.clearHistory();
            } else if ($location.path() === '/tab/history/' + $stateParams.reportId) {
                $state.go('tab.history');
                $rootScope.hideTabs = false;
            } else if ($ionicHistory.backView()) {
                // angular.forEach($rootScope.expanderHandel, function(handel) {
                //     if (handel.isShow) {
                //         handel.hide();
                //     }
                // });
                $ionicHistory.goBack();
                $rootScope.hideTabs = false;
                console.log($ionicHistory.backView());
            } else {
                $rootScope.backButtonPressedOnceToExit = true;
                $cordovaToast.showShortCenter('再按一次退出系统');
                setTimeout(function() {
                    $rootScope.backButtonPressedOnceToExit = false;
                }, 2000);
            }
        }

        e.preventDefault();
        return false;

    }, 101);


})

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
    //设置全屏显示
    ionic.Platform.fullScreen(false);
    //配置整个平台的ionic view缓存
    $ionicConfigProvider.views.maxCache(0);
    //配置android平台的缓存
    $ionicConfigProvider.platform.android.views.maxCache(0);
    //设置返回按钮的文字和图标
    $ionicConfigProvider.backButton.text('Go Back').icon('ion-chevron-left');
    //配置tabs统一显示在下部
    $ionicConfigProvider.tabs.position('bottom');
    //配置导航栏title统一居中显示
    $ionicConfigProvider.navBar.alignTitle('center');
    //配置导航栏样式
    $ionicConfigProvider.tabs.style('');

    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js
    //路由配置
    $stateProvider

        .state('index', {
        url: '/',
        templateUrl: 'login.html',
        controller: 'LoginCtrl'
    })

    // setup an abstract state for the tabs directive
    .state('tab', {
        url: '/tab',
        abstract: true,
        templateUrl: 'tabs.html'
    })

    // Each tab has its own nav history stack:

    .state('tab.basic', {
        url: '/basic',
        views: {
            'tab-basic': {
                templateUrl: 'tab-basic.html',
                controller: 'BasicCtrl'
            }
        }
    })

    .state('tab.check', {
        url: '/check?:checkStatus',
        views: {
            'tab-check': {
                templateUrl: 'tab-check.html',
                controller: 'CheckCtrl'
            }
        }
    })


    .state('tab.detail', {
        url: '/check/detail',
        views: {
            'tab-check': {
                templateUrl: 'tab-voice-detail.html',
                controller: 'VoiceDetailCtrl'
            }
        }
    })



    .state('tab.history', {
        url: '/history',
        views: {
            'tab-history': {
                templateUrl: 'tab-history.html',
                controller: 'HistoryCtrl'
            }
        }
    })

    .state('tab.report-detail', {
        url: '/history/:reportId?:reportStatus',
        views: {
            'tab-history': {
                templateUrl: 'report-detail.html',
                controller: 'ReportDetailCtrl'
            }
        }
    })

    .state('tab.setting', {
        url: '/setting',
        views: {
            'tab-setting': {
                templateUrl: 'tab-setting.html',
                controller: 'SettingCtrl'
            }
        }
    });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/');

});

angular.module("templates", []).run(["$templateCache", function($templateCache) {$templateCache.put("login.html","<ion-view>\r\n    <ion-content scroll=\"false\">\r\n        <div id=\"loginContent\" ng-style=\"loginHight\">\r\n            <div class=\"operationArea\">\r\n                <div class=\"list show center\" ng-keydown=\"eventFun.keyDownEvt($event)\">\r\n                    <div class=\"item item-input inputBox\" ng-show=\"!isRegistered\">\r\n                        <input type=\"text\" class=\"padding-left\" placeholder=\"{{info.license_ph}}\" ng-model=\"registerData.key\" />\r\n                        <i class=\"iconfont placeholder-icon\" ng-click=\"eventFun.scanBarcode()\">&#xe611;</i>\r\n                    </div>\r\n                    <div class=\"item item-input inputBox\" ng-show=\"isRegistered\">\r\n                        <i class=\"iconfont placeholder-icon\">&#xe604;</i>\r\n                        <input type=\"text\" ng-model=\"loginInfo.ip\" />\r\n                        <i class=\"iconfont placeholder-icon\" ng-click=\"eventFun.cancelEnter()\">&#xe623;</i>\r\n                    </div>\r\n                </div>\r\n                <button class=\"button button-green button-block-half loginBtn\" ng-click=\"eventFun.loginBtnClick()\" ng-disabled=\"!loginInfo.ip\">\r\n                    <span ng-if=\"isRegistered\">{{info.login}}</span>\r\n                    <span ng-if=\"!isRegistered\">{{info.ok}}</span>\r\n                </button>\r\n                <div class=\"history\" ng-click=\"viewHistory()\" ng-show=\"isRegistered\">{{info.history}}</div>\r\n                <p class=\"processing show center\" ng-show=\"loading\">\r\n                    <ion-spinner icon=\"bubbles\" class=\"spinner-light\"></ion-spinner>\r\n                </p>\r\n            </div>\r\n            <div class=\"footer\" ng-show=\"!isRegistered\">{{info.uuid}}{{registerData.uuid}}</div>\r\n        </div>\r\n    </ion-content>\r\n</ion-view>\r\n");
$templateCache.put("report-detail.html","<!--\r\n  This template loads for the \'tab.friend-detail\' state (app.js)\r\n  \'friend\' is a $scope variable created in the FriendsCtrl controller (controllers.js)\r\n  The FriendsCtrl pulls data from the Friends service (service.js)\r\n  The Friends service returns an array of friend data\r\n-->\r\n<ion-view view-title=\"{{reportLocal.title}}\">\r\n<!-- <ion-view view-title=\"检测报告\" hide-back-button=\"true\"> -->\r\n    <ion-nav-buttons side=\"left\">\r\n        <button menu-toggle=\"left\" class=\"button button-icon\" ng-click=\"back()\"><i class=\"iconfont\">&#xe61f;</i>{{reportLocal.return}}</button>\r\n    </ion-nav-buttons>\r\n    <ion-nav-buttons side=\"right\">\r\n        <button menu-toggle=\"left\" class=\"button button-icon\" ng-click=\"openPopover($event)\"><i class=\"iconfont\">&#xe617;</i></button>\r\n    </ion-nav-buttons>\r\n    <ion-content class=\"padding\">\r\n        <div id=\"report\" on-swipe-right=\"back()\" on-hold=\"onHold()\">\r\n            <style type=\"text/css\">\r\n            #content {\r\n                font-family: \'Microsoft Yahei\';\r\n                padding-bottom: 1px;\r\n            }\r\n            \r\n            #content > .block {\r\n                border-radius: 5px;\r\n            }\r\n\r\n            #content > .main-info{\r\n                border-bottom: 2px solid #eee;\r\n            }\r\n\r\n            #content > .main-info i {\r\n                font-size: 1.2em;\r\n            }\r\n            \r\n            #content .title {\r\n                font-size: 17px;\r\n                height: 40px;\r\n                line-height: 40px;\r\n                border-bottom: none;\r\n                padding-left: 20px;\r\n                width: 30%;\r\n                display: inline-block;\r\n            }\r\n            \r\n            #content .citem {\r\n                font-size: 16px;\r\n                padding-left: 20px;\r\n                line-height: 50px;\r\n            }\r\n            \r\n            #content .rep-content .detail {\r\n                padding: 5px 10px;\r\n                margin-left: 10px;\r\n            }\r\n            \r\n            #content .citem > .conclusion {\r\n                padding-right: 10px;\r\n                line-height: 25px;\r\n            }\r\n            \r\n            #content .detail .header {\r\n                padding-left: 10px;\r\n                height: 30px;\r\n                line-height: 30px;\r\n                background-color: #ddd;\r\n                font-size: 16px;\r\n                font-weight: bold;\r\n                color: #000;\r\n                margin-top: 10px;\r\n            }\r\n            \r\n            #content .detail .port {\r\n                margin: 10px auto;\r\n                border-radius: 7px;\r\n            }\r\n            \r\n            #content .detail .citem-title {\r\n                padding-left: 20px;\r\n                font-size: 15px;\r\n                display: inline-block;\r\n                margin: 5px 20px 5px 0;\r\n                width: 50%;\r\n                line-height: 20px;\r\n            }\r\n            \r\n            #content .detail .citem-content {\r\n                padding-left: 20px;\r\n                font-size: 15px;\r\n                display: inline-block;\r\n                width: 40%;\r\n            }\r\n\r\n            #content .detail .citem-content i{\r\n                position: absolute;\r\n                right: 0;\r\n                font-size: 18px;\r\n                top: 4px;\r\n                width: 50px;\r\n                height: 30px;\r\n            }\r\n\r\n            #content .detail .suggest{\r\n                padding: 10px;\r\n                border: red solid 1px;\r\n                border-radius: 5px;\r\n                margin: 0px 20px;\r\n                color: red;\r\n            }\r\n\r\n            #content .detail.voice{\r\n                padding-left: 30px;\r\n            }\r\n\r\n            #content .detail .items{\r\n                position: relative;\r\n            }\r\n\r\n            #content .detail .sp-div{\r\n                position: absolute;\r\n                width: 5px;\r\n                height: 20px;\r\n                background: #ddd;\r\n                top: 4px;\r\n                left: 2px;\r\n            }\r\n\r\n\r\n            \r\n            .red {\r\n                color: red;\r\n            }\r\n            </style>\r\n            <div id=\"content\">\r\n                <div class=\"block main-info\">\r\n                    <span class=\"title\">{{i10n.detailModule.address}}：</span>\r\n                    <span class=\"citem\">{{report.name}}</span>\r\n                </div>\r\n                <div class=\"block main-info\">\r\n                    <span class=\"title\">{{i10n.detailModule.conclusion}}：</span>\r\n                    <span class=\"citem\">\r\n                        <span ng-switch=\"report.status\">\r\n                            <i class=\"iconfont green icon-iconfontzhengque\" ng-if=\"report.status===1\"></i>\r\n                            <i class=\"iconfont red icon-gantan\" ng-if=\"report.status!==1\"></i>\r\n                            <span ng-switch-when=\"1\">\r\n\r\n                                {{i10n.historyModule.types.normal}}\r\n                            </span>\r\n                            <span ng-switch-when=\"2\">{{i10n.historyModule.faults.pon}}</span>\r\n                            <span ng-switch-when=\"3\">{{i10n.historyModule.faults.data}}</span>\r\n                            <span ng-switch-when=\"4\">{{i10n.historyModule.faults.voice}}</span>\r\n                        </span>\r\n                    </span>\r\n                </div>\r\n                <div class=\"block main-info\">\r\n                    <span class=\"title\">{{i10n.detailModule.note}}：</span>\r\n                    <span class=\"citem\">{{report.conclusion}}</span>\r\n                </div>\r\n                <div class=\"block main-info\">\r\n                    <span class=\"title\">{{i10n.detailModule.date}}：</span>\r\n                    <span class=\"citem\">{{report.date}}</span>\r\n                </div>\r\n               \r\n                <div class=\"block rep-content\">\r\n                    <div class=\"title\">{{i10n.detailModule.report}}：</div>\r\n\r\n                    <!--基本信息-->\r\n                    <div class=\"detail\">\r\n                        <div class=\"header\"> {{reportLocal.deviceInfo.module_name}}</div>\r\n                        <!--如果items不是数组,则是设备基本信息-->\r\n                        <div ng-repeat=\"(key,item) in detail.deviceInfo\" class=\"items\">\r\n                            <div class=\"citem-title\" ng-class=\"{\'red\' : item.warn}\">{{reportLocal.deviceInfo[key]}}</div>\r\n                            <div class=\"citem-content\" ng-class=\"{\'red\' : item.warn}\">\r\n                                <span ng-if=\"!item.val\">-</span>\r\n                                <span ng-if=\"item.text\">{{item.text}}</span>\r\n                                <span ng-if=\"!item.text\">\r\n                                    <span ng-if=\"key!==\'warranty_period\'\">{{item.val}}</span>\r\n                                    <span ng-if=\"key===\'warranty_period\'\">-</span>\r\n                                </span>\r\n                                <span class=\"unit\">{{item.unit ? item.unit : \'\'}}</span>\r\n\r\n                                <i class=\"iconfont red icon-xinxi\" ng-show=\"item.reason || item.msg || item.note\" ng-click=\"showTip(item)\"></i>\r\n                            </div>\r\n                           \r\n                            <div class=\"suggest hide\" ng-if=\"item.reason || item.msg || item.note\">\r\n                                <div ng-if=\"item.reason\">\r\n                                    {{i10n.checkModule.reason}} : {{item.reason}}\r\n                                </div>\r\n                                <div ng-if=\"item.msg\">\r\n                                    {{i10n.checkModule.suggestion}} : {{item.msg}}\r\n                                </div>\r\n                                <div ng-if=\"item.note\">\r\n                                    {{i10n.checkModule.note}} : {{item.note}}\r\n                                </div>\r\n                            </div>\r\n                        </div>\r\n                    </div>\r\n\r\n\r\n                    <div class=\"detail\">\r\n                        <div class=\"header\"> {{reportLocal.ponPortStatus.module_name}}</div>\r\n\r\n                        <div ng-repeat=\"portInfo in detail.ponPortStatus\" class=\"port\">\r\n\r\n                            <div class=\"items\">\r\n                                <div class=\"sp-div\"></div>\r\n                                <span class=\"citem-title\">{{i10n.reportModule.voicePortStatus.voice_port_id}}</span>\r\n                                <span class=\"citem-content\">{{portInfo.pon_port_id}}</span>\r\n                            </div>\r\n\r\n                            <div ng-if=\"key !== \'pon_port_id\'\" ng-repeat=\"(key,item) in portInfo\" class=\"items\">\r\n                                <div class=\"citem-title\" ng-class=\"{\'red\' : item.warn}\">{{reportLocal.ponPortStatus[key]}}</div>\r\n                                <div class=\"citem-content\" ng-class=\"{\'red\' : item.warn}\">\r\n                                    <!--item.val不存在，说明是id，直接显示item;\r\n                                    item.text 存在，表示是枚举，text是转化后的显示值-->\r\n                                    <span ng-if=\"!item.val\">-</span>\r\n                                    <span ng-if=\"item.text\">{{item.text}}</span>\r\n                                    <span ng-if=\"!item.text\">{{item.val}}</span>\r\n                                    <span class=\"unit\">{{item.unit ? item.unit : \'\'}}</span>\r\n                                    <i class=\"iconfont red icon-xinxi\" ng-show=\"item.reason || item.msg || item.note\" ng-click=\"showTip(item)\"></i>\r\n                                </div>\r\n                                <div class=\"suggest hide\" ng-if=\"item.reason || item.msg || item.note\">\r\n                                    <div ng-if=\"item.reason\">\r\n                                        {{i10n.checkModule.reason}} : {{item.reason}}\r\n                                    </div>\r\n                                    <div ng-if=\"item.msg\">\r\n                                        {{i10n.checkModule.suggestion}} : {{item.msg}}\r\n                                    </div>\r\n                                    <div ng-if=\"item.note\">\r\n                                        {{i10n.checkModule.note}} : {{item.note}}\r\n                                    </div>\r\n                                </div>\r\n                                \r\n                            </div>\r\n                        </div>\r\n                    </div>\r\n\r\n                    <div class=\"detail\">\r\n                        <div class=\"header\"> {{reportLocal.dataPortStatus.module_name}}</div>\r\n                        <div ng-repeat=\"portInfo in detail.dataPortStatus\" class=\"port\">\r\n\r\n                            <div class=\"items\">\r\n                                <div class=\"sp-div\"></div>\r\n                                <span class=\"citem-title\">{{i10n.reportModule.dataPortStatus.data_port_id}}</span>\r\n                                <span class=\"citem-content\">{{portInfo.data_port_id}}</span>\r\n                            </div>\r\n\r\n                            <div ng-if=\"key !== \'data_port_id\'\" ng-repeat=\"(key,item) in portInfo\" class=\"items\">\r\n                                <div class=\"citem-title\" ng-class=\"{\'red\' : item.warn}\">{{reportLocal.dataPortStatus[key]}}</div>\r\n                                <div class=\"citem-content\" ng-class=\"{\'red\' : item.warn}\">\r\n                                    <!--item.val不存在，说明是id，直接显示item;\r\n                                    item.text 存在，表示是枚举，text是转化后的显示值-->\r\n                                    <span ng-if=\"!item.val\">-</span>\r\n                                    <span ng-if=\"item.text\">{{item.text}}</span>\r\n                                    <span ng-if=\"!item.text\">{{item.val}}</span>\r\n                                    <span class=\"unit\">{{item.unit ? item.unit : \'\'}}</span>\r\n                                    <i class=\"iconfont red icon-xinxi\" ng-show=\"item.reason || item.msg || item.note\" ng-click=\"showTip(item)\"></i>\r\n                                </div>\r\n                                <div class=\"suggest hide\" ng-if=\"item.reason || item.msg || item.note\">\r\n                                    <div ng-if=\"item.reason\">\r\n                                        {{i10n.checkModule.reason}} : {{item.reason}}\r\n                                    </div>\r\n                                    <div ng-if=\"item.msg\">\r\n                                        {{i10n.checkModule.suggestion}} : {{item.msg}}\r\n                                    </div>\r\n                                    <div ng-if=\"item.note\">\r\n                                        {{i10n.checkModule.note}} : {{item.note}}\r\n                                    </div>\r\n                                </div>\r\n                                \r\n                            </div>\r\n                        </div>\r\n                    </div>\r\n\r\n                    <div  class=\"detail\">\r\n                        <div class=\"header\"> {{reportLocal.voicePortStatus.module_name}}</div>\r\n\r\n                        <div  ng-repeat=\"(key,item) in detail.voicePortStatus\">\r\n                            <div ng-if=\"item.length === undefined\" class=\"items\">\r\n                                <div class=\"citem-title\" ng-class=\"{\'red\' : item.warn}\">{{reportLocal.voicePortStatus[key]}}</div>\r\n                                <div class=\"citem-content\" ng-class=\"{\'red\' : item.warn}\">\r\n                                    <!--item.val不存在，说明是id，直接显示item;\r\n                                    item.text 存在，表示是枚举，text是转化后的显示值-->\r\n                                    <span ng-if=\"!item.val\">-</span>\r\n                                    <span ng-if=\"item.text\">{{item.text}}</span>\r\n                                    <span ng-if=\"!item.text\">{{item.val}}</span>\r\n                                    <span class=\"unit\">{{item.unit ? item.unit : \'\'}}</span>\r\n                                    <i class=\"iconfont red icon-xinxi\" ng-show=\"item.reason || item.msg || item.note\" ng-click=\"showTip(item)\"></i>\r\n                                </div>\r\n                                <div class=\"suggest hide\" ng-if=\"item.reason || item.msg || item.note\">\r\n                                    <div ng-if=\"item.reason\">\r\n                                        {{i10n.checkModule.reason}} : {{item.reason}}\r\n                                    </div>\r\n                                    <div ng-if=\"item.msg\">\r\n                                        {{i10n.checkModule.suggestion}} : {{item.msg}}\r\n                                    </div>\r\n                                    <div ng-if=\"item.note\">\r\n                                        {{i10n.checkModule.note}} : {{item.note}}\r\n                                    </div>\r\n                                </div>\r\n                            </div>\r\n                        </div>\r\n                    </div>\r\n\r\n\r\n                    <div ng-repeat=\"detail in  detail.voicePortStatus.port_detail\" class=\"detail voice\">\r\n\r\n                        <div class=\"items\">\r\n                            <div class=\"sp-div\"></div>\r\n                            <span class=\"citem-title\">{{i10n.reportModule.voicePortStatus.voice_port_id}}</span>\r\n                            <span class=\"citem-content\">{{detail.voice_port_id}}</span>\r\n                        </div>\r\n\r\n                        <div ng-if=\"key !== \'voice_port_id\'\" ng-repeat=\"(key,item) in detail\" class=\"items\">\r\n                            <div class=\"citem-title\" ng-class=\"{\'red\' : item.warn}\">{{reportLocal.voicePortStatus[key]}}</div>\r\n                            <div class=\"citem-content\" ng-class=\"{\'red\' : item.warn}\">\r\n                                <!--item.val不存在，说明是id，直接显示item;\r\n                                item.text 存在，表示是枚举，text是转化后的显示值-->\r\n                                <span ng-if=\"!item.val\">-</span>\r\n                                <span ng-if=\"item.text\">{{item.text}}</span>\r\n                                <span ng-if=\"!item.text\">{{item.val}}</span>\r\n                                <span class=\"unit\">{{item.unit ? item.unit : \'\'}}</span>\r\n                                <i class=\"iconfont red icon-xinxi\" ng-show=\"item.reason || item.msg || item.note\" ng-click=\"showTip(item)\"></i>\r\n                            </div>\r\n                            <div class=\"suggest hide\" ng-if=\"item.reason || item.msg || item.note\">\r\n                                <div ng-if=\"item.reason\">\r\n                                    {{i10n.checkModule.reason}} : {{item.reason}}\r\n                                </div>\r\n                                <div ng-if=\"item.msg\">\r\n                                    {{i10n.checkModule.suggestion}} : {{item.msg}}\r\n                                </div>\r\n                                <div ng-if=\"item.note\">\r\n                                    {{i10n.checkModule.note}} : {{item.note}}\r\n                                </div>\r\n                            </div>\r\n                            \r\n                        </div>\r\n                    </div>\r\n\r\n\r\n                </div>\r\n            </div>\r\n        </div>\r\n    </ion-content>\r\n</ion-view>\r\n\r\n<script id=\"my-popover.html\" type=\"text/ng-template\">\r\n    <ion-popover-view id=\"SharePopover\">\r\n        <ion-list>\r\n            <ion-item ng-click=\"share()\">\r\n                <i class=\"ion ion-share\"></i> <span>Share This</span>\r\n            </ion-item>\r\n            <ion-item ng-click=\"email()\">\r\n                <i class=\"ion ion-email\"></i> <span>Email  This</span>\r\n            </ion-item>\r\n        </ion-list>\r\n    </ion-popover-view>\r\n</script>\r\n");
$templateCache.put("tab-basic.html","<ion-view view-title=\"{{i10n.basicInfo}}\">\r\n    <ion-content id=\"basicInfoTab\" scroll=\"false\">\r\n        <ion-scroll>\r\n            <div class=\"list\">\r\n                <div class=\"item\" ng-repeat=\"(key,val) in deviceInfo\">\r\n                    <div ng-class=\"{\'red\':val.warn}\">\r\n                        {{localInfo[key]}}\r\n                        <span ng-if=\"val.val\" ng-click=\"key!==\'warranty_period\'||scanBarcode()\">\r\n                            \r\n                        <span class=\"val\" ng-if=\"val.text\" ng-class=\"{\'red\':val.warn}\">\r\n                        <i class=\"iconfont\" ng-if=\"key===\'led_status\'\" ng-class=\"{\'0\':\'red\',\'1\':\'green\',\'2\':\'orange\'}[val.val]\">&#xe608;</i>\r\n                        {{val.text}}\r\n                        </span>\r\n                        <span class=\"val\" ng-if=\"!val.text\" ng-class=\"{\'red\':val.warn,\'blue\':key===\'warranty_period\'}\">\r\n                        <i class=\"iconfont bigerIcon blue\" ng-if=\"key===\'warranty_period\'\">&#xe611;</i>\r\n                        {{val.val}}\r\n                        </span>\r\n                        </span>\r\n                        <span ng-if=\"!val.val\" class=\"none\">-</span>\r\n                        <span ng-if=\"val.val\">\r\n                            <i class=\"icon-msg icon iconfont\" ng-class=\"{\'war-color\' : val.warn}\" ng-click=\"eventFun.showTip(val)\"  ng-if=\"val.msg || val.note || val.reason\">&#xe616;</i>\r\n                            <i class=\"icon-mark icon iconfont\" ng-class=\"{\'war-color\' : val.warn}\" ng-click=\"val.warn = !val.warn\">&#xe610;</i>\r\n                            <i class=\"icon-edit icon iconfont\" ng-class=\"{\'war-color\' : val.warn}\" ng-click=\"eventFun.openEdit(i10n.report.deviceInfo[key],val)\">&#xe626;</i>\r\n                        </span>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n        </ion-scroll>\r\n        <div class=\"footer\">\r\n            <button class=\"button button-full button-grass\" ng-click=\"checking()\">{{local.one_check}}</button>\r\n        </div>\r\n    </ion-content>\r\n</ion-view>\r\n<script id=\"editComment.html\" type=\"text/ng-template\">\r\n    \r\n        <div class=\"list expander\">\r\n            <div class=\"item item-button-right expander-header\">\r\n                {{editer.title}} {{i10n.checkModule.remark}}\r\n                <button class=\"button button-stable button-clear\" ng-click=\"eventFun.closeEdit()\">\r\n                    <i class=\"iconfont\" style=\"font-size: 1.6em;\">&#xe61d;</i>\r\n                </button>\r\n            </div>\r\n        </div>\r\n        <div class=\"list expander sugeest\">\r\n            <i class=\"iconfont\" style=\"font-size: 1.6em;\" ng-click=\"eventFun.clearEdit()\">&#xe623;</i>\r\n            <textarea id=\"editArea\" class=\"reason\" ng-model=\"editer.note\"></textarea>\r\n        </div>\r\n        <div class=\"list expander\">\r\n            <div class=\"item item-button button-bar expander-footer\">\r\n                <button class=\"button button-grass\" ng-click=\"eventFun.saveEdit()\" style=\"margin-right:1px;\" ng-disabled=\"save_failed\">\r\n                    <span>{{i10n.checkModule.ok}}</span>\r\n                </button>\r\n                <button class=\"button button-grass\" ng-click=\"eventFun.closeEdit()\" style=\"margin-left:1px;\">\r\n                    <span>{{i10n.checkModule.cancel}}</span>\r\n                </button>\r\n            </div>\r\n        </div>\r\n    \r\n</script>\r\n");
$templateCache.put("tab-check.html","<ion-view view-title=\"{{i10n.check}}\">\r\n    <ion-content id=\"checkTab\">\r\n        <div class=\"\">\r\n            <!-- PON口诊断项 -->\r\n            <div class=\"check-module\" ng-class=\"{\'check-modal\':isPonChecking}\">\r\n                <div class=\"loadding\" ng-show=\"isPonChecking\">\r\n                    <ion-spinner icon=\"bubbles\" class=\"spinner-balanced\"></ion-spinner>\r\n                </div>\r\n                <div class=\"header\">\r\n                    <i class=\"icon iconfont\">&#xe622;</i>\r\n                    <span class=\"title\">{{i10n.checkModule.pon_port_item}}</span>\r\n                    <span class=\"check_btn\" ng-click=\"eventFun.checkPonBtnEvt()\">\r\n                        <i class=\"icon iconfont\">&#xe602;</i>\r\n                        <span>{{i10n.checkModule.begin_check}}</span>\r\n                    </span>\r\n                </div>\r\n                <div class=\"content\" ng-repeat=\"ponInfo in ponInfos | orderBy:order.pon\">\r\n                    <div class=\"check-item\">\r\n                        <i class=\"icon iconfont check-icon\">&#xe608;</i>\r\n                        <span class=\"name\">{{i10n.reportModule.ponPortStatus.pon_port_id}}</span>\r\n                        <span class=\"val\">{{ponInfo.pon_port_id}}</span>\r\n                    </div>\r\n                    <div ng-repeat=\"(key,val) in ponInfo\">\r\n                        <div ng-if=\"key !== \'pon_port_id\'\" class=\"check-item\" >\r\n                            <span ng-class=\"{\'war-color\' : val.warn}\">{{i10n.reportModule.ponPortStatus[key]}}</span>\r\n                           \r\n                            <span class=\"val\" ng-if=\"val.val\" ng-class=\"{\'war-color\' : val.warn}\">\r\n                                <span ng-if=\"val.val\">\r\n                                    {{val.val}}\r\n                                    <span class=\"unit\">{{val.unit}}</span>\r\n                                </span>\r\n\r\n                            </span>\r\n\r\n                            <span ng-if=\"!val.val\" class=\"none\">-</span>\r\n\r\n                            <span ng-if=\"val.val\" >\r\n                                <i class=\"icon-msg icon iconfont\" ng-class=\"{\'war-color\' : val.warn}\" ng-click=\"eventFun.showTip(val)\"  ng-if=\"val.msg || val.note || val.reason\">&#xe616;</i>\r\n                                <i class=\"icon-mark icon iconfont\" ng-class=\"{\'war-color\' : val.warn}\" ng-click=\"val.warn = !val.warn\">&#xe610;</i>\r\n                                <i class=\"icon-edit icon iconfont\" ng-class=\"{\'war-color\' : val.warn}\" ng-click=\"eventFun.openEdit(i10n.reportModule.ponPortStatus[key],val)\">&#xe626;</i>\r\n                            </span>\r\n                        </div>\r\n                        <div>\r\n                            \r\n                        </div>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n            <!-- 数据口诊断项 -->\r\n            <div class=\"check-module\" ng-class=\"{\'check-modal\':isDataChecking}\">\r\n                <div class=\"loadding\" ng-show=\"isDataChecking\">\r\n                    <ion-spinner icon=\"bubbles\" class=\"spinner-balanced\"></ion-spinner>\r\n                </div>\r\n                <div class=\"header\">\r\n                    <i class=\"icon iconfont\">&#xe621;</i>\r\n                    <span class=\"title\">{{i10n.checkModule.data_port_item}}</span>\r\n                    <span class=\"check_btn\" ng-click=\"eventFun.checkDataBtnEvt()\">\r\n                        <i class=\"icon iconfont\">&#xe602;</i>\r\n                        <span>{{i10n.checkModule.begin_check}}</span>\r\n                    </span>\r\n                </div>\r\n                <div class=\"content\" ng-repeat=\"dataInfo in dataInfos\">\r\n                    <div class=\"check-item\">\r\n                        <i class=\"icon iconfont check-icon\">&#xe608;</i>\r\n                        <span class=\"name\">{{i10n.reportModule.ponPortStatus.pon_port_id}}</span>\r\n                        <span class=\"val\">{{dataInfo.data_port_id}}</span>\r\n                    </div>\r\n                    <div ng-repeat=\"(key,val) in dataInfo\">\r\n                        <div ng-if=\"key !== \'data_port_id\'\" class=\"check-item\" >\r\n                            <span ng-class=\"{\'war-color\' : val.warn}\">{{i10n.reportModule.dataPortStatus[key]}}</span>\r\n                            <span class=\"val\" ng-if=\"val.val\" ng-class=\"{\'war-color\' : val.warn}\">\r\n                                <span ng-if=\"val.text\">{{val.text}}</span>\r\n                            </span>\r\n\r\n                            <span ng-if=\"!val.val\" class=\"none\">-</span>\r\n\r\n                            <span ng-if=\"val.val\" >\r\n                                <i class=\"icon-msg icon iconfont\" ng-click=\"eventFun.showTip(val)\" ng-if=\"val.msg || val.note || val.reason\" ng-class=\"{\'war-color\' : val.warn}\">&#xe616;</i>\r\n                                <i class=\"icon-mark icon iconfont\" ng-click=\"val.warn = !val.warn\" ng-class=\"{\'war-color\' : val.warn}\">&#xe610;</i>\r\n                                <i class=\"icon-edit icon iconfont\" ng-class=\"{\'war-color\' : val.warn}\" ng-click=\"eventFun.openEdit(i10n.reportModule.dataPortStatus[key],val)\">&#xe626;</i>\r\n                            </span>\r\n                        </div>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n             <!-- 语音口诊断项 -->\r\n            <div class=\"check-module\" ng-class=\"{\'check-modal\':isVoiceChecking}\">\r\n                <div class=\"loadding\" ng-show=\"isVoiceChecking\">\r\n                    <ion-spinner icon=\"bubbles\" class=\"spinner-balanced\"></ion-spinner>\r\n                </div>\r\n                <div class=\"header\">\r\n                    <i class=\"icon iconfont\">&#xe605;</i>\r\n                    <span class=\"title\">{{i10n.checkModule.voice_port_item}}</span>\r\n                    <span class=\"check_btn\" ng-click=\"eventFun.checkVoiceBtnEvt()\">\r\n                        <i class=\"icon iconfont\">&#xe602;</i>\r\n                        <span>{{i10n.checkModule.begin_check}}</span>\r\n                    </span>\r\n                </div>\r\n              \r\n                <div class=\"content\" ng-repeat=\"(key,item) in voiceInfos.port_detail\">\r\n                    <div class=\"check-item\">\r\n                        <i class=\"icon iconfont check-icon\">&#xe608;</i>\r\n                        <span class=\"name\">{{i10n.reportModule.voicePortStatus.voice_port_id}}</span>\r\n                        <span class=\"val\">{{item.voice_port_id}}</span>\r\n                    </div>\r\n\r\n                    <div ng-if=\"key !== \'voice_port_id\'\" class=\"check-item\"  ng-repeat=\"(key,val) in item\">\r\n                        <span ng-class=\"{\'war-color\' : val.warn}\">{{i10n.reportModule.voicePortStatus[key]}}</span>\r\n                        <span class=\"val\" ng-if=\"val.val\" ng-class=\"{\'war-color\' : val.warn}\">\r\n                            <span ng-if=\"val.text\">{{val.text}}</span>\r\n                            <span ng-if=\"!val.text\">{{val.val}}</span>\r\n                        </span>\r\n\r\n                        <span ng-if=\"!val.val\" class=\"none\">-</span>\r\n\r\n                        <span ng-if=\"val.val\">\r\n                            <i class=\"icon-msg icon iconfont\"  ng-if=\"val.msg || val.note || val.reason\" ng-click=\"eventFun.showTip(val)\"  ng-class=\"{\'war-color\' : val.warn}\">&#xe616;</i>\r\n                            <i class=\"icon-mark icon iconfont\"  ng-class=\"{\'war-color\' : val.warn}\" ng-click=\"val.warn = !val.warn\">&#xe610;</i>\r\n                            <i class=\"icon-edit icon iconfont\"  ng-class=\"{\'war-color\' : val.warn}\" ng-click=\"eventFun.openEdit(i10n.reportModule.voicePortStatus[key],val)\">&#xe626;</i>\r\n                        </span>\r\n                       \r\n                    </div>             \r\n                </div>\r\n                <div class=\"content\" ng-show=\"voiceInfos.protocol_type\">\r\n                    <div class=\"check-item\">\r\n                         <a href=\"#/tab/check/detail\" class=\"val v-detail\">{{i10n.checkModule.view_detail}}</a>\r\n                    </div>\r\n                </div>\r\n              \r\n            </div>\r\n            \r\n        </div>\r\n        <!--占位div-->\r\n        <div style=\"height:100px;\"></div>\r\n\r\n    </ion-content>\r\n\r\n    <div class=\"list check_btn_group \">\r\n        <div class=\"button-bar\" disabled=\"isPonChecking||isDataChecking||isVoiceChecking\">\r\n            <button class=\"button button-grass\" style=\"margin-right:1px;\" ng-click=\"eventFun.oneKeyCheckBtnEvt()\">\r\n                <span>{{i10n.checkModule.one_key_check}}</span>\r\n            </button>\r\n            <button class=\"button button-grass\" style=\"margin-left:1px;\" ng-click=\"eventFun.generateReportBtnEVt()\">\r\n                <span>{{i10n.checkModule.generate_report}}</span>\r\n            </button>\r\n        </div>\r\n    </div>\r\n\r\n\r\n   \r\n    \r\n</ion-view>\r\n<!-- 生成报告弹出框模板 -->\r\n<script id=\"generateReport.html\" type=\"text/ng-template\">\r\n    <div class=\"list expander\">\r\n        <div class=\"item item-button-right expander-header\">\r\n            {{i10n.checkModule.generate_report}}\r\n            <button class=\"button button-stable button-clear\" ng-click=\"eventFun.close()\">\r\n                <i class=\"iconfont\" style=\"font-size: 1.6em;\">&#xe61d;</i>\r\n            </button>\r\n        </div>\r\n    </div>\r\n    <div class=\"list expander\">\r\n        <label class=\"item item-input expander-item\">\r\n            <span class=\"input-label\">{{i10n.checkModule.report_name}}</span>\r\n            <input type=\"text\" id=\"rename\" ng-model=\"report.reportName\" placeholder=\"{{i10n.checkModule.report_name_ph}}\">\r\n        </label>\r\n        <label class=\"item item-input item-select expander-item\">\r\n            <span class=\"input-label\">{{i10n.checkModule.check_result}}</span>\r\n            <select ng-model=\"report.resultStatus\">\r\n                <option value=\"1\">{{i10n.checkModule.result_status.normal}}</option>\r\n                <option value=\"2\">{{i10n.checkModule.result_status.pon_abnormal}}</option>\r\n                <option value=\"3\">{{i10n.checkModule.result_status.data_abnormal}}</option>\r\n                <option value=\"4\">{{i10n.checkModule.result_status.voice_abnormal}}</option>\r\n            </select>\r\n        </label>\r\n        <label class=\"item item-input expander-item \">\r\n            <span class=\"input-label\">{{i10n.checkModule.remark}}</span>\r\n            <input type=\"text\" ng-model=\"report.remark\" placeholder=\"{{i10n.checkModule.remark_ph}}\">\r\n        </label>\r\n        <div id=\"successfullyInfo\" ng-class=\"{true: \'show\', false: \'hide\'}[saved]\" class=\"center\">\r\n            <span ng-if=\"save_failed\" class=\"text\">{{i10n.checkModule.generate_report_failed}}</span>\r\n            <span ng-if=\"saved\" class=\"text\">{{i10n.checkModule.generate_report_successfully}}</span>\r\n        </div>\r\n    </div>\r\n    <div class=\"list expander\">\r\n        <div class=\"item item-button button-bar expander-footer\">\r\n            <button class=\"button button-grass\" ng-click=\"eventFun.sureOrView(saved)\" style=\"margin-right:1px;\" ng-disabled=\"!report.reportName||save_failed\">\r\n                <span ng-if=\"!saved\">{{i10n.checkModule.ok}}</span>\r\n                <span ng-if=\"saved\">{{i10n.checkModule.view_report}}</span>\r\n            </button>\r\n            <button class=\"button button-grass\" ng-click=\"eventFun.close()\" style=\"margin-left:1px;\">\r\n                <span ng-if=\"!saved\">{{i10n.checkModule.cancel}}</span>\r\n                <span ng-if=\"saved\">{{i10n.checkModule.stay_on_this_page}}</span>\r\n            </button>\r\n        </div>\r\n    </div>\r\n\r\n<!--提示是否重命名或覆盖文件-->\r\n    <div class=\"backdoor\" ng-show=\"isCover\"></div>\r\n    <div class=\"cover-tip\" ng-show=\"isCover\">\r\n        <div class=\"head\">{{i10n.checkModule.exist}}</div>\r\n        <div class=\"btn\">\r\n            <span ng-click=\"eventFun.rename()\">\r\n                {{i10n.checkModule.rename}}\r\n            </span>\r\n        </div>\r\n        <div class=\"btn\" ng-click=\"eventFun.cover()\">\r\n            <span>\r\n                {{i10n.checkModule.cover}}\r\n            </span>\r\n        </div>\r\n    </div>\r\n</script>\r\n\r\n<!--编辑建议弹出模板-->\r\n<script id=\"editSuggest.html\" type=\"text/ng-template\">\r\n    <div class=\"list expander\">\r\n        <div class=\"item item-button-right expander-header\">\r\n            {{editer.title}} {{i10n.checkModule.note}}\r\n            <button class=\"button button-stable button-clear\" ng-click=\"eventFun.closeEdit()\">\r\n                <i class=\"iconfont\" style=\"font-size: 1.6em;\">&#xe61d;</i>\r\n            </button>\r\n        </div>\r\n    </div>\r\n    <div class=\"list expander sugeest\">\r\n        <i class=\"iconfont\" style=\"font-size: 1.6em;\" ng-click=\"eventFun.clearEdit()\">&#xe623;</i>\r\n        <textarea id=\"editTextarea\" class=\"reason\" ng-model=\"editer.note\"></textarea>\r\n    </div>\r\n    <div class=\"list expander\">\r\n        <div class=\"item item-button button-bar expander-footer\">\r\n            <button class=\"button button-grass\" ng-click=\"eventFun.saveEdit()\" style=\"margin-right:1px;\" ng-disabled=\"save_failed\">\r\n                <span >{{i10n.checkModule.ok}}</span>\r\n            </button>\r\n            <button class=\"button button-grass\" ng-click=\"eventFun.closeEdit()\" style=\"margin-left:1px;\">\r\n                <span >{{i10n.checkModule.cancel}}</span>\r\n            </button>\r\n        </div>\r\n    </div>\r\n</script>");
$templateCache.put("tab-history.html","<ion-view view-title=\"{{local.title}}\" hide-back-button=\"true\">\r\n    <ion-nav-buttons side=\"left\" >\r\n        <button class=\"button button-icon\" ng-click=\"eventFun.return()\" ng-hide=\"isLogin\"><i class=\"iconfont\">&#xe61f;</i>{{local.return}}</button>\r\n    </ion-nav-buttons>\r\n    <ion-nav-buttons side=\"right\" >\r\n        <button class=\"button button-icon icon\" ng-click=\"opera()\" ng-show=\"isLogin\">{{operation}}</button>\r\n    </ion-nav-buttons>\r\n    <!-- <ion-nav-buttons side=\"left\">\r\n        <button menu-toggle=\"left\" class=\"button button-icon icon\" ng-click=\"login()\">{{local.login}}</button>\r\n    </ion-nav-buttons> -->\r\n    <ion-content id=\"historyTab\" scroll=\"false\">\r\n        <div id=\"fixedArea\">\r\n            <div class=\"query-cond\">\r\n                <div class=\"bar bar-header item-input-inset search\">\r\n                    <div class=\"item-input-wrapper\">\r\n                        <i class=\"iconfont placeholder-icon\">&#xe60c;</i>\r\n                        <input type=\"search\" placeholder=\"{{local.search_ph}}\" ng-model=\"prox.searchContent\">\r\n                        <i class=\"iconfont placeholder-icon\" ng-click=\"eventFun.cancelEnter()\">&#xe623;</i>\r\n                    </div>\r\n                </div>\r\n                <div class=\"list\">\r\n                    <div class=\"item listButton\" ng-click=\"eventFun.changeDateBtnEVt()\">\r\n                        {{local.date_range}}\r\n                        <button class=\"button button-dark button-clear\">\r\n                            {{date_range}}\r\n                            <i class=\"iconfont\">&#xe612;</i>\r\n                        </button>\r\n                    </div>\r\n                </div>\r\n                <div ng-class=\"{\'front_mask_layer\':!operator}\"></div>\r\n            </div>\r\n            <div class=\"button-bar padding\">\r\n                <a class=\"button button-light\" ng-class=\"{ \'activeButton\': type === 0 }\" ng-click=\"filterType(0)\" ng-disabled=\"!operator\">{{local.types.all}}</a>\r\n                <a class=\"button button-light\" ng-class=\"{ \'activeButton\': type === 1 }\" ng-click=\"filterType(1)\" ng-disabled=\"!operator\">{{local.types.normal}}</a>\r\n                <a class=\"button button-light\" ng-class=\"{ \'activeButton\': type === 2 }\" ng-click=\"filterType(2)\" ng-disabled=\"!operator\">{{local.types.abnormal}}</a>\r\n            </div>\r\n        </div>\r\n        <ion-scroll id=\"scroll\">\r\n            <ion-refresher on-refresh=\"doRefresh()\" pulling-text=\"Pull to refresh...\" refreshing-text=\"Refreshing!\" refreshing-icon=\"ion-loading-b\">\r\n            </ion-refresher>\r\n            <div class=\"list padding\">\r\n                <ion-list show-checkbox=\"shouldShowCheckbox\" checkbox-model=\"checkboxs\">\r\n                    <ion-item ng-repeat=\"item in list\" class=\"reportItem\" ng-click=\"eventFun.viewReport(item.id)\">\r\n                        <ion-checkbox-button item-id=\"{{item.id}}\"></ion-checkbox-button>\r\n                        <span class=\"name\">{{item.name }}</span>\r\n                        <span class=\"status\">\r\n                        <i class=\"iconfont green\" ng-if=\"item.status===1\">&#xe60b;</i>\r\n                        <i class=\"iconfont red\" ng-if=\"item.status!==1\">&#xe609;</i>\r\n                        <span ng-switch=\"item.status\"> \r\n                        <span ng-switch-when=\"1\">{{local.types.normal}}</span>\r\n                        <span ng-switch-when=\"2\">{{local.faults.pon}}</span>\r\n                        <span ng-switch-when=\"3\">{{local.faults.data}}</span>\r\n                        <span ng-switch-when=\"4\">{{local.faults.voice}}</span>\r\n                        </span>\r\n                        </span>\r\n                        <span class=\"date\">{{item.date}}</span>\r\n                        <ion-option-button class=\"button-assertive\" ng-click=\"deleteReport(item)\">{{local.del}}</ion-option-button>\r\n                    </ion-item>\r\n                </ion-list>\r\n                <p class=\"loading\" ng-show=\"prox.loading\">\r\n                    <ion-spinner icon=\"dots\" class=\"spinner-dark\"></ion-spinner>\r\n                </p>\r\n            </div>\r\n        </ion-scroll>\r\n    </ion-content>\r\n    <!-- <div style=\"display:none;\" id=\"confirm\">\r\n        <div>\r\n            <button class=\"button button-assertive button-outline\">\r\n                {{local.del_sure}}\r\n            </button>\r\n            <button class=\"button button-positive  button-outline \" ng-click=\"hideDelete()\">\r\n                {{local.cancel}}\r\n            </button>\r\n        </div>\r\n    </div> -->\r\n</ion-view>\r\n<!-- 批量删除上弹框 -->\r\n<script id=\"batchDelele.html\" type=\"text/ng-template\">\r\n    <div ng-click=\"batchDelele($event)\" class=\"show center footer-button\">\r\n        <div>{{local.del_batch}}</div>\r\n    </div>\r\n</script>\r\n<!-- 选择日期上弹框 -->\r\n<script id=\"changeDate.html\" type=\"text/ng-template\">\r\n    <div class=\"list expander\">\r\n        <div class=\"item item-button-right\">\r\n            &nbsp;\r\n            <button class=\"button button-stable button-clear\" ng-click=\"eventFun.close()\">\r\n                <i class=\"iconfont\">&#xe61d;</i>\r\n            </button>\r\n        </div>\r\n    </div>\r\n    <ion-list class=\"center-radio\">\r\n        <ion-radio ng-model=\"range\" ng-value=\"0\">{{local.date_select.all}}</ion-radio>\r\n        <ion-radio ng-model=\"range\" ng-value=\"1\">{{local.date_select.today}}</ion-radio>\r\n        <ion-radio ng-model=\"range\" ng-value=\"2\">{{local.date_select.twoDays}}</ion-radio>\r\n        <ion-radio ng-model=\"range\" ng-value=\"3\">{{local.date_select.week}}</ion-radio>\r\n        <ion-radio ng-model=\"range\" ng-value=\"4\">{{local.date_select.month}}</ion-radio>\r\n        <ion-radio ng-model=\"range\" ng-value=\"5\" class=\"no-border-bottom\">{{local.date_select.customized}}</ion-radio>\r\n    </ion-list>\r\n    <div class=\"list expander\" id=\"dateRangeInpute\">\r\n        <div class=\"item item-input no-border show center\" ng-class=\"{true: \'show\', false: \'occupying-hidden\'}[range===5]\">\r\n            <div class=\"input-label\">\r\n                {{local.start_date}}\r\n            </div>\r\n            <div class=\"date-content show center\" ng-click=\"chooseDate(true)\">\r\n                <span>{{startDate}}</span>\r\n            </div>\r\n        </div>\r\n        <div class=\"item item-input no-border show center\" ng-class=\"{true: \'show\', false: \'occupying-hidden\'}[range===5]\">\r\n            <div class=\"input-label\">\r\n                {{local.end_date}}\r\n            </div>\r\n            <div class=\"date-content show center\" ng-click=\"chooseDate(false)\">\r\n                <span>{{endDate}}</span>\r\n            </div>\r\n        </div>\r\n        <div class=\"item item-button expander-footer show center\">\r\n            <button class=\"button button-grass\" style=\"width:50%;\" ng-click=\"changeDate(range)\">\r\n                <span>{{local.ok}}</span>\r\n            </button>\r\n        </div>\r\n    </div>\r\n</script>\r\n");
$templateCache.put("tab-setting.html","<ion-view view-title=\"{{i10n.setting}}\">\r\n    <ion-content id=\"settingTab\" scroll=\"false\">\r\n        <div class=\"list\">\r\n            <div class=\"item listButton\" ng-click=\"eventFun.openRetentionTimeBox()\">\r\n                {{local.report_retention_time}}\r\n                <button class=\"button button-stable button-clear\" >\r\n                    {{retention_select[retentionIndex]}}\r\n                    <i class=\"iconfont\">&#xe612;</i>\r\n                </button>\r\n            </div>\r\n            <div class=\"item listButton\" ng-click=\"eventFun.openWarrantyPeriodBox()\">\r\n                {{local.warranty_period}}\r\n                <button class=\"button button-stable button-clear\" >\r\n                    {{date_select[periodIndex]}}\r\n                    <i class=\"iconfont\">&#xe612;</i>\r\n                </button>\r\n            </div>\r\n            <div class=\"item\">\r\n                {{local.version}}\r\n                <span class=\"item-note\">{{local.software_version}}</span>\r\n            </div>\r\n        </div>\r\n        <div class=\"footer\">\r\n            <div class=\"list padding-bottom\">\r\n                <button class=\"button button-block-half button-grass\" ng-click=\"eventFun.reconnect()\">\r\n                    {{local.reconnect}}\r\n                </button>\r\n            </div>\r\n            <div class=\"list padding\">\r\n                <span class=\"note\">{{local.copyright}}</span>\r\n            </div>\r\n        </div>\r\n\r\n    </ion-content>\r\n</ion-view>\r\n<!-- 报告保留时间上弹框 -->\r\n<script id=\"reportRetentionTime.html\" type=\"text/ng-template\">\r\n    <div class=\"list expander\">\r\n        <div class=\"item item-button-right\">\r\n            &nbsp;\r\n            <button class=\"button button-stable button-clear\" ng-click=\"eventFun.closeRetentionTimeBox()\">\r\n                <i class=\"iconfont\">&#xe61d;</i>\r\n            </button>\r\n        </div>\r\n    </div>\r\n    <ion-list class=\"center-radio\">\r\n        <ion-radio ng-model=\"delRange\" name=\"a1\" ng-value=\"0\">{{local.retention_time_select.day}}</ion-radio>\r\n        <ion-radio ng-model=\"delRange\" name=\"a1\" ng-value=\"1\">{{local.retention_time_select.month}}</ion-radio>\r\n        <ion-radio ng-model=\"delRange\" name=\"a1\" ng-value=\"2\">{{local.retention_time_select.year}}</ion-radio>\r\n        <ion-radio ng-model=\"delRange\" name=\"a1\" ng-value=\"3\" class=\"no-border-bottom\">{{local.retention_time_select.permanent}}</ion-radio>\r\n    </ion-list>\r\n    <div class=\"list expander\">\r\n        <div class=\"item item-button expander-footer show center\">\r\n            <button class=\"button button-block-half button-grass\" ng-click=\"eventFun.changeDeletePeriod(delRange)\">\r\n                <span>{{local.ok}}</span>\r\n            </button>\r\n        </div>\r\n    </div>\r\n</script>\r\n<!-- 选择保修期上弹框 -->\r\n<script id=\"warrantyPeriod.html\" type=\"text/ng-template\">\r\n    <div class=\"list expander\">\r\n        <div class=\"item item-button-right\">\r\n            &nbsp;\r\n            <button class=\"button button-stable button-clear\" ng-click=\"eventFun.closeWarrantyPeriodBox()\">\r\n                <i class=\"iconfont\">&#xe61d;</i>\r\n            </button>\r\n        </div>\r\n    </div>\r\n    <ion-list class=\"center-radio\">\r\n        <ion-radio ng-model=\"dateRange\" name=\"a2\" ng-value=\"0\">{{local.date_select.one_year}}</ion-radio>\r\n        <ion-radio ng-model=\"dateRange\" name=\"a2\" ng-value=\"1\" class=\"no-border-bottom\">{{local.date_select.two_years}}</ion-radio>\r\n    </ion-list>\r\n    <div class=\"list expander\">\r\n        <div class=\"item item-button expander-footer show center\">\r\n            <button class=\"button button-block-half button-grass\" ng-click=\"eventFun.changeWarrantyPeriod(dateRange)\">\r\n                <span>{{local.ok}}</span>\r\n            </button>\r\n        </div>\r\n    </div>\r\n</script>\r\n");
$templateCache.put("tab-voice-detail.html","<ion-view view-title=\"{{i10n.checkModule.detail_title}}\">\r\n    <ion-nav-buttons side=\"left\">\r\n        <button menu-toggle=\"left\" class=\"button button-icon\" ng-click=\"back()\"><i class=\"iconfont\">&#xe61f;</i>{{i10n.back}}</button>\r\n    </ion-nav-buttons>\r\n    <ion-content class=\"voice-detail\" on-swipe-right=\"back()\">\r\n        <div class=\"check-module\">\r\n            <div ng-repeat=\"(key,item) in voiceInfo\">\r\n            	<div class=\"v-item\" ng-if=\"item.length === undefined\">\r\n            		<span class=\"d-item-key\" ng-class=\"{\'war-color\' : item.warn}\">{{key}}</span>\r\n            		<span class=\"d-item-val\" ng-if=\"item.val\" ng-class=\"{\'war-color\' : item.warn}\">\r\n            			<span ng-if=\"item.text\">{{item.text}}</span>\r\n                        <span ng-if=\"!item.text\">{{item.val}}</span>\r\n            		</span>\r\n\r\n                    <span ng-if=\"!item.val\" class=\"none\">-</span>\r\n                    <span ng-if=\"item.val\" >\r\n                        <i class=\"icon-msg icon iconfont\" ng-class=\"{\'war-color\' : item.warn}\" ng-click=\"eventFun.showTip(item)\"  ng-if=\"item.msg || item.note || item.reason\">&#xe616;</i>\r\n                        <i class=\"icon-mark icon iconfont\" ng-class=\"{\'war-color\' : item.warn}\" ng-click=\"item.warn = !item.warn\">&#xe610;</i>\r\n                        <i class=\"icon-edit icon iconfont\" ng-class=\"{\'war-color\' : item.warn}\" ng-click=\"eventFun.openEdit(i10n.report.ponPortStatus[key],item)\">&#xe626;</i>\r\n                    </span>\r\n            	</div>\r\n            </div>\r\n\r\n            <div class=\"content\" ng-repeat=\"(key,item) in voiceInfo.port_detail\">\r\n                <div class=\"check-item \">\r\n                    <i class=\"icon iconfont check-icon\">&#xe608;</i>\r\n                    <span class=\"name\">{{i10n.reportModule.voicePortStatus.voice_port_id}}</span>\r\n                    <span class=\"val\">{{item.voice_port_id}}</span>\r\n                </div>\r\n\r\n                <div ng-if=\"key !== \'voice_port_id\'\" class=\"check-item\" ng-click=\"showTip(val)\" ng-repeat=\"(key,val) in item\">\r\n                    <span ng-class=\"{\'war-color\' : val.warn}\">{{i10n.reportModule.voicePortStatus[key]}}</span>\r\n                    <span class=\"val\" ng-class=\"{\'war-color\' : val.warn}\"  ng-if=\"val.val\">\r\n                        <span ng-if=\"val.text\">{{val.text}}</span>\r\n                        <span ng-if=\"!val.text\">{{val.val}}</span>\r\n                    </span>\r\n\r\n                    <span ng-if=\"!val.val\" class=\"none\">-</span>\r\n                    <span ng-if=\"val.val\" >\r\n                        <i class=\"icon-msg icon iconfont\" ng-class=\"{\'war-color\' : val.warn}\" ng-click=\"eventFun.showTip(val)\"  ng-if=\"val.msg || val.note || val.reason\">&#xe616;</i>\r\n                        <i class=\"icon-mark icon iconfont\" ng-class=\"{\'war-color\' : val.warn}\" ng-click=\"val.warn = !val.warn\">&#xe610;</i>\r\n                        <i class=\"icon-edit icon iconfont\" ng-class=\"{\'war-color\' : val.warn}\" ng-click=\"eventFun.openEdit(i10n.report.ponPortStatus[key],val)\">&#xe626;</i>\r\n                    </span>\r\n                </div>  \r\n            </div>           \r\n        </div>\r\n\r\n        <div style=\"height:20px;\"></div>\r\n    </ion-content>\r\n</ion-view>\r\n\r\n\r\n<script id=\"editSuggest2.html\" type=\"text/ng-template\">\r\n    <div class=\"list expander\">\r\n        <div class=\"item item-button-right expander-header\">\r\n            {{editer.title}} {{i10n.checkModule.note}}\r\n            <button class=\"button button-stable button-clear\" ng-click=\"eventFun.closeEdit()\">\r\n                <i class=\"iconfont\" style=\"font-size: 1.6em;\">&#xe61d;</i>\r\n            </button>\r\n        </div>\r\n    </div>\r\n    <div class=\"list expander sugeest\">\r\n        <i class=\"iconfont\" style=\"font-size: 1.6em;\" ng-click=\"eventFun.clearEdit()\">&#xe623;</i>\r\n        <textarea id=\"editTextarea2\" class=\"reason\" ng-model=\"editer.note\"></textarea>\r\n    </div>\r\n    <div class=\"list expander\">\r\n        <div class=\"item item-button button-bar expander-footer\">\r\n            <button class=\"button button-grass\" ng-click=\"eventFun.saveEdit()\" style=\"margin-right:1px;\" ng-disabled=\"save_failed\">\r\n                <span ng-if=\"!saved\">{{i10n.checkModule.ok}}</span>\r\n                <span ng-if=\"saved\">{{i10n.checkModule.view_report}}</span>\r\n            </button>\r\n            <button class=\"button button-grass\" ng-click=\"eventFun.closeEdit()\" style=\"margin-left:1px;\">\r\n                <span ng-if=\"!saved\">{{i10n.checkModule.cancel}}</span>\r\n                <span ng-if=\"saved\">{{i10n.checkModule.stay_on_this_page}}</span>\r\n            </button>\r\n        </div>\r\n    </div>\r\n</script>");
$templateCache.put("tabs.html","<!--\r\nCreate tabs with an icon and label, using the tabs-positive style.\r\nEach tab\'s child <ion-nav-view> directive will have its own\r\nnavigation history that also transitions its views in and out.\r\n-->\r\n<!--\r\n    The nav bar that will be updated as we navigate between views.\r\n  -->\r\n<ion-nav-bar class=\"bar-ocean nav-title-slide-ios7\">\r\n</ion-nav-bar>\r\n<ion-tabs class=\"tabs-simple tabs-icon-only tabs-color-active-ocean\" ng-class=\"{\'tabs-item-hide\': $root.hideTabs}\">\r\n    <!-- Baisc Tab -->\r\n    <ion-tab title=\"{{i10n.basicInfo}}\" icon=\"icon-home iconfont\"  href=\"#/tab/basic\">\r\n        <ion-nav-view name=\"tab-basic\"></ion-nav-view>\r\n    </ion-tab>\r\n    <!-- Check Tab -->\r\n    <ion-tab title=\"{{i10n.check}}\" icon=\"icon-weixiu iconfont\" href=\"#/tab/check\">\r\n        <ion-nav-view name=\"tab-check\"></ion-nav-view>\r\n    </ion-tab>\r\n    <!-- History Tab -->\r\n    <ion-tab title=\"{{i10n.history}}\" icon=\"icon-wodebaogao iconfont\" href=\"#/tab/history\">\r\n        <ion-nav-view name=\"tab-history\"></ion-nav-view>\r\n    </ion-tab>\r\n    <!-- Setting Tab -->\r\n    <ion-tab title=\"{{i10n.setting}}\" icon=\"icon-shezhi iconfont\" href=\"#/tab/setting\">\r\n        <ion-nav-view name=\"tab-setting\"></ion-nav-view>\r\n    </ion-tab>\r\n</ion-tabs>\r\n");
$templateCache.put("temp.html","\r\n      <div class=\"list list-inset\">\r\n        <label class=\"item item-input\">\r\n          <i class=\"icon ion-search placeholder-icon\"></i>\r\n          <input type=\"text\"placeholder=\"Search\">\r\n        </label>\r\n      </div>\r\n\r\n\r\n      <label class=\"toggle\">\r\n        <input type=\"checkbox\">\r\n        <div class=\"track\">\r\n          <div class=\"handle\"></div>\r\n        </div>\r\n      </label>\r\n\r\n<div class=\"list\"><label class=\"item item-input item-stacked-label\"><span class=\"input-label\">First Name</span><input type=\"text\"placeholder=\"John\"></label><label class=\"item item-input item-stacked-label\"><span class=\"input-label\">Last Name</span><input type=\"text\"placeholder=\"Suhr\"></label><label class=\"item item-input item-stacked-label\"><span class=\"input-label\">Email</span><input type=\"text\"placeholder=\"john@suhr.com\"></label></div>\r\n\r\n\r\n      <div class=\"row col-40\">\r\n        \r\n        <ion-toggle>\r\n            日期快速筛选/日期精确筛选\r\n        </ion-toggle>\r\n      </div>\r\n   \r\n      <div class=\"list padding\">\r\n        <label class=\"item item-input item-select\">\r\n          <div class=\"input-label\">\r\n            日期定位\r\n          </div>\r\n          <select>\r\n            <option>所有</option>\r\n            <option>今天</option>\r\n            <option selected>2天内</option>\r\n            <option>一周内</option>\r\n            <option>一个月内</option>\r\n          </select>\r\n        </label>\r\n      </div>");}]);
var ONU_LOCAL = {
    basicInfo: 'Basic Infomation',
    check: 'Check',
    setting: 'Setting',

    unit: {
        temperature: '℃',
        voltage: 'V',
        bias_current: 'mA',
        opt_power: 'dBm'
    },

    loginModule: {
        login: 'Connect ONU',
        ok: 'OK',
        history: 'View past report',
        uuid: 'APP Identification Number：',
        license_ph: 'Please enter license'
    },

    basicModule: {
        one_check: 'Detect All',
        scan_bar_code: 'Scan Bar Code',
        tip: 'Scan code error,Please try again',
        overdue: 'Overdue',
        not_expired: 'Not Expired'
    },

    checkModule: {
        begin_check: 'Detect',
        wait_for_checking: 'Detecting, please wait...',
        one_key_check: 'Detect All',
        generate_report: 'Generate Report',
        pon_port_item: 'PON Port Detection',
        data_port_item: 'Data Port Detection',
        voice_port_item: 'Voice Port Detection',
        report_name: 'Report Name',
        report_name_ph: 'Suggested address or SN',
        check_result: 'Result',
        result_status: {
            normal: 'Normal',
            pon_abnormal: 'PON Port Abnormal',
            data_abnormal: 'Data Port Abnormal',
            voice_abnormal: 'Voice Port Abnormal'
        },
        ok: 'OK',
        cancel: 'Cancel',
        remark:'Note',
        remark_ph: 'Please enter note',
        stay_on_this_page: 'Stay on This Page',
        view_report: 'View Report',
        generate_report_successfully: 'Generate report successfully.',
        generate_report_failed: 'Generate report failed.',
        exist : 'The report name has already exist.',
        rename : 'Rename',
        cover : 'Cover the file with same name',
        view_detail : 'View detail',
        reason : 'Reason',
        suggestion : 'Suggestion',
        note:'Note'
    },

    detailModule: {
        address: 'Report Name',
        date: 'Date',
        conclusion: 'Result',
        report: 'Report',
        note: 'Note'
    },

    historyModule: {
        title: 'Past Reports',
        return:'Return',
        ok: 'OK',
        del: 'Delete',
       
        cancel: 'Cancel',
        choose: 'Select',
        date_range: 'Date range',
        search_ph: 'Please enter keywords',
        date_select: {
            all: 'All',
            today: 'Today',
            twoDays: 'Two days',
            week: 'One week',
            month: 'One month',
            customized: 'custom'
        },
        types: {
            all: 'All',
            normal: 'Normal',
            abnormal: 'Abnormal'
        },
        faults: {
            pon: 'PON Port Abnormal',
            data: 'Data Port Abnormal',
            voice: 'Voice Port Abnormal'
        }
    },

    settingModule: {
        report_retention_time: 'Report Retention Time ',
        warranty_period: 'Warranty Period',
        version: 'Version',
        software_version: 'ONUsmartChecker V1.0 Build 10',
        copyright: 'Copyright © 2016, Fiberhome Telecommunication Technologies Co.,LTD',
        ok: 'OK',
        reconnect: 'Reconnect',
        date_select: {
            one_year: 'one year',
            two_years: 'two years'
        },
        retention_time_select: {
            day: 'one day',
            month:'one month',
            year:'one year',
            permanent: 'permanent'
        }
    },

    reportModule: {
        title:'Report',
        return:'Return',
        deviceInfo: {
            module_name: 'ONU Infomation',
            device_type: 'Equipment ID',
            vendor: 'Vendor',
            hardware_version: 'Hardware Version',
            software_version: 'Software Version',
            mac: 'MAC',
            sn: 'SN',
            warranty_period: 'Warranty Period',
            led_status: 'Registration Status LED',
            onu_regist_status: 'ONU Registration Status',
            onu_auth_status: 'ONU AUTH Status',
            pon_port_number: 'PON Port Number',
            data_port_number: 'Data Port Number',
            voice_port_number: 'Voice Port Number',
        },

        ponPortStatus: {
            module_name: 'PON Port Detection',
            pon_port_id: 'Port No.',
            led_status: 'Status',
            temperature: 'Temperature',
            voltage: 'Voltage',
            bias_current: 'Bias current',
            tx_opt_power: 'Tx_OptPower',
            rx_opt_power: 'Rx_OptPower',

        },

        dataPortStatus: {
            data_port_id: 'Port No.',
            module_name: 'Data Port Detection',
            port_status: 'Port Status',
            speed: 'Speed',
            duplex: 'Duplex',

        },

        voicePortStatus: {
            module_name: 'Voice Port Detection',
            signal_svlan_id : 'signal_svlan_id',
            svlan_cos : 'svlan_cos',
            signal_cvlan_id : 'signal_cvlan_id',
            cvlan_cos : 'cvlan_cos',
            ip_mode : 'ip_mode',
            signal_ip : 'signal_ip',
            ip_mask : 'ip_mask',
            signal_gateway : 'signal_gateway',
            pppoe_user : 'pppoe_user',
            pppoe_password : 'pppoe_password',
            first_mgc_ip: 'first_mgc_ip',
            first_mgc_port: 'first_mgc_port',
            second_mgc_ip: 'second_mgc_ip',
            second_mgc_port: 'second_mgc_port',
            h248_local_port : 'h248_local_port',
            reg_mode : 'reg_mode',
            mgid : 'mgid',
            protocol_type: 'protocol_type',
            first_sip_registrar_server_ip: 'first_sip_registrar_server_ip',
            first_sip_registrar_server_port: 'first_sip_registrar_server_port',
            second_sip_registrar_server_ip: 'second_sip_registrar_server_ip',
            second_sip_registrar_server_port: 'second_sip_registrar_server_port',
            first_sip_proxy_server_ip: 'first_sip_proxy_server_ip',
            first_sip_proxy_server_port: 'first_sip_proxy_server_port',
            second_sip_proxy_server_ip: 'second_sip_proxy_server_ip',
            second_sip_proxy_server_port: 'second_sip_proxy_server_port',
            sip_local_port : 'sip_local_port', 
            mgc_reg_status : 'mgc_reg_status',  
            voice_port_id : 'Port No',
            port_status : 'port_status',
            port_enable : 'port_enable',
            user_tid : 'user_tid',
            telphone_no : 'telphone_no',
            sip_user_name: 'sip_user_name',
            sip_user_pass: 'sip_user_pass',

        }

    },

    enums: {
        led_status: {
            k_0: 'Off',
            k_1: 'On',
            k_2: 'Blinking',
        },
        onu_regist_status: {
            k_O1: 'STATE_INIT',
            k_O2: 'STATE_STANDBY',
            k_O3: 'STATE_SERIAL_NUMBER',
            k_O4: 'STATE_RANGING',
            k_O5: 'STATE_OPERATION',
            k_O6: 'STATE_POPUP',
            k_O7: 'STATE_EMERGENCY_STOP'
        },
        onu_auth_status: {
            k_0: 'AUTH_STA_INIT',
            k_1: 'AUTH_STA_OK',
            k_2: 'AUTH_STA_LOID_ERR',
            k_3: 'AUTH_STA_LPWD_ERR',
            k_4: 'AUTH_STA_LOID_COLLISION',
            k_10: 'AUTH_STA_SN_COLLISION',
            k_11: 'AUTH_STA_NO_RESOURCE',
            k_12: 'AUTH_STA_TYPE_ERR',
            k_13: 'AUTH_STA_SN_ERR',
            k_14: 'AUTH_STA_PWD_ERR',
            k_15: 'AUTH_STA_PWD_COLLISION'
        },
        data_port_status: {
            k_0: 'UP',
            k_1: 'Nolink',
            k_2: 'Error',
            k_3: 'Disable'
        },
        data_speed: {
            k_0: '10M',
            k_2: '100M',
            k_3: '1000M',
            k_4: 'Auto'
        },
        data_duplex: {
            k_0: 'Half',
            k_1: 'Full',
            k_2: 'Auto'
        },
        voice_protocol_type: {
            k_0: 'None',
            k_2: 'H.248',
            k_4: 'SIP'
        },

        voice_mgc_reg_status : {
            k_0: 'Registering ',
            k_1: 'Registration Success',
            k_2: 'Registration Failed'
        },

        voice_port_status: {
            k_0: 'EP_STATUS_INACTIVE',
            k_1: 'EP_STATUS_REGING',
            k_2: 'EP_STATUS_IDLE',
            k_3: 'EP_STATUS_OFF_HOOK',
            k_4: 'EP_STATUS_DIALING',
            k_5: 'EP_STATUS_RING',
            k_6: 'EP_STATUS_RINGBACK',
            k_7: 'EP_STATUS_CONNECTING',
            k_8: 'EP_STATUS_CONNECTED',
            k_9: 'EP_STATUS_ON_HOOK',
            k_10: 'EP_STATUS_DISCONNECTING',
            k_11: 'EP_STATUS_BUSY',
            k_12: 'EP_STATUS_REG_FAIL',
            k_13: 'EP_STATUS_NOT_HANGUP'
        },

        voice_reg_mode : {
            k_0: 'IP',
            k_1: 'Domain',
            k_2: 'Equipment'
        },

        voice_port_enable : {
            k_0: 'Disable',
            k_1: 'Enable'
        },

        voice_ip_mode : {
            k_0: 'Static',
            k_1: 'PPPoE',
            k_2: 'DHCP'
        },


        result_code: {
            'k_101': '用户名或密码错误',
            'k_-1': '获取信息失败'
        }
    },

    suggest: {
        reason: {
            r1: 'The ONU is not activated.',
            r2: 'The reticle is not plugged or broken.',
            r3: 'Receiving optical power is out of range(-8db ~ -28db).Optical module is abnormal.',
            r4: 'OLT return error. ',
            r5: 'The OLT PON port is disabled.',
            r6: 'In authentication. ',
            r7: 'Not authenticated',
            r8: 'No optical signals are received.',
            r9: 'NOptical module temperature is too high. ',
            r10: 'Optical module voltage is too high. ',
            r11: 'Optical module voltage is too low.',
            r12: 'Optical module current is too high. ',
            r13: 'Optical module “Tx_OptPower” is too high.',
            r14: 'Optical module “Tx_OptPower” is too low. ',
            r15: 'Optical module “Rx_OptPower” is too high. ',
            r16: 'Optical module “Rx_OptPower” is too low.',
            r17: 'The reticle is not plugged or broken. ',
            r18: 'PHY chip fault. ',
            r19: 'The port is disabled. ',
            r20: 'Voice service not configured. ',
            r21: 'Port is not activated. ',
            r22: 'Port Registration Failure. ',
            r23: 'Port Registration Failure.',
            r24: 'The user does not hang up, or outside line has a fault.',
            r25: 'Gateway Registration Failure.',
        },
        msg: {
            m1: 'The ONU is not activated.',
            m2: 'Please check whether the fiber is normal or bad contact.)',
            m3: 'Continuous observation, If the optical module voltage exceeds the threshold for a long time, and optical power is abnormal or report alarms, It may be the optical module is aging or damaged. Please contact technical support to resolve.' + 'Logic ID or password authentication configuration error. (Please confirm whether the authorization information is correct or not, and re-authorize the ONU)',
            m4: 'Please check the ONU configuration in the OLT authentication table is correct.',
            m5: 'Please enable the OLT PON port.',
            m6: 'Please wait a moment, or check the ONU authentication table on OLT and re-authorize the ONU',
            m7: 'Please confirm whether the authorization information is correct or not, and re-authorize the ONU',
            m8: 'Please check whether the fiber is normal or bad contact.',
            m9: 'Check equipment fan is working properly, or open the air conditioner to lower the indoor temperature. Continuous observation, if the optical module temperature exceeds the threshold for a long time, and optical power is abnormal or report alarms, It may be the optical module is aging or damaged. Please contact technical support to resolve.',
            m10: 'Continuous observation, If the optical module voltage exceeds the threshold for a long time, and optical power is abnormal or report alarms, It may be the optical module is aging or damaged. Please contact technical support to resolve.',
            m11: 'Continuous observation, If the optical module current exceeds the threshold for a long time, and optical power is abnormal or report alarms, It may be the optical module is aging or damaged. Please contact technical support to resolve.',
            m12: 'Continuous observation, If the optical module “Tx_OptPower” exceeds the threshold for a long time, It may be the optical module is aging or damaged. Please contact technical support to resolve.',
            m13: 'Check the quality of optical fibers and optical lines. Continuous observation, If the optical module “Rx_OptPower” exceeds the threshold for a long time, or not working properly , You should replace the optical module or contact technical support to resolve.',
            m14: 'Please confirm whether the reticle is broken or bad contact',
            m15: 'Please repair the PHY chip or replace ONU.',
            m16: 'Please enable the port.',
            m17: 'Please configure voice service.',
            m18: 'For SIP ,please check the parameters of 3、6、7、18、19、22、23、26、27、29 are cofigured right  or not for schedule B ;For H.248,please check the parameters of 27、28 are cofigured right or not for schedule B.',
            m19: 'Please check the connection between ONU and server is normal.',
            m20: 'For SIP ,please check the parameters of 3、6、7、18、19、22、23、26、27、29 are cofigured right  or not for schedule B ;For H.248,please check the parameters of 27、28 are cofigured right or not for schedule B.',
            m21: 'If exclude not hang up, You should check the outside line.',
            m22: 'Please check the connection between ONU and server is normal.',
            m23: 'Please check the parameters of 3、6、7、11、12、15 are cofigured right or not for schedule B.',
        }
    },

    tip:{
        login_failed:'sorry , Login failed !',
        ip_wrong:'IP is not correct',
        license_null:'License is null',
        code_wrong:'Two-dimensional code type error',
        l_expired:"License expired",
        l_wrong:'License is not correct',
        successful_registration:'Successful registration',
    }
}

angular.module('starter.controllers', []);

angular.module('starter.controllers')
    .controller('RootCtrl', function($scope, $ionicPlatform, DB, File) {
        $scope.i10n = ONU_LOCAL;

        $ionicPlatform.ready(function() {
            autoDeleteReport();
        });
        
        //根据配置删除报告
        function autoDeleteReport() {
            var retentionTimeIndex = 0;
            var sDate = '';
            //查询报告保留时间的配置
            DB.queryRetentionTime().then(function(res) {
                var length = res.rows.length;
                //查询配置成功
                if (length > 0) {
                    retentionTimeIndex = res.rows.item(0).value;
                    // alert('retentionTimeIndex :'+retentionTimeIndex);
                    //根据配置匹配起始日期
                    switch (retentionTimeIndex) {
                        case 0:
                            sDate = dateUtils.getToday();
                            break;
                        case 1:
                            sDate = dateUtils.getSpeDate(-30);
                            break;
                        case 2:
                            sDate = dateUtils.getDayOfLastYear();
                            break;
                        case 3:
                            //永久保留报告则跳出函数，不执行下面的逻辑
                            return;
                        default:
                            return;
                    }
                    // alert('sDate :'+sDate);
                    DB.queryAll().then(function(res) {
                        var length = res.rows.length;
                        var delIds = [];
                        //报告存在
                        if (length > 0) {
                            for (var i = 0; i < length; i++) {
                                var reportEle = res.rows.item(i);

                                //报告时间早于起始时间
                                if (sDate > reportEle.date.substr(0, 10)) {
                                    File.removeReport(reportEle.name);
                                    delIds.push(reportEle.id);
                                    alert('date:' + reportEle.date);
                                }
                            }

                            if (delIds.length > 0) {
                                DB.deleteByIds(delIds).then(function(success) {
                                    alert('del successfully :' + JSON.stringify(success));
                                }, function(error) {
                                    alert('del failed :' + JSON.stringify(error));
                                });
                            }
                        }
                    }, function(err) {
                        alert('RootCtrl DB.queryAll():' + JSON.stringify(err));
                    });
                }
            }, function(err) {
                alert('RootCtrl DB.queryRetentionTime():' + JSON.stringify(err));
            });




        }
    });

angular.module('starter.controllers')
    .controller('LoginCtrl', 
        function($scope, $rootScope, $state, $http, $timeout, Const, File, L, Popup) {

            $scope.eventFun = {
                cancelEnter: function() {
                    if ($rootScope.isRegistered) {
                        $scope.loginInfo.ip = '';
                    } else {
                        $scope.registerData.key = '';
                    }
                },
                keyDownEvt: function(e) {
                    //回车键执行按钮点击函数
                    if (13 === e.keyCode) {
                        btnClickEvt();
                    }
                },
                loginBtnClick: function() {
                    btnClickEvt();
                }
            };

            function btnClickEvt() {
                if ($rootScope.isRegistered) {
                    if (validateIP($scope.loginInfo.ip)) {
                        $scope.loading = true;
                        var info = {
                            'command': 'login',
                            'username': 'admin',
                            'password': 'checkONT2015@FH'
                        };
                        var url = Const.getReqUrl();
                        $http.post(url, info, {
                            timeout: 10000
                        }).success(function(res) {
                            if (res.ResultCode === '0') {
                                global.isLogin = true;
                                $state.go('tab.basic');
                            } else {
                                Popup.showTip(ONU_LOCAL.tip.login_failed);
                                alert('connected failed' + JSON.stringify(res));
                            }
                            var timer = $timeout(function() {
                                $scope.loading = false;
                                $timeout.cancel(timer);
                            }, 1000);

                        }).error(function(data, status, headers, config) {
                            Popup.showTip(ONU_LOCAL.tip.login_failed);
                            alert('data:' + data + '\n' + 'status:' + status + '\n' + 'headers:' + headers + '\n' + 'config:' + config + '\n');
                            $scope.loading = false;
                        });


                    } else {
                        Popup.showTip(ONU_LOCAL.tip.ip_wrong);
                    }
                } else {
                    if (!$scope.registerData.key) {
                        Popup.showTip(ONU_LOCAL.tip.license_null);
                        return;
                    } else if (L.b() ===$scope.registerData.key) {
                        $scope.loading = true;
                        $scope.registerData.date = dateUtils.getToday();
                        File.createL(JSON.stringify($scope.registerData)).then(function(success) {
                            console.info(JSON.stringify(success));
                            $rootScope.isRegistered = true;
                            $scope.loading = false;
                            Popup.showTip(ONU_LOCAL.tip.successful_registration);
                        }, function(error) {
                            $scope.loading = false;
                            alert(JSON.stringify(error));
                        });

                    } else {
                        Popup.showTip(ONU_LOCAL.tip.l_wrong);
                    }
                }
                L.registerData = $scope.registerData;

            }


            $scope.viewHistory = function() {
                $state.go('tab.history');
            };

            //init login page
            function initPage() {
                //国际化
                $scope.info = ONU_LOCAL.loginModule;
                $scope.tip = ' ';
                $scope.loginHight = {};
                $scope.loginHight.height = $(window).height() + 'px';
                //default login info
                $scope.loginInfo = {
                    ip: '192.168.1.1',
                    username: 'admin',
                    password: 'checkONT2015@FH'
                };
                $scope.registerData = L.registerData;
                $scope.loading = false;
                global.isLogin = false;
            }

            initPage();

            //检测ip是否合法 , 其中255.255.255.255仍认为合法
            function validateIP(str) {
                return !!str.match(/^(?!^0{1,3}(\.0{1,3}){3}$)((25[0-5]|2[0-4]\d|[01]?\d\d?)($|(?!\.$)\.)){4}$/);
            }
        }
    );

'use strict';

angular.module('starter.controllers')
    .controller('BasicCtrl', ['$scope', '$rootScope', '$state', '$http', '$timeout', '$cordovaBarcodeScanner',
        'Const', 'Report', 'Popup', 'DB', 'ExpanderService', 'Check',
        function($scope, $rootScope, $state, $http, $timeout, $cordovaBarcodeScanner, Const, Report, Popup, DB, ExpanderService, Check) {

            var timer;
            var commentExpanderConf = {
                templateUrl: 'editComment.html',
                scope: $scope,
                backdoor: true
            };
            var commentExpander = ExpanderService.init(commentExpanderConf);

            $rootScope.expanderHandel = [];
            $rootScope.expanderHandel.push(commentExpander);

            $scope.local = ONU_LOCAL.basicModule;
            $scope.localInfo = ONU_LOCAL.reportModule.deviceInfo;

            var data = Report.getDeviceInfo();

            //判断质保期时间
            function getWarrantyPeriod(index) {
                var warrantyPeriod;
                switch (index) {
                    case 0:
                        warrantyPeriod = 1;
                        break;
                    case 1:
                        warrantyPeriod = 2;
                        break;
                    default:
                        warrantyPeriod = 2;
                        break;
                }
                return warrantyPeriod;
            }



            //扫一扫函数
            $scope.scanBarcode = function() {
                $cordovaBarcodeScanner.scan().then(function(imageData) {
                        //扫码过程中未取消，并且条形码形式为CODE_128
                        if (!imageData.cancelled) {
                            if (imageData.format === 'CODE_128') {
                                var barcode = imageData.text;
                                //生产批号为12位编号
                                if (barcode.length === 12) {

                                    //解析厂家代号
                                    var vendor = barcode.substr(0, 2);
                                    //厂家代号为字母
                                    var vendorReg = /^[A-Za-z]+$/;
                                    if (!vendorReg.test(vendor)) {
                                        data.warranty_period.text = $scope.local.tip;
                                        return;
                                    }

                                    //解析设备代号
                                    var equipment = barcode.substr(2, 2);
                                    //设备代号，用数字或字母表示
                                    var equipmentReg = /^[0-9a-zA-Z]+$/;
                                    if (!equipmentReg.test(equipment)) {
                                        data.warranty_period.text = $scope.local.tip;
                                        return;
                                    }

                                    //解析年份代号
                                    var year = '20' + barcode.substr(4, 2);
                                    //年份代号为非数字
                                    if (isNaN(year)) {
                                        data.warranty_period.text = $scope.local.tip;
                                        return;
                                    } else {
                                        //从DB读取质保期时间
                                        DB.queryWarrantyPeriod().then(function(res) {
                                            var length = res.rows.length;
                                            if (length > 0) {
                                                //年份代号为数字，计算质保期截止年份
                                                var warrantyPeriodIndex = res.rows.item(0).value;
                                                year = parseInt(year) + getWarrantyPeriod(warrantyPeriodIndex);
                                            } else {
                                                data.warranty_period.text = 'Unable to read warranty period from DB ';
                                            }
                                        }, function(err) {
                                            console.error(err);
                                            data.warranty_period.text = 'Unable to read warranty period from DB ';
                                        });
                                    }

                                    //解析月份代号
                                    var month = barcode.substr(6, 1);
                                    var monthReg = /[A-C]/;

                                    if (!isNaN(month)) {
                                        month = parseInt(month);
                                    } else if (monthReg.test(month)) {
                                        month = month.charCodeAt() - 55;
                                    } else {
                                        data.warranty_period.text = $scope.local.tip;
                                        return;
                                    }

                                    //解析流水号
                                    var serial_number = barcode.substr(8, 4);
                                    //流水号为数字
                                    if (isNaN(serial_number)) {
                                        data.warranty_period.text = $scope.local.tip;
                                        return;
                                    }

                                    var today = new Date().format('yyyy-MM');
                                    var endDate = new Date(year, month - 1).format('yyyy-MM');

                                    if (today <= endDate) {
                                        data.warranty_period.text = $scope.local.not_expired + ' ( ' + endDate + ' ) ';

                                    } else {
                                        data.warranty_period.text = $scope.local.overdue + ' ( ' + endDate + ' ) ';
                                    }
                                    // data.warranty_period.text = imageData.text;
                                    $scope.deviceInfo = data;
                                    Report.setDeviceInfo(data);
                                } else {
                                    data.warranty_period.text = $scope.local.tip;
                                }
                            } else {
                                data.warranty_period.text = $scope.local.tip;
                            }
                        }
                    },
                    function(error) {
                        console.log("An error happened -> " + error);
                    });

            };


            //若没有请求过数据
            if ($.isEmptyObject(data)) {
                var url = Const.getReqUrl();
                var command = {
                    'command': 'getDeviceInfo'
                };
                $http.post(url, command).success(function(res) {
                    if (res.ResultCode === CONST.R_CODE.SUCCESS) {
                        data = res.data;
                        //检查数据是否存在,返回ecode的，存在要转化成错误内容
                        angular.forEach(data, function(item, index) {
                            if (item.ecode) {
                                item.text = item.ecode;
                            }
                        });

                        data.warranty_period = {
                            val: ONU_LOCAL.basicModule.scan_bar_code
                        };

                        //枚举转化
                        data.led_status.text = ONU_LOCAL.enums.led_status['k_' + data.led_status.val];
                        data.onu_regist_status.text = ONU_LOCAL.enums.onu_regist_status['k_' + data.onu_regist_status.val];
                        data.onu_auth_status.text = ONU_LOCAL.enums.onu_auth_status['k_' + data.onu_auth_status.val];


                        //检测数据
                        Check.checking(CONST.TYPE.BASIC, data);

                        $scope.deviceInfo = data;
                        Report.setDeviceInfo(data);
                    }
                }).error(function(data, status) {
                    alert('data:' + data + '\n' + 'status:' + status + '\n');
                });
            } else {
                $scope.deviceInfo = data;
            }

            //一键检测函数
            $scope.checking = function() {
                $state.go('tab.check', {
                    checkStatus: 0
                });

            };

            $scope.eventFun = {
                showTip: function(item) {
                    Popup.showPop(item);

                },

                openEdit: function(title, item) {
                    var note = item.note;
                    var reason = item.reason ? item.reason : '';
                    var msg = item.msg ? item.msg : '';
                    if (note === undefined) {
                        note = '';
                        if (reason) {
                            note = $scope.i10n.checkModule.reason + ' : \r\n' + reason + '\r\n\r\n';
                        }
                        if (msg) {
                            note = note + $scope.i10n.checkModule.suggestion + ' : \r\n' + msg;
                        }


                    }

                    $scope.editer = {
                        title: title,
                        note: note,
                        item: item
                    };
                    commentExpander.show();
                    timer = $timeout(function() {
                        $('#editArea').focus();
                        $timeout.cancel(timer);
                    }, 100);

                },

                closeEdit: function() {
                    commentExpander.hide();
                },

                clearEdit: function() {
                    $scope.editer.note = '';
                    timer = $timeout(function() {
                        $('#editArea').focus();
                        $timeout.cancel(timer);
                    }, 100);

                },

                saveEdit: function() {
                    $scope.editer.item.note = $scope.editer.note;
                    //清空系统建议
                    $scope.editer.item.reason = null;
                    $scope.editer.item.msg = null;
                    commentExpander.hide();
                }
            }
        }
    ]);

'use strict';

angular.module('starter.controllers')
    .controller('CheckCtrl', ['$scope', '$rootScope', '$state', '$http', 'Check', 'Popup', '$timeout',
        '$stateParams', '$filter', '$ionicPopup', 'Const', 'Report', 'ExpanderService', 'DB', 'File',
        function($scope, $rootScope, $state, $http, Check, Popup, $timeout,
            $stateParams, $filter, $ionicPopup, Const, Report, ExpanderService, DB, File) {

            var timer;
            var reportId;
            var reportStatus = 1;
            var deviceInfo;

            var expanderConf = {
                templateUrl: 'generateReport.html',
                scope: $scope,
                backdoor: true
            };
            var expanderHandel = ExpanderService.init(expanderConf);

            var suggestExpanderConf = {
                templateUrl: 'editSuggest.html',
                scope: $scope,
                backdoor: true
            };
            var suggestExpander = ExpanderService.init(suggestExpanderConf);

            $rootScope.expanderHandel = [];
            $rootScope.expanderHandel.push(expanderHandel);
            $rootScope.expanderHandel.push(suggestExpander);

            $scope.saved = false;
            $scope.save_failed = false;
            // $rootScope.hideTabs=false;
            // checkStatus 0，说明是从“基本信息”界面点击“一键检测”跳过来的，检查全部项。
            var checkStatus = $stateParams.checkStatus;
            if ('0' === checkStatus) {
                checkAll();
            }

            // 界面事件处理函数
            $scope.eventFun = {
                checkPonBtnEvt: function() {
                    checkPon();
                },
                checkDataBtnEvt: function() {
                    checkData();
                },
                checkVoiceBtnEvt: function() {
                    checkVoice();
                },
                oneKeyCheckBtnEvt: function() {
                    checkAll();
                },
                generateReportBtnEVt: function() {
                    $scope.report.resultStatus = '1';
                    $scope.report.remark = null;
                    if (deviceInfo.sn) {
                        $scope.report.reportName = deviceInfo.sn.val;
                    }
                    $scope.saved = false;
                    $scope.save_failed = false;

                    expanderHandel.show();
                },
                close: function() {
                    expanderHandel.hide();
                },
                sureOrView: function() {
                    if ($scope.saved) {
                        viewReport();
                    } else {
                        sure();
                    }
                },

                showTip: function(item) {
                    Popup.showPop(item);

                },

                openEdit: function(title, item) {
                    var note = item.note;
                    var reason = item.reason ? item.reason : '';
                    var msg = item.msg ? item.msg : '';
                    if (note === undefined) {
                        note = '';
                        if (reason) {
                            note = $scope.i10n.checkModule.reason + ' : \r\n' + reason + '\r\n\r\n';
                        }
                        if (msg) {
                            note = note + $scope.i10n.checkModule.suggestion + ' : \r\n' + msg;
                        }


                    }

                    $scope.editer = {
                        title: title,
                        note: note,
                        item: item
                    };
                    suggestExpander.show();
                    timer = $timeout(function() {
                        $('#editTextarea').focus();
                        $timeout.cancel(timer);
                    }, 100);
                },

                closeEdit: function() {
                    suggestExpander.hide();
                },

                clearEdit: function() {
                    $scope.editer.note = '';
                    timer = $timeout(function() {
                        $('#editTextarea').focus();
                        $timeout.cancel(timer);
                    }, 100);

                },

                saveEdit: function() {
                    $scope.editer.item.note = $scope.editer.note;
                    //清空系统建议
                    $scope.editer.item.reason = null;
                    $scope.editer.item.msg = null;
                    suggestExpander.hide();
                },

                rename: function() {
                    $scope.report.reportName = '';
                    timer = $timeout(function() {
                        $('#rename').focus();
                        $timeout.cancel(timer);
                    }, 100);

                    $scope.isCover = false;

                },

                cover: function() {
                    $scope.isCover = false;
                    saveToDB($scope.report, 2).then(function() {
                        expanderHandel.hideMask();
                        $scope.saved = true;

                    }, function(info) {
                        console.error('cover error :' + JSON.stringify(info));
                        expanderHandel.hideMask();
                        $scope.save_failed = true;
                    });
                    expanderHandel.showMask();
                }



            };

            // “诊断”界面初始化
            function initPage() {
                // 生成报告默认值
                $scope.report = {
                    // 诊断结果默认“正常”
                    resultStatus: '1'
                };

                // 各检测项排序字段
                $scope.order = {
                    pon: 'pon_port_id',
                    data: 'data_port_id',
                    voice: 'voice_port_id'
                };

                deviceInfo = Report.getDeviceInfo();

                // 光口诊断信息
                $scope.ponInfos = Report.getPonPortInfo();


                // 数据口诊断信息
                $scope.dataInfos = Report.getDataPortInfo();

                // 语音口诊断信息
                $scope.voiceInfos = Report.getVoicePortInfo();



            }

            // Pon口诊断
            function checkPon() {
                $scope.isPonChecking = true;

                var url = Const.getReqUrl();
                var params = {
                    command: 'getPonPortStatus'
                };

                $http.post(url, params, {
                    timeout: 10000
                }).success(function(response) {
                    var resultCode = response.ResultCode;

                    if (resultCode === '0') {
                        var data = response.data;

                        // 添加单位
                        angular.forEach(data, function(item) {
                            item.temperature.unit = ONU_LOCAL.unit.temperature;
                            item.voltage.unit = ONU_LOCAL.unit.voltage;
                            item.bias_current.unit = ONU_LOCAL.unit.bias_current;
                            item.tx_opt_power.unit = ONU_LOCAL.unit.opt_power;
                            item.rx_opt_power.unit = ONU_LOCAL.unit.opt_power;
                            //检测数据
                            Check.checking(CONST.TYPE.PON, item);
                        });

                        Report.setPonPortInfo(data);

                        $scope.ponInfos = Report.getPonPortInfo();
                    } else {
                        var resultMsg = ONU_LOCAL.enums.result_code['k_' + response.ResultCode];
                        resultMsg && console.error(resultMsg);
                    }

                    $scope.isPonChecking = false;
                }).error(function(data, status) {
                    console.error('data:' + data + '\n' + 'status:' + status + '\n');
                    $scope.isPonChecking = false;
                });
            }

            // 数据口诊断
            function checkData() {
                $scope.isDataChecking = true;

                var url = Const.getReqUrl();
                var params = {
                    command: 'getDataPortStatus'
                };

                $http.post(url, params, {
                    timeout: 10000
                }).success(function(response) {
                    var resultCode = response.ResultCode;

                    if (resultCode === '0') {
                        var data = response.data;

                        //枚举转化
                        angular.forEach(data, function(item) {
                            item.port_status.text = ONU_LOCAL.enums.data_port_status['k_' + item.port_status.val];
                            item.speed.text = ONU_LOCAL.enums.data_speed['k_' + item.speed.val];
                            item.duplex.text = ONU_LOCAL.enums.data_duplex['k_' + item.duplex.val];

                            //检测数据
                            Check.checking(CONST.TYPE.DATA, item);
                        });

                        Report.setDataPortInfo(data);

                        $scope.dataInfos = Report.getDataPortInfo();

                    } else {
                        var resultMsg = ONU_LOCAL.enums.result_code['k_' + response.ResultCode];
                        resultMsg && console.error(resultMsg);
                    }

                    $scope.isDataChecking = false;
                }).error(function(data, status) {
                    console.error('data:' + data + '\n' + 'status:' + status + '\n');
                    $scope.isDataChecking = false;
                });
            }

            // 语音口诊断
            function checkVoice() {
                $scope.isVoiceChecking = true;

                var url = Const.getReqUrl();
                var params = {
                    command: 'getVoicePortStatus'
                };

                $http.post(url, params, {
                    timeout: 10000
                }).success(function(response) {
                    var resultCode = response.ResultCode;

                    if (resultCode === '0') {
                        var data = response.data;

                        Check.checking(CONST.TYPE.VOICE, data);
                        //枚举转化
                        data.ip_mode.text = ONU_LOCAL.enums.voice_ip_mode['k_' + data.ip_mode.val];

                        data.protocol_type.text = ONU_LOCAL.enums.voice_protocol_type['k_' + data.protocol_type.val];

                        //若为H.248协议
                        if (data.protocol_type.val === '2') {
                            data.reg_mode.text = ONU_LOCAL.enums.voice_reg_mode['k_' + data.reg_mode.val];
                            data.mgc_reg_status.text = ONU_LOCAL.enums.voice_mgc_reg_status['k_' + data.mgc_reg_status.val];
                        }

                        angular.forEach(data.port_detail, function(item) {

                            item.port_status.text = ONU_LOCAL.enums.voice_port_status['k_' + item.port_status.val];
                            item.port_enable.text = ONU_LOCAL.enums.voice_port_enable['k_' + item.port_enable.val];

                            Check.checking(CONST.TYPE.VDETAIL, item);

                            //是否需要检查port_status 标志
                            var flag = false;
                            //只有当SIP或者H248且mgc_reg_status为正常时才检查port_status
                            if (data.protocol_type.val === '4' ||
                                (data.protocol_type.val === '2' && data.mgc_reg_status.val === '1')) {
                                flag = true;
                            }

                            //当不需要检查port_status，要去除已经检查出的结果
                            if (!flag) {
                                item.port_status.warn = false;
                                item.port_status.msg = null;
                            }
                        });

                        Report.setVoicePortInfo(data);
                        $scope.voiceInfos = data;
                    } else {
                        var resultMsg = ONU_LOCAL.enums.result_code['k_' + response.ResultCode];
                        resultMsg && alert(resultMsg);
                    }

                    $scope.isVoiceChecking = false;
                }).error(function(data, status) {
                    console.error('data:' + data + '\n' + 'status:' + status + '\n');
                    $scope.isVoiceChecking = false;
                });
            }

            // 诊断所有项（Pon、数据、语音）
            function checkAll() {
                checkPon();
                checkData();
                checkVoice();
            }

            function viewReport() {
                expanderHandel.hide();
                $rootScope.hideTabs = true;
                //    $state.go('tab.report-detail');
                $state.go('tab.report-detail', {
                    reportId: reportId,
                    reportStatus: reportStatus
                });
                // window.location.href = '#/tab/history/' + reportId;
            }

            function sure() {
                var report = $scope.report;
                //检测是否存在同名文件

                DB.queryByName($scope.report.reportName).then(function(res) {
                    var exist = res.rows.length > 0;


                    //存在则提示是否覆盖
                    if (exist) {
                        reportId = res.rows.item(0).id;
                        $scope.isCover = true;
                    } else {
                        saveToDB(report, 1).then(function() {
                            expanderHandel.hideMask();
                            $scope.saved = true;

                        }, function(info) {
                            console.error('sure error :' + JSON.stringify(info));
                            expanderHandel.hideMask();
                            $scope.save_failed = true;
                        });
                        expanderHandel.showMask();
                    }

                }, function(err) {
                    console.error(err);
                });
            }

            function saveToDB(res, type) {

                var ponPortStatus = $scope.ponInfos;
                var dataPortStatus = $scope.dataInfos;
                var voicePortStatus = $scope.voiceInfos;

                var report = {
                    deviceInfo: deviceInfo,
                    ponPortStatus: ponPortStatus,
                    dataPortStatus: dataPortStatus,
                    voicePortStatus: voicePortStatus
                };

                var now = new Date();
                var datas = {
                    id: now.getTime() + '',
                    name: res.reportName,
                    date: $filter('date')(now, 'yyyy-MM-dd HH:mm:ss'),
                    status: parseInt(res.resultStatus),
                    data: JSON.stringify(report),
                    conclusion: res.remark
                };


                //type  1: 新增 2：更新
                if (type === 1) {
                    reportStatus = 1;
                    reportId = datas.id;
                    return DB.insert(datas);
                } else if (type === 2) {
                    reportStatus = 0;
                    return DB.updateData(datas);
                }

            }


            initPage();

        }



    ]);

'use strict';

angular.module('starter.controllers').controller('VoiceDetailCtrl', 
	['$scope','$rootScope','Report','$state','Popup','ExpanderService','$timeout',
	 function($scope, $rootScope, Report, $state, Popup,ExpanderService,$timeout ) {
    $rootScope.hideTabs = true;

    $scope.voiceInfo = Report.getVoicePortInfo();

    $scope.back = function(){
    	$state.go('tab.check');
    	$rootScope.hideTabs = false;
    };

    var suggestExpanderConf = {
        templateUrl: 'editSuggest2.html',
        scope: $scope,
        backdoor: true
    };
    var suggestExpander = ExpanderService.init(suggestExpanderConf);


    // 界面事件处理函数
    $scope.eventFun = {
        showTip: function(item) {
            Popup.showPop(item);

        },

        openEdit : function(title, item){
            var note = item.note;
            var reason = item.reason ? item.reason : '';
            var msg = item.msg ? item.msg : '';
            if(note === undefined) {
                note = '';
                if(reason) {
                    note = $scope.i10n.checkModule.reason + ' : \r\n' +  reason + '\r\n\r\n';
                }
                if(msg) {
                    note = note + $scope.i10n.checkModule.suggestion + ' : \r\n' + msg;
                }
                
                         
            }

            $scope.editer = {
                title : title,
                note : note,
                item : item
            };
            suggestExpander.show();

            $timeout(function(){
                $('#editTextarea2').focus();
            },200);
        },

        closeEdit : function(){
             suggestExpander.hide();
        },

        clearEdit : function(){
            $scope.editer.note = '';
            $timeout(function(){
                $('#editTextarea').focus();
            },100);
            
        },

        saveEdit : function(){
            $scope.editer.item.note = $scope.editer.note;
            //清空系统建议
            $scope.editer.item.reason = null;
            $scope.editer.item.msg = null;
            suggestExpander.hide();
        }

    };


}]);

'use strict';
angular.module('starter.controllers')
    .controller('ReportDetailCtrl', ['$scope', '$rootScope', '$state', '$http', '$ionicHistory',
        '$stateParams', 'DB', '$ionicPopup', '$ionicModal', '$ionicPopover', 'File',
        '$cordovaSocialSharing', '$cordovaEmailComposer', 'Popup',
        function($scope, $rootScope, $state, $http, $ionicHistory,
            $stateParams, DB, $ionicPopup, $ionicModal, $ionicPopover, File,
            $cordovaSocialSharing, $cordovaEmailComposer, Popup) {

            $scope.reportLocal = ONU_LOCAL.reportModule;

            $rootScope.hideTabs = true;
            var filePath = '';

            //获取report id
            var id = $stateParams.reportId;
            var reportStatus = $stateParams.reportStatus;

            //返回按钮事件
            $scope.back = function() {
                window.location.href = '#/tab/history';
                // $ionicHistory.goBack();
                // $ionicHistory.clearHistory();
                $rootScope.hideTabs = false;
            };

            $scope.showTip = function(item) {
                Popup.showPop(item);
            };


            //根据id查询报告并渲染数据
            DB.queryById(id).then(function(res) {
                var item = res.rows.item(0);
                $scope.report = item;
                $scope.detail = JSON.parse(item.data);

                //记录文件地址
                filePath = 'file:///storage/emulated/0/onu_report/' + item.name + '.html';

                //查看报告文件是否生成过，没有则生成报告
                File.checkFile(item.name).then(function() {
                    //reportStatus为0表示覆盖，重新生成文件
                    if (reportStatus === '0') {
                        setTimeout(function() {
                            //创建报告
                            File.createReport(item.name, document.getElementById('report').innerHTML);
                        }, 1000);
                    } else {
                        console.info('reportStatus :' + reportStatus);
                    }
                }, function(error) {
                    //如果code为1说明没有找到文件，则要生成报告文件
                    if (error.code === 1) {
                        //延时1s生成报告，防止angular没有将页面没有渲染完成
                        setTimeout(function() {
                            //创建报告
                            File.createReport(item.name, document.getElementById('report').innerHTML);
                        }, 1000);

                    } else {
                        console.info('check report detail failed:'+ JSON.stringify(error));
                    }
                });
            }, function(error) {
                console.info('report detail failed :' + JSON.stringify(error));
            });

            //document.getElementById('report').innerHTML

            //popover初始化
            $ionicPopover.fromTemplateUrl('my-popover.html', {
                scope: $scope,
            }).then(function(popover) {
                $scope.popover = popover;
            });


            $scope.openPopover = function($event) {
                $scope.popover.show($event);
            };


            $scope.share = function() {
                $cordovaSocialSharing.share('', 'onu 检测报告', filePath).then(function() {
                    //发送结束后关闭popover框
                    $scope.popover.hide();
                }, function() {
                    //发送结束后关闭popover框
                    $scope.popover.hide();
                });
            };


            $scope.email = function() {
                var emailOption = {
                    // to: '',
                    // cc: '',
                    // bcc: [],
                    attachments: [
                        filePath
                    ],
                    subject: 'onu 检测报告',
                    body: 'onu 检测报告',
                    isHtml: true
                };

                $cordovaEmailComposer.open(emailOption).then(null, function() {
                    //发送结束后关闭popover框
                    $scope.popover.hide();
                });
            };

            $scope.onHold = function() {
                console.info('onHold');
            };

        }
    ]);

'use strict';

angular.module('starter.controllers')
    .controller('HistoryCtrl', ['$scope', '$state', '$log',
        '$ionicModal', '$rootScope', '$cordovaDatePicker', 'DB', 'File', 'ExpanderService',
        function($scope, $state, $log, $ionicModal, $rootScope,
            $cordovaDatePicker, DB, File, ExpanderService) {


            //缓存所有报告记录
            var list = [];
            //查询条件对象
            var condition = {};
            //操作状态 true表示当前是待选择 false是待取消
            $scope.operator = true;
            //ionic bug, $watch只能监视对象，prox用于挂载需要监视的属性
            $scope.prox = {};



            var today = dateUtils.getToday();

            //本地化信息
            $scope.local = ONU_LOCAL.historyModule;
            var date_select_list = [
                $scope.local.date_select.all,
                $scope.local.date_select.today,
                $scope.local.date_select.twoDays,
                $scope.local.date_select.week,
                $scope.local.date_select.month,
                $scope.local.date_select.customized
            ];

            //根据是否登录显示隐藏Tab
            if (!global.isLogin) {
                //隐藏导航栏
                $rootScope.hideTabs = true;

            }

            $rootScope.expanderHandel = [];
            var batchDeleleExpanderConf = {
                templateUrl: 'batchDelele.html',
                scope: $scope,
                backdoor: false
            };
            var batchDeleleExpanderHandel = ExpanderService.init(batchDeleleExpanderConf);
            $rootScope.expanderHandel.push(batchDeleleExpanderHandel);

            var changeDateExpanderConf = {
                templateUrl: 'changeDate.html',
                scope: $scope,
                backdoor: true
            };
            var changeDateExpanderHandel = ExpanderService.init(changeDateExpanderConf);
            $rootScope.expanderHandel.push(changeDateExpanderHandel);

            $scope.eventFun = {
                changeDateBtnEVt: function() {
                    changeDateExpanderHandel.show();
                    changeDateExpanderHandel.scope.range = $scope.range;
                },
                close: function() {
                    changeDateExpanderHandel.hide();
                },
                cancelEnter: function() {
                    $scope.prox.searchContent = '';
                },
                return: function() {
                    $state.go("index");
                    $rootScope.hideTabs = false;
                },
                viewReport: function(reportId) {
                    if(!$scope.shouldShowCheckbox){
                        $state.go('tab.report-detail', {
                        reportId: reportId,
                        reportStatus: 1
                    });
                    }
                    
                }
            };

            $scope.hideTabs = function() {
                $rootScope.hideTabs = true;
            };

            $scope.showTabs = function() {
                $rootScope.hideTabs = false;
            };

            $scope.login = function() {
                $state.go('index');
            };

            //下拉刷新数据
            $scope.doRefresh = function() {
                queryAll();
                //关闭刷新
                $scope.$broadcast('scroll.refreshComplete');
            };

            //日期选择事件
            $scope.chooseDate = function(flag) {
                //日期配置
                var dateOptions = {
                    date: new Date(),
                    mode: 'date', // or 'time'
                    //     minDate: new Date() - 10000,
                    allowOldDates: true,
                    allowFutureDates: false,
                    //      doneButtonLabel: 'DONE',
                    //      doneButtonColor: '#F2F3F4',
                    //      cancelButtonLabel: 'CANCEL',
                    //      cancelButtonColor: '#000000'
                };

                $cordovaDatePicker.show(dateOptions).then(function(date) {
                    date = date.format('yyyy-MM-dd');
                    if (flag) {
                        // condition.startDate = date;
                        $scope.startDate = date;
                    } else {
                        // condition.endDate = date;
                        $scope.endDate = date;
                    }
                    // setList(filterData());
                });
            };

            //过滤日期范围
            $scope.changeDate = function(range) {
                //range为0是查询所有报告
                if (range === 0) {
                    queryAll();
                }
                //range为5是启用日期精确定位
                else if (range === 5) {
                    condition.startDate = $scope.startDate;
                    condition.endDate = $scope.endDate;
                } else {
                    // range = parseInt(range);
                    var sDate = '';
                    var eDate = dateUtils.getToday();
                    switch (range) {
                        case 1:
                            sDate = dateUtils.getToday();
                            break;
                        case 2:
                            sDate = dateUtils.getSpeDate(-1);
                            break;
                        case 3:
                            sDate = dateUtils.getSpeDate(-6);
                            break;
                        case 4:
                            sDate = dateUtils.getSpeDate(-30);
                            break;
                        default:
                            sDate = '';
                            eDate = '';
                            break;
                    }
                    condition.startDate = sDate;
                    condition.endDate = eDate;
                }
                $scope.range = range;
                setList(filterData());
                changeDateExpanderHandel.hide();
                $scope.date_range = date_select_list[range];
            };

            //过滤类型
            $scope.filterType = function(type) {
                $scope.type = type;
                condition.type = type;
                setList(filterData());
            };

            //过滤search内容
            $scope.$watch('prox.searchContent', function(newVal) {
                if (newVal === undefined) {
                    return;
                }
                if (newVal) {
                    condition.searchContent = newVal.trim();
                } else {
                    condition.searchContent = '';
                }

                setList(filterData());
            });


            //打开“选择”窗口
            $scope.opera = function(e) {
                //如果是待选择
                if ($scope.operator) {
                    //显示checkbox
                    $scope.shouldShowCheckbox = true;
                    $scope.operation = ONU_LOCAL.historyModule.cancel;
                    //隐藏导航
                    $rootScope.hideTabs = true;
                } else {
                    $scope.operation = ONU_LOCAL.historyModule.choose;
                    cancel();
                }

                $scope.operator = !$scope.operator;

                // var delModelHeight = document.getElementById('history-operrator').offsetHeight;
                // var tabHeight = document.getElementsByClassName('tab-nav tabs')[0].offsetHeight;
                // var contentHeight = document.getElementById('historyTab').offsetHeight;
                // $scope.scrollHeight = {height:'65%'};
            };

            //当有一个checkbox选中时，显示操作框
            $scope.$watch('checkboxs', function(ckModels) {
                var ckcekOne = false;
                var num = 0;
                angular.forEach(ckModels, function(val) {
                    if (val) {
                        num++;
                        ckcekOne = true;
                        // return false;
                    }
                });
                $scope.local.del_batch = $scope.local.del + '(' + num + ')';
                if (ckcekOne) {
                    batchDeleleExpanderHandel.show();
                } else {
                    batchDeleleExpanderHandel.hide();
                }
            }, true);


            //批量删除操作
            $scope.batchDelele = function(e) {
                //防止冒泡
                e.stopPropagation();
                e.preventDefault();
                var checkItems = $scope.checkboxs;
                var delIds = [];
                for (var i = 0; i < list.length; i++) {
                    var id = list[i].id;
                    var name = list[i].name;
                    if (checkItems[id]) {

                        //把要删除的报告移动到删除文件夹
                        // File.deleteFile(name);
                        File.removeReport(name);
                        delIds.push(id);
                    }
                }
                //从数据库删除报告数据
                DB.deleteByIds(delIds);
                queryAll();
                $scope.opera();

            };

            //单个删除
            $scope.deleteReport = function(item) {
                var id = item.id;
                var name = item.name;
                DB.deleteByIds(id);
                File.removeReport(name);
                // File.deleteFile(name);
                queryAll();
                cancel();
            };

            //“取消”操作
            function cancel() {
                //隐藏model框
                batchDeleleExpanderHandel.hide();
                //隐藏checkbox
                $scope.shouldShowCheckbox = false;
                //显示导航
                $rootScope.hideTabs = false;
            }


            function initPage() {
                $scope.isLogin = global.isLogin;

                $scope.operation = ONU_LOCAL.historyModule.choose;

                //初始化checkbox模型
                $scope.checkboxs = {};
                //初始化参数
                condition = {
                    startDate: dateUtils.getSpeDate(-6),
                    endDate: today,
                    searchContent: '',
                    type: 0
                };

                //日期范围默认选择“一周内”
                $scope.range = 3;
                $scope.date_range = date_select_list[$scope.range];

                $scope.startDate = today;
                $scope.endDate = today;
                $scope.searchContent = '';
                //报告类型默认选择“全部”
                $scope.type = 0;

                //   DB.insert(datas()); 

                // $scope.scrollHeight = {
                //     height: '70%'
                // };



                //查询所有报告记录
                queryAll();
            }


            function queryAll() {
                list = [];
                $scope.prox.loading = true;
                DB.queryAll().then(function(res) {
                    var length = res.rows.length;
                    // alert("queryAll:" + length);
                    if (length > 0) {
                        for (var i = 0; i < length; i++) {
                            var reportEle = res.rows.item(i);

                            list.push(reportEle);
                        }

                    }
                    setList(filterData());
                }, function(err) {
                    console.error(err);
                });
            }


            //设置数据
            function setList(list) {
                //如果此时是操作状态，则要关闭操作窗口
                if (!$scope.operator) {
                    $scope.opera();
                }
                $scope.list = list;
                //隐藏加载动画
                $scope.prox.loading = false;

            }


            function filterData() {
                $scope.prox.loading = true;
                var result = [];
                angular.forEach(list, function(item) {

                    //若日期选择“全部”，则不用过滤日期
                    if ($scope.range !== 0) {
                        //截取年月日，不用管时分秒
                        var date = item.date.substr(0, 10);
                        //过滤日期
                        if (date < condition.startDate || date > condition.endDate) {
                            return true;
                        }
                    }
                    //过滤名称
                    var search = condition.searchContent;
                    if (search) {
                        if (item.name.indexOf(search) === -1) {
                            return true;
                        }
                    }

                    //过滤类型
                    var type = condition.type;
                    //repType 1为正常 2 3 4 对应其他异常
                    var repType = item.status;
                    //正常
                    if (type === 1) {
                        if (repType !== 1) {
                            return true;
                        }
                    } else if (type === 2) { //异常
                        if (repType === 1) {
                            return true;
                        }
                    }

                    result.push(item);
                });

                return result;
            }

            initPage();



        }
    ]);

'use strict';

angular.module('starter.controllers')
    .controller('SettingCtrl', ['$scope', '$rootScope', '$state', 'ExpanderService', 'DB','Report', function($scope, $rootScope, $state, ExpanderService, DB,Report) {
        $scope.local = ONU_LOCAL.settingModule;
        $rootScope.hideTabs = false;
        
        $scope.retention_select = [
            $scope.local.retention_time_select.day,
            $scope.local.retention_time_select.month,
            $scope.local.retention_time_select.year,
            $scope.local.retention_time_select.permanent
        ];
        //报告保留时间弹出框配置
        var reportRetentionTimeExpanderConf = {
            templateUrl: 'reportRetentionTime.html',
            scope: $scope,
            backdoor: true
        };
        var reportRetentionTimeExpanderHandel = ExpanderService.init(reportRetentionTimeExpanderConf);
        //将该句柄添加到list中，硬件返回按钮触发事件中会检查该弹出框知否已显示，若显示则隐藏。
        $rootScope.expanderHandel = [];
        $rootScope.expanderHandel.push(reportRetentionTimeExpanderHandel);

        $scope.date_select = [
            $scope.local.date_select.one_year,
            $scope.local.date_select.two_years,
        ];
        var warrantyPeriodExpanderConf = {
            templateUrl: 'warrantyPeriod.html',
            scope: $scope,
            backdoor: true
        };
        var warrantyPeriodExpanderHandel = ExpanderService.init(warrantyPeriodExpanderConf);
        $rootScope.expanderHandel.push(warrantyPeriodExpanderHandel);

        DB.queryRetentionTime().then(function(res) {
            var length = res.rows.length;
            if (length > 0) {
                $scope.retentionIndex = res.rows.item(0).value;
            } else {
                alert('SettingCtrl read retention time failed ');
            }
        }, function(err) {
            console.error(err);
        });

        DB.queryWarrantyPeriod().then(function(res) {
            var length = res.rows.length;
            if (length > 0) {
                $scope.periodIndex = res.rows.item(0).value;
            } else {
                alert('Unable to read warranty period from DB ');
            }
        }, function(err) {
            console.error(err);
        });


        $scope.eventFun = {
            closeRetentionTimeBox: function() {
                reportRetentionTimeExpanderHandel.hide();
            },
            closeWarrantyPeriodBox: function() {
                warrantyPeriodExpanderHandel.hide();

            },
            openRetentionTimeBox: function() {
                reportRetentionTimeExpanderHandel.show();
                reportRetentionTimeExpanderHandel.scope.delRange = $scope.retentionIndex;
            },
            openWarrantyPeriodBox: function() {
                warrantyPeriodExpanderHandel.show();
                warrantyPeriodExpanderHandel.scope.dateRange = $scope.periodIndex;
            },
            changeDeletePeriod: function(range) {
                reportRetentionTimeExpanderHandel.hide();
                $scope.retentionIndex = range;
                DB.updateRetentionTime(range);
            },
            changeWarrantyPeriod: function(range) {
                warrantyPeriodExpanderHandel.hide();
                $scope.periodIndex = range;
                DB.updateWarrantyPeriod(range);
            },
            reconnect: function() {
                $state.go('index');
                Report.deviceInfo={};
            }
        };
    }]);

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

'use strict';
angular.module('starter.services').service('File', ['$rootScope', '$log', '$cordovaFile',
    '$filter', '$ionicPlatform', 'L', 'Popup',function($rootScope, $log, $cordovaFile,
    $filter, $ionicPlatform, L, Popup) {

    var fileSystem;
    var lFileSystem;
    var lFileName = 'ol.json';

    //存放报告的文件夹名称
    var reportDir = 'onu_report';
    var _reportDir = reportDir + '/';
    //文件类型
    var fileType = '.html';

    $ionicPlatform.ready(function() {
        lFileSystem = cordova.file.dataDirectory;
        lFileSystem = cordova.file.externalRootDirectory;
        $cordovaFile.checkFile(lFileSystem, lFileName).then(function(success) {
   
            $cordovaFile.readAsText(lFileSystem, lFileName).then(function(data) {
                data = base64decode(data);
                var RegisterData = JSON.parse(data);

                if (L.b() === RegisterData.key) {
                    var startDate = dateUtils.getDayOfLastYear();
                   
                    if (RegisterData.date < startDate) {
                        Popup.showTip(ONU_LOCAL.tip.l_expired);
                        $rootScope.isRegistered = false;
                        removeL();
                    } else {
                        $rootScope.isRegistered = true;
                    }
                } else {
                    Popup.showTip(ONU_LOCAL.tip.l_wrong);
                    removeL();
                    $rootScope.isRegistered = false;
                }

            }, function(error) {
                alert(JSON.stringify(error));
            });

        }, function(error) {

            if (error.code === 1) {

                $rootScope.isRegistered = false;
            } else {
                alert('ol.json can\'t be created,error message is :' + error.message);

            }
        });

        //  在File service初始化的时候:
        //  1.检查onu_report是否存在，不存在则建立onu_report文件夹
        //  2.清空onu_del文件夹
        fileSystem = cordova.file.externalRootDirectory;

        //检查存放报告的文件夹是否存在，不存在则创建
        $cordovaFile.checkDir(fileSystem, reportDir).then(success, function(error) {
            //如果存放报告的文件夹不存在，重新新建
            if (error.code === 1) {
                $cordovaFile.createDir(fileSystem, reportDir, false).then(success, function(error) {
                    alert('onu_report can\'t be created,error message is : ' + error.message);
                });
            } else {
                alert('onu_report can\'t be created,error message is :' + error.message);
            }

        });

    });

    //成功回调
    function success(info) {
        console.info('success :' + JSON.stringify(info));
    }
    //失败回调
    function error(info) {
        alert('File error :' + JSON.stringify(info));
    }

    //创建报告
    this.createReport = function(fileName, data) {
        //增加报告文件基本的HTML格式代码
        var head = '<!DOCTYPE html><html><head><meta charset="utf-8"></head>';
        var tail = '</html>';
        $cordovaFile.writeFile(fileSystem, _reportDir + fileName + fileType, head + data + tail, true).then(success, function(error) {
            alert('createReport error : ' + JSON.stringify(error));
        });
    };

    //增加一条记录
    this.addReportRecord = function(fileName, content) {
        $cordovaFile.writeExistingFile(fileSystem, _reportDir + fileName + fileType, content).then(success, function(error) {
            alert('addReportRecord error : ' + JSON.stringify(error));
        });
    };

    //读取文件
    this.readReport = function(filePath) {
        return $cordovaFile.readAsText(fileSystem, filePath).then(success, function(error) {
                alert('readReport error : ' + JSON.stringify(error));
            });
    };

    //删除报告
    this.removeReport = function(fileName){
         $cordovaFile.removeFile(fileSystem, _reportDir + fileName + fileType).then(success, function(error) {
                alert('removeReport error : ' + JSON.stringify(error));
            });
    };

    //检查文件是否存在
    this.checkFile = function(fileName) {
        return $cordovaFile.checkFile(fileSystem, _reportDir + fileName + fileType);
    };

  
    this.createL = function(data) {
        var processedData = base64encode(data);
        return $cordovaFile.writeFile(lFileSystem, lFileName, processedData, true);
    };


    this.readL = function() {
        return $cordovaFile.readAsText(lFileSystem, lFileName);
    };


    function removeL() {
        $cordovaFile.removeFile(lFileSystem, lFileName).then(success, function(error) {
                alert('removeL error : ' + JSON.stringify(error));
            });
    }
}]);

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
                    key: 'report_retention_time',
                    value: 0
                };
                initConf(retentionConf);
                var periodConf = {
                    key: 'warranty_period',
                    value: 1
                };
                initConf(periodConf);
            } else {
                // alert('fiber_onu_conf length:'+length);
            }
        }, function(err) {
            console.error(err);
        });
    });


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
        query = 'SELECT id FROM fiber_onu_data where name = ? ';
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
        confQuery = "SELECT value FROM fiber_onu_conf where key='warranty_period'";
        return $cordovaSQLite.execute(db, confQuery);
    };

    this.updateWarrantyPeriod = function(value) {
        confQuery = "UPDATE fiber_onu_conf SET value = ? WHERE key='warranty_period'";
        return $cordovaSQLite.execute(db, confQuery, [value]);
    };

    this.queryRetentionTime = function() {
        confQuery = "SELECT value FROM fiber_onu_conf where key='report_retention_time'";
        return $cordovaSQLite.execute(db, confQuery);
    };

    this.updateRetentionTime = function(value) {
        confQuery = "UPDATE fiber_onu_conf SET value = ? WHERE key='report_retention_time'";
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

angular.module('starter.services').service('Const',function(){
	var reqUrl = 'https://192.168.1.1:4433/app';

	this.getReqUrl = function(){
	 //    var	random = new Date().getTime();
		// return reqUrl + '?v=' + random;
		return reqUrl;
	};

	this.setReqUrl = function(url){
		reqUrl = url;
	};

});
angular.module('starter.services').service('Report', function() {

    this.deviceInfo = {};

    this.ponPortInfo = [];

    this.dataPortInfo = [];

    this.voicePortInfo = {
        port_detail : []
    };

    this.setDeviceInfo = function(info) {
        this.deviceInfo = info;
    };

    this.getDeviceInfo = function() {
        return this.deviceInfo;
    };

    this.setPonPortInfo = function(info) {
        this.ponPortInfo = info;
    };



    this.getPonPortInfo = function() {
    	if(this.ponPortInfo.length < 1 ) {
    		var pon_num = parseInt(this.deviceInfo.pon_port_number ? this.deviceInfo.pon_port_number.val : 0);
	        for(var i = 0; i< pon_num; i++) {
	            this.ponPortInfo.push({
	                'pon_port_id': '',
	                'temperature': '',            
	                'voltage': '',                  
	                'bias_current': '',         
	                'tx_opt_power': '',          
	                'rx_opt_power': '' 
	            });
	        }
    	}
    	
        return this.ponPortInfo;
    };

    this.setDataPortInfo = function(info) {
        this.dataPortInfo = info;
    };

    this.getDataPortInfo = function() {
    	if(this.dataPortInfo.length < 1 ) {
    		var data_num = parseInt(this.deviceInfo.data_port_number ? this.deviceInfo.data_port_number.val : 0);
	        for(var i = 0; i< data_num; i++) {
	            this.dataPortInfo.push({
	                'data_port_id': '',
                    'port_status': '',            
                    'speed': '',                  
                    'duplex': '',
	            });
	        }
    	}
        return this.dataPortInfo;
    };


    this.setVoicePortInfo = function(info) {
        this.voicePortInfo = info;
    };

    this.getVoicePortInfo = function() {
        if(this.voicePortInfo.port_detail.length < 1) {
            var voice_num = parseInt(this.deviceInfo.voice_port_number ? this.deviceInfo.voice_port_number.val : 0);
            this.voicePortInfo.port_detail = [];
            for(var i = 0; i< voice_num; i++) {
                this.voicePortInfo.port_detail.push({
                    voice_port_id : '',
                    port_status : {val : ''},
                    port_enable : {val : ''},
                    user_tid : {val : ''},
                    telphone_no : {val : ''},
                    sip_user_name: {val : ''},
                    sip_user_pass: {val : ''}
                });
            }
        }
        return this.voicePortInfo;
    };
});

'use strict';

angular.module('starter.services').
factory('ExpanderService', ['$templateCache', '$compile', '$ionicBody', '$rootScope', '$timeout',
    function($templateCache, $compile, $ionicBody, $rootScope, $timeout) {

        var maskCss = 'front_mask_layer';

        var eleMap = {};
        var keyboardHeight = 0;
       

        function init(configuration) {
            var self = {};
            //查找是否已经创建过该组件
            if (eleMap.hasOwnProperty(configuration.templateUrl)) {
                var handle = eleMap[configuration.templateUrl];
                var node = document.getElementById(handle.element.id);
                node.parentNode.removeChild(node);
            }
            var ele = document.createElement('div');


            $ionicBody.get().appendChild(ele);
            ele.innerHTML = $templateCache.get(configuration.templateUrl);
            // ele.style.bottom = (0 - ele.offsetHeight) + 'px';
            self.element = ele;

            ele.className = 'operator';

            //弹出框背景的遮罩层
            var backMaskEle = document.createElement('div');
            backMaskEle.className = 'back_mask_layer ';
            self.backMaskEle = backMaskEle;

            //弹出框上面的遮罩层
            var frontMaskEle = document.createElement('div');
            frontMaskEle.className = maskCss;
            frontMaskEle.innerHTML = '<i class="icon ion-loop"></i>';
            self.frontMaskEle = frontMaskEle;

            self.hide = hide;
            self.show = show;
            self.showMask = showMask;
            self.hideMask = hideMask;
            self.isShow = false;

            self.scope = (configuration.scope || $rootScope).$new();
            self.element.id = self.scope.$id;
            self.options = configuration;
            //绑定DOM和scope
            $compile(self.element)(self.scope);

            //设置元素高度，用于展现时候的动画效果
            self.bottom = (0 - self.element.offsetHeight) + 'px';
            self.element.style.bottom = self.bottom;
            self.element.style.display = 'none';
            $(self.element).hide();

            eleMap[configuration.templateUrl] = self;

            return self;
        }


        function hide() {
            var that = this;
            this.isShow = false;
            $(this.element).animate({
                bottom: that.bottom
            }, 50, function() {
            // }, 250, function() {

                if (that.options.backdoor) {
                    // $ionicBody.removeClass('popup-open');
                    $ionicBody.get().removeChild(that.backMaskEle);
                }

                $timeout(function() {
                    that.element.style.display = 'none';
                }, 50);
            });


        }

        function show() {
            var that = this;

            this.isShow = true;

            this.element.style.display = 'block';

            
            $(this.element).animate({
                bottom: keyboardHeight
            },function() {
                //若需要背景蒙罩层并禁止点击
                if (that.options.backdoor) {
                    $ionicBody.get().appendChild(that.backMaskEle);
                }
            });



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

angular.module('starter.services').service('Check',function(){

	var standard = {
		basic : {
			led_status : [{
				op : 'eq',
				val : '0',
				reason : ONU_LOCAL.suggest.reason.r1,
				suggest : ONU_LOCAL.suggest.msg.m1
			}],
			onu_regist_status : [{
				op : 'eq',
				val : '01',
				reason : ONU_LOCAL.suggest.reason.r2,
				suggest : ONU_LOCAL.suggest.msg.m2
			},{
				op : 'eq',
				val : '02',
				reason : ONU_LOCAL.suggest.reason.r3,
				suggest : ONU_LOCAL.suggest.msg.m3
			},{
				op : 'eq',
				val : '03',
				reason : ONU_LOCAL.suggest.reason.r3,
				suggest : ONU_LOCAL.suggest.msg.m3
			},{
				op : 'eq',
				val : '04',
				reason : ONU_LOCAL.suggest.reason.r4,
				suggest : ONU_LOCAL.suggest.msg.m4
			},{
				op : 'eq',
				val : '06',
				reason : ONU_LOCAL.suggest.reason.r4,
				suggest : ONU_LOCAL.suggest.msg.m4
			},{
				op : 'eq',
				val : '07',
				reason : ONU_LOCAL.suggest.reason.r5,
				suggest : ONU_LOCAL.suggest.msg.m5
			}],
			onu_auth_status : [{
				op : 'eq',
				val : '0',
				reason : ONU_LOCAL.suggest.reason.r6,
				suggest : ONU_LOCAL.suggest.msg.m6
			},{
				op : 'gt',
				val : '1',
				reason : ONU_LOCAL.suggest.reason.r7,
				suggest : ONU_LOCAL.suggest.msg.m7
			}]
		},
		pon :{
			led_status : [{
				op : 'eq',
				val : '0',
				reason : ONU_LOCAL.suggest.reason.r8,
				suggest : ONU_LOCAL.suggest.msg.m8
			}],
			temperature : [{
				op : 'gte',
				val : '90',
				reason : ONU_LOCAL.suggest.reason.r9,
				suggest : ONU_LOCAL.suggest.msg.m9
			}],
			voltage : [{
				op : 'gt',
				val : '3.3',
				reason : ONU_LOCAL.suggest.reason.r10,
				suggest : ONU_LOCAL.suggest.msg.m10
			},{
				op : 'lt',
				val : '3.1',
				reason : ONU_LOCAL.suggest.reason.r11,
				suggest : ONU_LOCAL.suggest.msg.m10
			}],
			bias_current : [{
				op : 'gte',
				val : '40',
				reason : ONU_LOCAL.suggest.reason.r12,
				suggest : ONU_LOCAL.suggest.msg.m11
			}],
			tx_opt_power : [{
				op : 'gt',
				val : '5',
				reason : ONU_LOCAL.suggest.reason.r13,
				suggest : ONU_LOCAL.suggest.msg.m12
			},{
				op : 'lt',
				val : '1.5',
				reason : ONU_LOCAL.suggest.reason.r14,
				suggest : ONU_LOCAL.suggest.msg.m12
			}],
			rx_opt_power : [{
				op : 'gt',
				val : '-8',
				reason : ONU_LOCAL.suggest.reason.r15,
				suggest : ONU_LOCAL.suggest.msg.m13
			},{
				op : 'lt',
				val : '-30',
				reason : ONU_LOCAL.suggest.reason.r16,
				suggest : ONU_LOCAL.suggest.msg.m13
			}]
		},
		data : {
			port_status : [{
				op : 'eq',
				val : '1',
				reason : ONU_LOCAL.suggest.reason.r17,
				suggest : ONU_LOCAL.suggest.msg.m14
			},{
				op : 'eq',
				val : '2',
				reason : ONU_LOCAL.suggest.reason.r18,
				suggest : ONU_LOCAL.suggest.msg.m15
			},{
				op : 'eq',
				val : '3',
				reason : ONU_LOCAL.suggest.reason.r19,
				suggest : ONU_LOCAL.suggest.msg.m16
			}]
		},
		voice : {
			protocol_type :[{
				op : 'eq',
				val : '0',
				reason : ONU_LOCAL.suggest.reason.r20,
				suggest : ONU_LOCAL.suggest.msg.m17
			}],
			signal_svlan_id : [{
				op : 'eq',
				val : '0'
			}],
			signal_ip : [{
				op : 'eq',
				val : '0.0.0.0'
			},{
				op : 'eq',
				val : '127.0.0.1'
			}],
			ip_mask : [{
				op : 'eq',
				val : '0.0.0.0'
			}],
			first_mgc_ip : [{
				op : 'eq',
				val : '0.0.0.0'
			}],
			first_mgc_port : [{
				op : 'neq',
				val : '2944'
			}],
			h248_local_port : [{
				op : 'neq',
				val : '2944'
			}],
			first_sip_registrar_server_ip : [{
				op : 'eq',
				val : '0.0.0.0'
			}],
			first_sip_registrar_server_port : [{
				op : 'neq',
				val : '5060'
			}],
			first_sip_proxy_server_ip : [{
				op : 'eq',
				val : '0.0.0.0'
			}],
			first_sip_proxy_server_port : [{
				op : 'neq',
				val : '5060'
			}],
			sip_local_port : [{
				op : 'neq',
				val : '5060'
			}],
			mgc_reg_status : [{
				op : 'eq',
				val : '0',
				reason : ONU_LOCAL.suggest.reason.r25,
				suggest : ONU_LOCAL.suggest.msg.m19
			},{
				op : 'eq',
				val : '2',
				reason : ONU_LOCAL.suggest.reason.r25,
				suggest : ONU_LOCAL.suggest.msg.m23
			}]
		},

		voice_detail : {
			port_enable : [{
				op : 'eq',
				val : '0'
			}],
			user_tid : [{
				op : 'eq',
				val : ''
			}],
			telphone_no : [{
				op : 'eq',
				val : ''
			}],
			port_status : [{
				op : 'eq',
				val : '0',
				reason : ONU_LOCAL.suggest.reason.r21,
				suggest : ONU_LOCAL.suggest.msg.m18
			},{
				op : 'eq',
				val : '1',
				reason : ONU_LOCAL.suggest.reason.r22,
				suggest : ONU_LOCAL.suggest.msg.m19
			},{
				op : 'eq',
				val : '12',
				reason : ONU_LOCAL.suggest.reason.r23,
				suggest : ONU_LOCAL.suggest.msg.m20
			},{
				op : 'eq',
				val : '13',
				reason : ONU_LOCAL.suggest.reason.r24,
				suggest : ONU_LOCAL.suggest.msg.m21
			}]
		}
	};


	this.checking = function(type, datas){
		
		$.each(datas,function(key,item){
			//如果存在ecode，则不处理
			var ecode = item.ecode;
			if(!ecode) {
				var sts = standard[type][key];
				//是否有检测标准，有检测标准则进行检测
				if(sts){
					$.each(sts,function(index,val){
						var op = val.op;
						var value = val.val;
						if((op === 'eq' && item.val === value) || 
							(op === 'neq' && item.val !== value) ||
							(op === 'gt' && parseFloat(item.val) > parseFloat(value)) || 
							(op === 'lt' && parseFloat(item.val) < parseFloat(value)) ||
							(op === 'gte' && parseFloat(item.val) >= parseFloat(value)) || 
							(op === 'lte' && parseFloat(item.val) <= parseFloat(value))){
							item.warn = true;
							if(val.reason){
								item.reason = val.reason;
							}
							if(val.suggest){
								item.msg = val.suggest;
							}
							
						}
					});
				}
				
			}
			
		});

		return datas;
	};


});
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

// 对Date的扩展，将 Date 转化为指定格式的String
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符， 
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字) 
// 例子： 
// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423 
// (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18 
Date.prototype.format = function(fmt) {
    var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "h+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
    }

    return fmt;
}



/*
 *  方法:Array.remove(dx)
 *  功能:根据元素位置值删除数组元素.
 *  参数:元素值
 *  返回:在原数组上修改数组
 *  作者：pxp
 */
Array.prototype.remove = function(dx) {
    if (isNaN(dx) || dx > this.length) {
        return false;
    }
    for (var i = 0, n = 0; i < this.length; i++) {
        if (this[i] != this[dx]) {
            this[n++] = this[i];
        }
    }
    this.length -= 1;
};

var dateUtils = {
    /**
     * 获取当前日期 yyyy-MM-dd 格式字符串
     * @returns {string}
     */
    getToday: function() {
        return new Date().format('yyyy-MM-dd');
    },

    /**
     * 获取当前月份第一天
     * @returns {string}
     */
    getCurrentMonthFirstDay: function() {
        var now = new Date();
        var year = now.getFullYear();
        var month = now.getMonth() + 1;
        if (month < 10) {
            month = '0' + month;
        }
        return year + "-" + month + "-01";
    },

    /**
     * 获取去年今天
     * @returns {Date}
     */
    getDayOfLastYear: function() {
        var now = new Date(new Date().format('yyyy-MM-dd'));
        var time = now.getTime() - 365 * 24 * 60 * 60 * 1000;
        return new Date(time).format('yyyy-MM-dd');
    },

    /**
     * 获取指定年的指定天
     * @returns {string}
     */
    getDate: function(year, days) {
        var days = (days - 1) >= 0 ? days - 1 : 0;
        var firstDay = new Date(year + "-01-01");
        var time = firstDay.getTime() + days * 24 * 60 * 60 * 1000;
        return new Date(time).format('yyyy-MM-dd');
    },

    /**
     * 获取指定日期
     * days 正数表示向后几天，附属表示向前几天
     * @returns {string}
     */
    getSpeDate: function(days) {
        var nowTime = new Date().getTime();
        var time = nowTime + parseInt(days) * 24 * 60 * 60 * 1000;
        return new Date(time).format('yyyy-MM-dd');
    }

}

/*
 Javascript MD5 library - version 0.4

 Coded (2011) by Luigi Galli - LG@4e71.org - http://faultylabs.com

 Thanks to: Roberto Viola

 The below code is PUBLIC DOMAIN - NO WARRANTY!

 Changelog: 
            Version 0.4   - 2011-06-19
            + added compact version (md5_compact_min.js), this is a slower but smaller version 
              (more than 4KB lighter before stripping/minification)
            + added preliminary support for Typed Arrays (see: 
              https://developer.mozilla.org/en/JavaScript_typed_arrays and 
              http://www.khronos.org/registry/typedarray/specs/latest/)
              MD5() now accepts input data as ArrayBuffer, Float32Array, Float64Array, 
              Int16Array, Int32Array, Int8Array, Uint16Array, Uint32Array or Uint8Array 
            - moved unit tests to md5_test.js
            - minor refactoring 

            Version 0.3.* - 2011-06-##
            - Internal dev versions

            Version 0.2 - 2011-05-22 
            ** FIXED: serious integer overflow problems which could cause a wrong MD5 hash being returned

            Version 0.1 - 2011
            -Initial version
*/
if (typeof faultylabs == 'undefined') {
    faultylabs = {}
}

/*
   MD5()

    Computes the MD5 hash for the given input data

    input :  data as String - (Assumes Unicode code points are encoded as UTF-8. If you 
                               attempt to digest Unicode strings using other encodings 
                               you will get incorrect results!)

             data as array of characters - (Assumes Unicode code points are encoded as UTF-8. If you 
                              attempt to digest Unicode strings using other encodings 
                              you will get incorrect results!)

             data as array of bytes (plain javascript array of integer numbers)

             data as ArrayBuffer (see: https://developer.mozilla.org/en/JavaScript_typed_arrays)
            
             data as Float32Array, Float64Array, Int16Array, Int32Array, Int8Array, Uint16Array, Uint32Array or Uint8Array (see: https://developer.mozilla.org/en/JavaScript_typed_arrays)
             
             (DataView is not supported yet)

   output: MD5 hash (as Hex Uppercase String)
*/

faultylabs.MD5 = function(data) {

    // convert number to (unsigned) 32 bit hex, zero filled string
    function to_zerofilled_hex(n) {     
        var t1 = (n >>> 0).toString(16)
        return "00000000".substr(0, 8 - t1.length) + t1
    }

    // convert array of chars to array of bytes 
    function chars_to_bytes(ac) {
        var retval = []
        for (var i = 0; i < ac.length; i++) {
            retval = retval.concat(str_to_bytes(ac[i]))
        }
        return retval
    }


    // convert a 64 bit unsigned number to array of bytes. Little endian
    function int64_to_bytes(num) {
        var retval = []
        for (var i = 0; i < 8; i++) {
            retval.push(num & 0xFF)
            num = num >>> 8
        }
        return retval
    }

    //  32 bit left-rotation
    function rol(num, places) {
        return ((num << places) & 0xFFFFFFFF) | (num >>> (32 - places))
    }

    // The 4 MD5 functions
    function fF(b, c, d) {
        return (b & c) | (~b & d)
    }

    function fG(b, c, d) {
        return (d & b) | (~d & c)
    }

    function fH(b, c, d) {
        return b ^ c ^ d
    }

    function fI(b, c, d) {
        return c ^ (b | ~d)
    }

    // pick 4 bytes at specified offset. Little-endian is assumed
    function bytes_to_int32(arr, off) {
        return (arr[off + 3] << 24) | (arr[off + 2] << 16) | (arr[off + 1] << 8) | (arr[off])
    }

    /*
    Conver string to array of bytes in UTF-8 encoding
    See: 
    http://www.dangrossman.info/2007/05/25/handling-utf-8-in-javascript-php-and-non-utf8-databases/
    http://stackoverflow.com/questions/1240408/reading-bytes-from-a-javascript-string
    How about a String.getBytes(<ENCODING>) for Javascript!? Isn't it time to add it?
    */
    function str_to_bytes(str) {
        var retval = [ ]
        for (var i = 0; i < str.length; i++)
            if (str.charCodeAt(i) <= 0x7F) {
                retval.push(str.charCodeAt(i))
            } else {
                var tmp = encodeURIComponent(str.charAt(i)).substr(1).split('%')
                for (var j = 0; j < tmp.length; j++) {
                    retval.push(parseInt(tmp[j], 0x10))
                }
            }
        return retval
    }


    // convert the 4 32-bit buffers to a 128 bit hex string. (Little-endian is assumed)
    function int128le_to_hex(a, b, c, d) {
        var ra = ""
        var t = 0
        var ta = 0
        for (var i = 3; i >= 0; i--) {
            ta = arguments[i]
            t = (ta & 0xFF)
            ta = ta >>> 8
            t = t << 8
            t = t | (ta & 0xFF)
            ta = ta >>> 8
            t = t << 8
            t = t | (ta & 0xFF)
            ta = ta >>> 8
            t = t << 8
            t = t | ta
            ra = ra + to_zerofilled_hex(t)
        }
        return ra
    }

    // conversion from typed byte array to plain javascript array 
    function typed_to_plain(tarr) {
        var retval = new Array(tarr.length)
        for (var i = 0; i < tarr.length; i++) {
            retval[i] = tarr[i]
        }
        return retval
    }

    // check input data type and perform conversions if needed
    var databytes = null
    // String
    var type_mismatch = null
    if (typeof data == 'string') {
        // convert string to array bytes
        databytes = str_to_bytes(data)
    } else if (data.constructor == Array) {
        if (data.length === 0) {
            // if it's empty, just assume array of bytes
            databytes = data
        } else if (typeof data[0] == 'string') {
            databytes = chars_to_bytes(data)
        } else if (typeof data[0] == 'number') {
            databytes = data
        } else {
            type_mismatch = typeof data[0]
        }
    } else if (typeof ArrayBuffer != 'undefined') {
        if (data instanceof ArrayBuffer) {
            databytes = typed_to_plain(new Uint8Array(data))
        } else if ((data instanceof Uint8Array) || (data instanceof Int8Array)) {
            databytes = typed_to_plain(data)
        } else if ((data instanceof Uint32Array) || (data instanceof Int32Array) || 
               (data instanceof Uint16Array) || (data instanceof Int16Array) || 
               (data instanceof Float32Array) || (data instanceof Float64Array)
         ) {
            databytes = typed_to_plain(new Uint8Array(data.buffer))
        } else {
            type_mismatch = typeof data
        }   
    } else {
        type_mismatch = typeof data
    }

    if (type_mismatch) {
        alert('MD5 type mismatch, cannot process ' + type_mismatch)
    }

    function _add(n1, n2) {
        return 0x0FFFFFFFF & (n1 + n2)
    }


    return do_digest()

    function do_digest() {

        // function update partial state for each run
        function updateRun(nf, sin32, dw32, b32) {
            var temp = d
            d = c
            c = b
            //b = b + rol(a + (nf + (sin32 + dw32)), b32)
            b = _add(b, 
                rol( 
                    _add(a, 
                        _add(nf, _add(sin32, dw32))
                    ), b32
                )
            )
            a = temp
        }

        // save original length
        var org_len = databytes.length

        // first append the "1" + 7x "0"
        databytes.push(0x80)

        // determine required amount of padding
        var tail = databytes.length % 64
        // no room for msg length?
        if (tail > 56) {
            // pad to next 512 bit block
            for (var i = 0; i < (64 - tail); i++) {
                databytes.push(0x0)
            }
            tail = databytes.length % 64
        }
        for (i = 0; i < (56 - tail); i++) {
            databytes.push(0x0)
        }
        // message length in bits mod 512 should now be 448
        // append 64 bit, little-endian original msg length (in *bits*!)
        databytes = databytes.concat(int64_to_bytes(org_len * 8))

        // initialize 4x32 bit state
        var h0 = 0x67452301
        var h1 = 0xEFCDAB89
        var h2 = 0x98BADCFE
        var h3 = 0x10325476

        // temp buffers
        var a = 0, b = 0, c = 0, d = 0

        // Digest message
        for (i = 0; i < databytes.length / 64; i++) {
            // initialize run
            a = h0
            b = h1
            c = h2
            d = h3

            var ptr = i * 64

            // do 64 runs
            updateRun(fF(b, c, d), 0xd76aa478, bytes_to_int32(databytes, ptr), 7)
            updateRun(fF(b, c, d), 0xe8c7b756, bytes_to_int32(databytes, ptr + 4), 12)
            updateRun(fF(b, c, d), 0x242070db, bytes_to_int32(databytes, ptr + 8), 17)
            updateRun(fF(b, c, d), 0xc1bdceee, bytes_to_int32(databytes, ptr + 12), 22)
            updateRun(fF(b, c, d), 0xf57c0faf, bytes_to_int32(databytes, ptr + 16), 7)
            updateRun(fF(b, c, d), 0x4787c62a, bytes_to_int32(databytes, ptr + 20), 12)
            updateRun(fF(b, c, d), 0xa8304613, bytes_to_int32(databytes, ptr + 24), 17)
            updateRun(fF(b, c, d), 0xfd469501, bytes_to_int32(databytes, ptr + 28), 22)
            updateRun(fF(b, c, d), 0x698098d8, bytes_to_int32(databytes, ptr + 32), 7)
            updateRun(fF(b, c, d), 0x8b44f7af, bytes_to_int32(databytes, ptr + 36), 12)
            updateRun(fF(b, c, d), 0xffff5bb1, bytes_to_int32(databytes, ptr + 40), 17)
            updateRun(fF(b, c, d), 0x895cd7be, bytes_to_int32(databytes, ptr + 44), 22)
            updateRun(fF(b, c, d), 0x6b901122, bytes_to_int32(databytes, ptr + 48), 7)
            updateRun(fF(b, c, d), 0xfd987193, bytes_to_int32(databytes, ptr + 52), 12)
            updateRun(fF(b, c, d), 0xa679438e, bytes_to_int32(databytes, ptr + 56), 17)
            updateRun(fF(b, c, d), 0x49b40821, bytes_to_int32(databytes, ptr + 60), 22)
            updateRun(fG(b, c, d), 0xf61e2562, bytes_to_int32(databytes, ptr + 4), 5)
            updateRun(fG(b, c, d), 0xc040b340, bytes_to_int32(databytes, ptr + 24), 9)
            updateRun(fG(b, c, d), 0x265e5a51, bytes_to_int32(databytes, ptr + 44), 14)
            updateRun(fG(b, c, d), 0xe9b6c7aa, bytes_to_int32(databytes, ptr), 20)
            updateRun(fG(b, c, d), 0xd62f105d, bytes_to_int32(databytes, ptr + 20), 5)
            updateRun(fG(b, c, d), 0x2441453, bytes_to_int32(databytes, ptr + 40), 9)
            updateRun(fG(b, c, d), 0xd8a1e681, bytes_to_int32(databytes, ptr + 60), 14)
            updateRun(fG(b, c, d), 0xe7d3fbc8, bytes_to_int32(databytes, ptr + 16), 20)
            updateRun(fG(b, c, d), 0x21e1cde6, bytes_to_int32(databytes, ptr + 36), 5)
            updateRun(fG(b, c, d), 0xc33707d6, bytes_to_int32(databytes, ptr + 56), 9)
            updateRun(fG(b, c, d), 0xf4d50d87, bytes_to_int32(databytes, ptr + 12), 14)
            updateRun(fG(b, c, d), 0x455a14ed, bytes_to_int32(databytes, ptr + 32), 20)
            updateRun(fG(b, c, d), 0xa9e3e905, bytes_to_int32(databytes, ptr + 52), 5)
            updateRun(fG(b, c, d), 0xfcefa3f8, bytes_to_int32(databytes, ptr + 8), 9)
            updateRun(fG(b, c, d), 0x676f02d9, bytes_to_int32(databytes, ptr + 28), 14)
            updateRun(fG(b, c, d), 0x8d2a4c8a, bytes_to_int32(databytes, ptr + 48), 20)
            updateRun(fH(b, c, d), 0xfffa3942, bytes_to_int32(databytes, ptr + 20), 4)
            updateRun(fH(b, c, d), 0x8771f681, bytes_to_int32(databytes, ptr + 32), 11)
            updateRun(fH(b, c, d), 0x6d9d6122, bytes_to_int32(databytes, ptr + 44), 16)
            updateRun(fH(b, c, d), 0xfde5380c, bytes_to_int32(databytes, ptr + 56), 23)
            updateRun(fH(b, c, d), 0xa4beea44, bytes_to_int32(databytes, ptr + 4), 4)
            updateRun(fH(b, c, d), 0x4bdecfa9, bytes_to_int32(databytes, ptr + 16), 11)
            updateRun(fH(b, c, d), 0xf6bb4b60, bytes_to_int32(databytes, ptr + 28), 16)
            updateRun(fH(b, c, d), 0xbebfbc70, bytes_to_int32(databytes, ptr + 40), 23)
            updateRun(fH(b, c, d), 0x289b7ec6, bytes_to_int32(databytes, ptr + 52), 4)
            updateRun(fH(b, c, d), 0xeaa127fa, bytes_to_int32(databytes, ptr), 11)
            updateRun(fH(b, c, d), 0xd4ef3085, bytes_to_int32(databytes, ptr + 12), 16)
            updateRun(fH(b, c, d), 0x4881d05, bytes_to_int32(databytes, ptr + 24), 23)
            updateRun(fH(b, c, d), 0xd9d4d039, bytes_to_int32(databytes, ptr + 36), 4)
            updateRun(fH(b, c, d), 0xe6db99e5, bytes_to_int32(databytes, ptr + 48), 11)
            updateRun(fH(b, c, d), 0x1fa27cf8, bytes_to_int32(databytes, ptr + 60), 16)
            updateRun(fH(b, c, d), 0xc4ac5665, bytes_to_int32(databytes, ptr + 8), 23)
            updateRun(fI(b, c, d), 0xf4292244, bytes_to_int32(databytes, ptr), 6)
            updateRun(fI(b, c, d), 0x432aff97, bytes_to_int32(databytes, ptr + 28), 10)
            updateRun(fI(b, c, d), 0xab9423a7, bytes_to_int32(databytes, ptr + 56), 15)
            updateRun(fI(b, c, d), 0xfc93a039, bytes_to_int32(databytes, ptr + 20), 21)
            updateRun(fI(b, c, d), 0x655b59c3, bytes_to_int32(databytes, ptr + 48), 6)
            updateRun(fI(b, c, d), 0x8f0ccc92, bytes_to_int32(databytes, ptr + 12), 10)
            updateRun(fI(b, c, d), 0xffeff47d, bytes_to_int32(databytes, ptr + 40), 15)
            updateRun(fI(b, c, d), 0x85845dd1, bytes_to_int32(databytes, ptr + 4), 21)
            updateRun(fI(b, c, d), 0x6fa87e4f, bytes_to_int32(databytes, ptr + 32), 6)
            updateRun(fI(b, c, d), 0xfe2ce6e0, bytes_to_int32(databytes, ptr + 60), 10)
            updateRun(fI(b, c, d), 0xa3014314, bytes_to_int32(databytes, ptr + 24), 15)
            updateRun(fI(b, c, d), 0x4e0811a1, bytes_to_int32(databytes, ptr + 52), 21)
            updateRun(fI(b, c, d), 0xf7537e82, bytes_to_int32(databytes, ptr + 16), 6)
            updateRun(fI(b, c, d), 0xbd3af235, bytes_to_int32(databytes, ptr + 44), 10)
            updateRun(fI(b, c, d), 0x2ad7d2bb, bytes_to_int32(databytes, ptr + 8), 15)
            updateRun(fI(b, c, d), 0xeb86d391, bytes_to_int32(databytes, ptr + 36), 21)

            // update buffers
            h0 = _add(h0, a)
            h1 = _add(h1, b)
            h2 = _add(h2, c)
            h3 = _add(h3, d)
        }
        // Done! Convert buffers to 128 bit (LE)
        return int128le_to_hex(h3, h2, h1, h0).toUpperCase()
    }
    
    
}


var base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
var base64DecodeChars = new Array(
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63,
    52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1,
    -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14,
    15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1,
    -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
    41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1);

function base64encode(str) {
    var out, i, len;
    var c1, c2, c3;

    len = str.length;
    i = 0;
    out = "";
    while(i < len) {
    c1 = str.charCodeAt(i++) & 0xff;
    if(i == len)
    {
        out += base64EncodeChars.charAt(c1 >> 2);
        out += base64EncodeChars.charAt((c1 & 0x3) << 4);
        out += "==";
        break;
    }
    c2 = str.charCodeAt(i++);
    if(i == len)
    {
        out += base64EncodeChars.charAt(c1 >> 2);
        out += base64EncodeChars.charAt(((c1 & 0x3)<< 4) | ((c2 & 0xF0) >> 4));
        out += base64EncodeChars.charAt((c2 & 0xF) << 2);
        out += "=";
        break;
    }
    c3 = str.charCodeAt(i++);
    out += base64EncodeChars.charAt(c1 >> 2);
    out += base64EncodeChars.charAt(((c1 & 0x3)<< 4) | ((c2 & 0xF0) >> 4));
    out += base64EncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >>6));
    out += base64EncodeChars.charAt(c3 & 0x3F);
    }
    return out;
}

function base64decode(str) {
    var c1, c2, c3, c4;
    var i, len, out;

    len = str.length;
    i = 0;
    out = "";
    while(i < len) {
    /* c1 */
    do {
        c1 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
    } while(i < len && c1 == -1);
    if(c1 == -1)
        break;

    /* c2 */
    do {
        c2 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
    } while(i < len && c2 == -1);
    if(c2 == -1)
        break;

    out += String.fromCharCode((c1 << 2) | ((c2 & 0x30) >> 4));

    /* c3 */
    do {
        c3 = str.charCodeAt(i++) & 0xff;
        if(c3 == 61)
        return out;
        c3 = base64DecodeChars[c3];
    } while(i < len && c3 == -1);
    if(c3 == -1)
        break;

    out += String.fromCharCode(((c2 & 0XF) << 4) | ((c3 & 0x3C) >> 2));

    /* c4 */
    do {
        c4 = str.charCodeAt(i++) & 0xff;
        if(c4 == 61)
        return out;
        c4 = base64DecodeChars[c4];
    } while(i < len && c4 == -1);
    if(c4 == -1)
        break;
    out += String.fromCharCode(((c3 & 0x03) << 6) | c4);
    }
    return out;
}

function utf16to8(str) {
    var out, i, len, c;

    out = "";
    len = str.length;
    for(i = 0; i < len; i++) {
    c = str.charCodeAt(i);
    if ((c >= 0x0001) && (c <= 0x007F)) {
        out += str.charAt(i);
    } else if (c > 0x07FF) {
        out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
        out += String.fromCharCode(0x80 | ((c >> 6) & 0x3F));
        out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
    } else {
        out += String.fromCharCode(0xC0 | ((c >> 6) & 0x1F));
        out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
    }
    }
    return out;
}

function utf8to16(str) {
    var out, i, len, c;
    var char2, char3;

    out = "";
    len = str.length;
    i = 0;
    while(i < len) {
    c = str.charCodeAt(i++);
    switch(c >> 4)
    {
      case 0: case 1: case 2: case 3: case 4: case 5: case 6: case 7:
        // 0xxxxxxx
        out += str.charAt(i-1);
        break;
      case 12: case 13:
        // 110x xxxx 10xx xxxx
        char2 = str.charCodeAt(i++);
        out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
        break;
      case 14:
        // 1110 xxxx 10xx xxxx 10xx xxxx
        char2 = str.charCodeAt(i++);
        char3 = str.charCodeAt(i++);
        out += String.fromCharCode(((c & 0x0F) << 12) |
                       ((char2 & 0x3F) << 6) |
                       ((char3 & 0x3F) << 0));
        break;
    }
    }

    return out;
}
