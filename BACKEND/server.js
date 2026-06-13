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
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
    credentials: true
}));
app.use(cookieParser());
app.use(exp.json());
app.use('/auth', authRouter);
app.use('/news', aiNewsApiRouter);
app.use('/watchlist', watchlistRouter);
app.use('/stock', stockRouter);

const connectDB=async()=>{
    try{
        const url=process.env.MONGODB_URI;
        await connect(url);
        console.log("DB connected");
        const port=process.env.PORT || 3000;
        app.listen(port,()=>console.log(`server listening on ${port}...`))
    }catch(err){
        console.log("error in DB connection",err)
    }
}
connectDB()

    
