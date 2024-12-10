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
  slug: string;
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

type MerchantInProductDetail = {
  id: number;
  name: string;
  slug: string;
  profile_image_url: string;
  market: MarketInMerchant;
};

export type ProductDetail = {
  id: number;
  slug: string | null;
  name: string;
  description: string;
  price: number;
  merchant_id: number;
  stock: number;
  is_favorite: boolean;
  createdAt: string;
  updatedAt: string;
  merchant: MerchantInProductDetail;
  product_categories: ProductCategoryInProduct[] | null;
  images: Image[] | null;
  reviews: Review[] | null;
};

export type ProductInCart = {
  id: number;
  slug: string;
  name: string;
  description: string;
  price: number;
  merchant_id: number;
  stock: number;
  createdAt: string;
  updatedAt: string;
  merchant: MerchantInProduct;
  images: string[] | null;
};

export type CartDetail = {
  id: number;
  slug: string;
  user_id: string;
  product_id: number;
  quantity: number;
  createdAt: string;
  updatedAt: string;
  subtotal_price: number;
  product: ProductInCart;
};

export type Cart = {
  cart: CartDetail[];
  total_price: number;
};

export type Checkout = {
  id: number;
  slug: string;
  user_id: string;
  total_price: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  checkout_details: CheckoutDetail[];
};

export type CheckoutDetail = {
  id: number;
  checkout_id: number;
  product_id: number;
  product_identity: string;
  product_quantity: number;
  product_price: number;
  product_subtotal: number;
  createdAt: string;
  updatedAt: string;
  product: Product;
};

export type Review = {
  id: number;
  rating: number;
  comment: string;
  user_id: string;
  product_id: number;
  createdAt: string;
  updatedAt: string;
  user: User;
  images: string[];
};

type PredictionData = {
  accuration: number;
  result: string;
};

type MerchantProductInPrediction = {
  id: number;
  name: string;
  profile_image_url: string;
};

type ProductInPrediction = {
  id: number;
  slug: string;
  name: string;
  description: string;
  price: number;
  merchant_id: number;
  stock: number;
  createdAt: string;
  updatedAt: string;
  merchant: MerchantProductInPrediction;
  images: string[] | null;
};

export type Predict = {
  prediction: PredictionData;
  category: Category;
  related_products: ProductInPrediction[] | null;
};

export type Histories = {
  id: number;
  slug: string;
  predict: string;
  accuration: number;
  image_url: string;
  createdAt: string;
  updatedAt: string;
  user_id: string;
  category_name: string;
  category_description: string;
  category_range_price: string;
};

export enum MediaType {
  MARKET = "market",
  MERCHANT = "merchant",
  PRODUCT = "product",
  REVIEW = "review",
}
