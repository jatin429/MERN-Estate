import express from 'express';
import mongoose from "mongoose";
import dotenv from 'dotenv';
import db from './config/database.js';

const app=express();
dotenv.config();

// connect to db
db.connect();

app.listen(3000,() => {
    console.log("Server is running at 3000!");
})



