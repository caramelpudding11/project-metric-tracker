require('dotenv').config();
let express = require('express');
let mongoose = require('mongoose');
let cors = require('cors');
let bodyParser = require('body-parser');
let dbConfig = require('./database/db');
const db = require("./models");
const Role = db.role;

const app = express();
app.use(bodyParser.urlencoded({ extended: true }))

app.use(bodyParser.json())
require('./routes/auth.route')(app);

var corsOptions = {
  origin: "http://localhost:3000"
};
app.use(cors(corsOptions));
// parse requests of content-type - application/json
app.use(express.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
// set port, listen for requests
const host=process.env.HOST_URL;
const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
// Express Route

const detailRoute = require('./routes/details.route')
const activityRoute = require('./routes/activity.route')
const projectRoute = require('./routes/project.route')
const feedbackRoute = require('./routes/feedback.route')

// Connecting mongoDB Database
mongoose.Promise = global.Promise;
mongoose.connect(dbConfig.db, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Database sucessfully connected!')
},
  error => {
    console.log('Could not connect to database : ' + error)
  }
)

function initital(){
  Role.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      new Role({
        name: "user"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }
        console.log("added 'user' to roles collection");
      });
      new Role({
        name: "manager"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }
        console.log("added 'manager' to roles collection");
      });
      new Role({
        name: "admin"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }
        console.log("added 'admin' to roles collection");
      });
    }
  });
}

app.use(cors());
app.use('/details', detailRoute)
app.use('/activity', activityRoute)
app.use('/project',projectRoute)
app.use('/feedback',feedbackRoute)

initital();
// PORT

app.use(function (err, req, res, next) {
  console.error(err.message);
  if (!err.statusCode) err.statusCode = 500;
  res.status(err.statusCode).send(err.message);
});
