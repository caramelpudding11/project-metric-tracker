express = require('express'),
  feedbackRouter = express.Router();

// Details Model
let Feedback = require('../models/feedback.model');

// Add details
feedbackRouter.route('/addFeedback').post((req, res, next) => {
  Feedback.create(req.body, (error, data) => {
    if (error) {
      return next(error)
    } else {
      console.log(data)
      res.json(data)
    }
  })
});

module.exports = feedbackRouter;