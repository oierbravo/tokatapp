'use strict';

//Tokatas service used to communicate Tokatas REST endpoints
angular.module('tokatas').factory('Tokatas', ['$resource',
	function($resource) {
		return $resource('tokatas/:tokataId', { tokataId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);