'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Tokata Schema
 */
var TokataSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Tokata name',
		trim: true
	},
	place: {
		type: String,
		default: '',
		required: 'Please fill the place',
		trim: true
	},
	date: {
		type: String,
		default: '',
		required: 'Please fill the date',
		trim: true
	},
	hour: {
		type: String,
		default: '',
		trim: true
	},
	notes: {
		type: String,
		default: '',
		trim: true
	},
	batukides: {
		type: Array,
		default: []
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

mongoose.model('Tokata', TokataSchema);