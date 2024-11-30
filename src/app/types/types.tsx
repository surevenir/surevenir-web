export type User = {
  id: string;
  full_name: string;
  username: string;
  email: string;
  password: string;
  phone: string | null;
  role: string;
  provider: string;
  longitude: number | null;
  latitude: number | null;
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
  createdAt: string | null;
  updatedAt: string | null;
  images: Image[] | null;
};
