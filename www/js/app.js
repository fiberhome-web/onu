'use strict';
var app = angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'ngCordova'])

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
        templateUrl: 'templates/login.html',
        controller: 'LoginCtrl'
    })

    // setup an abstract state for the tabs directive
    .state('tab', {
        url: '/tab',
        abstract: true,
        templateUrl: 'templates/tabs.html'
    })

    // Each tab has its own nav history stack:

    .state('tab.basic', {
        url: '/basic',
        views: {
            'tab-basic': {
                templateUrl: 'templates/tab-basic.html',
                controller: 'BasicCtrl'
            }
        }
    })

    .state('tab.check', {
        url: '/check?:checkStatus',
        views: {
            'tab-check': {
                templateUrl: 'templates/tab-check.html',
                controller: 'CheckCtrl'
            }
        }
    })


    .state('tab.detail', {
        url: '/check/detail',
        views: {
            'tab-check': {
                templateUrl: 'templates/tab-voice-detail.html',
                controller: 'VoiceDetailCtrl'
            }
        }
    })



    .state('tab.history', {
        url: '/history',
        views: {
            'tab-history': {
                templateUrl: 'templates/tab-history.html',
                controller: 'HistoryCtrl'
            }
        }
    })

    .state('tab.report-detail', {
        url: '/history/:reportId?:reportStatus',
        views: {
            'tab-history': {
                templateUrl: 'templates/report-detail.html',
                controller: 'ReportDetailCtrl'
            }
        }
    })

    .state('tab.setting', {
        url: '/setting',
        views: {
            'tab-setting': {
                templateUrl: 'templates/tab-setting.html',
                controller: 'SettingCtrl'
            }
        }
    });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/');

});
