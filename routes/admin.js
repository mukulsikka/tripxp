var express = require('express');
var router = express.Router();
var mongo = require('mongodb');
var db= require('monk')('localhost/nodeblog');

router.get('/', function(req, res, next) {
 res.render('admin',{
     "title": "admin"
 });
     
});

module.exports = router;