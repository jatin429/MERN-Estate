import User from "../models/user.model.js";
import bcryptjs from "bcryptjs"
import { errorHandler } from "../utils/error.js";
import  jwt  from "jsonwebtoken"; 

export const signup= async(req,res,next) =>{
    const {username,email,password}=req.body;
    const hashPassword=bcryptjs.hashSync(password,10);
    const newUser=new User({username,email,password:hashPassword});
    try {
        await newUser.save();
        res.status(201).json("User created Successfully!");
    } catch (err) {
        next(err);
    }
}

export const signin= async(req,res,next) =>{
    const {email,password}=req.body;
    try {
        const validUser=await User.findOne({email});
        if(!validUser) return next(errorHandler(404,"User not found!"));
        const validPass=bcryptjs.compareSync(password,validUser.password);
        if(!validPass) return next(errorHandler(401,"Wrong credentials!"));

        // Authentication
        const token=jwt.sign({id:validUser._id},process.env.JWT_SECRET)
        res
        .cookie('access_token',token,{httpOnly:true})
        .status(200)
        .json(validUser);
    } catch (err) {
        next(err);
    }
}

export const google = async (req, res, next) => {
    try {
      // Ensure req.body contains the necessary fields
      if (!req.body || !req.body.email || !req.body.name || !req.body.photo) {
        return res.status(400).json({ message: 'Invalid request data' });
      }
  
      // Find user by email
      const user = await User.findOne({ email: req.body.email });
  
      if (user) {
        // User exists, create a JWT token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        res
          .cookie('access_token', token, { httpOnly: true })
          .status(200)
          .json(user);
      } else {
        // User does not exist, create a new user
        const generatedPassword = Math.random().toString(36).slice(-8);
        const hashPassword = bcryptjs.hashSync(generatedPassword, 10);
        const username = req.body.name.split(" ").join("").toLowerCase() + Math.random().toString(36).slice(-3);
  
        const newUser = new User({
          username: username,
          email: req.body.email,
          password: hashPassword,
          avatar: req.body.photo,
        });
  
        await newUser.save();
  
        // Create a JWT token for the new user
        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res
          .cookie('access_token', token, { httpOnly: true })
          .status(200)
          .json(newUser);
      }
    } catch (error) {
      next(error);
    }
  };