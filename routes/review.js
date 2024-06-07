const express = require("express");
const router = express.Router({ mergeParams: true }); // mergeParams is required to access :id in parent route
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Review = require("../models/review.js");
const Listing = require("../models/listings.js");
const {validateReview,isLoggedIn,isReviewAuthor}=require("../middleware.js");


// Reviews (POST Route)
router.post("/",isLoggedIn, validateReview, wrapAsync(async (req, res) => {
  const { id } = req.params;
  if (!id) {
    throw new ExpressError(400, "Invalid Listing ID");
  }

  const listing = await Listing.findById(id);
  if (!listing) {
    throw new ExpressError(404, "Listing not found");
  }

  const newReview = new Review(req.body.review);
  newReview.author=req.user._id;
  listing.reviews.push(newReview);

  await newReview.save(); // saving the review in db first along with listing
  await listing.save(); // saving the listing changes
  req.flash("success", "New Review Added!!");
  res.redirect(`/listings/${listing._id}`);
}));

// Reviews (DELETE Route)
router.delete("/:reviewId",isLoggedIn,isReviewAuthor, wrapAsync(async (req, res) => {
  const { id, reviewId } = req.params;

  if (!id || !reviewId) {
    throw new ExpressError(400, "Invalid IDs");
  }

  const listing = await Listing.findById(id);
  if (!listing) {
    throw new ExpressError(404, "Listing not found");
  }

  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "Review Deleted!!");
  res.redirect(`/listings/${id}`);
}));

module.exports = router;
