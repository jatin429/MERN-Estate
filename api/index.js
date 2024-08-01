import express from 'express';
import dotenv from 'dotenv';
import db from './config/database.js';
import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js"

const app=express();
dotenv.config();

db.connect();

app.use(express.json());

app.listen(3000,() => {
    console.log("Server is running at 3000!");
})

app.use('/api/user',userRouter);
app.use('/api/auth',authRouter);



