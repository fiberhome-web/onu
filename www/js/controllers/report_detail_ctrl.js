
angular.module('starter.controllers')
	.controller('ReportDetailCtrl', function($scope,$state,$http,Chats,$stateParams) {

	alert($stateParams.reportId);
});