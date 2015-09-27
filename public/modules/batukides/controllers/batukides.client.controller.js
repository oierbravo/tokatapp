'use strict';

// Batukides controller
angular.module('batukides').controller('BatukidesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Batukides',
	function($scope, $stateParams, $location, Authentication, Batukides) {
		$scope.authentication = Authentication;

		// Create new Batukide
		$scope.create = function() {
			// Create new Batukide object
			var batukide = new Batukides ({
				name: this.name,
				email: this.email,
				tlf: this.tlf
			});

			// Redirect after save
			batukide.$save(function(response) {
				$location.path('batukides/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Batukide
		$scope.remove = function(batukide) {
			if ( batukide ) { 
				batukide.$remove();

				for (var i in $scope.batukides) {
					if ($scope.batukides [i] === batukide) {
						$scope.batukides.splice(i, 1);
					}
				}
			} else {
				$scope.batukide.$remove(function() {
					$location.path('batukides');
				});
			}
		};

		// Update existing Batukide
		$scope.update = function() {
			var batukide = $scope.batukide;

			batukide.$update(function() {
				$location.path('batukides/' + batukide._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Batukides
		$scope.find = function() {
			$scope.batukides = Batukides.query();
		};

		// Find existing Batukide
		$scope.findOne = function() {
			$scope.batukide = Batukides.get({ 
				batukideId: $stateParams.batukideId
			});
		};
	}
]);