'use strict';

/**
 * Module dependencies.
 */
var lessonsPolicy = require('../policies/lessons.server.policy'),
  lessons = require('../controllers/lessons.server.controller');

module.exports = function (app) {
  // lessons collection routes
  app.route('/api/lessons').all(lessonsPolicy.isAllowed)
    .get(lessons.list)
    .post(lessons.create);

  // Single group routes
  app.route('/api/lessons/:lessonId').all(lessonsPolicy.isAllowed)
    .get(lessons.read)
    .put(lessons.update)
    .delete(lessons.delete);

  app.route('/api/lessons/student/:id')
    .put(lessons.updateStudent);

  // Finish by binding the group middleware
  app.param('lessonId', lessons.lessonByID);

};
