'use strict';

(function() {
	// Batukides Controller Spec
	describe('Batukides Controller Tests', function() {
		// Initialize global variables
		var BatukidesController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Batukides controller.
			BatukidesController = $controller('BatukidesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Batukide object fetched from XHR', inject(function(Batukides) {
			// Create sample Batukide using the Batukides service
			var sampleBatukide = new Batukides({
				name: 'New Batukide'
			});

			// Create a sample Batukides array that includes the new Batukide
			var sampleBatukides = [sampleBatukide];

			// Set GET response
			$httpBackend.expectGET('batukides').respond(sampleBatukides);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.batukides).toEqualData(sampleBatukides);
		}));

		it('$scope.findOne() should create an array with one Batukide object fetched from XHR using a batukideId URL parameter', inject(function(Batukides) {
			// Define a sample Batukide object
			var sampleBatukide = new Batukides({
				name: 'New Batukide'
			});

			// Set the URL parameter
			$stateParams.batukideId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/batukides\/([0-9a-fA-F]{24})$/).respond(sampleBatukide);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.batukide).toEqualData(sampleBatukide);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Batukides) {
			// Create a sample Batukide object
			var sampleBatukidePostData = new Batukides({
				name: 'New Batukide'
			});

			// Create a sample Batukide response
			var sampleBatukideResponse = new Batukides({
				_id: '525cf20451979dea2c000001',
				name: 'New Batukide'
			});

			// Fixture mock form input values
			scope.name = 'New Batukide';

			// Set POST response
			$httpBackend.expectPOST('batukides', sampleBatukidePostData).respond(sampleBatukideResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Batukide was created
			expect($location.path()).toBe('/batukides/' + sampleBatukideResponse._id);
		}));

		it('$scope.update() should update a valid Batukide', inject(function(Batukides) {
			// Define a sample Batukide put data
			var sampleBatukidePutData = new Batukides({
				_id: '525cf20451979dea2c000001',
				name: 'New Batukide'
			});

			// Mock Batukide in scope
			scope.batukide = sampleBatukidePutData;

			// Set PUT response
			$httpBackend.expectPUT(/batukides\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/batukides/' + sampleBatukidePutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid batukideId and remove the Batukide from the scope', inject(function(Batukides) {
			// Create new Batukide object
			var sampleBatukide = new Batukides({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Batukides array and include the Batukide
			scope.batukides = [sampleBatukide];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/batukides\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleBatukide);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.batukides.length).toBe(0);
		}));
	});
}());