

let mongoose = require('mongoose'),
    express = require('express'),
    activityRouter = express.Router();

// Activity Model
let ActivityDetails = require('../models/activityDetails');

// Add activity details
activityRouter.route('/addActivity').post((req, res, next) => {
    ActivityDetails.create(req.body, (error, data) => {
        if (error) {
            return next(error)
        } else {
            console.log(data)
            res.json(data)
        }
    })
});


//Get activity details
activityRouter.route('/').get((req, res) => {
    ActivityDetails.find((error, data) => {
        if (error) {
            return next(error)
        } else {
            res.json(data)
        }
    })
})

module.exports = activityRouter;


