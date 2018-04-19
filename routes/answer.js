var express =require('express');
var router = express.Router();
var mongo =require('mongodb');
var db = require('monk')('localhost/tripxp');



router.post('/qus/add/ans',function(req,res,next){
    console.log(req.body);
    var body = req.body.body;
    var qid = req.body.qid;
    var author = req.body.author;
  
    req.checkBody('body',"Title field is required").notEmpty();
    var errors =req.validationErrors();
    if(errors){
        
        var posts =db.get('ques');
        var theta = db.get('ans');
        posts.findOne({'_id': qid},function(err,post){
            theta.find({"qid" : qid}, function(err,ans){   
          res.render('shows',{
           "errors": errors,
            "qus": post,
            "answers":ans
          });  
            });
        }); 
    }else{
        var posts = db.get('ans');
        posts.insert({
            "body": body,
            "qid" : qid,
            "author": author,
            "count": 0

        },function(err,post){
            if(err){
                res.send('There is an error submitting the question');
            }else{
               req.flash('success','answer Submitted');
                res.location('/question/shows/' +  qid);
                res.redirect('/question/shows/'+ qid);
            }
        });
        
    }
    
});
module.exports = router;