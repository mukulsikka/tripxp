var express =require('express');
var router = express.Router();
var mongo =require('mongodb');
var db = require('monk')('localhost/tripxp');


router.post('/vote',function(req,res,next){
    var qid=  req.body.qid;
    var aid = req.body.aid;
    var uid =  req.body.uid   
    if(0){
        res.render('addqus',{
          // "qid" : qid, 
            "aid": aid,
            "uid": uid
        });
    }else{
        var categories = db.get('ansvote');
        var count = db.get('ans');
        categories.insert({
           // "qid" : qid, 
            "aid": aid,
            "uid": uid

        },function(err,post){
            if(err){
                res.send('There is an error submitting the question');
            }else{
                count.update({
            "_id": aid},{$inc: { count : 1 }},function(err,post){
            if(err){
                res.send('There is an error submitting the post');
            }else{
                    req.flash('success','Question Submitted');
                res.location('/question/shows/' +  qid);
                res.redirect('/question/shows/'+ qid);
            }
        });
            

        }
               
            });
        
    }
    
});

router.post('/blogvote',function(req,res,next){
    var blogid=  req.body.blogid;
    var uid =  req.body.uid   
    if(0){
        res.render('addqus',{
          // "qid" : qid, 
            "blogid": blogid,
            "uid": uid
        });
    }else{
        var categories = db.get('blogvote');
        var count = db.get('blog');
        categories.insert({
           // "qid" : qid, 
            "blogid": blogid,
            "uid": uid

        },function(err,post){
            if(err){
                res.send('There is an error submitting the question');
            }else{
                count.update({
            "_id": blogid},{$inc: { count : 1 }},function(err,post){
            if(err){
                res.send('There is an error submitting the post');
            }else{
                    req.flash('success','Question Submitted');
                res.location('/');
                res.redirect('/');
            }
        });
            

        }
               
            });
        
    }
    
});
module.exports = router;