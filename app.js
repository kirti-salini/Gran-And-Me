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
    secret:process.env.SECRET,
  },touchAfter:24*3600,
});

store.on("error",()=>{
  console.log("Error in Mongo Session Store",err);
});

const sessionOptions={
  store,
  secret:process.env.SECRET,
  resave:false,
  saveUninitialized:true,
  cookie:{
    expires:Date.now()+7*24*60*60*1000,//one week time for expiry of cookie
    maxAge:7*24*60*60*1000,
    httpOnly:true,//for security purpose to avoid cross scripting attacks
  }
};

app.get("/", (req, res) => {
  const httmlContent=`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Caregiver Haven</title>
    <style>
        body {
            background-color: #534a45; /* Dark background */
            font-family: Arial, sans-serif;
            color: #f4f4f9; /* Light text color */
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 2rem;
        }

        .section {
            background: #f4f4f9; /* Light background for each section */
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Subtle shadow for depth */
            border-radius: 8px; /* Rounded corners */
            margin-bottom: 2rem; /* Space between sections */
            padding: 2rem;
            color: #534a45; /* Dark text color for content */
        }

        .section h1 {
            color: #534a45; /* Darker color for headings */
            font-size: 2.5rem; /* Larger font size for headings */
            margin-bottom: 1rem; /* Space below headings */
        }

        .section p {
            font-size: 1.2rem; /* Slightly larger font size for readability */
            line-height: 1.8; /* Increased line height for readability */
            color: #534a45; /* Dark gray for paragraph text */
            margin-bottom: 2rem; /* Space below paragraphs */
        }

        .values {
            display: flex;
            flex-wrap: wrap;
            justify-content: space-around;
            margin-top: 2rem; /* Space above the values section */
        }

        .value {
            width: 30%;
            text-align: center;
            margin: 1rem 0;
            padding: 1rem;
            background: #eaddcc; /* Light beige background for value boxes */
            border-radius: 8px; /* Rounded corners for the boxes */
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05); /* Soft shadow for depth */
        }

        .value i {
            font-size: 3rem; /* Large icons */
            color: #534a45; /* Dark color for icons */
            margin-bottom: 10px; /* Space below the icons */
        }

        .value h2 {
            color: #534a45; /* Darker color for value headings */
            font-size: 1.5rem; /* Medium font size for value headings */
            margin-bottom: 0.5rem; /* Space below the value headings */
        }

        .value p {
            font-size: 1rem; /* Regular font size for value text */
            color: #534a45; /* Dark gray for value text */
        }

        .caregivers {
            display: flex;
            flex-wrap: wrap;
            justify-content: space-between;
        }

        .caregiver {
            width: 48%;
            background: #eaddcc; /* Light beige background for caregiver boxes */
            padding: 1rem;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
            margin-bottom: 1rem;
        }

        .caregiver h2 {
            font-size: 1.5rem;
            margin-bottom: 0.5rem;
        }

        .caregiver p {
            font-size: 1rem;
            color: #534a45;
        }

        .testimonials {
            display: flex;
            flex-wrap: wrap;
            justify-content: space-between;
        }

        .testimonial {
            width: 48%;
            background: #eaddcc;
            padding: 1rem;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
            margin-bottom: 1rem;
        }

        .testimonial p {
            font-style: italic;
            color: #534a45;
        }

        .contact-section form {
            display: flex;
            flex-direction: column;
        }

        .contact-section input, .contact-section textarea {
            margin-bottom: 1rem;
            padding: 0.5rem;
            border: 1px solid #534a45;
            border-radius: 4px;
        }

        .contact-section button {
            padding: 0.75rem;
            background-color: #534a45;
            color: #f4f4f9;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        }

        @media (max-width: 768px) {
            .values, .caregivers, .testimonials {
                flex-direction: column;
            }

            .value, .caregiver, .testimonial {
                width: 100%;
            }
        }
    </style>
</head>
<body>

    <div class="container">
        <div class="section about-section">
            <h1>Welcome to Caregiver Haven</h1>
            <p>At Caregiver Haven, we understand the challenges and rewards of caregiving. Our mission is to support caregivers with top-notch resources, a compassionate community, and practical solutions.</p>
          
           <!-- Get Started Link -->
    <div style="text-align:center; margin-top:2rem;">
    <a href="https://gran-and-me.onrender.com/listings" style="text-decoration:none;">
        <button style="background-color:#534a45; color:#f4f4f9; padding:0.75rem 1.5rem; border:none; border-radius:4px; cursor:pointer; font-size:1.2rem;">Get Started</button>
    </a>
</div>

            <div class="values">
                <div class="value">
                    <i class="fa fa-heart"></i>
                    <h2>Compassion</h2>
                    <p>We deeply care about the well-being of caregivers and their loved ones.</p>
                </div>
                <div class="value">
                    <i class="fa fa-users"></i>
                    <h2>Community</h2>
                    <p>Join a supportive network of caregivers sharing similar journeys.</p>
                </div>
                <div class="value">
                    <i class="fa fa-hand-holding-heart"></i>
                    <h2>Support</h2>
                    <p>Access valuable resources to help you provide the best care possible.</p>
                </div>
            </div>
        </div>

        <div class="section caregivers-section">
            <h1>Our Caregivers</h1>
            <div class="caregivers">
                <div class="caregiver">
                    <h2>Child-Care</h2>
                    <p>Specialized caregivers dedicated to nurturing and caring for children of all ages.</p>
                </div>
                <div class="caregiver">
                    <h2>Senior-Support</h2>
                    <p>Professional caregivers offering assistance and companionship for seniors.</p>
                </div>
                <div class="caregiver">
                    <h2>Behavioral-Assistant</h2>
                    <p>Expert caregivers providing support for individuals with behavioral challenges.</p>
                </div>
                <div class="caregiver">
                    <h2>Home-Nurse</h2>
                    <p>Qualified nurses delivering medical care and support
                    in the comfort of home.</p>
                </div>
                <div class="caregiver">
                    <h2>Disability-Support</h2>
                    <p>Dedicated caregivers assisting individuals with physical or intellectual disabilities.</p>
                </div>
                <div class="caregiver">
                    <h2>Hospice-Care</h2>
                    <p>Compassionate care for those nearing the end of life, ensuring comfort and dignity.</p>
                </div>
                <div class="caregiver">
                    <h2>Postpartum-Care</h2>
                    <p>Support for new mothers and their babies during the postpartum period.</p>
                </div>
                <div class="caregiver">
                    <h2>E-Health</h2>
                    <p>Telehealth services providing remote medical consultations and support.</p>
                </div>
                <div class="caregiver">
                    <h2>Journey-Companion</h2>
                    <p>Travel companions to assist individuals needing support during trips.</p>
                </div>
            </div>
        </div>


        <div class="section contact-section">
            <h1>Contact Us</h1>
            <p>If you have any questions or need more information, please feel free to reach out to us. We're here to help!</p>
            <form>
                <input type="text" placeholder="Your Name" required>
                <input type="email" placeholder="Your Email" required>
                <textarea placeholder="Your Message" rows="4" required></textarea>
                <button type="submit">Send Message</button>
            </form>
        </div>
    </div>

</body>
</html>`

  res.send(htmlContent);
 });


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
 