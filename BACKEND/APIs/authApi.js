import exp from 'express';
import {compare, hash} from 'bcryptjs';
import jwt from 'jsonwebtoken';
import {User} from '../models/userModel.js';
import {createToken} from '../middlewares/createToken.js';
import {verifyToken} from '../middlewares/verifyToken.js';

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
        const isProd = process.env.NODE_ENV === 'production' || (req.get('host') && !req.get('host').includes('localhost') && !req.get('host').includes('127.0.0.1'));
        res.cookie("token",token,{
        httpOnly:true,
        sameSite: isProd ? "none" : "lax",
        secure: isProd,
        })
        res.json({message:"Login successful",payload:user});


    }catch(error){
        res.status(500).json({message:error.message});
    }
})

authRouter.post('/logout', (req, res) => {
    try {
        const isProd = process.env.NODE_ENV === 'production' || (req.get('host') && !req.get('host').includes('localhost') && !req.get('host').includes('127.0.0.1'));
        res.clearCookie('token', {
            httpOnly: true,
            sameSite: isProd ? "none" : "lax",
            secure: isProd
        });

        return res.status(200).json({
            message: 'Logout successful'
        });

    } catch (error) {
        return res.status(500).json({
            message: 'Logout failed'
        });
    }
});

// Check current user session
authRouter.get('/me', verifyToken(), async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json({ user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Standard user registration
authRouter.post('/register', async (req, res) => {
    const { email, name, pin } = req.body;
    try {
        if (!email || !name || !pin) {
            return res.status(400).json({ message: "Missing email, name, or pin" });
        }
        if (pin.toString().length !== 6 || isNaN(pin)) {
            return res.status(400).json({ message: "PIN must be a 6-digit number" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists with this email" });
        }

        const hashedPin = await hash(pin.toString(), 10);
        const newUser = new User({
            email,
            name,
            pin: hashedPin
        });
        await newUser.save();

        const token = createToken(newUser);
        const isProd = process.env.NODE_ENV === 'production' || (req.get('host') && !req.get('host').includes('localhost') && !req.get('host').includes('127.0.0.1'));
        res.cookie("token", token, {
            httpOnly: true,
            sameSite: isProd ? "none" : "lax",
            secure: isProd,
        });

        res.status(201).json({ message: "Registration successful", user: newUser });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Google OAuth verification and login/check
authRouter.post('/google-auth', async (req, res) => {
    const { credential } = req.body;
    try {
        let email, name;

        if (credential) {
            const decoded = jwt.decode(credential);
            if (!decoded) {
                return res.status(400).json({ message: "Invalid Google credential" });
            }
            email = decoded.email;
            name = decoded.name || decoded.given_name || "Google User";
        } else {
            return res.status(400).json({ message: "No credentials provided" });
        }

        if (!email) {
            return res.status(400).json({ message: "Email not found in Google credential" });
        }

        const user = await User.findOne({ email });
        if (user) {
            const token = createToken(user);
            const isProd = process.env.NODE_ENV === 'production' || (req.get('host') && !req.get('host').includes('localhost') && !req.get('host').includes('127.0.0.1'));
            res.cookie("token", token, {
                httpOnly: true,
                sameSite: isProd ? "none" : "lax",
                secure: isProd,
            });
            return res.json({ isNewUser: false, user, message: "Login successful" });
        } else {
            return res.json({ isNewUser: true, email, name, message: "Please set a 6-digit PIN" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create PIN for new Google OAuth user
authRouter.post('/create-pin', async (req, res) => {
    const { email, name, pin } = req.body;
    try {
        if (!email || !name || !pin) {
            return res.status(400).json({ message: "Missing email, name, or pin" });
        }
        if (pin.toString().length !== 6 || isNaN(pin)) {
            return res.status(400).json({ message: "PIN must be a 6-digit number" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists with this email" });
        }

        const hashedPin = await hash(pin.toString(), 10);
        const newUser = new User({
            email,
            name,
            pin: hashedPin
        });
        await newUser.save();

        const token = createToken(newUser);
        const isProd = process.env.NODE_ENV === 'production' || (req.get('host') && !req.get('host').includes('localhost') && !req.get('host').includes('127.0.0.1'));
        res.cookie("token", token, {
            httpOnly: true,
            sameSite: isProd ? "none" : "lax",
            secure: isProd,
        });

        res.status(201).json({ message: "PIN created and registration successful", user: newUser });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

