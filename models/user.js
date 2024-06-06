const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//no need to build from scratch and also has some inbuilt methods(automatically gets implemented) regarding authentication, etc
const passportLocalMongoose=require("passport-local-mongoose");//Automatically includes a user name and password and does hashing and salting automatically

//rest additional requirements we need to add like email here, etc
const userSchema=new Schema({
    email:{
        type:String,
        required:true
        //no need to write user pass here as automatically created above only
    }
});

userSchema.plugin(passportLocalMongoose);//Using passport-local-mongoose as plugin here
module.exports=mongoose.model('User',userSchema);