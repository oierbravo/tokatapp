'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Batukide = mongoose.model('Batukide'),
	_ = require('lodash');

/**
 * Create a Batukide
 */
exports.create = function(req, res) {
	var batukide = new Batukide(req.body);
	batukide.user = req.user;

	batukide.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(batukide);
		}
	});
};

/**
 * Show the current Batukide
 */
exports.read = function(req, res) {
	res.jsonp(req.batukide);
};

/**
 * Update a Batukide
 */
exports.update = function(req, res) {
	var batukide = req.batukide ;

	batukide = _.extend(batukide , req.body);

	batukide.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(batukide);
		}
	});
};

/**
 * Delete an Batukide
 */
exports.delete = function(req, res) {
	var batukide = req.batukide ;

	batukide.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(batukide);
		}
	});
};

/**
 * List of Batukides
 */
exports.list = function(req, res) { 
	Batukide.find().sort('-created').populate('user', 'displayName').exec(function(err, batukides) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(batukides);
		}
	});
};

/**
 * Batukide middleware
 */
exports.batukideByID = function(req, res, next, id) { 
	Batukide.findById(id).populate('user', 'displayName').exec(function(err, batukide) {
		if (err) return next(err);
		if (! batukide) return next(new Error('Failed to load Batukide ' + id));
		req.batukide = batukide ;
		next();
	});
};

/**
 * Batukide authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.batukide.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
