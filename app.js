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

    // const start = async () => {
    
    //     if (process.env.DB_URI == null) {
    //         throw new Error('auth DB_URI must be defined');
    //     }
    //     try {
    //         await mongoose.connect(process.env.DB_URI, {
    //             useNewUrlParser: true,
    //             useUnifiedTopology: true,
    //             useCreateIndex: true,
    //         });
    //         console.log('Server connected to MongoDb!');
    //     } catch (err) {
    //         throw new DbConnectionError();
    //         console.error(err);
    //     }
    
    //     const PORT = process.env.SERVER_PORT;
    //     app.listen(PORT, () => {
    //         console.log(`Server is listening on ${PORT}!!!!!!!!!`);
    //     });
    // };
    
    // start();

mongoose.connect(
    "mongodb://localhost/yelp_camp_v9",
    { useNewUrlParser: true, useUnifiedTopology: true },
    function (err, res) {
        try {
            console.log('Connected to Database');
        } catch (err) {
            throw err;
        }
    });

// mongodb+srv://melingody:ved@yelpcamp.e3ftk.mongodb.net/yelpcamp?retryWrites=true&w=majority

// mongodb://localhost/yelp_camp_v9
//mongodb+srv://melingody:Ved@12345#@yelpcamp.e3ftk.mongodb.net/yelpcamp?retryWrites=true&w=majority

process.on('unhandledRejection', (reason, promise) => {
    // do something
    console.log(reason);
    console.log(promise);
  });
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
