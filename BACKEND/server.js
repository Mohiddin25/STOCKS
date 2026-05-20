import dotenv from "dotenv";
import exp from "express";
import fetchNews from "./services/newsService.js";
import {authRouter} from "./APIs/authApi.js";
import {connect} from "mongoose";

const app = exp();
dotenv.config();


app.use(exp.json());
app.use('/auth', authRouter);

const connectDB=async()=>{
    try{
        await connect(process.env.MONGO_URL)
        console.log("DB connected")
        const port=process.env.PORT || 3000;
        app.listen(port,()=>console.log(`server listening on ${port}...`))
    }catch(err){
        console.log("error in DB connection",err)
    }
}
connectDB()

// fetchNews("Nifty").then((news) => {
//    console.log(news);
// });
