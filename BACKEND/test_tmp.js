import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { User } from './models/userModel.js';
import dotenv from 'dotenv';

dotenv.config();

async function run() {
  try {
    await mongoose.connect("mongodb://localhost:27017/stockapp");
    console.log("Connected to MongoDB");

    // Delete existing test user if any
    await User.deleteOne({ email: 'Khasim@gmail.com' });

    // Hash the pin
    const salt = await bcrypt.genSalt(10);
    const hashedPin = await bcrypt.hash('123456', salt);

    const user = new User({
      name: 'Khasim',
      email: 'Khasim@gmail.com',
      pin: hashedPin,
      watchlist: []
    });

    // Save bypassing Mongoose validation
    await user.save({ validateBeforeSave: false });
    console.log("Test user created successfully (bypassed validation)!");
  } catch (err) {
    console.error("Error creating user:", err);
  } finally {
    await mongoose.disconnect();
  }
}

run();
