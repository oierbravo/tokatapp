'use strict';

// Tokatas controller
angular.module('tokatas').controller('TokatasController', ['$scope', '$stateParams', '$location', 'Authentication', 'Tokatas','Batukides',
	function($scope, $stateParams, $location, Authentication, Tokatas,Batukides) {
		$scope.authentication = Authentication;
		$scope.batukides = Batukides.query();
		$scope.predicate = 'status';
      $scope.reverse = true;
      $scope.order = function(predicate) {
        $scope.reverse = ($scope.predicate === predicate) ? !$scope.reverse : false;
        $scope.predicate = predicate;
      };
		// Create new Tokata
		$scope.create = function() {
			// Filter those with status
			var batukides = _.filter($scope.batukides,'status');
			// Create new Tokata object
			var tokata = new Tokatas ({
				name: this.name,
				place: this.place,
				date: this.date,
				hour: this.hour,
				notes: this.notes,
				batukides: batukides
			});
			
			// Redirect after save
			tokata.$save(function(response) {
				$location.path('tokatas/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Tokata
		$scope.remove = function(tokata) {
			if ( tokata ) { 
				tokata.$remove();

				for (var i in $scope.tokatas) {
					if ($scope.tokatas [i] === tokata) {
						$scope.tokatas.splice(i, 1);
					}
				}
			} else {
				$scope.tokata.$remove(function() {
					$location.path('tokatas');
				});
			}
		};

		// Update existing Tokata
		$scope.update = function() {
			var tokata = $scope.tokata;

			tokata.$update(function() {
				$location.path('tokatas/' + tokata._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Tokatas
		$scope.find = function() {
			$scope.tokatas = Tokatas.query();
		};

		// Find existing Tokata
		$scope.findOne = function() {
			$scope.tokata = Tokatas.get({ 
				tokataId: $stateParams.tokataId
			});
		};
		
	}
]);