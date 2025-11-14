import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/utils/db";
import Product from "@/models/Product";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only handle POST requests for creating a new product
  if (req.method === "POST") {
    try {
      await connectDB();
      
      const productData = req.body;
      
      // Validate required fields
      if (!productData.name || !productData.price || !productData.category) {
        return res.status(400).json({ 
          message: "Name, price, and category are required" 
        });
      }
      
      const newProduct = new Product(productData);
      const savedProduct = await newProduct.save();
      
      res.status(201).json({ 
        message: "Product created successfully", 
        product: savedProduct 
      });
    } catch (error: any) {
      console.error("Error creating product:", error);
      res.status(500).json({ message: "Error creating product", error: error.message });
    }
  }
  else {
    res.status(405).json({ message: "Method not allowed" });
  }
}