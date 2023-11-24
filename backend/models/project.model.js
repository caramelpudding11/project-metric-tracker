const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let project = new Schema({
    p_code: {
        type: String
    },
    p_name: {
        type: String
    }
},
    {
        collection: 'project'
    })

module.exports = mongoose.model("project", project)
