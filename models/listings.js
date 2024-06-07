const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review=require("./review.js");

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    type: String,
    //if image not there 
    default: "https://img.freepik.com/free-vector/elderly-care-cartoon-concept-with-old-women-walking-outdoors-vector-illustration_1284-80135.jpg?w=1060&t=st=1716306013~exp=1716306613~hmac=dfd7617cb49dbd51b9ca903d5ac096e44f70d56d17a93ca72d0fb028c39b15a0",
    //ternary operator(image is present but link is empty)
    set: (v) => v === "" 
      ? "https://img.freepik.com/free-vector/elderly-care-cartoon-concept-with-old-women-walking-outdoors-vector-illustration_1284-80135.jpg?w=1060&t=st=1716306013~exp=1716306613~hmac=dfd7617cb49dbd51b9ca903d5ac096e44f70d56d17a93ca72d0fb028c39b15a0" 
      : v,
  },
  mobileno:Number,
  price: Number,
  location: String,
  country: String,
  reviews:[
    {
      type:Schema.Types.ObjectId,
      ref:"Review",
    },
  ],
  owner:{
      type:Schema.Types.ObjectId,
      ref:"User",
  },
});

//Creating middleware to delete all related reviews if any listing is deleted
listingSchema.post("findOneAndDelete",async(listing)=>{
  if(listing){
    await Review.deleteMany({_id:{$in:listing.reviews}});
  }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
