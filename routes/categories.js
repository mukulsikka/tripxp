var express = require('express');
var router = express.Router();
var mongo = require('mongodb');
var db= require('monk')('localhost/tripxp');

router.get('/show/:category',function(req,res,next){
   var db =req.db;
    var posts =db.get('blog');
    posts.find({category: req.params.category},{},function(err,posts){
       res.render('index',{
           "title":req.params.category,
           "posts": posts
       }) 
    });
});

router.get('/shows/:author',function(req,res,next){
   var db =req.db;
    var posts =db.get('blog');
    posts.find({author: req.params.author},{},function(err,posts){
       res.render('index',{
           "title":req.params.author,
           "posts": posts
       }) 
    });
});


router.get('/delete/:title',function(req,res){
   var db =req.db;
    var categories =db.get('location');
    categories.remove({ "title" : req.params.title }, 
	   function(err){  
		if(err) res.json(err);
		else    res.redirect('/categories');
	}); 
    });

/* GET home page. */


router.get('/',function(req,res,next){
    var categories = db.get('location');
    var count = db.get('location').count({},);
    categories.find({},{},function(err,categories){
       res.render('addcategory',{
    "categories": categories,
    "title": "Add Category",
           "count": count
    }); 
    });
});

router.post('/add',function(req,res,next){
    var title = req.body.title;
    
    req.checkBody('title',"Title field is required").notEmpty();
    
    var errors =req.validationErrors();
    if(errors){
        res.render('addcategory',{
           "errors": errors,
            "title": title
        });
    }else{
        var categories = db.get('location');
        categories.insert({
            "title":title
            
        },function(err,post){
            if(err){
                res.send('There is an error submitting the category');
            }else{
               req.flash('success','Category Submitted');
                res.location('/');
                res.redirect('/');
            }
        });
        
    }
    
});

router.post('/edit/:title',function(req,res,next){
    var abcd = req.body.title;
    console.log (abcd);
    req.checkBody('title',"Title field is required").notEmpty();
       var errors =req.validationErrors();
    if(errors){
        res.render('addcategory',{
           "errors": errors,
        });
    }else{
         var categories = db.get('location');
        categories.update({
            "title": req.params.title},{"title": abcd},function(err,post){
            if(err){
                res.send('There is an error submitting the post');
            }else{
               req.flash('success','Updated');
                res.location('/categories');
                res.redirect('/categories');
            }
        });
        
    }
    
});
module.exports = router;