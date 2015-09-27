'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var batukides = require('../../app/controllers/batukides.server.controller');

	// Batukides Routes
	app.route('/batukides')
		.get(batukides.list)
		.post(users.requiresLogin, batukides.create);

	app.route('/batukides/:batukideId')
		.get(batukides.read)
		.put(users.requiresLogin, batukides.hasAuthorization, batukides.update)
		.delete(users.requiresLogin, batukides.hasAuthorization, batukides.delete);

	// Finish by binding the Batukide middleware
	app.param('batukideId', batukides.batukideByID);
};
