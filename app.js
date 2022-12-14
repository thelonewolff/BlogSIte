var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    passport    = require("passport"),
    cookieParser = require("cookie-parser"),
    LocalStrategy = require("passport-local"),
    flash        = require("connect-flash"),
    blog  = require("./models/blog"),
    Comment     = require("./models/comment"),
    User        = require("./models/user"),
    session = require("cookie-session"),
    seedDB      = require("./seeds"),
    methodOverride = require("method-override");
// configure dotenv
require('dotenv').load();

//requiring routes
var commentRoutes    = require("./routes/comments"),
    blogRoutes = require("./routes/blog"),
    indexRoutes      = require("./routes/index")
    
// assign mongoose promise library and connect to database
mongoose.Promise = global.Promise;

// const databaseUri = 'mongodb+srv://thealpheonix:theghostoftheuchihamadarauchiha@conf-mate.shxow.mongodb.net/blogsite?retryWrites=true&w=majority'

// mongoose.connect(databaseUri, { useNewUrlParser: true , useUnifiedTopology: true})
//       .then(() => console.log(`Database connected`))
//       .catch(err => console.log(`Database connection error: ${err.message}`));
mongoose.connect("mongodb+srv://danish:jRRyezykn9p1zYwo@conf-mate.shxow.mongodb.net/blogsite?retryWrites=true&w=majority",{ useFindAndModify: false, useNewUrlParser: true ,useUnifiedTopology: true });
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride('_method'));
app.use(cookieParser('secret'));
//require moment
app.locals.moment = require('moment');
// seedDB(); //seed the database

// PASSPORT CONFIGURATION
app.use(require("cookie-session")({
    secret: "Welcome to blogsite",
    resave: false,
    saveUninitialized: false
}));

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   res.locals.success = req.flash('success');
   res.locals.error = req.flash('error');
   next();
});


app.use("/", indexRoutes);
app.use("/blog", blogRoutes);
app.use("/blog/:id/comments", commentRoutes);

app.listen(3000 || process.env.PORT, function(){
   console.log("The Server Has Started!");
});
