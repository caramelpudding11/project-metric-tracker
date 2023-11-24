const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let feedback = new Schema({
    date: {
        type: String
    },
    subject: {
        type: String
    },
    message: {
        type: String
    }
},
    {
        collection: 'feedback'
    })

module.exports = mongoose.model("feedback", feedback)
