'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Lesson = mongoose.model('Lesson'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create a group
 */
exports.create = function (req, res) {
  var lesson = new Lesson(req.body);
  lesson.user = req.user;
  
  lesson.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(lesson);
    }
  });
};

/**
 * Show the current group
 */
exports.read = function (req, res) {
  res.json(req.lesson);
};

/**
 * Update a group
 */
exports.update = function (req, res) {
  var lesson = req.lesson;

  lesson.name = req.body.name;
  lesson.students = req.body.students;

  lesson.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(lesson);
    }
  });
};

exports.updateStudent = function (req, res) {
  console.log(req.body);
  // var lesson = req.student;

  // lesson.name = req.body.name;

  // lesson.save(function (err) {
  //   if (err) {
  //     return res.status(400).send({
  //       message: errorHandler.getErrorMessage(err)
  //     });
  //   } else {
  //     res.json(lesson);
  //   }
  // });
};


/**
 * Delete an group
 */
exports.delete = function (req, res) {
  var lesson = req.lesson;

  lesson.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(lesson);
    }
  });
};

/**
 * List of groups
 */
exports.list = function (req, res) {
  Lesson.find().sort('-created').populate('user', 'displayName').exec(function (err, lessons) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(lessons);
    }
  });
};

/**
 * group middleware
 */
exports.lessonByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'lesson is invalid'
    });
  }

  Lesson.findById(id).populate('user', 'displayName').exec(function (err, lesson) {
    if (err) {
      return next(err);
    } else if (!lesson) {
      return res.status(404).send({
        message: 'No lesson with that identifier has been found'
      });
    }
    req.lesson = lesson;
    next();
  });
};
