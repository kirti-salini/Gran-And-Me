const express=require("express");
const router=express.Router();//to get router object
const wrapAsync=require("../utils/wrapAsync.js");
const Listing = require("../models/listings.js"); // Adjusted path
const {isLoggedIn}=require("../middleware.js");
const {isOwner,validateListing}=require("../middleware.js");
const listingController=require("../controllers/listings.js");

//Index Route
router.get("/",wrapAsync(listingController.index));
//New Route
router.get("/new",isLoggedIn,wrapAsync(listingController.renderNewFrom));
//Show Route
router.get("/:id",wrapAsync(listingController.showListing));

//Create Route for New Route
router.post("/",
validateListing,isLoggedIn,
wrapAsync(listingController.createListing)
);

//Edit Route
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm)
);

//Update Route
router.put("/:id",isLoggedIn,isOwner,
validateListing,
wrapAsync(listingController.updateListing));

//Delete Route
router.delete("/:id",isLoggedIn,isOwner,wrapAsync(listingController.destroyListing));

module.exports=router;
