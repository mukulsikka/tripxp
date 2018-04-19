var express =require('express');
var router = express.Router();
var mongo =require('mongodb');
var db = require('monk')('localhost/tripxp');

router.get('/shows/:id',function(req,res,next){
var qid = req.params.id;
var posts =db.get('ques');
var theta = db.get('ans');
posts.findOne({'_id': qid},function(err,post){
    theta.find({"qid" : qid}, function(err,ans){   
      res.render('shows',{
        "qus": post,
        "answers":ans
      });  
        });
    });
});


router.get('/qus',function(req,res,next){
    var categories = db.get('location');
    categories.find({},{},function(err,categories){
       res.render('addqus',{
      "title" : "Add Post", 
    "categories": categories
    }); 
    });
});

router.post('/qus',function(req,res,next){
    console.log(req.body);
    var title = req.body.title;
    var category = req.body.cat;
    var author = req.body.author;
    var date = new Date();
    
  
    req.checkBody('title',"Title field is required").notEmpty();
    var errors =req.validationErrors();
    if(errors){
        res.render('addqus',{
           "errors": errors,
            "title": title,
        });
    }else{
        var posts = db.get('ques');
        posts.insert({
            "title":title,
            "category" : category,
            "date": date,
            "author": author

        },function(err,post){
            if(err){
                res.send('There is an error submitting the question');
            }else{
               req.flash('success','Question Submitted');
                res.location('/');
                res.redirect('/');
            }
        });
        
    }
    
});
module.exports = router;