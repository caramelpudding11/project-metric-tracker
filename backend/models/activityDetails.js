const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let activity = new Schema({
    code: {
        type: String
    },
    detail: {
        type: String
    }
},
    {
        collection: 'activity'
    })

module.exports = mongoose.model("activity", activity)
