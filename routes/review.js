const express = require("express");
const router = express.Router({ mergeParams: true }); // mergeParams is required to access :id in parent route
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { reviewSchema } = require("../schema.js");
const Review = require("../models/review.js");
const Listing = require("../models/listings.js");

// Creating middleware for validation schema of Review
const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

// Reviews (POST Route)
router.post("/", validateReview, wrapAsync(async (req, res) => {
  const { id } = req.params;
  if (!id) {
    throw new ExpressError(400, "Invalid Listing ID");
  }

  const listing = await Listing.findById(id);
  if (!listing) {
    throw new ExpressError(404, "Listing not found");
  }

  const newReview = new Review(req.body.review);
  listing.reviews.push(newReview);

  await newReview.save(); // saving the review in db first along with listing
  await listing.save(); // saving the listing changes
  req.flash("success", "New Review Added!!");
  res.redirect(`/listings/${listing._id}`);
}));

// Reviews (DELETE Route)
router.delete("/:reviewId", wrapAsync(async (req, res) => {
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
