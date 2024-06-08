const express = require("express");
const router = express.Router({ mergeParams: true }); // mergeParams is required to access :id in parent route
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {validateReview,isLoggedIn,isReviewAuthor}=require("../middleware.js");
const reviewController=require("../controllers/reviews.js");

// Reviews (POST Route)
router.post("/",isLoggedIn, validateReview, wrapAsync(reviewController.createReview));

// Reviews (DELETE Route)
router.delete("/:reviewId",isLoggedIn,isReviewAuthor, wrapAsync(reviewController.destroyReview));

module.exports = router;
