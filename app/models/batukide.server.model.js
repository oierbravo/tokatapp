'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Batukide Schema
 */
var BatukideSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Batukide name',
		trim: true
	},
	email: {
		type: String,
		default: '',
		trim: true
	},
	tlf: {
		type: String,
		default: '',
		required: 'Please fill Batukide telephon number',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Batukide', BatukideSchema);