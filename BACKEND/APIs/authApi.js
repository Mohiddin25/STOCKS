import exp from 'express';
import {compare} from 'bcryptjs';
import jwt from 'jsonwebtoken';
import {User} from '../models/userModel.js';
import {createToken} from '../middlewares/createToken.js';

export const authRouter = exp.Router();

// user authentication 
// normal login with email and pin 
authRouter.post('/login', async (req, res) => {
    const {email,pin} = req.body;
    try{
        const user=await User.findOne({email});
        if(!user){
            return res.status(400).json({message:"Invalid email"});
        }
        const isMatch=await compare(pin, user.pin);
        if(!isMatch){
            return res.status(400).json({message:"Invalid pin"});
        }
        const token=createToken(user);
        res.cookie("token",token,{
        httpOnly:true,
        sameSite:"lax",
        secure:false, // set to true in production
        })
        res.json({message:"Login successful",payload:user});


    }catch(error){
        res.status(500).json({message:error.message});
    }
})

authRouter.post('/logout', (req, res) => {
    try {
        res.clearCookie('token');

        return res.status(200).json({
            message: 'Logout successful'
        });

    } catch (error) {
        return res.status(500).json({
            message: 'Logout failed'
        });
    }
});


// Oauth login and also register with google
// authRouter.post('/google-login', async (req, res) => {
//     // this route will handle both login and registration with google
//     // implementation will be done in the future
// })

