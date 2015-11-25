
angular.module('starter.controllers')
	.controller('CheckDetailCtrl', function($scope,$state,$http,Chats,$stateParams) {

	$scope.chat = Chats.get($stateParams.itemId);
});