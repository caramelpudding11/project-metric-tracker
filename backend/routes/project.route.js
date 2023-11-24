let mongoose = require('mongoose');
let express = require('express');
let projectRouter = express.Router();

let projectDetails = require('../models/project.model');

projectRouter.route('/addProject').post((req,res,next) => {
    projectDetails.create(req.body) ,(err,data) => {
        if(err)
        return next(err);
        else {
            console.log(data);
            res.json(data);
        }
    }
})

projectRouter.route('/').get((req, res) => {
    projectDetails.find((error, data) => {
        if (error) {
            return next(error)
        } else {
            res.json(data)
        }
    })
})

module.exports = projectRouter;
