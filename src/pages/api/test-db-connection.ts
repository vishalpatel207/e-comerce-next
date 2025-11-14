import type { NextApiRequest, NextApiResponse } from "next";
import mongoose from "mongoose";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    console.log("Testing MongoDB connection...");
    
    // Log environment info
    console.log("MONGODB_URI exists:", !!process.env.MONGODB_URI);
    
    if (!process.env.MONGODB_URI) {
      return res.status(500).json({ 
        message: "MONGODB_URI environment variable is not set" 
      });
    }
    
    // Try to connect
    console.log("Attempting connection...");
    await mongoose.connect(process.env.MONGODB_URI);
    
    console.log("Connected successfully!");
    
    // Get connection info
    const connection = mongoose.connection;
    const readyState = connection.readyState;
    const readyStateText = [
      'disconnected',
      'connected',
      'connecting',
      'disconnecting'
    ][readyState] || 'unknown';
    
    // Close connection
    await mongoose.connection.close();
    
    return res.status(200).json({ 
      message: "MongoDB connection test successful!",
      readyState,
      readyStateText
    });
  } catch (error: any) {
    console.error("MongoDB connection test failed:", error);
    return res.status(500).json({ 
      message: "MongoDB connection test failed", 
      error: error.message,
      code: error.code
    });
  }
}