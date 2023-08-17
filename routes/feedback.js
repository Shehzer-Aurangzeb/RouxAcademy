const express = require('express');

const router = express.Router();
const { check, validationResult } = require('express-validator');

const validate = [
  check('name').trim().isLength({ min: 3 }).escape().withMessage('Name is required'),
  check('email').isEmail().normalizeEmail().withMessage('A valid email address is required'),
  check('title').trim().isLength({ min: 3 }).escape().withMessage('Title is required'),
  check('message').trim().isLength({ min: 5 }).escape().withMessage('Message is required'),
];
module.exports = (feedbackService) => {
  router.get('/', async (request, response, next) => {
    try {
      const feedbacks = await feedbackService.getList();
      const errors = request.session.feedback ? request.session.feedback.errors : false;
      const successMessage = request.session.feedback ? request.session.feedback.message : false;
      //* resetting session
      request.session.feedback = {};
      return response.render('layout', {
        pageTitle: 'Feedback',
        template: 'feedback',
        feedbacks,
        errors,
        successMessage,
      });
    } catch (err) {
      return next(err);
    }
  });
  router.post('/', validate, async (request, response, next) => {
    try {
      const errors = validationResult(request);
      if (!errors.isEmpty()) {
        request.session.feedback = { errors: errors.array() };
        return response.redirect('/feedback');
      }
      const { name, title, message, email } = request.body;
      await feedbackService.addEntry(name, email, title, message);
      request.session.feedback = {
        message: 'Thank you for your feedback',
      };
      return response.redirect('/feedback');
    } catch (err) {
      return next(err);
    }
  });
  router.post('/api', validate, async (request, response, next) => {
    try {
      const errors = validationResult(request);
      if (!errors.isEmpty()) {
        return response.json({ errors: errors.array() });
      }
      const { name, title, email, message } = request.body;
      await feedbackService.addEntry(name, email, title, message);
      const feedbacks = await feedbackService.getList();
      return response.json({ feedbacks, successMessage: 'Thank you for your feedback' });
    } catch (error) {
      return next(error);
    }
  });

  return router;
};
