const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const db = {};
db.mongoose = mongoose;
db.user = require('./user.models');
db.role = require('./role.model');
db.ROLES = ["user", "admin", "manager"];
module.exports = db;