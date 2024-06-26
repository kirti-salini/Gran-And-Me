
const User=require("../models/user.js");
module.exports.renderSignupForm=(req,res)=>{
    res.render("users/signup.ejs");
};
module.exports.signup=async(req,res)=>{
    try{
        let {username,email,password}=req.body;
        const newUser=new User({email,username});
        const registeredUser=await User.register(newUser,password);
        console.log(registeredUser);
        req.login(registeredUser,(err)=>{
            if(err){
                return next(err);
            }
            req.flash("success","Welcome to Gran & Me!!");
            res.redirect("/listings");
        });
    }catch(e){//vimp see video here day 50 video 10
        req.flash("error",e.message);
        res.redirect("/signup");
    }

};

module.exports.renderLoginForm=(req,res)=>{
    res.render("users/login.ejs");
};

module.exports.login=async(req,res)=>{//tells what happens after successful login
    //passwort.authenticate will automatically show flash message in case wrong user name or id is enterred
    req.flash("success","Welcome Back to Gran & Me!! You are now logged in!!");
    res.redirect(res.locals.redirectUrl||"/listings");
};

module.exports.logout=(req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "You are now logged out!!");
        res.redirect("/listings"); // Redirect to the desired route after logging out
    });
};