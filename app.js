if(process.env.NODE_ENV!="production"){
  require('dotenv').config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const port = 3030;
const ExpressError=require("./utils/ExpressError.js");
const Listing = require('./models/listings.js');
const Review = mongoose.model('Review');
const session=require("express-session")
const MongoStore=require('connect-mongo');
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");
const listingRouter=require("./routes/listing.js");
const reviewRouter=require("./routes/review.js");
const userRouter=require("./routes/user.js");
//const MONGO_URL = "mongodb://127.0.0.1:27017/granandme";
const dbUrl=process.env.ATLASDB_URL;

main().then(() => {
  console.log("Connected to DB");
}).catch((err) => {
  console.log(err);
}); 

async function main() {
  await mongoose.connect(dbUrl);
}
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine('ejs',ejsMate);//mostly like includes and partials
app.use(express.static(path.join(__dirname,"/public")))


const store=MongoStore.create({
  mongoUrl:dbUrl,
  crypto:{
    secret:"mysupersecretcode",
  },touchAfter:24*3600,
});

store.on("error",()=>{
  console.log("Error in Mongo Session Store",err);
});

const sessionOptions={
  store,
  secret:"mysupersecretcode",
  resave:false,
  saveUninitialized:true,
  cookie:{
    expires:Date.now()+7*24*60*60*1000,//one week time for expiry of cookie
    maxAge:7*24*60*60*1000,
    httpOnly:true,//for security purpose to avoid cross scripting attacks
  }
};

// app.get("/", (req, res) => {
//   res.send("HI I AM ROOT");
// });


app.use(session(sessionOptions));
app.use(flash());//used it before routes so as it will display in that route, else will not
app.use(passport.initialize());
app.use(passport.session());//used so that every request knows that it is part of which session
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//creating a middleware
app.use((req,res,next)=>{
  res.locals.success=req.flash("success");
  res.locals.error=req.flash("error");
  res.locals.currUser=req.user;
  next();//else will be stuck in this middleware only
})


app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);

// Adding the search route(name,job role or description,location,country)
app.get('/search', async (req, res) => {
  const query = req.query.q || ''; // Capture the original query
  const searchQuery = query.toLowerCase(); // Use this for the search
  console.log('Search Query:', query);

  let results = [];
  if (searchQuery) {
    try {
      results = await Listing.find({
        $or: [
          { title: { $regex: searchQuery, $options: 'i' } },
          { location: { $regex: searchQuery, $options: 'i' } },
          { description: { $regex: searchQuery, $options: 'i' } },
          { country: { $regex: searchQuery, $options: 'i' } } // Added country to search criteria
        ]
      });
      console.log('Search Results:', results);
    } catch (err) {
      console.error('Error during search:', err);
    }
  }
  res.render('listings/search-results', { results, query });
});

// About Website Route
app.get('/about', (req, res) => {
  res.render('about');
});


//Route for High-Rated filter(Future Scope)
// app.get('/listings', async (req, res) => {
//   try {
//     const fiveStarListings = await Listing.aggregate([
//       {
//         $lookup: {
//           from: 'reviews', // Collection to join with
//           localField: 'reviews', // Field from the listings collection
//           foreignField: '_id', // Field from the reviews collection
//           as: 'allReviews' // Alias for the joined reviews
//         }
//       },
//       {
//         $addFields: {
//           averageRating: { $avg: '$allReviews.rating' } // Calculate the average rating for each listing
//         }
//       },
//       {
//         $match: {
//           averageRating: 5 // Filter listings with an average rating of 5
//         }
//       }
//     ]);

//     res.render('listings/index', { listings: fiveStarListings }); // Pass the filtered listings to the template
//   } catch (err) {
//     console.error('Error fetching listings:', err);
//     req.flash('error', 'Failed to fetch listings');
//     res.redirect('/');
//   }
// });


//A standard response if any path doesnt match
app.all("*",(req,res,next)=>{
  next(new ExpressError(404,"Page Not Found!!"));
})

//Defining middleware to handle error(Be it validation error or any)
app.use((err,req,res,next)=>{
  let {statusCode=500,message="Something went Wrong!!"}=err;//default status code and message
  //res.status(statusCode).send(message);
  res.status(statusCode).render("error.ejs",{message});
});
app.listen(port, () => {
  console.log(`server is listening to port ${port}`);
});
 