import type { NextApiRequest, NextApiResponse } from "next";
import mongoose from "mongoose";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    console.log("Testing Mongoose connection...");
    
    if (!process.env.MONGODB_URI) {
      return res.status(500).json({ 
        message: "MONGODB_URI environment variable is not set" 
      });
    }
    
    console.log("MONGODB_URI:", process.env.MONGODB_URI.substring(0, 50) + "...");
    
    // Try to connect with more detailed options
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as mongoose.ConnectOptions;
    
    console.log("Attempting connection with Mongoose...");
    await mongoose.connect(process.env.MONGODB_URI, options);
    
    console.log("Connected successfully with Mongoose!");
    
    // Get connection info
    const connection = mongoose.connection;
    const readyState = connection.readyState;
    const readyStateText = [
      'disconnected',
      'connected',
      'connecting',
      'disconnecting'
    ][readyState] || 'unknown';
    
    // List database collections if db is available
    let collections: string[] = [];
    if (connection.db) {
      const collectionsList = await connection.db.listCollections().toArray();
      collections = collectionsList.map(c => c.name);
      console.log("Collections:", collections);
    }
    
    // Close connection
    await mongoose.connection.close();
    
    return res.status(200).json({ 
      message: "Mongoose connection test successful!",
      readyState,
      readyStateText,
      collections
    });
  } catch (error: any) {
    console.error("Mongoose connection test failed:", error);
    return res.status(500).json({ 
      message: "Mongoose connection test failed", 
      error: error.message,
      code: error.code,
      stack: error.stack
    });
  }
}