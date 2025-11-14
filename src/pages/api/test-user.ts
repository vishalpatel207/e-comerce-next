import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/utils/db";
import User from "@/models/User";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await connectDB();
    
    if (req.method === "POST") {
      // Create a test user
      const newUser = new User({
        firstName: "Test",
        lastName: "User",
        email: `test${Date.now()}@example.com`,
        password: "testpassword"
      });
      
      await newUser.save();
      
      return res.status(201).json({ 
        message: "Test user created successfully", 
        user: {
          id: newUser._id,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          email: newUser.email,
        }
      });
    } else if (req.method === "GET") {
      // Get all users
      const users = await User.find({});
      return res.status(200).json({ 
        message: "Users retrieved successfully", 
        count: users.length,
        users: users.map(user => ({
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
        }))
      });
    } else {
      return res.status(405).json({ message: "Method not allowed" });
    }
  } catch (error: any) {
    console.error("Test user error:", error);
    return res.status(500).json({ 
      message: "Error with test user", 
      error: error.message 
    });
  }
}