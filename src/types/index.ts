export type VotesType = {
  count: number;
  value: number;
  _id?: string;
};

export type PunctuationType = {
  countOpinions: number;
  punctuation: number;
  votes: VotesType[];
  _id?: string;
};

export type ReviewType = {
  name: string;
  avatar: string;
  description: string;
  punctuation: number;
  _id?: string;
};

export type ProductType = {
  id: string;
  name: string;
  price: number;
  discount?: number;
  quantityAvailable: number;
  category: string;
  currentPrice: number;
  sizes: string[];
  colors: string[];
  images: string[];
  punctuation: PunctuationType;
  reviews: ReviewType[];
  createdAt: Date;
  updatedAt: Date;
};

export type ProductTypeList = {
  id: string;
  name: string;
  price: number;
  discount?: number;
  quantityAvailable: number;
  category: string;
  currentPrice: number;
  sizes: string[];
  colors: string[];
  images: string[];
  punctuation: PunctuationType;
  reviews: ReviewType[];
  createdAt: Date;
  updatedAt: Date;
};

export type ProductStoreType = {
  id: string;
  name: string;
  price: number;
  quantityAvailable: number;
  category: string;
  currentPrice: number;
  images: string[];
  colors: string[];
  sizes: string[];
  createdAt: Date;
  updatedAt: Date;
  // Additional properties for cart items
  thumb?: string;
  color?: string;
  size?: string;
  count?: number;
};

export type GtagEventType = {
  action: string;
  category: string;
  label: string;
  value: string;
};