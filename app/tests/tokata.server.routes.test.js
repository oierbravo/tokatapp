'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Tokata = mongoose.model('Tokata'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, tokata;

/**
 * Tokata routes tests
 */
describe('Tokata CRUD tests', function() {
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

		// Save a user to the test db and create new Tokata
		user.save(function() {
			tokata = {
				name: 'Tokata Name'
			};

			done();
		});
	});

	it('should be able to save Tokata instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Tokata
				agent.post('/tokatas')
					.send(tokata)
					.expect(200)
					.end(function(tokataSaveErr, tokataSaveRes) {
						// Handle Tokata save error
						if (tokataSaveErr) done(tokataSaveErr);

						// Get a list of Tokatas
						agent.get('/tokatas')
							.end(function(tokatasGetErr, tokatasGetRes) {
								// Handle Tokata save error
								if (tokatasGetErr) done(tokatasGetErr);

								// Get Tokatas list
								var tokatas = tokatasGetRes.body;

								// Set assertions
								(tokatas[0].user._id).should.equal(userId);
								(tokatas[0].name).should.match('Tokata Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Tokata instance if not logged in', function(done) {
		agent.post('/tokatas')
			.send(tokata)
			.expect(401)
			.end(function(tokataSaveErr, tokataSaveRes) {
				// Call the assertion callback
				done(tokataSaveErr);
			});
	});

	it('should not be able to save Tokata instance if no name is provided', function(done) {
		// Invalidate name field
		tokata.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Tokata
				agent.post('/tokatas')
					.send(tokata)
					.expect(400)
					.end(function(tokataSaveErr, tokataSaveRes) {
						// Set message assertion
						(tokataSaveRes.body.message).should.match('Please fill Tokata name');
						
						// Handle Tokata save error
						done(tokataSaveErr);
					});
			});
	});

	it('should be able to update Tokata instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Tokata
				agent.post('/tokatas')
					.send(tokata)
					.expect(200)
					.end(function(tokataSaveErr, tokataSaveRes) {
						// Handle Tokata save error
						if (tokataSaveErr) done(tokataSaveErr);

						// Update Tokata name
						tokata.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Tokata
						agent.put('/tokatas/' + tokataSaveRes.body._id)
							.send(tokata)
							.expect(200)
							.end(function(tokataUpdateErr, tokataUpdateRes) {
								// Handle Tokata update error
								if (tokataUpdateErr) done(tokataUpdateErr);

								// Set assertions
								(tokataUpdateRes.body._id).should.equal(tokataSaveRes.body._id);
								(tokataUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Tokatas if not signed in', function(done) {
		// Create new Tokata model instance
		var tokataObj = new Tokata(tokata);

		// Save the Tokata
		tokataObj.save(function() {
			// Request Tokatas
			request(app).get('/tokatas')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Tokata if not signed in', function(done) {
		// Create new Tokata model instance
		var tokataObj = new Tokata(tokata);

		// Save the Tokata
		tokataObj.save(function() {
			request(app).get('/tokatas/' + tokataObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', tokata.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Tokata instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Tokata
				agent.post('/tokatas')
					.send(tokata)
					.expect(200)
					.end(function(tokataSaveErr, tokataSaveRes) {
						// Handle Tokata save error
						if (tokataSaveErr) done(tokataSaveErr);

						// Delete existing Tokata
						agent.delete('/tokatas/' + tokataSaveRes.body._id)
							.send(tokata)
							.expect(200)
							.end(function(tokataDeleteErr, tokataDeleteRes) {
								// Handle Tokata error error
								if (tokataDeleteErr) done(tokataDeleteErr);

								// Set assertions
								(tokataDeleteRes.body._id).should.equal(tokataSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Tokata instance if not signed in', function(done) {
		// Set Tokata user 
		tokata.user = user;

		// Create new Tokata model instance
		var tokataObj = new Tokata(tokata);

		// Save the Tokata
		tokataObj.save(function() {
			// Try deleting Tokata
			request(app).delete('/tokatas/' + tokataObj._id)
			.expect(401)
			.end(function(tokataDeleteErr, tokataDeleteRes) {
				// Set message assertion
				(tokataDeleteRes.body.message).should.match('User is not logged in');

				// Handle Tokata error error
				done(tokataDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Tokata.remove().exec();
		done();
	});
});