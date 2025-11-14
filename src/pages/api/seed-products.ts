import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/utils/db";
import Product from "@/models/Product";
import productsData from "@/utils/data/products";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    await connectDB();
    
    // Clear existing products
    await Product.deleteMany({});
    
    // Insert all products from the fake data
    const products = await Product.insertMany(productsData);
    
    res.status(201).json({ 
      message: "Products seeded successfully", 
      count: products.length,
      products: products.map(p => ({
        id: p._id,
        name: p.name,
        price: p.price,
        category: p.category
      }))
    });
  } catch (error: any) {
    console.error("Error seeding products:", error);
    res.status(500).json({ message: "Error seeding products", error: error.message });
  }
}