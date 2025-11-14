import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/utils/db";
import User from "@/models/User";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "DELETE") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    await connectDB();
    
    // Delete all users
    const result = await User.deleteMany({});
    
    return res.status(200).json({ 
      message: "All users cleared successfully", 
      deletedCount: result.deletedCount 
    });
  } catch (error: any) {
    console.error("Error clearing users:", error);
    return res.status(500).json({ message: "Error clearing users", error: error.message });
  }
}