import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/utils/db";
import User from "@/models/User";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    await connectDB();
    
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
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      }))
    });
  } catch (error: any) {
    console.error("Error retrieving users:", error);
    return res.status(500).json({ message: "Error retrieving users", error: error.message });
  }
}