import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/utils/db";

export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
  try {
    await connectDB();
    res.status(200).json({ message: "Database connected successfully" });
  } catch (error: any) {
    console.error("Database connection error:", error);
    res.status(500).json({ 
      message: "Database connection failed", 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}