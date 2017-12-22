var  express         = require("express"),
     app             = express(),
     bodyParser      = require("body-parser"),
     mongoose        = require("mongoose"),
     User            = require("./models/user"),
     passport        = require("passport"),
     methodOverride  = require("method-override"),
     LocalStrategy   = require("passport-local"),
     flash           = require("connect-flash");
     
var commentRoutes    = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes      = require("./routes/index");
    
mongoose.connect(process.env.DATABASEURL);
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");
app.use(express.static(__dirname+"/public"));
app.use(methodOverride("_method"));
app.use(flash());
// seedDB();

//Passport configuration
app.use(require("express-session")({
    secret: "Handsome boy!",
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

app.use("/", indexRoutes);
app.use("/campgrounds",campgroundRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);

app.listen(process.env.PORT,process.env.IP,function(){
    console.log("The Server Start!")
});