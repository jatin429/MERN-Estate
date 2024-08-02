import mongoose from "mongoose";

 const userSchema=new mongoose.Schema({
    username:{
        type:String,
        requried:true,
        unique:true
    },
    email:{
        type:String,
        requried:true,
        unique:true
    },
    password:{
        type:String,
        requried:true,
    },
    avatar:{
        type:String,
        default:"https://static.vecteezy.com/system/resources/previews/005/544/718/original/profile-icon-design-free-vector.jpg"
    }
 },{timestamps:true});

 const User=mongoose.model('User',userSchema);

 export default User;