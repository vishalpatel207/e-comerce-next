import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/utils/db";
import mongoose from "mongoose";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    console.log("Attempting to connect to MongoDB...");
    
    // Log the connection URI (partially masked for security)
    if (process.env.MONGODB_URI) {
      const uriParts = process.env.MONGODB_URI.split('@');
      if (uriParts.length > 1) {
        const userPart = uriParts[0].split('://')[1];
        console.log("MongoDB URI user:", userPart ? userPart.substring(0, 10) + "..." : "undefined");
        console.log("MongoDB URI host:", uriParts[1].split('/')[0]);
      }
    }
    
    // Check if already connected
    console.log("Current connection state:", mongoose.connection.readyState);
    
    if (mongoose.connection.readyState !== 1) {
      console.log("Connecting to MongoDB...");
      await connectDB();
      console.log("MongoDB connection successful!");
    } else {
      console.log("Already connected to MongoDB");
    }
    
    // Test by counting users
    const users = mongoose.models.User;
    let userCount = 0;
    if (users) {
      userCount = await users.countDocuments();
    }
    
    return res.status(200).json({ 
      message: "MongoDB connection successful!",
      readyState: mongoose.connection.readyState,
      userCount,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error("MongoDB connection failed:", error);
    return res.status(500).json({ 
      message: "MongoDB connection failed", 
      error: error.message,
      code: error.code,
      timestamp: new Date().toISOString()
    });
  }
}