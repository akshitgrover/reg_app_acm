var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

var db = require('mongoose');
var app = express();
var multipart = require('connect-multiparty');

var Events  = require('./controllers/events.js');
var User = require('./controllers/user.js');

var tokenAuth = require('./policies/tokenAuth.js');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(multipart());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({secret:'deathadder',saveUninitialized:true,resave:true}));

app.route('/get').get(tokenAuth);
app.route('/events/create').post(tokenAuth);
app.route('/events/addfield').post(tokenAuth);
app.route('/events/delete').post(tokenAuth);

app.use('/events',Events);
app.use('/user',User);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

db.connect('mongodb://Deathadder:1516@ds237855.mlab.com:37855/reg_app_acm',function(err,db){
		if(err){
			console.log("Couldn't Connect To MongoDb.");
			return err;
		}
		return db;
});

module.exports = app;
