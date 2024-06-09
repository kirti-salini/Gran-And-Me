const Listing = require("./models/listings");
const Review = require("./models/review");
const ExpressError=require("./utils/ExpressError.js");
const {listingSchema}=require("./schema.js");
const { reviewSchema } = require("./schema.js");
const review = require("./models/review.js");

module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;
        req.flash("error","You must be logged in first");
        return res.redirect("/login");
      }
      next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};
 module.exports.isOwner=async(req,res,next)=>{
  let {id}=req.params;
  let listing=await Listing.findById(id);
  if(!listing.owner.equals(res.locals.currUser._id)){
    req.flash("error","You dont have permissions");
    return res.redirect(`/listings/${id}`);
  }
  next();
 }

 //Creating middleware for validation schema
 module.exports.validateListing=(req,res,next)=>{
     //to apply validation on individual fields, see schema.js
     let {error}=listingSchema.validate(req.body);
     if(error){
       //returning individual details of error
       let errMsg=error.details.map((el)=>el.message).join(",");
       throw new ExpressError(400,errMsg);
     }else{
       next();
     }
   }

// Creating middleware for validation schema of Review
module.exports.validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

module.exports.isReviewAuthor=async(req,res,next)=>{
  let {id,reviewId}=req.params;
  let review=await Review.findById(reviewId);
  if(!review.author.equals(res.locals.currUser._id)){
    req.flash("error","You dont have permissions");
    return res.redirect(`/listings/${id}`);
  }
  next();
 }