const mongoose=require("mongoose");
const initData=require("./data.js");
const Listing=require("../models/listings.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/granandme";

main().then(() => {
  console.log("Connected to DB");
}).catch((err) => {
  console.log(err);
});

async function main() {
  await mongoose.connect(MONGO_URL);
}

//to completely clean data inside the database
const initDB=async()=>{
    await Listing.deleteMany({});
    initData.data=initData.data.map((obj)=>({
      ...obj,
      owner:"66618dfead56c1527fa02f92"
    }))
    await Listing.insertMany(initData.data);
    console.log("Data was initialized");
};

initDB();
