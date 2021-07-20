var express = require('express');
var router = express.Router();
var campground = require('../models/campground');
var middleware = require('../middleware');

router.get("/",function(req,res){
    console.log(req.user);
    // get all campgrounds from db
    campground.find({},function(err,allcampgrounds){
        if(err){
            console.log(err);
        } else{
            res.render("campgrounds/index",{campgrounds:allcampgrounds});
        }
    })
});

//create /add new campground to database 

router.post("/",middleware.isloggedin, function(req,res){
    //get data from form and add to campgrounds array
    var name = req.body.name;
    var image = req.body.image; 
    var price = req.body.price;
    var desc = req.body.description; 
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newcampground = {name:name, price:price, image:image, description:desc,author:author}
    // campgrounds.push(newcampground);
    // insted------ Creatye a new campgroundand save to database
    campground.create(newcampground,function(err,newlycreated){
        if(err){
            console.log(err);
        } else {
            // alaso we redirect again to campgrounds page
            res.redirect("/campgrounds");
        }
    })

})

//New- show form to add new campground
router.get("/new", middleware.isloggedin ,function(req,res){
    res.render("campgrounds/new.ejs");
})


//SHOW -shows more info about a campground
router.get("/:id",function(req,res){
    //find the campground with provided ID
    campground.findById(req.params.id).populate("comments").exec(function(err,foundCampground){
        if(err)
        {
            console.log("err");
        } else{
            // console.log(foundCampground);
            //render show template with that campground
            res.render("campgrounds/show",{campground: foundCampground})
        }
    });
})

//Edit campground route 
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req,res){

    campground.findById(req.params.id,function(err, foundCampground){
        res.render("campgrounds/edit",{campground: foundCampground});
    });
});

//update campground route 

router.put("/:id",middleware.checkCampgroundOwnership,function(req,res){
    // find and update the correct campground
    
    campground.findByIdAndUpdate(req.params.id,req.body.Campground, function(err,updateCampground){
        if(err){
            res.redirect("/campgrounds");
        }else{
            res.redirect("/campgrounds/"+ req.params.id)
        }
    })
})
//destroy campground route
router.delete("/:id",middleware.checkCampgroundOwnership,function(req,res){
    campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/campgrounds");
        }
        else {
            res.redirect("/campgrounds");
        }
    })
})

//middleware



module.exports = router;