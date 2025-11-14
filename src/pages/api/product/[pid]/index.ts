import type { NextApiRequest, NextApiResponse } from "next";
import { connectDB } from "@/utils/db";
import Product from "@/models/Product";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;
  const {
    query: { pid },
  } = req;

  try {
    await connectDB();

    switch (method) {
      case 'GET':
        const product = await Product.findById(pid);
        
        if (!product) {
          return res.status(404).json({ message: "Product not found" });
        }
        
        // Format product to match frontend expectations
        const formattedProduct = {
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
        };
        
        res.status(200).json(formattedProduct);
        break;
        
      case 'DELETE':
        // Delete product by ID
        const deletedProduct = await Product.findByIdAndDelete(pid);
        
        if (!deletedProduct) {
          return res.status(404).json({ message: "Product not found" });
        }
        
        res.status(200).json({ message: "Product deleted successfully" });
        break;
        
      default:
        res.setHeader('Allow', ['GET', 'DELETE']);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error: any) {
    console.error("Error handling product request:", error);
    res.status(500).json({ message: "Error handling product request", error: error.message });
  }
}