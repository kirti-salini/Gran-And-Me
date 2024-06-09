const Listing=require("../models/listings.js")
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken=process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken:mapToken });

module.exports.index=async(req,res)=>{
    const alllistings=await Listing.find({});
    res.render("listings/index.ejs",{alllistings});
}

module.exports.renderNewFrom=(req,res)=>{
    res.render("listings/new.ejs");
};

module.exports.showListing=async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id).populate({path:"reviews",populate:{path:"author",}}).populate("owner");//populate used to show whole data of reviews and not just object ids
    //nested populate used above populate({path:"reviews",populate:{path:"author",}})
    if(!listing){
      req.flash("error","Caregiver does not exist!!");
      res.redirect("/listings");
    }
    res.render("listings/show.ejs",{listing});
};

module.exports.createListing=async(req,res,next)=>{
    let response=await geocodingClient.forwardGeocode({
    query: req.body.listing.location,
    limit: 1,
  })
  .send();
  
  
    //let {title,description,image,price,country,location}=req.body;
    //let listing=req.body.listing;
    let url=req.file.path;
    let filename=req.file.filename;
    if(!req.body.listing){//if trying to access listing that does'nt exist
      throw new ExpressError(400,"Send valid data for listing");
    }
      const newListing=new Listing(req.body.listing);   
      newListing.owner=req.user._id;
      newListing.image={url,filename};
      newListing.geometry=response.body.features[0].geometry;
      let savedListing=await newListing.save();
      console.log(savedListing);
      req.flash("success","New Caregiver Added!!")
      res.redirect("/listings");
    };

module.exports.renderEditForm=async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    if(!listing){
      req.flash("error","Caregiver does not exist!!");
      res.redirect("/listings");
    }
    //for image preview for edit
    let originalImageUrl=listing.image.url;
    originalImageUrl=originalImageUrl.replace("/upload","/upload/w_250");//w_250 to reduce height of image in below upload section 
    res.render("listings/edit.ejs",{listing,originalImageUrl});
  };

  module.exports.updateListing=async(req,res)=>{
    let {id}=req.params;
    let listing=await Listing.findByIdAndUpdate(id,{...req.body.listing});
    
    if(typeof req.file!=="undefined"){//works only incase a new file is uploaded else previous image stays
    let url=req.file.path;
    let filename=req.file.filename;
    listing.image={url,filename};
    await listing.save();
    }
    req.flash("success","Caregiver Updated!!")
    res.redirect(`/listings/${id}`);
  };

  module.exports.destroyListing=async(req,res)=>{
    let {id}=req.params;
    let deletedListing=await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success","Caregiver Removed!!")
    res.redirect("/listings");
  };