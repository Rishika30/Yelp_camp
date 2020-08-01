var express      = require("express"),
    app          = express(),
    bodyParser   = require("body-parser"),
	flash        = require("connect-flash"),
	passport     = require("passport"),
	LocalStrategy= require("passport-local"),
	methodOverride= require("method-override"),
    Campground   = require("./models/campground"),
    Comment      = require("./models/comment"),
	User         = require("./models/user"),
    seedDB       = require("./seeds");
const mongoose   = require("mongoose");


//requiring routes
var commentRoutes = require("./routes/comments"),
	campgroundRoutes= require("./routes/campgrounds"),
	indexRoutes = require("./routes/index");






//Campground.create(
//	{
//	 name: "Salmon Creek" ,
//	 image: "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcSx-ECB7PFbjKwDjTrematg19dvs_0rcSI62Q&usqp=CAU",
//	 description: "This is a huge campground, no bathrooms, no water, Beautful Salmon Creek"	
//    }, function(err,campground){
//		if(err){
//			console.log(err);
//		}else{
//			console.log("NEWLY CREATED CAMPGROUND : ");
//			console.log(campground);
//		}
//	}
//);


	

mongoose.connect('mongodb://localhost:27017/yelp_camp_3', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to DB!'))
.catch(error => console.log(error.message));

app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine" , "ejs");

app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
//seedDB();



//PASSPORT CONFIGURATION
app.use(require("express-session")({
	secret: "Rishika is the best",
	resave:false,
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
app.use("/campgrounds/:id/comments" ,commentRoutes);







app.listen(process.env.PORT , process.env.IP , function(){
	console.log("Yelpcamp server has started");
});
	
