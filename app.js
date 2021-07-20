// const comment = require("./models/comment");

var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    flash       = require("connect-flash"),
    passport    = require("passport"),
    LocalStrategy = require("passport-local"),
    campground  = require("./models/campground"),
    seedDB      = require("./seeds"),   
    User        = require("./models/user"),
    Comment     = require("./models/comment"),

    methodOverride = require("method-override");

var commentRoutes  = require("./routes/comment"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes = require("./routes/index");

mongoose.connect("mongodb://localhost/yelp_camp_v9", { useNewUrlParser: true },{ useUnifiedTopology: true });

// app.use(bodyParser.urlencoded({extended:true}));
app.use(express.urlencoded({ extended: true }))
app.set("view engine", "ejs")
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
// seedDB();

//passport configuration 
app.use(require("express-session")({
    secret: "I wanna be dead",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.get("/",function(req,res){
    res.render("landing");
})



app.use("/campgrounds",campgroundRoutes);
app.use(indexRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);

app.listen(process.env.PORT || 3000,function(){
    console.log("server started !!!");
}); 

// RESTFUL ROUTES
