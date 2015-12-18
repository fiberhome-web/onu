
var app = angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'ngCordova'])

//定义全局变量

var global = {
  //是否已经登陆
  isLogin : false
}

//使用mockjax替换ajax
Mock.mockjax(app);

app.run(function($ionicPlatform) {

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

    });

})

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
    //设置全屏显示
    ionic.Platform.fullScreen(true);
    //配置整个平台的ionic view缓存
    $ionicConfigProvider.views.maxCache(0);
    //配置android平台的缓存
    $ionicConfigProvider.platform.android.views.maxCache(0);
    //设置返回按钮的文字和图标
    $ionicConfigProvider.backButton.text('Go Back').icon('ion-chevron-left');
    //配置tabs统一显示在下部
    $ionicConfigProvider.tabs.position('bottom');


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
        url: '/check/:checkStatus',
        views: {
            'tab-check': {
                templateUrl: 'templates/tab-check.html',
                controller: 'CheckCtrl'
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
        url: '/history/:reportId',
        views: {
            'tab-history': {
                templateUrl: 'templates/report-detail.html',
                controller: 'ReportDetailCtrl'
            }
        }
    });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/');

});
