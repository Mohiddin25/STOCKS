import dotenv from "dotenv";
import exp from "express";
import cors from "cors";
import {authRouter} from "./APIs/authApi.js";
import {connect} from "mongoose";
import aiNewsApiRouter from "./APIs/aiNewsApi.js";
import watchlistRouter from "./APIs/watchlistApi.js";
import stockRouter from "./APIs/stockApi.js";
import cookieParser from "cookie-parser";

dotenv.config();

const app = exp();
app.use(cors({
    origin: (origin, callback) => {
        // Mirror the requesting origin dynamically to support multiple preview/production hosts
        if (!origin) return callback(null, true);
        return callback(null, true);
    },
    credentials: true
}));
app.use(cookieParser());
app.use(exp.json());
app.use('/auth', authRouter);
app.use('/news', aiNewsApiRouter);
app.use('/watchlist', watchlistRouter);
app.use('/stock', stockRouter);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`server listening on port ${port}...`));

const connectDB = async () => {
    try {
        const url = process.env.MONGODB_URI || "mongodb://localhost:27017/stockapp";
        await connect(url);
        console.log("DB connected successfully");
    } catch (err) {
        console.error("error in DB connection:", err.message);
    }
};
connectDB();

    
