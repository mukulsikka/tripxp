var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var favicon = require('serve-favicon');
var bodyParser =require('body-parser');
var expressValidator = require('express-validator');
var session = require('express-session');
var mongo = require('mongodb');
var passport =require('passport');
var db = require('monk')('localhost/tripxp');
var multer = require('multer');
var LocalStrategy =require('passport-local').Strategy;
var multer =require('multer');
var flash = require('connect-flash');
var mongoose = require ('mongoose');
var data = mongoose.connection;

var index = require('./routes/index');
var users = require('./routes/users');
var posts = require('./routes/posts');
var categories = require('./routes/categories');
var admin = require('./routes/admin');
var question = require('./routes/question');
var answer = require('./routes/answer');
var vote = require('./routes/upvote');
var app = express();

app.locals.moment = require('moment');

app.locals.truncateText = function(text , length){
    var truncatedText= text.substring(0,length);
    return truncatedText;
}

app.use(bodyParser.urlencoded({
  extended: true
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


var upload = multer({ dest: './public/images/uploads' });

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(session({
    secret:'secret',
    saveUninitialized : true,
    resave: true
    
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(expressValidator({
    errorformatter: function(param,msg,value){
    var namespace= param.split('.'),
        root= namespace.shift(),
        formParam =root;
     while(namespace.length){
         formParam += '[' +namespace.shift() +']';
     }
    return{
        param: formParam,
        msg: msg,
        value : value
    };    
    }  
}));

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(flash());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});
app.get('*', function(req,res,next){
    res.locals.user = req.user || null;
    next();
});
app.use(function(req,res,next){
    req.db = db;
    next();
});

app.use('/', index);
app.use('/posts', posts);
app.use('/categories', categories);
app.use('/admin', admin);
app.use('/users', users);
app.use('/answer', answer);
app.use('/upvote', vote);
app.use('/question', question);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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

module.exports = app;
