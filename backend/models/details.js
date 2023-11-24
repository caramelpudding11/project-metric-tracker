const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let details = new Schema({
    userName: {
        type: String
    },
    activity:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "activity"
    },
    description: {
        type: String
    },
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "project"
    },
    duration: {
        type: Number
    },
    date: {
        type: String
    },
    approved: {
        type: Boolean
    }
},
    {
        collection: 'details'
    })

module.exports = mongoose.model('details', details)
