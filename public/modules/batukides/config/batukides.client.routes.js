'use strict';

//Setting up route
angular.module('batukides').config(['$stateProvider',
	function($stateProvider) {
		// Batukides state routing
		$stateProvider.
		state('listBatukides', {
			url: '/batukides',
			templateUrl: 'modules/batukides/views/list-batukides.client.view.html'
		}).
		state('createBatukide', {
			url: '/batukides/create',
			templateUrl: 'modules/batukides/views/create-batukide.client.view.html'
		}).
		state('viewBatukide', {
			url: '/batukides/:batukideId',
			templateUrl: 'modules/batukides/views/view-batukide.client.view.html'
		}).
		state('editBatukide', {
			url: '/batukides/:batukideId/edit',
			templateUrl: 'modules/batukides/views/edit-batukide.client.view.html'
		});
	}
]);