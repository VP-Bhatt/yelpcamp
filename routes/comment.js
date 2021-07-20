//================================================
// Comments routes
//================================================
var express = require('express');
var router = express.Router({mergeParams: true});
var campground = require("../models/campground");
const comment = require('../models/comment');
var Comment = require("../models/comment");
var middleware = require('../middleware');

// comments new
router.get("/new",function(req,res){
    // find campground by id
    campground.findById(req.params.id, function(err,campground){
         if(err){
             console.log(err);
         }
         else{
             res.render("comments/new",{campground:campground});
         }
 
    })
  
 });
 
 router.post("/",middleware.isloggedin, function(req,res){
     //look up campground using ID
     campground.findById(req.params.id, function(err,campground){
         if(err){
             console.log(err);
             res.redirect("/campgrounds");
         }
         else{
             Comment.create(req.body.comment, function(err, comment){
                 if(err){
                     req.flash("error","something went wrong");
                     console.log(err);
                 } else{
                     //add username and id to comment
                     comment.author.id = req.user._id;
                     comment.author.username = req.user.username;
                     //save comment
                     comment.save();
                     campground.comments.push(comment);
                     campground.save();
                    //  console.log(comment);
                     res.redirect('/campgrounds/' + campground._id);
                 }
             })
         }
     })
     //create new comment
     // connect newcomment to campground
     //redirect campground show page 
 })

 //comments edit route
 router.get("/:comment_id/edit",middleware.checkCommentOwnership,function(req,res){
     comment.findById(req.params.comment_id,function(err,foundcomment){
         if(err){
             res.redirect("back");
         } else{
            res.render("comments/edit", {campground_id: req.params.id, comment: foundcomment});
         }
     })

 });

 //comment update
router.put("/:comment_id" ,middleware.checkCommentOwnership, function(req,res){
    comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatecomment){
        if(err){
            res.redirect("back");
        }else{
            res.redirect("/campgrounds/"+req.params.id);
        }
    })     
})

//comments destroy route 
router.delete("/:comment_id",middleware.checkCommentOwnership, function(req,res){
    //findbyidandremove
    comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            res.redirect("back");
        }else{
            req.flash("success","Comment successfuly deleted")
            res.redirect("/campgrounds/"+req.params.id);
        }
    })
})
 //middleware



 module.exports = router;