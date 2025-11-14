import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { email, password } = req.body;

    // Check if admin credentials match environment variables
    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      // In a real application, you would generate a JWT token here
      // For simplicity, we'll just return a success response
      return res.status(200).json({
        success: true,
        message: "Admin login successful"
      });
    } else {
      return res.status(401).json({
        success: false, 
        message: "Invalid admin credentials"
      });
    }
  } catch (error: any) {
    return res.status(500).json({ 
      success: false,
      message: "Internal server error",
      error: error.message 
    });
  }
}