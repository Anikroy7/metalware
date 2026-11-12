export type Garment = "tshirt" | "longsleeve" | "hoodie" | "cap" | "tote" | "poster";

export type Graphic =
  | "wave"
  | "vinyl"
  | "bolt"
  | "sun"
  | "eq"
  | "cassette"
  | "eye"
  | "flame";

export type CategorySlug =
  | "t-shirts"
  | "hoodies"
  | "long-sleeves"
  | "caps"
  | "accessories";

export type Genre =
  | "Heavy Metal"
  | "Thrash"
  | "Classic Rock"
  | "Punk"
  | "Grunge"
  | "Psychedelic";

export type ProductColor = {
  name: string;
  /** Garment fabric color */
  hex: string;
  /** Print / ink color used for the artwork */
  ink: string;
  /** Secondary ink color for artwork highlights */
  accent: string;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  band: string;
  category: CategorySlug;
  genre: Genre;
  price: number;
  compareAtPrice?: number;
  colors: ProductColor[];
  sizes: string[];
  garment: Garment;
  graphic: Graphic;
  description: string;
  details: string[];
  tags: ("new" | "bestseller" | "limited")[];
  rating: number;
  reviews: number;
  stock: number;
};

export type Category = {
  slug: CategorySlug;
  name: string;
  tagline: string;
  garment: Garment;
  graphic: Graphic;
  color: ProductColor;
};

export type CartItem = {
  /** productId + color + size, so the same product in another size is its own line */
  key: string;
  productId: string;
  color: string;
  size: string;
  qty: number;
};

export type CustomerInfo = {
  fullName: string;
  phone: string;
  altPhone: string;
  email: string;
  division: string;
  district: string;
  area: string;
  address: string;
  landmark: string;
  notes: string;
};

export type OrderLine = CartItem & {
  name: string;
  band: string;
  price: number;
};

export type Order = {
  id: string;
  createdAt: string;
  customer: CustomerInfo;
  items: OrderLine[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  paymentMethod: "cod";
  status: "pending" | "confirmed" | "shipped" | "delivered";
};
