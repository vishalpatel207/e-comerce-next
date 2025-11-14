import type { NextApiRequest, NextApiResponse } from "next";
import mongoose from "mongoose";

export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
  try {
    console.log("Debug: Checking MongoDB connection status...");
    
    // Check if MONGODB_URI is defined
    if (!process.env.MONGODB_URI) {
      console.error("MONGODB_URI is not defined");
      return res.status(500).json({ 
        error: "MONGODB_URI is not defined in environment variables",
        envVars: Object.keys(process.env)
      });
    }
    
    console.log("MONGODB_URI is defined");
    
    // Check mongoose connection status
    const connectionStatus = {
      readyState: mongoose.connection.readyState,
      connections: mongoose.connections.length,
      uri: process.env.MONGODB_URI ? process.env.MONGODB_URI.substring(0, 30) + "..." : "undefined"
    };
    
    console.log("Connection status:", connectionStatus);
    
    return res.status(200).json({ 
      message: "Debug info",
      connectionStatus,
      env: {
        hasMongoUri: !!process.env.MONGODB_URI,
        hasJwtSecret: !!process.env.JWT_SECRET
      }
    });
  } catch (error: any) {
    console.error("Debug error:", error);
    return res.status(500).json({ 
      error: error.message,
      stack: error.stack
    });
  }
}