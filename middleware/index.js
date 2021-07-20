//all middleware goes here 
var campground = require('../models/campground');
var Comment = require('../models/comment');

var middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function(req, res, next){
    if(req.isAuthenticated()){
    campground.findById(req.params.id,function(err, foundCampground){
        if(err) {
            req.flash('error',"Campground not found");
            res.redirect("back");
        }
        else{
            //does user own campground ?
            if(foundCampground.author.id.equals(req.user._id)){
                next();
            }else{
                req.flash('error',"You don't have permission to do that");
                res.redirect("back");
            }
        }
    });
    
    }else{
        res.redirect("back");
    }
}

middlewareObj.checkCommentOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id,function(err, foundcomment){
            if(err) {

                res.redirect("back");
            }
            else{
                //does user own ccomment ?
                if(foundcomment.author.id.equals(req.user._id)){
                   next();
                }else{

                    res.redirect("back");
                }
            }
        });

    }else{
        res.redirect("back");
    }
}

middlewareObj.isloggedin = function(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "Please Login first!!");
    res.redirect("/login");
}

module.exports = middlewareObj;