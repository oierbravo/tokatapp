'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Batukide = mongoose.model('Batukide'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, batukide;

/**
 * Batukide routes tests
 */
describe('Batukide CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Batukide
		user.save(function() {
			batukide = {
				name: 'Batukide Name'
			};

			done();
		});
	});

	it('should be able to save Batukide instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Batukide
				agent.post('/batukides')
					.send(batukide)
					.expect(200)
					.end(function(batukideSaveErr, batukideSaveRes) {
						// Handle Batukide save error
						if (batukideSaveErr) done(batukideSaveErr);

						// Get a list of Batukides
						agent.get('/batukides')
							.end(function(batukidesGetErr, batukidesGetRes) {
								// Handle Batukide save error
								if (batukidesGetErr) done(batukidesGetErr);

								// Get Batukides list
								var batukides = batukidesGetRes.body;

								// Set assertions
								(batukides[0].user._id).should.equal(userId);
								(batukides[0].name).should.match('Batukide Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Batukide instance if not logged in', function(done) {
		agent.post('/batukides')
			.send(batukide)
			.expect(401)
			.end(function(batukideSaveErr, batukideSaveRes) {
				// Call the assertion callback
				done(batukideSaveErr);
			});
	});

	it('should not be able to save Batukide instance if no name is provided', function(done) {
		// Invalidate name field
		batukide.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Batukide
				agent.post('/batukides')
					.send(batukide)
					.expect(400)
					.end(function(batukideSaveErr, batukideSaveRes) {
						// Set message assertion
						(batukideSaveRes.body.message).should.match('Please fill Batukide name');
						
						// Handle Batukide save error
						done(batukideSaveErr);
					});
			});
	});

	it('should be able to update Batukide instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Batukide
				agent.post('/batukides')
					.send(batukide)
					.expect(200)
					.end(function(batukideSaveErr, batukideSaveRes) {
						// Handle Batukide save error
						if (batukideSaveErr) done(batukideSaveErr);

						// Update Batukide name
						batukide.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Batukide
						agent.put('/batukides/' + batukideSaveRes.body._id)
							.send(batukide)
							.expect(200)
							.end(function(batukideUpdateErr, batukideUpdateRes) {
								// Handle Batukide update error
								if (batukideUpdateErr) done(batukideUpdateErr);

								// Set assertions
								(batukideUpdateRes.body._id).should.equal(batukideSaveRes.body._id);
								(batukideUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Batukides if not signed in', function(done) {
		// Create new Batukide model instance
		var batukideObj = new Batukide(batukide);

		// Save the Batukide
		batukideObj.save(function() {
			// Request Batukides
			request(app).get('/batukides')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Batukide if not signed in', function(done) {
		// Create new Batukide model instance
		var batukideObj = new Batukide(batukide);

		// Save the Batukide
		batukideObj.save(function() {
			request(app).get('/batukides/' + batukideObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', batukide.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Batukide instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Batukide
				agent.post('/batukides')
					.send(batukide)
					.expect(200)
					.end(function(batukideSaveErr, batukideSaveRes) {
						// Handle Batukide save error
						if (batukideSaveErr) done(batukideSaveErr);

						// Delete existing Batukide
						agent.delete('/batukides/' + batukideSaveRes.body._id)
							.send(batukide)
							.expect(200)
							.end(function(batukideDeleteErr, batukideDeleteRes) {
								// Handle Batukide error error
								if (batukideDeleteErr) done(batukideDeleteErr);

								// Set assertions
								(batukideDeleteRes.body._id).should.equal(batukideSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Batukide instance if not signed in', function(done) {
		// Set Batukide user 
		batukide.user = user;

		// Create new Batukide model instance
		var batukideObj = new Batukide(batukide);

		// Save the Batukide
		batukideObj.save(function() {
			// Try deleting Batukide
			request(app).delete('/batukides/' + batukideObj._id)
			.expect(401)
			.end(function(batukideDeleteErr, batukideDeleteRes) {
				// Set message assertion
				(batukideDeleteRes.body.message).should.match('User is not logged in');

				// Handle Batukide error error
				done(batukideDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Batukide.remove().exec();
		done();
	});
});