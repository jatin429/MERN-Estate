import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URL=process.env.MONGODB_URL;

const connect = () => {
    mongoose.connect(MONGODB_URL, {
        // useNewUrlParser: true,
        // useUnifiedTopology: true,
    })
    .then(() => console.log("DB connection successful"))
    .catch(err => {
        console.error("DB connection problem:", err);
        process.exit(1);
    });
};

export default { connect };
