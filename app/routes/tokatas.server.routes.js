'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var tokatas = require('../../app/controllers/tokatas.server.controller');

	// Tokatas Routes
	app.route('/tokatas')
		.get(tokatas.list)
		.post(users.requiresLogin, tokatas.create);

	app.route('/tokatas/:tokataId')
		.get(tokatas.read)
		.put(users.requiresLogin, tokatas.hasAuthorization, tokatas.update)
		.delete(users.requiresLogin, tokatas.hasAuthorization, tokatas.delete);

	// Finish by binding the Tokata middleware
	app.param('tokataId', tokatas.tokataByID);
};
