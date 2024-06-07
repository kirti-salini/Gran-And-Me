const Listing=require("../models/listings.js")

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
    //let {title,description,image,price,country,location}=req.body;
    //let listing=req.body.listing;
    if(!req.body.listing){//if trying to access listing that does'nt exist
      throw new ExpressError(400,"Send valid data for listing");
    }
      const newListing=new Listing(req.body.listing);   
      newListing.owner=req.user._id;
      await newListing.save();
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
    res.render("listings/edit.ejs",{listing});
  };

  module.exports.updateListing=async(req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
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