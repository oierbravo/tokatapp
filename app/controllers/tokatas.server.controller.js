'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Tokata = mongoose.model('Tokata'),
	_ = require('lodash');

/**
 * Create a Tokata
 */
exports.create = function(req, res) {
	var tokata = new Tokata(req.body);
	tokata.user = req.user;
	tokata.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(tokata);
		}
	});
};

/**
 * Show the current Tokata
 */
exports.read = function(req, res) {
	res.jsonp(req.tokata);
};

/**
 * Update a Tokata
 */
exports.update = function(req, res) {
	var tokata = req.tokata ;

	tokata = _.extend(tokata , req.body);

	tokata.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(tokata);
		}
	});
};

/**
 * Delete an Tokata
 */
exports.delete = function(req, res) {
	var tokata = req.tokata ;

	tokata.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(tokata);
		}
	});
};

/**
 * List of Tokatas
 */
exports.list = function(req, res) { 
	Tokata.find().sort('-created').populate('user', 'displayName').exec(function(err, tokatas) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(tokatas);
		}
	});
};

/**
 * Tokata middleware
 */
exports.tokataByID = function(req, res, next, id) { 
	Tokata.findById(id).populate('user', 'displayName').exec(function(err, tokata) {
		if (err) return next(err);
		if (! tokata) return next(new Error('Failed to load Tokata ' + id));
		req.tokata = tokata ;
		next();
	});
};

/**
 * Tokata authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.tokata.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
