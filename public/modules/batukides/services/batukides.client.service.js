'use strict';

//Batukides service used to communicate Batukides REST endpoints
angular.module('batukides').factory('Batukides', ['$resource',
	function($resource) {
		return $resource('batukides/:batukideId', { batukideId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);