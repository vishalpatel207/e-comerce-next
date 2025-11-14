import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/utils/db";
import Product from "@/models/Product";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  try {
    await connectDB();
    
    switch (method) {
      case 'GET':
        // Get all products from database (for users)
        const products = await Product.find({});
        // Format products to match frontend expectations
        const formattedProducts = products.map(product => ({
          id: product._id,
          name: product.name,
          price: product.price,
          discount: product.discount,
          quantityAvailable: product.quantityAvailable,
          category: product.category,
          currentPrice: product.currentPrice,
          sizes: product.sizes,
          colors: product.colors,
          images: product.images,
          punctuation: product.punctuation,
          reviews: product.reviews,
          createdAt: product.createdAt,
          updatedAt: product.updatedAt
        }));
        res.status(200).json(formattedProducts);
        break;
      
      case 'POST':
        // Add new product to database (for admin)
        const product = new Product(req.body);
        const savedProduct = await product.save();
        res.status(201).json({
          message: "Product added successfully",
          product: savedProduct,
        });
        break;
      
      default:
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error: any) {
    console.error("Error handling products request:", error);
    res.status(500).json({ message: "Error handling products request", error: error.message });
  }
}
