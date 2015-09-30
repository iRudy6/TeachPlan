'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Person = mongoose.model('Person'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create a person
 */
exports.create = function (req, res) {
  var person = new Person(req.body);
  person.user = req.user;
  
  person.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(person);
    }
  });
};

/**
 * Show the current person
 */
exports.read = function (req, res) {
  res.json(req.person);
};

/**
 * Update a person
 */
exports.update = function (req, res) {
  var person = req.person;

  person.firstname = req.body.firstname;
  person.lastname = req.body.lastname;
  person.genre = req.body.genre;
  person.groups = req.body.groups;
  
  person.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(person);
    }
  });
};

/**
 * Delete an person
 */
exports.delete = function (req, res) {
  var person = req.person;

  person.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(person);
    }
  });
};

/**
 * List of people
 */
exports.list = function (req, res) {
  Person.find().sort('-created').populate('user', 'displayName').exec(function (err, people) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(people);
    }
  });
};

/**
 * group middleware
 */
exports.personByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'person is invalid'
    });
  }

  Person.findById(id).populate('user', 'displayName').exec(function (err, person) {
    if (err) {
      return next(err);
    } else if (!person) {
      return res.status(404).send({
        message: 'No person with that identifier has been found'
      });
    }
    req.person = person;
    next();
  });
};


exports.findByGroupID = function(req, res, next, id) { 
  console.log('inside findByGroupID');
  Person.find({'groups' : {'$in' : [id]} }).populate('user', 'displayName').exec(function(err, people) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(people);
    }
  });
};
