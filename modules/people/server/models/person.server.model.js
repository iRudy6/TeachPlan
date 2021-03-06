'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;
//var Group = require('./group.server.model');

/**
 * A Validation function for local strategy properties
 */
var validateLocalStrategyProperty = function(property) {
  return ((this.provider !== 'local' && !this.updated) || property.length);
};

/**
 * Person Schema
 */
var PersonSchema = new Schema({
  firstname: {
    type: String,
    default: '',
    required: 'Please fill Person name',
    trim: true
  },
  lastname: {
    type: String,
    default: '',
    required: 'Please fill Person name',
    trim: true
  },
  email: {
    type: String,
    trim: true,
    default: '',
    validate: [validateLocalStrategyProperty, 'Please fill in your email'],
    match: [/.+\@.+\..+/, 'Please fill a valid email address']
  },
  genre: {
    type:String, 
    default: '',
    required:false
  },
  phone: {
    type:Number, 
    default: '',
    required:false
  },
  created: {
    type: Date,
    default: Date.now
  },
  groups: [{ type : Schema.ObjectId, ref: 'Group' }],
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Person', PersonSchema);
