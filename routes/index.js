var express = require('express');
var router = express.Router();
var mongo = require('mongodb');
var db= require('monk')('localhost/tripxp');

/* GET home page. */
router.get('/',ensureAuthenticated, function(req, res, next) {
 var db = req.db;
 var posts = db.get('blog');
     posts.find({},{},function(err,posts){
    res.render('index',{
       "posts" : posts
    });     
     });
     
});
router.get('/home', function(req, res, next) {
 var db = req.db;
 var posts = db.get('blog');
     posts.find({},{},function(err,posts){
    res.render('home',{
       "posts" : posts
    });     
     });
     
});

router.get('/abcd/',ensureAuthenticated, function(req, res, next) {
 var db = req.db;
var questions = db.get('ques');
     questions.find({},{},function(err,questions){
    res.render('question',{
       "questions" : questions
    });     
     });
     
});

function ensureAuthenticated(req,res,next){
   if(req.isAuthenticated()){
       return next();
   } 
    res.redirect('/users/login');
}

module.exports = router;
