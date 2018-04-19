var express =require('express');
var router = express.Router();
var mongo =require('mongodb');
var db = require('monk')('localhost/tripxp');

router.get('/show/:id',function(req,res,next){
    var posts =db.get('blog');
    posts.findOne( {'_id' :req.params.id} , function(err,post){
        res.render('show',{
        "post": post,
        "comments":  post.comments  
    });
    });
});

router.get('/add',function(req,res,next){
    var categories = db.get('location');
    categories.find({},{},function(err,categories){
       res.render('addpost',{
      "title" : "Add Post", 
    "categories": categories
    }); 
    });
});

router.post('/add',function(req,res,next){
    console.log(req.body);
    var title = req.body.title;
    var category = req.body.cat;
    var body = req.body.body;
    var author = req.body.author;
    var date = new Date();
    
  
    req.checkBody('title',"Title field is required").notEmpty();
    req.checkBody('body',"body field is required").notEmpty();
    
    var errors =req.validationErrors();
    if(errors){
        res.render('addpost',{
           "errors": errors,
            "title": title,
            "body": body
        });
    }else{
        var posts = db.get('blog');
        posts.insert({
            "title":title,
            "body": body,
            "category" : category,
            "date": date,
            "author": author,
            

        },function(err,post){
            if(err){
                res.send('There is an error submitting the post');
            }else{
               req.flash('success','Post Submitted');
                res.location('/');
                res.redirect('/');
            }
        });
        
    }
    
 });



router.post('/addcomment',function(req,res,next){
    var name = req.body.name;
    var email = req.body.email;
    var body = req.body.body;
    var postid = req.body.postid;
    var commentdate = new Date();
    
    req.checkBody('name',"Name field is required").notEmpty();
    req.checkBody('body',"body field is required").notEmpty();
    req.checkBody('email',"Email field is required").notEmpty();
    req.checkBody('email',"Email is not formatted correctly").isEmail();
    
    var errors =req.validationErrors();
    if(errors){
        var posts =db.get('blog');
        posts.findOne({'_id': postid},function(err,post){
          res.render('show',{
           "errors": errors,
            "post": post
        });  
        });
        
    }else{
        var comment = {"name": name,"email":email,"body":body,"commentdate":commentdate};
        var posts =db.get('blog');
        
        posts.update({
           "_id" :postid 
        },{
            $push:{
                "comments":comment
            }
        },function(err,doc){
            if(err) {
                throw err;
            }else{
                req.flash('success','comment Added');
                res.location('/posts/show/' +  postid);
                res.redirect('/posts/show/'+postid);
            }
        }
                   );
        
    }
    
});


module.exports = router;