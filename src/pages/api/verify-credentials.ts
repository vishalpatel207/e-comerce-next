import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Check if MONGODB_URI is defined
    if (!process.env.MONGODB_URI) {
      return res.status(500).json({ 
        error: "MONGODB_URI is not defined in environment variables"
      });
    }
    
    // Parse the MongoDB URI to extract components
    const uri = process.env.MONGODB_URI;
    console.log("Full URI:", uri);
    
    // Extract username and password
    const regex = /mongodb\+srv:\/\/([^:]+):([^@]+)@(.*)/;
    const match = uri.match(regex);
    
    if (!match) {
      return res.status(500).json({ 
        error: "Could not parse MongoDB URI",
        uriSample: uri.substring(0, 50) + "..."
      });
    }
    
    const [, username, password, rest] = match;
    
    // Decode the password to check if it's properly encoded
    let decodedPassword = password;
    try {
      decodedPassword = decodeURIComponent(password);
    } catch (e) {
      console.log("Password doesn't need decoding or has invalid encoding");
    }
    
    return res.status(200).json({ 
      message: "URI parsed successfully",
      username: username,
      passwordLength: password.length,
      decodedPasswordLength: decodedPassword.length,
      rest: rest.substring(0, 30) + "...",
      isPasswordEncoded: password !== decodedPassword
    });
  } catch (error: any) {
    console.error("Credentials verification failed:", error);
    return res.status(500).json({ 
      error: error.message,
      stack: error.stack
    });
  }
}