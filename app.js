require('dotenv').config()

let express = require('express')
let bodyParser = require('body-parser')
let morgan = require('morgan')
let app = express()

//Set up mongoose connection var dbLocal = "mongodb://127.0.0.1/tarea1";
let mongoose = require('mongoose')
mongoose.Promise = global.Promise
let mongoDB = process.env.MONGO_DB
let promise = mongoose.connect(mongoDB, {
  useMongoClient: true
})
promise.then(function (db) {
  var database = mongoose.connection
  database.on('error', console.error.bind(console, 'MongoDB connection error:'))
})

// Configure application
app.set('port', (process.env.PORT || 5000))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}))
app.use(bodyParser.text())
app.use(bodyParser.json({
  type: 'application/json'
}))

//don't show the log when it is test
if (process.env.NODE_ENV !== 'test') {
  //use morgan to log at command line
  app.use(morgan('dev'))
}

// Configure routes
var index = require('./routes/routes');
app.use('/', index);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req
    .app
    .get('env') === 'development' ?
    err : {};

  // render the error page
  res.status(err.status || 500);
  res.send('error');
});

app.listen(app.get('port'), () => {
  console.log('Node app is running on port', app.get('port'))
  const emailListener = require('./config/emailListener')
})

module.exports = app // for testing