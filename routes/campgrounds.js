var express= require("express");
var router= express.Router();
var Campground= require("../models/campground");
var middleware = require("../middleware");


//INDEX- show all campgrounds
router.get("/", function(req,res){
	//get all campgrounds from DB
	Campground.find({},function(err,allCampgrounds){
		if(err){
			console.log(err);
		} else {
			res.render("campgrounds/index" , {campgrounds: allCampgrounds });
		}
	});
	//res.render("campgrounds" , {campgrounds: campgrounds});
});

//create- create new campground
router.post("/", middleware.isLoggedIn, function(req,res){
	var name= req.body.name;
	var price=req.body.price;
	var image=req.body.image;
	var desc =req.body.description;
	var author = {
		id: req.user._id ,
		username: req.user.username
	}
	var newCampground= {name: name,price: price, image:image, description: desc , author: author}
	Campground.create(newCampground, function(err,newlyCreated){
		if(err){
			console.log(err);
		}else{
			console.log(newlyCreated);
			res.redirect("/campgrounds");
		}
	});
	
});

//new-show form to create a new campground
router.get("/new", middleware.isLoggedIn ,function(req,res){
	res.render("campgrounds/new");
});


//SHOW -shows more info about one campground
router.get("/:id", function(req,res){
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
		if(err || !foundCampground){
			req.flash("error", "Campground not found");
			res.redirect("back");
		}else{
			console.log(foundCampground);
			res.render("campgrounds/show",{campground: foundCampground});
		}
	});
});

//EDIT CAMPGROUND ROUTE
router.get("/:id/edit" , middleware.checkCampgroundOwnership ,function(req,res){
		Campground.findById(req.params.id , function(err, foundCampground){
			   res.render("campgrounds/edit", {campground: foundCampground});
		});
});


//UPDATE CAMPGROUND ROUTE
router.put("/:id", middleware.checkCampgroundOwnership,function(req, res){
	//find and update the correct campground
	Campground.findByIdAndUpdate(req.params.id,req.body.campground,function(err, updatedCampground){
		if(err){
			res.redirect("/");
		}else{
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});

//Destroy campground route
router.delete("/:id", middleware.checkCampgroundOwnership,function(req, res){
	Campground.findByIdAndRemove(req.params.id, function(err){
		if(err){
			res.redirect("/campgrounds");
		}else{
			res.redirect("/campgrounds");
		}
	});
});


module.exports= router;