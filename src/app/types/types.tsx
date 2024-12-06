export type User = {
  id: string;
  full_name: string;
  username: string;
  email: string;
  password: string;
  phone: string | null;
  role: string;
  provider: string;
  longitude: string | null;
  latitude: string | null;
  address: string | null;
  profile_image_url: string | null;
  createdAt: string;
  updatedAt: string;
};

export type Image = {
  id: number;
  item_id: number;
  url: string;
  type: "market" | "product" | "merchant" | "review";
  createdAt: string;
  updatedAt: string;
};

export type Market = {
  id: number;
  slug: string | null;
  name: string;
  description: string;
  profile_image_url: string | null;
  longitude: string;
  latitude: string;
  createdAt: string;
  updatedAt: string;
  images: Image[] | null;
};

export type MarketWithMerchants = {
  id: number;
  slug: string | null;
  name: string;
  description: string;
  profile_image_url: string | null;
  longitude: string;
  latitude: string;
  createdAt: string;
  updatedAt: string;
  images: Image[] | null;
  merchants: Merchant[];
};

export type Merchant = {
  id: number;
  slug: string | null;
  name: string;
  description: string;
  profile_image_url: string | null;
  addresses: string;
  longitude: string;
  latitude: string;
  user_id: string;
  market_id: number;
  createdAt: string;
  updatedAt: string;
  images: Image[] | null;
};

export type MerchantWithProducts = {
  id: number;
  slug: string | null;
  name: string;
  description: string;
  profile_image_url: string | null;
  addresses: string;
  longitude: string;
  latitude: string;
  user_id: string;
  market_id: number;
  createdAt: string;
  updatedAt: string;
  images: Image[] | null;
  products: Product[] | null;
};

export type Category = {
  id: number;
  name: string;
  description: string;
  image_url: string;
  range_price: string;
};

type MarketInMerchant = {
  id: number;
  name: string;
};

type MerchantInProduct = {
  id: number;
  name: string;
  market: MarketInMerchant;
};

type CategoryInProductCategory = {
  id: number;
  name: string;
};

type ProductCategoryInProduct = {
  category: CategoryInProductCategory;
};

export type Product = {
  id: number;
  slug: string | null;
  name: string;
  description: string;
  price: number;
  merchant_id: number;
  stock: number;
  createdAt: string;
  updatedAt: string;
  merchant: MerchantInProduct;
  product_categories: ProductCategoryInProduct[] | null;
  images: Image[] | null;
};

export enum MediaType {
  MARKET = "market",
  MERCHANT = "merchant",
  PRODUCT = "product",
  REVIEW = "review",
}
