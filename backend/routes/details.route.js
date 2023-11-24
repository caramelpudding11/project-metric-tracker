
express = require('express'),
  detailRouter = express.Router();

const { Router } = require('express');


// Details Model
let Details = require('../models/details');

// Add details
detailRouter.route('/addDetails').post((req, res, next) => {
  Details.create(req.body, (error, data) => {
    if (error) {
      return next(error)
    } else {
      console.log(data)
      res.json(data)
    }
  })
});

// Update details
detailRouter.route('/editDetails/:id/approval').post((req, res, next) => {
  Details.findByIdAndUpdate(req.params.id, { approved: true }, (error, data) => {
    if (error) return next(error);
    res.json(data);
  });
});

// Get Details
detailRouter.route('/').get((req, res) => {
  Details.find((error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
});

// Get details based on selection of particular date
detailRouter.route('/detailList').post((req, res, next) => {
  if (req.body.roles == "USER") {
    Details.find({ date: req.body.date, userName: req.body.userName }, (error, data) => {
      if (error) {
        return next(error)
      } else {
        let result = {
          state: 'SUCCESS',
          response: data
        };
        res.json(result)
      }
    })
  }
  else if (req.body.roles == "ADMIN") {
    Details.find({ date: req.body.date }, (error, data) => {
      if (error) {
        return next(error)
      } else {
        let result = {
          state: 'SUCCESS',
          response: data
        };
        res.json(result)
      }
    })
  }
  else if (req.body.roles == "MANAGER") {
    Details.find({ date: req.body.date, project: req.body.project }, (error, data) => {
      if (error) {
        return next(error)
      } else {
        let result = {
          state: 'SUCCESS',
          response: data.filter(detail => !detail.approved)
        };
        res.json(result)
      }
    })
  }
});


module.exports = detailRouter;