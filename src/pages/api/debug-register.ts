import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/utils/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log("=== DEBUG REGISTER REQUEST ===");
  console.log("Method:", req.method);
  console.log("Body:", req.body);
  console.log("Headers:", req.headers);
  
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    // Log the incoming request data
    const { firstName, lastName, email, password } = req.body;
    
    console.log("Received data:");
    console.log("- firstName:", firstName);
    console.log("- lastName:", lastName);
    console.log("- email:", email);
    console.log("- password:", password ? "[PROVIDED]" : "[MISSING]");
    
    // Validate required fields
    if (!firstName || !lastName || !email || !password) {
      console.log("Missing required fields");
      return res.status(400).json({ 
        message: "Missing required fields",
        received: { firstName, lastName, email, password: password ? "[PROVIDED]" : "[MISSING]" }
      });
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log("Invalid email format");
      return res.status(400).json({ message: "Invalid email format" });
    }
    
    // Validate password length
    if (password.length < 6) {
      console.log("Password too short");
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    // Connect to database
    console.log("Connecting to database...");
    await connectDB();
    console.log("Database connected");
    
    // Check if user already exists
    console.log("Checking for existing user with email:", email);
    const existingUser = await User.findOne({ email });
    console.log("Existing user found:", existingUser ? "YES" : "NO");
    
    if (existingUser) {
      return res.status(400).json({ 
        message: "User already exists",
        email: email
      });
    }

    // Hash password
    console.log("Hashing password...");
    const hashedPassword = await bcrypt.hash(password, 12);
    console.log("Password hashed");

    // Create new user
    console.log("Creating new user...");
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    // Save user to database
    console.log("Saving user to database...");
    await newUser.save();
    console.log("User saved successfully");

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
    console.error("=== REGISTRATION ERROR ===");
    console.error("Error type:", error.constructor.name);
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);
    
    // Check if it's a MongoDB authentication error
    if (error.name === 'MongoServerError' && error.codeName === 'AtlasError') {
      return res.status(500).json({ 
        message: "Database connection failed. Please check your MongoDB credentials.", 
        error: "Authentication failed" 
      });
    }
    
    return res.status(500).json({ 
      message: "Error registering user", 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}