'use strict';

(function() {
	// Tokatas Controller Spec
	describe('Tokatas Controller Tests', function() {
		// Initialize global variables
		var TokatasController,
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

			// Initialize the Tokatas controller.
			TokatasController = $controller('TokatasController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Tokata object fetched from XHR', inject(function(Tokatas) {
			// Create sample Tokata using the Tokatas service
			var sampleTokata = new Tokatas({
				name: 'New Tokata'
			});

			// Create a sample Tokatas array that includes the new Tokata
			var sampleTokatas = [sampleTokata];

			// Set GET response
			$httpBackend.expectGET('tokatas').respond(sampleTokatas);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.tokatas).toEqualData(sampleTokatas);
		}));

		it('$scope.findOne() should create an array with one Tokata object fetched from XHR using a tokataId URL parameter', inject(function(Tokatas) {
			// Define a sample Tokata object
			var sampleTokata = new Tokatas({
				name: 'New Tokata'
			});

			// Set the URL parameter
			$stateParams.tokataId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/tokatas\/([0-9a-fA-F]{24})$/).respond(sampleTokata);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.tokata).toEqualData(sampleTokata);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Tokatas) {
			// Create a sample Tokata object
			var sampleTokataPostData = new Tokatas({
				name: 'New Tokata'
			});

			// Create a sample Tokata response
			var sampleTokataResponse = new Tokatas({
				_id: '525cf20451979dea2c000001',
				name: 'New Tokata'
			});

			// Fixture mock form input values
			scope.name = 'New Tokata';

			// Set POST response
			$httpBackend.expectPOST('tokatas', sampleTokataPostData).respond(sampleTokataResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Tokata was created
			expect($location.path()).toBe('/tokatas/' + sampleTokataResponse._id);
		}));

		it('$scope.update() should update a valid Tokata', inject(function(Tokatas) {
			// Define a sample Tokata put data
			var sampleTokataPutData = new Tokatas({
				_id: '525cf20451979dea2c000001',
				name: 'New Tokata'
			});

			// Mock Tokata in scope
			scope.tokata = sampleTokataPutData;

			// Set PUT response
			$httpBackend.expectPUT(/tokatas\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/tokatas/' + sampleTokataPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid tokataId and remove the Tokata from the scope', inject(function(Tokatas) {
			// Create new Tokata object
			var sampleTokata = new Tokatas({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Tokatas array and include the Tokata
			scope.tokatas = [sampleTokata];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/tokatas\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleTokata);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.tokatas.length).toBe(0);
		}));
	});
}());