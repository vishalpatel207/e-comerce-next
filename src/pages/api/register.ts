import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/utils/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    // Connect to database
    await connectDB();
    
    const { firstName, lastName, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create new user
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    // Save user to database
    await newUser.save();

    return res.status(201).json({ 
      message: "User registered successfully", 
      user: {
        id: newUser._id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
      }
    });
  } catch (error: any) {
    console.error("Registration error:", error);
    
    // Check if it's a MongoDB authentication error
    if (error.name === 'MongoServerError' && error.codeName === 'AtlasError') {
      return res.status(500).json({ 
        message: "Database connection failed. Please check your MongoDB credentials in .env.local file.", 
        error: "Authentication failed" 
      });
    }
    
    return res.status(500).json({ message: "Error registering user", error: error.message });
  }
}