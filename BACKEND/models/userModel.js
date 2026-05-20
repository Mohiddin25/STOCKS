import {Schema,model} from "mongoose";

const userSchema = new Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    pin:{
        type:String,
        required:true,
        minLength:4,
        maxLength:4
    },
    watchlist:{
        type:[String],
        default:[]
    }
},{
    timestamps:true,
    versionKey:false
}
)


export const User = model("user", userSchema);