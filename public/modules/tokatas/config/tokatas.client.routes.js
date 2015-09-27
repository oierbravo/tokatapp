'use strict';

//Setting up route
angular.module('tokatas').config(['$stateProvider',
	function($stateProvider) {
		// Tokatas state routing
		$stateProvider.
		state('listTokatas', {
			url: '/tokatas',
			templateUrl: 'modules/tokatas/views/list-tokatas.client.view.html'
		}).
		state('createTokata', {
			url: '/tokatas/create',
			templateUrl: 'modules/tokatas/views/create-tokata.client.view.html'
		}).
		state('viewTokata', {
			url: '/tokatas/:tokataId',
			templateUrl: 'modules/tokatas/views/view-tokata.client.view.html'
		}).
		state('editTokata', {
			url: '/tokatas/:tokataId/edit',
			templateUrl: 'modules/tokatas/views/edit-tokata.client.view.html'
		});
	}
]);