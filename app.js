/*
GLORIA GALLEGO
MWA FINAL PROJECT
25-09-2017
*/

//======================================================
//===================1.DEPENDENCIES=====================//
//======================================================
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var jwt = require('express-jwt'); //JAVA WEB TOKEN
var jwks = require('jwks-rsa'); 
var cors = require('cors');

//======================================================
//=================2.INSTANTIATIONS=====================//
//======================================================

//database conection
var MongoClient = require('mongodb').MongoClient;
var dbUrl ="mongodb://sacc:sacc@ds149874.mlab.com:49874/sacc";

//routes
//var index = require('./routes/index');
//var users = require('./routes/users');
var animals = require('./routes/animals');


//INICIALIZATION
var app = express();

//======================================================
//===================3.CONFIGURATIONS====================//
//======================================================

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

var router = express.Router();

//======================================================
//===================4.MIDDLEWARE=========================//
//======================================================
// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(cors())
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


//======================================================
//===================5.ROUTES============================//
//======================================================


//Enabling CORS
app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");

  next();
});


//JWT 
var jwtCheck = jwt({
  secret: jwks.expressJwtSecret({
      cache: true,
      rateLimit: true,
      jwksRequestsPerMinute: 5,
      jwksUri: "https://edyluisrey.auth0.com/.well-known/jwks.json"
  }),
  audience: 'mwa',
  issuer: "https://edyluisrey.auth0.com/",
  algorithms: ['RS256']
});
app.use(jwtCheck);


//app.use('/', index);
//app.use('/users', users);

app.use('/api', animals);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});
//======================================================
//=============6.ERROR HANDLING==========================//
//======================================================
// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

//======================================================
//===================7.BOOTUP===========================//
//======================================================
MongoClient.connect(dbUrl,(err,db)=>{
	if(err) throw err;    
	app.locals.db = db;
    app.listen(8080, function() {
      console.log('Listening on port 8080');
    });    
});

module.exports = app;
