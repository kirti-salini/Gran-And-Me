const express=require("express");
const router=express.Router();//to get router object
const wrapAsync=require("../utils/wrapAsync.js");
const Listing = require("../models/listings.js"); // Adjusted path
const {isLoggedIn}=require("../middleware.js");
const {isOwner,validateListing}=require("../middleware.js");
const listingController=require("../controllers/listings.js");
const multer=require('multer');
const {storage}=require("../cloudConfig.js");
const upload=multer({storage});
//Index Route and Create Route for New Route Combined
router
.route("/")
.get(wrapAsync(listingController.index))
.post(
    isLoggedIn,upload.single('listing[image]'),validateListing,
    wrapAsync(listingController.createListing)
    );

//New Route
router.get("/new",isLoggedIn,wrapAsync(listingController.renderNewFrom));


//Show Route,Update Route and Delete Route combined
router.route("/:id")
.get(wrapAsync(listingController.showListing))
.put(isLoggedIn,isOwner,upload.single('listing[image]'),
    validateListing,
    wrapAsync(listingController.updateListing))
.delete(isLoggedIn,isOwner,wrapAsync(listingController.destroyListing));

/*Show Route
router.get("/:id",wrapAsync(listingController.showListing));
//Update Route
router.put("/:id",isLoggedIn,isOwner,
    validateListing,
    wrapAsync(listingController.updateListing));
//Delete Route
router.delete("/:id",isLoggedIn,isOwner,wrapAsync(listingController.destroyListing));    
*/



//Edit Route
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm)
);

module.exports=router;
