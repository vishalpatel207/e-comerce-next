import mongoose, { Document, Schema } from "mongoose";

export interface IProduct extends Document {
  name: string;
  price: number;
  discount?: number;
  quantityAvailable: number;
  category: string;
  currentPrice: number;
  sizes: string[];
  colors: string[];
  images: string[];
  punctuation: {
    countOpinions: number;
    punctuation: number;
    votes: {
      value: number;
      count: number;
    }[];
  };
  reviews: {
    name: string;
    avatar: string;
    description: string;
    punctuation: number;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema: Schema<IProduct> = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    discount: { type: Number },
    quantityAvailable: { type: Number, required: true },
    category: { type: String, required: true },
    currentPrice: { type: Number, required: true },
    sizes: [{ type: String }],
    colors: [{ type: String }],
    images: [{ type: String }],
    punctuation: {
      countOpinions: { type: Number, default: 0 },
      punctuation: { type: Number, default: 0 },
      votes: [{
        value: { type: Number },
        count: { type: Number }
      }]
    },
    reviews: [{
      name: { type: String },
      avatar: { type: String },
      description: { type: String },
      punctuation: { type: Number }
    }]
  },
  { timestamps: true }
);

export default mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema);